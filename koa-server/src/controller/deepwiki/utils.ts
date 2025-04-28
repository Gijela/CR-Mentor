/**
 * 获取 markdown 数据
 * 如果deepwiki 回答未完成,则返回 { isDone: false, content: '' }
 * 如果deepwiki 回答完成,则返回 { isDone: true, content: markdownData }
 */
export const getMarkdownData = async (query_id: string) => {
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
};
