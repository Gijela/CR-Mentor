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
    console.log("🚀 ~ 轮询 ~ retryCount:", retryCount, query_id)
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
