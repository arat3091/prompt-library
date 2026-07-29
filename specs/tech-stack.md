# Technology Stack

## Frontend
- **Framework**: Angular
- **Purpose**: Provide a responsive, component-based user interface for viewing and managing prompts
- **Key Responsibilities**: UI rendering, user interactions, form handling

## Backend
- **Framework**: Spring Boot
- **Language**: Java
- **Purpose**: REST API server for handling CRUD operations on prompts
- **Key Responsibilities**: Business logic, authentication, data validation, API endpoints

## Database
- **Type**: In-Memory Database
- **Rationale**: Fast access for development and small-scale usage
- **Characteristics**: Data stored in application memory; resets on server restart

## Architecture Overview
```
Angular Frontend → REST API (Spring Boot) → In-Memory Database
```

## Communication
- RESTful API endpoints for data exchange
- JSON format for request/response payloads

## Deployment Considerations
- Frontend: Static asset serving or CDN
- Backend: JVM-based application server
- Database: Embedded in-memory store (no separate DB service needed initially)
