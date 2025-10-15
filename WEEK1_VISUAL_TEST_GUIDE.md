# Week 1 Features - Visual Testing Guide 🎨

Quick guide to test all Week 1 features visually in the browser.

---

## 🚀 Getting Started

### Start the Application

```powershell
# Terminal 1 - Backend (Port 3000)
cd server
npm run dev

# Terminal 2 - Frontend (Port 5173)
cd client
npm run dev
```

### Access URL

```
http://localhost:5173
```

---

## ✅ Day 1-2: Reports Testing

### Navigate to Reports

1. Click **"Reports"** in sidebar navigation
2. Verify page loads with 4 tabs: Overview | Revenue | Deals | Leads

### Test Overview Tab

- [ ] See summary cards: Total Revenue, Total Deals, Total Leads, Avg Deal Size
- [ ] Cards show numbers and trend indicators (↑↓)
- [ ] Date range picker shows: Last 7 days, 30 days, 90 days, 1 year

### Test Revenue Tab

- [ ] Line chart displays revenue over time
- [ ] X-axis shows months
- [ ] Y-axis shows currency (₹)
- [ ] Hover tooltip shows exact values

### Test Deals Tab

- [ ] Bar chart shows deals by status
- [ ] Different colors for: New, Qualified, Proposal, Won, Lost
- [ ] Tooltip shows deal count

### Test Leads Tab

- [ ] Multiple metrics visible
- [ ] Charts render correctly
- [ ] No console errors

### Test Export

- [ ] Click "Export CSV" button
- [ ] Verify download starts (placeholder alert for now)

---

## ✅ Day 3: Activities & Tasks Testing

### Navigate to Activities

1. Click **"Activities"** in sidebar
2. See dual-tab interface: **Activities | Tasks**

### Test Activities Tab

- [ ] List of recent activities visible
- [ ] Each activity shows:
  - [ ] Icon (based on type)
  - [ ] Description
  - [ ] Timestamp
  - [ ] Related entity (Customer/Lead/Deal)
- [ ] Activity types: note, email, call, meeting, status_change

### Test Tasks Tab

- [ ] List of tasks visible
- [ ] Each task shows:
  - [ ] Title
  - [ ] Priority badge (High/Medium/Low)
  - [ ] Status (Todo/In Progress/Completed)
  - [ ] Due date
  - [ ] Assignee
- [ ] Click task to expand checklist (if available)

### Test Filters (if implemented)

- [ ] Filter by type
- [ ] Filter by date range
- [ ] Search functionality

---

## ✅ Day 4: Dashboard Charts Testing

### Navigate to Dashboard

1. Click **"Dashboard"** in sidebar (or home icon)
2. Wait for analytics to load

### Test Stats Grid

- [ ] 4 large cards at top:
  - [ ] Total Customers (with growth %)
  - [ ] Total Leads (with growth %)
  - [ ] Active Deals (with growth %)
  - [ ] Revenue (with growth %)
- [ ] Trend icons (↑ green, ↓ red, → gray)
- [ ] Hover effect on cards

### Test Date Range Picker

- [ ] Dropdown in top-right header
- [ ] Options: Last 7 days, 30 days, 90 days, 1 year
- [ ] Change date range → charts update
- [ ] Loading spinner shows during update

### Test Charts Toggle

- [ ] "Show Charts" / "Hide Charts" button
- [ ] Click to toggle all charts visibility
- [ ] Button text changes
- [ ] Charts section appears/disappears

### Test Revenue Trend Chart (Area Chart)

- [ ] Title: "Revenue Trend (Last 6 Months)"
- [ ] Blue gradient area chart
- [ ] X-axis: Month names
- [ ] Y-axis: Currency (₹K)
- [ ] Hover tooltip shows exact revenue
- [ ] Smooth animation on load

### Test Deals Trend Chart (Line Chart)

- [ ] Title: "Deals Progress Over Time"
- [ ] Multiple colored lines (one per stage)
- [ ] Legend shows: New, Qualified, Proposal, Won
- [ ] X-axis: Months
- [ ] Y-axis: Number of deals
- [ ] Hover shows all stages' values

### Test Pipeline Chart (Horizontal Bar Chart)

- [ ] Title: "Deal Pipeline Distribution"
- [ ] Horizontal bars with different colors
- [ ] Labels: New, Qualified, Proposal, Negotiation, Won, Lost
- [ ] Values show deal counts
- [ ] Hover tooltip

### Test Lead Source Chart (Pie Chart)

- [ ] Title: "Lead Distribution by Source"
- [ ] Colorful pie segments
- [ ] Labels: Website, Referral, Social Media, Email, Other
- [ ] Percentages visible
- [ ] Hover highlights segment
- [ ] Center hole (donut style)

### Test Customer Growth Chart (Bar Chart)

- [ ] Title: "Customer Growth Trend"
- [ ] Vertical blue bars
- [ ] X-axis: Months
- [ ] Y-axis: Customer count
- [ ] Hover shows exact count

---

## ✅ Day 5: Advanced Dashboard Features Testing

### Test Refresh Button

- [ ] Click **"Refresh 🔄"** button in header
- [ ] Loading spinner appears briefly
- [ ] All dashboard data updates
- [ ] Charts re-render with latest data

### Test Customize Button

- [ ] Click **"Customize ⚙️"** button in header
- [ ] Customization panel opens below header
- [ ] Panel shows:
  - [ ] Title: "Customize Dashboard Widgets"
  - [ ] "Reset to Default" button
  - [ ] Grid of 11 checkboxes

### Test Widget Visibility Toggles

Panel should show these options (all checked by default):

1. [ ] **Stats** - Toggle off → 4 stat cards disappear
2. [ ] **Alerts** - Toggle off → alerts section disappears
3. [ ] **Revenue Chart** - Toggle off → revenue area chart disappears
4. [ ] **Deals Chart** - Toggle off → deals line chart disappears
5. [ ] **Pipeline Chart** - Toggle off → pipeline bar chart disappears
6. [ ] **Lead Source Chart** - Toggle off → lead pie chart disappears
7. [ ] **Customer Growth Chart** - Toggle off → customer bar chart disappears
8. [ ] **Funnel Chart** - Toggle off → conversion funnel disappears
9. [ ] **Timeline** - Toggle off → activity timeline disappears
10. [ ] **Quick Actions** - Toggle off → quick actions card disappears
11. [ ] **Network Status** - Toggle off → network status disappears

### Test Eye Icons

- [ ] Checked widget shows green 👁️ eye icon
- [ ] Unchecked widget shows gray 👁️‍🗨️ eyeOff icon
- [ ] Icons update instantly when toggling

### Test Reset to Default

- [ ] Uncheck several widgets
- [ ] Click "Reset to Default" button
- [ ] All checkboxes return to checked
- [ ] All widgets reappear on dashboard

### Test Conversion Funnel Chart (NEW!)

- [ ] Section title: "Conversion Funnel"
- [ ] Subtitle: "Track your lead-to-customer conversion journey"
- [ ] Funnel shape with 4 stages:
  1. **Total Leads** (Blue)
  2. **Qualified Leads** (Purple)
  3. **Active Deals** (Green)
  4. **Won Deals** (Amber)
- [ ] Labels on right show: name, count, percentage
- [ ] Below funnel: 4 summary cards in grid
  - [ ] Colored dot matches stage color
  - [ ] Stage name
  - [ ] Count value
  - [ ] Percentage text

### Test Funnel Calculations

- [ ] Total Leads shows 100%
- [ ] Other stages show percentage relative to total leads
- [ ] Example: If 50 qualified out of 100 total → 50%
- [ ] Percentages update when data changes

---

## 📱 Responsive Design Testing

### Desktop (1920x1080)

- [ ] 4-column stats grid
- [ ] Charts side-by-side (2 columns)
- [ ] Customization panel 4 columns
- [ ] Funnel summary 4 columns

### Tablet (768px)

- [ ] 2-column stats grid
- [ ] Charts stack vertically
- [ ] Customization panel 3 columns
- [ ] Funnel summary 2 columns

### Mobile (375px)

- [ ] 1-column stats grid
- [ ] Charts full-width stacked
- [ ] Customization panel 2 columns
- [ ] Funnel summary 2 columns stacked
- [ ] Header buttons may wrap

---

## 🎨 UI/UX Checklist

### Consistency

- [ ] All buttons have hover effects
- [ ] Loading spinners show during data fetch
- [ ] Empty states show "No data available" with icon
- [ ] Color scheme consistent (blue primary)
- [ ] Border radius consistent (rounded-lg)
- [ ] Shadows consistent (shadow)

### Interactions

- [ ] Hover effects smooth
- [ ] Click feedback immediate
- [ ] Transitions not jarring
- [ ] No layout shifts
- [ ] Scroll smooth

### Typography

- [ ] Headings clear and hierarchical
- [ ] Body text readable
- [ ] Numbers formatted (commas, currency symbols)
- [ ] Dates formatted consistently

---

## 🐛 Common Issues to Check

### Data Loading

- [ ] No infinite loading states
- [ ] Error messages display if API fails
- [ ] Skeleton loaders or spinners during load

### Charts

- [ ] No "Chart.js is not defined" errors
- [ ] Tooltips don't overlap
- [ ] Labels not cut off
- [ ] Responsive breakpoints work
- [ ] No console warnings

### State Management

- [ ] Widget toggles persist during session
- [ ] Date range selection persists
- [ ] Charts visibility toggle persists
- [ ] Navigation doesn't reset state unexpectedly

### Performance

- [ ] Dashboard loads in < 2 seconds
- [ ] Chart animations smooth (60fps)
- [ ] No lag when toggling widgets
- [ ] Refresh doesn't freeze UI

---

## 🎯 Acceptance Criteria

All Week 1 features pass testing if:

1. ✅ Reports page shows all 4 tabs with correct data
2. ✅ Activities & Tasks page shows both tabs with data
3. ✅ Dashboard displays all 6 charts correctly
4. ✅ Conversion funnel renders with 4 stages
5. ✅ Widget customization works (11 toggles)
6. ✅ Refresh button updates data
7. ✅ Date range picker changes chart data
8. ✅ No TypeScript errors in console
9. ✅ No 404 errors in network tab
10. ✅ Responsive on mobile, tablet, desktop

---

## 📸 Screenshot Checklist

Take screenshots of:

1. [ ] Dashboard full view (all widgets visible)
2. [ ] Conversion funnel zoomed in
3. [ ] Customization panel open
4. [ ] Each individual chart
5. [ ] Reports page (all tabs)
6. [ ] Activities & Tasks page
7. [ ] Mobile view (375px)

---

## 🚨 Red Flags (Immediate Fix Required)

- ❌ White screen / blank page
- ❌ Console errors (red text)
- ❌ 500 Internal Server Error
- ❌ Charts not rendering (just "Loading..." forever)
- ❌ Clicking buttons does nothing
- ❌ Data shows as "NaN" or "undefined"
- ❌ UI completely broken on mobile

---

## ✅ Green Flags (All Good!)

- ✅ All sections render
- ✅ Data displays correctly
- ✅ Interactions work smoothly
- ✅ Console is clean (no errors)
- ✅ Network requests succeed (200 OK)
- ✅ UI looks professional
- ✅ Responsive on all sizes

---

## 🎉 Testing Complete!

If all checkboxes are checked:

- **Week 1 is production-ready! 🚀**
- Proceed to Week 2 development
- Deploy to staging environment
- Share with stakeholders for feedback

---

**Last Updated**: Day 5 completion
**Next**: Week 2 - Day 6 (Customer 360 View)
