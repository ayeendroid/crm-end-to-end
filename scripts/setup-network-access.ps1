# PowerShell script to configure firewall and show network access info

Write-Host "🔥 Configuring Windows Firewall..." -ForegroundColor Cyan

# Add firewall rules
try {
    New-NetFirewallRule -DisplayName "Node.js Server (Port 3000)" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow -ErrorAction Stop
    Write-Host "✅ Added firewall rule for port 3000 (Backend API)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Port 3000 rule may already exist" -ForegroundColor Yellow
}

try {
    New-NetFirewallRule -DisplayName "Vite Dev Server (Port 5173)" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow -ErrorAction Stop
    Write-Host "✅ Added firewall rule for port 5173 (Frontend)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Port 5173 rule may already exist" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🌐 Getting Network Information..." -ForegroundColor Cyan
Write-Host ""

# Get all IPv4 addresses
$IPs = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.*" }

if ($IPs) {
    Write-Host "📡 Your Network IP Addresses:" -ForegroundColor Yellow
    foreach ($IP in $IPs) {
        $Adapter = Get-NetAdapter -InterfaceIndex $IP.InterfaceIndex
        Write-Host "   $($Adapter.Name): $($IP.IPAddress)" -ForegroundColor White
    }
    
    # Use the first non-loopback IP
    $MainIP = $IPs[0].IPAddress
    
    Write-Host ""
    Write-Host "🚀 Access Your CRM from any device on the same network:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   Frontend:  http://$MainIP:5173" -ForegroundColor Green
    Write-Host "   Backend:   http://$MainIP:3000" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 On your phone/tablet:" -ForegroundColor Yellow
    Write-Host "   1. Connect to the same WiFi" -ForegroundColor White
    Write-Host "   2. Open browser" -ForegroundColor White
    Write-Host "   3. Go to: http://$MainIP:5173" -ForegroundColor Green
    Write-Host ""
    
    # Check if servers are running
    Write-Host "🔍 Checking if servers are running..." -ForegroundColor Cyan
    
    $FrontendRunning = (Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue) -ne $null
    $BackendRunning = (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue) -ne $null
    
    if ($FrontendRunning) {
        Write-Host "   ✅ Frontend server is RUNNING on port 5173" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Frontend server NOT running" -ForegroundColor Red
        Write-Host "      Start with: npm run dev" -ForegroundColor Yellow
    }
    
    if ($BackendRunning) {
        Write-Host "   ✅ Backend server is RUNNING on port 3000" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Backend server NOT running" -ForegroundColor Red
        Write-Host "      Start with: npm run dev" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "💡 Pro Tips:" -ForegroundColor Cyan
    Write-Host "   • Bookmark http://$MainIP:5173 on your mobile devices" -ForegroundColor White
    Write-Host "   • Add to home screen for app-like experience" -ForegroundColor White
    Write-Host "   • Make sure all devices are on the SAME WiFi network" -ForegroundColor White
    
} else {
    Write-Host "❌ Could not detect network IP address" -ForegroundColor Red
    Write-Host "   Make sure you're connected to WiFi or Ethernet" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Setup complete! Start your servers if not running." -ForegroundColor Green
