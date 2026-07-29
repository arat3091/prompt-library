# Phase 3: Authentication & Authorization - Requirements

## Scope
Implement a simple API Key-based authentication system with user management and role-based access control to secure the Prompt Manager API while maintaining public read access.

## Authentication Approach
**Simple API Key Authentication**
- Each user has a unique API key (generated at user creation)
- API key is included in request headers: `X-API-Key: <api-key>`
- Stateless validation on each request
- Simple, lightweight, suitable for single-user or small team scenarios
- No external dependencies needed

## User Management
**User Entity with Database Persistence**
- User is stored in H2 database
- Fields:
  - `id` (Long): Auto-generated primary key
  - `username` (String): Unique username, required, max 100 chars
  - `password` (String): Hashed password, required
  - `email` (String): Email address, optional
  - `apiKey` (String): Unique API key, auto-generated, required
  - `role` (String/Enum): User role (ADMIN, USER), defaults to USER
  - `createdAt` (LocalDateTime): User creation timestamp
  - `isActive` (Boolean): Account status, defaults to true
- Passwords hashed with BCrypt (Spring Security)
- API keys generated as UUID v4
- Unique constraints on username and apiKey

## Access Control Rules

### Public Endpoints (No Authentication Required)
- `GET /api/prompts` - List all prompts (paginated)
- `GET /api/prompts/{id}` - Get single prompt
- `GET /api/health` - Health check

### Protected Endpoints (Requires Valid API Key)
- `POST /api/prompts` - Create new prompt
  - Requires: Valid API key
  - Author set to authenticated user
- `PUT /api/prompts/{id}` - Update prompt
  - Requires: Valid API key AND user is the prompt author
  - Only author can edit own prompts
- `DELETE /api/prompts/{id}` - Delete prompt
  - Requires: Valid API key AND user is the prompt author
  - Only author can delete own prompts

### User Management Endpoints
- `POST /api/users/register` - Create new user (public, rate-limited)
- `GET /api/users/me` - Get current user info (requires API key)
- `POST /api/users/login` - Validate credentials and return API key (public)

## Implementation Details

### Authentication Filter
- Custom `@Component` implementing `OncePerRequestFilter`
- Extract API key from `X-API-Key` header
- Validate key against database
- Set SecurityContext if valid
- Return 401 Unauthorized if invalid or missing (for protected endpoints)

### Authorization Annotations
- Use Spring Security's `@PreAuthorize` on controller methods
- Use Spring EL expressions: `@preAuthorize("hasAuthority('ROLE_USER')")`
- Custom method-level security for owner-only endpoints

### API Responses
- Include `author` field in PromptResponse (username of creator)
- Include `userId` field in responses for context
- Error responses for 401/403:
  ```json
  {
    "status": 401,
    "error": "Unauthorized",
    "message": "Invalid or missing API key"
  }
  ```

## Database Changes
- New `users` table with fields listed above
- Update `prompts` table:
  - Add `user_id` (Long, foreign key to users table)
  - Update `author` to reference actual user, or keep as denormalized string
  - Add index on `user_id` for query performance

## Security Considerations
- Passwords never returned in API responses
- API keys treated as secrets (never logged)
- Rate limiting on `/register` and `/login` endpoints (optional, for Phase 3)
- HTTPS required in production (documented requirement)
- No CORS issues for same-domain requests

## API Examples

### Register User
```bash
POST /api/users/register
Content-Type: application/json

{
  "username": "ankur",
  "password": "secure-password",
  "email": "ankur@example.com"
}

Response: 201 Created
{
  "id": 1,
  "username": "ankur",
  "email": "ankur@example.com",
  "apiKey": "550e8400-e29b-41d4-a716-446655440000",
  "role": "USER",
  "createdAt": "2026-07-29T14:00:00Z"
}
```

### Login
```bash
POST /api/users/login
Content-Type: application/json

{
  "username": "ankur",
  "password": "secure-password"
}

Response: 200 OK
{
  "apiKey": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Create Prompt (Protected)
```bash
POST /api/prompts
X-API-Key: 550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "title": "Test Prompt",
  "content": "Test content"
}

Response: 201 Created
{
  "id": 1,
  "title": "Test Prompt",
  "content": "Test content",
  "author": "ankur",
  "userId": 1,
  ...
}
```

### Unauthorized Request
```bash
POST /api/prompts
Content-Type: application/json

{
  "title": "Test",
  "content": "Test"
}

Response: 401 Unauthorized
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or missing API key"
}
```

## Context from Mission & Tech Stack

### Mission Alignment
- Mission: Save/read/edit prompts with public read, author-only write
- Phase 3 enables this by implementing author identification and access restrictions

### Tech Stack
- Backend: Spring Boot 3.3.0 with Spring Security
- Database: H2 in-memory (will persist users for session)
- Build: Maven

## Dependencies to Add
- `spring-boot-starter-security` - Security framework
- Already have: Spring Data JPA, H2, validation

## Success Criteria
- Users can register with username/password
- Users receive API key on registration
- API key validates on protected endpoints
- Public endpoints accessible without authentication
- Author-only endpoints enforce ownership
- Proper 401/403 error responses
- All 5+ new endpoints working correctly
- Tests covering happy paths and error scenarios
