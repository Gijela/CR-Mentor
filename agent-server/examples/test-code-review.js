/**
 * 代码审查功能测试脚本
 */

const { mastra } = require("../dist/mastra");
const { codeReviewAgent, tools } = require("../dist/mastra/codeReviewAgent");

/**
 * 测试代码审查Agent
 */
async function testCodeReviewAgent() {
  console.log("开始测试代码审查Agent...");

  try {
    // 1. 创建开发者档案
    console.log("1. 创建开发者档案...");
    const developerId = "dev_" + Date.now();

    const developerProfile = {
      name: "测试开发者",
      email: "test@example.com",
      skillLevel: "intermediate",
      languages: ["javascript", "typescript", "python"],
      strengths: ["算法设计", "函数式编程"],
      areasToImprove: ["测试", "性能优化"],
    };

    const profileResult = await tools.learningTool.handler({
      action: "updateDeveloperProfile",
      developerId,
      profile: developerProfile,
    });

    console.log("开发者档案创建结果:", profileResult.success ? "成功" : "失败");
    console.log("开发者ID:", developerId);

    // 2. 创建与代码审查Agent的对话
    console.log("\n2. 创建对话...");
    const conversation = await mastra.createConversation({
      agent: codeReviewAgent,
      metadata: {
        title: "代码审查测试",
      },
    });

    // 3. 定义待审查的代码
    const codeToReview = `
/**
 * 数据处理函数
 */
function processData(data) {
  let results = [];
  
  // 遍历数据
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    
    // 验证数据项
    if (item) {
      // 转换数据
      const transformed = transform(item);
      
      // 添加结果
      if (transformed != null) {
        results.push({
          id: item.id || Math.random().toString(36).substring(2, 9),
          value: transformed,
          timestamp: Date.now()
        });
      }
    }
  }
  
  return results;
}

/**
 * 转换数据
 */
function transform(item) {
  // 数据转换
  if (item.type === 'string') {
    return item.value.toUpperCase();
  } else if (item.type === 'number') {
    return item.value * 2;
  } else if (item.type === 'boolean') {
    return !item.value;
  } else {
    // 未知类型，不处理
    return item.value;
  }
}
    `;

    // 4. 发送代码审查请求
    console.log("\n3. 请求代码审查...");
    const message = `请帮我审查以下JavaScript代码，我是开发者ID: ${developerId}:\n\n\`\`\`javascript\n${codeToReview}\n\`\`\``;

    const response = await conversation.sendMessage(message);
    console.log("\n代码审查结果:");
    console.log(response);

    // 5. 提交反馈
    console.log("\n4. 提交反馈...");

    // 获取最新的审查记录
    const reviewResult = await tools.storageTool.handler({
      action: "load",
      type: "review",
    });

    let reviewId = null;

    if (reviewResult.success && Array.isArray(reviewResult.data)) {
      // 获取最新的审查ID
      const reviews = reviewResult.data;
      if (reviews.length > 0) {
        const latestReview = reviews[reviews.length - 1];
        reviewId = latestReview._meta?.id;
      }
    }

    if (reviewId) {
      const feedbackResult = await tools.feedbackTool.handler({
        action: "submit",
        reviewId,
        developerId,
        rating: 4,
        comments: "审查非常有帮助，谢谢！",
        helpful: true,
      });

      console.log("反馈提交结果:", feedbackResult.success ? "成功" : "失败");

      // 6. 获取改进建议
      console.log("\n5. 获取改进建议...");
      const suggestionsResult = await tools.learningTool.handler({
        action: "suggestImprovements",
        developerId,
      });

      console.log(
        "改进建议:",
        suggestionsResult.success ? suggestionsResult.suggestions : "获取失败"
      );
    } else {
      console.log("未找到审查记录，跳过反馈提交");
    }
  } catch (error) {
    console.error("测试过程中出错:", error);
  }
}

// 执行测试
testCodeReviewAgent()
  .then(() => console.log("\n测试完成"))
  .catch((err) => console.error("测试失败:", err));
