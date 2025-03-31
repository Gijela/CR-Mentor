/**
 * 代码审查服务
 */

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { codeReviewAgent, tools } from './mastra/codeReviewAgent';
import { mastra } from './mastra';

// 会话存储
const sessions: Record<string, any> = {};

/**
 * 启动代码审查服务
 * @param port 服务端口
 * @returns Express应用实例
 */
export function startCodeReviewService(port: number = 3000) {
  const app = express();

  // 中间件
  app.use(cors());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(express.static('public'));

  // 健康检查
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'CR-Mentor服务正常运行' });
  });

  // 创建会话
  app.post('/api/sessions', async (req, res) => {
    try {
      const { developerId, metadata } = req.body;

      const conversation = await mastra.createConversation({
        agent: codeReviewAgent,
        metadata: {
          title: metadata?.title || '代码审查会话',
          developerId,
          ...metadata
        }
      });

      const sessionId = `session_${Date.now()}`;
      sessions[sessionId] = conversation;

      res.json({
        success: true,
        sessionId,
        message: '会话创建成功'
      });
    } catch (error: any) {
      console.error('创建会话失败:', error);
      res.status(500).json({
        success: false,
        message: `创建会话失败: ${error.message}`
      });
    }
  });

  // 发送消息
  app.post('/api/sessions/:sessionId/messages', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { message } = req.body;

      const conversation = sessions[sessionId];
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: '找不到指定会话'
        });
      }

      const response = await conversation.sendMessage(message);

      res.json({
        success: true,
        response
      });
    } catch (error: any) {
      console.error('发送消息失败:', error);
      res.status(500).json({
        success: false,
        message: `发送消息失败: ${error.message}`
      });
    }
  });

  // 获取开发者资料
  app.get('/api/developers/:developerId', async (req, res) => {
    try {
      const { developerId } = req.params;

      const result = await tools.learningTool.handler({
        action: 'getDeveloperProfile',
        developerId
      });

      if (result.success && result.developerProfile) {
        res.json({
          success: true,
          developer: result.developerProfile
        });
      } else {
        res.status(404).json({
          success: false,
          message: '找不到开发者资料'
        });
      }
    } catch (error: any) {
      console.error('获取开发者资料失败:', error);
      res.status(500).json({
        success: false,
        message: `获取开发者资料失败: ${error.message}`
      });
    }
  });

  // 创建/更新开发者资料
  app.post('/api/developers/:developerId', async (req, res) => {
    try {
      const { developerId } = req.params;
      const profile = req.body;

      const result = await tools.learningTool.handler({
        action: 'updateDeveloperProfile',
        developerId,
        profile
      });

      if (result.success) {
        res.json({
          success: true,
          developer: result.developerProfile
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error: any) {
      console.error('更新开发者资料失败:', error);
      res.status(500).json({
        success: false,
        message: `更新开发者资料失败: ${error.message}`
      });
    }
  });

  // 获取改进建议
  app.get('/api/developers/:developerId/suggestions', async (req, res) => {
    try {
      const { developerId } = req.params;

      const result = await tools.learningTool.handler({
        action: 'suggestImprovements',
        developerId
      });

      if (result.success) {
        res.json({
          success: true,
          suggestions: result.suggestions
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.message
        });
      }
    } catch (error: any) {
      console.error('获取改进建议失败:', error);
      res.status(500).json({
        success: false,
        message: `获取改进建议失败: ${error.message}`
      });
    }
  });

  // 提交反馈
  app.post('/api/reviews/:reviewId/feedback', async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { developerId, rating, comments, helpful } = req.body;

      const result = await tools.feedbackTool.handler({
        action: 'submit',
        reviewId,
        developerId,
        rating,
        comments,
        helpful
      });

      if (result.success) {
        res.json({
          success: true,
          feedbackId: result.feedbackId,
          message: '反馈提交成功'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error: any) {
      console.error('提交反馈失败:', error);
      res.status(500).json({
        success: false,
        message: `提交反馈失败: ${error.message}`
      });
    }
  });

  // 启动服务器
  app.listen(port, () => {
    console.log(`CR-Mentor服务已启动，监听端口: ${port}`);
  });

  return app;
} 