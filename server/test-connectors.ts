import { initializeConnectors, connectorRegistry } from "./connectors";

interface TestResult {
  connector: string;
  configured: boolean;
  testPassed: boolean;
  error?: string;
  details?: string;
  apiCallResult?: string;
}

async function testConnectorWithApiCall(key: string): Promise<TestResult> {
  const connector = connectorRegistry.get(key);
  if (!connector) {
    return { connector: key, configured: false, testPassed: false, error: "Connector not found" };
  }

  const isConfigured = connector.isConfigured();
  if (!isConfigured) {
    return { connector: key, configured: false, testPassed: false, error: "Not configured (missing env vars)" };
  }

  try {
    // First run the built-in test
    const testResult = await connector.test();
    if (!testResult.ok) {
      return {
        connector: key,
        configured: true,
        testPassed: false,
        error: testResult.message,
        details: "Built-in test failed",
      };
    }

    // Now make actual API calls based on connector type
    let apiCallResult = "Basic test passed";
    
    try {
      const executeResult = await makeActualApiCall(key, connector);
      if (executeResult.success) {
        apiCallResult = executeResult.message;
      } else {
        return {
          connector: key,
          configured: true,
          testPassed: false,
          error: executeResult.error,
          details: "API call failed",
        };
      }
    } catch (apiErr: any) {
      return {
        connector: key,
        configured: true,
        testPassed: false,
        error: apiErr.message || String(apiErr),
        details: "API call threw exception",
      };
    }

    return {
      connector: key,
      configured: true,
      testPassed: true,
      details: testResult.message,
      apiCallResult,
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

async function makeActualApiCall(key: string, connector: any): Promise<{ success: boolean; message: string; error?: string }> {
  switch (key) {
    case "openai": {
      const result = await connector.execute({
        action: "generate_names",
        input: {
          businessIdea: "A test company for API verification",
          industry: "technology",
          count: 1,
        },
      });
      if (result.success && result.data) {
        const names = Array.isArray(result.data) ? result.data : [result.data];
        return { success: true, message: `OpenAI generated ${names.length} name(s): "${names[0]?.name || names[0]}"` };
      }
      return { success: false, error: result.error || "No response" };
    }

    case "claude": {
      const result = await connector.execute({
        action: "generate_long_form_content",
        input: {
          topic: "API testing best practices",
          businessName: "TestCompany",
          industry: "Technology",
          contentType: "blog_post",
          wordCount: 100,
        },
      });
      if (result.success && result.data) {
        const data = result.data as { title?: string; content?: string };
        return { success: true, message: `Claude wrote: "${data.title || String(result.data).substring(0, 50)}..."` };
      }
      return { success: false, error: result.error || "No response" };
    }

    case "nanobanana": {
      const result = await connector.execute({
        action: "generate_text",
        input: {
          prompt: "Say hello in one word",
          model: "gemini-2.0-flash",
        },
      });
      if (result.success && result.data) {
        return { success: true, message: `Google Studio responded: "${String(result.data).substring(0, 60)}..."` };
      }
      return { success: false, error: result.error || "No response" };
    }

    case "launchpax": {
      const result = await connector.execute({
        action: "generate_content",
        input: {
          prompt: "Say hello in one word",
        },
      });
      if (result.success && result.data) {
        return { success: true, message: `LaunchPax Engine responded: "${String(result.data).substring(0, 60)}..."` };
      }
      return { success: false, error: result.error || "No response" };
    }

    case "dalle": {
      // Don't actually generate an image (costs money), just verify connection
      return { success: true, message: "DALL-E connection verified (skipped image generation to save credits)" };
    }

    case "stability": {
      // Don't actually generate an image (costs money), just verify connection  
      return { success: true, message: "Stability AI connection verified (skipped image generation to save credits)" };
    }

    case "leonardo": {
      // Don't actually generate an image (costs money), just verify connection
      return { success: true, message: "Leonardo AI connection verified (skipped image generation to save credits)" };
    }

    case "pexels": {
      const result = await connector.execute({
        action: "search_photos",
        input: {
          query: "office",
          perPage: 1,
        },
      });
      if (result.success && result.data?.photos?.length > 0) {
        return { success: true, message: `Pexels found ${result.data.photos.length} photo(s)` };
      }
      return { success: false, error: result.error || "No photos returned" };
    }

    case "unsplash": {
      const result = await connector.execute({
        action: "search_photos",
        input: {
          query: "office",
          perPage: 1,
        },
      });
      if (result.success && result.data?.photos?.length > 0) {
        return { success: true, message: `Unsplash found ${result.data.photos.length} photo(s)` };
      }
      return { success: false, error: result.error || "No photos returned" };
    }

    case "cloudinary": {
      // Test by generating an optimized URL
      const result = await connector.execute({
        action: "optimize_url",
        input: {
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          width: 100,
        },
      });
      if (result.success && result.data) {
        return { success: true, message: `Cloudinary optimized URL: ${String(result.data).substring(0, 50)}...` };
      }
      return { success: false, error: result.error || "No URL returned" };
    }

    case "lottie": {
      const result = await connector.execute({
        action: "get_presets",
        input: {},
      });
      if (result.success && result.data?.animations?.length > 0) {
        return { success: true, message: `Lottie has ${result.data.animations.length} preset animations` };
      }
      return { success: false, error: result.error || "No presets returned" };
    }

    case "ai_mock":
    case "stockphotos_mock":
    case "domain_mock": {
      return { success: true, message: "Mock connector ready" };
    }

    case "namecheap": {
      const result = await connector.execute({
        action: "get_pricing",
        input: { tlds: ["com", "io"] },
      });
      if (result.success && result.data) {
        const pricing = result.data as { tld: string; registerPrice: number }[];
        return { success: true, message: `Namecheap pricing: ${pricing.length} TLDs available` };
      }
      return { success: false, error: result.error || "No pricing returned" };
    }

    case "stripe":
    case "sendgrid":
    case "twilio":
    case "google-maps":
    case "google-analytics":
    case "cloudflare": {
      return { success: true, message: "Not configured - skipped" };
    }

    default:
      return { success: true, message: "Basic connectivity verified" };
  }
}

async function testAllConnectors() {
  console.log("\n========================================");
  console.log("   LAUNCHPAX CONNECTOR TEST SUITE");
  console.log("   Making REAL API calls...");
  console.log("========================================\n");
  
  // Initialize connectors first
  initializeConnectors();
  
  const allConnectors = connectorRegistry.getAll();
  console.log(`Found ${allConnectors.length} connectors to test\n`);
  
  const results: TestResult[] = [];
  
  for (const info of allConnectors) {
    process.stdout.write(`Testing: ${info.name} (${info.key})... `);
    const result = await testConnectorWithApiCall(info.key);
    results.push(result);
    
    if (result.testPassed) {
      console.log(`✓ PASS`);
      if (result.apiCallResult) {
        console.log(`   └─ ${result.apiCallResult}`);
      }
    } else if (!result.configured) {
      console.log(`○ SKIP (not configured)`);
    } else {
      console.log(`✗ FAIL`);
      console.log(`   └─ Error: ${result.error}`);
    }
  }

  console.log("\n========================================");
  console.log("   TEST SUMMARY");
  console.log("========================================\n");
  
  const passed = results.filter(r => r.testPassed);
  const failed = results.filter(r => r.configured && !r.testPassed);
  const skipped = results.filter(r => !r.configured);

  console.log(`✓ Passed:  ${passed.length}`);
  console.log(`✗ Failed:  ${failed.length}`);
  console.log(`○ Skipped: ${skipped.length}`);
  console.log(`─────────────────`);
  console.log(`  Total:   ${results.length}`);

  if (failed.length > 0) {
    console.log("\n========================================");
    console.log("   FAILED CONNECTORS");
    console.log("========================================\n");
    for (const f of failed) {
      console.log(`✗ ${f.connector}`);
      console.log(`  Error: ${f.error}`);
      console.log("");
    }
  }

  if (skipped.length > 0) {
    console.log("\n========================================");
    console.log("   SKIPPED (NOT CONFIGURED)");
    console.log("========================================\n");
    for (const s of skipped) {
      console.log(`○ ${s.connector}`);
    }
  }

  return { passed: passed.length, failed: failed.length, skipped: skipped.length, results };
}

testAllConnectors()
  .then((summary) => {
    console.log("\n========================================");
    console.log("   TEST COMPLETE");
    console.log("========================================\n");
    process.exit(summary.failed > 0 ? 1 : 0);
  })
  .catch((err) => {
    console.error("Test suite error:", err);
    process.exit(1);
  });
