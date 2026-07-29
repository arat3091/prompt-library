# Phase 2: Core Backend API - Implementation Plan

## Task Group 1: Prompt Entity & JPA Configuration
1. Create `Prompt` entity class in `com.promptmanager.models`
   - Annotate with `@Entity` and `@Table(name = "prompts")`
   - Define all fields with appropriate JPA annotations
   - Add `@GeneratedValue` for auto-incrementing ID
   - Add `@Temporal` or column types for createdAt/updatedAt timestamps
   - Add getters, setters, toString, equals, hashCode methods
2. Create JPA field constraints and column definitions
   - `@Column(nullable = false, length = 255)` for title
   - `@Column(nullable = false, columnDefinition = "TEXT")` for content
   - `@PrePersist` and `@PreUpdate` methods for timestamp management
3. Add validation annotations to entity fields
   - `@NotBlank` for required string fields
   - `@Size(max = 255)` for title
   - `@Size(max = 10000)` for content
   - `@Size(max = 500)` for description
4. Create test cases for entity creation and validation

## Task Group 2: Repository Layer
1. Create `PromptRepository` interface extending `JpaRepository<Prompt, Long>`
   - Define custom query methods if needed (e.g., `findByAuthor`, `findByCategory`)
2. Create `PromptService` class in `com.promptmanager.services`
   - Dependency injection of PromptRepository
   - CRUD methods: create, read, update, delete, list
   - Pagination support with Spring Data Page
   - Error handling for missing resources
3. Implement business logic
   - Validation before persisting
   - Automatic timestamp updates
   - Version management
4. Add unit tests for service layer
   - Test create, read, update, delete operations
   - Test validation failures
   - Test pagination

## Task Group 3: REST Controller & CRUD Endpoints
1. Create `PromptController` in `com.promptmanager.controllers`
   - Inject PromptService
   - Implement POST `/api/prompts` - Create prompt
   - Implement GET `/api/prompts` - List all with pagination
   - Implement GET `/api/prompts/{id}` - Get single prompt
   - Implement PUT `/api/prompts/{id}` - Update prompt
   - Implement DELETE `/api/prompts/{id}` - Delete prompt
2. Add request/response DTOs if needed
   - `CreatePromptRequest` - Input validation for creation
   - `UpdatePromptRequest` - Input validation for updates
   - `PromptResponse` - Formatted response object
3. Add proper HTTP status codes and response headers
4. Map exceptions to appropriate HTTP responses

## Task Group 4: Error Handling & Global Exception Handler
1. Create custom exceptions in `com.promptmanager.exceptions`
   - `PromptNotFoundException` - When prompt doesn't exist
   - `PromptValidationException` - When validation fails
   - `ResourceConflictException` - For conflicts
2. Create `GlobalExceptionHandler` class with `@ControllerAdvice`
   - Handle `PromptNotFoundException` → 404 Not Found
   - Handle `PromptValidationException` → 400 Bad Request
   - Handle `MethodArgumentNotValidException` → 400 with field errors
   - Handle generic exceptions → 500 Internal Server Error
3. Create consistent error response format class `ErrorResponse`
   - Include: status, error, message, details, timestamp
4. Add comprehensive logging for all errors
5. Test error handling with various scenarios

## Task Group 5: Input Validation
1. Add validation constraints to request DTOs
   - `@NotBlank` for required fields
   - `@Size` for length constraints
   - `@Length` for more specific constraints
2. Create custom validators if needed (e.g., for specific content rules)
3. Add validation test cases
4. Ensure validation messages are user-friendly
5. Test invalid inputs and edge cases

## Task Group 6: Pagination & Query Features
1. Implement pagination in controller
   - Accept `page` and `size` query parameters
   - Default page size: 20, max: 100
   - Support sorting: `sort=createdAt,desc` format
2. Create `PageResponse<T>` wrapper class for consistent response
3. Test pagination with various page sizes
4. Test sorting by different fields
5. Document pagination usage in controller

## Task Group 7: Integration Tests
1. Create `PromptControllerIT` or `PromptApiIT` for integration tests
   - Test complete HTTP request/response flow
   - Use `@SpringBootTest` with test containers (MockMvc)
   - Test each endpoint with valid and invalid data
   - Test error scenarios
2. Create `PromptServiceIT` for service layer integration
3. Create `PromptRepositoryIT` for repository layer
4. Ensure all tests pass with `mvn test`

## Task Group 8: Documentation & Code Quality
1. Add JavaDoc comments to all public classes and methods
2. Document API endpoints (consider Swagger/OpenAPI for Phase 4)
3. Update `backend/README.md` with API documentation
4. Verify no compiler warnings
5. Code review checklist:
   - Code follows Java conventions
   - Error handling is comprehensive
   - Tests cover happy path and error cases
   - Logging is appropriate
   - No hardcoded values
6. Final code cleanup and optimization
