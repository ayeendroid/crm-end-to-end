# Manual Testing Guide - Customer Update Fix

## 🎯 What Was Fixed

**Problem**: Customer create/update operations were failing
**Root Cause**: Using raw `fetch()` instead of proper service layer
**Solution**: Migrated to `customerService` with axios interceptors

## ✅ Fixes Applied

1. **CreateCustomerModal.tsx** - Now uses `createCustomer()` service
2. **EditCustomerModal.tsx** - Now uses `updateCustomer()` service
3. Added proper TypeScript type assertions
4. Added missing `source` field requirement

## 🧪 Test Plan

### Test 1: Create New Customer (Basic Info)

1. Go to http://localhost:5174/customers
2. Click "+ New Customer" button
3. Fill in:
   - First Name: "John"
   - Last Name: "Doe"
   - Email: "john.doe@example.com"
   - Phone: "+919876543210"
   - Company: "Tech Corp"
   - Status: "Active"
4. Click "Create Customer"

**Expected Result**: ✅

- Green success toast: "Customer created successfully!"
- Modal closes
- Customer appears in the list
- No console errors

**If it fails**: ❌

- Check browser console for errors
- Check Network tab for failed API call
- Verify backend is running (http://localhost:3000)
- Verify you're logged in (check localStorage for token)

---

### Test 2: Create Customer (Full ISP Data)

1. Click "+ New Customer"
2. Fill basic info (First Name, Last Name, Email)
3. Scroll down to ISP Data section
4. Fill in:
   - Plan Type: "Fiber"
   - Speed: "100Mbps"
   - Price: 999
   - Billing Cycle: "Monthly"
   - Select OTT Apps: Netflix, Prime Video
   - Live Channels: 200
5. Fill address:
   - Street: "123 Main St"
   - City: "Mumbai"
   - State: "Maharashtra"
   - ZIP: "400001"
   - Country: "India"
6. Click "Create Customer"

**Expected Result**: ✅

- Customer created with all ISP data
- All fields saved correctly

---

### Test 3: Update Existing Customer

1. Find any customer in the list
2. Click the "Edit" (pencil) icon
3. Change:
   - First Name to something new
   - Email to a new email
   - Status to "Inactive"
4. Click "Update Customer"

**Expected Result**: ✅

- Green success toast: "Customer updated successfully!"
- Modal closes
- Changes reflected in the list immediately
- No console errors

---

### Test 4: Update Customer ISP Plan

1. Click "Edit" on any customer
2. Scroll to ISP Data
3. Change:
   - Plan Type: "Broadband" → "Fiber"
   - Speed: "50Mbps" → "200Mbps"
   - Price: 599 → 1499
4. Click "Update Customer"

**Expected Result**: ✅

- ISP plan updated
- Changes saved to database

---

### Test 5: Validation Errors

1. Click "+ New Customer"
2. Leave First Name empty
3. Enter invalid email: "notanemail"
4. Click "Create Customer"

**Expected Result**: ✅

- Red error toast with validation message
- Form doesn't submit
- Modal stays open
- User can fix errors

**Error Messages to Expect**:

- "First name is required"
- "Please provide a valid email"

---

### Test 6: Delete Customer

1. Click "Delete" (trash) icon on any customer
2. Confirm deletion in the dialog
3. Check the list

**Expected Result**: ✅

- Customer removed from list
- Success toast message
- No errors

---

### Test 7: Search and Filter

1. Use search box to search for "John"
2. Change status filter to "Active"
3. Try filter by churn risk
4. Clear filters

**Expected Result**: ✅

- Results update in real-time
- Pagination works correctly
- No errors

---

### Test 8: Authentication Error Handling

1. Open DevTools → Application → LocalStorage
2. Delete the "token" entry
3. Try to create a customer

**Expected Result**: ✅

- Red error toast: "Session expired. Please log in again."
- Redirected to login page automatically

---

## 🔍 What to Check in Browser DevTools

### Console Tab

**Should NOT see**:

- ❌ Uncaught TypeError
- ❌ Network Error
- ❌ 401 Unauthorized (unless token expired)
- ❌ 400 Bad Request (unless validation failed)

**Might see** (normal):

- ⚠️ "[HMR] connected" - Vite hot reload
- ℹ️ "React Query cache updated" - React Query working

### Network Tab

1. Filter by "XHR"
2. Watch for API calls

**For Create Customer**:

- Method: POST
- URL: http://localhost:3000/api/customers
- Status: 201 Created
- Response: `{ "success": true, "data": { "customer": {...} } }`

**For Update Customer**:

- Method: PUT
- URL: http://localhost:3000/api/customers/:id
- Status: 200 OK
- Response: `{ "success": true, "data": { "customer": {...} } }`

**For Delete Customer**:

- Method: DELETE
- URL: http://localhost:3000/api/customers/:id
- Status: 200 OK
- Response: `{ "success": true, "message": "Customer deleted successfully" }`

**Headers to Verify**:

- Authorization: Bearer [token]
- Content-Type: application/json

---

## 🐛 Troubleshooting

### Issue: "Failed to create customer"

**Check**:

1. Is backend running? (http://localhost:3000/api should respond)
2. Is MongoDB running? (check backend logs)
3. Are you logged in? (check localStorage for token)
4. Is the form data valid? (check required fields)

**Solution**:

- Restart backend: `cd server && npm run dev`
- Clear localStorage and re-login
- Check backend logs for actual error

---

### Issue: "Network error. Please check your connection."

**Check**:

1. Backend not running
2. CORS issues
3. Wrong API URL

**Solution**:

- Verify backend on http://localhost:3000
- Check CORS settings in `server/src/index.ts`
- Verify `VITE_API_URL` in `.env`

---

### Issue: "Validation failed"

**Check**:

- First name (required, 2-50 chars)
- Last name (required, 2-50 chars)
- Email (required, valid format)
- Phone (optional, but must be valid format if provided)

**Solution**:

- Fill all required fields
- Use valid email format
- Use valid phone format: +919876543210

---

### Issue: Modal doesn't close after success

**Check**:

- Browser console for errors
- React Query not invalidating cache

**Solution**:

- Hard refresh: Ctrl+Shift+R
- Check `onSuccess()` callback is being called

---

## ✨ Additional Tests to Try

### Test 9: Create Multiple Customers

Create 5 customers with different:

- Statuses (Active, Inactive, Prospect)
- Sources (Website, Referral, Social)
- Plan Types (Fiber, Broadband, Wireless)

**Verify**: All show up in the list with correct data

---

### Test 10: Pagination

1. Create 25+ customers
2. Check pagination at bottom
3. Click page 2, page 3
4. Change items per page

**Verify**: Pagination works smoothly

---

### Test 11: React Query Caching

1. Create a customer
2. Navigate to Dashboard
3. Return to Customers page
4. Edit that customer
5. Navigate away and back

**Verify**: Data loads instantly from cache

---

## 📊 Success Criteria

All tests should pass with:

- ✅ No console errors
- ✅ Success toast messages
- ✅ Data persists after refresh
- ✅ Modals open/close smoothly
- ✅ Real-time updates in the list
- ✅ Proper error messages for invalid data
- ✅ Authentication handled correctly

---

## 🚀 After Testing

Once all tests pass:

1. Test Leads module (same pattern)
2. Test Deals module (same pattern)
3. Test Pipeline drag-and-drop
4. Run backend tests: `cd server && npm test`

---

## 📝 Report Issues

If you find any issues:

1. Note the exact steps to reproduce
2. Screenshot any error messages
3. Copy console errors
4. Copy Network tab request/response
5. Share backend logs

---

## 🎉 Expected Outcome

After these fixes, the Customer module should:

- ✅ Create customers successfully
- ✅ Update customers successfully
- ✅ Delete customers successfully
- ✅ Handle errors gracefully
- ✅ Show user-friendly messages
- ✅ Work consistently with Leads and Deals

**The frontend is now using the same service layer pattern across all modules!** 🎯
