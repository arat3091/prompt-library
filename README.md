# Prompt Library

A prompt management application where you can save, read, and edit prompts.

## Project Overview

This is a full-stack application built with:
- **Backend**: Spring Boot (Java)
- **Frontend**: Angular (TypeScript)
- **Database**: H2 (In-memory)

## Quick Start

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend runs on: `http://localhost:8080/api`

### Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs on: `http://localhost:4200`

## Documentation

- [Specifications](./specs/README.md) - Project requirements and roadmap
- [Development Guide](./DEVELOPMENT.md) - Setup and development instructions
- [Backend README](./backend/README.md) - Spring Boot specific instructions
- [Frontend README](./frontend/README.md) - Angular specific instructions

## Project Structure

```
.
├── backend/          # Spring Boot backend application
├── frontend/         # Angular frontend application
├── specs/            # Project specifications and planning
├── README.md         # This file
└── DEVELOPMENT.md    # Development guide
```

## Features

### Phase 1: Project Structure & Foundation ✅
- Spring Boot backend setup
- Angular frontend setup
- Development environment configuration
- Build and test infrastructure

### Phase 2: Core Backend API (Coming Soon)
- Prompt data model
- CRUD endpoints
- Input validation
- Error handling

### Phase 3+
See [Roadmap](./specs/roadmap.md) for upcoming phases.

## Development

For detailed development instructions, see [DEVELOPMENT.md](./DEVELOPMENT.md)

## License

This project is private.
