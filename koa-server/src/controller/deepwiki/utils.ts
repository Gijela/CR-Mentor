import { EDIT_TYPE } from "@/lib/groupDiff/types";
import { FileObject } from "../github/types";
import { formatAndGroupDiff } from "@/lib/groupDiff";

/**
 * 生成一个唯一的 UUID
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 发送消息
 * @param {string} repo_name 仓库名称 Gijela/CR-Mentor
 * @param {string} user_prompt 用户提示
 * @param {string} query_id 查询ID
 * @returns 
 */
export const sendMessage = async (repo_name: string, user_prompt: string, query_id: string) => {
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
  return data
}

/**
 * 获取 markdown 数据
 * 如果deepwiki 回答未完成,则返回 { isDone: false, content: '' }
 * 如果deepwiki 回答完成,则返回 { isDone: true, content: markdownData }
 */
export const getMarkdownData = async (query_id: string) => {
  // try {
  // --- 获取外部 API 的流 ---
  const response = await fetch(`https://api.devin.ai/ada/query/${query_id}`, {
    method: 'GET',
    headers: {
      accept: 'application/json', // 或者可能是 text/event-stream，取决于 devin.ai 返回什么
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'cache-control': 'no-cache',
      origin: 'https://deepwiki.com',
      pragma: 'no-cache',
      referer: 'https://deepwiki.com/',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
    },
  });

  const data = await response.json();
  // 获取最后一个查询
  const lastItem = data.queries?.[data.queries.length - 1];
  // 判断最后一个查询是否完成, 如果未完成则返回空字符串
  const isDone =
    lastItem?.response?.[lastItem?.response?.length - 1]?.type === 'done';
  if (!isDone) {
    return { isDone: false, content: '' };
  }

  // 获取最后一个查询的 markdown 数据
  let markdownData = '';
  lastItem.response.forEach((item: any) => {
    if (item.type === 'chunk') {
      markdownData += item.data;
    }
  });
  return { isDone: true, content: markdownData };
  // } catch (error) {
  //   // 获取失败, 证明着已经达到当前 query_id 对应会话的上下文限制。
  //   // 简单测试了一下字符限制是 4*50000, 每轮最大限制字符 50000, 最多能询问四次, 第五次就会报错
  //   // 所以需要重新创建一个 query_id, 这里不捕获错误, 由上层去捕获这个错误然后创建一个新会话
  //   console.error("🚀 ~ deepwiki ~ getMarkdownData ~ error:", error)
  //   return { isDone: false, content: '', reachLimit: true };
  // }
};

/**
 * 获取最终结果
 * 轮询, 直到得到 deepwiki 完整结果才结束
 */
export const pollingResponse = async (query_id: string) => {
  if (!query_id) {
    return { isDone: false, content: '', error: 'query_id is required' }
  }

  // 轮询获取
  let data: { isDone: boolean; content: string } = {
    isDone: false,
    content: '',
  };
  let retryCount = 0;
  const maxRetries = 150; // 最多重试150次
  const retryInterval = 2000; // 每次重试间隔2秒

  while (retryCount < maxRetries) {
    console.log("🚀 ~ 轮询 ~ retryCount:", retryCount)
    data = await getMarkdownData(query_id);

    if (data.isDone) {
      break;
    }

    // 等待一段时间后重试
    await new Promise((resolve) => setTimeout(resolve, retryInterval));
    retryCount++;
  }

  if (!data.isDone) {
    return { isDone: false, content: '', error: 'Response timeout' }
  }

  return data
}


// 辅助函数：发送 System Prompt 并等待响应
export async function initializeSessionWithSystemPrompt(
  repo_name: string,
  systemPrompt: string,
  query_id: string,
  logPrefix: string = "" // 可选的日志前缀，用于区分调用场景
): Promise<{ success: boolean, message: string, content: string, error?: any }> {
  console.log(`${logPrefix}🚀 ~ 使用 Query ID (${query_id}) 发送 System Prompt...`);
  try {
    const sendResult = await sendMessage(repo_name, systemPrompt, query_id);
    if (!sendResult || !sendResult?.status) {
      console.error(`${logPrefix}🚨 ~ 发送 System Prompt (Query ID: ${query_id}) 失败: sendMessage returned falsy.`);
      return { success: false, message: 'failed to send message', content: '' }; // 发送失败
    }
    console.log(`${logPrefix}   ~ System Prompt (Query ID: ${query_id}) 发送成功, 开始轮询...`);

    const { isDone, content } = await pollingResponse(query_id);
    if (!isDone) {
      console.warn(`${logPrefix}⚠️ ~ 轮询 System Prompt (Query ID: ${query_id}) 失败: pollingResponse returned falsy.`);
      // 注意：即使轮询失败，对于重试场景，我们可能仍希望继续。
      // 但对于初始场景，这通常表示失败。调用者需要根据返回值决定如何处理。
      return { success: false, message: 'failed to polling response', content: '' }; // 轮询失败/无结果
    }
    console.log(`${logPrefix}   ~ System Prompt (Query ID: ${query_id}) 处理完成.`);
    return { success: true, message: 'success', content }; // 成功
  } catch (error: any) {
    console.error(`${logPrefix}🚨 ~ 处理 System Prompt (Query ID: ${query_id}) 时发生异常:`, error);
    return { success: false, message: 'failed to initialize session with system prompt', content: '', error }; // 发生异常
  }
}


const modelMaxToken = 25 * 1000

/**
 * 调用 deepwiki 获取结果
 * @param {string} repo_name 仓库名称 Gijela/CR-Mentor
 * @param {FileObject[]} rowPatches 补丁数组
 * @param {string} systemPrompt 系统 prompt
 * @returns {Promise<string[]>} 结果数组
 */
export const callDeepWiki = async (
  repo_name: string,
  rowPatches: FileObject[],
  systemPrompt: string
): Promise<{ success: boolean, message: string, chatResults: string[], deletedFiles: string[] }> => {
  let currentQueryId = generateUUID()
  const queryIdsUsed: string[] = [currentQueryId]
  const chatResults: string[] = []
  const MAX_RETRIES_PER_PATCH = 1; // 每个 patch 最多重试1次 (总共尝试 1 + 1 = 2次)
  const retryCounts: { [key: number]: number } = {}; // 记录每个 patch 的重试次数

  // 0. 将 github diff 分组
  const diffFiles = rowPatches.map(file => ({
    ...file,
    patch: file.status === EDIT_TYPE.DELETED ? null : file.patch,
  })) as FileObject[];
  const { patches, deletedFiles } = formatAndGroupDiff(modelMaxToken, diffFiles, systemPrompt);

  console.log("🚀 ~ callDeepWiki ~ repo_name:", repo_name, "rowPatches.length:", rowPatches.length, "patches.length:", patches.length)

  // 1. 使用初始 Query ID 初始化会话
  const { success: initialSessionOk } = await initializeSessionWithSystemPrompt(repo_name, systemPrompt, currentQueryId, "[初始会话] ");
  if (!initialSessionOk) {
    console.error("🚨 ~ 初始化会话失败 (发送或轮询初始 System Prompt 出错).");
    return { success: false, message: 'failed to initialize session with system prompt', chatResults: [], deletedFiles }
  }

  // 2. 遍历 patches，依次发送消息并获取结果 (允许重试)
  console.log("🚀 ~ 开始处理 Patches...");
  const CALL_PATCH_REVIEW = 'Please follow the requirements to review the multiple file diff code provided below.'
  for (let i = 0; i < patches.length; i++) {
    const patch = CALL_PATCH_REVIEW + patches[i];
    const currentAttempt = (retryCounts[i] || 0) + 1;
    console.log(`======  🚀 ~ 处理 Patch ${i + 1}/${patches.length} (Attempt ${currentAttempt} using Query ID: ${currentQueryId}) patchLength: ${patch.length} ======`)

    try {
      // 2.1 发送当前 patch
      const sendResultData = await sendMessage(repo_name, patch, currentQueryId)
      if (!sendResultData) {
        console.error(`🚀 ~ 发送 Patch ${i + 1} (Attempt ${currentAttempt}, query_id: ${currentQueryId}) 失败: sendMessage returned falsy`)
        throw new Error("Send message returned falsy");
      }
      console.log(`🚀 ~ 发送 Patch ${i + 1} (Attempt ${currentAttempt}) 成功`)

      // 2.2 轮询获取当前 patch 的结果
      const pollingResultData = await pollingResponse(currentQueryId)
      console.log(`🚀 ~ 轮询 Patch ${i + 1} (Attempt ${currentAttempt}) 结束:`, pollingResultData ? '有数据' : '无数据')
      if (!pollingResultData) {
        console.error(`🚀 ~ 轮询 Patch ${i + 1} (Attempt ${currentAttempt}, query_id: ${currentQueryId}) 失败: pollingResponse returned falsy`)
        throw new Error("Polling response returned falsy");
      }

      // 存储当前 patch 的结果
      chatResults.push(pollingResultData.content || '')
      console.log("🚀 ~ 当前 chatResults 数量:", chatResults.length)
      // 成功处理，不需要重试，循环会自然进入下一轮 i++

    } catch (error) {
      // 捕获 pollingResponse 或上面抛出的错误
      console.warn(`🚀 ~ 处理 Patch ${i + 1} (Attempt ${currentAttempt}, query_id: ${currentQueryId}) 捕获异常:`, error)

      retryCounts[i] = (retryCounts[i] || 0) + 1;

      if (retryCounts[i] <= MAX_RETRIES_PER_PATCH) {
        // 如果还没达到最大重试次数
        const previousQueryId = currentQueryId; // 保存旧 ID 用于日志
        currentQueryId = generateUUID()
        queryIdsUsed.push(currentQueryId)
        console.log(`   ~ 创建新的 Query ID: ${currentQueryId} 用于重试 Patch ${i + 1} (旧 ID: ${previousQueryId})`)

        // === 使用新 Query ID 初始化会话 (用于重试) ===
        const { success: retrySessionOk } = await initializeSessionWithSystemPrompt(repo_name, systemPrompt, currentQueryId, "[重试会话] ");
        if (!retrySessionOk) {
          // 即使 System Prompt 初始化失败，仍然尝试发送 patch
          console.warn(`   ~ [重试会话] 初始化失败，但仍将继续尝试发送 Patch ${i + 1} (Query ID: ${currentQueryId})`);
        } else {
          console.log(`   ~ [重试会话] 初始化成功 (Query ID: ${currentQueryId}).`);
        }
        // === 初始化结束 ===

        i--; // 减少 i，以便下次循环重试当前 patch
        console.log(`   ~ 将使用新的 Query ID (${currentQueryId}) 重试 Patch ${i + 2}`)

      } else {
        // 达到最大重试次数
        console.error(`❌ ~ Patch ${i + 1} 达到最大重试次数 (${MAX_RETRIES_PER_PATCH}). 跳过此 patch.`);
      }
    }
  }

  // 3. 所有 patches 处理完成 (可能部分跳过)，返回聚合结果和所有 query_id
  console.log("✅ ~ 所有 Patches 处理完成", `共${chatResults.length}个 patches, 共${deletedFiles.length}个 deletedFiles`)

  return { success: true, message: 'success', chatResults, deletedFiles }
}