import { Context } from 'koa';
import { processSingleChat } from "@/service/deepwiki/singleChatService";

interface SingleChatRequestBody {
  repo_name: string;
  query_id: string;
  user_prompt: string;
  system_prompt?: string;
}

export async function handleSingleChat(ctx: Context) {
  const { repo_name, query_id, user_prompt, system_prompt } = ctx.request.body as SingleChatRequestBody;

  if (!repo_name || !query_id || !user_prompt) {
    ctx.status = 400;
    ctx.body = { success: false, message: "Missing required fields: repo_name, query_id, user_prompt" };
    return;
  }

  try {
    const result = await processSingleChat({ repo_name, query_id, user_prompt, system_prompt });

    if (result.success) {
      ctx.status = 200;
      // result.data 应该包含 { isDone, content }，其中 content 是结果B
      ctx.body = { success: true, data: result.data };
    } else {
      // 根据错误类型设置合适的 status code
      // 例如，如果 sendMessage 或 pollingResponse 失败，可能是上游服务问题 (502 Bad Gateway)
      // 其他内部处理错误可能是 500 Internal Server Error
      const isUpstreamIssue = result.message?.toLowerCase().includes('send') || result.message?.toLowerCase().includes('polling');
      ctx.status = isUpstreamIssue ? 502 : 500;
      ctx.body = { success: false, message: result.message, data: result.data, error: result.error };
    }
  } catch (error: any) {
    console.error("[handleSingleChat] Unexpected error:", error);
    ctx.status = 500;
    ctx.body = { success: false, message: "Internal server error in singleChat", error: error.message };
  }
} 