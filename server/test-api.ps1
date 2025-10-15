# PowerShell API Test Script
Write-Host "`n🧪 Starting Quick API Tests...`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000"
$passed = 0
$failed = 0

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/" -Method Get -ErrorAction Stop
    if ($response.ok -eq $true) {
        Write-Host "✅ PASSED - Server is responding" -ForegroundColor Green
        Write-Host "   Message: $($response.message)" -ForegroundColor Gray
        $passed++
    }
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

Write-Host "`n---`n"

# Test 2: Login with Valid Credentials
Write-Host "Test 2: Login with Admin Credentials" -ForegroundColor Yellow
try {
    $body = @{
        email = "admin@bharatnet.com"
        password = "Admin@1234"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
    
    if ($response.data.token) {
        $global:token = $response.data.token
        Write-Host "✅ PASSED - Login successful" -ForegroundColor Green
        Write-Host "   User: $($response.data.user.name)" -ForegroundColor Gray
        Write-Host "   Role: $($response.data.user.role)" -ForegroundColor Gray
        Write-Host "   Token: $($global:token.Substring(0,20))..." -ForegroundColor Gray
        $passed++
    }
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

Write-Host "`n---`n"

# Test 3: Get Customers (with auth)
Write-Host "Test 3: Get Customers with Authentication" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $global:token"
    }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/customers?page=1&limit=5" -Method Get -Headers $headers -ErrorAction Stop
    
    if ($response.data.customers) {
        Write-Host "✅ PASSED - Customers retrieved" -ForegroundColor Green
        Write-Host "   Count: $($response.data.customers.Count)" -ForegroundColor Gray
        Write-Host "   Total: $($response.data.pagination.total)" -ForegroundColor Gray
        Write-Host "   First: $($response.data.customers[0].firstName) $($response.data.customers[0].lastName)" -ForegroundColor Gray
        $passed++
    }
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

Write-Host "`n---`n"

# Test 4: Get Customers (without auth)
Write-Host "Test 4: Unauthorized Access Test" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/customers" -Method Get -ErrorAction Stop
    Write-Host "❌ FAILED - Should require authentication" -ForegroundColor Red
    $failed++
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ PASSED - Unauthorized access blocked" -ForegroundColor Green
        Write-Host "   Status: 401 Unauthorized" -ForegroundColor Gray
        $passed++
    } else {
        Write-Host "❌ FAILED - Wrong error code" -ForegroundColor Red
        $failed++
    }
}

Write-Host "`n---`n"

# Test 5: Invalid Login
Write-Host "Test 5: Invalid Login Credentials" -ForegroundColor Yellow
try {
    $body = @{
        email = "admin@bharatnet.com"
        password = "wrongpassword"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "❌ FAILED - Should reject invalid credentials" -ForegroundColor Red
    $failed++
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ PASSED - Invalid credentials rejected" -ForegroundColor Green
        Write-Host "   Status: 401 Unauthorized" -ForegroundColor Gray
        $passed++
    } else {
        Write-Host "❌ FAILED - Wrong error code" -ForegroundColor Red
        $failed++
    }
}

# Final Report
Write-Host "`n" -NoNewline
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "🎯 TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "✅ Passed: $passed/5 tests" -ForegroundColor Green
Write-Host "❌ Failed: $failed/5 tests" -ForegroundColor Red
Write-Host "📊 Success Rate: $([math]::Round(($passed / 5) * 100))%" -ForegroundColor Yellow
Write-Host "=" * 50 -ForegroundColor Cyan

if ($passed -eq 5) {
    Write-Host "`nAll tests passed! Your API is working perfectly!`n" -ForegroundColor Green
} elseif ($passed -ge 3) {
    Write-Host "`nMost tests passed! Minor issues to fix.`n" -ForegroundColor Yellow
} else {
    Write-Host "`nSeveral tests failed. Review the errors above.`n" -ForegroundColor Red
}
