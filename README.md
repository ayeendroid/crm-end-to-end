# 🚀 BharatNet CRM - Modern Customer Relationship Management System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248.svg)

**A powerful, modern CRM system built with React, TypeScript, Node.js, and MongoDB**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Documentation](#-documentation)

</div>

---

## ✨ Features

### 🎯 Core CRM Functionality

- **Customer Management** - Complete customer lifecycle tracking with detailed profiles
- **Lead Tracking** - Monitor and nurture leads through the sales pipeline
- **Deal Pipeline** - Visual deal management with stage tracking
- **Task Management** - Organize and prioritize tasks with assignments
- **Activity Timeline** - Track all customer interactions chronologically

### 🎨 Modern UI/UX

- **Command Palette (⌘K)** - Quick access with keyboard shortcuts (Ctrl+K / Cmd+K)
- **Responsive Design** - Seamless experience across all devices
- **Beautiful Gradients** - Modern color schemes inspired by top SaaS products
- **Smooth Animations** - Delightful micro-interactions and transitions
- **Activity Timeline** - Visual timeline with 7 activity types and color coding

### 📊 Analytics & Insights

- **Dashboard Overview** - Real-time stats with trend indicators (+12.5% revenue, +8.3% customers)
- **Revenue Tracking** - Monitor sales performance and growth
- **Win Rate Analysis** - Track conversion metrics (68% success rate)
- **Activity Metrics** - Visualize team productivity

### 🔒 Enterprise Features

- **Role-Based Access** - Granular permissions for team members
- **JWT Authentication** - Secure token-based authentication
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

### Installation

```bash
# Clone repository
git clone https://github.com/ayeendroid/crm-end-to-end.git
cd crm-end-to-end

# Install dependencies
npm install

# Create .env in server directory
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bharatnet-crm
JWT_SECRET=your-secret-key

# Start MongoDB
net start MongoDB  # Windows

# Run application
npm run dev
```

**Access:** http://localhost:5173

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

## 🔧 Development

```bash
# Development
npm run dev              # Run both client and server

# Building
npm run build            # Build for production

# Production
npm start                # Start production server
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

### v1.1 (Coming Soon)

- Email integration
- Advanced reporting
- File attachments
- Calendar integration

### v2.0

- AI insights
- Mobile app
- Multi-language support

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by [Anmol](https://github.com/ayeendroid)

</div>
