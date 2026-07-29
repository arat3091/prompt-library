# Phase 3: Authentication & Authorization - Implementation Plan

## Task Group 1: User Entity & Database Setup
1. Create `User` entity in `com.promptmanager.models`
   - Fields: id, username, password, email, apiKey, role, createdAt, isActive
   - JPA annotations: @Entity, @Table, @Column constraints
   - Unique constraints on username and apiKey
   - Use Java enum for role (ADMIN, USER)
2. Add Spring Security dependency to pom.xml
   - `spring-boot-starter-security`
3. Create database migration/schema update
   - Add `users` table
   - Update `prompts` table with `user_id` foreign key
   - Update `author` field mapping
4. Create JPA lifecycle methods
   - @PrePersist for timestamps
5. Add getters, setters, equals, hashCode, toString

## Task Group 2: Repository & Service for Users
1. Create `UserRepository` interface extending JpaRepository<User, Long>
   - Methods: findByUsername, findByApiKey, findByEmail
2. Create `UserService` in `com.promptmanager.services`
   - `registerUser(username, password, email)` → creates user with hashed password and API key
   - `authenticateUser(username, password)` → returns API key if credentials valid
   - `getUserByApiKey(apiKey)` → retrieves user from API key
   - `getUserById(id)` → get user by ID
   - Password hashing with BCrypt (via Spring Security's PasswordEncoder)
   - API key generation (UUID v4)
3. Implement business logic
   - Username uniqueness validation
   - Password validation (min 8 chars, recommended)
   - API key generation and storage
   - Error handling for duplicate users, invalid credentials
4. Add comprehensive logging

## Task Group 3: DTOs for User Operations
1. Create `RegisterUserRequest` DTO with validation
   - @NotBlank username (max 100 chars)
   - @NotBlank password (min 8 chars)
   - @Email email (optional)
2. Create `LoginRequest` DTO
   - @NotBlank username
   - @NotBlank password
3. Create `UserResponse` DTO
   - Include: id, username, email, apiKey, role, createdAt
   - Exclude: password (never returned)
4. Create `LoginResponse` DTO
   - Include: apiKey only
5. Create `CurrentUserResponse` DTO
   - User info for authenticated user

## Task Group 4: Authentication Filter & Security Config
1. Create custom `ApiKeyAuthenticationFilter` extending `OncePerRequestFilter`
   - Extract API key from `X-API-Key` header
   - Validate key using UserService
   - Set SecurityContext if valid
   - Allow public endpoints through without validation
   - Return 401 if key missing/invalid on protected endpoints
2. Create `ApiKeyAuthenticationProvider` for Spring Security
3. Create `SecurityConfig` configuration class (@Configuration)
   - Configure security filters
   - Set up SecurityFilterChain
   - Disable CSRF (stateless API)
   - Set authentication provider
4. Configure password encoder (BCrypt)
   - Create @Bean for PasswordEncoder
5. Define request matchers for public vs protected paths

## Task Group 5: User Controller & Authentication Endpoints
1. Create `UserController` in `com.promptmanager.controllers`
   - `POST /api/users/register` - Register new user
     - Accepts RegisterUserRequest
     - Returns 201 Created with UserResponse including apiKey
     - Validates input
   - `POST /api/users/login` - User login
     - Accepts LoginRequest
     - Returns 200 OK with LoginResponse (just apiKey)
     - Or 401 Unauthorized if credentials invalid
   - `GET /api/users/me` - Get current user
     - Protected endpoint (requires API key)
     - Returns 200 OK with CurrentUserResponse
     - Returns 401 if not authenticated
2. Add proper error handling and logging
3. Add rate limiting headers (optional for Phase 3)

## Task Group 6: Update Prompt Entity & Endpoints
1. Update `Prompt` entity
   - Add `userId` (Long) field with @ManyToOne reference to User
   - Update `author` field: derive from user or keep as denormalized string
   - Add @JoinColumn annotation
   - Update validation
2. Update `PromptService`
   - `createPrompt(request, userId)` - Set userId when creating
   - `updatePrompt(id, request, userId)` - Verify ownership before updating
   - `deletePrompt(id, userId)` - Verify ownership before deleting
   - Add authorization checks in service layer
3. Update `PromptController`
   - Inject authenticated user into create/update/delete methods
   - Use `@PreAuthorize` or custom @Secured annotations
   - Pass userId to service methods
4. Update `PromptResponse` DTO
   - Include `userId` and derived `author` (username)

## Task Group 7: Authorization & Access Control
1. Add Spring Security method-level security
   - Use `@PreAuthorize` on controller methods
   - Implement custom authorization checks for owner-only operations
2. Create authorization utility/helper
   - Method to check if current user is prompt owner
3. Update error handling
   - Return 403 Forbidden for unauthorized access (not owner)
   - Distinguish 401 (no auth) from 403 (insufficient permissions)
4. Update GlobalExceptionHandler
   - Handle AccessDeniedException → 403 Forbidden
   - Handle AuthenticationException → 401 Unauthorized

## Task Group 8: Testing
1. Create unit tests for User entity
2. Create unit tests for UserService
   - Test user registration, login, API key generation
   - Test password hashing
   - Test duplicate username handling
3. Create integration tests for AuthenticationFilter
   - Test API key validation
   - Test public endpoints (no key needed)
   - Test protected endpoints (key required)
4. Create integration tests for UserController
   - Test register endpoint
   - Test login endpoint
   - Test get current user endpoint
5. Create integration tests for authorization
   - Test user can only edit own prompts
   - Test user can only delete own prompts
   - Test other users get 403 Forbidden
6. Test 401/403 error responses
7. All tests passing

## Task Group 9: Database Migration & Schema Updates
1. Verify H2 creates `users` table on startup
2. Verify foreign key relationship created
3. Test data persistence for users
4. Verify indexes created for query performance

## Task Group 10: Documentation & Code Quality
1. Add JavaDoc to all new classes and public methods
2. Update backend README.md
   - Document authentication approach
   - Document how to obtain API key
   - Example API requests with headers
3. Add inline comments for complex authorization logic
4. Verify no compiler warnings
5. Code follows conventions (naming, formatting)
6. No sensitive data logged (passwords, API keys)
