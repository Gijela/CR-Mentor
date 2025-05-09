import { generateUUID } from "@/controller/deepwiki/utils";
const DEEPWIKI_TEST_BASE_URL = 'http://localhost:4000/deepwiki'; // Ensure Koa server is running on port 4000

// Helper function to log and handle API responses
async function handleDeepWikiApiResponse(fnName: string, response: Response, testCaseDesc: string) {
  console.log(`\n--- [${fnName} - ${testCaseDesc}] API Response ---`);
  console.log(`Status: ${response.status}`);
  if (response.ok) {
    try {
      const data = await response.json();
      console.log("Response Data:");
      console.log(JSON.stringify(data, null, 2));
      if (data.success && data.data && typeof data.data.content === 'string') {
        console.log(`Test Passed: ${testCaseDesc} - Successfully received content.`);
      } else {
        console.error(`Test Failed: ${testCaseDesc} - Response format incorrect or success is false.`, data);
      }
    } catch (e) {
      console.error(`Test Failed: ${testCaseDesc} - Error parsing JSON response:`, e);
      const textData = await response.text();
      console.error("Raw Response Text:", textData);
    }
  } else {
    console.error(`Test Failed: ${testCaseDesc} - Error Status Text: ${response.statusText}`);
    try {
      const errorData = await response.json();
      console.error("Error Data:");
      console.error(JSON.stringify(errorData, null, 2));
    } catch (e) {
      const errorText = await response.text();
      console.error("Raw Error Text:", errorText);
    }
  }
  console.log(`--- [${fnName} - ${testCaseDesc}] API Response End ---`);
}

// Helper function to log errors during test execution
function handleDeepWikiError(fnName: string, error: any, testCaseDesc: string) {
  console.error(`\n--- [${fnName} - ${testCaseDesc}] Execution Error ---`);
  if (error instanceof Error) {
    console.error(`Error Message: ${error.message}`);
    if (error.stack) {
      console.error(`Stack Trace: ${error.stack}`);
    }
  } else {
    console.error(String(error));
  }
  console.log(`--- [${fnName} - ${testCaseDesc}] Error Info End ---`);
}

// Test function for the /singleChat endpoint
async function testSingleChat() {
  const fnName = 'testSingleChat';

  // Test Case 1: Without system_prompt
  const testCase1Desc = 'Without system_prompt';
  console.log(`\n[Test] Calling /singleChat endpoint (${testCase1Desc})...`);
  const payload1 = {
    repo_name: "Gijela/CR-Mentor",
    query_id: generateUUID(), // Use a unique ID or one that can be reset/ignored by the backend for tests
    user_prompt: "Hello, this is a test user prompt.",
  };
  console.log("Request Payload:", JSON.stringify(payload1, null, 2));
  try {
    const response = await fetch(`${DEEPWIKI_TEST_BASE_URL}/singleChat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload1),
    });
    // await handleDeepWikiApiResponse(fnName, response, testCase1Desc);
    console.log("🚀 ~ testSingleChat ~ response:", response)
  } catch (error: any) {
    handleDeepWikiError(fnName, error, testCase1Desc);
  }

  // Test Case 2: With system_prompt
  const testCase2Desc = 'With system_prompt';
  console.log(`\n[Test] Calling /singleChat endpoint (${testCase2Desc})...`);
  const payload2 = {
    repo_name: "Gijela/CR-Mentor",
    query_id: generateUUID(), // Use a different unique ID for this test
    user_prompt: "Another user prompt here.",
    system_prompt: "You are a helpful assistant for testing purposes.",
  };
  console.log("Request Payload:", JSON.stringify(payload2, null, 2));
  try {
    const response = await fetch(`${DEEPWIKI_TEST_BASE_URL}/singleChat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload2),
    });
    await handleDeepWikiApiResponse(fnName, response, testCase2Desc);
  } catch (error: any) {
    handleDeepWikiError(fnName, error, testCase2Desc);
  }
}

async function runDeepWikiTests() {
  console.log('--- Starting DeepWiki API Endpoint Tests ---');
  await testSingleChat();
  // Add calls to other test functions for deepwiki here
  console.log('\n--- DeepWiki API Endpoint Tests Complete. ---');
}

// To run this test script:
// 1. Ensure your Koa server (with the deepwiki routes) is running, typically on http://localhost:4000.
// 2. Execute this file using a TypeScript runner, for example:
//    node --loader ts-node/esm koa-server/src/router/deepwiki/__test__/deepwiki.test.ts
//    (Adjust the command based on your project's setup for running TypeScript files)

runDeepWikiTests().catch(error => {
  console.error("\nUnhandled critical error during test execution:", error);
});
