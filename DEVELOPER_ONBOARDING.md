# 👋 Developer Onboarding Guide - BharatNet CRM

**Welcome to the team! This guide will get you up and running in 30 minutes.**

---

## 🎯 Overview

**BharatNet CRM** is a modern Customer Relationship Management system built to manage ISP customers, leads, deals, and business analytics.

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Charts**: Recharts
- **State Management**: React Query

### Current Version
**v2.0** (Released: October 16, 2025)

---

## ⚡ Quick Start (5 minutes)

### Prerequisites Check

Before you begin, ensure you have:

```powershell
# Check Node.js (Required: v18.x or higher)
node --version
# Should output: v18.x.x or v20.x.x

# Check npm (Required: v9.x or higher)
npm --version
# Should output: v9.x.x or v10.x.x

# Check MongoDB (Required: v6.x or higher)
mongod --version
# Should output: db version v6.x.x

# Check Git
git --version
# Should output: git version 2.x.x
```

**Don't have these?** See [Installation Guide](#installation-guide) below.

### Clone & Setup

```powershell
# 1. Clone repository
git clone https://github.com/ayeendroid/crm-end-to-end.git
cd crm-end-to-end

# 2. Install dependencies (both frontend and backend)
cd client
npm install

cd ../server
npm install

# 3. Set up environment variables
cd server
Copy-Item .env.example .env
# Edit .env with your settings (see Environment Setup section)

# 4. Start MongoDB (if not running)
net start MongoDB

# 5. Start both servers (automated)
cd ..
.\start-fresh.ps1
```

### Verify Installation

Open your browser:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api/health

You should see:
- ✅ Frontend: Login page
- ✅ Backend: `{"status":"healthy","message":"Server is running"}`

**Having issues?** Check [Troubleshooting Guide](./TROUBLESHOOTING.md)

---

## 📦 Installation Guide

### Install Node.js

1. Download from: https://nodejs.org/
2. Choose **LTS version** (18.x or 20.x)
3. Run installer
4. Verify: `node --version` and `npm --version`

### Install MongoDB

**Option 1: Windows Service (Recommended)**
1. Download from: https://www.mongodb.com/try/download/community
2. Choose **Windows MSI**
3. During installation:
   - ✅ Install as Windows Service
   - ✅ Install MongoDB Compass (optional GUI)
4. Verify: `Get-Service MongoDB`

**Option 2: Manual Installation**
```powershell
# Download and extract MongoDB
# Create data directory
New-Item -ItemType Directory -Path "C:\data\db" -Force

# Start manually (in separate terminal)
mongod --dbpath "C:\data\db"
```

### Install Git

1. Download from: https://git-scm.com/
2. Run installer (use default settings)
3. Verify: `git --version`

---

## ⚙️ Environment Setup

### Backend Environment (server/.env)

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/bharatnet-crm

# JWT Authentication
JWT_SECRET=your-super-secret-key-change-in-production-use-long-random-string
JWT_EXPIRE=7d

# CORS Configuration (for frontend)
CORS_ORIGIN=http://localhost:5173

# Rate Limiting (disabled in development)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important**: 
- Change `JWT_SECRET` in production to a long random string
- Never commit `.env` file to git (already in .gitignore)

### Frontend Environment (Optional)

Frontend uses Vite's default settings. If needed:

```env
# client/.env (create if needed)
VITE_API_URL=http://localhost:3000
```

---

## 🏗️ Project Structure

```
crm-end-to-end/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Customers/     # Customer management components
│   │   │   ├── Leads/         # Lead management components
│   │   │   ├── Deals/         # Deal management components
│   │   │   └── Layout/        # Layout components (Navbar, Sidebar)
│   │   ├── pages/             # Page components (Dashboard, Reports, etc.)
│   │   ├── services/          # API service layer (axios calls)
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # Utility functions
│   │   ├── App.tsx            # Main app component with routing
│   │   └── main.tsx           # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── server/                    # Node.js Backend
│   ├── src/
│   │   ├── models/            # Mongoose models (Customer, Lead, Deal, etc.)
│   │   ├── routes/            # Express routes (API endpoints)
│   │   ├── middleware/        # Express middleware (auth, validation, rate limiting)
│   │   ├── utils/             # Utility functions
│   │   ├── types/             # TypeScript type definitions
│   │   └── index.ts           # Entry point
│   ├── tests/                 # Jest tests
│   ├── package.json
│   └── tsconfig.json
│
├── .github/                   # GitHub configuration
│   └── copilot-instructions.md
│
├── Documentation/             # All documentation files
│   ├── README.md              # Main project documentation
│   ├── CHANGELOG.md           # Version history
│   ├── TROUBLESHOOTING.md     # Common problems & solutions
│   ├── COMMANDS_REFERENCE.md  # Complete command guide
│   ├── PROBLEMS_AND_SOLUTIONS.md  # Development challenges log
│   ├── DEVELOPER_ONBOARDING.md    # This file
│   └── QUICK_REFERENCE.md         # Cheat sheet
│
├── Scripts/                   # PowerShell utility scripts
│   ├── start-fresh.ps1        # Start both servers (clean start)
│   ├── check-status.ps1       # Check system status
│   └── test-week1-api.ps1     # Test Week 1 features
│
└── Various guide files...     # Implementation & testing guides
```

---

## 🚀 Development Workflow

### Daily Startup

```powershell
# Option 1: Automated (Recommended)
.\start-fresh.ps1

# Option 2: Manual
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### Making Changes

1. **Create a feature branch**
```powershell
git checkout -b feature/your-feature-name
```

2. **Make your changes**
   - Edit files in `client/src/` for frontend
   - Edit files in `server/src/` for backend
   - Hot reload is enabled (changes reflect automatically)

3. **Test your changes**
```powershell
# Run backend tests
cd server
npm test

# Test API endpoints
.\test-week1-api.ps1

# Manual testing in browser
# Open http://localhost:5173
```

4. **Commit your changes**
```powershell
git add .
git commit -m "feat: Add your feature description"
```

5. **Push to GitHub**
```powershell
git push origin feature/your-feature-name
```

6. **Create Pull Request**
   - Go to GitHub repository
   - Click "New Pull Request"
   - Add description and screenshots
   - Request review from team

### Common Development Tasks

**Add a new API endpoint:**
```powershell
# 1. Create route in server/src/routes/
# 2. Add to server/src/index.ts
# 3. Test with Postman or test script
# 4. Create frontend service in client/src/services/
# 5. Use in components
```

**Add a new page:**
```powershell
# 1. Create component in client/src/pages/
# 2. Add route in client/src/App.tsx
# 3. Add navigation link in Layout/Navbar
# 4. Test navigation
```

**Add a new database model:**
```powershell
# 1. Create model in server/src/models/
# 2. Define schema with Mongoose
# 3. Add validation
# 4. Create TypeScript types
# 5. Use in routes
```

---

## 🧪 Testing

### Backend Tests

```powershell
cd server

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- customers.test.ts

# Watch mode (re-run on changes)
npm test -- --watch
```

### API Testing

```powershell
# Automated API tests
.\test-week1-api.ps1

# Manual API testing with PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method GET

# With authentication
$token = "your-jwt-token-here"
Invoke-RestMethod -Uri "http://localhost:3000/api/customers" -Headers @{Authorization="Bearer $token"}
```

### Frontend Testing

**Manual Testing Checklist:**
- [ ] Login page loads
- [ ] Dashboard loads with charts
- [ ] Create customer works
- [ ] Create lead works
- [ ] Create deal works
- [ ] Reports page loads
- [ ] Activities page loads
- [ ] All navigation links work

---

## 🗂️ Key Concepts

### Authentication Flow

1. User enters credentials on login page
2. Frontend sends POST to `/api/auth/login`
3. Backend validates credentials
4. Backend generates JWT token
5. Frontend stores token in localStorage
6. Frontend includes token in Authorization header for all API calls
7. Backend middleware validates token on protected routes

### Data Flow

```
User Action → Frontend Component → Service Function → API Call → 
Backend Route → Middleware (auth, validation) → Controller Logic → 
Database (MongoDB) → Response → Frontend → UI Update
```

### State Management

- **React Query**: Server state (API data, caching, refetching)
- **React Hooks**: Local component state (useState, useEffect)
- **LocalStorage**: Authentication token, user preferences

### API Structure

All API endpoints follow REST conventions:

```
GET    /api/resource       # List all
GET    /api/resource/:id   # Get one
POST   /api/resource       # Create
PUT    /api/resource/:id   # Update
DELETE /api/resource/:id   # Delete
```

---

## 🔧 Common Commands

### Server Management

```powershell
# Start servers
.\start-fresh.ps1                    # Automated (recommended)
cd server && npm run dev             # Backend only
cd client && npm run dev             # Frontend only

# Stop servers
Ctrl + C                             # In each terminal
Get-Process node | Stop-Process -Force  # Kill all Node processes

# Check status
.\check-status.ps1                   # Automated
Get-Process node                     # List Node processes
netstat -ano | findstr ":3000 :5173" # Check ports
```

### Cache Management

```powershell
# Clear Vite cache (frontend issues)
Remove-Item -Path "client\.vite" -Recurse -Force

# Clear build artifacts
Remove-Item -Path "client\dist" -Recurse -Force
Remove-Item -Path "server\dist" -Recurse -Force

# Reinstall dependencies (corruption)
cd client
Remove-Item -Path "node_modules" -Recurse -Force
npm install
```

### Git Commands

```powershell
# Check status
git status
git log --oneline -10

# Create branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "type: description"

# Push changes
git push origin branch-name

# Pull latest
git pull origin main

# View tags/versions
git tag
git checkout v2.0
```

### Database Commands

```powershell
# Start/stop MongoDB
net start MongoDB
net stop MongoDB

# Connect to MongoDB shell
mongosh "mongodb://localhost:27017/bharatnet-crm"

# Common MongoDB shell commands
show dbs                           # List databases
use bharatnet-crm                 # Switch database
show collections                  # List collections
db.customers.countDocuments()     # Count customers
db.customers.find().pretty()      # View customers
```

---

## 📚 Learning Resources

### Documentation

- **Project Docs**:
  - [README.md](./README.md) - Project overview
  - [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Fix common issues
  - [COMMANDS_REFERENCE.md](./COMMANDS_REFERENCE.md) - Complete commands
  - [PROBLEMS_AND_SOLUTIONS.md](./PROBLEMS_AND_SOLUTIONS.md) - Development challenges
  - [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Cheat sheet

- **Technology Docs**:
  - React: https://react.dev/
  - TypeScript: https://www.typescriptlang.org/docs/
  - Express: https://expressjs.com/
  - MongoDB: https://www.mongodb.com/docs/
  - Mongoose: https://mongoosejs.com/docs/
  - Tailwind CSS: https://tailwindcss.com/docs

### Code Examples

**Create a new customer:**
```typescript
// Frontend: client/src/services/customerService.ts
export const createCustomer = async (data: CustomerFormData) => {
  const response = await api.post('/customers', data);
  return response.data;
};

// Backend: server/src/routes/customers.ts
router.post('/', authenticate, validateCustomer, async (req, res) => {
  const customer = await Customer.create(req.body);
  res.status(201).json(customer);
});
```

**Fetch data with React Query:**
```typescript
// Component: client/src/pages/Customers.tsx
const { data: customers, isLoading } = useQuery({
  queryKey: ['customers'],
  queryFn: customerService.getCustomers,
});
```

---

## 🎓 First Tasks

### Task 1: Make Your First Change (15 minutes)

**Goal**: Change the welcome message on the dashboard

1. Open `client/src/pages/Dashboard.tsx`
2. Find the welcome text (around line 150)
3. Change "Welcome to BharatNet CRM" to "Welcome [Your Name]!"
4. Save file (hot reload will update browser automatically)
5. Verify change in browser

**Success**: You see your custom message on the dashboard

### Task 2: Create a Test API Endpoint (30 minutes)

**Goal**: Add a simple "hello world" endpoint

1. **Create route file**: `server/src/routes/hello.ts`
```typescript
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello from new developer!' });
});

export default router;
```

2. **Register route**: Edit `server/src/index.ts`
```typescript
import helloRoutes from './routes/hello';
// ...
app.use('/api/hello', helloRoutes);
```

3. **Test endpoint**:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/hello"
# Should output: @{message=Hello from new developer!}
```

**Success**: Endpoint returns your message

### Task 3: Fix a Bug from Backlog (variable time)

**Goal**: Choose and fix an issue from GitHub Issues

1. Go to: https://github.com/ayeendroid/crm-end-to-end/issues
2. Find issue labeled `good first issue`
3. Comment: "I'd like to work on this"
4. Create branch: `git checkout -b fix/issue-number-description`
5. Make the fix
6. Test thoroughly
7. Commit and push
8. Create Pull Request

**Success**: PR is approved and merged

---

## 🤝 Team Collaboration

### Communication

- **Daily Standup**: 10 AM (your timezone)
- **Code Reviews**: Required for all PRs
- **Questions**: Ask in team chat or create GitHub Discussion

### Code Style

- **TypeScript**: Use strict mode, define types
- **React**: Functional components with hooks
- **Naming**: camelCase for variables, PascalCase for components
- **Commits**: Use conventional commits (feat:, fix:, docs:, etc.)
- **Comments**: Explain "why", not "what"

### Pull Request Guidelines

**PR Title Format:**
```
type: Brief description

Examples:
feat: Add customer export functionality
fix: Resolve lead conversion validation error
docs: Update installation guide
```

**PR Description Template:**
```markdown
## What does this PR do?
Brief description of changes

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## How to test
1. Step 1
2. Step 2
3. Expected result

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] Code tested locally
- [ ] Tests pass (npm test)
- [ ] Documentation updated
- [ ] No console errors
```

### Code Review Checklist

**As Reviewer:**
- [ ] Code follows project style
- [ ] Changes are well-documented
- [ ] Tests are included/pass
- [ ] No security vulnerabilities
- [ ] Performance is acceptable
- [ ] UI/UX is polished

**As Author:**
- [ ] Self-review before requesting review
- [ ] All tests pass
- [ ] No merge conflicts
- [ ] Screenshots provided for UI changes
- [ ] Responds to review comments promptly

---

## 🐛 Troubleshooting

### Port Already in Use

```powershell
# Quick fix
Get-Process node | Stop-Process -Force
.\start-fresh.ps1
```

### Frontend Won't Load

```powershell
# Clear cache
Remove-Item -Path "client\.vite" -Recurse -Force
cd client
npm run dev
```

### MongoDB Connection Error

```powershell
# Start MongoDB
net start MongoDB

# Verify running
Get-Service MongoDB
```

### "Cannot find module" Error

```powershell
# Reinstall dependencies
cd server  # or client
Remove-Item -Path "node_modules" -Recurse -Force
npm install
```

**More help**: See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 📞 Getting Help

### Resources

1. **Documentation**: Check docs folder first
2. **Troubleshooting Guide**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
3. **Team Chat**: Ask in developer channel
4. **GitHub Issues**: Search existing issues
5. **Stack Overflow**: Search for error messages

### How to Ask for Help

**Good Question:**
```
I'm trying to create a new customer via the API, but I'm getting a 400 error.

What I've tried:
1. Checked request body format - matches schema
2. Verified JWT token is included
3. Tested with Postman - same error

Error message: "Validation failed: email is required"

Request body I'm sending:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com"
}

Any ideas what I'm missing?
```

**Include:**
- What you're trying to do
- What's happening instead
- Error messages (exact text)
- What you've already tried
- Code snippets or screenshots

---

## 🎉 Welcome to the Team!

You're now ready to start contributing! Here's your first day checklist:

- [ ] Set up development environment
- [ ] Run the application successfully
- [ ] Read through key documentation files
- [ ] Complete Task 1 (Change dashboard message)
- [ ] Complete Task 2 (Create test endpoint)
- [ ] Join team communication channels
- [ ] Introduce yourself to the team
- [ ] Ask at least one question (it's encouraged!)
- [ ] Review current sprint tasks
- [ ] Pick your first issue to work on

**Remember**: 
- 🙋 Ask questions - we're here to help!
- 🔍 Explore the codebase - best way to learn
- 🧪 Test your changes thoroughly
- 📝 Document as you go
- 🎯 Focus on learning, not perfection

**Welcome aboard! We're excited to have you on the team! 🚀**

---

**Last Updated**: October 16, 2025  
**Version**: 2.0  
**Maintained by**: BharatNet CRM Team
