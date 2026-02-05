import { connectorRegistry } from "./connectors";

interface TestResult {
  connector: string;
  configured: boolean;
  testPassed: boolean;
  error?: string;
  details?: string;
}

async function testConnector(key: string): Promise<TestResult> {
  const connector = connectorRegistry.get(key);
  if (!connector) {
    return { connector: key, configured: false, testPassed: false, error: "Connector not found" };
  }

  const isConfigured = connector.isConfigured();
  if (!isConfigured) {
    return { connector: key, configured: false, testPassed: false, error: "Not configured (missing env vars)" };
  }

  try {
    const testResult = await connector.test();
    return {
      connector: key,
      configured: true,
      testPassed: testResult.ok,
      error: testResult.ok ? undefined : testResult.message,
      details: testResult.message,
    };
  } catch (err: any) {
    return {
      connector: key,
      configured: true,
      testPassed: false,
      error: err.message || String(err),
    };
  }
}

async function testAllConnectors() {
  console.log("\n=== CONNECTOR TEST SUITE ===\n");
  
  const allConnectors = connectorRegistry.getAll();
  const results: TestResult[] = [];
  
  for (const info of allConnectors) {
    console.log(`Testing: ${info.name} (${info.key})...`);
    const result = await testConnector(info.key);
    results.push(result);
    
    const status = result.testPassed ? "✓ PASS" : result.configured ? "✗ FAIL" : "○ SKIP";
    console.log(`  ${status}: ${result.details || result.error || "Unknown"}`);
  }

  console.log("\n=== TEST SUMMARY ===\n");
  
  const passed = results.filter(r => r.testPassed);
  const failed = results.filter(r => r.configured && !r.testPassed);
  const skipped = results.filter(r => !r.configured);

  console.log(`Total: ${results.length} connectors`);
  console.log(`Passed: ${passed.length}`);
  console.log(`Failed: ${failed.length}`);
  console.log(`Skipped (not configured): ${skipped.length}`);

  if (failed.length > 0) {
    console.log("\n=== FAILED CONNECTORS ===\n");
    for (const f of failed) {
      console.log(`${f.connector}: ${f.error}`);
    }
  }

  if (skipped.length > 0) {
    console.log("\n=== SKIPPED (NOT CONFIGURED) ===\n");
    for (const s of skipped) {
      console.log(`${s.connector}: ${s.error}`);
    }
  }

  return { passed: passed.length, failed: failed.length, skipped: skipped.length, results };
}

testAllConnectors()
  .then((summary) => {
    console.log("\n=== COMPLETE ===\n");
    process.exit(summary.failed > 0 ? 1 : 0);
  })
  .catch((err) => {
    console.error("Test suite error:", err);
    process.exit(1);
  });
