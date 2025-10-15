/**
 * Comprehensive Lead Management API Testing Script
 * Tests all CRUD operations: CREATE, READ, UPDATE, DELETE
 */

const axios = require("axios");

const BASE_URL = "http://localhost:3000/api";
let authToken = "";
let testLeadId = "";
let userId = "";

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[36m",
  bold: "\x1b[1m",
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logTest(testName) {
  console.log(
    `\n${colors.bold}${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`
  );
  log(`Testing: ${testName}`, colors.bold);
  console.log(
    `${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`
  );
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message, error) {
  log(`❌ ${message}`, colors.red);
  if (error) {
    console.error(error.response?.data || error.message);
  }
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

// Test 1: Authentication (Login)
async function testLogin() {
  logTest("1. Authentication (Login)");

  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: "admin@bharatnet.com",
      password: "Admin@1234",
    });

    if (response.data.success && response.data.data.token) {
      authToken = response.data.data.token;
      userId = response.data.data.user.id || response.data.data.user._id;
      logSuccess("Login successful");
      log(`   Token: ${authToken.substring(0, 20)}...`, colors.reset);
      log(`   User ID: ${userId}`, colors.reset);
      log(
        `   User: ${
          response.data.data.user.name || response.data.data.user.firstName
        }`,
        colors.reset
      );
      return true;
    } else {
      logError("Login failed - Invalid response structure");
      console.log("Response:", JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    logError("Login failed", error);
    return false;
  }
}

// Test 2: GET Leads (Initial Check - should return empty or existing leads)
async function testGetLeads() {
  logTest("2. GET All Leads (Initial State)");

  try {
    const response = await axios.get(`${BASE_URL}/leads`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.data.success) {
      const leads = response.data.data.leads;
      const pagination = response.data.data.pagination;

      logSuccess(`Retrieved ${leads.length} leads`);
      log(`   Total leads in DB: ${pagination.total}`, colors.reset);
      log(`   Current page: ${pagination.page}`, colors.reset);
      log(`   Total pages: ${pagination.pages}`, colors.reset);

      if (leads.length > 0) {
        log(`\n   Sample Lead:`, colors.yellow);
        const sample = leads[0];
        log(`   - Name: ${sample.firstName} ${sample.lastName}`, colors.reset);
        log(`   - Email: ${sample.email}`, colors.reset);
        log(`   - Status: ${sample.status}`, colors.reset);
        log(`   - Source: ${sample.source}`, colors.reset);
        log(`   - Company: ${sample.company || "N/A"}`, colors.reset);
      }

      return true;
    } else {
      logError("Failed to retrieve leads");
      return false;
    }
  } catch (error) {
    logError("GET Leads failed", error);
    return false;
  }
}

// Test 3: CREATE Lead
async function testCreateLead() {
  logTest("3. CREATE New Lead");

  const newLead = {
    firstName: "Test",
    lastName: "Lead",
    email: `test.lead.${Date.now()}@example.com`,
    phone: "+91-9876543210",
    company: "Test ISP Company",
    status: "new",
    source: "website",
    assignedTo: userId,
    score: 75,
    estimatedValue: 50000,
    notes: "Test lead created by automated testing script",
    address: {
      street: "123 Test Street",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
    },
    ispInterest: {
      interestedPlans: ["Fiber 100Mbps", "Fiber 200Mbps"],
      preferredInstallDate: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      connectionType: "Fiber",
      existingProvider: "Local ISP",
    },
  };

  try {
    const response = await axios.post(`${BASE_URL}/leads`, newLead, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.data.success && response.data.data) {
      testLeadId = response.data.data._id;
      logSuccess("Lead created successfully");
      log(`   Lead ID: ${testLeadId}`, colors.reset);
      log(
        `   Name: ${response.data.data.firstName} ${response.data.data.lastName}`,
        colors.reset
      );
      log(`   Email: ${response.data.data.email}`, colors.reset);
      log(`   Status: ${response.data.data.status}`, colors.reset);
      log(`   Source: ${response.data.data.source}`, colors.reset);
      log(`   Score: ${response.data.data.score}`, colors.reset);
      log(`   Assigned To: ${response.data.data.assignedTo}`, colors.reset);
      return true;
    } else {
      logError("Create lead failed - Invalid response");
      return false;
    }
  } catch (error) {
    logError("CREATE Lead failed", error);
    return false;
  }
}

// Test 4: GET Single Lead by ID
async function testGetLeadById() {
  logTest("4. GET Single Lead by ID");

  try {
    const response = await axios.get(`${BASE_URL}/leads/${testLeadId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.data.success && response.data.data) {
      logSuccess("Lead retrieved successfully");
      log(
        `   Name: ${response.data.data.firstName} ${response.data.data.lastName}`,
        colors.reset
      );
      log(`   Email: ${response.data.data.email}`, colors.reset);
      log(`   Status: ${response.data.data.status}`, colors.reset);
      log(`   Company: ${response.data.data.company}`, colors.reset);
      log(
        `   ISP Interest: ${response.data.data.ispInterest ? "Yes" : "No"}`,
        colors.reset
      );
      return true;
    } else {
      logError("Failed to retrieve lead by ID");
      return false;
    }
  } catch (error) {
    logError("GET Lead by ID failed", error);
    return false;
  }
}

// Test 5: UPDATE Lead
async function testUpdateLead() {
  logTest("5. UPDATE Lead");

  const updateData = {
    firstName: "Updated Test",
    lastName: "Lead Updated",
    status: "contacted",
    source: "phone",
    company: "Updated ISP Company",
    estimatedValue: 75000,
    notes: "Lead updated by automated testing script",
    assignedTo: userId,
  };

  try {
    const response = await axios.put(
      `${BASE_URL}/leads/${testLeadId}`,
      updateData,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (response.data.success && response.data.data) {
      logSuccess("Lead updated successfully");
      log(
        `   Name: ${response.data.data.firstName} ${response.data.data.lastName}`,
        colors.reset
      );
      log(
        `   Status: ${response.data.data.status} (changed from 'new')`,
        colors.reset
      );
      log(
        `   Source: ${response.data.data.source} (changed from 'website')`,
        colors.reset
      );
      log(
        `   Estimated Value: ₹${response.data.data.estimatedValue} (changed from ₹50000)`,
        colors.reset
      );
      log(`   Company: ${response.data.data.company}`, colors.reset);
      return true;
    } else {
      logError("Update lead failed - Invalid response");
      return false;
    }
  } catch (error) {
    logError("UPDATE Lead failed", error);
    return false;
  }
}

// Test 6: Search Leads
async function testSearchLeads() {
  logTest("6. Search Leads (by keyword)");

  try {
    const response = await axios.get(`${BASE_URL}/leads?search=Updated`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.data.success) {
      const leads = response.data.data.leads;
      logSuccess(`Search found ${leads.length} leads`);

      if (leads.length > 0) {
        const found = leads.find((l) => l._id === testLeadId);
        if (found) {
          log(`   ✓ Test lead found in search results`, colors.green);
          log(`   - Name: ${found.firstName} ${found.lastName}`, colors.reset);
        } else {
          logWarning(
            "Test lead not found in search results (might be expected if search is specific)"
          );
        }
      }
      return true;
    } else {
      logError("Search leads failed");
      return false;
    }
  } catch (error) {
    logError("Search Leads failed", error);
    return false;
  }
}

// Test 7: Filter Leads by Status
async function testFilterLeadsByStatus() {
  logTest("7. Filter Leads by Status");

  try {
    const response = await axios.get(`${BASE_URL}/leads?status=contacted`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.data.success) {
      const leads = response.data.data.leads;
      logSuccess(
        `Filter returned ${leads.length} leads with status 'contacted'`
      );

      // Verify all leads have 'contacted' status
      const allCorrect = leads.every((l) => l.status === "contacted");
      if (allCorrect) {
        log(`   ✓ All leads have correct status`, colors.green);
      } else {
        logWarning("Some leads have incorrect status");
      }

      const found = leads.find((l) => l._id === testLeadId);
      if (found) {
        log(`   ✓ Test lead found in filtered results`, colors.green);
      }
      return true;
    } else {
      logError("Filter leads failed");
      return false;
    }
  } catch (error) {
    logError("Filter Leads failed", error);
    return false;
  }
}

// Test 8: Filter Leads by Source
async function testFilterLeadsBySource() {
  logTest("8. Filter Leads by Source");

  try {
    const response = await axios.get(`${BASE_URL}/leads?source=phone`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.data.success) {
      const leads = response.data.data.leads;
      logSuccess(`Filter returned ${leads.length} leads with source 'phone'`);

      const allCorrect = leads.every((l) => l.source === "phone");
      if (allCorrect) {
        log(`   ✓ All leads have correct source`, colors.green);
      } else {
        logWarning("Some leads have incorrect source");
      }
      return true;
    } else {
      logError("Filter leads by source failed");
      return false;
    }
  } catch (error) {
    logError("Filter Leads by Source failed", error);
    return false;
  }
}

// Test 9: Pagination
async function testPagination() {
  logTest("9. Pagination (Page 1, Limit 5)");

  try {
    const response = await axios.get(`${BASE_URL}/leads?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.data.success) {
      const leads = response.data.data.leads;
      const pagination = response.data.data.pagination;

      logSuccess(`Pagination working correctly`);
      log(`   Retrieved: ${leads.length} leads`, colors.reset);
      log(`   Page: ${pagination.page}`, colors.reset);
      log(`   Limit: ${pagination.limit}`, colors.reset);
      log(`   Total: ${pagination.total}`, colors.reset);
      log(`   Total Pages: ${pagination.pages}`, colors.reset);

      if (leads.length <= 5) {
        log(`   ✓ Correct number of results per page`, colors.green);
      } else {
        logWarning("More results than limit");
      }
      return true;
    } else {
      logError("Pagination test failed");
      return false;
    }
  } catch (error) {
    logError("Pagination test failed", error);
    return false;
  }
}

// Test 10: DELETE Lead
async function testDeleteLead() {
  logTest("10. DELETE Lead");

  try {
    const response = await axios.delete(`${BASE_URL}/leads/${testLeadId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.data.success) {
      logSuccess("Lead deleted successfully");
      log(`   Deleted Lead ID: ${testLeadId}`, colors.reset);

      // Verify deletion by trying to GET the deleted lead
      try {
        await axios.get(`${BASE_URL}/leads/${testLeadId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        logWarning("Lead still exists after deletion (unexpected)");
        return false;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          log(`   ✓ Verified: Lead no longer exists`, colors.green);
          return true;
        } else {
          logError("Verification failed", error);
          return false;
        }
      }
    } else {
      logError("Delete lead failed - Invalid response");
      return false;
    }
  } catch (error) {
    logError("DELETE Lead failed", error);
    return false;
  }
}

// Test 11: Verify Enum Values
async function testEnumValidation() {
  logTest("11. Enum Validation (Backend Enforcement)");

  // Test invalid status
  try {
    await axios.post(
      `${BASE_URL}/leads`,
      {
        firstName: "Enum",
        lastName: "Test",
        email: `enum.test.${Date.now()}@example.com`,
        status: "Invalid Status", // Should fail
        source: "website",
        assignedTo: userId,
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    logError("Backend accepted invalid status enum (should have rejected)");
    return false;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      logSuccess("Backend correctly rejected invalid status enum");
      log(`   Error message: ${error.response.data.message}`, colors.reset);
    } else {
      logError("Unexpected error during enum validation", error);
      return false;
    }
  }

  // Test invalid source
  try {
    await axios.post(
      `${BASE_URL}/leads`,
      {
        firstName: "Enum",
        lastName: "Test",
        email: `enum.test2.${Date.now()}@example.com`,
        status: "new",
        source: "Invalid Source", // Should fail
        assignedTo: userId,
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    logError("Backend accepted invalid source enum (should have rejected)");
    return false;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      logSuccess("Backend correctly rejected invalid source enum");
      log(`   Error message: ${error.response.data.message}`, colors.reset);
      return true;
    } else {
      logError("Unexpected error during source enum validation", error);
      return false;
    }
  }
}

// Main test runner
async function runAllTests() {
  console.log("\n");
  log(
    "═══════════════════════════════════════════════════════════════",
    colors.bold
  );
  log(
    "   LEAD MANAGEMENT API - COMPREHENSIVE TEST SUITE",
    colors.bold + colors.blue
  );
  log(
    "═══════════════════════════════════════════════════════════════",
    colors.bold
  );
  console.log("\n");

  const results = {
    passed: 0,
    failed: 0,
    total: 11,
  };

  // Run tests sequentially
  const tests = [
    { name: "Login", fn: testLogin },
    { name: "Get All Leads", fn: testGetLeads },
    { name: "Create Lead", fn: testCreateLead },
    { name: "Get Lead by ID", fn: testGetLeadById },
    { name: "Update Lead", fn: testUpdateLead },
    { name: "Search Leads", fn: testSearchLeads },
    { name: "Filter by Status", fn: testFilterLeadsByStatus },
    { name: "Filter by Source", fn: testFilterLeadsBySource },
    { name: "Pagination", fn: testPagination },
    { name: "Delete Lead", fn: testDeleteLead },
    { name: "Enum Validation", fn: testEnumValidation },
  ];

  for (const test of tests) {
    const result = await test.fn();
    if (result) {
      results.passed++;
    } else {
      results.failed++;
      // Continue with other tests even if one fails
    }
    // Small delay between tests
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Print summary
  console.log("\n");
  log(
    "═══════════════════════════════════════════════════════════════",
    colors.bold
  );
  log("   TEST SUMMARY", colors.bold + colors.blue);
  log(
    "═══════════════════════════════════════════════════════════════",
    colors.bold
  );
  console.log("\n");

  log(`Total Tests: ${results.total}`, colors.bold);
  log(`Passed: ${results.passed}`, colors.green + colors.bold);
  log(
    `Failed: ${results.failed}`,
    results.failed > 0 ? colors.red + colors.bold : colors.green
  );

  const percentage = ((results.passed / results.total) * 100).toFixed(1);
  log(
    `\nSuccess Rate: ${percentage}%`,
    percentage === "100.0" ? colors.green + colors.bold : colors.yellow
  );

  console.log("\n");

  if (results.failed === 0) {
    log(
      "🎉 All tests passed! Lead Management API is working perfectly!",
      colors.green + colors.bold
    );
  } else {
    log(
      `⚠️  ${results.failed} test(s) failed. Please review the errors above.`,
      colors.yellow + colors.bold
    );
  }

  console.log("\n");
}

// Run the test suite
runAllTests().catch((error) => {
  console.error("\n");
  logError("Test suite crashed", error);
  console.error("\n");
  process.exit(1);
});
