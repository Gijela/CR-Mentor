const DEEPWIKI_TEST_BASE_URL = 'http://localhost:4000/deepwiki'

const testPayload = {
  repositories: [
    {
      owner: "gijela", // 示例所有者
      repoName: "cr-mentor", // 示例仓库
      branchName: "main" // 示例分支
    },
  ],
  timeRange: {
    // 大幅扩大时间范围，确保包含所有可能的提交
    since: "2025-05-01T00:00:00Z", // 改为一年前
    until: "2025-05-02T00:00:00Z"  // 改为未来一年
  },
  targetUsername: "Gijela" // 使用正确的大小写形式
};

async function testGetCommitResult() {
  const result = await fetch(`${DEEPWIKI_TEST_BASE_URL}/getCommitResult`, {
    method: 'POST',
    body: JSON.stringify(testPayload)
  })
  const data = await result.json()
  console.log('====testGetCommitResult===', data)
}

testGetCommitResult()