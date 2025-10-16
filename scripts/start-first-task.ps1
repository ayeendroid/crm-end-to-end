# 🎯 Quick Start: First Implementation Task

Write-Host "=== 🚀 CRM Development - First Task ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Current Task: Virtual Scrolling Implementation" -ForegroundColor Yellow
Write-Host ""

Write-Host "Priority: HIGH" -ForegroundColor Red
Write-Host "Estimated Time: 2-3 days" -ForegroundColor White
Write-Host "Library: TanStack Virtual" -ForegroundColor White
Write-Host ""

Write-Host "=== Steps to Complete ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Install TanStack Virtual" -ForegroundColor Yellow
Write-Host "   cd client" -ForegroundColor White
Write-Host "   npm install @tanstack/react-virtual" -ForegroundColor Green
Write-Host ""

Write-Host "2. Ask Perplexity for Implementation" -ForegroundColor Yellow
Write-Host "   Open your Perplexity Space and paste this query:" -ForegroundColor White
Write-Host ""
Write-Host "   ---COPY THIS QUERY---" -ForegroundColor Cyan

$query = @"

I need to implement virtual scrolling in my CustomerList component using TanStack Virtual.

Current CustomerList component location: client/src/components/Customers/CustomerList.tsx

Requirements:
- Handle 1000+ customers smoothly
- Maintain existing filtering and sorting
- Keep existing TypeScript types
- Smooth scrolling performance
- Proper loading states

Provide:
1. Complete CustomerList component with virtual scrolling
2. TypeScript types
3. Usage example
4. Performance optimization tips

After this, I'll need the same for DealPipeline and LeadList components.

"@

Write-Host $query -ForegroundColor White
Write-Host "   ---END QUERY---" -ForegroundColor Cyan
Write-Host ""

# Copy query to clipboard
$query | Set-Clipboard
Write-Host "✅ Query copied to clipboard!" -ForegroundColor Green
Write-Host ""

Write-Host "3. Implement the Code" -ForegroundColor Yellow
Write-Host "   - Paste Perplexity's response into your files" -ForegroundColor White
Write-Host "   - Test the implementation" -ForegroundColor White
Write-Host "   - Verify acceptance criteria" -ForegroundColor White
Write-Host ""

Write-Host "4. Test & Verify" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor Green
Write-Host "   - Open customer list" -ForegroundColor White
Write-Host "   - Check scrolling performance" -ForegroundColor White
Write-Host "   - Test with large dataset" -ForegroundColor White
Write-Host ""

Write-Host "5. Commit Changes" -ForegroundColor Yellow
Write-Host "   git add ." -ForegroundColor Green
Write-Host "   git commit -m 'feat: implement virtual scrolling for customer list'" -ForegroundColor Green
Write-Host ""

Write-Host "=== Acceptance Criteria ===" -ForegroundColor Cyan
Write-Host "[ ] Customer list renders smoothly with 1000+ items" -ForegroundColor White
Write-Host "[ ] Scroll performance < 16ms per frame" -ForegroundColor White
Write-Host "[ ] Memory usage optimized" -ForegroundColor White
Write-Host "[ ] Existing features still work (filter, sort)" -ForegroundColor White
Write-Host ""

Write-Host "=== Next Tasks ===" -ForegroundColor Cyan
Write-Host "After completing this:" -ForegroundColor White
Write-Host "- Apply same to DealPipeline" -ForegroundColor White
Write-Host "- Apply same to LeadList" -ForegroundColor White
Write-Host "- Move to Task 1.2: React.memo optimization" -ForegroundColor White
Write-Host ""

Write-Host "📚 Full Roadmap: IMPLEMENTATION_ROADMAP.md" -ForegroundColor Cyan
Write-Host ""

Write-Host "Ready to start! Query is in your clipboard." -ForegroundColor Green
Write-Host "Go to Perplexity Space and paste with Ctrl+V" -ForegroundColor Green
Write-Host ""
