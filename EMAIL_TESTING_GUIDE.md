# Email Integration Testing Guide

## Status: Ready to Test ✅

The email integration in Customer360View is properly configured with:

- EmailComposer receives correct `customerId={customer._id}`
- EmailHistory displays emails for `customerId={customer._id}`
- Modal opens/closes correctly

---

## Testing Steps

### 1. **Navigate to Customer360**

```
1. Go to Customers page
2. Click on any customer name (e.g., "Ken Adams")
3. Customer360 view should open with correct customer data
```

### 2. **Send Test Email**

```
1. In Customer360, click "Send Email" button
2. Email composer modal should open
3. Verify:
   - "To" field is pre-filled with customer email
   - Subject and body are editable
4. Fill in:
   - Subject: "Test Email from CRM"
   - Body: "This is a test email to verify the integration"
5. Click "Send"
6. Should show success message
```

### 3. **Verify Email in MongoDB**

```powershell
# Run this command in terminal
node scripts/check-emails.js
```

**Expected Output:**

```json
{
  "_id": "...",
  "customerId": "67xxxxx..." // Should be MongoDB ObjectId, NOT "1"
  "to": "ken@example.com",
  "from": "crm@bharatnet.com",
  "subject": "Test Email from CRM",
  "body": "This is a test email to verify the integration",
  "status": "sent",
  "sentAt": "2025-10-16T...",
  "createdAt": "2025-10-16T..."
}
```

### 4. **Check Email History Tab**

```
1. Still in Customer360 view
2. Click on "Email History" tab
3. Should display:
   - The email you just sent
   - Proper date/time
   - Subject and preview
   - Sent status
```

### 5. **Test Multiple Emails**

```
1. Send 2-3 more test emails to the same customer
2. Verify all appear in Email History tab
3. Check they're sorted by date (newest first)
```

---

## Verification Checklist

### ✅ EmailComposer

- [ ] Opens when clicking "Send Email" button
- [ ] Pre-fills customer email in "To" field
- [ ] Allows editing subject and body
- [ ] Shows loading state when sending
- [ ] Shows success message on send
- [ ] Closes after successful send
- [ ] Handles errors gracefully

### ✅ Email Storage

- [ ] Email saved to MongoDB
- [ ] `customerId` is correct MongoDB ObjectId (not "1")
- [ ] All fields saved correctly (to, from, subject, body)
- [ ] `status` is "sent"
- [ ] `sentAt` timestamp is correct
- [ ] `createdAt` and `updatedAt` timestamps present

### ✅ EmailHistory

- [ ] Displays on "Email History" tab
- [ ] Shows all emails for this customer
- [ ] Displays correct information (subject, date, status)
- [ ] Sorted by date (newest first)
- [ ] Shows "No emails" message when empty
- [ ] Updates after sending new email

---

## Common Issues & Solutions

### Issue 1: Email not saving

**Symptom**: Success message shown but email not in MongoDB

**Solution**:

```bash
# Check backend logs
# Terminal should show: "Email sent successfully"

# Verify email service is configured
# Check server/src/services/emailService.ts
```

### Issue 2: customerId is "1" instead of ObjectId

**Symptom**: In MongoDB, `customerId: "1"`

**Solution**: Already fixed in Customer360View.tsx line 722:

```typescript
customerId={customer._id} // Correct!
```

### Issue 3: Email History empty

**Symptom**: Tab shows "No emails" despite sending emails

**Check**:

1. EmailHistory component receives correct `customerId={customer._id}`
2. API endpoint `/api/emails?customerId=...` returns data
3. Network tab shows successful API call

### Issue 4: Modal doesn't close

**Symptom**: Email composer stays open after sending

**Fix**: Check onClose callback is called in EmailComposer component

---

## Manual MongoDB Verification

### Connect to MongoDB:

```bash
# If using MongoDB Compass
mongodb://localhost:27017/bharatnet-crm

# Or using mongo shell
mongosh
use bharatnet-crm
```

### Check Emails:

```javascript
// Find all emails
db.emails.find().pretty();

// Find emails for specific customer
db.emails.find({ customerId: ObjectId("YOUR_CUSTOMER_ID") }).pretty();

// Count emails
db.emails.countDocuments();

// Find recent emails
db.emails.find().sort({ createdAt: -1 }).limit(5).pretty();
```

### Verify Customer ID:

```javascript
// Get a customer ID
db.customers.findOne({ firstName: "Ken" });

// Use that ID to find emails
db.emails.find({ customerId: ObjectId("PASTE_ID_HERE") }).pretty();
```

---

## API Endpoint Testing

### Send Email API:

```bash
# Using PowerShell
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer YOUR_JWT_TOKEN"
}

$body = @{
    customerId = "67xxxxxx..."
    to = "test@example.com"
    subject = "API Test"
    body = "Testing email API"
} | ConvertTo-Json

Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/emails/send" -Headers $headers -Body $body
```

### Get Customer Emails API:

```bash
# Get emails for customer
curl http://localhost:3000/api/emails?customerId=67xxxxxx...
```

---

## Expected Behavior Summary

| Action              | Expected Result                     |
| ------------------- | ----------------------------------- |
| Click customer name | Opens Customer360 with correct data |
| Click "Send Email"  | Modal opens with pre-filled email   |
| Type subject/body   | Text appears in fields              |
| Click "Send"        | Shows loading, then success message |
| Check MongoDB       | Email saved with correct customerId |
| View Email History  | Shows sent email in list            |
| Send another email  | Appears in history immediately      |

---

## Next Steps After Testing

Once email integration is verified:

1. ✅ **Search Functionality** - Already working perfectly!
2. ✅ **Email Integration** - Testing in progress
3. ⏭️ **Automated Testing Suite** - Write tests for all features
4. ⏭️ **Authentication System** - Complete user auth flow
5. ⏭️ **Real-time Notifications** - WebSocket for live updates
6. ⏭️ **Analytics Dashboard** - Enhanced metrics and charts
7. ⏭️ **Report Generation** - PDF/Excel export functionality

---

## Test Results Template

```
Date: _______________
Tester: _______________

Email Composer: ✅ / ❌
- Opens correctly: ___
- Pre-fills email: ___
- Sends successfully: ___

MongoDB Storage: ✅ / ❌
- Email saved: ___
- Correct customerId: ___
- All fields present: ___

Email History: ✅ / ❌
- Displays emails: ___
- Shows correct data: ___
- Updates after send: ___

Issues Found:
1. _______________
2. _______________
3. _______________

Notes:
_______________
```

---

## Ready to Test! 🚀

The email integration is properly configured. Follow the testing steps above and report any issues you find!
