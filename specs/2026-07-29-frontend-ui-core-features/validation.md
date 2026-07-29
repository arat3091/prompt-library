# Phase 4: Frontend UI - Core Features - Validation & Acceptance Criteria

**Date**: 2026-07-29  
**Status**: Planning  
**Branch**: phase-4/frontend-ui-core-features

---

## Validation Checklist

This document defines how we know Phase 4 implementation is complete and ready for merge to main.

---

## I. Dependencies & Build Validation

### I.1 Dependencies Installed
- [ ] `npm install` completes without errors in `/frontend`
- [ ] `@angular/material` version matches `package.json`
- [ ] `@angular/cdk` installed as Material dependency
- [ ] No peer dependency warnings
- [ ] Lock file updated (`package-lock.json`)

### I.2 Build Succeeds
- [ ] `npm run build` completes successfully
- [ ] No TypeScript compilation errors
- [ ] No Material import errors
- [ ] Angular compiler reports 0 warnings
- [ ] Output size reasonable (main bundle < 1MB)

### I.3 Development Server Runs
- [ ] `npm start` or `ng serve` starts without errors
- [ ] Dev server accessible at `http://localhost:4200`
- [ ] No console errors on page load
- [ ] Hot reload works (save file → page updates)
- [ ] Material CSS loads (styling visible)

---

## II. Component Implementation Validation

### II.1 AppComponent (Enhanced)
- [ ] Component exists at `frontend/src/app/app.component.ts`
- [ ] HeaderComponent integrated
- [ ] Router outlet for navigation
- [ ] Component compiles without errors
- [ ] Template displays header and router outlet
- [ ] No console errors on load

### II.2 HeaderComponent (New)
- [ ] Component created with selector `app-header`
- [ ] Displays application title/logo
- [ ] "Login/Register" button visible when not authenticated
  - [ ] Button styling matches Material theme
  - [ ] Button click opens AuthModalComponent
- [ ] User menu (dropdown) visible when authenticated
  - [ ] Shows username or "Profile"
  - [ ] "Logout" option works
  - [ ] Logout clears localStorage and updates state
- [ ] Subscribes to `authService.currentUser$` for real-time updates
- [ ] No console errors
- [ ] Responsive: header works on mobile

### II.3 AuthModalComponent (New)
- [ ] Component created, used with `MatDialog.open()`
- [ ] Modal opens when "Login/Register" button clicked
- [ ] Modal closes when user submits or clicks close button
- [ ] Two tabs: "Login" (default) and "Register"

#### Login Tab
- [ ] Username field present and required
- [ ] Password field present and required (input type="password")
- [ ] Submit button says "Login"
- [ ] Form validation:
  - [ ] Submit disabled if form invalid
  - [ ] Error message shown if fields empty
- [ ] API call on submit:
  - [ ] Calls `authService.login(username, password)`
  - [ ] Sends POST to `/api/users/login`
  - [ ] Loading spinner shown during request
- [ ] Success handling:
  - [ ] Modal closes
  - [ ] apiKey stored in localStorage
  - [ ] `authService.currentUser$` updated
  - [ ] Header button changes to user menu
- [ ] Error handling:
  - [ ] "Invalid username or password" message shown
  - [ ] Error persists until next attempt
  - [ ] Form NOT cleared on error (user can retry easily)

#### Register Tab
- [ ] Username field, password field, email field all present
- [ ] All three fields required by validation
- [ ] Form validation:
  - [ ] Username: required, min 3 chars
  - [ ] Password: required, min 8 chars
  - [ ] Email: valid email format
  - [ ] Submit disabled if form invalid
  - [ ] Error messages shown per field
- [ ] API call on submit:
  - [ ] Calls `authService.register(username, password, email)`
  - [ ] Sends POST to `/api/users/register`
  - [ ] Loading spinner shown
- [ ] Success handling:
  - [ ] User auto-logged in (apiKey stored)
  - [ ] Modal closes
  - [ ] Header updates to show user menu
- [ ] Error handling:
  - [ ] "Username already exists" message if taken
  - [ ] Other error messages displayed clearly
  - [ ] Form preserved for retry

### II.4 PromptListComponent (New)
- [ ] Component created at `frontend/src/app/components/prompt-list/`
- [ ] Fetches all prompts on component load (`ngOnInit`)
  - [ ] Calls `promptService.getPrompts(0, 20, 'createdAt', 'desc')`
  - [ ] Loading spinner shown while fetching
- [ ] Displays prompts in table or card grid
  - [ ] Shows: Title, Author, Category, CreatedAt
  - [ ] Material table (`mat-table`) OR Material card grid
  - [ ] Styling clean and readable
  - [ ] Hover effect on rows/cards
- [ ] Pagination working:
  - [ ] Shows "Page 1 of X"
  - [ ] "Previous" button disabled on page 1
  - [ ] "Next" button disabled on last page
  - [ ] Clicking "Next" fetches next page
  - [ ] Clicking "Previous" fetches previous page
- [ ] Navigation on row click:
  - [ ] Clicking prompt title/card navigates to `/prompts/{id}`
  - [ ] Using Angular Router, not window.location
- [ ] Error handling:
  - [ ] 404, 500, network errors show error message
  - [ ] Retry button available if error
- [ ] Empty state:
  - [ ] If no prompts, shows "No prompts found" message
- [ ] No console errors
- [ ] Material components styled consistently

### II.5 PromptDetailComponent (New)
- [ ] Component created at `frontend/src/app/components/prompt-detail/`
- [ ] Accepts route parameter `:id`
  - [ ] Subscribes to `ActivatedRoute.params` to get ID
  - [ ] Unsubscribes on destroy (no memory leaks)
- [ ] Fetches prompt on load:
  - [ ] Calls `promptService.getPromptById(id)`
  - [ ] Loading spinner shown
- [ ] Displays prompt information:
  - [ ] Title (largest, prominent)
  - [ ] Content (main body text)
  - [ ] Description (optional)
  - [ ] Category (with tag styling)
  - [ ] Author name
  - [ ] CreatedAt and UpdatedAt timestamps
  - [ ] All in Material card with proper styling
- [ ] Conditional "Edit" button:
  - [ ] Visible ONLY if:
    - [ ] User is authenticated
    - [ ] Current user ID === prompt.userId
  - [ ] Button click:
    - [ ] Navigates to `/prompts/{id}/edit` OR
    - [ ] Opens edit modal with prompt data
  - [ ] Button hidden otherwise
- [ ] "Back" button:
  - [ ] Returns to list view (`/`)
  - [ ] Uses `location.back()` or router.navigate
- [ ] Error handling:
  - [ ] 404: show "Prompt not found"
  - [ ] 500/network: show error message with retry
- [ ] No console errors
- [ ] Proper cleanup on destroy

### II.6 PromptCreateEditComponent (New)
- [ ] Component created at `frontend/src/app/components/prompt-create-edit/`
- [ ] Accepts optional route parameter `:id` for edit mode
  - [ ] No ID param = create mode
  - [ ] ID param = edit mode
- [ ] Authentication check:
  - [ ] Only accessible if authenticated
  - [ ] Redirects to `/` if not authenticated
- [ ] Create mode:
  - [ ] Empty form on load
  - [ ] Submit button says "Create"
  - [ ] Calls `promptService.createPrompt(data)`
  - [ ] Success: navigates to detail view of new prompt
- [ ] Edit mode:
  - [ ] Fetches existing prompt by ID
  - [ ] Pre-populates form with prompt data
  - [ ] Submit button says "Update"
  - [ ] Calls `promptService.updatePrompt(id, data)`
  - [ ] Success: navigates to detail view of updated prompt
  - [ ] Only author can edit (should be enforced by backend)
- [ ] Form fields:
  - [ ] Title: required, max 255 chars
  - [ ] Content: required, max 10000 chars
  - [ ] Description: optional, max 500 chars
  - [ ] Category: optional, max 100 chars
  - [ ] Character count shown for long fields
- [ ] Form validation:
  - [ ] Required fields validated
  - [ ] Length constraints enforced
  - [ ] Error messages shown per field
  - [ ] Submit button disabled if form invalid
- [ ] Submit behavior:
  - [ ] Loading spinner during API call
  - [ ] Form fields disabled during submission
- [ ] Success handling:
  - [ ] Navigates to detail view
  - [ ] Shows success message (optional snackbar)
- [ ] Error handling:
  - [ ] Error message displayed
  - [ ] Form NOT cleared (user can retry)
  - [ ] Submit button re-enabled
- [ ] Cancel button:
  - [ ] Returns to previous page or list
  - [ ] Warning if form has unsaved changes (optional)
- [ ] Reactive forms used:
  - [ ] FormBuilder for form construction
  - [ ] FormGroup with FormControls
  - [ ] Proper form state management
- [ ] Material styling:
  - [ ] `mat-form-field`, `mat-input`, `mat-button` used
  - [ ] Proper spacing and layout
- [ ] No console errors

---

## III. Service Implementation Validation

### III.1 AuthService
- [ ] Service created at `frontend/src/app/services/auth.service.ts`
- [ ] Methods implemented:
  - [ ] `register(username, password, email): Observable<UserResponse>`
    - [ ] Calls POST `/api/users/register`
    - [ ] Returns UserResponse with id, username, email, apiKey
    - [ ] Error thrown on 4xx/5xx response
  - [ ] `login(username, password): Observable<LoginResponse>`
    - [ ] Calls POST `/api/users/login`
    - [ ] Returns LoginResponse with apiKey
    - [ ] Error thrown on invalid credentials
  - [ ] `logout(): void`
    - [ ] Clears apiKey from localStorage
    - [ ] Updates currentUser$ to null
    - [ ] Clears any session data
  - [ ] `isAuthenticated(): boolean`
    - [ ] Returns true if apiKey in localStorage
  - [ ] `getApiKey(): string`
    - [ ] Returns apiKey from localStorage
  - [ ] `setApiKey(key: string): void`
    - [ ] Stores apiKey in localStorage
  - [ ] `getCurrentUser(): Observable<UserResponse>`
    - [ ] Calls GET `/api/users/me`
    - [ ] Requires X-API-Key header
- [ ] Observable state:
  - [ ] `currentUser$: BehaviorSubject<User | null>`
  - [ ] Emits User on login/register
  - [ ] Emits null on logout
  - [ ] Components can subscribe for real-time updates
- [ ] Error handling:
  - [ ] 401 Unauthorized logged and propagated
  - [ ] 400 Bad Request (username taken) handled gracefully
  - [ ] Network errors caught and user notified
- [ ] localStorage persistence:
  - [ ] apiKey persists across page refresh
  - [ ] App restores authentication state on load
- [ ] Tested:
  - [ ] Unit tests exist and pass
  - [ ] Mock HttpClientTestingModule

### III.2 PromptService
- [ ] Service created at `frontend/src/app/services/prompt.service.ts`
- [ ] Methods implemented:
  - [ ] `getPrompts(page, size, sortBy, sortDir): Observable<PageResponse<Prompt>>`
    - [ ] Calls GET `/api/prompts?page={page}&size={size}&sort={sortBy}&direction={sortDir}`
    - [ ] Returns PageResponse with content array, pagination info
    - [ ] Error thrown on failure
  - [ ] `getPromptById(id): Observable<Prompt>`
    - [ ] Calls GET `/api/prompts/{id}`
    - [ ] Returns single Prompt object
    - [ ] 404 error if not found
  - [ ] `createPrompt(request): Observable<Prompt>`
    - [ ] Calls POST `/api/prompts` with CreatePromptRequest body
    - [ ] Requires authentication (X-API-Key header added by interceptor)
    - [ ] Returns created Prompt with id
    - [ ] 401 if not authenticated
  - [ ] `updatePrompt(id, request): Observable<Prompt>`
    - [ ] Calls PUT `/api/prompts/{id}` with UpdatePromptRequest body
    - [ ] Requires authentication
    - [ ] Returns updated Prompt
    - [ ] 403 Forbidden if not author
    - [ ] 404 if prompt doesn't exist
  - [ ] `deletePrompt(id): Observable<void>`
    - [ ] Calls DELETE `/api/prompts/{id}`
    - [ ] Requires authentication
    - [ ] Returns success (204 No Content)
    - [ ] 403 if not author
    - [ ] 404 if not found
- [ ] Error handling:
  - [ ] All error responses caught and thrown
  - [ ] Error messages user-friendly
  - [ ] HTTP error status codes checked
- [ ] Tested:
  - [ ] Unit tests for all methods
  - [ ] Mock HttpClientTestingModule
  - [ ] Test error scenarios

### III.3 HTTP Interceptor
- [ ] Interceptor created at `frontend/src/app/interceptors/auth.interceptor.ts`
- [ ] Automatically adds X-API-Key header:
  - [ ] Checks if user authenticated (apiKey in localStorage)
  - [ ] If yes, adds `X-API-Key: {apiKey}` to request headers
  - [ ] If no, request sent without header (for public endpoints)
- [ ] Registered in `app.config.ts` or `app.module.ts`:
  - [ ] Added to HttpClient providers
  - [ ] Intercepts all HTTP requests
- [ ] Handles 401/403 errors:
  - [ ] 401: redirect to login (optional), clear auth state
  - [ ] 403: user-friendly error message
- [ ] No errors in console

---

## IV. API Integration Validation

### IV.1 Backend Running
- [ ] Backend server running on `http://localhost:8080`
- [ ] `GET /api/health` responds with 200
- [ ] `GET /api/prompts` returns prompt list

### IV.2 API Calls from Frontend
- [ ] Prompt list fetches and displays prompts
- [ ] Prompt detail fetches and displays prompt
- [ ] User can register via `/api/users/register`
- [ ] User can login via `/api/users/login`
- [ ] User can create prompt via `/api/prompts` (authenticated)
- [ ] User can edit their prompt via `/api/prompts/{id}` (authenticated)
- [ ] User can view current user via `/api/users/me` (authenticated)
- [ ] X-API-Key header sent on authenticated requests
- [ ] localStorage maintains apiKey across page refresh

### IV.3 Error Scenarios Tested
- [ ] 404 prompt not found → error message shown
- [ ] 401 unauthenticated on protected endpoint → redirected to login
- [ ] 403 unauthorized (not author) → "permission denied" shown
- [ ] 500 server error → "server error, try again" shown
- [ ] Network error → "connection failed" shown
- [ ] Invalid credentials on login → "invalid username or password" shown
- [ ] Username taken on register → "username already exists" shown

---

## V. Styling & UX Validation

### V.1 Material Design
- [ ] Material theme applied globally
  - [ ] Primary color consistent
  - [ ] Accent color used for highlights
  - [ ] Warn color for errors
- [ ] Material components used:
  - [ ] `mat-toolbar` for header
  - [ ] `mat-dialog` for auth modal
  - [ ] `mat-button` for all buttons (ripple effect)
  - [ ] `mat-form-field` and `mat-input` for forms
  - [ ] `mat-table` or `mat-card` for list
  - [ ] `mat-progress-spinner` for loading
  - [ ] `mat-tab-group` for modal tabs
  - [ ] `mat-menu` for user dropdown
  - [ ] `mat-icon` for icons (optional)
- [ ] Material icons load correctly (if used)
- [ ] Responsive design:
  - [ ] App works on mobile (320px width)
  - [ ] Tablet (768px) layout readable
  - [ ] Desktop (1920px) layout optimal
- [ ] No unstyled elements
- [ ] Colors accessible (contrast ratios pass WCAG AA)

### V.2 User Experience
- [ ] Loading spinners shown during API calls
- [ ] Error messages clear and actionable
- [ ] Empty states handled (no prompts, etc.)
- [ ] Navigation intuitive (back button, breadcrumbs optional)
- [ ] Form validation errors shown inline
- [ ] Success feedback (toast/snackbar optional but nice)
- [ ] No flashing or jarring transitions
- [ ] Keyboard navigation works (Tab through forms, Enter submits)
- [ ] Forms not cleared on error (user can retry easily)

---

## VI. Testing Validation

### VI.1 Unit Tests
- [ ] All services have unit tests
  - [ ] AuthService: register, login, logout tested
  - [ ] PromptService: getPrompts, getPromptById, create, update, delete tested
- [ ] All components have unit tests
  - [ ] Component creation tested
  - [ ] Form validation tested
  - [ ] Button clicks tested
  - [ ] Conditional rendering tested
- [ ] Test file locations:
  - [ ] `*.service.spec.ts` for services
  - [ ] `*.component.spec.ts` for components
- [ ] Mock data used:
  - [ ] HttpClientTestingModule for HTTP
  - [ ] Mock services for dependencies
  - [ ] Avoid real API calls in unit tests

### VI.2 Test Results
- [ ] `npm test` runs without errors
- [ ] All tests pass (0 failures)
- [ ] No console errors or warnings in test output
- [ ] Code coverage > 80% (target: services 95%, components 80%)
- [ ] Test output shows pass/fail clearly

### VI.3 E2E / Manual Testing (Optional)
- [ ] Manual testing of complete user flows:
  - [ ] Register → Login → Create Prompt → Edit → View
  - [ ] View public prompts without auth
  - [ ] Logout and re-login

---

## VII. Build & Deployment Validation

### VII.1 Build Process
- [ ] `npm run build` completes successfully
- [ ] Production build created in `dist/`
- [ ] Build output includes:
  - [ ] index.html
  - [ ] main.*.js (code)
  - [ ] polyfills.*.js
  - [ ] styles.*.css
  - [ ] Material theme CSS
- [ ] Build size reasonable:
  - [ ] main bundle < 1MB
  - [ ] Total < 2MB
- [ ] No build warnings

### VII.2 Production Build Testing
- [ ] Production build files serve without errors
- [ ] Angular doesn't report any runtime errors
- [ ] All functionality works in production build
  - [ ] Can register/login
  - [ ] Can create/edit prompts
  - [ ] Can view prompts

---

## VIII. Documentation Validation

### VIII.1 Code Documentation
- [ ] Services have JSDoc comments
  - [ ] Method descriptions
  - [ ] Parameter types documented
  - [ ] Return types documented
- [ ] Complex logic documented
- [ ] Component templates have comments for non-obvious sections

### VIII.2 README Updated
- [ ] `frontend/README.md` created or updated with:
  - [ ] Installation: `npm install`
  - [ ] Running: `npm start` or `ng serve`
  - [ ] Testing: `npm test`
  - [ ] Building: `npm build`
  - [ ] Folder structure explained
  - [ ] API endpoint base URL documented
  - [ ] Troubleshooting section for common issues
  - [ ] Dependencies listed

### VIII.3 Architecture Documentation
- [ ] Component hierarchy diagram (text or ASCII)
- [ ] Service flow documented
- [ ] Authentication flow explained
- [ ] Known issues documented
- [ ] Future enhancements listed

---

## IX. Final Acceptance Criteria

- [ ] All sections I-VIII passing
- [ ] No console errors or warnings on load
- [ ] App fully functional end-to-end:
  - [ ] User registers
  - [ ] User logs in
  - [ ] User views prompts
  - [ ] User creates prompt
  - [ ] User edits prompt
  - [ ] User logs out
  - [ ] New user can repeat flow
- [ ] Backend integration solid:
  - [ ] All API calls successful
  - [ ] Error handling works
  - [ ] Authentication persists
- [ ] Code quality:
  - [ ] No linting errors (`npm run lint` if configured)
  - [ ] Consistent code formatting
  - [ ] No unused imports or variables
- [ ] Ready for merge to main

---

## X. Sign-Off Checklist

Before merging Phase 4 to main:

- [ ] All acceptance criteria above reviewed and passing
- [ ] Code review completed (if applicable)
- [ ] Git commit message clear and detailed
- [ ] Branch pushed to origin
- [ ] Pull request created (if using GitHub/GitLab)
- [ ] No merge conflicts
- [ ] All tests passing on CI/CD (if configured)

---

## Post-Merge Verification (on main)

After merge to main:

- [ ] Fresh clone/pull of main branch
- [ ] `npm install` from `/frontend` succeeds
- [ ] `npm start` runs without errors
- [ ] App accessible at `http://localhost:4200`
- [ ] All features work as expected
- [ ] No regressions in existing functionality

---

## Known Limitations & Future Work (Phase 5+)

- [ ] Search/filter not yet implemented
- [ ] Sorting options limited to API defaults
- [ ] Delete confirmation is basic (window.confirm)
- [ ] Mobile responsiveness basic (can improve)
- [ ] No offline support
- [ ] No caching of prompts
- [ ] Profile page not implemented
- [ ] Admin dashboard not implemented

---

## Success Summary

Phase 4 will be **COMPLETE** when all validation items are checked ✅ and the app is **fully functional end-to-end** with all 4 components implemented, tested, and integrated with the backend. Users should be able to register, login, view prompts, create/edit their own prompts, and have a polished Material Design UI experience.
