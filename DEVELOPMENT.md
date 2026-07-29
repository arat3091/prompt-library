# Development Guide

## Prerequisites

### Java Development (Backend)
- Java 21 or later
- Maven 3.8.1 or later
- Git

### JavaScript Development (Frontend)
- Node.js 20.x or later
- npm 10.x or later
- Git

### Tools & IDE
- Visual Studio Code (recommended)
- VS Code Extensions:
  - Extension Pack for Java
  - Angular Language Service
  - REST Client (for API testing)
  - Git Graph

## Project Structure

```
prompt-library/
├── backend/                    # Spring Boot backend
│   ├── src/
│   │   ├── main/java/         # Source code
│   │   └── test/java/         # Unit tests
│   ├── pom.xml                # Maven configuration
│   └── README.md              # Backend setup guide
├── frontend/                   # Angular frontend
│   ├── src/
│   │   ├── app/               # Application components
│   │   ├── assets/            # Static assets
│   │   └── environments/       # Environment configs
│   ├── package.json           # npm configuration
│   ├── angular.json           # Angular configuration
│   └── README.md              # Frontend setup guide
├── specs/                      # Project specifications
│   ├── mission.md
│   ├── tech-stack.md
│   ├── roadmap.md
│   └── 2026-07-29-project-structure-foundation/
├── .editorconfig              # Editor configuration
├── README.md                  # Project overview
└── DEVELOPMENT.md             # This file
```

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd prompt-library
```

### 2. Backend Setup & Development

```bash
# Navigate to backend directory
cd backend

# Install dependencies and build
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080/api`

### 3. Frontend Setup & Development

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Run development server
npm start
```

The frontend will be available at `http://localhost:4200`

## Common Development Tasks

### Running Backend Tests

```bash
cd backend
mvn test
```

### Running Frontend Tests

```bash
cd frontend
npm test
```

### Building for Production

**Backend:**
```bash
cd backend
mvn clean package
```

**Frontend:**
```bash
cd frontend
npm run build:prod
```

## API Development

### Base URL (Development)
```
http://localhost:8080/api
```

### Health Check
```bash
curl http://localhost:8080/api/health
```

### H2 Database Console
Access at: `http://localhost:8080/api/h2-console`
- JDBC URL: `jdbc:h2:mem:promptdb`
- Username: `sa`
- Password: (empty)

## Frontend Development

### Component Generation

Components, services, and other Angular artifacts will be manually created following the directory structure:
- `src/app/components/` - UI components
- `src/app/services/` - API services
- `src/app/models/` - TypeScript interfaces

### Environment Configuration

- Development: `src/environments/environment.ts`
- Production: `src/environments/environment.prod.ts`

Default API URL for development: `http://localhost:8080/api`

## Debugging

### Backend Debugging in VS Code

1. Install "Debugger for Java" extension
2. Create a debug configuration in `.vscode/launch.json`
3. Set breakpoints in Java files
4. Press F5 to start debugging

### Frontend Debugging in VS Code

1. Install "Debugger for Chrome" extension
2. Use Chrome DevTools (F12) in the browser
3. Set breakpoints in TypeScript files
4. VS Code will sync breakpoints with the browser

## Git Workflow

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

3. Push to remote:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub

## Troubleshooting

### Maven Build Issues

- Clear Maven cache: `rm -rf ~/.m2/repository`
- Rebuild: `mvn clean install`

### Node/npm Issues

- Clear npm cache: `npm cache clean --force`
- Delete `node_modules`: `rm -rf node_modules`
- Reinstall: `npm install`

### Port Already in Use

- Backend port 8080: `lsof -i :8080` and kill the process
- Frontend port 4200: `lsof -i :4200` and kill the process

### CORS Issues

If frontend cannot reach backend, check CORS configuration in Spring Boot backend.

## Editor Settings (VS Code)

Recommended settings in `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[java]": {
    "editor.defaultFormatter": "redhat.java",
    "editor.formatOnSave": true
  },
  "java.home": "/Library/Java/JavaVirtualMachines/openjdk-21.jdk/Contents/Home"
}
```

## Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Angular Documentation](https://angular.io/docs)
- [H2 Database Documentation](https://www.h2database.com/)
- [Maven Documentation](https://maven.apache.org/)
- [Node.js & npm Documentation](https://nodejs.org/)
