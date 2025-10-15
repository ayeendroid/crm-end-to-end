# PowerShell API Test Script
Write-Host ""
Write-Host "Starting Quick API Tests..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"
$passed = 0
$failed = 0

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/" -Method Get -ErrorAction Stop
    if ($response.ok -eq $true) {
        Write-Host "PASSED - Server is responding" -ForegroundColor Green
        Write-Host "   Message: $($response.message)" -ForegroundColor Gray
        $passed++
    }
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

Write-Host ""

# Test 2: Login
Write-Host "Test 2: Login with Admin Credentials" -ForegroundColor Yellow
try {
    $body = @{
        email = "admin@bharatnet.com"
        password = "Admin@1234"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
    
    if ($response.data.token) {
        $global:token = $response.data.token
        Write-Host "PASSED - Login successful" -ForegroundColor Green
        Write-Host "   User: $($response.data.user.name)" -ForegroundColor Gray
        Write-Host "   Role: $($response.data.user.role)" -ForegroundColor Gray
        $passed++
    }
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

Write-Host ""

# Test 3: Get Customers
Write-Host "Test 3: Get Customers with Authentication" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $global:token"
    }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/customers?page=1&limit=5" -Method Get -Headers $headers -ErrorAction Stop
    
    if ($response.data.customers) {
        Write-Host "PASSED - Customers retrieved" -ForegroundColor Green
        Write-Host "   Count: $($response.data.customers.Count)" -ForegroundColor Gray
        Write-Host "   Total: $($response.data.pagination.total)" -ForegroundColor Gray
        $passed++
    }
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

Write-Host ""

# Final Report
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Passed: $passed/3 tests" -ForegroundColor Green
Write-Host "Failed: $failed/3 tests" -ForegroundColor Red
$successRate = [math]::Round(($passed / 3) * 100)
Write-Host "Success Rate: $successRate%" -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

if ($passed -eq 3) {
    Write-Host "All tests passed! Your API is working perfectly!" -ForegroundColor Green
} elseif ($passed -ge 2) {
    Write-Host "Most tests passed! Minor issues to fix." -ForegroundColor Yellow
} else {
    Write-Host "Several tests failed. Review the errors above." -ForegroundColor Red
}
Write-Host ""
