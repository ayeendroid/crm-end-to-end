# 🚀 Quick Reference Card - BharatNet CRM

**One-page cheat sheet for daily development**

---

## ⚡ Essential Commands

### Start/Stop Servers

```powershell
# Start (Automated - Recommended)
.\start-fresh.ps1

# Start (Manual)
cd server; npm run dev          # Terminal 1 - Backend
cd client; npm run dev          # Terminal 2 - Frontend

# Stop
Ctrl + C                        # In each terminal
Get-Process node | Stop-Process -Force  # Kill all
```

### Check Status

```powershell
.\check-status.ps1              # Full system check
Get-Process node                # List Node processes
netstat -ano | findstr ":3000 :5173"  # Check ports
Get-Service MongoDB             # Check MongoDB
```

### Clear Caches

```powershell
# Vite cache (frontend issues)
Remove-Item -Path "client\.vite" -Recurse -Force

# Build artifacts
Remove-Item -Path "client\dist", "server\dist" -Recurse -Force

# Node modules (corruption)
cd client; Remove-Item "node_modules" -Recurse -Force; npm install
cd server; Remove-Item "node_modules" -Recurse -Force; npm install
```

---

## 🌐 Access URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:5173 | Main application |
| **Backend API** | http://localhost:3000 | REST API |
| **Health Check** | http://localhost:3000/api/health | API status |
| **MongoDB** | mongodb://localhost:27017 | Database |

---

## 🔑 Default Credentials

```
Email: admin@bharatnet.com
Password: admin123
```

---

## 📁 Project Structure

```
crm-end-to-end/
├── client/src/
│   ├── components/         # UI components
│   ├── pages/             # Page components
│   ├── services/          # API calls
│   ├── types/             # TypeScript types
│   └── App.tsx            # Main app + routing
│
├── server/src/
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth, validation
│   └── index.ts           # Server entry
│
└── Documentation/         # All guides
```

---

## 🛠️ Git Workflow

```powershell
# Create branch
git checkout -b feature/name

# Stage changes
git add .

# Commit (use conventional commits)
git commit -m "feat: Add feature"
git commit -m "fix: Fix bug"
git commit -m "docs: Update docs"

# Push
git push origin branch-name

# Pull latest
git pull origin main

# Check versions
git tag
git checkout v2.0
```

---

## 🧪 Testing

```powershell
# Backend tests
cd server; npm test

# API tests
.\test-week1-api.ps1

# Test single endpoint
Invoke-RestMethod -Uri "http://localhost:3000/api/health"

# With auth token
$token = "your-token"
Invoke-RestMethod -Uri "http://localhost:3000/api/customers" -Headers @{Authorization="Bearer $token"}
```

---

## 🗄️ MongoDB Commands

```powershell
# Start/Stop service
net start MongoDB
net stop MongoDB

# Connect to shell
mongosh "mongodb://localhost:27017/bharatnet-crm"
```

**In MongoDB Shell:**
```javascript
show dbs                        // List databases
use bharatnet-crm              // Switch database
show collections               // List collections
db.customers.find().pretty()   // View customers
db.customers.countDocuments()  // Count documents
db.customers.deleteMany({})    // Clear collection
```

---

## 🔧 Common Issues

### Port 3000 in use
```powershell
Get-Process node | Stop-Process -Force
.\start-fresh.ps1
```

### Frontend won't load
```powershell
Remove-Item "client\.vite" -Recurse -Force
cd client; npm run dev
```

### MongoDB not connecting
```powershell
net start MongoDB
Get-Service MongoDB
```

### Rate limit error (development)
```powershell
# Restart backend to clear counter
Get-Process node | Stop-Process -Force
cd server; npm run dev
```

### TypeScript errors after pull
```powershell
cd client; npm install
cd server; npm install
```

---

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/register      # Register user
POST   /api/auth/login         # Login
GET    /api/auth/me            # Get current user
```

### Customers
```
GET    /api/customers          # List all
GET    /api/customers/:id      # Get one
POST   /api/customers          # Create
PUT    /api/customers/:id      # Update
DELETE /api/customers/:id      # Delete
```

### Leads
```
GET    /api/leads              # List all
POST   /api/leads              # Create
PUT    /api/leads/:id          # Update
POST   /api/leads/:id/convert  # Convert to customer
DELETE /api/leads/:id          # Delete
```

### Deals
```
GET    /api/deals              # List all
POST   /api/deals              # Create
PUT    /api/deals/:id          # Update
PATCH  /api/deals/:id/stage    # Update stage
DELETE /api/deals/:id          # Delete
```

### Reports
```
GET    /api/reports/revenue    # Revenue report
GET    /api/reports/deals      # Deals report
GET    /api/reports/leads      # Leads report
```

### Analytics
```
GET    /api/analytics/overview        # Overview stats
GET    /api/analytics/revenue-trend   # Revenue by month
GET    /api/analytics/deal-funnel     # Deal pipeline
GET    /api/analytics/lead-sources    # Lead sources
GET    /api/analytics/conversion-funnel  # Conversion rates
```

### Tasks & Activities
```
GET    /api/tasks              # List tasks
POST   /api/tasks              # Create task
PUT    /api/tasks/:id          # Update task
DELETE /api/tasks/:id          # Delete task
GET    /api/activities         # List activities
```

---

## 🎨 UI Components

### Import common components
```typescript
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
```

### Use React Query
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

// Fetch data
const { data, isLoading } = useQuery({
  queryKey: ['customers'],
  queryFn: customerService.getCustomers,
});

// Mutate data
const mutation = useMutation({
  mutationFn: customerService.createCustomer,
  onSuccess: () => queryClient.invalidateQueries(['customers']),
});
```

---

## 🎯 Daily Workflow

### Morning Routine
```powershell
1. Pull latest code:       git pull origin main
2. Check status:           .\check-status.ps1
3. Start servers:          .\start-fresh.ps1
4. Verify in browser:      http://localhost:5173
```

### Before Lunch
```powershell
1. Commit progress:        git add .; git commit -m "wip: description"
2. Push backup:            git push origin branch-name
```

### End of Day
```powershell
1. Run tests:              cd server; npm test
2. Commit final work:      git add .; git commit -m "feat: final message"
3. Push to GitHub:         git push origin branch-name
4. Stop servers:           Ctrl + C (both terminals)
```

---

## 🐛 Debug Checklist

When something breaks:

1. **Check console** (F12 in browser)
2. **Check terminal** (look for errors)
3. **Check status** (`.\check-status.ps1`)
4. **Clear cache** (Vite cache, build folders)
5. **Restart servers** (`.\start-fresh.ps1`)
6. **Check MongoDB** (`Get-Service MongoDB`)
7. **Reinstall deps** (if really stuck)
8. **Check docs** (TROUBLESHOOTING.md)

---

## 💡 Pro Tips

1. **Use automated scripts** - `start-fresh.ps1` handles everything
2. **Clear cache often** - Fixes 80% of frontend issues
3. **Kill all nodes before starting** - Prevents port conflicts
4. **Check backend first** - Frontend depends on it
5. **Use React Query DevTools** - See cached data
6. **Test API independently** - Use PowerShell or Postman
7. **Read error messages** - They usually tell you what's wrong
8. **Google exact error** - Others have solved it
9. **Check git tags** - Rollback if needed (`git checkout v2.0`)
10. **Commit often** - Small commits are easier to debug

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| **README.md** | Project overview & features |
| **DEVELOPER_ONBOARDING.md** | New developer guide |
| **TROUBLESHOOTING.md** | Fix common problems |
| **COMMANDS_REFERENCE.md** | Complete command list |
| **PROBLEMS_AND_SOLUTIONS.md** | Development challenges |
| **CHANGELOG.md** | Version history |
| **QUICK_REFERENCE.md** | This cheat sheet |

---

## 🔗 Important Links

- **Repository**: https://github.com/ayeendroid/crm-end-to-end
- **Issues**: https://github.com/ayeendroid/crm-end-to-end/issues
- **React Docs**: https://react.dev/
- **Express Docs**: https://expressjs.com/
- **MongoDB Docs**: https://www.mongodb.com/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## 🎓 Code Snippets

### Create API Service
```typescript
// client/src/services/exampleService.ts
import api from './api';

export const exampleService = {
  getAll: async () => {
    const response = await api.get('/example');
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/example', data);
    return response.data;
  },
};
```

### Create API Route
```typescript
// server/src/routes/example.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  // Logic here
  res.json({ data: [] });
});

export default router;
```

### Create Modal Component
```typescript
// client/src/components/ExampleModal.tsx
import React, { useState } from 'react';

const ExampleModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({});
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic
    onClose();
  };
  
  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
```

---

## 📞 Need Help?

1. **Check this card** - Common solutions here
2. **Read TROUBLESHOOTING.md** - Detailed fixes
3. **Search GitHub Issues** - Might be solved
4. **Ask team** - We're here to help!
5. **Google the error** - Stack Overflow helps

---

## 🎉 Current Version: v2.0

**Released**: October 16, 2025

**Features**:
- ✅ Customer Management (CRUD)
- ✅ Lead Management (CRUD + Conversion)
- ✅ Deal Pipeline (Stages, CRUD)
- ✅ Dashboard (5 charts + funnel + customization)
- ✅ Reports (Revenue, Deals, Leads)
- ✅ Activities & Tasks (Checklists)
- ✅ Analytics (Overview + trends)
- ✅ Authentication (JWT)

**Next**: v2.1 - Customer 360 View, Lead Scoring, Forecasting

---

**Print this page and keep it handy! 📄**

**Last Updated**: October 16, 2025  
**Maintained by**: BharatNet CRM Team
