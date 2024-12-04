// 从url中获取语言lang
export const getLangFromUrl = () => {
  const url = window.location.href;
  const match = url.match(/\/(\w{2})\/dashboard/);
  return match ? match[1] : "en"; // 默认返回'en'
};

// 获取dify知识库列表
export const getDifyKnowledges = async (difyBaseUrl: string, difyApiKey: string) => {
  try {
    const response = await fetch(`${difyBaseUrl}/datasets?page=1&limit=100`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${difyApiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("获取知识库列表失败");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("获取知识库列表时出错:", error);
    return [];
  }
};

// 处理 Github App 的安装回调 code, 将 github_id 保存到 clerk user metadata 中
export const handleInstall = async (installation_id: string, userId: string, language: string) => {
  console.log("🚀 ~ handleInstall ~ 调用了");

  const response = await fetch(`/api/github/getUserInfo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ installation_id, userId, language }),
  });

  const { success, data, msg } = await response.json();

  return { success, msg, data };
};

// 获取 Github 仓库列表
export const getRepos = async (githubId: string) => {
  try {
    // 1. 生成 token
    const tokenResponse = await fetch(`/api/github/createToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ githubId }),
    });

    const { success: tokenSuccess, token, account } = await tokenResponse.json();
    if (!tokenSuccess) {
      return { success: false, message: '生成 token 失败' };
    }

    // 2. 获取所有仓库列表
    let allRepos = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const reposResponse = await fetch(`/api/github/getRepos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          repos_url: `${account.repos_url}?page=${page}&per_page=100`
        }),
      });

      const { success: reposSuccess, data } = await reposResponse.json();
      if (!reposSuccess) {
        return { success: false, message: '获取仓库列表失败' };
      }

      allRepos = allRepos.concat(data);

      if (data.length < 100) {
        hasNextPage = false;
      } else {
        page++;
      }
    }

    return { success: true, data: allRepos };

  } catch (error) {
    return { success: false, message: error };
  }
}
