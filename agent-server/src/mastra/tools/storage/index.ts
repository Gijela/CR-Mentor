/**
 * 持久化存储工具
 * 提供审查历史和知识库的存储功能
 */

import fs from 'fs';
import path from 'path';
import { Tool } from '@mastra/core/tool';
import { StorageParams, StorageResult } from './types';

// 存储目录
const STORAGE_DIR = path.join(process.cwd(), '.storage');

// 确保存储目录存在
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

/**
 * 存储工具
 * 提供审查历史和知识库的存储功能
 */
export const storageTool = new Tool({
  name: 'storage',
  description: '存储和获取审查历史和知识库数据',
  parameters: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        description: '存储操作类型',
        enum: ['save', 'load', 'delete', 'list']
      },
      type: {
        type: 'string',
        description: '数据类型',
        enum: ['review', 'learning', 'developer', 'knowledge']
      },
      id: {
        type: 'string',
        description: '数据ID'
      },
      data: {
        type: 'object',
        description: '要存储的数据'
      }
    },
    required: ['action', 'type']
  },
  handler: async ({ action, type, id, data }: StorageParams) => {
    try {
      // 目录路径
      const typeDir = path.join(STORAGE_DIR, type);
      if (!fs.existsSync(typeDir)) {
        fs.mkdirSync(typeDir, { recursive: true });
      }

      // 文件路径
      const filePath = id ? path.join(typeDir, `${id}.json`) : '';

      // 执行存储操作
      if (action === 'save' && data) {
        // 生成ID (如果没有提供)
        const dataId = id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const dataFilePath = path.join(typeDir, `${dataId}.json`);

        // 添加元数据
        const dataWithMeta = {
          ...data,
          _meta: {
            id: dataId,
            type,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        };

        // 写入文件
        fs.writeFileSync(dataFilePath, JSON.stringify(dataWithMeta, null, 2));

        return {
          success: true,
          action,
          type,
          id: dataId,
          message: `${type} 数据已保存`
        };
      }

      if (action === 'load') {
        if (id) {
          // 加载单个文件
          if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf-8');
            return {
              success: true,
              action,
              type,
              id,
              data: JSON.parse(fileData)
            };
          } else {
            return {
              success: false,
              action,
              type,
              id,
              message: `找不到 ${type} 数据: ${id}`
            };
          }
        } else {
          // 加载所有文件
          const files = fs.readdirSync(typeDir).filter(file => file.endsWith('.json'));
          const allData = files.map(file => {
            const fileData = fs.readFileSync(path.join(typeDir, file), 'utf-8');
            return JSON.parse(fileData);
          });

          return {
            success: true,
            action,
            type,
            data: allData
          };
        }
      }

      if (action === 'delete' && id) {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          return {
            success: true,
            action,
            type,
            id,
            message: `${type} 数据已删除: ${id}`
          };
        } else {
          return {
            success: false,
            action,
            type,
            id,
            message: `找不到 ${type} 数据: ${id}`
          };
        }
      }

      if (action === 'list') {
        const files = fs.readdirSync(typeDir).filter(file => file.endsWith('.json'));
        const itemIds = files.map(file => path.basename(file, '.json'));

        return {
          success: true,
          action,
          type,
          ids: itemIds,
          message: `${type} 数据列表获取成功`
        };
      }

      // 默认返回错误
      return {
        success: false,
        action,
        type,
        message: '无效的存储操作'
      };
    } catch (error: any) {
      console.error('存储操作出错:', error);
      return {
        success: false,
        action,
        type,
        id,
        message: `存储操作失败: ${error.message}`
      };
    }
  }
}); 