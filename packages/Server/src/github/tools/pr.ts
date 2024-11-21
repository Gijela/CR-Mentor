import axios, { AxiosHeaders } from "axios";
import { Tool } from "langchain/tools";
import { createToken } from "../utils/createToken";
import { createGithubHeaders } from "../codeReview";

interface PRSummaryInput {
  user_name: string;
  repo_name: string;
  pull_number: string;
  summary: {
    walkthrough: string;
    changes: string;
  }
}

class CreatePRSummaryTool extends Tool {
  name = "create_pr_summary";
  description = `当需要在 GitHub PR 上创建总结评论时使用此工具。
    输入格式必须是包含以下字段的对象：
      "action": "create_pr_summary",
      "action_input": {
        "user_name": "用户名",
        "repo_name": "仓库名",
        "pull_number": "PR编号",
        "summary": {
          "walkthrough": "概述",
          "changes": "变更列表"
        }
      }
    `;

  constructor() {
    super();
  }

  async _call(input: any): Promise<string> {
    console.log("工具输入类型:", typeof input);
    console.log("工具输入内容:", input);
    
    if (!input) {
      return "创建 PR 总结失败: 输入不能为空";
    }

    try {
      const parsedInput = typeof input === 'string' ? JSON.parse(input) : input;
      const data = parsedInput.action_input || parsedInput;
      
      if (!data.user_name || !data.repo_name || !data.pull_number || !data.summary) {
        throw new Error('缺少必要的输入字段');
      }

      // 格式化评论内容
      const commentBody = `
        ## PR 总结

        ${data.summary.walkthrough}
        

        ## 变更详情

        ${data.summary.changes}
      `;

      const token = await createToken(data.user_name);
      console.log("🚀 ~ CreatePRSummaryTool ~ _call ~ token:", token)

      // 创建 PR 评论
      await axios.post(
        `https://api.github.com/repos/${data.repo_name}/issues/${data.pull_number}/comments`,
        {
          body: commentBody
        },
        {
          headers: createGithubHeaders(token) as unknown as AxiosHeaders
        });

      return "PR 总结已创建";
    } catch (error: any) {
      return `创建 PR 总结失败: ${error.message}`;
    }
  }
}

class CreateReviewCommentTool extends Tool {
  name = "create_review_comment";
  description = "用于在特定文件上添加评论的工具";

  async _call(input: string) {
    // 解析输入的 JSON 字符串
    const { filename, content } = JSON.parse(input);

    return JSON.stringify({
      filename,
      content
    });
  }
}

export { CreatePRSummaryTool, CreateReviewCommentTool };