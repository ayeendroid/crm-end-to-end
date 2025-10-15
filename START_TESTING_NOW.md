# Week 1 Testing Checklist - START HERE! 🚀

**Testing Session**: October 16, 2025
**Status**: 🟢 READY TO TEST
**Rate Limit**: Fixed (1000 req/15min)

---

## ✅ Pre-Test Verification

- [x] Backend running on http://localhost:3000
- [x] Frontend running on http://localhost:5173
- [x] All caches cleared
- [x] Rate limit increased to 1000 req/15min
- [x] Servers restarted with fresh counters
- [ ] Browser open at http://localhost:5173
- [ ] DevTools console open (F12)

---

## 🎯 Quick 5-Minute Test

### Test 1: Dashboard Loading (2 minutes)

1. [ ] Open http://localhost:5173
2. [ ] Login if needed (use your test credentials)
3. [ ] Click "Dashboard" in sidebar
4. [ ] **CHECK**: Page loads without "too many requests" error ✅
5. [ ] **CHECK**: 4 stat cards appear at top
6. [ ] **CHECK**: Charts start loading progressively
7. [ ] **CHECK**: No red errors in console (F12)

**Expected**: Dashboard loads smoothly with all data

### Test 2: Refresh Test (1 minute)

1. [ ] Click the "Refresh" button (🔄 icon) in Dashboard header
2. [ ] Wait 2-3 seconds
3. [ ] **CHECK**: Dashboard updates without errors
4. [ ] Click Refresh 5 more times rapidly
5. [ ] **CHECK**: No "too many requests" error appears

**Expected**: Multiple refreshes work without rate limiting

### Test 3: Date Range Test (1 minute)

1. [ ] Click date range dropdown (currently "Last 30 days")
2. [ ] Select "Last 7 days"
3. [ ] **CHECK**: Charts update
4. [ ] Select "Last 90 days"
5. [ ] **CHECK**: Charts update again
6. [ ] Select "Last year"
7. [ ] **CHECK**: Still no errors

**Expected**: Date range changes work smoothly

### Test 4: Widget Customization (1 minute)

1. [ ] Click "Customize" button (⚙️ icon)
2. [ ] **CHECK**: Customization panel opens
3. [ ] Uncheck "Stats" → **CHECK**: 4 stat cards disappear
4. [ ] Re-check "Stats" → **CHECK**: Cards reappear
5. [ ] Uncheck "Funnel Chart" → **CHECK**: Funnel disappears
6. [ ] Click "Reset to Default" → **CHECK**: All widgets reappear

**Expected**: Widget toggles work instantly

---

## 📋 Full Week 1 Testing (30 minutes)

### Day 1-2: Reports (5 minutes)

1. [ ] Click "Reports" in sidebar
2. [ ] **CHECK**: Page loads without errors
3. [ ] **CHECK**: 4 summary cards visible
4. [ ] Click "Revenue" tab
5. [ ] **CHECK**: Line chart renders
6. [ ] Click "Deals" tab
7. [ ] **CHECK**: Bar chart renders
8. [ ] Click "Leads" tab
9. [ ] **CHECK**: Data displays
10. [ ] Click "Export CSV" button
11. [ ] **CHECK**: Alert or download appears

**Status**: ⬜ PASS / ⬜ FAIL

### Day 3: Activities & Tasks (5 minutes)

1. [ ] Click "Activities" in sidebar
2. [ ] **CHECK**: Dual-tab interface: Activities | Tasks
3. [ ] **CHECK**: Activities list displays (or "No activities")
4. [ ] Click "Tasks" tab
5. [ ] **CHECK**: Tasks list displays (or "No tasks")
6. [ ] **CHECK**: Each task shows priority badge
7. [ ] **CHECK**: Each task shows status
8. [ ] Click a task to expand (if has checklist)
9. [ ] **CHECK**: Checklist items visible

**Status**: ⬜ PASS / ⬜ FAIL

### Day 4: Dashboard Charts (10 minutes)

1. [ ] Navigate back to Dashboard
2. [ ] **CHECK**: 4 stat cards at top
3. [ ] **CHECK**: Revenue Trend (blue area chart)
4. [ ] **CHECK**: Deals Progress (multi-line chart)
5. [ ] **CHECK**: Pipeline Distribution (horizontal bars)
6. [ ] **CHECK**: Lead Sources (pie/donut chart)
7. [ ] **CHECK**: Customer Growth (vertical bars)
8. [ ] Hover over each chart
9. [ ] **CHECK**: Tooltips show on hover
10. [ ] **CHECK**: All charts animated smoothly

**Status**: ⬜ PASS / ⬜ FAIL

### Day 5: Conversion Funnel (5 minutes)

1. [ ] Scroll to "Conversion Funnel" section
2. [ ] **CHECK**: Funnel chart visible
3. [ ] **CHECK**: 4 stages: Total Leads → Qualified → Active Deals → Won
4. [ ] **CHECK**: Colors: Blue → Purple → Green → Amber
5. [ ] **CHECK**: Labels show name, count, and percentage
6. [ ] **CHECK**: 4 summary cards below funnel
7. [ ] **CHECK**: Each card shows colored dot, name, value, percentage

**Status**: ⬜ PASS / ⬜ FAIL

### Day 5: Widget Customization (5 minutes)

1. [ ] Click "Customize" button
2. [ ] **CHECK**: Panel opens with 11 checkboxes
3. [ ] Test each widget toggle:
   - [ ] Stats → cards disappear/reappear
   - [ ] Alerts → alerts section disappear/reappear
   - [ ] Revenue Chart → chart disappear/reappear
   - [ ] Deals Chart → chart disappear/reappear
   - [ ] Pipeline Chart → chart disappear/reappear
   - [ ] Lead Source Chart → chart disappear/reappear
   - [ ] Customer Growth Chart → chart disappear/reappear
   - [ ] Funnel Chart → funnel disappear/reappear
   - [ ] Timeline → timeline disappear/reappear
   - [ ] Quick Actions → actions disappear/reappear
   - [ ] Network Status → status disappear/reappear
4. [ ] Click "Reset to Default"
5. [ ] **CHECK**: All checkboxes re-checked
6. [ ] **CHECK**: All widgets reappear

**Status**: ⬜ PASS / ⬜ FAIL

---

## 🔍 DevTools Checks (During Testing)

### Console Tab (F12)

- [ ] No red errors visible
- [ ] Only blue/gray info logs acceptable
- [ ] No "429 Too Many Requests" errors
- [ ] No "TypeError" or "ReferenceError"

### Network Tab

1. [ ] Open Network tab
2. [ ] Filter by "XHR" or "Fetch"
3. [ ] Reload Dashboard
4. [ ] **CHECK**: See ~5 API requests
5. [ ] **CHECK**: All return 200 OK (green)
6. [ ] **CHECK**: No 429 status codes (red)
7. [ ] **CHECK**: Requests are staggered (not all at once)

### Performance Tab (Optional)

1. [ ] Record page load
2. [ ] **CHECK**: Load time < 3 seconds
3. [ ] **CHECK**: No long tasks blocking UI
4. [ ] **CHECK**: Smooth animations (60fps)

---

## 🐛 Issue Tracking

### If You Find Issues

**Document Each Bug**:

```
BUG #1:
- Feature: [Dashboard / Reports / Activities / etc.]
- What you did: [steps to reproduce]
- Expected: [what should happen]
- Actual: [what actually happened]
- Screenshots: [attach if helpful]
- Console errors: [copy/paste from console]
```

### Common Issues & Solutions

**Issue**: "Too many requests" still appears

- **Solution**: Restart both servers (rate limit counter cleared)
- **Check**: Backend logs for rate limit messages

**Issue**: Dashboard blank/not loading

- **Solution**: Check console for errors, verify backend running
- **Check**: Network tab for failed requests

**Issue**: Charts not rendering

- **Solution**: Check if data is returned from API
- **Check**: Console for Recharts errors

**Issue**: Widget toggles not working

- **Solution**: Check console for React state errors
- **Check**: Customization panel is open

---

## ✅ Test Results Summary

### Quick Test (5 min)

- Dashboard Loading: ⬜ PASS / ⬜ FAIL
- Refresh Test: ⬜ PASS / ⬜ FAIL
- Date Range Test: ⬜ PASS / ⬜ FAIL
- Widget Customization: ⬜ PASS / ⬜ FAIL

### Full Test (30 min)

- Day 1-2 Reports: ⬜ PASS / ⬜ FAIL
- Day 3 Activities: ⬜ PASS / ⬜ FAIL
- Day 4 Charts: ⬜ PASS / ⬜ FAIL
- Day 5 Funnel: ⬜ PASS / ⬜ FAIL
- Day 5 Customization: ⬜ PASS / ⬜ FAIL

### Overall Result

- Week 1 Features: ⬜ ALL PASS / ⬜ SOME ISSUES / ⬜ MAJOR ISSUES

---

## 🎯 Success Criteria

**Week 1 is PRODUCTION READY if**:

1. ✅ All features load without "too many requests" error
2. ✅ All charts render correctly
3. ✅ Widget customization works smoothly
4. ✅ No critical console errors
5. ✅ Network requests all return 200 OK
6. ✅ Performance is acceptable (< 3s load)

**If ALL criteria met** → ✅ **Ready for Week 2!** 🚀

---

## 📝 Notes Section

**Tester observations**:

```
[Write any observations, suggestions, or feedback here]




```

---

## 🚀 After Testing

### If All Tests Pass

1. ✅ Update WEEK1_TESTING_REPORT.md with results
2. ✅ Mark Week 1 as complete
3. ✅ Commit and push changes
4. 🎉 Proceed to Day 6: Customer 360 View

### If Issues Found

1. 📝 Document all issues above
2. 🐛 Fix critical bugs first
3. 🧪 Retest after fixes
4. ✅ Verify all fixes work
5. 📤 Then proceed to Week 2

---

**Current Time**: Ready to start testing!
**Servers Status**: ✅ Running
**Rate Limit**: ✅ Fixed (1000 req/15min)
**Browser**: http://localhost:5173

**START TESTING NOW!** ⬇️

1. Open browser (http://localhost:5173)
2. Follow "Quick 5-Minute Test" first
3. If quick test passes, do full 30-minute test
4. Document any issues found
5. Report back results!

---

_Testing Checklist - Week 1 Features - Rate Limit Issue Resolved_
