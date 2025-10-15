# CRM Fresh Start Script#!/usr/bin/env pwsh

# This script ensures a clean startup of both backend and frontend# CRM Fresh Start Script

# This script ensures a clean startup of both backend and frontend

Write-Host ""

Write-Host "================================" -ForegroundColor CyanWrite-Host "`n🧹 STEP 1: Cleaning up..." -ForegroundColor Cyan

Write-Host " CRM FRESH START" -ForegroundColor CyanWrite-Host "Stopping all Node processes..."

Write-Host "================================" -ForegroundColor CyanGet-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host ""Start-Sleep -Seconds 2



Write-Host "STEP 1: Cleaning up..." -ForegroundColor YellowWrite-Host "`n✅ STEP 2: Verifying ports are free..." -ForegroundColor Cyan

Write-Host "Stopping all Node processes..."$port3000 = netstat -ano | findstr ":3000 "

Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force$port5173 = netstat -ano | findstr ":5173 "

Start-Sleep -Seconds 2

Write-Host "Done!" -ForegroundColor Greenif ($port3000) {

    Write-Host "⚠️  Port 3000 is still occupied!" -ForegroundColor Red

Write-Host ""    exit 1

Write-Host "STEP 2: Verifying ports are free..." -ForegroundColor Yellow}

$port3000 = netstat -ano | findstr ":3000 "if ($port5173) {

$port5173 = netstat -ano | findstr ":5173 "    Write-Host "⚠️  Port 5173 is still occupied!" -ForegroundColor Red

    exit 1

if ($port3000) {}

    Write-Host "WARNING: Port 3000 is still occupied!" -ForegroundColor Red

    Write-Host "Waiting 5 more seconds..."Write-Host "✅ Ports 3000 and 5173 are free" -ForegroundColor Green

    Start-Sleep -Seconds 5

}Write-Host "`n🗄️  STEP 3: Checking MongoDB..." -ForegroundColor Cyan

if ($port5173) {$mongod = Get-Process mongod -ErrorAction SilentlyContinue

    Write-Host "WARNING: Port 5173 is still occupied!" -ForegroundColor Redif ($mongod) {

    Write-Host "Waiting 5 more seconds..."    Write-Host "✅ MongoDB is running (PID: $($mongod.Id))" -ForegroundColor Green

    Start-Sleep -Seconds 5} else {

}    Write-Host "⚠️  MongoDB is NOT running!" -ForegroundColor Red

    Write-Host "Please start MongoDB first" -ForegroundColor Yellow

Write-Host "Ports 3000 and 5173 are ready" -ForegroundColor Green    exit 1

}

Write-Host ""

Write-Host "STEP 3: Checking MongoDB..." -ForegroundColor YellowWrite-Host "`n🚀 STEP 4: Starting Backend Server..." -ForegroundColor Cyan

$mongod = Get-Process mongod -ErrorAction SilentlyContinueWrite-Host "Opening new terminal for backend..." -ForegroundColor Yellow

if ($mongod) {

    $mongoId = $mongod.Id# Start backend in new window

    Write-Host "MongoDB is running (PID: $mongoId)" -ForegroundColor GreenStart-Process pwsh -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\anmol\Documents\CRM\server'; Write-Host '🔧 Backend Server Starting...' -ForegroundColor Cyan; npm run dev"

} else {

    Write-Host "WARNING: MongoDB is NOT running!" -ForegroundColor RedWrite-Host "Waiting 5 seconds for backend to start..."

    Write-Host "Please start MongoDB first" -ForegroundColor YellowStart-Sleep -Seconds 5

    exit 1

}# Check if backend started

$backendRunning = $false

Write-Host ""for ($i = 0; $i -lt 10; $i++) {

Write-Host "STEP 4: Starting Backend Server..." -ForegroundColor Yellow    try {

Write-Host "Opening new terminal for backend..."        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue

        if ($response.StatusCode -eq 200) {

# Start backend in new window            $backendRunning = $true

Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\anmol\Documents\CRM\server'; Write-Host 'Backend Server Starting...' -ForegroundColor Cyan; npm run dev"            break

        }

Write-Host "Waiting 8 seconds for backend to start..."    } catch {

Start-Sleep -Seconds 8        Start-Sleep -Seconds 1

    }

# Check if backend started}

$backendRunning = $false

for ($i = 0; $i -lt 5; $i++) {if ($backendRunning) {

    try {    Write-Host "✅ Backend is running on http://localhost:3000" -ForegroundColor Green

        $testPort = netstat -ano | findstr ":3000 " | Select-Object -First 1} else {

        if ($testPort) {    Write-Host "⚠️  Backend may still be starting... Check the backend terminal" -ForegroundColor Yellow

            $backendRunning = $true}

            break

        }Write-Host "`n🎨 STEP 5: Starting Frontend..." -ForegroundColor Cyan

    } catch {Write-Host "Opening new terminal for frontend..." -ForegroundColor Yellow

        Start-Sleep -Seconds 1

    }# Start frontend in new window

}Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\anmol\Documents\CRM\client'; Write-Host '🎨 Frontend Starting...' -ForegroundColor Cyan; npm run dev"



if ($backendRunning) {Write-Host "Waiting 5 seconds for frontend to start..."

    Write-Host "Backend is running on http://localhost:3000" -ForegroundColor GreenStart-Sleep -Seconds 5

} else {

    Write-Host "Backend may still be starting... Check the backend terminal" -ForegroundColor YellowWrite-Host "`n✅ STARTUP COMPLETE!" -ForegroundColor Green

}Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan

Write-Host "1. Check the backend terminal for any errors"

Write-Host ""Write-Host "2. Check the frontend terminal - it should show the local URL"

Write-Host "STEP 5: Starting Frontend..." -ForegroundColor YellowWrite-Host "3. Open http://localhost:5173 in your browser"

Write-Host "Opening new terminal for frontend..."Write-Host "4. Login and test the Dashboard"

Write-Host "`n💡 Tip: If you see 'too many requests', wait 15 minutes or restart both servers" -ForegroundColor Yellow

# Start frontend in new windowWrite-Host "`n🔍 Server Status:" -ForegroundColor Cyan

Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\anmol\Documents\CRM\client'; Write-Host 'Frontend Starting...' -ForegroundColor Cyan; npm run dev"Write-Host "   Backend:  http://localhost:3000"

Write-Host "   Frontend: http://localhost:5173"

Write-Host "Waiting 5 seconds for frontend to start..."$mongoId = $mongod.Id

Start-Sleep -Seconds 5Write-Host "   MongoDB:  Running (PID: $mongoId)"

Write-Host ""

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host " STARTUP COMPLETE!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Check the backend terminal for any errors"
Write-Host "2. Check the frontend terminal - it should show the local URL"
Write-Host "3. Open http://localhost:5173 in your browser"
Write-Host "4. Login and test the Dashboard"
Write-Host ""
Write-Host "Server URLs:" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:3000"
Write-Host "  Frontend: http://localhost:5173"
Write-Host "  MongoDB:  Running (PID: $mongoId)"
Write-Host ""
Write-Host "To check status anytime, run: .\check-status.ps1" -ForegroundColor Yellow
Write-Host ""
