// Complete API Testing Script - Tests ALL endpoints
const http = require("http");

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

    req.on("error", (err) => reject(new Error(`HTTP Error: ${err.message}`)));
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runCompleteTests() {
  console.log("\n🔬 Starting COMPLETE API Test Suite...\n");
  console.log("Testing ALL endpoints and features\n");

  let passedTests = 0;
  let failedTests = 0;
  let token = "";

  // ==================== AUTH TESTS ====================
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  AUTHENTICATION & AUTHORIZATION TESTS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Test 1: Health Check
  try {
    console.log("Test 1: Health Check");
    const result = await request({
      hostname: "localhost",
      port: 3000,
      path: "/",
      method: "GET",
    });
    if (result.status === 200 && result.data.ok === true) {
      console.log("✅ PASSED - Server responding");
      passedTests++;
    } else {
      console.log("❌ FAILED - Health check failed");
      failedTests++;
    }
  } catch (err) {
    console.log("❌ FAILED -", err.message);
    failedTests++;
  }
  console.log("");

  // Test 2: Login
  try {
    console.log("Test 2: Admin Login");
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
      console.log("✅ PASSED - Login successful, token received");
      passedTests++;
    } else {
      console.log("❌ FAILED - Login failed");
      console.log("   Status:", result.status);
      console.log("   Response:", JSON.stringify(result.data, null, 2));
      failedTests++;
    }
  } catch (err) {
    console.log("❌ FAILED -", err.message);
    failedTests++;
  }
  console.log("");

  // Test 3: Invalid login
  try {
    console.log("Test 3: Invalid Login Credentials");
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
    if (result.status === 401) {
      console.log("✅ PASSED - Invalid credentials properly rejected");
      passedTests++;
    } else {
      console.log("❌ FAILED - Should return 401");
      failedTests++;
    }
  } catch (err) {
    console.log("❌ FAILED -", err.message);
    failedTests++;
  }
  console.log("");

  // Test 4: Unauthorized access
  try {
    console.log("Test 4: Unauthorized Access (No Token)");
    const result = await request({
      hostname: "localhost",
      port: 3000,
      path: "/api/customers",
      method: "GET",
    });
    if (result.status === 401) {
      console.log("✅ PASSED - Unauthorized access blocked");
      passedTests++;
    } else {
      console.log("❌ FAILED - Should require authentication");
      failedTests++;
    }
  } catch (err) {
    console.log("❌ FAILED -", err.message);
    failedTests++;
  }
  console.log("");

  // ==================== CUSTOMER TESTS ====================
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  CUSTOMER MANAGEMENT TESTS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Test 5: Get Customers
  try {
    console.log("Test 5: Get Customers (Paginated)");
    const result = await request({
      hostname: "localhost",
      port: 3000,
      path: "/api/customers?page=1&limit=10",
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (result.status === 200 && result.data.data.customers.length > 0) {
      console.log(
        `✅ PASSED - Retrieved ${result.data.data.customers.length} customers`
      );
      console.log(`   Total in DB: ${result.data.data.pagination.total}`);
      passedTests++;
    } else {
      console.log("❌ FAILED - Could not retrieve customers");
      failedTests++;
    }
  } catch (err) {
    console.log("❌ FAILED -", err.message);
    failedTests++;
  }
  console.log("");

  // Test 6: Search Customers
  try {
    console.log("Test 6: Search Customers by Name");
    const result = await request({
      hostname: "localhost",
      port: 3000,
      path: "/api/customers?search=Kumar",
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (result.status === 200 && result.data.data.customers.length > 0) {
      console.log(
        `✅ PASSED - Found ${result.data.data.customers.length} customers matching "Kumar"`
      );
      passedTests++;
    } else {
      console.log("❌ FAILED - Search failed");
      failedTests++;
    }
  } catch (err) {
    console.log("❌ FAILED -", err.message);
    failedTests++;
  }
  console.log("");

  // Test 7: Filter by Status
  try {
    console.log("Test 7: Filter Customers by Status");
    const result = await request({
      hostname: "localhost",
      port: 3000,
      path: "/api/customers?status=active",
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (result.status === 200) {
      console.log(
        `✅ PASSED - Filtered customers by status (${result.data.data.customers.length} found)`
      );
      passedTests++;
    } else {
      console.log("❌ FAILED - Filter failed");
      failedTests++;
    }
  } catch (err) {
    console.log("❌ FAILED -", err.message);
    failedTests++;
  }
  console.log("");

  // ==================== LEAD TESTS ====================
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  LEAD MANAGEMENT TESTS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Test 8: Get Leads
  try {
    console.log("Test 8: Get Leads");
    const result = await request({
      hostname: "localhost",
      port: 3000,
      path: "/api/leads",
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (result.status === 200 && result.data.data) {
      console.log(
        `✅ PASSED - Retrieved leads (${
          result.data.data.leads ? result.data.data.leads.length : 0
        } leads)`
      );
      passedTests++;
    } else {
      console.log("❌ FAILED - Could not retrieve leads");
      failedTests++;
    }
  } catch (err) {
    console.log("❌ FAILED -", err.message);
    failedTests++;
  }
  console.log("");

  // ==================== DEAL TESTS ====================
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  DEAL MANAGEMENT TESTS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Test 9: Get Deals
  try {
    console.log("Test 9: Get Deals");
    const result = await request({
      hostname: "localhost",
      port: 3000,
      path: "/api/deals",
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (result.status === 200) {
      console.log(`✅ PASSED - Deals endpoint accessible`);
      passedTests++;
    } else {
      console.log("❌ FAILED - Could not retrieve deals");
      failedTests++;
    }
  } catch (err) {
    console.log("❌ FAILED -", err.message);
    failedTests++;
  }
  console.log("");

  // ==================== VALIDATION TESTS ====================
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  INPUT VALIDATION TESTS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Test 10: Invalid Email Format
  try {
    console.log("Test 10: Invalid Email Format");
    const result = await request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { email: "invalid-email", password: "password" }
    );
    if (result.status === 400) {
      console.log("✅ PASSED - Invalid email rejected");
      passedTests++;
    } else {
      console.log("❌ FAILED - Should reject invalid email");
      failedTests++;
    }
  } catch (err) {
    console.log("❌ FAILED -", err.message);
    failedTests++;
  }
  console.log("");

  // Test 11: Missing Required Fields
  try {
    console.log("Test 11: Missing Required Fields");
    const result = await request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { email: "admin@bharatnet.com" }
    );
    if (result.status === 400) {
      console.log("✅ PASSED - Missing fields rejected");
      passedTests++;
    } else {
      console.log("❌ FAILED - Should reject missing fields");
      failedTests++;
    }
  } catch (err) {
    console.log("❌ FAILED -", err.message);
    failedTests++;
  }
  console.log("");

  // ==================== ERROR HANDLING TESTS ====================
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  ERROR HANDLING TESTS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Test 12: 404 Not Found
  try {
    console.log("Test 12: 404 Not Found Handler");
    const result = await request({
      hostname: "localhost",
      port: 3000,
      path: "/api/nonexistent",
      method: "GET",
    });
    if (result.status === 404) {
      console.log("✅ PASSED - 404 handler works");
      passedTests++;
    } else {
      console.log("❌ FAILED - Should return 404");
      failedTests++;
    }
  } catch (err) {
    console.log("❌ FAILED -", err.message);
    failedTests++;
  }
  console.log("");

  // Test 13: Invalid MongoDB ID Format
  try {
    console.log("Test 13: Invalid MongoDB ID Format");
    const result = await request({
      hostname: "localhost",
      port: 3000,
      path: "/api/customers/invalid-id",
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (result.status === 400 || result.status === 404) {
      console.log("✅ PASSED - Invalid ID handled properly");
      passedTests++;
    } else {
      console.log("❌ FAILED - Should handle invalid ID");
      failedTests++;
    }
  } catch (err) {
    console.log("❌ FAILED -", err.message);
    failedTests++;
  }
  console.log("");

  // ==================== FINAL RESULTS ====================
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  🎯 COMPLETE TEST RESULTS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log(`✅ Tests Passed:  ${passedTests}/${passedTests + failedTests}`);
  console.log(`❌ Tests Failed:  ${failedTests}/${passedTests + failedTests}`);
  console.log(
    `📊 Success Rate:  ${(
      (passedTests / (passedTests + failedTests)) *
      100
    ).toFixed(1)}%`
  );
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (failedTests === 0) {
    console.log("🎉🎉🎉 PERFECT! ALL TESTS PASSED! 🎉🎉🎉");
    console.log("Your CRM API is production-ready!\n");
  } else {
    console.log("⚠️  Some tests failed. Review the errors above.\n");
  }
}

runCompleteTests().catch(console.error);
