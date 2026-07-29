# Phase 2: Core Backend API - Requirements

## Scope
Implement the core REST API endpoints for managing prompts, including data model, in-memory repository, CRUD operations, validation, and error handling.

## Prompt Data Model
Based on best practices, the Prompt entity will include:

### Fields
- **id** (Long): Unique identifier, auto-generated primary key
- **title** (String): Prompt title, required, max 255 characters
- **content** (String): Full prompt content, required, max 10,000 characters
- **author** (String): Creator of the prompt, required (defaults to system user for now)
- **createdAt** (LocalDateTime): Timestamp when created, auto-set on creation
- **updatedAt** (LocalDateTime): Timestamp when last modified, auto-updated
- **description** (String): Optional short description, max 500 characters
- **category** (String): Optional categorization, max 100 characters
- **version** (Integer): Version number for tracking changes, defaults to 1

### Constraints
- All fields are persisted in H2 in-memory database
- Title and content are required (not null)
- IDs are auto-generated using sequence/identity
- Timestamps use UTC timezone
- Soft-delete capability (optional, not required for Phase 2)

## REST API Endpoints

### Create Prompt
```
POST /api/prompts
Content-Type: application/json

{
  "title": "Prompt Title",
  "content": "Full prompt content...",
  "description": "Optional description",
  "category": "Optional category"
}

Response: 201 Created
{
  "id": 1,
  "title": "Prompt Title",
  "content": "Full prompt content...",
  "author": "system",
  "description": "Optional description",
  "category": "Optional category",
  "createdAt": "2026-07-29T14:00:00Z",
  "updatedAt": "2026-07-29T14:00:00Z",
  "version": 1
}
```

### Get All Prompts (with pagination)
```
GET /api/prompts?page=0&size=20&sort=createdAt,desc

Response: 200 OK
{
  "content": [ /* array of prompts */ ],
  "totalElements": 100,
  "totalPages": 5,
  "currentPage": 0,
  "pageSize": 20
}
```

### Get Single Prompt
```
GET /api/prompts/{id}

Response: 200 OK
{
  "id": 1,
  "title": "Prompt Title",
  ...
}
```

### Update Prompt
```
PUT /api/prompts/{id}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  "description": "Updated description",
  "category": "Updated category"
}

Response: 200 OK
{ /* updated prompt object */ }
```

### Delete Prompt
```
DELETE /api/prompts/{id}

Response: 204 No Content
```

## Technology Decisions

### Data Model
- JPA/Hibernate annotations for entity mapping
- H2 dialect for database operations
- Auto-increment ID generation
- LocalDateTime for timezone-aware timestamps

### Validation
- Spring Validation with @Valid and @NotBlank, @Size, etc.
- Custom validators as needed
- Input sanitization for XSS prevention

### Error Handling
- Standard HTTP status codes:
  - 201 Created: Successful resource creation
  - 200 OK: Successful retrieval/update
  - 204 No Content: Successful deletion
  - 400 Bad Request: Validation errors
  - 404 Not Found: Resource not found
  - 500 Internal Server Error: Server errors
- Consistent error response format:
  ```json
  {
    "status": 400,
    "error": "Bad Request",
    "message": "Validation failed",
    "details": {
      "title": "Title is required",
      "content": "Content cannot exceed 10000 characters"
    },
    "timestamp": "2026-07-29T14:00:00Z"
  }
  ```
- Custom exception handling with @ControllerAdvice
- Logging of all errors for debugging

### Repository Pattern
- In-memory HashMap-based repository for Phase 2
- Interface: `PromptRepository` with CRUD operations
- Implementation: `InMemoryPromptRepository`
- Pagination support using custom PageResponse class

## Success Criteria
- Prompt entity created and mappable to H2
- All CRUD endpoints implemented and functional
- Input validation working for all fields
- Error handling consistent across all endpoints
- Unit tests for entity and service layer
- Integration tests for REST endpoints
- API responses match specifications
- Pagination working correctly
- Ready for Phase 3 (Authentication & Authorization)

## Context from specs/mission.md
- Application: Save, read, and edit prompts
- Target: Public read access, author-only write access
- Foundation: Phase 1 structure is complete

## Context from specs/tech-stack.md
- Backend: Spring Boot 3.3.0, Java 21
- Database: H2 in-memory
- Build: Maven

## Dependencies (already included)
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- h2
- spring-boot-starter-test
