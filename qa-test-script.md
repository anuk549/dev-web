# QA Test Script for Dev+ Quote Builder

## Pre-Deployment Verification

### 1. Build Verification
```bash
# Run build locally
npm run build

# Expected output:
# ✓ Compiled successfully
# ✓ Finished TypeScript
# ✓ Collecting page data
# ✓ Generating static pages
# ✓ Finalizing page optimization
```

### 2. Lint Check
```bash
npm run lint
```

## Post-Deployment Testing

### Phase 1: Basic Functionality Tests

#### Test 1.1: Homepage Load
1. Navigate to your Vercel deployment URL
2. Verify:
   - [ ] Page loads within 3 seconds
   - [ ] No console errors
   - [ ] Logo displays correctly
   - [ ] Welcome screen shows price estimate
   - [ ] "Start" button is clickable

#### Test 1.2: Language Toggle
1. Click the language toggle button (සිංහල/EN)
2. Verify:
   - [ ] Language switches between English and Sinhala
   - [ ] All text updates correctly
   - [ ] No layout shifts or errors

#### Test 1.3: Step Navigation
1. Click "Start" to begin the quote builder
2. Navigate through all 9 steps using Next/Back buttons
3. Verify:
   - [ ] Each step loads correctly
   - [ ] Step indicator updates (Step X of 9)
   - [ ] Back button works on all steps
   - [ ] Next button validates input where required

### Phase 2: Quote Builder Tests

#### Test 2.1: Step 1 - Frontend Selection
1. Select a frontend framework
2. Verify:
   - [ ] Selection is highlighted
   - [ ] Can change selection
   - [ ] Next button becomes active

#### Test 2.2: Step 2 - Language Selection
1. Select a development language
2. Verify:
   - [ ] Selection is highlighted
   - [ ] Can change selection
   - [ ] Next button works

#### Test 2.3: Step 3 - Backend Selection
1. Select a backend technology
2. Verify:
   - [ ] Selection is highlighted
   - [ ] Can change selection
   - [ ] Next button works

#### Test 2.4: Step 4 - Database Selection
1. Select a database
2. Verify:
   - [ ] Selection is highlighted
   - [ ] Can change selection
   - [ ] Next button works

#### Test 2.5: Step 5 - Features Selection
1. Toggle various features (Login, Encryption, JWT, etc.)
2. Verify:
   - [ ] Toggle states change correctly
   - [ ] Features are added/removed from summary
   - [ ] Next button works

#### Test 2.6: Step 6 - Schema Editor
1. Add/remove pages (tables)
2. Add/remove fields
3. Toggle CRUD operations
4. Verify:
   - [ ] Pages can be added and removed
   - [ ] Fields can be added and removed
   - [ ] CRUD toggles work
   - [ ] Page names can be edited
   - [ ] Field types can be changed

#### Test 2.7: Step 7 - Relations Editor
1. Add database relationships
2. Verify:
   - [ ] Source and target tables can be selected
   - [ ] Relation types can be selected
   - [ ] Relations are added to the list
   - [ ] Relations can be removed
   - [ ] Validation prevents invalid relations

#### Test 2.8: Step 8 - Preview
1. Review the project preview
2. Verify:
   - [ ] All selections are displayed correctly
   - [ ] Technology stack is shown
   - [ ] Features list is complete
   - [ ] Database tables are listed
   - [ ] Price and timeline are calculated

#### Test 2.9: Step 9 - Contact & Submit
1. Fill in contact information
2. Verify:
   - [ ] Form validates name (required)
   - [ ] Form validates email (required, valid format)
   - [ ] All input fields work
   - [ ] Validation errors display correctly

### Phase 3: Database Integration Tests

#### Test 3.1: Save to Database
1. Complete all 9 steps with valid data
2. Click "Save to Database" (or any action that triggers save)
3. Verify:
   - [ ] Loading indicator appears
   - [ ] Success message displays
   - [ ] Data is saved to MongoDB
   - [ ] No console errors

#### Test 3.2: Verify Database Record
1. Check MongoDB Atlas or use the `/api/db` endpoint
2. Verify:
   - [ ] Document exists in the `quotes` collection
   - [ ] All fields are correctly stored
   - [ ] Timestamp is recorded
   - [ ] Status is "pending"

### Phase 4: Export & Share Tests

#### Test 4.1: PDF Download
1. Click "Download PDF"
2. Verify:
   - [ ] PDF file is generated
   - [ ] File downloads successfully
   - [ ] PDF content is correct:
     - Client information
     - Technology stack
     - Features list
     - Database tables
     - Relationships
     - Delivery timeline
     - Contact information

#### Test 4.2: JSON Export
1. Click "Download JSON"
2. Verify:
   - [ ] JSON file is generated
   - [ ] File downloads successfully
   - [ ] JSON content is valid and complete
   - [ ] All project specifications are included

#### Test 4.3: WhatsApp Integration
1. Click "Send via WhatsApp"
2. Verify:
   - [ ] WhatsApp opens in new tab
   - [ ] Phone number is correct
   - [ ] Message is pre-filled with project details
   - [ ] Message includes all relevant information

### Phase 5: Edge Cases & Error Handling

#### Test 5.1: Form Validation
1. Try to proceed without filling required fields
2. Verify:
   - [ ] Appropriate error messages display
   - [ ] Cannot proceed with invalid data
   - [ ] Error messages are clear and helpful

#### Test 5.2: Network Errors
1. Simulate network failure (disable network in dev tools)
2. Try to save to database
3. Verify:
   - [ ] Error is handled gracefully
   - [ ] User sees error message
   - [ ] Application doesn't crash

#### Test 5.3: Invalid Email
1. Enter an invalid email format
2. Verify:
   - [ ] Validation error displays
   - [ ] Cannot proceed until fixed

#### Test 5.4: Large Data
1. Add many pages (10+) with many fields
2. Verify:
   - [ ] Application handles large data
   - [ ] PDF generation works
   - [ ] JSON export works
   - [ ] Database save works

### Phase 6: Performance Tests

#### Test 6.1: Page Load Time
1. Use Chrome DevTools Network tab
2. Measure homepage load time
3. Target: < 3 seconds on 3G

#### Test 6.2: API Response Time
1. Time the database save operation
2. Target: < 2 seconds

#### Test 6.3: Bundle Size
1. Check Next.js build output for bundle sizes
2. Verify no unexpectedly large bundles

### Phase 7: Security Tests

#### Test 7.1: Environment Variables
1. View page source
2. Verify:
   - [ ] MongoDB URI is NOT exposed
   - [ ] Other sensitive variables are NOT exposed
   - [ ] Only NEXT_PUBLIC_* variables are visible

#### Test 7.2: API Security
1. Try to access API routes with invalid data
2. Verify:
   - [ ] Input validation works
   - [ ] Proper error responses
   - [ ] No sensitive data in error messages

#### Test 7.3: Security Headers
1. Check response headers in DevTools
2. Verify presence of:
   - [ ] Content-Security-Policy
   - [ ] X-Frame-Options
   - [ ] X-Content-Type-Options
   - [ ] Strict-Transport-Security

### Phase 8: Mobile Responsiveness

#### Test 8.1: Mobile Layout
1. Use Chrome DevTools device emulation
2. Test on various screen sizes:
   - [ ] iPhone SE (375px)
   - [ ] iPhone 12 Pro (390px)
   - [ ] iPad (768px)
   - [ ] Desktop (1920px)
3. Verify:
   - [ ] Layout adapts correctly
   - [ ] All elements are accessible
   - [ ] No horizontal scrolling
   - [ ] Touch targets are large enough

#### Test 8.2: Mobile Interactions
1. Test on actual mobile device if possible
2. Verify:
   - [ ] Touch interactions work
   - [ ] Scrolling is smooth
   - [ ] Forms are usable
   - [ ] Buttons are tappable

## Automated Testing Commands

### Run All Tests
```bash
# Build test
npm run build

# Lint test
npm run lint

# Type check
npx tsc --noEmit
```

## Test Results Template

| Test Category | Total Tests | Passed | Failed | Notes |
|--------------|-------------|--------|--------|-------|
| Basic Functionality | 3 | 0 | 0 | |
| Quote Builder | 9 | 0 | 0 | |
| Database Integration | 2 | 0 | 0 | |
| Export & Share | 3 | 0 | 0 | |
| Edge Cases | 4 | 0 | 0 | |
| Performance | 3 | 0 | 0 | |
| Security | 3 | 0 | 0 | |
| Mobile | 2 | 0 | 0 | |
| **TOTAL** | **29** | **0** | **0** | |

## Issues Found

| Issue # | Description | Severity | Status | Notes |
|---------|-------------|----------|--------|-------|
| 1 | | High/Med/Low | Open/Resolved | |

## Sign-off

- [ ] All critical tests passed
- [ ] All high-priority issues resolved
- [ ] Performance is acceptable
- [ ] Security checks passed
- [ ] Mobile responsiveness verified
- [ ] Ready for production deployment

**Tested by:** ________________  
**Date:** ________________  
**Deployment URL:** ________________