# Phase 3: Authentication & Authorization - Validation Checklist

## User Entity & Database Validation
- [ ] `User` entity class created with all required fields
- [ ] JPA annotations properly applied (@Entity, @Table, @Column, @Enumerated)
- [ ] Unique constraints on username and apiKey
- [ ] Role enum created (ADMIN, USER)
- [ ] @PrePersist method sets createdAt timestamp
- [ ] Password field is String (will be hashed)
- [ ] Getters, setters, toString, equals, hashCode implemented
- [ ] Entity can be persisted to H2 database
- [ ] Foreign key relationship to Prompt entity defined
- [ ] Unit tests for User entity pass

## Repository & Service Validation
- [ ] `UserRepository` interface extends JpaRepository<User, Long>
- [ ] Custom query methods implemented: findByUsername, findByApiKey, findByEmail
- [ ] `UserService` created with dependency injection
- [ ] `registerUser()` creates user with hashed password
- [ ] `registerUser()` generates unique API key (UUID)
- [ ] `authenticateUser()` validates credentials and returns API key
- [ ] `getUserByApiKey()` retrieves user from key
- [ ] BCrypt PasswordEncoder properly configured
- [ ] Username uniqueness enforced (throws exception on duplicate)
- [ ] Password validation enforced (min 8 chars or configured minimum)
- [ ] API keys are unique
- [ ] Service methods have appropriate logging
- [ ] Unit tests for UserService pass (registration, login, key generation)

## DTOs Validation
- [ ] `RegisterUserRequest` created with validation annotations
  - [ ] @NotBlank username (max 100)
  - [ ] @NotBlank password (min 8)
  - [ ] @Email email (optional)
- [ ] `LoginRequest` created with validation
  - [ ] @NotBlank username
  - [ ] @NotBlank password
- [ ] `UserResponse` created (includes apiKey, excludes password)
- [ ] `LoginResponse` created (includes apiKey only)
- [ ] `CurrentUserResponse` created (full user info except password)
- [ ] All DTOs serializable to/from JSON
- [ ] No password field in response DTOs

## Authentication Filter & Security Validation
- [ ] `ApiKeyAuthenticationFilter` created extending OncePerRequestFilter
- [ ] Extracts API key from `X-API-Key` header correctly
- [ ] Validates key against database using UserService
- [ ] Sets SecurityContext if valid
- [ ] Public endpoints bypass authentication
- [ ] Protected endpoints reject missing/invalid keys
- [ ] Returns 401 Unauthorized for invalid/missing key
- [ ] `SecurityConfig` created and properly configured
- [ ] Security filter chain configured correctly
- [ ] CSRF disabled (stateless API)
- [ ] Password encoder (BCrypt) bean created and used
- [ ] Spring Security dependency added to pom.xml

## User Controller Validation
- [ ] `UserController` created with proper routing
- [ ] POST `/api/users/register` endpoint:
  - [ ] Accepts RegisterUserRequest
  - [ ] Validates input
  - [ ] Creates user in database
  - [ ] Returns 201 Created
  - [ ] Response includes apiKey and other user details
  - [ ] Response does NOT include password
  - [ ] Handles duplicate username (400 or 409)
- [ ] POST `/api/users/login` endpoint:
  - [ ] Accepts LoginRequest
  - [ ] Validates credentials
  - [ ] Returns 200 OK with apiKey on success
  - [ ] Returns 401 Unauthorized on invalid credentials
  - [ ] Response is LoginResponse with apiKey only
- [ ] GET `/api/users/me` endpoint:
  - [ ] Requires valid API key (protected)
  - [ ] Returns 200 OK with CurrentUserResponse
  - [ ] Returns 401 Unauthorized if no/invalid key
  - [ ] Returns authenticated user's info
- [ ] All endpoints have proper error handling

## Authorization & Access Control Validation
- [ ] Prompt entity updated with userId field
- [ ] Foreign key relationship: Prompt.userId → User.id
- [ ] `PromptService` methods accept userId parameter
- [ ] `createPrompt()` sets userId to authenticated user
- [ ] `updatePrompt()` verifies user is owner before allowing
- [ ] `deletePrompt()` verifies user is owner before allowing
- [ ] `PromptController` passes userId to service methods
- [ ] `@PreAuthorize` or authorization checks implemented
- [ ] GET endpoints (list, get single) public (no auth required)
- [ ] POST /api/prompts requires authentication
- [ ] PUT /api/prompts/{id} requires authentication + ownership
- [ ] DELETE /api/prompts/{id} requires authentication + ownership
- [ ] 403 Forbidden returned for non-owner attempting edit/delete
- [ ] 401 Unauthorized returned for missing authentication
- [ ] GlobalExceptionHandler handles AccessDeniedException → 403
- [ ] GlobalExceptionHandler handles AuthenticationException → 401

## API Endpoint Validation
- [ ] Register endpoint works: creates user, returns apiKey
- [ ] Login endpoint works: validates credentials, returns apiKey
- [ ] Get current user works: returns authenticated user info
- [ ] Create prompt works: requires API key, sets author/userId
- [ ] Update prompt works: requires API key and ownership
- [ ] Delete prompt works: requires API key and ownership
- [ ] List prompts public: no authentication required
- [ ] Get single prompt public: no authentication required
- [ ] Invalid API key rejected: 401 returned
- [ ] Missing API key on protected endpoint: 401 returned
- [ ] Non-owner edit attempt: 403 returned
- [ ] Non-owner delete attempt: 403 returned

## Testing Validation
- [ ] User entity unit tests pass
- [ ] UserService unit tests pass (registration, login, hashing)
- [ ] Authentication filter integration tests pass
- [ ] User controller integration tests pass
- [ ] Authorization tests pass (owner can edit/delete, others cannot)
- [ ] 401/403 error responses tested
- [ ] Public endpoints accessible without key
- [ ] Protected endpoints reject requests without key
- [ ] At least 1 test per endpoint
- [ ] Happy path and error cases covered
- [ ] All tests pass: `mvn test`

## Database Validation
- [ ] H2 creates `users` table on startup (DDL auto)
- [ ] `prompts` table updated with `user_id` foreign key
- [ ] Unique constraints enforced (username, apiKey)
- [ ] Indexes created for query performance
- [ ] Data persists correctly
- [ ] Foreign key relationships work
- [ ] Cascade settings appropriate (delete user handling)

## Security Validation
- [ ] Passwords never returned in any API response
- [ ] API keys never logged to console/files
- [ ] BCrypt hashing used for passwords (not plaintext)
- [ ] API key validation is stateless
- [ ] CORS configured appropriately (if needed for frontend)
- [ ] No sensitive data in error messages
- [ ] Rate limiting documented (if implemented)
- [ ] HTTPS requirement documented for production

## Code Quality Validation
- [ ] No compiler warnings or errors
- [ ] Code follows Java conventions
- [ ] JavaDoc comments on public classes/methods
- [ ] No hardcoded values (use constants)
- [ ] Proper logging at appropriate levels (DEBUG, INFO, ERROR)
- [ ] Dependency injection used correctly
- [ ] No security anti-patterns (plain text passwords, etc.)
- [ ] Code is readable and maintainable

## Build & Runtime Validation
- [ ] `mvn clean install` succeeds
- [ ] All tests pass: `mvn test`
- [ ] Backend starts without errors: `mvn spring-boot:run`
- [ ] Health check still works: GET `/api/health` (public)
- [ ] User registration works: POST `/api/users/register`
- [ ] User login works: POST `/api/users/login`
- [ ] Get current user works: GET `/api/users/me` + API key
- [ ] Create prompt requires API key: POST `/api/prompts` + key
- [ ] Update prompt requires ownership: PUT `/api/prompts/{id}` + key + owner
- [ ] Delete prompt requires ownership: DELETE `/api/prompts/{id}` + key + owner

## Documentation Validation
- [ ] Backend README.md updated with auth documentation
- [ ] API examples provided (with X-API-Key header)
- [ ] Instructions on obtaining API key documented
- [ ] JavaDoc added to all new classes
- [ ] Inline comments for complex logic
- [ ] Authorization rules documented

## Final Sign-Off
- [ ] All validation checklist items verified
- [ ] All tests passing
- [ ] Code ready for code review
- [ ] Meets Phase 3 requirements
- [ ] Aligns with mission (public read, author-only write)
- [ ] Branch ready for merge to main
- [ ] Ready for Phase 4 (Frontend UI)
