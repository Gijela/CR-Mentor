import type Koa from "koa"
import { getMarkdownData } from "./utils";

/**
 * 发送消息
 */
export const sendMessage = async (ctx: Koa.Context) => {
  try {
    const { repo_name, user_prompt, query_id } = ctx.request.body as { repo_name: string, user_prompt: string, query_id: string };

    const response = await fetch('https://api.devin.ai/ada/query', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'content-type': 'application/json',
        'origin': 'https://deepwiki.com',
        'referer': 'https://deepwiki.com/',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        engine_id: "multihop",
        user_query: `<relevant_context>This query was sent from the wiki page: ${repo_name.split('/')[1]} Overview.</relevant_context> ${user_prompt}`,
        keywords: [],
        repo_names: [repo_name],
        additional_context: "",
        query_id: query_id,
        use_notes: false,
        generate_summary: false
      })
    });

    const data = await response.json();
    ctx.body = { success: true, data: data }
  } catch (error) {
    console.error("🚀 ~ deepwiki ~ sendMessage ~ error:", error)
    ctx.status = 500
    ctx.body = { success: false, message: "failed to send message", error }
  }
}

/**
 * 获取结果, 轮训获取, 直到获取 deepwiki 完整结果
 */
export const getResult = async (ctx: Koa.Context) => {
  try {
    const { query_id } = ctx.request.body as { query_id: string };

    if (!query_id) {
      ctx.status = 400
      ctx.body = { success: false, message: "query_id is required" }
      return
    }

    // 轮训获取
    let data: { isDone: boolean; content: string } = {
      isDone: false,
      content: '',
    };
    let retryCount = 0;
    const maxRetries = 150; // 最多重试150次
    const retryInterval = 2000; // 每次重试间隔2秒

    while (retryCount < maxRetries) {
      data = await getMarkdownData(query_id);

      if (data.isDone) {
        break;
      }

      // 等待一段时间后重试
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
      retryCount++;
    }

    if (!data.isDone) {
      ctx.status = 408
      ctx.body = { success: false, data, error: 'Response timeout' }
      return
    }

    ctx.status = 200
    ctx.body = { success: true, data }
  } catch (error) {
    console.error("🚀 ~ getResult ~ error:", error)
    ctx.status = 500
    ctx.body = { success: false, message: "failed to get result", error }
  }
}
