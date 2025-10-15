# Week 1 API Testing Script
# Tests all backend endpoints for Week 1 features

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Week 1 API Testing Script" -ForegroundColor Cyan
Write-Host "Testing Backend Endpoints" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000/api"
$token = ""

# Function to make API requests
function Test-Endpoint {
    param (
        [string]$Method,
        [string]$Endpoint,
        [string]$Description
    )
    
    Write-Host "Testing: $Description" -ForegroundColor Yellow
    Write-Host "  → $Method $Endpoint" -ForegroundColor Gray
    
    try {
        $headers = @{}
        if ($token) {
            $headers["Authorization"] = "Bearer $token"
        }
        
        $response = Invoke-RestMethod -Uri "$baseUrl$Endpoint" -Method $Method -Headers $headers -TimeoutSec 5
        Write-Host "  ✓ SUCCESS" -ForegroundColor Green
        Write-Host "  Response: $($response | ConvertTo-Json -Depth 1 -Compress)" -ForegroundColor Gray
        Write-Host ""
        return $true
    }
    catch {
        Write-Host "  ✗ FAILED" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        return $false
    }
}

# Check if backend is running
Write-Host "1. Checking Backend Server..." -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000" -TimeoutSec 5
    Write-Host "  ✓ Backend is running!" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "  ✗ Backend is NOT running!" -ForegroundColor Red
    Write-Host "  Please start the backend: cd server; npm run dev" -ForegroundColor Yellow
    exit 1
}

# Test Analytics Endpoints (Used by Dashboard)
Write-Host "2. Testing Analytics Endpoints (Day 4-5: Dashboard)" -ForegroundColor Cyan
Write-Host ""

$analyticsTests = @(
    @{Method="GET"; Endpoint="/analytics/overview?start=2024-01-01&end=2024-12-31"; Description="Analytics Overview"},
    @{Method="GET"; Endpoint="/analytics/trends?months=6"; Description="Analytics Trends"}
)

$analyticsPass = 0
$analyticsTotal = $analyticsTests.Count
foreach ($test in $analyticsTests) {
    if (Test-Endpoint -Method $test.Method -Endpoint $test.Endpoint -Description $test.Description) {
        $analyticsPass++
    }
}

Write-Host "Analytics Tests: $analyticsPass/$analyticsTotal passed" -ForegroundColor $(if ($analyticsPass -eq $analyticsTotal) { "Green" } else { "Yellow" })
Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

# Test Reports Endpoints (Day 1-2)
Write-Host "3. Testing Reports Endpoints (Day 1-2: Reports)" -ForegroundColor Cyan
Write-Host ""

$reportsTests = @(
    @{Method="GET"; Endpoint="/reports/overview?start=2024-01-01&end=2024-12-31"; Description="Reports Overview"},
    @{Method="GET"; Endpoint="/reports/revenue?start=2024-01-01&end=2024-12-31"; Description="Revenue Report"},
    @{Method="GET"; Endpoint="/reports/deals?start=2024-01-01&end=2024-12-31"; Description="Deals Report"},
    @{Method="GET"; Endpoint="/reports/leads?start=2024-01-01&end=2024-12-31"; Description="Leads Report"}
)

$reportsPass = 0
$reportsTotal = $reportsTests.Count
foreach ($test in $reportsTests) {
    if (Test-Endpoint -Method $test.Method -Endpoint $test.Endpoint -Description $test.Description) {
        $reportsPass++
    }
}

Write-Host "Reports Tests: $reportsPass/$reportsTotal passed" -ForegroundColor $(if ($reportsPass -eq $reportsTotal) { "Green" } else { "Yellow" })
Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

# Test Activities Endpoints (Day 3)
Write-Host "4. Testing Activities Endpoints (Day 3: Activities)" -ForegroundColor Cyan
Write-Host ""

$activitiesTests = @(
    @{Method="GET"; Endpoint="/activities?limit=10"; Description="Get Activities"},
    @{Method="GET"; Endpoint="/activities?type=note&limit=5"; Description="Get Activities by Type"}
)

$activitiesPass = 0
$activitiesTotal = $activitiesTests.Count
foreach ($test in $activitiesTests) {
    if (Test-Endpoint -Method $test.Method -Endpoint $test.Endpoint -Description $test.Description) {
        $activitiesPass++
    }
}

Write-Host "Activities Tests: $activitiesPass/$activitiesTotal passed" -ForegroundColor $(if ($activitiesPass -eq $activitiesTotal) { "Green" } else { "Yellow" })
Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

# Test Tasks Endpoints (Day 3)
Write-Host "5. Testing Tasks Endpoints (Day 3: Tasks)" -ForegroundColor Cyan
Write-Host ""

$tasksTests = @(
    @{Method="GET"; Endpoint="/tasks?limit=10"; Description="Get Tasks"},
    @{Method="GET"; Endpoint="/tasks?status=todo&limit=5"; Description="Get Tasks by Status"}
)

$tasksPass = 0
$tasksTotal = $tasksTests.Count
foreach ($test in $tasksTests) {
    if (Test-Endpoint -Method $test.Method -Endpoint $test.Endpoint -Description $test.Description) {
        $tasksPass++
    }
}

Write-Host "Tasks Tests: $tasksPass/$tasksTotal passed" -ForegroundColor $(if ($tasksPass -eq $tasksTotal) { "Green" } else { "Yellow" })
Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

# Summary
Write-Host "================================" -ForegroundColor Cyan
Write-Host "TESTING SUMMARY" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$totalTests = $analyticsTotal + $reportsTotal + $activitiesTotal + $tasksTotal
$totalPass = $analyticsPass + $reportsPass + $activitiesPass + $tasksPass

Write-Host "Analytics Endpoints:   $analyticsPass/$analyticsTotal" -ForegroundColor $(if ($analyticsPass -eq $analyticsTotal) { "Green" } else { "Yellow" })
Write-Host "Reports Endpoints:     $reportsPass/$reportsTotal" -ForegroundColor $(if ($reportsPass -eq $reportsTotal) { "Green" } else { "Yellow" })
Write-Host "Activities Endpoints:  $activitiesPass/$activitiesTotal" -ForegroundColor $(if ($activitiesPass -eq $activitiesTotal) { "Green" } else { "Yellow" })
Write-Host "Tasks Endpoints:       $tasksPass/$tasksTotal" -ForegroundColor $(if ($tasksPass -eq $tasksTotal) { "Green" } else { "Yellow" })
Write-Host ""
Write-Host "TOTAL:                 $totalPass/$totalTests" -ForegroundColor $(if ($totalPass -eq $totalTests) { "Green" } elseif ($totalPass -gt 0) { "Yellow" } else { "Red" })
Write-Host ""

if ($totalPass -eq $totalTests) {
    Write-Host "✓ All API endpoints are working correctly!" -ForegroundColor Green
    Write-Host "✓ Week 1 backend is PRODUCTION READY!" -ForegroundColor Green
} elseif ($totalPass -gt 0) {
    Write-Host "⚠ Some endpoints failed. Check logs above." -ForegroundColor Yellow
    Write-Host "Week 1 backend needs attention." -ForegroundColor Yellow
} else {
    Write-Host "✗ All endpoints failed. Backend may have issues." -ForegroundColor Red
    Write-Host "Please check server logs and configuration." -ForegroundColor Red
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
