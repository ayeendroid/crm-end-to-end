// API Testing Script
const http = require("http");

// Helper function to make HTTP requests
function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on("error", (err) => {
      reject(new Error(`HTTP Error: ${err.message}`));
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Test suite
async function runTests() {
  console.log("\n🧪 Starting API Test Suite...\n");

  let passedTests = 0;
  let failedTests = 0;
  let token = "";

  // Test 1: Health Check
  try {
    console.log("Test 1: Health Check Endpoint");
    const result = await request({
      hostname: "localhost",
      port: 3000,
      path: "/",
      method: "GET",
    });

    if (result.status === 200 && result.data.ok === true) {
      console.log("✅ PASSED - Health check returned OK");
      console.log("   Response:", JSON.stringify(result.data, null, 2));
      passedTests++;
    } else {
      console.log("❌ FAILED - Unexpected response");
      failedTests++;
    }
  } catch (err) {
    console.log("❌ FAILED -", err.message);
    failedTests++;
  }

  console.log("\n---\n");

  // Test 2: Valid Login
  try {
    console.log("Test 2: Login with Valid Credentials");
    const result = await request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { email: "admin@bharatnet.com", password: "Admin@1234" }
    );

    if (result.status === 200 && result.data.data && result.data.data.token) {
      token = result.data.data.token;
      console.log("✅ PASSED - Login successful");
      console.log("   User:", result.data.data.user.name);
      console.log("   Role:", result.data.data.user.role);
      console.log("   Token received:", token.substring(0, 20) + "...");
      passedTests++;
    } else {
      console.log("❌ FAILED - No token received");
      console.log("   Response:", JSON.stringify(result.data, null, 2));
      failedTests++;
    }
  } catch (err) {
    console.log("❌ FAILED -", err.message);
    failedTests++;
  }

  console.log("\n---\n");

  // Test 3: Invalid Login
  try {
    console.log("Test 3: Login with Invalid Credentials");
    const result = await request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { email: "admin@bharatnet.com", password: "wrongpassword" }
    );

    if (result.status === 401 && result.data.success === false) {
      console.log("✅ PASSED - Invalid credentials rejected");
      console.log("   Error:", result.data.error.message);
      passedTests++;
    } else {
      console.log("❌ FAILED - Should return 401 error");
      failedTests++;
    }
  } catch (err) {
    console.log("❌ FAILED -", err.message);
    failedTests++;
  }

  console.log("\n---\n");

  // Test 4: Get Customers (with auth)
  try {
    console.log("Test 4: Get Customers with Authentication");
    const result = await request({
      hostname: "localhost",
      port: 3000,
      path: "/api/customers?page=1&limit=5",
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (
      result.status === 200 &&
      result.data.data &&
      result.data.data.customers
    ) {
      console.log("✅ PASSED - Customers retrieved");
      console.log("   Count:", result.data.data.customers.length);
      console.log("   Total:", result.data.data.pagination.total);
      console.log(
        "   First customer:",
        result.data.data.customers[0].firstName,
        result.data.data.customers[0].lastName
      );
      passedTests++;
    } else {
      console.log("❌ FAILED - Could not retrieve customers");
      failedTests++;
    }
  } catch (err) {
    console.log("❌ FAILED -", err.message);
    failedTests++;
  }

  console.log("\n---\n");

  // Test 5: Get Customers (without auth)
  try {
    console.log("Test 5: Get Customers without Authentication");
    const result = await request({
      hostname: "localhost",
      port: 3000,
      path: "/api/customers",
      method: "GET",
    });

    if (result.status === 401) {
      console.log("✅ PASSED - Unauthorized access blocked");
      const errorMsg = result.data.error
        ? result.data.error.message
        : result.data.message;
      console.log("   Error:", errorMsg);
      passedTests++;
    } else {
      console.log("❌ FAILED - Should require authentication");
      failedTests++;
    }
  } catch (err) {
    console.log("❌ FAILED -", err.message);
    failedTests++;
  }

  console.log("\n---\n");

  // Test 6: Search Customers
  try {
    console.log("Test 6: Search Customers by Name");
    const result = await request({
      hostname: "localhost",
      port: 3000,
      path: "/api/customers?search=Sharma",
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (result.status === 200 && result.data.data.customers.length > 0) {
      console.log("✅ PASSED - Search works");
      console.log("   Results:", result.data.data.customers.length);
      console.log(
        "   First match:",
        result.data.data.customers[0].firstName,
        result.data.data.customers[0].lastName
      );
      passedTests++;
    } else {
      console.log("❌ FAILED - Search returned no results");
      failedTests++;
    }
  } catch (err) {
    console.log("❌ FAILED -", err.message);
    failedTests++;
  }

  console.log("\n---\n");

  // Test 7: Invalid Email Validation
  try {
    console.log("Test 7: Input Validation - Invalid Email");
    const result = await request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/auth/register",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { name: "Test User", email: "invalid-email", password: "Test@1234" }
    );

    if (result.status === 400 && result.data.error.details) {
      console.log("✅ PASSED - Invalid email rejected");
      console.log("   Validation error:", result.data.error.details[0].message);
      passedTests++;
    } else {
      console.log("❌ FAILED - Should reject invalid email");
      failedTests++;
    }
  } catch (err) {
    console.log("❌ FAILED -", err.message);
    failedTests++;
  }

  console.log("\n---\n");

  // Test 8: 404 Handler
  try {
    console.log("Test 8: 404 Not Found Handler");
    const result = await request({
      hostname: "localhost",
      port: 3000,
      path: "/api/nonexistent",
      method: "GET",
    });

    if (result.status === 404) {
      console.log("✅ PASSED - 404 handler works");
      console.log("   Error:", result.data.error.message);
      passedTests++;
    } else {
      console.log("❌ FAILED - Should return 404");
      failedTests++;
    }
  } catch (err) {
    console.log("❌ FAILED -", err.message);
    failedTests++;
  }

  // Final Report
  console.log("\n" + "=".repeat(50));
  console.log("🎯 TEST RESULTS SUMMARY");
  console.log("=".repeat(50));
  console.log(`✅ Passed: ${passedTests}/8 tests`);
  console.log(`❌ Failed: ${failedTests}/8 tests`);
  console.log(`📊 Success Rate: ${Math.round((passedTests / 8) * 100)}%`);
  console.log("=".repeat(50) + "\n");

  if (passedTests === 8) {
    console.log("🎉 All tests passed! Your API is working perfectly! 🎉\n");
  } else if (passedTests >= 6) {
    console.log("✅ Most tests passed! Minor issues to fix.\n");
  } else {
    console.log("⚠️  Several tests failed. Review the errors above.\n");
  }
}

// Run the tests
runTests().catch((err) => {
  console.error("❌ Test suite failed:", err);
  process.exit(1);
});
