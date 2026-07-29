# Phase 4: Frontend UI - Core Features - Requirements Specification

**Date**: 2026-07-29  
**Status**: Planning  
**Branch**: phase-4/frontend-ui-core-features

---

## Executive Summary

Phase 4 implements the complete Angular 18 frontend user interface for the Prompt Manager application. Users will be able to:
- **Read**: Browse all prompts in a public list view
- **View Details**: Click to see full prompt content
- **Authenticate**: Register and login via modal dialog
- **Create/Edit**: Authenticated users can create new prompts and edit their own
- **Integrate**: All UI components connect to the Phase 3 backend REST API with authentication

---

## Scope & Objectives

### In Scope
1. **Prompt List Component** - Read-only public view of all prompts with pagination
2. **Prompt Detail Component** - Full view of single prompt with content and metadata
3. **Prompt Create/Edit Form** - Authenticated-user-only form for creating and editing prompts
4. **Backend API Integration** - HTTP client calls to all Phase 3 endpoints with error handling
5. **Authentication UI** - Modal-based login/register interface on main page
6. **Navigation & Routing** - Angular routing between list, detail, and other views
7. **Error Handling & Feedback** - User-friendly error messages and loading states

### Out of Scope (Phase 5+)
- Search/filter functionality
- Advanced sorting options beyond API-provided sorting
- Delete confirmation dialogs (basic confirm() suffices)
- Responsive design beyond basic mobile support
- Performance optimization and caching
- E2E tests

---

## Technical Decisions

### 1. Styling & UI Framework: Angular Material
**Rationale**: 
- Built specifically for Angular, excellent integration
- Comprehensive component library (buttons, forms, dialogs, tables, etc.)
- Pre-built Material Design following Google's standards
- Accessible (ARIA support) and keyboard navigation built-in
- Active maintenance and large community

**Implementation**:
- Import Material modules in feature modules
- Use Material components: `mat-dialog`, `mat-button`, `mat-card`, `mat-form-field`, `mat-table`, etc.
- Material theming with primary/accent/warn color schemes
- Material icons for visual feedback

### 2. Authentication UI: Modal Dialog on Main Page
**Rationale**:
- Non-intrusive UX - users stay in context
- Simpler routing (no separate /login page)
- Quick registration for new users
- Aligns with modern SPA patterns

**Implementation**:
- AppComponent contains `mat-dialog` trigger button in header
- AuthModalComponent renders login/register form in modal
- Toggle between login and register tabs in single modal
- API key stored in localStorage after login
- X-API-Key header sent with all authenticated requests

### 3. Form Handling: Reactive Forms (Angular)
**Rationale**:
- Better for complex forms (our create/edit form)
- Easier validation and dynamic form control
- Testability superior to template-driven forms
- FormBuilder pattern cleaner than manual FormControl

**Implementation**:
- Use `@angular/forms` ReactiveFormsModule
- FormBuilder for create/edit form construction
- Validators: required, minLength, maxLength from Angular
- Custom async validator for checking username uniqueness on registration

### 4. State Management: Minimal (localStorage + services)
**Rationale**:
- Phase 4 scope is relatively simple
- No complex state sharing across many components
- localStorage sufficient for auth token persistence

**Implementation**:
- AuthService manages login/logout/user state in memory + localStorage
- PromptService handles API calls with caching of list view
- Components subscribe to observable services

### 5. Routing Strategy
**Rationale**: 
- Clean separation of concerns
- Lazy loading for potential future modules

**Implementation**:
- Root routing in app.routes.ts
- Routes: 
  - `/` (home/list) - AppComponent
  - `/prompts/:id` (detail) - PromptDetailComponent
  - Catch-all → home
- No separate auth routes; auth via modal on all pages

---

## Database/API Integration

### Backend Endpoints Used

**Public Endpoints** (no authentication required):
- `GET /api/health` - Health check
- `GET /api/prompts` - List prompts with pagination
- `GET /api/prompts/{id}` - Get single prompt
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Authenticate and get API key

**Authenticated Endpoints** (require X-API-Key header):
- `GET /api/users/me` - Get current user info
- `POST /api/prompts` - Create new prompt
- `PUT /api/prompts/{id}` - Update own prompt
- `DELETE /api/prompts/{id}` - Delete own prompt

### Error Handling
- 401 Unauthorized → Show login modal, ask to authenticate
- 403 Forbidden → Show "You don't have permission" error
- 404 Not Found → Show "Prompt not found" message
- 500 Server Error → Show generic "Server error, try again" message
- Network errors → Show "Connection failed" message

---

## UI/UX Flow

### 1. Initial Load (Unauthenticated User)
1. AppComponent loads with header showing "Login/Register" button
2. PromptListComponent displays all prompts (read-only)
3. User can view list, click detail view
4. Create/edit buttons disabled or hidden

### 2. Authentication Flow
1. User clicks "Login/Register" button
2. `mat-dialog` opens AuthModalComponent
3. Show login tab by default
4. User submits credentials
5. AuthService calls `POST /api/users/login` with username/password
6. API returns apiKey
7. Store apiKey in localStorage
8. Close modal, refresh user state
9. Create/edit buttons now visible and enabled

### 3. New User Registration Flow
1. User in AuthModalComponent clicks "Register" tab
2. Form fields: username, password, email
3. Client-side validation (required, min 8 chars for password)
4. AuthService calls `POST /api/users/register`
5. Server returns apiKey
6. Auto-login user (same as login flow)

### 4. Viewing Prompt Detail
1. From list view, user clicks prompt title/card
2. Route to `/prompts/{id}`
3. PromptDetailComponent fetches and displays prompt
4. If authenticated AND user is author:
   - Show "Edit" button
   - Click → PromptEditComponent (same form as create)
5. If authenticated AND user is NOT author:
   - No edit button
6. If not authenticated:
   - No edit button, show "Sign in to edit"

### 5. Creating/Editing Prompt (Authenticated)
1. From list, click "Create Prompt" button
2. PromptCreateEditComponent opens (form in modal or new page)
3. Form fields: title, content, description, category
4. Submit creates new prompt or updates existing
5. Success → navigate to detail view of new/updated prompt
6. Error → show error message, keep form open

---

## Component Architecture

### Components to Build

1. **AppComponent** (already exists, enhance)
   - Header with "Login/Register" button
   - Navigation
   - Main router outlet

2. **PromptListComponent** (new)
   - Displays table/card list of all prompts
   - Pagination controls
   - Click row/card → navigate to detail
   - Show title, author, category, created date
   - Material: `mat-table` or `mat-card` grid

3. **PromptDetailComponent** (new)
   - Display single prompt with all fields
   - Show author and timestamps
   - If author: show "Edit" button
   - Material: `mat-card` with prompt content

4. **PromptCreateEditComponent** (new)
   - Reactive form for title, content, description, category
   - Create mode: empty form
   - Edit mode: pre-populate with existing prompt data
   - Submit button: "Create" or "Update" based on mode
   - Cancel button returns to list/detail
   - Material: `mat-form-field`, `mat-input`, `mat-button`, `mat-dialog`

5. **AuthModalComponent** (new)
   - Modal dialog with login and register tabs
   - Login: username, password fields
   - Register: username, password, email fields
   - Form validation with error messages
   - Loading spinner during API call
   - Success closes modal, triggers app refresh
   - Material: `mat-dialog`, `mat-form-field`, `mat-tab-group`, `mat-progress-spinner`

6. **HeaderComponent** (new)
   - Logo/title
   - "Login/Register" button (if not authenticated)
   - Dropdown with "Profile" / "Logout" (if authenticated)
   - Material: `mat-toolbar`, `mat-icon-button`, `mat-menu`

### Services to Build

1. **PromptService**
   - `getPrompts(page, size, sort, direction): Observable<PageResponse>`
   - `getPromptById(id): Observable<PromptResponse>`
   - `createPrompt(request): Observable<PromptResponse>`
   - `updatePrompt(id, request): Observable<PromptResponse>`
   - `deletePrompt(id): Observable<void>`

2. **AuthService**
   - `register(username, password, email): Observable<UserResponse>`
   - `login(username, password): Observable<LoginResponse>`
   - `getCurrentUser(): Observable<UserResponse>`
   - `logout(): void`
   - `isAuthenticated(): boolean`
   - `getApiKey(): string`
   - `setApiKey(key): void`
   - `currentUser$: BehaviorSubject<User | null>`

3. **HttpClientService** / HttpInterceptor
   - Automatically add X-API-Key header to all requests
   - Handle 401/403 errors globally

---

## Data Models / Interfaces (TypeScript)

```typescript
// Prompt
interface Prompt {
  id: number;
  title: string;
  content: string;
  author: string;
  userId: number;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

// User
interface User {
  id: number;
  username: string;
  email?: string;
  apiKey: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

// API Requests
interface CreatePromptRequest {
  title: string;
  content: string;
  description?: string;
  category?: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterUserRequest {
  username: string;
  password: string;
  email?: string;
}

// API Responses
interface PageResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}
```

---

## Configuration & Setup

### Dependencies to Add (npm)
- `@angular/material` - UI components
- `@angular/cdk` - Material dependencies (already included with Material)
- No additional state management library (ngxs, ngrx, etc. - overkill for this phase)

### Environment Configuration
- Development: `ng serve`, backend on `http://localhost:8080/api`
- Production: Optimized build, configurable API endpoint

### Styling
- Material theme in `styles.css` or separate theme file
- Global colors, typography from Material
- Component-level SCSS for custom styling

---

## Success Criteria

- [ ] All 6 components built and rendering without errors
- [ ] All 3 services implemented with proper observables
- [ ] User can register and login via modal
- [ ] Authenticated users can create/edit/delete their prompts
- [ ] List view shows all prompts with pagination
- [ ] Detail view shows full prompt information
- [ ] Proper error handling for all API failures
- [ ] API key persists in localStorage and is sent with authenticated requests
- [ ] Material Design UI consistent across all components
- [ ] No console errors
- [ ] App runs without backend errors: `ng serve`

---

## Risk Factors & Mitigation

| Risk | Mitigation |
|------|-----------|
| Material learning curve | Quick setup guides available; Material docs comprehensive |
| Reactive Forms complexity | Use FormBuilder; keep forms simple for this phase |
| State management issues | Keep state minimal; rely on services and localStorage |
| CORS issues with backend | Backend already configured for `/api` path |
| API integration bugs | Extensive testing of each service method |

---

## Dependencies on Previous Phases

- **Phase 1**: Angular CLI project structure ✅
- **Phase 2**: CRUD REST API endpoints ✅
- **Phase 3**: Authentication (API key auth, users table) ✅

All dependencies met. Ready to implement.

---

## Phase 4 Deliverables

1. ✅ `frontend/src/app/models/` - TypeScript interfaces
2. ✅ `frontend/src/app/services/` - PromptService, AuthService, HttpInterceptor
3. ✅ `frontend/src/app/components/` - 6 components (AppComponent enhanced, Header, List, Detail, CreateEdit, AuthModal)
4. ✅ `frontend/src/app/` - Updated routing configuration
5. ✅ `frontend/package.json` - Add Material dependency
6. ✅ `frontend/styles.css` - Material theme setup
7. ✅ `npm install && npm build` - Build succeeds without errors
8. ✅ `npm serve` - Dev server runs, frontend accessible at http://localhost:4200
9. ✅ Tests for components and services
10. ✅ Updated README with frontend setup and running instructions

---

## Next Steps After Phase 4

Phase 5 will add:
- Search/filter functionality
- Advanced UI refinements
- Confirmation dialogs
- Mobile responsiveness optimization
