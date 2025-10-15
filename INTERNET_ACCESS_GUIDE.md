# 🌍 Internet Access Guide - Access Your CRM from Anywhere

Make your BharatNet CRM accessible from anywhere in the world, not just your local WiFi!

---

## 🚀 Quick Start (Recommended: ngrok)

### Option 1: ngrok (Easiest & Most Popular)

**ngrok** creates a secure tunnel to your localhost, giving you a public URL that works from anywhere.

#### Step 1: Install ngrok

**Method A: Using Chocolatey (Recommended for Windows)**
```powershell
# Install Chocolatey if not already installed
# Run PowerShell as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install ngrok
choco install ngrok
```

**Method B: Manual Download**
1. Go to: https://ngrok.com/download
2. Download the Windows version
3. Extract `ngrok.exe` to `C:\Windows\System32` (or any folder in PATH)

#### Step 2: Sign Up (Free)
1. Go to: https://dashboard.ngrok.com/signup
2. Sign up with email or GitHub
3. Copy your authtoken from: https://dashboard.ngrok.com/get-started/your-authtoken

#### Step 3: Configure ngrok
```powershell
# Add your authtoken (one-time setup)
ngrok config add-authtoken YOUR_TOKEN_HERE
```

#### Step 4: Start Your CRM
```powershell
# Terminal 1: Start your CRM servers
cd C:\Users\anmol\Documents\CRM
npm run dev
```

Wait for servers to start, then:

#### Step 5: Create Tunnel
```powershell
# Terminal 2: Create ngrok tunnel for frontend
ngrok http 5173
```

You'll see output like:
```
ngrok

Session Status                online
Account                       your-email@example.com
Version                       3.5.0
Region                        India (in)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:5173

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**Your public URL**: `https://abc123.ngrok-free.app` ← Share this with anyone!

---

## 🎯 Complete Setup (Frontend + Backend)

Since your CRM needs both frontend (5173) and backend (3000), you need TWO tunnels:

### Terminal Setup:

**Terminal 1: Start CRM**
```powershell
cd C:\Users\anmol\Documents\CRM
npm run dev
```

**Terminal 2: Tunnel Frontend**
```powershell
ngrok http 5173 --region in
```
Copy the URL: `https://abc123.ngrok-free.app`

**Terminal 3: Tunnel Backend**
```powershell
ngrok http 3000 --region in
```
Copy the URL: `https://xyz789.ngrok-free.app`

### Update Frontend API URL:

You need to tell your frontend to use the ngrok backend URL:

**Option A: Quick Test (Environment Variable)**
```powershell
# In client directory, create .env.local
cd client
echo "VITE_API_URL=https://xyz789.ngrok-free.app/api" > .env.local

# Restart frontend
npm run dev
```

**Option B: Temporary Code Change**

Edit `client/src/services/api.ts` (or wherever API base URL is):
```typescript
// Change from:
const API_BASE_URL = 'http://localhost:3000/api';

// To:
const API_BASE_URL = 'https://xyz789.ngrok-free.app/api';
```

---

## 🆓 Free Tier Limits

### ngrok Free Plan:
- ✅ Unlimited tunnels
- ✅ HTTPS included
- ✅ 40 connections/minute
- ✅ Random URL (changes each restart)
- ⚠️ Session timeout: 2 hours (must restart)
- ⚠️ Warning banner on free URLs

### ngrok Paid Plans ($8/month):
- Custom domains (yourcrm.ngrok.app)
- No session timeout
- No warning banner
- More connections

---

## 🔄 Alternative Free Options

### Option 2: Cloudflare Tunnel (No Limits!)

**Better than ngrok for long-term use!**

#### Install Cloudflared:
```powershell
# Download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
# Or use Chocolatey
choco install cloudflared
```

#### Quick Tunnel (No Account Needed):
```powershell
# Tunnel frontend
cloudflared tunnel --url http://localhost:5173

# You'll get a URL like: https://random-name.trycloudflare.com
```

**Advantages:**
- ✅ No signup required for quick tunnels
- ✅ No time limits
- ✅ No connection limits
- ✅ Faster than ngrok
- ✅ No warning banner

**Disadvantages:**
- URL changes every restart (unless you set up a permanent tunnel)

---

### Option 3: localtunnel (Simple!)

```powershell
# Install globally
npm install -g localtunnel

# Create tunnel
lt --port 5173 --subdomain mycrm

# Your URL: https://mycrm.loca.lt
```

**Note:** First visit requires password: Use the password shown in terminal

---

### Option 4: Serveo (SSH Tunnel - No Install!)

```powershell
# Using SSH (available on Windows 10+)
ssh -R 80:localhost:5173 serveo.net

# You'll get: https://random.serveo.net
```

---

## 📱 Access from Mobile/Anywhere

Once you have your ngrok URL:

1. **Copy the URL**: `https://abc123.ngrok-free.app`
2. **Share it**: Send via WhatsApp, Email, SMS
3. **Open anywhere**: Works on any device with internet
4. **No VPN needed**: Direct access from anywhere

---

## 🎬 Complete Workflow

### One-Time Setup:
```powershell
# 1. Install ngrok
choco install ngrok

# 2. Sign up and get token
# Visit: https://dashboard.ngrok.com/get-started/your-authtoken

# 3. Add token
ngrok config add-authtoken YOUR_TOKEN
```

### Every Time You Want Internet Access:

**Quick Script** - Save as `start-internet-access.ps1`:
```powershell
# Start CRM in background
Write-Host "🚀 Starting CRM servers..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "cd C:\Users\anmol\Documents\CRM; npm run dev"

# Wait for servers to start
Write-Host "⏳ Waiting for servers to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Start ngrok tunnels
Write-Host "🌍 Creating internet tunnels..." -ForegroundColor Cyan
Write-Host ""

# Frontend tunnel
Write-Host "📱 Frontend tunnel:" -ForegroundColor Green
Start-Process powershell -ArgumentList "ngrok http 5173 --region in"

# Backend tunnel  
Write-Host "🔧 Backend tunnel:" -ForegroundColor Green
Start-Process powershell -ArgumentList "ngrok http 3000 --region in"

Write-Host ""
Write-Host "✅ Tunnels created! Check ngrok windows for URLs" -ForegroundColor Green
Write-Host "📋 Copy the HTTPS URLs and share them!" -ForegroundColor Cyan
```

Run it:
```powershell
.\start-internet-access.ps1
```

---

## 🔐 Security Considerations

### ⚠️ Important Notes:

1. **Temporary Use Only**: Free tunnels are for testing/demos, not production
2. **No Sensitive Data**: Don't use real customer data while publicly accessible
3. **Authentication**: Add password protection if sharing widely
4. **Session Management**: URLs change when you restart (free tier)
5. **Rate Limits**: Free plans have connection limits

### 🛡️ Add Basic Password Protection:

**Option A: Using ngrok Basic Auth**
```powershell
ngrok http 5173 --basic-auth "username:password"
```

**Option B: Add Auth to Your App**
```typescript
// Add a simple password check in App.tsx
const [authenticated, setAuthenticated] = useState(false);
const password = "demo123";

if (!authenticated) {
  return (
    <div>
      <input 
        type="password" 
        onChange={(e) => e.target.value === password && setAuthenticated(true)} 
      />
    </div>
  );
}
```

---

## 🎯 Recommended Setup

**For Demo/Testing (Best Free Option):**
```powershell
# Use ngrok - most reliable
ngrok http 5173 --region in

# Share the URL with anyone
# They can access your CRM from anywhere!
```

**For Longer Sessions:**
```powershell
# Use Cloudflare Tunnel - no time limits
cloudflared tunnel --url http://localhost:5173
```

**For Production (Not Free):**
- Deploy to Vercel (frontend) + Render (backend)
- Use proper hosting with custom domain
- See deployment guide for details

---

## 🐛 Troubleshooting

### Issue 1: "Tunnel Not Working"
```powershell
# Check if CRM is running
netstat -an | findstr ":5173"
netstat -an | findstr ":3000"

# If not, start it
npm run dev
```

### Issue 2: "ngrok Command Not Found"
```powershell
# Add to PATH or use full path
C:\Windows\System32\ngrok.exe http 5173
```

### Issue 3: "API Calls Failing"
- Make sure you updated the API URL in frontend
- Check CORS settings in backend (should allow all origins in development)
- Verify both tunnels are running

### Issue 4: "Slow Connection"
```powershell
# Use India region for faster speeds
ngrok http 5173 --region in

# Or use Cloudflare (generally faster)
cloudflared tunnel --url http://localhost:5173
```

---

## 📊 Comparison Chart

| Feature | ngrok | Cloudflare | localtunnel | Serveo |
|---------|-------|------------|-------------|---------|
| **Setup** | Easy | Easy | Easy | Easiest |
| **Speed** | Good | Excellent | Good | Fair |
| **Limits** | 2hrs, 40/min | None | None | None |
| **Custom URL** | Paid | Free | Free | Random |
| **HTTPS** | Yes | Yes | Yes | Yes |
| **Reliability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Best For** | Quick demos | Long sessions | Testing | Quick share |

---

## 🎓 Pro Tips

1. **Use India Region**: Faster for Indian users
   ```powershell
   ngrok http 5173 --region in
   ```

2. **Web Interface**: ngrok provides a dashboard
   - Visit: http://127.0.0.1:4040
   - See all requests and responses
   - Debug API calls

3. **Share QR Code**: Generate QR for easy mobile access
   ```powershell
   # Install qrcode generator
   npm install -g qrcode-terminal
   
   # Generate QR
   qrcode-terminal "https://your-ngrok-url.ngrok-free.app"
   ```

4. **Keep Alive**: For long demos, use Cloudflare instead of ngrok

5. **Multiple Tunnels**: Run both frontend and backend tunnels simultaneously

---

## 📞 Support

- **ngrok Docs**: https://ngrok.com/docs
- **Cloudflare Tunnel**: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/
- **GitHub Issues**: Report problems in our repo

---

## 🚀 Quick Commands Reference

```powershell
# Start CRM
npm run dev

# ngrok (2 hour limit, reliable)
ngrok http 5173 --region in

# Cloudflare (unlimited, fast)
cloudflared tunnel --url http://localhost:5173

# localtunnel (unlimited, simple)
lt --port 5173 --subdomain mycrm

# Serveo (no install)
ssh -R 80:localhost:5173 serveo.net
```

---

**Your CRM is now accessible from ANYWHERE in the world! 🌍**

Share the URL and let others test it from their phones, laptops, or tablets - no VPN needed!
