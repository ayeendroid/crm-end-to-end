# 🔧 Complete Troubleshooting Guide

## Problem: "Still not working"

I need more information to help you. Here's how to diagnose:

---

## 🎯 Step 1: Use the API Tester (EASIEST!)

I've created a standalone HTML file that tests the API directly:

1. Open this file in your browser:

   ```
   C:\Users\anmol\Documents\CRM\api-tester.html
   ```

2. Click through the tests in order:

   - **Test 1**: Backend Health Check
   - **Test 2**: Login Test
   - **Test 3**: Create Customer Test
   - **Test 4**: Get Customers Test

3. **Screenshot the results and tell me which test fails!**

This will tell us exactly where the problem is.

---

## 🎯 Step 2: Check Browser Console

1. Open http://localhost:5173
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Try to create a customer
5. **What errors do you see?** (Take a screenshot)

---

## 🎯 Step 3: Check Network Tab

1. Keep DevTools open (F12)
2. Go to **Network** tab
3. Click **"XHR"** filter at the top
4. Try to create a customer
5. Look for the POST request to `/api/customers`
6. Click on it
7. Check:
   - **Status** (should be 201 for success)
   - **Response** tab (what does it say?)
   - **Preview** tab (any error message?)

**Tell me**: What status code and response do you see?

---

## 🎯 Step 4: Common Issues & Solutions

### Issue 1: "Not Logged In"

**Symptom**: 401 Unauthorized error

**Solution**:

1. Go to http://localhost:5173/login
2. Register a new account or login
3. Then try creating a customer

### Issue 2: "Backend Not Running"

**Symptom**: Network error, "Failed to fetch"

**Solution**:

```powershell
# Stop all
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

# Restart
cd C:\Users\anmol\Documents\CRM
npm run dev
```

### Issue 3: "MongoDB Not Connected"

**Symptom**: Backend logs show "Failed to connect to MongoDB"

**Solution**:

1. Make sure MongoDB is running
2. Check connection string in `.env`
3. Try: `mongodb://localhost:27017/crm`

### Issue 4: "Validation Error"

**Symptom**: 400 Bad Request, "Validation failed"

**This means it's WORKING!** Just fill all required fields:

- First Name
- Last Name
- Email

### Issue 5: "Vite Cache Problem"

**Symptom**: Old code still running

**Solution**:

```powershell
# Kill all Node
Stop-Process -Name "node" -Force

# Clear Vite cache
Remove-Item -Recurse -Force C:\Users\anmol\Documents\CRM\client\node_modules\.vite

# Restart
cd C:\Users\anmol\Documents\CRM
npm run dev
```

### Issue 6: "Module Not Found"

**Symptom**: Cannot find module 'customerService'

**Solution**:

```powershell
cd C:\Users\anmol\Documents\CRM\client
npm install
```

---

## 🎯 Step 5: Test Leads Instead

If you're still stuck, test the Leads module (which we know works):

1. Go to: http://localhost:5173/leads
2. Click "+ New Lead"
3. Fill: First Name, Last Name, Email
4. Click "Create Lead"

**Does this work?**

- ✅ If YES: The issue is specific to Customers
- ❌ If NO: The issue is with authentication or backend

---

## 🎯 Step 6: Check Terminal Output

Look at your terminal where `npm run dev` is running.

**Look for**:

- `[0] 🚀 Server listening on http://localhost:3000` ✅
- `[0] 🗄️ Connected to MongoDB` ✅
- `[1] ➜ Local: http://localhost:5173/` ✅

**Bad signs**:

- ❌ Any error messages
- ❌ "Failed to connect"
- ❌ Port already in use

---

## 🎯 Step 7: Manual API Test

Open PowerShell and test the API directly:

```powershell
# Test if backend is alive
curl http://localhost:3000/api/customers

# Should get 401 (Unauthorized) - this is GOOD!
# It means backend is running
```

---

## 🎯 What to Tell Me

Please provide ANY of the following:

1. **Screenshot of api-tester.html results** ⭐ BEST OPTION
2. **Browser console errors** (F12 → Console)
3. **Network tab response** (F12 → Network → XHR)
4. **Exact error message** you see
5. **Terminal output** (both backend and frontend)
6. **Does Leads module work?** (Yes/No)

Without this information, I'm guessing blindly! 🔍

---

## 🎯 Nuclear Option: Complete Reset

If nothing works, try this:

```powershell
# 1. Stop everything
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

# 2. Go to project
cd C:\Users\anmol\Documents\CRM

# 3. Clean everything
Remove-Item -Recurse -Force client\node_modules\.vite -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force client\dist -ErrorAction SilentlyContinue

# 4. Reinstall
cd client
npm install

# 5. Go back and restart
cd ..
npm run dev
```

Then test again.

---

## 📝 Quick Checklist

Before you say "not working", please confirm:

- [ ] Backend is running (check terminal: `Server listening on http://localhost:3000`)
- [ ] Frontend is running (check terminal: `Local: http://localhost:5173`)
- [ ] MongoDB is connected (check terminal: `Connected to MongoDB`)
- [ ] You are logged in (check browser: F12 → Application → Local Storage → token exists)
- [ ] You filled all required fields (First Name, Last Name, Email)
- [ ] You opened browser console (F12) and checked for errors

---

## 🆘 I'm Here to Help!

Just tell me:

1. **What you tried**
2. **What you see** (error message, screenshot, console log)
3. **Which test from api-tester.html failed**

And I'll fix it! 🚀
