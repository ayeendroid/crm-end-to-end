# 🚀 IMMEDIATE ACTION GUIDE - Test Your CRM Now!

**Time Required:** 15 minutes  
**Goal:** Get your CRM running with real data

---

## Step 1: Start MongoDB (2 minutes)

### Windows:

```powershell
# Check if MongoDB is running
net start | findstr MongoDB

# If not running, start it:
net start MongoDB
```

### Mac/Linux:

```bash
# Start MongoDB
brew services start mongodb-community
# OR
sudo systemctl start mongod
```

**Verify it's running:**

```bash
mongosh
# If you see MongoDB shell, it's working! Type 'exit' to quit.
```

---

## Step 2: Seed the Database (3 minutes)

```powershell
# Navigate to server directory
cd c:\Users\anmol\Documents\CRM\server

# Run the seed script
npm run seed
```

**You should see:**

```
🌱 Starting database seeding...
✅ Connected to MongoDB
🗑️  Clearing existing data...
👤 Creating admin user...
👥 Generating 500 customers...
📋 Generating 100 leads...

🎉 Database seeding completed successfully!

📊 Summary:
   - Users: 2
   - Customers: 500
   - Leads: 100
   - Total records: 602

🔐 Login Credentials:
   Admin:
     Email: admin@bharatnet.com
     Password: Admin@1234
   Sales:
     Email: sales@bharatnet.com
     Password: Sales@1234
```

**✅ If you see this, continue!**

---

## Step 3: Start Backend Server (2 minutes)

```powershell
# In the same terminal (server directory)
npm run dev
```

**You should see:**

```
🚀 Server listening on http://localhost:3000
📋 API Endpoints available at http://localhost:3000/api
🌍 Environment: development
🗄️  Connected to MongoDB
```

**✅ Keep this terminal running!**

---

## Step 4: Test API with curl (3 minutes)

### Open a NEW PowerShell terminal and run:

**Test 1: Health Check**

```powershell
curl http://localhost:3000/
```

**Expected:** `{"ok":true,"message":"BharatNet CRM API Running",...}`

**Test 2: Login**

```powershell
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@bharatnet.com\",\"password\":\"Admin@1234\"}'
```

**Expected:** JSON with `"success":true` and a token

**Copy the token from the response!**

**Test 3: Get Customers (replace YOUR_TOKEN)**

```powershell
$token = "PASTE_YOUR_TOKEN_HERE"

curl -X GET "http://localhost:3000/api/customers?page=1&limit=10" `
  -H "Authorization: Bearer $token"
```

**Expected:** List of 10 customers with Indian names!

---

## Step 5: Start Frontend (2 minutes)

### Open ANOTHER PowerShell terminal:

```powershell
cd c:\Users\anmol\Documents\CRM\client
npm run dev
```

**You should see:**

```
VITE v4.4.5  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.29.200:5173/
```

**✅ Keep this terminal running too!**

---

## Step 6: Test Login in Browser (3 minutes)

1. **Open browser:** http://localhost:5173
2. **You should see:** Login page
3. **Enter credentials:**
   - Email: `admin@bharatnet.com`
   - Password: `Admin@1234`
4. **Click:** Sign in
5. **Result:** You should be redirected to dashboard!

**⚠️ Note:** Frontend still uses mock data. Dashboard will show demo data, not the 500 real customers yet.

---

## ✅ Success Checklist

- [ ] MongoDB is running
- [ ] Database seeded (602 records)
- [ ] Backend server running on port 3000
- [ ] API responds to curl requests
- [ ] Frontend running on port 5173
- [ ] Can login with admin@bharatnet.com

---

## 🎯 What You Just Achieved

✅ **Backend API** - Running with real database  
✅ **500 Customers** - Realistic Indian data  
✅ **100 Leads** - Connection requests  
✅ **2 Users** - Admin and Sales accounts  
✅ **Authentication** - Working JWT login  
✅ **Logging** - Winston logs in console

---

## 🐛 Troubleshooting

### Issue: "MongoDB connection failed"

**Solution:**

```powershell
# Windows
net start MongoDB

# Check if it's running
mongosh

# If mongosh fails, install/reinstall MongoDB
```

### Issue: "Port 3000 is already in use"

**Solution:**

```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill it (replace PID)
taskkill /PID <PID> /F

# Or change port in server/.env
PORT=3001
```

### Issue: "npm run seed fails"

**Solution:**

```powershell
# Make sure you're in server directory
cd server

# Install dependencies first
npm install

# Then try again
npm run seed
```

### Issue: "Cannot find module 'bcryptjs'"

**Solution:**

```powershell
cd server
npm install
```

---

## 📊 View Your Data

### Option 1: MongoDB Compass (Recommended)

1. Download: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. Open database: `bharatnet-crm`
4. Browse collections:
   - `customers` (500 records)
   - `users` (2 records)
   - `leads` (100 records)

### Option 2: MongoDB Shell

```bash
mongosh

use bharatnet-crm

# Count customers
db.customers.countDocuments()
# Should return: 500

# View first customer
db.customers.findOne()

# View all users
db.users.find()
```

---

## 🎉 Next Steps

Now that everything is running:

### Immediate (Today):

1. **Browse the database** in MongoDB Compass
2. **Test more API endpoints** with curl/Postman
3. **Check the logs** in `server/logs/`

### This Week:

1. **Connect Customers page** to real API
2. **Add loading spinners** while fetching data
3. **Add toast notifications** for success/error
4. **Test CRUD operations** (create, update, delete)

### Next Week:

1. **Connect all pages** (Leads, Deals, Activities)
2. **Write tests** for critical features
3. **Deploy to staging** environment

---

## 📞 Quick Help Commands

```bash
# Check if backend is running
curl http://localhost:3000/

# Check MongoDB
mongosh
> show dbs
> use bharatnet-crm
> db.customers.countDocuments()

# View logs
cd server
type logs\combined.log     # Windows
cat logs/combined.log      # Mac/Linux

# Restart everything
# Ctrl+C in all terminals
# Then start again: npm run dev (in both server and client)
```

---

## 🏆 Congratulations!

You now have:

- ✅ Full-stack CRM running locally
- ✅ Real database with 602 records
- ✅ Working authentication
- ✅ Professional logging
- ✅ Secure API with validation

**Your CRM is ALIVE!** 🎉

---

**Next:** Connect the frontend to show real data instead of mock data.

**Ask me:** "Connect the Customers page to the backend API"

And I'll help you display those 500 real customers! 🚀
