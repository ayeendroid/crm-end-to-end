# 🌐 Local Network Access Setup Guide

## Access Your CRM from Any Device on Your Network

This guide helps you access the BharatNet CRM from your phone, tablet, or other computers on the same WiFi network.

---

## Quick Setup (5 minutes)

### Step 1: Get Your Computer's IP Address

**Windows PowerShell:**
```powershell
ipconfig | findstr IPv4
```

Look for something like: `192.168.1.100` or `192.168.0.50`

**Alternative Method:**
```powershell
# Full details
ipconfig

# Just the IP
(Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi").IPAddress
```

**Save this IP!** Let's say it's: `192.168.1.100`

---

### Step 2: Configure Firewall

Windows Firewall needs to allow incoming connections on ports 3000 and 5173.

**Option A: PowerShell (Run as Administrator)**
```powershell
# Allow Node.js through firewall
New-NetFirewallRule -DisplayName "Node.js Server (Port 3000)" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

New-NetFirewallRule -DisplayName "Vite Dev Server (Port 5173)" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow

Write-Host "✅ Firewall rules added successfully!" -ForegroundColor Green
```

**Option B: Windows Firewall GUI**
1. Open **Windows Defender Firewall**
2. Click **"Advanced settings"**
3. Click **"Inbound Rules"** → **"New Rule"**
4. Select **"Port"** → Next
5. Select **"TCP"** → Specific local ports: **3000**
6. **Allow the connection** → Next
7. Check all profiles (Domain, Private, Public) → Next
8. Name: **"Node.js Server (Port 3000)"** → Finish
9. **Repeat for port 5173** (Vite Dev Server)

---

### Step 3: Start the CRM Servers

The Vite config has already been updated to listen on all network interfaces (`0.0.0.0`).

```powershell
# Navigate to project
cd C:\Users\anmol\Documents\CRM

# Start servers
npm run dev
```

You should see:
```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.100:5173/  ← Use this URL!
```

---

### Step 4: Access from Other Devices

On any device connected to the **same WiFi network**:

**Frontend (React App):**
```
http://192.168.1.100:5173
```

**Backend API:**
```
http://192.168.1.100:3000
```

**Replace `192.168.1.100` with YOUR computer's IP!**

---

## Testing from Different Devices

### On Your Phone (Same WiFi)
1. Connect phone to same WiFi as computer
2. Open browser (Chrome/Safari)
3. Type: `http://192.168.1.100:5173`
4. CRM should load!

### On Another Computer
1. Ensure it's on same network
2. Open browser
3. Type: `http://192.168.1.100:5173`
4. Full CRM access!

### On Tablet (iPad/Android)
1. Same WiFi connection
2. Browser: `http://192.168.1.100:5173`
3. Touch-optimized UI works great!

---

## Troubleshooting

### Issue 1: "Can't reach this page" / "Connection refused"

**Fix: Check Firewall**
```powershell
# Test if port is listening
netstat -an | findstr ":5173"
netstat -an | findstr ":3000"

# You should see:
TCP    0.0.0.0:5173    0.0.0.0:0    LISTENING
TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING
```

If not showing:
- Restart servers: `npm run dev`
- Check firewall rules are added
- Try disabling firewall temporarily (testing only!)

### Issue 2: Different Networks (WiFi vs Ethernet)

**Your computer might have multiple IPs!**

```powershell
# List all network adapters
ipconfig /all

# Find the active adapter (WiFi or Ethernet)
# Use the IPv4 address of the adapter your devices use
```

### Issue 3: IP Address Changes

Your IP might change after router restart.

**Solution: Set Static IP**
1. Open **Settings** → **Network & Internet**
2. Click your connection (WiFi/Ethernet)
3. Edit **IP settings** → Manual
4. Set IP: `192.168.1.100` (or any available)
5. Subnet: `255.255.255.0`
6. Gateway: Your router IP (usually `192.168.1.1`)
7. DNS: `8.8.8.8, 8.8.4.4`

### Issue 4: Slow Connection

**Optimize for mobile:**
```powershell
# Update package.json script
# Already configured for optimal performance
npm run dev
```

---

## Security Considerations

### ⚠️ Important Notes

1. **Local Network Only**: Only works on same WiFi/LAN
2. **Not Internet-Accessible**: Cannot access from outside your network
3. **Development Mode**: This is for testing, not production
4. **No HTTPS**: Traffic is unencrypted (fine for local testing)

### Making it Internet-Accessible (Advanced)

If you want to access from anywhere:

1. **ngrok** (Easiest)
   ```bash
   # Install ngrok
   choco install ngrok
   
   # Create tunnel
   ngrok http 5173
   
   # Get public URL: https://abc123.ngrok.io
   ```

2. **Port Forwarding** (Router)
   - Access router admin (usually `192.168.1.1`)
   - Forward ports 3000, 5173 to your PC IP
   - Access via your public IP

3. **Cloud Deployment** (Production)
   - Deploy to Vercel, Netlify, Heroku
   - Proper production setup

---

## QR Code Access (Bonus)

**Generate QR code for easy mobile access:**

```powershell
# Install QR code generator
npm install -g qrcode-terminal

# Generate QR for your CRM
qrcode-terminal "http://192.168.1.100:5173"
```

Scan with phone camera → Opens CRM instantly!

---

## Network Configuration Script

Save as `network-access.ps1`:

```powershell
# Get computer IP
$IP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi").IPAddress

Write-Host "🌐 Your CRM Access URLs:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend: http://$IP:5173" -ForegroundColor Green
Write-Host "Backend:  http://$IP:3000" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Share these URLs with devices on same WiFi!" -ForegroundColor Yellow
Write-Host ""

# Check if servers are running
$Frontend = Test-NetConnection -ComputerName $IP -Port 5173 -InformationLevel Quiet
$Backend = Test-NetConnection -ComputerName $IP -Port 3000 -InformationLevel Quiet

if ($Frontend) {
    Write-Host "✅ Frontend server is running" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend server not detected" -ForegroundColor Red
    Write-Host "   Run: npm run dev" -ForegroundColor Yellow
}

if ($Backend) {
    Write-Host "✅ Backend server is running" -ForegroundColor Green
} else {
    Write-Host "❌ Backend server not detected" -ForegroundColor Red
    Write-Host "   Check if MongoDB is running" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💡 Tip: Bookmark these URLs on your mobile devices!" -ForegroundColor Cyan
```

Run it:
```powershell
.\network-access.ps1
```

---

## Mobile-Friendly Tips

### 1. Add to Home Screen (PWA)

**iOS (iPhone/iPad):**
1. Open `http://192.168.1.100:5173` in Safari
2. Tap Share button
3. "Add to Home Screen"
4. Tap "Add"
5. App icon appears on home screen!

**Android:**
1. Open in Chrome
2. Tap menu (⋮)
3. "Add to Home Screen"
4. Confirm
5. Launch like a native app!

### 2. Responsive Design Already Built-In
- ✅ Touch-optimized buttons
- ✅ Mobile-friendly layout
- ✅ Swipe gestures work
- ✅ Command Palette (⌘K) on mobile

---

## Quick Reference Card

Print or save this:

```
╔══════════════════════════════════════════╗
║     BharatNet CRM - Network Access       ║
╠══════════════════════════════════════════╣
║                                          ║
║  🌐 Frontend:                            ║
║     http://192.168.1.100:5173           ║
║                                          ║
║  🔧 Backend API:                         ║
║     http://192.168.1.100:3000           ║
║                                          ║
║  📱 Requirements:                         ║
║     • Same WiFi network                  ║
║     • Firewall ports 3000, 5173 open    ║
║     • Servers running (npm run dev)     ║
║                                          ║
║  🔥 Firewall Check:                      ║
║     netstat -an | findstr ":5173"       ║
║                                          ║
╚══════════════════════════════════════════╝
```

---

## Alternative: Tailscale (VPN Access)

For accessing from anywhere without exposing ports:

```bash
# Install Tailscale
winget install tailscale.tailscale

# Start Tailscale
tailscale up

# Get your Tailscale IP (e.g., 100.64.0.1)
tailscale ip

# Access from any device with Tailscale:
http://100.64.0.1:5173
```

Benefits:
- ✅ Secure (encrypted)
- ✅ Works anywhere (not just local network)
- ✅ No port forwarding needed
- ✅ Free for personal use

---

## Summary Checklist

Before accessing from other devices:

- [ ] Got your computer's IP address (`ipconfig`)
- [ ] Added firewall rules (ports 3000, 5173)
- [ ] Updated vite.config.ts (host: '0.0.0.0') ✅ Done!
- [ ] Started servers (`npm run dev`)
- [ ] Verified "Network:" URL in terminal
- [ ] Connected device to same WiFi
- [ ] Opened browser on device
- [ ] Accessed `http://YOUR-IP:5173`
- [ ] CRM loaded successfully! 🎉

---

**Your CRM is now accessible on your local network! 🚀**

Test it on your phone and let me know if you need help!
