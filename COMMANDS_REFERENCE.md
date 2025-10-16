# 🛠️ Complete Command Reference - BharatNet CRM

**Quick access to all commands for development, deployment, and troubleshooting**

---

## 📋 Table of Contents

1. [Quick Start Commands](#quick-start-commands)
2. [Server Management](#server-management)
3. [Process Management](#process-management)
4. [Port Management](#port-management)
5. [Cache Management](#cache-management)
6. [MongoDB Commands](#mongodb-commands)
7. [Git Operations](#git-operations)
8. [Testing Commands](#testing-commands)
9. [Build Commands](#build-commands)
10. [Debugging Commands](#debugging-commands)
11. [Utility Scripts](#utility-scripts)

---

## Quick Start Commands

### First Time Setup

```powershell
# Clone repository
git clone https://github.com/ayeendroid/crm-end-to-end.git
cd crm-end-to-end

# Checkout latest stable version
git checkout v2.0

# Install dependencies
npm install
cd client
npm install
cd ../server
npm install
cd ..

# Create environment file
Copy-Item server\.env.example server\.env
# Edit server\.env with your configuration

# Start MongoDB (if not running)
net start MongoDB

# Start both servers (automated)
.\start-fresh.ps1
```

### Daily Development

```powershell
# Check system status
.\check-status.ps1

# Start servers (if not running)
.\start-fresh.ps1

# Access application
# Frontend: http://localhost:5173
# Backend:  http://localhost:3000
```

---

## Server Management

### Starting Servers

#### Automated (Recommended)

```powershell
# Kills existing processes, verifies ports, starts both servers
.\start-fresh.ps1
```

#### Manual - Both Servers

```powershell
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

#### Manual - Backend Only

```powershell
cd server
npm run dev

# Alternative: Production mode
npm run build
npm start
```

#### Manual - Frontend Only

```powershell
cd client
npm run dev

# Alternative: Production build
npm run build
npm run preview
```

### Stopping Servers

```powershell
# Stop all Node processes (nuclear option)
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Stop specific terminal
# Press Ctrl+C in the terminal window

# Stop by port (find PID first, then kill)
netstat -ano | findstr ":3000"
taskkill /PID <PID> /F
```

### Restarting Servers

```powershell
# Quick restart - automated
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
.\start-fresh.ps1

# Manual restart
# 1. Press Ctrl+C in each terminal
# 2. Run `npm run dev` again in each
```

---

## Process Management

### View Node Processes

```powershell
# Simple list
Get-Process node -ErrorAction SilentlyContinue

# Detailed view
Get-Process node -ErrorAction SilentlyContinue | Format-Table Id, ProcessName, StartTime, CPU, WorkingSet -AutoSize

# With memory info
Get-Process node -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, @{Name="Memory(MB)";Expression={[math]::Round($_.WorkingSet / 1MB, 2)}}
```

### Kill Processes

```powershell
# Kill all Node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Kill specific process by PID
Stop-Process -Id <PID> -Force

# Kill by name
Stop-Process -Name "node" -Force

# Kill with confirmation
Stop-Process -Id <PID> -Confirm
```

### Find Process by Port

```powershell
# Method 1: Using netstat
netstat -ano | findstr ":<PORT>"
# Note the PID from last column, then:
taskkill /PID <PID> /F

# Method 2: PowerShell one-liner
$port = 3000
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($process) { Stop-Process -Id $process.OwningProcess -Force }
```

---

## Port Management

### Check Port Status

```powershell
# Backend port (3000)
netstat -ano | findstr ":3000"

# Frontend port (5173)
netstat -ano | findstr ":5173"

# MongoDB port (27017)
netstat -ano | findstr ":27017"

# Multiple ports at once
netstat -ano | findstr ":3000 :5173 :27017"

# All listening ports
netstat -ano | findstr "LISTENING"
```

### Free a Port

```powershell
# Find what's using the port
netstat -ano | findstr ":3000"
# Output: TCP  0.0.0.0:3000  0.0.0.0:0  LISTENING  12345
#                                                   ↑ This is the PID

# Kill that process
taskkill /PID 12345 /F

# Verify port is free
netstat -ano | findstr ":3000"
# Should return nothing
```

### Change Port

```powershell
# Backend: Edit server/.env
PORT=3001  # Change from 3000

# Frontend: Edit client/vite.config.ts
server: {
  port: 5174,  // Change from 5173
}

# Or use environment variable
$env:PORT=5174
cd client
npm run dev
```

---

## Cache Management

### Clear Vite Cache (Frontend)

```powershell
# Clear Vite dev cache
Remove-Item -Path "client\.vite" -Recurse -Force -ErrorAction SilentlyContinue

# Clear Vite node_modules cache
Remove-Item -Path "client\node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue

# Clear dist folder
Remove-Item -Path "client\dist" -Recurse -Force -ErrorAction SilentlyContinue

# All in one command
Remove-Item -Path "client\.vite", "client\node_modules\.vite", "client\dist" -Recurse -Force -ErrorAction SilentlyContinue
```

### Clear Build Cache (Backend)

```powershell
# Clear TypeScript build output
Remove-Item -Path "server\dist" -Recurse -Force -ErrorAction SilentlyContinue

# Clear node_modules cache
Remove-Item -Path "server\node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue
```

### Clear All Caches

```powershell
# Clear everything at once
Remove-Item -Path "client\.vite" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "client\dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "server\dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "client\node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "✅ All caches cleared!" -ForegroundColor Green
```

### Reinstall node_modules

```powershell
# Client
cd client
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
npm install

# Server
cd ../server
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
npm install

# Both at once (nuclear option)
cd C:\Users\anmol\Documents\CRM
Remove-Item -Path "client\node_modules", "server\node_modules" -Recurse -Force
Remove-Item -Path "client\package-lock.json", "server\package-lock.json" -Force -ErrorAction SilentlyContinue
cd client && npm install
cd ../server && npm install
```

---

## MongoDB Commands

### Start/Stop MongoDB

```powershell
# Start MongoDB (Windows Service)
net start MongoDB

# Stop MongoDB
net stop MongoDB

# Restart MongoDB
net stop MongoDB
Start-Sleep -Seconds 2
net start MongoDB

# Check MongoDB status
Get-Service MongoDB

# Check if MongoDB is running (by port)
netstat -ano | findstr ":27017"
```

### MongoDB Shell (mongosh)

```bash
# Open MongoDB shell
mongosh

# Connect to specific database
mongosh "mongodb://localhost:27017/bharatnet-crm"

# Common commands in shell:
show dbs                    # List all databases
use bharatnet-crm          # Switch to database
show collections           # List collections
db.customers.find()        # Find all customers
db.customers.countDocuments()  # Count documents
db.customers.find().limit(5)   # First 5 documents
db.stats()                 # Database statistics
exit                       # Exit shell
```

### Database Operations

```bash
# mongosh commands

# Show current database
db.getName()

# Drop database (CAREFUL!)
use bharatnet-crm
db.dropDatabase()

# Backup database
mongodump --db bharatnet-crm --out C:\backup

# Restore database
mongorestore --db bharatnet-crm C:\backup\bharatnet-crm

# Export collection to JSON
mongoexport --db bharatnet-crm --collection customers --out customers.json

# Import collection from JSON
mongoimport --db bharatnet-crm --collection customers --file customers.json
```

### Clear Collections

```bash
# In mongosh:
use bharatnet-crm

# Clear specific collection
db.customers.deleteMany({})
db.leads.deleteMany({})
db.deals.deleteMany({})

# Drop collection entirely
db.customers.drop()
```

---

## Git Operations

### Version Management

```powershell
# List all tags/versions
git tag

# Checkout specific version
git checkout v2.0

# Go back to latest
git checkout main

# View current version
git describe --tags

# Create new tag
git tag -a v2.1 -m "Version 2.1 release"
git push origin v2.1
```

### View History

```powershell
# Recent commits (10)
git log --oneline -10

# Commits with dates
git log --pretty=format:"%h - %an, %ar : %s" -10

# Graphical view
git log --graph --oneline --all -20

# Changes in specific file
git log --oneline -- server/src/routes/customers.ts

# Show changes in commit
git show <commit-hash>
```

### Branching

```powershell
# List branches
git branch -a

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main
git checkout feature/new-feature

# Merge branch
git checkout main
git merge feature/new-feature

# Delete branch
git branch -d feature/new-feature
```

### Committing Changes

```powershell
# Check status
git status

# View changes
git diff

# Stage files
git add .
git add server/src/routes/customers.ts

# Commit
git commit -m "feat: Add customer export feature"

# Push to remote
git push origin main

# Push tag
git push origin v2.1
```

### Undoing Changes

```powershell
# Discard unstaged changes
git checkout -- <file>
git restore <file>

# Unstage files
git reset HEAD <file>
git restore --staged <file>

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes) - CAREFUL!
git reset --hard HEAD~1

# Revert commit (create new commit)
git revert <commit-hash>
```

---

## Testing Commands

### API Testing

```powershell
# Run automated API tests
.\test-week1-api.ps1

# Test specific endpoint manually
Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method GET

# Test with authentication
$token = "your-jwt-token"
Invoke-RestMethod -Uri "http://localhost:3000/api/customers" -Method GET -Headers @{Authorization="Bearer $token"}

# Test POST request
$body = @{
    firstName = "John"
    lastName = "Doe"
    email = "john@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/customers" -Method POST -Body $body -ContentType "application/json" -Headers @{Authorization="Bearer $token"}
```

### Backend Tests

```powershell
cd server

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- customers.test.ts

# Run tests with coverage
npm test -- --coverage
```

### Frontend Tests

```powershell
cd client

# Run tests (if configured)
npm test

# Run tests in watch mode
npm test -- --watch
```

### Health Checks

```powershell
# Backend health
Invoke-RestMethod -Uri "http://localhost:3000/api/health"

# Frontend (check if serving)
Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing

# MongoDB health
mongosh --eval "db.adminCommand('ping')"
```

---

## Build Commands

### Development Build

```powershell
# Frontend
cd client
npm run dev

# Backend
cd server
npm run dev
```

### Production Build

```powershell
# Frontend
cd client
npm run build
# Output: client/dist/

# Backend
cd server
npm run build
# Output: server/dist/

# Build both
npm run build  # (if configured in root package.json)
```

### Build Verification

```powershell
# Check frontend build output
ls client\dist

# Check backend build output
ls server\dist

# Test production build locally
# Frontend
cd client
npm run build
npm run preview  # Serves built files

# Backend
cd server
npm run build
npm start  # Runs built files
```

---

## Debugging Commands

### View Logs

```powershell
# View Node process logs (if logging to console)
# Logs are in the terminal where server is running

# View specific log file (if file logging configured)
Get-Content server\logs\app.log -Tail 50 -Wait

# Search logs for errors
Get-Content server\logs\app.log | Select-String "Error"

# Count errors
(Get-Content server\logs\app.log | Select-String "Error").Count
```

### Environment Variables

```powershell
# View all environment variables
Get-ChildItem Env:

# View specific variables
echo $env:NODE_ENV
echo $env:PORT
echo $env:MONGODB_URI

# Set environment variable (session only)
$env:NODE_ENV = "development"
$env:PORT = 3001

# Set permanently (system-wide) - Run as Administrator
[System.Environment]::SetEnvironmentVariable("NODE_ENV", "production", "Machine")
```

### Network Debugging

```powershell
# Test API endpoint
Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET -UseBasicParsing

# View response headers
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/analytics/overview?start=2024-01-01&end=2024-12-31"
$response.Headers

# Check CORS
Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method OPTIONS -Headers @{Origin="http://localhost:5173"}

# Ping server
Test-NetConnection -ComputerName localhost -Port 3000
```

### Performance Debugging

```powershell
# Monitor Node process CPU/Memory
while ($true) {
    Get-Process node -ErrorAction SilentlyContinue | Format-Table Id, CPU, @{Name="Memory(MB)";Expression={[math]::Round($_.WorkingSet / 1MB, 2)}}
    Start-Sleep -Seconds 5
}

# Check disk space
Get-PSDrive C | Select-Object Used, Free, @{Name="FreePercent";Expression={[math]::Round($_.Free / ($_.Used + $_.Free) * 100, 2)}}

# Check MongoDB performance
mongosh --eval "db.serverStatus()"
```

---

## Utility Scripts

### check-status.ps1

```powershell
# Check entire system status
.\check-status.ps1

# What it checks:
# - Node processes running
# - MongoDB status
# - Port 3000 (Backend)
# - Port 5173 (Frontend)
# - Backend API health
# - Frontend accessibility
# - Environment variables
```

### start-fresh.ps1

```powershell
# Clean start both servers
.\start-fresh.ps1

# What it does:
# 1. Stops all Node processes
# 2. Waits 2 seconds
# 3. Verifies ports 3000 and 5173 are free
# 4. Checks MongoDB is running
# 5. Starts backend in new terminal
# 6. Waits for backend to be ready
# 7. Starts frontend in new terminal
# 8. Shows summary of services
```

### test-week1-api.ps1

```powershell
# Test all Week 1 API endpoints
.\test-week1-api.ps1

# What it tests:
# - Analytics endpoints (2)
# - Reports endpoints (4)
# - Activities endpoints (2)
# - Tasks endpoints (2)
# Shows pass/fail for each
```

### Custom Utility Script Example

Create your own utility script:

```powershell
# save as: restart-dev.ps1

Write-Host "🔄 Restarting Development Environment..." -ForegroundColor Cyan

# Stop processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Clear caches
Remove-Item -Path "client\.vite" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "server\dist" -Recurse -Force -ErrorAction SilentlyContinue

# Start servers
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd server; npm run dev"
Start-Sleep -Seconds 5
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"

Write-Host "✅ Development environment restarted!" -ForegroundColor Green
```

---

## 🎯 Common Workflows

### Daily Development Workflow

```powershell
# 1. Check status
.\check-status.ps1

# 2. Start servers if not running
.\start-fresh.ps1

# 3. Make code changes...

# 4. If issues, clear caches
Remove-Item -Path "client\.vite" -Recurse -Force -ErrorAction SilentlyContinue

# 5. Test changes
.\test-week1-api.ps1

# 6. Commit changes
git add .
git commit -m "feat: Add new feature"
git push
```

### Troubleshooting Workflow

```powershell
# 1. Stop everything
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Clear all caches
Remove-Item -Path "client\.vite", "server\dist" -Recurse -Force -ErrorAction SilentlyContinue

# 3. Check ports are free
netstat -ano | findstr ":3000 :5173"

# 4. Verify MongoDB running
net start MongoDB

# 5. Fresh start
.\start-fresh.ps1

# 6. Check status
.\check-status.ps1
```

### Deployment Preparation Workflow

```powershell
# 1. Pull latest changes
git pull origin main

# 2. Checkout release version
git checkout v2.0

# 3. Install dependencies
cd client && npm install
cd ../server && npm install

# 4. Build for production
cd client && npm run build
cd ../server && npm run build

# 5. Test production builds
cd client && npm run preview
cd server && npm start

# 6. Run tests
cd server && npm test
```

---

## 📝 Notes

### PowerShell Execution Policy

If scripts don't run:

```powershell
# Check current policy
Get-ExecutionPolicy

# Set policy (run as Administrator)
Set-ExecutionPolicy RemoteSigned

# Or run script with bypass
powershell -ExecutionPolicy Bypass -File .\start-fresh.ps1
```

### Aliases for Common Commands

Add to PowerShell profile (`$PROFILE`):

```powershell
# Open profile
notepad $PROFILE

# Add aliases:
function crm-status { .\check-status.ps1 }
function crm-start { .\start-fresh.ps1 }
function crm-test { .\test-week1-api.ps1 }
function crm-clean {
    Remove-Item -Path "client\.vite", "server\dist" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Caches cleared!" -ForegroundColor Green
}

# Reload profile
. $PROFILE
```

---

**Last Updated**: October 16, 2025  
**Version**: 2.0  
**Maintained by**: [@ayeendroid](https://github.com/ayeendroid)
