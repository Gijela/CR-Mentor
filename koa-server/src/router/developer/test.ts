const BASE_URL = 'http://localhost:4000/developers'; // 更新端口为 4000
const DEVELOPER_ID = 'test_id2'; // 替换为用于测试的有效 developer_id

async function handleApiResponse(fnName: string, response: Response) {
  console.log(`${fnName} Response Status: ${response.status}`);
  if (response.ok) {
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } else {
    const errorData = await response.text();
    console.error(`Error ${fnName}: ${response.statusText}`);
    try {
      console.error(JSON.stringify(JSON.parse(errorData), null, 2));
    } catch {
      console.error(errorData);
    }
  }
}

function handleError(fnName: string, error: any) {
  console.error(`Error in ${fnName}:`);
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(String(error));
  }
}


async function testKpiSummary() {
  const fnName = 'KPI Summary';
  console.log(`\n[TEST] Fetching ${fnName} for developer: ${DEVELOPER_ID}`);
  try {
    const response = await fetch(`${BASE_URL}/dashboard/kpi-summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ developer_id: DEVELOPER_ID }),
    });
    await handleApiResponse(fnName, response);
  } catch (error: any) {
    handleError(fnName, error);
  }
}

async function testInsightTrends(period = '30d', granularity = 'daily') {
  const fnName = 'Insight Trends';
  console.log(`\n[TEST] Fetching ${fnName} for developer: ${DEVELOPER_ID} (period: ${period}, granularity: ${granularity})`);
  try {
    const response = await fetch(`${BASE_URL}/dashboard/insight-trends`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        developer_id: DEVELOPER_ID,
        period,
        granularity,
      }),
    });
    await handleApiResponse(fnName, response);
  } catch (error: any) {
    handleError(fnName, error);
  }
}

async function testProfileStrengths(page = 1, limit = 5) {
  const fnName = 'Profile Strengths';
  console.log(`\n[TEST] Fetching ${fnName} for developer: ${DEVELOPER_ID} (page: ${page}, limit: ${limit})`);
  try {
    const response = await fetch(`${BASE_URL}/profile/strengths`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        developer_id: DEVELOPER_ID,
        page,
        limit,
        sortBy: 'last_seen_at',
        sortOrder: 'desc',
      }),
    });
    await handleApiResponse(fnName, response);
  } catch (error: any) {
    handleError(fnName, error);
  }
}

async function testProfileIssues(page = 1, limit = 5, status = 'active') {
  const fnName = 'Profile Issues';
  console.log(`\n[TEST] Fetching ${fnName} for developer: ${DEVELOPER_ID} (page: ${page}, limit: ${limit}, status: ${status})`);
  try {
    const response = await fetch(`${BASE_URL}/profile/issues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        developer_id: DEVELOPER_ID,
        page,
        limit,
        sortBy: 'last_seen_at',
        sortOrder: 'desc',
        status,
      }),
    });
    await handleApiResponse(fnName, response);
  } catch (error: any) {
    handleError(fnName, error);
  }
}

async function testKnowledgeSnippets(page = 1, limit = 5, topic?: string, q?: string) {
  const fnName = 'Knowledge Snippets';
  console.log(`\n[TEST] Fetching ${fnName} for developer: ${DEVELOPER_ID} (page: ${page}, limit: ${limit}, topic: ${topic || 'all'}, q: ${q || 'none'})`);
  const body: any = {
    developer_id: DEVELOPER_ID,
    page,
    limit,
    sortBy: 'created_at',
    sortOrder: 'desc',
  };
  if (topic) body.topic = topic;
  if (q) body.q = q;

  try {
    const response = await fetch(`${BASE_URL}/knowledge-base/snippets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    await handleApiResponse(fnName, response);
  } catch (error: any) {
    handleError(fnName, error);
  }
}

async function runAllTests() {
  console.log('Starting API tests...');

  await testKpiSummary();
  await testInsightTrends();
  await testInsightTrends('7d', 'daily'); // Test with different params
  await testProfileStrengths();
  await testProfileIssues();
  await testProfileIssues(1, 3, 'resolved'); // Test with different params
  await testKnowledgeSnippets();
  await testKnowledgeSnippets(1, 3, '数据库性能'); // Test with topic
  await testKnowledgeSnippets(1, 3, undefined, 'HNSW'); // Test with query

  console.log('\nAll API tests completed.');
}

// Ensure your Koa server is running on port 4000 before executing this script.
// You can run this script using: node koa-server/src/router/database/test.js
// (If using TypeScript, compile first: tsc koa-server/src/router/database/test.ts)

runAllTests().catch(error => {
  console.error("Unhandled error during tests:", error);
}); 