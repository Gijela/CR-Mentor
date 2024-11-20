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
    输入格式必须是包含以下字段的 JSON 字符串：
    - user_name: GitHub 用户名
    - repo_name: 仓库名称
    - pull_number: PR 编号
    - summary: 包含 walkthrough 和 changes 的对象`;

  constructor() {
    super();
  }

  async _call(input: string): Promise<string> {
    console.log("tool input ========>", input);
    if (!input) {
      return "创建 PR 总结失败: 输入不能为空";
    }

    try {
      const { user_name, repo_name, pull_number, summary } = JSON.parse(input) as PRSummaryInput;

      // 格式化评论内容
      const commentBody = `
        ## PR 总结

        ${summary.walkthrough}
        

        ## 变更详情

        ${summary.changes}
      `;

      const token = await createToken(user_name);
      console.log("🚀 ~ CreatePRSummaryTool ~ _call ~ token:", token)

      // 创建 PR 评论
      await axios.post(
        `https://api.github.com/repos/${repo_name}/issues/${pull_number}/comments`,
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