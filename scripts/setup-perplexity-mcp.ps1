# Perplexity MCP Setup Script
# Run this script to configure Perplexity MCP for VS Code

Write-Host "=== Perplexity MCP Setup for VS Code ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify Python installation
Write-Host "Step 1: Verifying Python 3.11+ installation..." -ForegroundColor Yellow
$pythonPath = "C:\ProgramData\anaconda3\python.exe"

if (Test-Path $pythonPath) {
    $pythonVersion = & $pythonPath --version
    Write-Host "✅ Found: $pythonVersion at $pythonPath" -ForegroundColor Green
} else {
    Write-Host "❌ Python not found at $pythonPath" -ForegroundColor Red
    Write-Host "Please update the pythonPath variable in this script" -ForegroundColor Red
    exit 1
}

# Step 2: Verify perplexity-mcp module
Write-Host ""
Write-Host "Step 2: Verifying perplexity-mcp installation..." -ForegroundColor Yellow
try {
    $moduleCheck = & $pythonPath -c "import perplexity_mcp; print('OK')" 2>&1
    if ($moduleCheck -like "*OK*") {
        Write-Host "✅ perplexity-mcp module is installed" -ForegroundColor Green
    } else {
        Write-Host "❌ perplexity-mcp module not found" -ForegroundColor Red
        Write-Host "Installing perplexity-mcp..." -ForegroundColor Yellow
        & $pythonPath -m pip install perplexity-mcp
    }
} catch {
    Write-Host "❌ Error checking module: $_" -ForegroundColor Red
}

# Step 3: Create MCP configuration in User Settings
Write-Host ""
Write-Host "Step 3: Configuring MCP in VS Code User Settings..." -ForegroundColor Yellow

# Prompt for API key (do not hardcode for security)
$apiKey = Read-Host "Enter your Perplexity API Key"
$model = "sonar"

# Escape backslashes for JSON
$pythonPathEscaped = $pythonPath -replace '\\', '\\\\'

$mcpConfig = @"
{
  "github.copilot.chat.mcp.servers": {
    "perplexity": {
      "command": "$pythonPathEscaped",
      "args": ["-m", "perplexity_mcp.server"],
      "env": {
        "PERPLEXITY_API_KEY": "$apiKey",
        "PERPLEXITY_MODEL": "$model"
      }
    }
  }
}
"@

Write-Host ""
Write-Host "--- MCP Configuration to Add ---" -ForegroundColor Cyan
Write-Host $mcpConfig -ForegroundColor White
Write-Host "--- End Configuration ---" -ForegroundColor Cyan
Write-Host ""

Write-Host "MANUAL ACTION REQUIRED:" -ForegroundColor Yellow
Write-Host "1. Press Ctrl+Shift+P in VS Code" -ForegroundColor White
Write-Host "2. Type: 'Preferences: Open User Settings (JSON)'" -ForegroundColor White
Write-Host "3. Add the configuration shown above to your settings.json" -ForegroundColor White
Write-Host "4. Save the file (Ctrl+S)" -ForegroundColor White
Write-Host "5. Reload VS Code window (Ctrl+Shift+P -> 'Developer: Reload Window')" -ForegroundColor White
Write-Host ""

# Alternative: Try to find and update settings.json automatically
$settingsPath = "$env:APPDATA\Code\User\settings.json"
Write-Host "Attempting automatic configuration..." -ForegroundColor Yellow

if (Test-Path $settingsPath) {
    Write-Host "Found settings.json at: $settingsPath" -ForegroundColor Green
    
    $backupPath = "$env:APPDATA\Code\User\settings.json.backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    Copy-Item $settingsPath $backupPath
    Write-Host "✅ Backup created at: $backupPath" -ForegroundColor Green
    
    try {
        $settings = Get-Content $settingsPath -Raw | ConvertFrom-Json -AsHashtable
        
        # Add or update the MCP configuration
        if (-not $settings.ContainsKey("github.copilot.chat.mcp.servers")) {
            $settings["github.copilot.chat.mcp.servers"] = @{}
        }
        
        $settings["github.copilot.chat.mcp.servers"]["perplexity"] = @{
            "command" = $pythonPath
            "args" = @("-m", "perplexity_mcp.server")
            "env" = @{
                "PERPLEXITY_API_KEY" = $apiKey
                "PERPLEXITY_MODEL" = $model
            }
        }
        
        $settings | ConvertTo-Json -Depth 10 | Set-Content $settingsPath -Encoding UTF8
        Write-Host "✅ settings.json updated successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "NEXT STEPS:" -ForegroundColor Yellow
        Write-Host "1. Reload VS Code window: Ctrl+Shift+P -> 'Developer: Reload Window'" -ForegroundColor White
        Write-Host "2. Open Copilot Chat: Ctrl+Alt+I" -ForegroundColor White
        Write-Host "3. Type: @perplexity What is the capital of France?" -ForegroundColor White
        
    } catch {
        Write-Host "❌ Error updating settings.json: $_" -ForegroundColor Red
        Write-Host "Please add the configuration manually using the steps above" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ settings.json not found at: $settingsPath" -ForegroundColor Red
    Write-Host "Please add the configuration manually using the steps above" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Setup Script Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Troubleshooting:" -ForegroundColor Yellow
Write-Host "- Check Output panel (Ctrl+Shift+U) -> 'GitHub Copilot Chat'" -ForegroundColor White
Write-Host "- Verify Copilot extension version (should be v0.12.0+)" -ForegroundColor White
Write-Host "- See PERPLEXITY_ADVANCED_TROUBLESHOOTING.md for more help" -ForegroundColor White
