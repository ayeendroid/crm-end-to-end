# Email Integration Testing Checklist

## Frontend Testing

### 1. Customer List Page Test

- [ ] Navigate to http://localhost:5173/customers
- [ ] Check if "Send Email" button (purple icon) appears on each customer row
- [ ] Click "Send Email" button
- [ ] Verify EmailComposer modal opens
- [ ] Check if customer email is pre-filled in the "To" field

### 2. EmailComposer Modal Test

- [ ] Fill in Subject field
- [ ] Fill in Message field
- [ ] Click "Send Email" button
- [ ] Check for success toast notification
- [ ] Verify modal closes after sending

### 3. Customer 360 View Test

- [ ] Click on a customer name to open Customer360 view
- [ ] Check if "Send Email" button appears in header (gradient purple-pink)
- [ ] Click "Send Email" button
- [ ] Verify EmailComposer modal opens with customer email pre-filled
- [ ] Check if "Email History" tab appears in tabs section

### 4. Email History Tab Test

- [ ] Click on "Email History" tab
- [ ] Verify EmailHistory component loads
- [ ] Check if sent emails are displayed
- [ ] Test email preview modal

## Backend API Testing

### 1. Test Email Connection

```bash
curl -X GET http://localhost:3000/api/emails/test-connection \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Send Custom Email

```bash
curl -X POST http://localhost:3000/api/emails/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "message": "This is a test email",
    "type": "custom"
  }'
```

### 3. Get Email History

```bash
curl -X GET http://localhost:3000/api/emails/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Common Issues to Check

1. **Modal not opening**

   - Check browser console for errors
   - Verify state management (isEmailComposerOpen)
   - Check if EmailComposer component is imported correctly

2. **Email not sending**

   - Check SMTP configuration in server/.env
   - Verify EMAIL_USER and EMAIL_PASS are set
   - Check server logs for errors

3. **Email history not showing**

   - Check if emails are saved to database
   - Verify API route /api/emails/history works
   - Check customerId is passed correctly

4. **TypeScript errors**
   - Run: `npm run type-check` in both client and server
   - Check for missing imports
   - Verify interface definitions match

## Current Test Results

- [ ] All frontend tests passing
- [ ] All backend API tests passing
- [ ] No console errors
- [ ] No TypeScript errors
