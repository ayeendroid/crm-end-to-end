#!/usr/bin/env pwsh
# Internet Access Setup Script for BharatNet CRM
# This script makes your CRM accessible from anywhere on the internet

Write-Host ""
Write-Host "🌍 BharatNet CRM - Internet Access Setup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if CRM is running
Write-Host "🔍 Checking if CRM servers are running..." -ForegroundColor Yellow

$frontendRunning = (Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue) -ne $null
$backendRunning = (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue) -ne $null

if (-not $frontendRunning) {
    Write-Host "❌ Frontend not running on port 5173" -ForegroundColor Red
    Write-Host "   Please start it first: npm run dev" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

if (-not $backendRunning) {
    Write-Host "⚠️  Backend not running on port 3000" -ForegroundColor Yellow
    Write-Host "   Backend API might not work without it" -ForegroundColor Yellow
}

Write-Host "✅ Frontend is running on port 5173" -ForegroundColor Green
if ($backendRunning) {
    Write-Host "✅ Backend is running on port 3000" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Starting ngrok tunnel..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Your CRM will be accessible from anywhere!" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT:" -ForegroundColor Yellow
Write-Host "  1. Copy the 'Forwarding' URL (https://xxxxx.ngrok-free.app)" -ForegroundColor White
Write-Host "  2. Share this URL with anyone" -ForegroundColor White
Write-Host "  3. They can access your CRM from any device" -ForegroundColor White
Write-Host "  4. Press Ctrl+C to stop the tunnel" -ForegroundColor White
Write-Host ""
Write-Host "Starting tunnel in 3 seconds..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

# Start ngrok tunnel
npx ngrok http 5173

Write-Host ""
Write-Host "Tunnel stopped." -ForegroundColor Yellow
