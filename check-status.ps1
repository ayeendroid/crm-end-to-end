#!/usr/bin/env pwsh
# CRM Debug Helper - Check System Status

Write-Host "`n🔍 CRM SYSTEM STATUS CHECK" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

# Check Node processes
Write-Host "`n1️⃣  NODE PROCESSES:" -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Format-Table Id, ProcessName, StartTime, CPU -AutoSize
    Write-Host "   ✅ Found $($nodeProcesses.Count) Node process(es)" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  No Node processes running" -ForegroundColor Red
}

# Check MongoDB
Write-Host "`n2️⃣  MONGODB STATUS:" -ForegroundColor Yellow
$mongod = Get-Process mongod -ErrorAction SilentlyContinue
if ($mongod) {
    Write-Host "   ✅ MongoDB is running (PID: $($mongod.Id))" -ForegroundColor Green
} else {
    Write-Host "   ❌ MongoDB is NOT running!" -ForegroundColor Red
}

# Check ports
Write-Host "`n3️⃣  PORT STATUS:" -ForegroundColor Yellow
Write-Host "   Checking port 3000 (Backend)..."
$port3000 = netstat -ano | findstr ":3000 " | Select-Object -First 1
if ($port3000) {
    Write-Host "   ✅ Port 3000: OCCUPIED" -ForegroundColor Green
    Write-Host "      $port3000"
} else {
    Write-Host "   ⚠️  Port 3000: FREE (backend not running)" -ForegroundColor Red
}

Write-Host "   Checking port 5173 (Frontend)..."
$port5173 = netstat -ano | findstr ":5173 " | Select-Object -First 1
if ($port5173) {
    Write-Host "   ✅ Port 5173: OCCUPIED" -ForegroundColor Green
    Write-Host "      $port5173"
} else {
    Write-Host "   ⚠️  Port 5173: FREE (frontend not running)" -ForegroundColor Red
}

# Test backend API
Write-Host "`n4️⃣  BACKEND API TEST:" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method GET -TimeoutSec 5
    Write-Host "   ✅ Backend API is responding!" -ForegroundColor Green
    Write-Host "      Response: $($response | ConvertTo-Json -Compress)"
} catch {
    Write-Host "   ❌ Backend API is NOT responding!" -ForegroundColor Red
    Write-Host "      Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test frontend
Write-Host "`n5️⃣  FRONTEND TEST:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET -TimeoutSec 5 -UseBasicParsing
    Write-Host "   ✅ Frontend is responding! (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Frontend is NOT responding!" -ForegroundColor Red
    Write-Host "      Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Check environment
Write-Host "`n6️⃣  ENVIRONMENT:" -ForegroundColor Yellow
$envFile = "C:\Users\anmol\Documents\CRM\server\.env"
if (Test-Path $envFile) {
    $nodeEnv = Select-String -Path $envFile -Pattern "NODE_ENV=" | Select-Object -First 1
    if ($nodeEnv) {
        Write-Host "   ✅ $($nodeEnv.Line)" -ForegroundColor Green
    }
} else {
    Write-Host "   ⚠️  .env file not found!" -ForegroundColor Red
}

# Summary
Write-Host "`n" + ("=" * 60) -ForegroundColor Gray
Write-Host "📊 SUMMARY:" -ForegroundColor Cyan

$allGood = $true
if (-not $mongod) { $allGood = $false; Write-Host "   ❌ MongoDB not running" -ForegroundColor Red }
if (-not $port3000) { $allGood = $false; Write-Host "   ❌ Backend not running" -ForegroundColor Red }
if (-not $port5173) { $allGood = $false; Write-Host "   ❌ Frontend not running" -ForegroundColor Red }

if ($allGood) {
    Write-Host "`n   ✅ ALL SYSTEMS OPERATIONAL!" -ForegroundColor Green
    Write-Host "   🌐 Open http://localhost:5173 in your browser" -ForegroundColor Cyan
} else {
    Write-Host "`n   ⚠️  SOME SERVICES ARE NOT RUNNING" -ForegroundColor Yellow
    Write-Host "   💡 Run: .\start-fresh.ps1 to start all services" -ForegroundColor Cyan
}

Write-Host ""
