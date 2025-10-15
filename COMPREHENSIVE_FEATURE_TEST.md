# 🧪 COMPREHENSIVE FEATURE TESTING - October 15, 2025

## 📋 What We'll Test Today

All the features we've implemented in Phase 1 & 2:

1. ✅ **Environment Configuration** - .env files with proper settings
2. ✅ **Error Handling** - Global error middleware, AppError class
3. ✅ **Input Validation** - express-validator on all routes
4. ✅ **Rate Limiting** - Brute force protection
5. ✅ **API Service Layer** - Axios with interceptors
6. ✅ **Form Validation** - Zod schemas (ready to use)
7. ✅ **Error Boundary** - React crash protection
8. ✅ **Database Seeding** - 500 customers, 100 leads, 2 users
9. ✅ **Winston Logging** - Colored console + file logs

---

## 🚀 QUICK START (5 Minutes)

### Prerequisites Check

```powershell
# Check Node.js
node --version
# Expected: v18.x or higher

# Check npm
npm --version
# Expected: 9.x or higher

# Check MongoDB
Get-Service | Where-Object {$_.Name -like "*mongo*"}
# Expected: Status = Running
```

### 1. Start MongoDB

```powershell
# If not running
net start MongoDB
```

### 2. Seed Database (First Time Only)

```powershell
cd c:\Users\anmol\Documents\CRM\server
npm run seed
```

**Expected Output:**

```
🌱 Starting database seeding...
✅ Connected to MongoDB
✅ 500 customers created
✅ 100 leads created
✅ 2 users created
🎉 Database seeding completed successfully!
```

### 3. Start Backend Server

```powershell
# In server directory
npm run dev
```

**Expected Output:**

```
[info]: 🚀 Server listening on http://localhost:3000
[info]: 🗄️  Connected to MongoDB
```

### 4. Start Frontend (New Terminal)

```powershell
cd c:\Users\anmol\Documents\CRM\client
npm run dev
```

**Expected Output:**

```
➜  Local:   http://localhost:5173/
```

---

## 🔐 TEST 1: Authentication System (5 min)

### Test 1.1: Valid Login

```powershell
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@bharatnet.com\",\"password\":\"Admin@1234\"}'
```

**✅ Expected Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "name": "Admin User",
      "email": "admin@bharatnet.com",
      "role": "admin"
    }
  }
}
```

**Save this token:**

```powershell
$token = "PASTE_YOUR_TOKEN_HERE"
```

### Test 1.2: Invalid Login

```powershell
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@bharatnet.com\",\"password\":\"wrong\"}'
```

**✅ Expected Response:**

```json
{
  "success": false,
  "error": {
    "message": "Invalid email or password"
  }
}
```

### Test 1.3: Rate Limiting Test

Run this 6 times:

```powershell
for ($i=1; $i -le 6; $i++) {
    Write-Host "Attempt $i"
    curl -X POST http://localhost:3000/api/auth/login `
      -H "Content-Type: application/json" `
      -d '{\"email\":\"test@test.com\",\"password\":\"wrong\"}'
    Start-Sleep -Seconds 1
}
```

**✅ Expected:** 6th attempt should return:

```json
{
  "success": false,
  "error": {
    "message": "Too many login attempts from this IP, please try again after 15 minutes."
  }
}
```

**📊 Results:**

- [ ] Valid login works
- [ ] Invalid login returns error
- [ ] Rate limiting blocks after 5 attempts

---

## 🛡️ TEST 2: Input Validation (5 min)

### Test 2.1: Invalid Email Format

```powershell
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test\",\"email\":\"not-an-email\",\"password\":\"Test@1234\"}'
```

**✅ Expected:**

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Please provide a valid email"
      }
    ]
  }
}
```

### Test 2.2: Weak Password

```powershell
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test\",\"email\":\"test@example.com\",\"password\":\"weak\"}'
```

**✅ Expected:**

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "field": "password",
        "message": "Password must be at least 8 characters long"
      }
    ]
  }
}
```

### Test 2.3: Missing Required Fields

```powershell
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\"}'
```

**✅ Expected:** Validation errors for missing name and password

**📊 Results:**

- [ ] Invalid email rejected
- [ ] Weak password rejected
- [ ] Missing fields caught

---

## 👥 TEST 3: Customer API (10 min)

### Test 3.1: Get All Customers (Paginated)

```powershell
curl -X GET "http://localhost:3000/api/customers?page=1&limit=10" `
  -H "Authorization: Bearer $token"
```

**✅ Expected:**

```json
{
  "success": true,
  "data": {
    "customers": [
      /* 10 customers */
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 500,
      "pages": 50
    }
  }
}
```

### Test 3.2: Search Customers

```powershell
curl -X GET "http://localhost:3000/api/customers?search=Sharma" `
  -H "Authorization: Bearer $token"
```

**✅ Expected:** Customers with "Sharma" in name

### Test 3.3: Filter by Status

```powershell
curl -X GET "http://localhost:3000/api/customers?status=active" `
  -H "Authorization: Bearer $token"
```

**✅ Expected:** Only active customers

### Test 3.4: Create Customer (Valid)

```powershell
curl -X POST http://localhost:3000/api/customers `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d '{\"firstName\":\"Test\",\"lastName\":\"Customer\",\"email\":\"test@example.com\",\"phone\":\"+91 98765 43210\",\"status\":\"active\",\"source\":\"website\"}'
```

**✅ Expected:**

```json
{
  "success": true,
  "data": {
    "customer": {
      /* new customer object */
    }
  },
  "message": "Customer created successfully"
}
```

### Test 3.5: Create Customer (Invalid)

```powershell
curl -X POST http://localhost:3000/api/customers `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d '{\"firstName\":\"A\"}'
```

**✅ Expected:** Validation errors

### Test 3.6: Unauthorized Access

```powershell
curl -X GET "http://localhost:3000/api/customers"
# No Authorization header
```

**✅ Expected:**

```json
{
  "success": false,
  "error": {
    "message": "No token, authorization denied"
  }
}
```

**📊 Results:**

- [ ] Pagination works
- [ ] Search works
- [ ] Filters work
- [ ] Customer creation works
- [ ] Validation catches errors
- [ ] Auth required

---

## 🚨 TEST 4: Error Handling (5 min)

### Test 4.1: 404 Not Found

```powershell
curl http://localhost:3000/api/nonexistent
```

**✅ Expected:**

```json
{
  "success": false,
  "error": {
    "message": "Route /api/nonexistent not found on this server"
  }
}
```

### Test 4.2: Invalid ObjectId

```powershell
curl -X GET "http://localhost:3000/api/customers/invalid-id" `
  -H "Authorization: Bearer $token"
```

**✅ Expected:**

```json
{
  "success": false,
  "error": {
    "message": "Invalid ID format"
  }
}
```

### Test 4.3: Invalid Token

```powershell
curl -X GET "http://localhost:3000/api/customers" `
  -H "Authorization: Bearer invalid_token"
```

**✅ Expected:**

```json
{
  "success": false,
  "error": {
    "message": "Invalid token. Please log in again."
  }
}
```

**📊 Results:**

- [ ] 404 handled
- [ ] Invalid ID handled
- [ ] Invalid token handled

---

## 📝 TEST 5: Logging System (5 min)

### Test 5.1: Check Console Logs

**In your server terminal, you should see colored logs:**

```
[info]: 🚀 Server listening on http://localhost:3000
[info]: 🗄️  Connected to MongoDB
[http]: POST /api/auth/login
[info]: User logged in successfully
[http]: GET /api/customers
[error]: ❌ Login failed: Invalid credentials
```

**Check:**

- [ ] Logs have colors (info=green, error=red, http=magenta)
- [ ] Timestamps are present
- [ ] HTTP requests logged
- [ ] Errors logged

### Test 5.2: Check Log Files

```powershell
cd c:\Users\anmol\Documents\CRM\server\logs
dir
```

**You should see:**

- `error.log` - Only errors
- `combined.log` - All logs
- `http.log` - HTTP requests

**View logs:**

```powershell
# View last 20 lines
Get-Content combined.log -Tail 20
```

**📊 Results:**

- [ ] Console logs colored
- [ ] Log files created
- [ ] Timestamps present
- [ ] HTTP requests logged

---

## 📊 TEST 6: Database Seeding (3 min)

### Test 6.1: Verify Data Count

```powershell
mongosh
```

```javascript
use bharatnet-crm

// Count customers
db.customers.countDocuments()
// Expected: 500

// Count leads
db.leads.countDocuments()
// Expected: 100

// Count users
db.users.countDocuments()
// Expected: 2

exit
```

### Test 6.2: Check Data Quality

```javascript
use bharatnet-crm

// View sample customer
db.customers.findOne()

// Check for Indian names
db.customers.find({firstName: "Rahul"}).count()

// Check for proper phone format
db.customers.findOne({}, {phone: 1})

// Check for Uttarakhand cities
db.customers.find({city: "Dehradun"}).count()

exit
```

**✅ Expected:**

- Indian first names (Rahul, Priya, Amit, etc.)
- Indian last names (Sharma, Kumar, Singh, etc.)
- Phone format: +91 xxxxx xxxxx
- Cities: Dehradun, Haridwar, Rishikesh, Nainital, etc.
- Realistic companies and industries

**📊 Results:**

- [ ] 500 customers exist
- [ ] 100 leads exist
- [ ] 2 users exist
- [ ] Data looks realistic
- [ ] Indian names/cities present

---

## ⚛️ TEST 7: Frontend Integration (5 min)

### Test 7.1: Login Page

1. Open http://localhost:5173
2. You should see login page
3. Enter credentials:
   - Email: `admin@bharatnet.com`
   - Password: `Admin@1234`
4. Click "Sign in"

**✅ Expected:** Redirected to dashboard

### Test 7.2: Error Boundary Test

**In browser console (F12):**

```javascript
throw new Error("Test error");
```

**✅ Expected:**

- Error boundary UI appears
- Shows error message
- "Try Again" button visible
- "Go to Dashboard" button visible

### Test 7.3: Command Palette

1. Press `Ctrl+K` (or `Cmd+K` on Mac)
2. Type "customers"
3. Click on "Go to Customers"

**✅ Expected:** Command palette opens and works

**📊 Results:**

- [ ] Frontend starts
- [ ] Login works
- [ ] Error boundary catches errors
- [ ] Command palette works

---

## 📊 FINAL TEST SCORECARD

Copy and fill this out:

```
=== AUTHENTICATION (3 tests) ===
[ ] Valid login
[ ] Invalid login
[ ] Rate limiting

=== INPUT VALIDATION (3 tests) ===
[ ] Invalid email
[ ] Weak password
[ ] Missing fields

=== CUSTOMER API (6 tests) ===
[ ] Pagination
[ ] Search
[ ] Filters
[ ] Create valid
[ ] Create invalid
[ ] Auth required

=== ERROR HANDLING (3 tests) ===
[ ] 404 handled
[ ] Invalid ID
[ ] Invalid token

=== LOGGING (2 tests) ===
[ ] Console logs
[ ] Log files

=== DATABASE (2 tests) ===
[ ] Data count correct
[ ] Data quality good

=== FRONTEND (3 tests) ===
[ ] Login page
[ ] Error boundary
[ ] Command palette

TOTAL SCORE: __ / 22
PERCENTAGE: ___%
```

---

## 🎯 SUCCESS CRITERIA

✅ **Ready to Proceed** if:

- Score >= 20/22 (90%)
- All critical tests pass:
  - Authentication works
  - Rate limiting works
  - Validation works
  - Error handling works
  - Logging works
  - Database seeded correctly

⚠️ **Needs Attention** if:

- Score 15-19/22 (68-86%)
- Some features not working

❌ **Stop and Fix** if:

- Score < 15/22 (<68%)
- Critical features broken

---

## 🐛 TROUBLESHOOTING

### MongoDB Won't Start

```powershell
# Check if process is running
Get-Process mongod

# If not running
net start MongoDB

# If service doesn't exist, start manually
mongod --dbpath "C:\data\db"
```

### Port Already in Use

```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port in .env
PORT=3001
```

### Module Not Found

```powershell
# Reinstall dependencies
cd server
npm install

cd ..\client
npm install
```

### Seed Script Fails

```powershell
# Clear database first
mongosh
use bharatnet-crm
db.dropDatabase()
exit

# Run seed again
npm run seed
```

### Token Issues

- Login again to get fresh token
- Check token expiry (default: 30 days)
- Verify JWT_SECRET in .env

---

## 📸 EVIDENCE COLLECTION

Take screenshots of:

1. **Seed Success** - Terminal showing 602 records created
2. **Server Startup** - Colored logs in terminal
3. **Login Success** - curl response with token
4. **Rate Limit** - Error after 6 attempts
5. **Validation Error** - Detailed error response
6. **Customer List** - Paginated response
7. **Log Files** - Directory with 3 log files
8. **Frontend Login** - Login page in browser
9. **MongoDB Data** - mongosh showing 500 customers

---

## 🚀 WHAT'S NEXT?

After all tests pass:

### Immediate Next Steps (2-3 hours):

1. **Connect Customers Page to API**
   - Replace mock data with real API calls
   - Add loading states
   - Add error handling
2. **Add Toast Notifications**
   - Success messages after CRUD
   - Error messages on failures
3. **Test End-to-End**
   - Create customer from UI
   - Update customer from UI
   - Delete customer from UI

### Future Enhancements (Next Phase):

1. Leads management
2. Deals pipeline
3. Activities tracking
4. Reports and analytics
5. Email integration

---

## 📞 REPORTING RESULTS

After testing, report using this format:

```
🧪 TESTING COMPLETE - [Date]

✅ PASSED: X / 22 tests
❌ FAILED: Y tests
⚠️  ISSUES: Z issues

DETAILS:
- Authentication: [X/3]
- Validation: [X/3]
- Customer API: [X/6]
- Error Handling: [X/3]
- Logging: [X/2]
- Database: [X/2]
- Frontend: [X/3]

FAILED TESTS:
1. [Test name] - [Error message]
2. ...

NOTES:
[Any observations or issues]

RECOMMENDATION:
[ ] Ready to proceed
[ ] Needs fixes
[ ] Blocked (explain)
```

---

## ⏱️ TIME ESTIMATE

- **First Time:** 45-60 minutes (includes seed)
- **Subsequent:** 20-30 minutes
- **Quick Check:** 10 minutes (key tests only)

---

**Ready to start testing? Begin with the Quick Start section!** 🚀

Let me know your results and we'll move to the next phase!
