# 🚀 BharatNet CRM - Modern Customer Relationship Management System

<div align="center">

![Version](https://img.shields.io/badge/version-2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248.svg)
![Status](https://img.shields.io/badge/status-production%20ready-success.svg)

**A powerful, modern CRM system built with React, TypeScript, Node.js, and MongoDB**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Changelog](#-version-history)

</div>

---

## ✨ Features

### 🎯 Core CRM Functionality (v1.0)

- **Customer Management** - Complete customer lifecycle tracking with detailed profiles
- **Lead Tracking** - Monitor and nurture leads through the sales pipeline
- **Deal Pipeline** - Visual deal management with stage tracking
- **Task Management** - Organize and prioritize tasks with assignments
- **Activity Timeline** - Track all customer interactions chronologically

### 📊 Advanced Analytics & Reporting (v2.0)

- **Reports System** - Comprehensive reporting with 4 tabs (Overview, Revenue, Deals, Leads)
- **Professional Charts** - 6 Recharts visualizations (Area, Line, Bar, Pie, Funnel)
- **Conversion Funnel** - 4-stage lead-to-customer journey visualization
- **Dashboard Customization** - 11 toggleable widgets with personalized layouts
- **Real-time Updates** - Live data refresh with React Query caching
- **Date Range Filtering** - 7d, 30d, 90d, 1y analysis periods

### 🎨 Modern UI/UX

- **Command Palette (⌘K)** - Quick access with keyboard shortcuts (Ctrl+K / Cmd+K)
- **Responsive Design** - Seamless experience across all devices
- **Beautiful Gradients** - Modern color schemes inspired by top SaaS products
- **Smooth Animations** - Delightful micro-interactions and transitions
- **Activity Timeline** - Visual timeline with 7 activity types and color coding
- **Widget Customization** - Show/hide dashboard sections with visual toggles

### 🔒 Enterprise Features

- **Role-Based Access** - Granular permissions for team members
- **JWT Authentication** - Secure token-based authentication
- **Rate Limiting** - Environment-aware (1000 req/15min dev, 100 req/15min prod)
- **API Integration** - RESTful API for third-party integrations
- **Scalable Architecture** - Built to handle growing business needs

---

## 🛠 Tech Stack

### Frontend

- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **Lucide Icons** - Beautiful icon set
- **Recharts** - Data visualization

### Backend

- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Token authentication
- **Helmet** - Security middleware

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0+
- MongoDB 6.0+
- npm or yarn
- Git

### Method 1: Automated Setup (Recommended)

```powershell
# Clone repository
git clone https://github.com/ayeendroid/crm-end-to-end.git
cd crm-end-to-end

# Checkout latest stable version
git checkout v2.0

# Install dependencies for both client and server
npm install
cd client && npm install
cd ../server && npm install

# Start MongoDB (Windows)
net start MongoDB

# Use the automated startup script
cd ..
.\start-fresh.ps1
```

### Method 2: Manual Setup

```powershell
# After installing dependencies, create .env file
# server/.env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bharatnet-crm
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development

# Terminal 1 - Start Backend
cd server
npm run dev

# Terminal 2 - Start Frontend
cd client
npm run dev
```

**Access:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Health: http://localhost:3000/api/health

### Utility Scripts

```powershell
# Check system status
.\check-status.ps1

# Start fresh (kills processes, restarts servers)
.\start-fresh.ps1

# Test all API endpoints
.\test-week1-api.ps1
```

---

## 📱 Network Access

Access from any device on the same WiFi!

```bash
# Get your IP
ipconfig | findstr IPv4

# Your CRM will be available at:
# http://YOUR-IP:5173
```

See [NETWORK_ACCESS_GUIDE.md](./NETWORK_ACCESS_GUIDE.md) for detailed instructions.

---

## 📁 Project Structure

```
crm-end-to-end/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Pages
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   └── vite.config.ts
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   └── index.ts        # Server entry
│   └── tsconfig.json
└── package.json
```

---

## 🎯 Key Features

### Command Palette (⌘K)

- Quick Actions: Add Customer, Create Deal, New Task
- Navigation: Jump to any page
- Recent Items: Access recent records
- Full keyboard navigation

### Activity Timeline

- 📞 Phone calls
- ✉️ Emails
- 📅 Meetings
- 📝 Notes
- ✅ Tasks
- 💬 Messages
- 🎥 Video calls

### Dashboard Analytics

- Revenue: ₹2,45,680 (+12.5%)
- Customers: 1,234 (+8.3%)
- Deals: 127 active
- Win Rate: 68%

---

## � Documentation

### Getting Started

- [Quick Start Guide](./STARTUP-GUIDE.md) - Complete setup instructions
- [Network Access Guide](./NETWORK_ACCESS_GUIDE.md) - Access from any device
- [Visual Testing Guide](./WEEK1_VISUAL_TEST_GUIDE.md) - Feature testing checklist

### Development

- [Testing Guide](./WEEK1_TESTING_REPORT.md) - Comprehensive testing checklist
- [Contributing Guidelines](./CONTRIBUTING.md) - How to contribute
- [Troubleshooting Guide](./TROUBLESHOOTING.md) - Common issues and solutions

### Release Notes

- [Version 2.0 Release Notes](./RELEASE_v2.0.md) - Latest release details
- [Changelog](./CHANGELOG.md) - All version changes
- [Problems & Solutions](./PROBLEMS_AND_SOLUTIONS.md) - Development challenges

### API Documentation

- API Endpoints: http://localhost:3000/api
- Health Check: http://localhost:3000/api/health

---

## 📖 Version History

### v2.0 (October 16, 2025) - Current

**Major Features:**

- Reports System with 4 tabs and professional charts
- Activities & Tasks full-stack implementation
- Dashboard enhancements with 5 Recharts visualizations
- Conversion Funnel Chart (4-stage visualization)
- Widget Customization System (11 toggleable sections)
- Data refresh capability

**Bug Fixes:**

- Fixed rate limiting (disabled in dev, optimized for prod)
- Fixed lead to customer conversion validation
- Fixed data structure issues in customer creation
- Improved React Query caching (5min stale, 10min cache)

**Files Changed:** 25 files (+6,213 lines, -339 lines)

### v1.0.1 (Previous)

- Minor bug fixes
- Performance improvements

### v1.0.0 (Initial Release)

- Core CRM functionality
- Customer, Lead, Deal management
- Authentication system
- Basic dashboard
- Activity timeline

---

## �🔧 Development

```powershell
# Development mode
npm run dev              # Run both client and server

# Backend only
cd server
npm run dev

# Frontend only
cd client
npm run dev

# Building for production
npm run build            # Build both
cd client && npm run build    # Build frontend
cd server && npm run build    # Build backend

# Testing
cd server
npm test                 # Run backend tests

# Linting
npm run lint             # Lint code

# Type checking
npm run type-check       # Check TypeScript types
```

### Useful Commands

```powershell
# Kill all Node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Clear caches
Remove-Item -Path ".\client\.vite" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".\server\dist" -Recurse -Force -ErrorAction SilentlyContinue

# Check port usage
netstat -ano | findstr ":3000"  # Backend
netstat -ano | findstr ":5173"  # Frontend

# MongoDB commands
net start MongoDB        # Start MongoDB (Windows)
net stop MongoDB         # Stop MongoDB (Windows)
mongosh                  # Open MongoDB shell
```

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📝 License

MIT License - see [LICENSE](./LICENSE)

---

## 👨‍💻 Author

**Anmol** - [@ayeendroid](https://github.com/ayeendroid)

---

## 🗺 Roadmap

### ✅ v1.0 (Released)

- Core CRM functionality
- Customer/Lead/Deal management
- Authentication & authorization
- Basic dashboard
- Activity timeline

### ✅ v2.0 (Current - Released October 2025)

- **Week 1 Complete (Days 1-5)**
- ✅ Reports System (Backend + Frontend)
- ✅ Activities & Tasks Management
- ✅ Dashboard with 5 Recharts visualizations
- ✅ Conversion Funnel Chart (4-stage)
- ✅ Widget Customization (11 toggles)
- ✅ Rate limiting optimization
- ✅ Lead conversion fixes

### 🔄 v2.1 (In Progress - Week 2)

- **Days 6-10**
- Customer 360 View
- Lead & Customer Enhancements (bulk operations, CSV import)
- Deal Analytics & Forecasting
- Collaboration Features (@mentions, notifications)
- Comprehensive testing & polish

### 🔮 v3.0 (Future)

- AI-powered insights
- Mobile app (React Native)
- Email integration
- Calendar sync
- Multi-language support
- Advanced automations

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by [Anmol](https://github.com/ayeendroid)

</div>
