# Phase 4: Frontend UI - Core Features - Implementation Plan

**Date**: 2026-07-29  
**Status**: Planning  
**Branch**: phase-4/frontend-ui-core-features

---

## Task Groups (Numbered)

### Task Group 1: Project Setup & Dependencies
**Objective**: Configure Angular project with Material and required dependencies

1.1. Install Angular Material
- `npm install @angular/material @angular/cdk`
- Import Material modules in `app.module.ts` or feature modules
- Add Material theme to `styles.css`
- Configure Material icons via CDN or local assets

1.2. Create folder structure for services, components, models
- `frontend/src/app/models/` - TypeScript interfaces
- `frontend/src/app/services/` - Service classes
- `frontend/src/app/components/header/`
- `frontend/src/app/components/prompt-list/`
- `frontend/src/app/components/prompt-detail/`
- `frontend/src/app/components/prompt-create-edit/`
- `frontend/src/app/components/auth-modal/`
- `frontend/src/app/interceptors/` - HTTP interceptor

1.3. Create TypeScript interfaces in models
- `Prompt`, `User`, `LoginRequest`, `RegisterUserRequest`, `PageResponse`, etc.
- Located in `frontend/src/app/models/prompt.model.ts`, `user.model.ts`

1.4. Configure Angular routing
- Update `app.routes.ts` with routes for `/` (list), `/prompts/:id` (detail)
- Router outlet in AppComponent
- Route guards if needed (optional for Phase 4)

**Deliverables**: Project builds, no Material errors

---

### Task Group 2: HTTP Client & Authentication Infrastructure
**Objective**: Set up API communication and authentication layer

2.1. Create HTTP Interceptor
- Automatically add `X-API-Key` header to all requests
- Located in `frontend/src/app/interceptors/auth.interceptor.ts`
- Inject into `app.config.ts` HTTP provider

2.2. Create AuthService
- Methods: `register()`, `login()`, `logout()`, `isAuthenticated()`, `getCurrentUser()`
- localStorage for API key persistence
- BehaviorSubject for `currentUser$` observable
- Handle error responses (401, 403, registration errors)
- File: `frontend/src/app/services/auth.service.ts`

2.3. Create PromptService
- Methods: `getPrompts()`, `getPromptById()`, `createPrompt()`, `updatePrompt()`, `deletePrompt()`
- Use HttpClient to call backend endpoints
- Return Observables for component subscription
- Handle error responses
- File: `frontend/src/app/services/prompt.service.ts`

2.4. Create error handling utilities
- Error interceptor or error handling in services
- User-friendly error messages from HTTP error responses
- Optional: Toast/snackbar notifications for errors

**Deliverables**: Services compile, HTTP calls work (tested manually), auth tokens persist

---

### Task Group 3: Header & Navigation Component
**Objective**: Build persistent header with auth button and user menu

3.1. Create HeaderComponent
- Display logo/application title
- Conditional button based on auth state:
  - Not authenticated: "Login/Register" button
  - Authenticated: User dropdown menu with profile/logout
- Material toolbar (`mat-toolbar`)
- Subscribe to `authService.currentUser$` for state

3.2. Implement Auth Modal Trigger
- "Login/Register" button opens modal via `MatDialog.open()`
- Pass component to modal: `AuthModalComponent`

3.3. Implement User Menu
- Dropdown menu with `mat-menu` showing:
  - "Profile" (optional, could show username)
  - "Logout" button
- Logout calls `authService.logout()`, clears localStorage

3.4. Integrate into AppComponent
- Replace existing header or create new
- Import HeaderComponent in AppComponent
- HeaderComponent sits above router outlet

**Deliverables**: Header displays correctly, buttons functional, styling complete

---

### Task Group 4: Authentication Modal Component
**Objective**: Build login/register modal dialog with form handling

4.1. Create AuthModalComponent
- Material Dialog component (`MatDialogRef`, `MAT_DIALOG_DATA` if needed)
- Two tabs using `mat-tab-group`:
  - Login tab
  - Register tab

4.2. Implement Login Form (Tab 1)
- Reactive form with fields: username, password
- Validators: required for both fields
- Submit button calls `authService.login(username, password)`
- Loading spinner during API call
- Error message display below fields
- On success: close modal, trigger app state refresh

4.3. Implement Register Form (Tab 2)
- Reactive form with fields: username, password, email
- Validators: 
  - username: required, length 3+
  - password: required, length 8+
  - email: email format validation
- Submit button calls `authService.register(username, password, email)`
- Loading spinner during API call
- Error message display (e.g., "Username already exists")
- On success: close modal, auto-login user

4.4. Form styling with Material
- Use `mat-form-field`, `mat-input` for inputs
- `mat-error` for validation messages
- `mat-button` with ripple effects
- Proper spacing and material design

**Deliverables**: Modal opens/closes, forms submit correctly, API calls made, errors displayed

---

### Task Group 5: Prompt List Component
**Objective**: Build read-only public list view of all prompts with pagination

5.1. Create PromptListComponent
- Fetches prompts from `promptService.getPrompts()` in `ngOnInit`
- Displays prompts in Material table (`mat-table`) or card grid
- Columns/fields: Title, Author, Category, CreatedAt, Actions (View)
- Initially sorted by createdAt descending

5.2. Implement Pagination
- Show current page, total pages
- Previous/Next buttons
- Clicking row navigates to detail view: `router.navigate(['/prompts', prompt.id])`

5.3. Styling & Layout
- Material table with striped rows or card grid
- Hover effect on rows (pointer cursor, highlight)
- Responsive: stack cards on mobile

5.4. Error Handling
- Display error message if API call fails
- Show loading spinner while fetching
- Empty state message if no prompts

5.5. Optional: Search/Filter (skip for Phase 4)
- Defer to Phase 5

**Deliverables**: List displays all prompts, pagination works, routing to detail works

---

### Task Group 6: Prompt Detail Component
**Objective**: Build single-prompt view with edit capability for author

6.1. Create PromptDetailComponent
- Accept route parameter `:id` via `ActivatedRoute`
- Fetch prompt from `promptService.getPromptById(id)` in `ngOnInit`
- Display full prompt information in Material card:
  - Title, content, description, category
  - Author, userId, createdAt, updatedAt
  - Version number (optional)

6.2. Implement Author-Only Edit Button
- Check if authenticated AND current user ID === prompt userId
- If true: show "Edit" button
- If false or not authenticated: hide "Edit" button
- Edit button navigates to create/edit component or opens modal

6.3. Implement Back Navigation
- "Back" button returns to list view
- Use `location.back()` or explicit `router.navigate(['/'])`

6.4. Error Handling
- 404 error: show "Prompt not found"
- Network error: show "Failed to load prompt"
- Loading spinner while fetching

6.5. Styling
- Material card with shadow
- Typography hierarchy (title larger, content normal)
- Metadata section (author, dates) in smaller, secondary text

**Deliverables**: Detail page displays prompt, edit button conditional, back navigation works

---

### Task Group 7: Prompt Create/Edit Component
**Objective**: Build form for authenticated users to create and edit prompts

7.1. Create PromptCreateEditComponent
- Accept route parameter `:id` (optional, for edit mode)
- Create mode: empty form
- Edit mode: pre-populate form with existing prompt data
- Component determines mode based on route param presence

7.2. Implement Create/Edit Form
- Reactive form with fields:
  - title: required, max 255 chars
  - content: required, max 10000 chars
  - description: optional, max 500 chars
  - category: optional, max 100 chars
- Validators via Validators from @angular/forms
- Show character counts for long fields
- Error messages for each field

7.3. Implement Form Submission
- Create mode: call `promptService.createPrompt(data)`
- Edit mode: call `promptService.updatePrompt(id, data)`
- Loading spinner during submission
- On success: navigate to detail view of created/updated prompt
- On error: show error message, keep form open for retry

7.4. Implement Cancel Button
- Returns to list or previous detail view
- Optionally: warn if form has unsaved changes

7.5. Authentication Check
- Component should only be accessible if authenticated
- If not authenticated: redirect to list or show login modal
- Can use canActivate guard (optional)

7.6. Material Form Styling
- `mat-form-field` for each input
- `mat-input` for text fields
- `mat-textarea` for content field
- `mat-button` for submit/cancel
- Proper spacing and layout

**Deliverables**: Forms work, create/edit API calls successful, navigation after success works

---

### Task Group 8: Material Theme & Global Styling
**Objective**: Configure Material Design theme and global application styling

8.1. Set up Material Theme
- Choose Material theme: Indigo-Pink, Deep Purple-Amber, Purple-Green, or custom
- Add theme CSS to `styles.css` or separate `theme.css`
- Define primary, accent, warn color palettes

8.2. Configure Typography
- Material typography with appropriate font sizes for headings, body
- Line heights and letter spacing for readability
- Include Roboto font or Material's recommended font

8.3. Global App Styling
- Body background color
- Default spacing/padding for main content area
- Consistent margins throughout
- Link colors and hover states

8.4. Component-Level Styling
- Each component gets own `component.scss` file
- Use Material breakpoints for responsive design
- Card shadows and hover effects
- Button hover/focus states

**Deliverables**: App has cohesive Material Design look, colors consistent, typography clean

---

### Task Group 9: Testing
**Objective**: Write unit and integration tests for components and services

9.1. Service Unit Tests
- AuthService: test login, register, logout, getCurrentUser
- PromptService: test getPrompts, getPromptById, createPrompt, updatePrompt, deletePrompt
- Mock HttpClientTestingModule
- Test error scenarios (401, 404, 500)

9.2. Component Unit Tests
- Test component creation and initialization
- Test form validation (required fields, length)
- Test navigation on button clicks
- Test conditional rendering (auth button vs user menu)

9.3. Integration Tests (optional for Phase 4)
- Test login flow end-to-end
- Test create prompt flow
- Use HttpClientTestingModule to mock API

9.4. Test Commands
- `npm test` - Run all tests with Karma/Jasmine
- All tests passing before merge

**Deliverables**: 80%+ code coverage, tests passing, no test warnings

---

### Task Group 10: Documentation & Build Verification
**Objective**: Document setup, running, and verify successful build

10.1. Update frontend README
- Installation: `npm install`
- Running: `npm start` or `ng serve`
- Testing: `npm test`
- Building: `npm build`
- Troubleshooting section for common issues

10.2. Add inline code documentation
- JSDoc comments on services and components
- Explain complex logic (e.g., reactive form setup)
- Document Material component usage

10.3. Verify Build & Runtime
- `npm install` completes without errors
- `ng serve` starts dev server successfully
- App accessible at `http://localhost:4200`
- No console errors on load
- All Material components render correctly

10.4. Backend Integration Verification
- Ensure backend running on `http://localhost:8080/api`
- Test API calls from frontend
- Verify authentication flow works end-to-end
- Verify API key in localStorage

10.5. Create Summary Document
- List all components, services created
- Known issues or TODOs for Phase 5
- Performance notes
- Future enhancement ideas

**Deliverables**: Build successful, app runs, all features testable

---

## Timeline Estimate

| Task Group | Estimated Time |
|------------|-----------------|
| 1. Setup & Dependencies | 2-3 hours |
| 2. HTTP & Auth Infrastructure | 3-4 hours |
| 3. Header & Navigation | 2-3 hours |
| 4. Auth Modal | 3-4 hours |
| 5. Prompt List | 3-4 hours |
| 6. Prompt Detail | 2-3 hours |
| 7. Create/Edit Form | 4-5 hours |
| 8. Styling & Theme | 2-3 hours |
| 9. Testing | 3-4 hours |
| 10. Documentation | 1-2 hours |
| **Total** | **25-35 hours** |

---

## Dependencies Between Task Groups

```
Task 1: Setup
  ↓
Task 2: HTTP & Auth (depends on 1)
  ↓
  ├─→ Task 3: Header (depends on 2)
  ├─→ Task 4: Auth Modal (depends on 2)
  ├─→ Task 5: List (depends on 2)
  ├─→ Task 6: Detail (depends on 2)
  └─→ Task 7: Create/Edit (depends on 2)
         ↓
  Task 8: Styling (can run in parallel with 3-7)
  ↓
  Task 9: Testing (depends on 3-7)
  ↓
  Task 10: Documentation & Verification
```

**Critical Path**: Tasks 1, 2, then 3-7 can be done in parallel, then 8, 9, 10 sequentially

---

## Success Criteria by Task Group

- [ ] Task 1: `npm install` succeeds, Material imports work
- [ ] Task 2: Services compile, HTTP calls work in browser console
- [ ] Task 3: Header displays, buttons functional
- [ ] Task 4: Modal opens/closes, forms submit
- [ ] Task 5: List displays prompts with pagination
- [ ] Task 6: Detail view shows prompt, edit button conditional
- [ ] Task 7: Create/edit forms save prompts to backend
- [ ] Task 8: App looks professionally styled with Material Design
- [ ] Task 9: All tests passing, coverage > 80%
- [ ] Task 10: Build succeeds, app runs without errors
