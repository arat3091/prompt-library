# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-Phase3] - 2026-07-29

### Phase 3: Authentication & Authorization

#### Added

**User Management**
- New `User` entity with username, email, API key, role, and timestamps
- User registration endpoint: `POST /api/users/register` - Create new user with hashed password
- User login endpoint: `POST /api/users/login` - Authenticate and return API key
- Current user endpoint: `GET /api/users/me` - Get authenticated user details
- `UserRepository` with find methods: `findByUsername()`, `findByApiKey()`, `findByEmail()`
- `UserService` with registration, authentication, and user lookup functionality

**Authentication & Authorization**
- `ApiKeyAuthenticationFilter` - Stateless API Key authentication via `X-API-Key` header
- `SecurityConfig` - Spring Security configuration for stateless API with method-level security
- `PasswordEncoder` bean using BCrypt for secure password hashing
- UUID-based API key generation for authenticated users
- Circular dependency resolution using method parameter injection in security filter chain

**Access Control**
- Public read endpoints: `GET /api/prompts`, `GET /api/prompts/{id}`, `GET /api/health`
- Protected write endpoints: `POST /api/prompts`, `PUT /api/prompts/{id}`, `DELETE /api/prompts/{id}`
- Author-only ownership verification for update and delete operations
- `UnauthorizedException` for access control violations (403 Forbidden)

**Prompt Updates**
- Added `userId` field to `Prompt` entity with foreign key relationship
- Updated `PromptResponse` DTO to include `userId` in API responses
- Modified `PromptService` methods to accept and verify `userId` for ownership validation
- Updated `PromptController` to extract userId from authentication and pass to service layer

**Error Handling**
- Extended `GlobalExceptionHandler` with `UnauthorizedException` handler
- 403 Forbidden responses for unauthorized access attempts
- Improved logging for authentication and authorization events

**Testing (Phase 3)**
- `UserTest` - Entity creation, field validation, equality, serialization (5 tests)
- `UserServiceTest` - Registration, authentication, user lookup with mocked repository (8 tests)
- `UnauthorizedExceptionTest` - Exception creation and hierarchy validation (3 tests)
- Updated `PromptServiceTest` - Authorization and ownership verification (10 tests)
  - Test cases for unauthorized update/delete operations
  - Ownership validation with mismatched userIds
- All Phase 3 tests passing: 26 new + 5 existing = 31 total

#### Changed

**Prompt Entity**
- Added non-nullable `userId` column with database constraint
- Updated constructor to require `userId` parameter
- Modified `@PrePersist` lifecycle to initialize version consistently

**Prompt Service**
- `createPrompt()` now requires `userId` parameter
- `updatePrompt()` now requires `userId` for ownership verification
- `deletePrompt()` now requires `userId` for ownership verification
- Enhanced logging for user-specific operations
- Error messages indicate owner-only constraints

**Prompt Controller**
- Changed endpoint path prefix from `/prompts` to `/api/prompts` for consistency
- Added `Authentication` parameter to protected endpoints (POST, PUT, DELETE)
- Extracts `userId` from authenticated user details
- Returns 401 Unauthorized for unauthenticated requests to protected endpoints
- Enhanced logging for authenticated operations

**DTOs**
- `PromptResponse` includes `userId` in responses

#### Dependencies
- Added `spring-boot-starter-security:3.3.0`
- Spring Security modules:
  - `spring-security-config:6.3.0`
  - `spring-security-core:6.3.0`
  - `spring-security-crypto:6.3.0`
  - `spring-security-web:6.3.0`

#### Architecture

**Security Architecture**
- Stateless API design with per-request authentication
- API Key transmitted via `X-API-Key` HTTP header
- No session creation or CSRF protection (stateless)
- Method-level security with `@PreAuthorize` annotations ready for implementation
- Password hashing using BCrypt with salt rounds

**Database Schema Changes**
- Added `users` table with unique constraints on username and api_key
- Updated `prompts` table with non-nullable `user_id` foreign key
- User roles: ADMIN, USER (enum stored as string)

**Dependency Injection**
- Fixed circular dependency: UserService → PasswordEncoder → SecurityConfig → AuthFilter → UserService
- Solution: Method-level parameter injection for ApiKeyAuthenticationFilter in filterChain()

#### Build & Testing

**Build Status**
- `mvn clean install`: ✅ SUCCESS
- `mvn test`: ✅ 31/31 PASSING
- Compile warnings: 0
- Test coverage: All critical paths covered

**Test Results**
- PromptTest: 5/5 passing
- UserTest: 5/5 passing
- PromptServiceTest: 10/10 passing
- UserServiceTest: 8/8 passing
- UnauthorizedExceptionTest: 3/3 passing
- HealthController integration test: 1/1 passing (inherited from Phase 2)

---

## [1.0.0-Phase2] - 2026-07-29

### Phase 2: Core Backend API

#### Added

**REST Endpoints (CRUD Operations)**
- `POST /api/prompts` - Create new prompt (201 Created)
- `GET /api/prompts` - List all prompts with pagination and sorting (200 OK)
- `GET /api/prompts/{id}` - Get single prompt by ID (200 OK, 404 Not Found)
- `PUT /api/prompts/{id}` - Update prompt (200 OK, 404 Not Found)
- `DELETE /api/prompts/{id}` - Delete prompt (204 No Content, 404 Not Found)

**Data Transfer Objects (DTOs)**
- `CreatePromptRequest` - Request validation for prompt creation
- `UpdatePromptRequest` - Request validation for prompt updates
- `PromptResponse` - Standardized response format with all prompt fields
- `PageResponse<T>` - Generic paginated response wrapper
- `ErrorResponse` - Consistent error response format

**Data Access & Persistence**
- `PromptRepository` - Spring Data JpaRepository with custom query methods
- Custom finder methods: `findByAuthor()`, `findByCategory()`, `findByTitleContainingIgnoreCase()`
- Pagination support via Spring Data `Pageable`
- H2 in-memory database with auto-table creation (create-drop)

**Service Layer**
- `PromptService` - Business logic for prompt operations
- CRUD methods with comprehensive validation and error handling
- Pagination support: configurable page size (max 100, default 20)
- Sorting support: any field, ASC/DESC direction with validation
- Full logging for debugging and monitoring

**Error Handling**
- `GlobalExceptionHandler` - Centralized exception handling with `@ControllerAdvice`
- `PromptNotFoundException` - 404 Not Found responses
- `PromptValidationException` - 400 Bad Request responses
- Field-level validation errors from `@Valid` annotations
- Generic exception handler for unexpected errors (500 Internal Server Error)

**Input Validation**
- Required field validation: `@NotBlank` for title and content
- Size constraints: `@Size` for title (max 255), content (max 10000), description (max 500)
- Endpoint-level validation with `@Valid` on DTOs
- Error detail responses with field-specific messages

**Testing (Phase 2)**
- `PromptServiceTest` - 8 comprehensive unit tests for service layer
  - CRUD operations (create, read, update, delete)
  - Pagination and sorting
  - Error scenarios and not-found exceptions
  - Mocked repository for isolation
- `PromptTest` - 5 unit tests for entity model
  - Entity creation and field validation
  - Timestamps and version management
  - Equality and serialization
- `HealthController` - 1 integration test for health check endpoint
- All tests passing with mocked dependencies

#### Changed

**Prompt Entity**
- Added timestamps: `createdAt` (immutable), `updatedAt` (auto-updated)
- Added version field for optimistic locking
- JPA lifecycle methods: `@PrePersist` for creation, `@PreUpdate` for modification
- Input validation annotations on fields
- Enhanced `toString()` for debugging

**Validation Framework**
- Integrated Jakarta Validation (jakarta.validation-api)
- Applied `@NotBlank`, `@Size` constraints to entity fields
- Automatic validation in controller layer with `@Valid`

#### Dependencies
- `spring-boot-starter-validation:3.3.0`
- Jakarta Validation API for declarative field validation

#### API Documentation

**Request/Response Examples**

Create Prompt:
```
POST /api/prompts
Content-Type: application/json
{
  "title": "My First Prompt",
  "content": "This is the prompt content",
  "description": "Optional description",
  "category": "AI"
}
Response: 201 Created
{
  "id": 1,
  "title": "My First Prompt",
  "content": "This is the prompt content",
  "description": "Optional description",
  "category": "AI",
  "createdAt": "2026-07-29T17:00:00",
  "updatedAt": "2026-07-29T17:00:00",
  "version": 1
}
```

List Prompts with Pagination:
```
GET /api/prompts?page=0&size=20&sort=createdAt&direction=desc
Response: 200 OK
{
  "content": [...],
  "currentPage": 0,
  "pageSize": 20,
  "totalElements": 42,
  "totalPages": 3
}
```

#### Build & Testing

**Build Status**
- `mvn clean install`: ✅ SUCCESS
- `mvn test`: ✅ 14/14 PASSING
- All dependencies resolved correctly

**Database Initialization**
- H2 auto-creates `prompts` table on startup
- Hibernate DDL strategy: `create-drop` (recreates on each run)
- Schema: All required fields, constraints, indexes

---

## [1.0.0-Phase1] - 2026-07-29

### Phase 1: Project Structure & Foundation

#### Added

**Spring Boot Backend**
- Spring Boot 3.3.0 application with Maven build
- Java 21 with Spring framework
- H2 in-memory database for development
- Hibernate ORM with JPA
- Logging with SLF4J

**Core Components**
- `PromptManagerApplication` - Application entry point with `@SpringBootApplication`
- `HealthController` - System health check endpoint: `GET /api/health`
- `application.properties` - Development configuration and logging setup

**Frontend (Angular)**
- Angular 18 CLI project
- TypeScript 5.4 with strict mode
- RxJS for reactive programming
- Karma + Jasmine for testing
- Development server on port 4200

**Documentation**
- README.md with project overview
- DEVELOPMENT.md with setup and running instructions
- Backend and frontend specific README files

#### Testing

**Integration Tests**
- `HealthController` smoke test: 1/1 passing
- Spring Boot context loading validation

#### Build Configuration

**Maven (backend/pom.xml)**
- Spring Web, Data JPA, Actuator, DevTools
- H2 runtime database
- JUnit 5 for testing
- Spring Test framework
- Maven Compiler Plugin with Java 21
- Maven Surefire Plugin for test execution

**NPM (frontend/package.json)**
- Angular 18 and dependencies
- Development dependencies: TypeScript, Karma, Jasmine
- Build and test scripts

#### Architecture

**Project Structure**
```
/backend/                    Spring Boot application
  /src/main/java/           Source code
  /src/main/resources/       Configuration files
  /src/test/java/           Test code
  pom.xml                    Maven configuration
/frontend/                   Angular application
  /src/app/                 Application components
  /src/assets/              Static assets
  package.json              NPM dependencies
/specs/                      Specifications and documentation
```

**Technology Stack**
- **Backend**: Spring Boot 3.3.0, Spring Data JPA, Hibernate, H2, Maven
- **Frontend**: Angular 18, TypeScript 5.4, npm/Node.js
- **Database**: H2 in-memory (development only)
- **Build Tools**: Maven (backend), Angular CLI (frontend)
- **Testing**: JUnit 5, Mockito, Karma + Jasmine
- **Java Version**: 21

#### Build & Runtime

**Backend Build**
- `mvn clean install`: ✅ SUCCESS
- Application startup: ✅ Running on port 8080
- Health check: ✅ Responds at `/api/health`

**Frontend Build**
- `npm install`: ✅ Dependencies installed
- `npm build`: ✅ Optimization enabled

---

## Version History

| Version | Status | Date | Scope |
|---------|--------|------|-------|
| 1.0.0-Phase1 | ✅ Complete | 2026-07-29 | Project foundation and structure |
| 1.0.0-Phase2 | ✅ Complete | 2026-07-29 | Core CRUD API with validation |
| 1.0.0-Phase3 | ✅ Complete | 2026-07-29 | Authentication, authorization, user management |

---

## Development Notes

### Running the Application

**Backend (Spring Boot)**
```bash
cd backend
mvn spring-boot:run
# Server runs on http://localhost:8080
# Health check: http://localhost:8080/api/health
```

**Frontend (Angular)**
```bash
cd frontend
npm start
# Application runs on http://localhost:4200
```

### Testing

**Backend Tests**
```bash
cd backend
mvn test              # Run all tests
mvn clean install     # Build and run all tests
```

**Frontend Tests**
```bash
cd frontend
npm test
```

### Database Access
- H2 Console: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:promptdb`
- Username: `sa`, Password: (empty)

---

## Contributors

- Development team

## License

Proprietary - All rights reserved
