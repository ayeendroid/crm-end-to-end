# Quick Perplexity Context Generator
Write-Host "=== Perplexity Context Generator ===" -ForegroundColor Cyan
Write-Host ""

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$outputDir = "perplexity-context"
$outputFile = "context-$timestamp.md"

# Create output directory
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

Write-Host "Generating context package..." -ForegroundColor Yellow

# Read the main context file
$mainContext = ""
if (Test-Path "PERPLEXITY_COMPLETE_CONTEXT.md") {
    $mainContext = Get-Content "PERPLEXITY_COMPLETE_CONTEXT.md" -Raw
}

# Create output
$fullPath = Join-Path $outputDir $outputFile
$mainContext | Out-File -FilePath $fullPath -Encoding UTF8

Write-Host ""
Write-Host "Done! Context saved to: $fullPath" -ForegroundColor Green
Write-Host "Size: $((Get-Item $fullPath).Length / 1KB) KB" -ForegroundColor Cyan
Write-Host ""

# Try to copy to clipboard
try {
    $mainContext | Set-Clipboard
    Write-Host "Content copied to clipboard!" -ForegroundColor Green
    Write-Host "You can paste it directly into Perplexity Pro" -ForegroundColor White
} catch {
    Write-Host "Could not copy to clipboard. Please open the file manually." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Go to perplexity.ai and login" -ForegroundColor White
Write-Host "2. Create a new Space for CRM Development" -ForegroundColor White
Write-Host "3. Upload the generated file or paste the clipboard content" -ForegroundColor White
Write-Host "4. Start asking development questions!" -ForegroundColor White
Write-Host ""
