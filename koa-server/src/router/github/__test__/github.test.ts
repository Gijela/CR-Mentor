const GITHUB_TEST_BASE_URL = 'http://localhost:4000/github'; // 请确保您的 Koa 服务器在 4000 端口运行

async function handleApiResponse(fnName: string, response: any) {
  console.log(`\n--- ${fnName} API 响应 ---`);
  console.log(`状态: ${response.status}`);
  if (response.ok) {
    try {
      const data = await response.json();
      console.log("响应数据:");
      console.log(JSON.stringify(data, null, 2));
      // 您可以在此处添加更多关于数据的断言
      if (Array.isArray(data) && data.length > 0) {
        console.log(`成功获取 ${data.length} 个仓库的分析结果。`);
        data.forEach((repoAnalysis: any) => {
          console.log(`  仓库: ${repoAnalysis.owner}/${repoAnalysis.repoName}, 分支: ${repoAnalysis.branchName}, Commits 数量: ${repoAnalysis.commits.length}`);
          if (repoAnalysis.commits.length > 0) {
            const firstCommit = repoAnalysis.commits[0];
            console.log(`    首个 Commit SHA: ${firstCommit.sha}, 消息: "${firstCommit.message.split('\n')[0]}", 文件变更数: ${firstCommit.files.length}`);
            if (firstCommit.files.length > 0) {
              console.log(`      首个 Commit 中的首个文件: ${firstCommit.files[0].filename}, 状态: ${firstCommit.files[0].status}`);
            }
          }
        });
      } else if (Array.isArray(data) && data.length === 0) {
        console.log("未返回数据，这在某些测试情况下可能是符合预期的（例如，指定时间范围内没有 commit）。");
      }
    } catch (e) {
      console.error("解析 JSON 响应时出错:", e);
      const textData = await response.text(); // 作为后备，显示文本数据
      console.error("原始响应文本:", textData);
    }
  } else {
    console.error(`错误状态文本: ${response.statusText}`);
    try {
      const errorData = await response.json(); // 尝试将错误消息解析为 JSON
      console.error("错误数据:");
      console.error(JSON.stringify(errorData, null, 2));
    } catch (e) {
      const errorText = await response.text(); // 如果不是 JSON，则以纯文本显示
      console.error("原始错误文本:", errorText);
    }
  }
  console.log(`--- ${fnName} API 响应结束 ---`);
}

function handleError(fnName: string, error: any) {
  console.error(`\n--- ${fnName} 执行出错 ---`);
  if (error instanceof Error) {
    console.error(`错误信息: ${error.message}`);
    if (error.stack) {
      console.error(`堆栈信息: ${error.stack}`);
    }
  } else {
    console.error(String(error));
  }
  console.log(`--- ${fnName} 错误信息结束 ---`);
}

async function testAnalyzeUserActivity() {
  const fnName = 'analyzeUserActivity';
  console.log(`\n[测试] 调用 ${fnName} 接口...`);

  // --- 硬编码的测试数据 --- 
  // 请将此数据替换为适合您测试的有效值。
  // 确保 `targetUsername` 用户在通过 `process.env.GITHUB_TOKEN` 配置的 Token 可访问的仓库中，
  // 并且在指定的 `timeRange` 内有提交。
  const testPayload = {
    repositories: [
      {
        owner: "gijela", // 示例所有者
        repoName: "cr-mentor", // 示例仓库
        branchName: "main" // 示例分支
      },
      // 如有需要，可添加更多仓库
      // {
      //   owner: "your-org",
      //   repoName: "your-repo",
      //   branchName: "develop"
      // }
    ],
    timeRange: {
      // 大幅扩大时间范围，确保包含所有可能的提交
      since: "2025-05-01T00:00:00Z", // 改为一年前
      until: "2025-05-02T00:00:00Z"  // 改为未来一年
    },
    targetUsername: "Gijela" // 使用正确的大小写形式
  };
  // --- 测试数据结束 --- 

  console.log("测试请求体:", JSON.stringify(testPayload, null, 2));

  try {
    console.log("正在发送请求到:", `${GITHUB_TEST_BASE_URL}/analyzeUserActivity`);
    const response = await fetch(`${GITHUB_TEST_BASE_URL}/analyzeUserActivity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 如果您需要 API 密钥或其他请求头，请在此处添加
      },
      body: JSON.stringify(testPayload),
    });
    console.log("response状态:", response.status, response.statusText);
    await handleApiResponse(fnName, response);
  } catch (error: any) {
    console.error("测试请求发生错误:");
    console.error("错误类型:", typeof error);
    console.error("错误消息:", error.message);
    if (error.stack) {
      console.error("错误堆栈:", error.stack.split('\n').slice(0, 3).join('\n'));
    }
    handleError(fnName, error);
  }
}

async function runTests() {
  console.log('--- 开始 GitHub API 接口测试 ---');

  // 您可以通过使用不同的 payload 多次调用 testAnalyzeUserActivity 
  // 来创建不同的测试用例。
  await testAnalyzeUserActivity();

  // 例如，使用不同的仓库或时间范围进行测试：
  /*
  await testAnalyzeUserActivity({
    repositories: [
      {
        owner: "some-other-owner",
        repoName: "another-repo",
        branchName: "master"
      }
    ],
    timeRange: {
      since: "2024-01-01T00:00:00Z",
      until: "2024-01-31T23:59:59Z"
    },
    targetUsername: "some-contributor"
  });
  */

  console.log('\n--- GitHub API 接口测试完成。 ---');
}

// 在执行此脚本之前，请确保您的 Koa 服务器正在运行并且监听正确的端口 (本例中为 4000)。
// 您可以使用以下命令运行此脚本: node --loader ts-node/esm koa-server/src/router/github/github.test.ts
// (或您项目中用于执行 TypeScript 的命令)

runTests().catch(error => {
  console.error("\n测试执行过程中发生未处理的严重错误:", error);
});

