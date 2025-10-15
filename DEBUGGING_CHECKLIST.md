# Debugging Checklist

Please help me understand what's happening:

## 1. What Error Are You Seeing?

### Option A: Toast Error Message

- [ ] "Failed to create customer"
- [ ] "Network error. Please check your connection"
- [ ] "Session expired. Please log in again"
- [ ] "Validation failed"
- [ ] Other: ******\_\_\_\_******

### Option B: Browser Console Error

Open DevTools (F12) → Console tab

- [ ] Red error messages?
- [ ] What does it say? ******\_\_\_\_******

### Option C: Network Error

Open DevTools (F12) → Network tab → Filter: XHR

- [ ] POST request to /api/customers?
- [ ] What status code? (400, 401, 404, 500)?
- [ ] What response message? ******\_\_\_\_******

### Option D: Page Won't Load

- [ ] Blank page?
- [ ] Modal doesn't open?
- [ ] Button doesn't work?

## 2. When Does It Fail?

- [ ] When page loads
- [ ] When clicking "+ New Customer"
- [ ] When filling the form
- [ ] When clicking "Create Customer"
- [ ] Other: ******\_\_\_\_******

## 3. Are You Logged In?

Check: F12 → Application → Local Storage → http://localhost:5173

- [ ] Do you see a "token" entry?
- [ ] Do you see a "user" entry?

If NO, you need to login first!

## 4. Quick Tests

### Test 1: Can you access the Customers page?

- Go to: http://localhost:5173/customers
- [ ] Page loads?
- [ ] Shows "Customers" heading?

### Test 2: Does the modal open?

- Click "+ New Customer" button
- [ ] Modal appears?
- [ ] Form fields visible?

### Test 3: Browser Console Check

- Open Console (F12)
- Look for errors
- [ ] Any red messages?
- [ ] Screenshot and share

## 5. What EXACTLY Are You Trying?

Please describe step-by-step:

1. I go to: ******\_\_\_\_******
2. I click: ******\_\_\_\_******
3. I fill: ******\_\_\_\_******
4. Then: ******\_\_\_\_******
5. Error appears: ******\_\_\_\_******

## 6. Alternative - Test with Leads

Since Leads already work, let's compare:

- Go to: http://localhost:5173/leads
- Click "+ New Lead"
- Fill: First Name, Last Name, Email
- Click "Create Lead"
- [ ] Does THIS work?

If Leads work but Customers don't, we have a specific issue to fix.

---

**Please fill this out and let me know what you see!** 🔍
