# 🚀 CRM STARTUP GUIDE - READ THIS FIRST!

## ⚠️ IMPORTANT: Directory Commands Reference

### Problem: "Cannot find path 'client\client'"

**This happens when you're already IN the client directory and try to cd into it again!**

### ✅ SOLUTION: Always check where you are first!

```powershell
# 1. Check your current location
Get-Location

# 2. Navigate based on where you are:

# If you see: C:\Users\anmol\Documents\CRM
# Then run:
npm run dev                    # Starts both client and server

# If you see: C:\Users\anmol\Documents\CRM\client
# Then run:
npm run dev                    # Starts frontend only

# If you see: C:\Users\anmol\Documents\CRM\server
# Then run:
npm run dev                    # Starts backend only
```

## 📍 Quick Navigation Commands

### From ANYWHERE, go to CRM root:

```powershell
cd C:\Users\anmol\Documents\CRM
```

### From CRM root → Client:

```powershell
cd client
```

### From CRM root → Server:

```powershell
cd server
```

### From Client/Server → Back to root:

```powershell
cd ..
```

## 🎯 The CORRECT Way to Start the Application

### Method 1: Automatic (Recommended) ⭐

```powershell
# 1. Go to root directory
cd C:\Users\anmol\Documents\CRM

# 2. Start everything
npm run dev
```

This will start:

- ✅ Backend on http://localhost:3000
- ✅ Frontend on http://localhost:5173

### Method 2: Manual (Two Terminals)

```powershell
# Terminal 1 (Backend)
cd C:\Users\anmol\Documents\CRM\server
npm run dev

# Terminal 2 (Frontend)
cd C:\Users\anmol\Documents\CRM\client
npm run dev
```

## 📦 Installing Packages - THE RIGHT WAY

### ❌ WRONG:

```powershell
# Already in client directory
cd client; npm install recharts
# ^ This tries to go to client/client (doesn't exist!)
```

### ✅ CORRECT:

```powershell
# Check where you are first
Get-Location

# If in CRM root:
cd client
npm install recharts

# If ALREADY in client directory:
npm install recharts
# ^ Just install, don't cd again!
```

## 🔧 Common Package Installation

### Frontend packages:

```powershell
cd C:\Users\anmol\Documents\CRM\client
npm install <package-name>
```

### Backend packages:

```powershell
cd C:\Users\anmol\Documents\CRM\server
npm install <package-name>
```

## 🐛 Fixing "Path Not Found" Errors

### Error Example:

```
Cannot find path 'C:\Users\anmol\Documents\CRM\client\client'
```

### Why it happens:

You're running `cd client` when you're already IN the client folder!

### How to fix:

```powershell
# 1. See where you actually are
Get-Location

# 2. If output is: C:\Users\anmol\Documents\CRM\client
# You're ALREADY in client! Just run:
npm install <package>

# 3. If you need to go back to root first:
cd ..
# Then:
cd client
npm install <package>
```

## 📋 Pre-flight Checklist

Before running the app, verify:

```powershell
# 1. MongoDB is running
Get-Service -Name MongoDB
# Should show: Status: Running

# 2. You're in the correct directory
Get-Location
# Should show: C:\Users\anmol\Documents\CRM

# 3. Dependencies are installed
# Check if node_modules exists in both client and server
```

## 🎨 Available Features After Login

- **Dashboard** (`/dashboard`) - AI-powered insights and metrics
- **Pipeline** (`/pipeline`) - Visual Kanban board for deals
- **Customers** (`/customers`) - Customer list and management
- **Customer 360** (`/customers/:id`) - Detailed customer view with AI insights
- **Leads** (`/leads`) - Lead tracking and scoring
- **Deals** (`/deals`) - Deal management
- **Activities** (`/activities`) - Activity feed
- **Reports** (`/reports`) - Analytics and reports
- **Settings** (`/settings`) - App configuration

## 🔑 Login Credentials (Demo Mode)

```
Email: anything@email.com
Password: anything
```

Any credentials work in demo mode!

## 📞 Ports in Use

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000/api`
- MongoDB: `mongodb://localhost:27017`

## 💡 Pro Tips

1. **Always check your location** with `Get-Location` before running cd commands
2. **Use tab completion** - Type `cd cli` and press TAB, PowerShell will complete it
3. **Use `..` to go up** - Much faster than typing full paths
4. **Bookmark these locations** in your terminal for quick access

## 🆘 Still Having Issues?

### Clear everything and start fresh:

```powershell
# 1. Go to root
cd C:\Users\anmol\Documents\CRM

# 2. Clean install
cd client
rm -r node_modules
npm install

cd ../server
rm -r node_modules
npm install

cd ..
npm install

# 3. Start fresh
npm run dev
```

## 📚 Remember These Commands

```powershell
# Where am I?
Get-Location

# Go to CRM root (from anywhere)
cd C:\Users\anmol\Documents\CRM

# Start the app (from root only!)
npm run dev

# Install package (go to client/server first!)
cd client
npm install <package-name>

# Go back one level
cd ..
```

---

## 🎯 TL;DR (Too Long; Didn't Read)

```powershell
# Always start here:
cd C:\Users\anmol\Documents\CRM

# Check where you are:
Get-Location

# Start the app:
npm run dev

# Install frontend package:
cd client
npm install <package>
cd ..

# Install backend package:
cd server
npm install <package>
cd ..
```

**GOLDEN RULE:** If you see "Cannot find path" → You're already in that directory! Check with `Get-Location`!

---

Made with ❤️ for hassle-free CRM development
