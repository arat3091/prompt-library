# Phase 2: Core Backend API - Validation Checklist

## Entity & Data Model Validation
- [ ] `Prompt` entity class created in `com.promptmanager.models`
- [ ] All fields defined: id, title, content, author, createdAt, updatedAt, description, category, version
- [ ] JPA annotations properly applied (@Entity, @Table, @Column, @GeneratedValue)
- [ ] `@PrePersist` method sets createdAt automatically
- [ ] `@PreUpdate` method updates updatedAt on modifications
- [ ] Validation annotations present (@NotBlank, @Size, etc.)
- [ ] Entity can be instantiated and persisted to H2 database
- [ ] Getters, setters, toString, equals, hashCode implemented
- [ ] Unit tests for entity creation pass

## Repository & Service Layer Validation
- [ ] `PromptRepository` interface extends `JpaRepository<Prompt, Long>`
- [ ] Custom query methods implemented if needed
- [ ] `PromptService` class created with dependency injection
- [ ] Create operation: saves prompt, returns generated ID, validates input
- [ ] Read operation: retrieves prompt by ID, throws NotFoundException if not found
- [ ] Update operation: modifies prompt, updates timestamp, validates input
- [ ] Delete operation: removes prompt by ID
- [ ] List operation: returns paginated results, supports sorting
- [ ] Pagination works correctly with different page sizes
- [ ] Service layer unit tests pass (100% of CRUD methods tested)
- [ ] Error scenarios tested (missing resources, validation failures)

## REST Controller Validation
- [ ] `PromptController` created with proper routing
- [ ] POST `/api/prompts` endpoint:
  - [ ] Accepts JSON request body
  - [ ] Validates input before saving
  - [ ] Returns 201 Created with Location header
  - [ ] Response includes created prompt with generated ID
- [ ] GET `/api/prompts` endpoint:
  - [ ] Returns paginated list of prompts
  - [ ] Accepts `page`, `size`, `sort` query parameters
  - [ ] Default pagination (page=0, size=20) works
  - [ ] Sorting by different fields works
  - [ ] Returns 200 OK with PageResponse format
- [ ] GET `/api/prompts/{id}` endpoint:
  - [ ] Returns single prompt by ID
  - [ ] Returns 200 OK for existing prompt
  - [ ] Returns 404 Not Found for non-existent prompt
- [ ] PUT `/api/prompts/{id}` endpoint:
  - [ ] Updates existing prompt
  - [ ] Validates input before updating
  - [ ] Returns 200 OK with updated prompt
  - [ ] Returns 404 Not Found if prompt doesn't exist
- [ ] DELETE `/api/prompts/{id}` endpoint:
  - [ ] Deletes prompt by ID
  - [ ] Returns 204 No Content on success
  - [ ] Returns 404 Not Found if prompt doesn't exist
- [ ] All endpoints return correct HTTP status codes
- [ ] Response Content-Type is application/json

## Error Handling & Exceptions Validation
- [ ] Custom exception classes created:
  - [ ] `PromptNotFoundException` (for missing resources)
  - [ ] `PromptValidationException` (for validation failures)
  - [ ] `ResourceConflictException` (for conflicts)
- [ ] Global exception handler (`@ControllerAdvice`) created
- [ ] Exception mappings:
  - [ ] PromptNotFoundException → 404 Not Found
  - [ ] PromptValidationException → 400 Bad Request
  - [ ] MethodArgumentNotValidException → 400 with field errors
  - [ ] Generic exceptions → 500 Internal Server Error
- [ ] Error response format is consistent:
  - [ ] Includes status code
  - [ ] Includes error type/message
  - [ ] Includes timestamp
  - [ ] Includes details about specific validation errors (if applicable)
- [ ] Error responses are properly JSON formatted
- [ ] All errors are logged with appropriate log level

## Input Validation Validation
- [ ] Title field validation:
  - [ ] Required (not blank)
  - [ ] Max 255 characters enforced
  - [ ] Rejects empty strings
- [ ] Content field validation:
  - [ ] Required (not blank)
  - [ ] Max 10,000 characters enforced
- [ ] Description field validation:
  - [ ] Optional
  - [ ] Max 500 characters if provided
- [ ] Category field validation:
  - [ ] Optional
  - [ ] Max 100 characters if provided
- [ ] Validation error messages are clear and helpful
- [ ] Invalid payloads return 400 Bad Request with details
- [ ] Valid payloads pass through successfully
- [ ] Edge cases tested (empty strings, null values, boundary lengths)

## Pagination Validation
- [ ] Pagination works with default parameters
- [ ] Pagination works with custom page size (1-100)
- [ ] Sorting works by createdAt (ascending and descending)
- [ ] Sorting works by other fields (title, updatedAt)
- [ ] Response includes:
  - [ ] `content` array with prompts
  - [ ] `totalElements` count
  - [ ] `totalPages` count
  - [ ] `currentPage` number
  - [ ] `pageSize` value
- [ ] Out-of-range page numbers handled gracefully
- [ ] Invalid sort parameters handled (don't crash)

## Integration Tests Validation
- [ ] `PromptControllerIT` test class exists
- [ ] All endpoints tested with `MockMvc` or `@SpringBootTest`
- [ ] Create endpoint tests:
  - [ ] Valid payload creates prompt
  - [ ] Invalid payload returns 400
  - [ ] Missing required fields returns 400
- [ ] Read endpoint tests:
  - [ ] Existing ID returns prompt
  - [ ] Non-existent ID returns 404
- [ ] Update endpoint tests:
  - [ ] Valid update modifies prompt
  - [ ] Invalid payload returns 400
  - [ ] Updating non-existent prompt returns 404
- [ ] Delete endpoint tests:
  - [ ] Deleting existing prompt succeeds
  - [ ] Deleting non-existent prompt returns 404
- [ ] Pagination tests:
  - [ ] Default pagination works
  - [ ] Custom page sizes work
  - [ ] Sorting works
- [ ] At least 1 integration test per endpoint
- [ ] All integration tests pass: `mvn test`

## Code Quality Validation
- [ ] No compiler warnings or errors
- [ ] Code follows Java naming conventions (camelCase)
- [ ] Classes are well-organized in appropriate packages
- [ ] JavaDoc comments on public classes and methods
- [ ] No hardcoded values (use constants/configuration)
- [ ] Proper dependency injection used (no `new` keyword for services)
- [ ] Logging is appropriate (debug for details, error for problems)
- [ ] No security vulnerabilities (SQL injection, XSS)
- [ ] Code is readable and maintainable
- [ ] Similar code is not duplicated

## API Documentation Validation
- [ ] Controller methods have clear JavaDoc
- [ ] Request/response formats are documented
- [ ] HTTP status codes are documented
- [ ] Error response formats are documented
- [ ] Query parameters are documented
- [ ] Backend README.md updated with API documentation
- [ ] Example API calls provided (curl or REST client)

## Database & Persistence Validation
- [ ] H2 database properly configured
- [ ] Tables are created on startup
- [ ] Data persists within application session
- [ ] Timestamps are correctly set and updated
- [ ] ID generation works correctly (no duplicates)
- [ ] H2 console accessible for debugging (if needed)

## Final Sign-Off
- [ ] All validation checklist items verified
- [ ] All tests passing: `mvn test`
- [ ] Application builds successfully: `mvn clean install`
- [ ] Backend runs without errors: `mvn spring-boot:run`
- [ ] Health check still works: GET `/api/health`
- [ ] API endpoints accessible and functional
- [ ] Error handling works as specified
- [ ] Code ready for code review
- [ ] Ready for Phase 3 (Authentication & Authorization)
- [ ] Branch ready for pull request
