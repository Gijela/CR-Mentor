import { sendMessage, pollingResponse } from "@/controller/deepwiki/utils";

interface SingleChatParams {
  repo_name: string;
  query_id: string;
  user_prompt: string;
  system_prompt?: string;
}

// 假设 pollingResponse 返回的类型结构
interface PollingData {
  isDone: boolean;
  content: string;
  // 根据实际 pollingResponse 返回结果添加其他字段
}

// 这个接口描述的是 sendMessage 成功时预期的结构，或者如果它也用 success 字段来指示错误
interface SendMessageResult {
  success: boolean;
  status?: number;
  data?: any; // sendMessage 成功时可能包含的 data
  detail?: string; // sendMessage 失败时可能直接返回 detail
}

// 更新返回类型，允许 data 字段在错误时承载 sendMessage 的原始错误响应
export async function processSingleChat(params: SingleChatParams): Promise<{ success: boolean; data?: PollingData | SendMessageResult | object; message?: string; error?: any }> {
  const { repo_name, query_id, user_prompt, system_prompt } = params;

  try {
    // 1. 处理可选的 system_prompt
    if (system_prompt) {
      console.log(`[== singleChatService system_prompt ==] Sending system prompt for query_id: ${query_id}`);
      const sendSystemResult = await sendMessage(repo_name, system_prompt, query_id) as any; // 使用 any 避免严格类型检查问题，因为错误结构未知

      // 检查 sendMessage 是否成功。基于之前的日志，错误时它返回 { detail: '...' }
      // 成功的 sendMessage 可能有一个 status 字段或一个明确的 success: true
      // 这里我们假设如果存在 detail 字段，则表示失败
      if (sendSystemResult && sendSystemResult.detail) { // 直接检查 detail 字段指示错误
        console.error(`[singleChatService] Failed to send system prompt for query_id: ${query_id}. Response:`, sendSystemResult);
        return { success: false, message: 'Failed to send system prompt', data: sendSystemResult };
      }
      // 可选：如果 sendMessage 成功时有特定结构（例如 success: true），也可以在这里检查
      // if (!sendSystemResult || !sendSystemResult.success) { ... }

      const systemPollResponse = await pollingResponse(query_id) as PollingData;
      if (!systemPollResponse || !systemPollResponse.isDone) {
        console.warn(`[singleChatService] Polling system prompt for query_id: ${query_id} did not complete or failed. Response:`, systemPollResponse);
        return { success: false, message: 'Polling system prompt failed or did not complete', data: systemPollResponse };
      }
    }

    // 2. 发送 user_prompt
    console.log(`[== singleChatService user_prompt ==] Sending user_prompt for query_id: ${query_id}`);
    const sendUserResult = await sendMessage(repo_name, user_prompt, query_id); // 使用 any
    if (sendUserResult && sendUserResult.detail) { // 直接检查 detail 字段指示错误
      console.error(`[singleChatService] Failed to send user prompt for query_id: ${query_id}. Response:`, sendUserResult);
      return { success: false, message: 'Failed to send user prompt', data: sendUserResult };
    }
    // 可选：进一步的成功检查
    // if (!sendUserResult || !sendUserResult.success) { ... }

    // 3. 轮询最终结果 (结果B)
    const finalPollResponse = await pollingResponse(query_id) as PollingData;
    if (!finalPollResponse || !finalPollResponse.isDone) {
      console.error(`[singleChatService] Polling final response for query_id: ${query_id} did not complete or failed. Response:`, finalPollResponse);
      return { success: false, message: 'Polling final response failed or did not complete', data: finalPollResponse };
    }

    return { success: true, data: finalPollResponse }; // 返回包含 content 的 finalPollResponse

  } catch (error: any) {
    console.error(`[singleChatService] Error in processSingleChat for query_id ${query_id}:`, error);
    return { success: false, message: error.message || 'Error processing single chat', error: error.toString() };
  }
} 