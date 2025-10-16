# 🔧 Troubleshooting Guide - BharatNet CRM

**Quick solutions to common problems**

---

## 📋 Quick Diagnosis

Run this first to check system status:

```powershell
.\check-status.ps1
```

If script not available:

```powershell
# Check Node processes
Get-Process node -ErrorAction SilentlyContinue

# Check ports
netstat -ano | findstr ":3000 :5173"

# Check MongoDB
Get-Service MongoDB
```

---

## 🚨 Common Problems & Solutions

### Problem 1: "Port 3000 already in use"

**Symptoms**:

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Quick Fix**:

```powershell
# Kill all Node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Wait 2 seconds
Start-Sleep -Seconds 2

# Restart servers
.\start-fresh.ps1
```

**Detailed Fix**:

```powershell
# Find what's using port 3000
netstat -ano | findstr ":3000"
# Output: TCP 0.0.0.0:3000 ... LISTENING 12345
#                                         ↑ PID

# Kill specific process
taskkill /PID 12345 /F

# Verify port is free
netstat -ano | findstr ":3000"
# Should return nothing
```

**Prevent Future Issues**:

- Always use `.\start-fresh.ps1` to start servers
- Or manually kill processes before starting new ones

---

### Problem 2: "MongoDB connection refused"

**Symptoms**:

```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Quick Fix**:

```powershell
# Start MongoDB
net start MongoDB

# Check if running
Get-Service MongoDB

# If still not working, check port
netstat -ano | findstr ":27017"
```

**Detailed Fix**:

**Option 1**: MongoDB not installed

```powershell
# Download from: https://www.mongodb.com/try/download/community
# Install and set up as Windows Service
```

**Option 2**: MongoDB not running

```powershell
# Start service
net start MongoDB

# If service doesn't exist, start manually
mongod --dbpath "C:\data\db"
```

**Option 3**: Wrong connection string

```env
# server/.env - Check this
MONGODB_URI=mongodb://localhost:27017/bharatnet-crm
#                                       ↑ Database name required
```

**Verify Connection**:

```powershell
# Test with mongosh
mongosh "mongodb://localhost:27017/bharatnet-crm"

# Should connect successfully
```

---

### Problem 3: "Too many requests" error

**Symptoms**:

```
HTTP 429: Too many requests. Please try again later.
```

**Quick Fix**:

```powershell
# Restart backend to clear rate limit counter
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
cd server
npm run dev
```

**Permanent Fix** (Already Applied in v2.0):

```typescript
// server/src/middleware/rateLimiter.ts
// Rate limiter is disabled in development
// If still seeing errors, verify NODE_ENV:
```

```powershell
# Check environment
echo $env:NODE_ENV
# Should be: development

# Set if not set
$env:NODE_ENV = "development"

# Or in server/.env
NODE_ENV=development
```

---

### Problem 4: Frontend not loading / White screen

**Symptoms**:

- Blank white page at http://localhost:5173
- No errors in terminal
- Or: "Failed to fetch dynamically imported module"

**Quick Fix**:

```powershell
# Clear Vite cache
Remove-Item -Path "client\.vite" -Recurse -Force -ErrorAction SilentlyContinue

# Restart frontend
cd client
npm run dev
```

**Detailed Fix**:

**Option 1**: Cache issue

```powershell
# Clear all Vite caches
Remove-Item -Path "client\.vite" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "client\node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "client\dist" -Recurse -Force -ErrorAction SilentlyContinue

# Hard refresh in browser
Ctrl + Shift + R  # Windows/Linux
```

**Option 2**: Build errors

```powershell
# Check frontend terminal for TypeScript errors
# Fix any errors shown
# Restart frontend
```

**Option 3**: Backend not running

```powershell
# Frontend needs backend API
# Start backend first
cd server
npm run dev

# Then frontend
cd ../client
npm run dev
```

---

### Problem 5: "Cannot find module" errors

**Symptoms**:

```
Error: Cannot find module 'express'
Error: Cannot find module 'react'
```

**Quick Fix**:

```powershell
# Reinstall dependencies
cd client
npm install

cd ../server
npm install
```

**Detailed Fix** (node_modules corruption):

```powershell
# Nuclear option - fresh install
cd client
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
npm install

cd ../server
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
npm install
```

---

### Problem 6: "Rate limit" in development

**Symptoms**:

- Dashboard showing "Too many requests"
- After 20-30 page loads
- Even in development mode

**Diagnosis**:

```powershell
# Check if rate limiter is properly disabled
# Look in server terminal for logs
```

**Fix**:

```typescript
// Verify in server/src/middleware/rateLimiter.ts
export const apiLimiter = rateLimit({
  windowMs: 900000,
  max: process.env.NODE_ENV === "production" ? 100 : 1000,
  skip: (req) => process.env.NODE_ENV !== "production", // This should be here
});
```

```powershell
# Verify environment
cd server
echo $env:NODE_ENV
# Should be: development

# If not, add to server/.env
NODE_ENV=development

# Restart backend
npm run dev
```

---

### Problem 7: Lead conversion not working

**Symptoms**:

- Validation errors when converting lead to customer
- "First name is required" etc.

**Fix** (Already Applied in v2.0):

Check these files have the fixes:

```powershell
# 1. Check validator has validateLeadUpdate
cat server\src\middleware\validators.ts | Select-String "validateLeadUpdate"
# Should find export

# 2. Check leads route uses it
cat server\src\routes\leads.ts | Select-String "validateLeadUpdate"
# Should find import and usage

# 3. Check ConvertLeadModal wraps ispData
cat client\src\components\Leads\ConvertLeadModal.tsx | Select-String "ispData:"
# Should find ispData object wrapper
```

If missing, pull latest from v2.0:

```powershell
git fetch origin
git checkout v2.0
```

---

### Problem 8: Charts not rendering

**Symptoms**:

- Dashboard shows loading indefinitely
- Or blank spaces where charts should be
- Or charts show but no data

**Diagnosis**:

```powershell
# Open browser console (F12)
# Look for errors in Console tab
# Check Network tab for failed API calls
```

**Fix Option 1**: API not returning data

```powershell
# Test API directly
Invoke-RestMethod -Uri "http://localhost:3000/api/analytics/overview?start=2024-01-01&end=2024-12-31"

# Should return JSON with data
# If 401/403: Authentication issue
# If 404: Backend not running or wrong endpoint
# If 500: Check backend terminal for errors
```

**Fix Option 2**: Recharts type errors

```powershell
cd client
npm install recharts --save
npm install --save-dev @types/recharts
```

**Fix Option 3**: Data format mismatch

```javascript
// Check console for errors like:
// "Error: dataKey is required"
// "Error: data is not an array"

// Verify data structure matches chart expectations
```

---

### Problem 9: TypeScript compilation errors

**Symptoms**:

```
TS2304: Cannot find name 'Express'
TS7016: Could not find a declaration file for module 'xyz'
```

**Fix Option 1**: Missing type definitions

```powershell
# Install types
cd client
npm install --save-dev @types/react @types/react-dom

cd ../server
npm install --save-dev @types/express @types/node @types/mongoose
```

**Fix Option 2**: tsconfig.json issues

```json
// server/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true, // Add this if type errors in node_modules
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Fix Option 3**: Clear build cache

```powershell
cd server
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
npm run build
```

---

### Problem 10: Authentication not working

**Symptoms**:

- Login failing with correct credentials
- "Invalid token" errors
- 401 Unauthorized on API calls

**Fix Option 1**: JWT secret not set

```env
# server/.env - Check this exists
JWT_SECRET=your-super-secret-key-change-in-production
```

```powershell
# Restart backend after adding
cd server
npm run dev
```

**Fix Option 2**: Token expired

```javascript
// Browser console:
localStorage.removeItem("token");
// Then login again
```

**Fix Option 3**: Token malformed

```javascript
// Browser console:
console.log(localStorage.getItem("token"));
// Should be a long string like: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// If null or malformed, remove and login again
localStorage.removeItem("token");
```

---

## 🔍 Debugging Techniques

### Enable Detailed Logging

**Backend**:

```typescript
// Temporarily add to routes
console.log("Request received:", req.method, req.url);
console.log("Request body:", req.body);
console.log("User:", (req as any).user);
```

**Frontend**:

```typescript
// Add to API calls
console.log("API call:", url, options);
// In .then()
console.log("API response:", data);
// In .catch()
console.error("API error:", error);
```

### Check Network Requests

1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Click on failed requests (red)
5. Check:
   - Headers tab: Status code, request headers
   - Response tab: Error message
   - Timing tab: How long it took

### Check Console Errors

1. Open browser console (F12)
2. Look for errors (red)
3. Click on error to see stack trace
4. Check which file/line number

### Check Backend Logs

```powershell
# Backend terminal shows logs
# Look for errors (usually in red)
# Stack traces show exact line where error occurred
```

### Test API Independently

```powershell
# Test without frontend
Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method GET

# Test with authentication
$token = "your-jwt-token"
Invoke-RestMethod -Uri "http://localhost:3000/api/customers" -Headers @{Authorization="Bearer $token"}

# Test POST with data
$body = '{"firstName":"John","lastName":"Doe","email":"john@example.com"}'
Invoke-RestMethod -Uri "http://localhost:3000/api/customers" -Method POST -Body $body -ContentType "application/json" -Headers @{Authorization="Bearer $token"}
```

---

## 🚑 Emergency Fixes

### Complete Reset (Nuclear Option)

**When to use**: Everything is broken, nothing works

```powershell
# 1. Stop all processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process mongod -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Clear all caches
Remove-Item -Path "client\.vite", "client\dist", "server\dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "client\node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue

# 3. Reinstall dependencies (if really broken)
cd client
Remove-Item -Path "node_modules" -Recurse -Force
npm install

cd ../server
Remove-Item -Path "node_modules" -Recurse -Force
npm install

# 4. Reset MongoDB (CAREFUL - deletes data!)
mongosh "mongodb://localhost:27017/bharatnet-crm" --eval "db.dropDatabase()"

# 5. Start fresh
cd ..
.\start-fresh.ps1
```

### Rollback to Stable Version

```powershell
# Check current version
git describe --tags

# View available versions
git tag

# Checkout stable version
git checkout v2.0

# Reinstall dependencies
cd client && npm install
cd ../server && npm install

# Start servers
cd ..
.\start-fresh.ps1
```

---

## 📞 Getting Help

### Before Asking for Help

1. **Check this guide** - Solution might be here
2. **Check console** - Look for error messages
3. **Check logs** - Backend terminal shows errors
4. **Test independently** - Isolate the problem
5. **Reproduce** - Can you make it happen again?

### Information to Provide

When asking for help, include:

```
1. What were you trying to do?
2. What did you expect to happen?
3. What actually happened?
4. Error messages (exact text)
5. Screenshots (if UI issue)
6. Steps to reproduce
7. Your environment:
   - OS: Windows 11
   - Node version: 18.x
   - MongoDB version: 6.x
   - Git commit: abc123
```

### Run Diagnostic Script

```powershell
# Run and share output
.\check-status.ps1 > status-report.txt
type status-report.txt
```

---

## ✅ Prevention Tips

1. **Always use `.\start-fresh.ps1`** to start servers
2. **Check status before coding**: `.\check-status.ps1`
3. **Commit working code** before major changes
4. **Clear caches after big updates**
5. **Keep dependencies updated** (but test after updating)
6. **Use proper git branches** for experiments
7. **Backup database** before major changes
8. **Test in production mode** before deploying
9. **Read error messages** carefully
10. **Google the exact error** (often has solutions)

---

**Last Updated**: October 16, 2025  
**Version**: 2.0  
**For more help**: See [PROBLEMS_AND_SOLUTIONS.md](./PROBLEMS_AND_SOLUTIONS.md)
