# Generate Perplexity Context Script
# This script creates a fresh context package for Perplexity Pro

Write-Host "=== 🤖 Perplexity Context Generator ===" -ForegroundColor Cyan
Write-Host ""

$timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$outputDir = "perplexity-context"
$outputFile = "perplexity-context-$timestamp.md"

# Create output directory
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

Write-Host "📦 Generating context package..." -ForegroundColor Yellow
Write-Host ""

# Start building the context file
$context = @"
# 🚀 CRM Project Context - Generated $timestamp

## Quick Summary
This is a comprehensive snapshot of the BharatNet CRM project for development assistance.

---

"@

# Add project overview
Write-Host "Adding project overview..." -ForegroundColor Green
if (Test-Path "PERPLEXITY_COMPLETE_CONTEXT.md") {
    $context += Get-Content "PERPLEXITY_COMPLETE_CONTEXT.md" -Raw
    $context += "`n`n---`n`n"
}

# Add current status
Write-Host "Adding current status..." -ForegroundColor Green
if (Test-Path "CURRENT_STATUS.md") {
    $context += "## Current Development Status`n`n"
    $context += Get-Content "CURRENT_STATUS.md" -Raw
    $context += "`n`n---`n`n"
}

# Add roadmap
Write-Host "Adding roadmap..." -ForegroundColor Green
if (Test-Path "ROADMAP.md") {
    $context += "## Development Roadmap`n`n"
    $context += Get-Content "ROADMAP.md" -Raw
    $context += "`n`n---`n`n"
}

# Add pending tasks
Write-Host "Adding pending tasks..." -ForegroundColor Green
if (Test-Path "WHATS_PENDING_DETAILED.md") {
    $context += "## Pending Tasks and Issues`n`n"
    $context += Get-Content "WHATS_PENDING_DETAILED.md" -Raw
    $context += "`n`n---`n`n"
}

# Add file structure
Write-Host "Analyzing file structure..." -ForegroundColor Green
$context += "## Current File Structure`n`n"
$context += "``````text`n"
$context += "Project Root:`n"
$context += Get-ChildItem -Path . -Exclude node_modules,.git,.venv,perplexity-context -Name | Out-String
$context += "`n"

if (Test-Path "client/src") {
    $context += "`nFrontend (client/src/):`n"
    $context += Get-ChildItem -Path "client/src" -Recurse -Exclude node_modules | Where-Object { !$_.PSIsContainer } | Select-Object -ExpandProperty FullName | ForEach-Object { $_.Replace("$PWD\", "") } | Out-String
}

if (Test-Path "server/src") {
    $context += "`nBackend (server/src/):`n"
    $context += Get-ChildItem -Path "server/src" -Recurse -Exclude node_modules | Where-Object { !$_.PSIsContainer } | Select-Object -ExpandProperty FullName | ForEach-Object { $_.Replace("$PWD\", "") } | Out-String
}

$context += "``````"
$context += "`n`n---`n`n"

# Add package.json dependencies
Write-Host "Adding dependencies..." -ForegroundColor Green
$context += "## Dependencies`n`n"

if (Test-Path "package.json") {
    $context += "### Root Dependencies`n``````json`n"
    $context += Get-Content "package.json" -Raw
    $context += "`n``````"
    $context += "`n`n"
}

if (Test-Path "client/package.json") {
    $context += "### Frontend Dependencies`n``````json`n"
    $context += Get-Content "client/package.json" -Raw
    $context += "`n``````"
    $context += "`n`n"
}

if (Test-Path "server/package.json") {
    $context += "### Backend Dependencies`n``````json`n"
    $context += Get-Content "server/package.json" -Raw
    $context += "`n``````"
    $context += "`n`n"
}

$context += "---`n`n"

# Add recent changes
Write-Host "Adding recent changes..." -ForegroundColor Green
$context += "## Recent Git Activity`n`n"
$context += "``````bash`n"
$context += git log --oneline --max-count=20 2>$null | Out-String
$context += "``````"
$context += "`n`n---`n`n"

# Add environment setup
Write-Host "Adding environment info..." -ForegroundColor Green
$context += "## Environment Configuration`n`n"
if (Test-Path "client/.env.example") {
    $context += "### Frontend .env.example`n``````bash`n"
    $context += Get-Content "client/.env.example" -Raw
    $context += "`n``````"
    $context += "`n`n"
}

if (Test-Path "server/.env.example") {
    $context += "### Backend .env.example`n``````bash`n"
    $context += Get-Content "server/.env.example" -Raw
    $context += "`n``````"
    $context += "`n`n"
}

$context += "---`n`n"

# Add instructions for Perplexity
$context += @"
## Instructions for AI Assistant

### Your Role
You are assisting with the development of this CRM system. You have complete context about architecture, current implementation, pending features, code structure, and development priorities.

### When Responding:
1. Be Specific - Reference actual files, functions, and components
2. Follow Patterns - Use existing code patterns and conventions
3. Consider Context - Remember this is an ongoing project with established structure
4. Provide Complete Code - Give full, working code examples
5. Explain Trade-offs - Discuss pros/cons of different approaches
6. Think Holistically - Consider impact on frontend, backend, and database

### Current Focus Areas:
1. Email integration (Gmail API)
2. Real-time updates (Socket.io)
3. Performance optimization (virtual scrolling)
4. Mobile responsiveness improvements
5. Test coverage increase

### Questions to Ask Developer:
- What specific feature/bug are you working on?
- Do you need frontend, backend, or full-stack implementation?
- Any specific constraints or requirements?
- Should I prioritize performance, readability, or features?

---

**END OF CONTEXT DOCUMENT**

Generated: $timestamp
Project: BharatNet CRM v2.0
Repository: github.com/ayeendroid/crm-end-to-end
"@

# Save the context file
$fullPath = Join-Path $outputDir $outputFile
$context | Out-File -FilePath $fullPath -Encoding UTF8

Write-Host ""
Write-Host "✅ Context package generated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Location: $fullPath" -ForegroundColor Cyan
Write-Host "📊 Size: $((Get-Item $fullPath).Length / 1KB) KB" -ForegroundColor Cyan
Write-Host ""

# Copy to clipboard if available
if (Get-Command Set-Clipboard -ErrorAction SilentlyContinue) {
    $context | Set-Clipboard
    Write-Host "📋 Content copied to clipboard!" -ForegroundColor Green
    Write-Host "   You can paste directly into Perplexity Pro" -ForegroundColor White
} else {
    Write-Host "💡 To use: Open the file and copy its contents to Perplexity Pro" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Go to perplexity.ai and login" -ForegroundColor White
Write-Host "2. Create a new Space: 'CRM Development'" -ForegroundColor White
Write-Host "3. Upload this file to the Space" -ForegroundColor White
Write-Host "4. Start asking development questions!" -ForegroundColor White
Write-Host ""

# Also create a quick-reference file
$quickRef = @"
# Quick Reference for Perplexity Queries

## Effective Query Examples

### Architecture Questions
- "Given my CRM's current architecture, what's the best way to implement real-time notifications?"
- "How should I structure Socket.io integration with my existing Express backend?"
- "What's the best approach for email integration considering my current tech stack?"

### Code Review
- "Review this React component for performance issues: [paste component]"
- "Suggest improvements for this API endpoint: [paste code]"
- "How can I optimize this database query: [paste query]"

### Feature Implementation
- "I need to add calendar integration. Given my current setup, provide a step-by-step implementation plan"
- "Help me implement virtual scrolling for the customer list that has 500+ items"
- "How do I add file upload functionality to customer profiles?"

### Debugging
- "I'm getting this error in my lead conversion: [paste error]. Here's my code: [paste code]"
- "Why is my dashboard rendering slowly? Here's the component: [paste component]"
- "My WebSocket connection keeps dropping. Current implementation: [paste code]"

### Best Practices
- "What are security best practices I should implement for file uploads in my CRM?"
- "How should I structure error handling across my React application?"
- "What's the best way to implement pagination for my customer list?"

### Testing
- "Write Jest tests for this service: [paste code]"
- "Create React Testing Library tests for this component: [paste component]"
- "What integration tests should I write for the lead conversion flow?"

## Tips for Better Results

1. **Be Specific** - Reference exact files, components, or features
2. **Provide Context** - Mention related code or features
3. **Ask Follow-ups** - Build on previous answers
4. **Request Code** - Ask for complete, working examples
5. **Discuss Trade-offs** - Ask about pros/cons of approaches

## Sample Development Session

**Query 1:** "I need to implement email integration in my CRM. Given my tech stack (React, Node.js, MongoDB), what's the best approach?"

**Query 2:** [After getting response] "Great! Can you provide the complete Node.js service code for Gmail API integration?"

**Query 3:** "Now show me the React component to trigger email sends and display email history"

**Query 4:** "What database schema changes do I need to store email data?"

**Query 5:** "How do I test this email functionality?"

---

Generated: $timestamp
"@

$quickRefPath = Join-Path $outputDir "QUICK_REFERENCE_$timestamp.md"
$quickRef | Out-File -FilePath $quickRefPath -Encoding UTF8

Write-Host "📝 Also created: $quickRefPath" -ForegroundColor Green
Write-Host ""
