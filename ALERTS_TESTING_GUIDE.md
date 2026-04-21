# Alert Rules Management - Testing Guide

## Quick Start

### 1. Enable Mock Mode (Recommended for Testing)

The mock service is already enabled in `.env`:
```env
NEXT_PUBLIC_USE_MOCK_ALERTS=true
```

To disable and use real API:
```env
NEXT_PUBLIC_USE_MOCK_ALERTS=false
```

### 2. Start the Development Server

```bash
npm run dev
```

Then navigate to: `http://localhost:3000/alerts`

---

## Manual Testing Scenarios

### Scenario 1: View Alert Statistics

**Expected Result:**
- Stats cards show:
  - Open Alerts: 1
  - Active Rules: 2
  - Total Rules: 3
  - Critical Alerts: 1

### Scenario 2: Create a New Alert Rule

**Steps:**
1. Click "New Rule" button
2. Fill form:
   - Name: "Revenue Drop Alert"
   - Metric: "Revenue"
   - Condition: "Less than"
   - Threshold: 25000
   - Severity: "High"
   - Channels: Check "In-App" and "Slack"
   - Check "Activate this rule immediately"
3. Click "Create Rule"

**Expected Results:**
- Toast notification: "Alert rule created successfully"
- New rule appears in the list
- Stats update (Total Rules: 4, Active Rules: 3)

### Scenario 3: Edit an Alert Rule

**Steps:**
1. Click edit icon on "Low Cash Balance Alert"
2. Change threshold from 10000 to 15000
3. Click "Update Rule"

**Expected Results:**
- Toast notification: "Alert rule updated successfully"
- Rule card updates with new threshold
- Rule displays: "Alert when Cash Balance is <= 15000 USD"

### Scenario 4: Toggle Rule Active/Inactive

**Steps:**
1. Click "Active" button on any rule
2. Observe button changes to "Inactive"
3. Click again to reactivate

**Expected Results:**
- Button state toggles
- Rule card styling changes (active = white bg, inactive = gray bg)
- Stats update (Active Rules count changes)

### Scenario 5: Delete an Alert Rule

**Steps:**
1. Click delete icon on any rule
2. Confirm deletion in dialog
3. Observe rule is removed

**Expected Results:**
- Toast notification: "Alert rule deleted successfully"
- Rule disappears from list
- Stats update (Total Rules decreases)

### Scenario 6: View Open Alerts

**Steps:**
1. Click "Open Alerts" tab
2. Observe alert cards

**Expected Results:**
- Shows 1 open alert: "Cash balance has fallen below threshold"
- Shows 1 acknowledged alert: "Expenses have exceeded the threshold"
- Shows 1 resolved alert: "Multiple invoices are overdue"
- Each card shows current value, threshold, and status

### Scenario 7: Acknowledge an Alert

**Steps:**
1. In "Open Alerts" tab, find the open alert
2. Click "Acknowledge" button
3. Observe status changes

**Expected Results:**
- Toast notification: "Alert acknowledged"
- Alert status changes from "open" to "acknowledged"
- Button changes to show "Resolve" only
- Stats update (Open Alerts: 0)

### Scenario 8: Resolve an Alert

**Steps:**
1. Click "Resolve" button on any alert
2. Observe status changes

**Expected Results:**
- Toast notification: "Alert resolved"
- Alert status changes to "resolved"
- Alert card styling changes to green
- No action buttons shown for resolved alerts

### Scenario 9: Form Validation

**Steps:**
1. Click "New Rule"
2. Try to submit without filling required fields
3. Leave threshold empty
4. Uncheck all notification channels

**Expected Results:**
- Error messages appear:
  - "Rule name is required"
  - "Threshold must be non-negative"
  - "Select at least one notification channel"
- Form doesn't submit

### Scenario 10: Between Operator

**Steps:**
1. Create new rule
2. Select metric: "Revenue"
3. Select condition: "Between"
4. Set Min Threshold: 20000
5. Set Max Threshold: 50000

**Expected Results:**
- Two threshold inputs appear
- Form validates that max > min
- Rule displays: "Alert when Revenue is between 20000 and 50000 USD"

---

## Browser DevTools Testing

### Check Console for Errors

Open DevTools (F12) → Console tab:
- Should see no red errors
- May see info logs about data fetching

### Check Network Tab

Open DevTools → Network tab:
- When creating/updating/deleting rules, no network requests should be made (using mock)
- When toggling `NEXT_PUBLIC_USE_MOCK_ALERTS=false`, should see API calls

### Check React Query DevTools

If React Query DevTools is installed:
- Open DevTools → React Query tab
- Observe query keys: `["alerts", "rules"]`, `["alerts", "events"]`, `["alerts", "stats"]`
- Watch queries refetch at configured intervals

---

## Performance Testing

### Test Auto-Refetch

1. Open Alerts page
2. Open DevTools → Console
3. Add this code to monitor refetches:

```javascript
// Monitor query refetches
const originalFetch = window.fetch;
let fetchCount = 0;
window.fetch = function(...args) {
  if (args[0].includes('alerts')) {
    console.log(`[${++fetchCount}] Alerts API call:`, args[0]);
  }
  return originalFetch.apply(this, args);
};
```

4. Wait 30 seconds and observe refetch behavior

**Expected:**
- Stats refetch every 30 seconds
- Events refetch every 20 seconds
- Rules refetch on demand only

---

## Switching Between Mock and Real API

### To Use Real Backend:

1. Update `.env`:
```env
NEXT_PUBLIC_USE_MOCK_ALERTS=false
```

2. Restart dev server:
```bash
npm run dev
```

3. Ensure backend is running at `http://localhost:3000/api`

4. Test CRUD operations - should make real API calls

### To Return to Mock:

1. Update `.env`:
```env
NEXT_PUBLIC_USE_MOCK_ALERTS=true
```

2. Restart dev server

---

## Accessibility Testing

### Keyboard Navigation

1. Press Tab to navigate through form fields
2. Press Enter to submit form
3. Press Space to toggle checkboxes
4. Verify all interactive elements are reachable

### Screen Reader Testing

Use browser's built-in accessibility inspector:
- DevTools → Accessibility tab
- Verify all labels are associated with inputs
- Verify buttons have descriptive text
- Verify severity badges have color + text (not color-only)

---

## Mobile Responsiveness Testing

1. Open DevTools → Device Toolbar (Ctrl+Shift+M)
2. Test on different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1024px+)

**Expected:**
- Stats cards stack on mobile
- Rules grid shows 1 column on mobile, 2 on tablet, 2 on desktop
- Form inputs are full width on mobile
- All buttons are easily tappable (min 44px height)

---

## Error Handling Testing

### Test Network Errors (Real API Only)

1. Set `NEXT_PUBLIC_USE_MOCK_ALERTS=false`
2. Stop backend server
3. Try to create/update/delete rule

**Expected:**
- Toast error notification appears
- Form remains open for retry
- No data is lost

### Test Validation Errors

1. Try to create rule with invalid data
2. Observe form validation messages

**Expected:**
- Clear error messages
- Form doesn't submit
- User can correct and retry

---

## Checklist

- [ ] Stats cards display correct numbers
- [ ] Can create new alert rule
- [ ] Can edit existing rule
- [ ] Can delete rule with confirmation
- [ ] Can toggle rule active/inactive
- [ ] Can view open alerts
- [ ] Can acknowledge alert
- [ ] Can resolve alert
- [ ] Form validation works
- [ ] Toast notifications appear
- [ ] No console errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Keyboard navigation works
- [ ] Auto-refetch works (check Network tab)
- [ ] Can switch between mock and real API

---

## Troubleshooting

### Rules not appearing?
- Check if `NEXT_PUBLIC_USE_MOCK_ALERTS=true` in `.env`
- Restart dev server after changing `.env`
- Check browser console for errors

### Mutations not working?
- Verify toast notifications appear
- Check React Query DevTools for mutation status
- Check browser console for error messages

### Stats not updating?
- Wait 30 seconds for auto-refetch
- Manually refresh page
- Check if queries are in "loading" state

### Form validation not working?
- Check browser console for JavaScript errors
- Verify all form fields have proper names
- Try clearing browser cache

---

## Next Steps

Once testing is complete:
1. Commit changes to git
2. Deploy to staging environment
3. Perform integration testing with real backend
4. Get stakeholder approval
5. Deploy to production
