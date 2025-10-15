# Customer Management - Testing Guide 🧪

## ✅ Pre-Test Checklist

- ✅ Backend running on http://localhost:3000
- ✅ Frontend running on http://localhost:5173
- ✅ MongoDB connected (602 records: 500 customers, 100 leads, 2 users)
- ✅ CREATE modal implemented and integrated
- ✅ EDIT modal implemented and integrated
- ✅ DELETE functionality working

---

## 🎯 Test Plan - Customer CRUD Operations

### TEST 1: CREATE Customer (New Feature)

**Time**: 3-5 minutes

**Steps**:

1. Navigate to http://localhost:5173/customers-new
2. Click **"Add Customer"** button (blue button, top right)
3. Fill in the form:

   **Basic Information**:

   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@test.com`
   - Phone: `+91 98765 43210`
   - Company: `Test Corp`

   **Address**:

   - Street: `123 Test Street`
   - City: `Mumbai`
   - State: `Maharashtra`
   - ZIP: `400001`
   - Status: `active`

   **ISP Plan**:

   - Plan Type: `Fiber`
   - Speed: `100Mbps`
   - Price: `999`
   - Billing Cycle: `monthly`
   - Live Channels: `100`
   - OTT Apps: Click `Netflix` and `Amazon Prime`

4. Click **"Create Customer"** button
5. Wait for success toast notification

**Expected Results**:

- ✅ Success toast appears: "Customer created successfully!"
- ✅ Modal closes automatically
- ✅ John Doe appears in the customer list (may be on last page)
- ✅ Total customer count increases by 1
- ✅ Search for "John Doe" finds the new customer

**Verify**:

```
✓ Customer appears in list
✓ Name: John Doe
✓ Email: john.doe@test.com
✓ Plan: Fiber
✓ Speed: 100Mbps
✓ Price: ₹999/mo
✓ Status: active (green badge)
```

---

### TEST 2: SEARCH for New Customer

**Time**: 1 minute

**Steps**:

1. In the search bar, type: `John Doe`
2. Wait for results to filter

**Expected Results**:

- ✅ Only John Doe appears in the list
- ✅ Other customers are hidden
- ✅ Stats cards remain accurate

---

### TEST 3: EDIT Customer (New Feature)

**Time**: 3-5 minutes

**Steps**:

1. Find "John Doe" in the customer list (use search if needed)
2. Click the **blue pencil icon** (Edit button) in the Actions column
3. Modal opens with pre-filled data
4. Verify all fields are populated correctly
5. Make the following changes:

   **Update Basic Info**:

   - Company: Change to `Updated Test Corp`

   **Update ISP Plan**:

   - Plan Type: Change to `Broadband`
   - Speed: Change to `200Mbps`
   - Price: Change to `1499`
   - OTT Apps: Add `Disney+ Hotstar` (click to toggle)

6. Click **"Update Customer"** button
7. Wait for success toast notification

**Expected Results**:

- ✅ Success toast appears: "Customer updated successfully!"
- ✅ Modal closes automatically
- ✅ Changes reflect in the customer list immediately
- ✅ John Doe now shows:
  - Company: Updated Test Corp
  - Plan: Broadband (changed from Fiber)
  - Speed: 200Mbps (changed from 100Mbps)
  - Price: ₹1499/mo (changed from ₹999)

**Verify Updates**:

```
✓ Plan type changed: Fiber → Broadband
✓ Speed changed: 100Mbps → 200Mbps
✓ Price changed: ₹999 → ₹1499
✓ Company updated: Test Corp → Updated Test Corp
✓ OTT apps include all 3: Netflix, Prime, Hotstar
```

---

### TEST 4: FILTER Customers

**Time**: 2 minutes

**Steps**:

1. Click **"Filters"** button
2. Test Status filter:
   - Select "Active" from Status dropdown
   - Verify only active customers show (including John Doe)
3. Test Plan Type filter:
   - Select "Broadband" from Plan Type dropdown
   - Verify John Doe appears (since we changed him to Broadband)
4. Clear filters by selecting "All" options

**Expected Results**:

- ✅ Filters work correctly
- ✅ Customer count updates based on filters
- ✅ John Doe appears when filtering by:
  - Status: Active
  - Plan Type: Broadband

---

### TEST 5: DELETE Customer

**Time**: 1 minute

**Steps**:

1. Find "John Doe" in the customer list
2. Click the **red trash icon** (Delete button)
3. Browser confirmation dialog appears
4. Click "OK" to confirm deletion
5. Wait for success toast notification

**Expected Results**:

- ✅ Confirmation dialog: "Are you sure you want to delete John Doe?"
- ✅ Success toast appears: "Customer deleted successfully"
- ✅ John Doe disappears from the list
- ✅ Total customer count decreases by 1
- ✅ Search for "John Doe" returns no results

---

### TEST 6: Pagination

**Time**: 1 minute

**Steps**:

1. Note total customer count (should be back to 500 after deleting test)
2. Verify showing "1 to 20 of 500 results"
3. Click "Next" button at bottom
4. Verify page 2 shows customers 21-40
5. Click page number buttons (e.g., click "3")
6. Verify page navigation works smoothly

**Expected Results**:

- ✅ 20 customers per page
- ✅ Total pages: 25 (500 ÷ 20)
- ✅ "Next" and "Previous" buttons work
- ✅ Direct page number navigation works
- ✅ Current page is highlighted in blue

---

### TEST 7: Stats Cards Accuracy

**Time**: 1 minute

**Steps**:

1. Note the stats at the top:
   - Total Customers
   - High Churn Risk
   - Fiber Customers
   - Active Customers
2. Apply filters and verify stats update
3. Remove filters and verify stats return to original

**Expected Results**:

- ✅ Stats match filtered results
- ✅ Stats are accurate and consistent
- ✅ Real-time updates as filters change

---

### TEST 8: CREATE Multiple Customers

**Time**: 5 minutes

**Purpose**: Test with more data

**Steps**:

1. Create 3 more test customers with different data:

   **Customer 1**:

   - Name: Jane Smith
   - Email: jane.smith@test.com
   - Plan: Fiber, 500Mbps, ₹1999
   - Status: active

   **Customer 2**:

   - Name: Bob Wilson
   - Email: bob.wilson@test.com
   - Plan: Wireless, 50Mbps, ₹599
   - Status: prospect

   **Customer 3**:

   - Name: Alice Brown
   - Email: alice.brown@test.com
   - Plan: Broadband, 100Mbps, ₹799
   - Status: inactive

2. Search for each customer to verify creation
3. Edit one of them to change plan details
4. Delete all test customers to clean up

**Expected Results**:

- ✅ All 3 customers created successfully
- ✅ Each appears in search
- ✅ Edit works on any of them
- ✅ Delete works for cleanup

---

### TEST 9: Form Validation

**Time**: 2 minutes

**Steps**:

1. Click "Add Customer"
2. Try to submit without filling required fields
3. Try to submit with invalid email format
4. Verify validation messages appear

**Expected Results**:

- ✅ Required fields show validation error
- ✅ Email field validates format
- ✅ Cannot submit incomplete form
- ✅ Clear error messages

---

### TEST 10: Error Handling

**Time**: 1 minute

**Purpose**: Test with duplicate email

**Steps**:

1. Click "Add Customer"
2. Use an email that already exists (e.g., from existing 500 customers)
3. Try to submit
4. Check for error handling

**Expected Results**:

- ✅ Backend returns error for duplicate email
- ✅ Error toast appears
- ✅ Form doesn't close
- ✅ User can correct and retry

---

## 📊 Test Results Checklist

After completing all tests, mark off what works:

### CREATE Functionality:

- [ ] Modal opens correctly
- [ ] All form fields accept input
- [ ] OTT apps toggle works
- [ ] Validation works (required fields)
- [ ] Submit button works
- [ ] Success toast appears
- [ ] New customer appears in list
- [ ] Modal closes after success
- [ ] Stats update correctly

### EDIT Functionality:

- [ ] Edit button opens modal
- [ ] Form pre-populates with existing data
- [ ] All fields are editable
- [ ] OTT apps show correct selection
- [ ] Changes save correctly
- [ ] Success toast appears
- [ ] Updates reflect immediately
- [ ] Modal closes after success

### DELETE Functionality:

- [ ] Delete button triggers confirmation
- [ ] Confirmation shows customer name
- [ ] Delete removes customer
- [ ] Success toast appears
- [ ] Stats update correctly

### Search & Filter:

- [ ] Search works for name
- [ ] Search works for email
- [ ] Search works for phone
- [ ] Status filter works
- [ ] Churn risk filter works
- [ ] Plan type filter works
- [ ] Multiple filters work together

### Pagination:

- [ ] Shows correct page count
- [ ] Next/Previous buttons work
- [ ] Direct page navigation works
- [ ] Shows correct items per page (20)

### Overall:

- [ ] No console errors
- [ ] Loading states work
- [ ] Error states work
- [ ] Toast notifications work
- [ ] UI is responsive
- [ ] Performance is acceptable

---

## 🐛 Bug Report Template

If you find any issues, document them like this:

```
BUG: [Short description]
Steps to Reproduce:
1.
2.
3.

Expected:
Actual:
Severity: [High/Medium/Low]
Console Errors: [Yes/No - copy error if yes]
```

---

## ✅ Sign-Off

After testing, mark the completion:

**Tester**: **********\_\_\_**********
**Date**: October 15, 2025
**Test Duration**: **\_\_\_** minutes
**Bugs Found**: **\_\_\_**
**Status**: [ ] PASS [ ] FAIL [ ] PASS WITH ISSUES

**Notes**:

---

---

---

## 🚀 Next Steps After Testing

Based on test results:

1. **All Pass**: Move to Phase C (comprehensive testing) or Leads Management
2. **Minor Issues**: Fix bugs, re-test
3. **Major Issues**: Debug and resolve critical bugs

Ready to test! 🎯
