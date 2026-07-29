# Phase 1 Validation Checklist

## Backend (Spring Boot) Validation
- [ ] Spring Boot project created and compiles without errors (`mvn clean install` succeeds)
- [ ] All Maven dependencies resolve correctly
- [ ] H2 in-memory database configured in application.properties
- [ ] Directory structure created: controllers/, models/, repositories/, services/, exceptions/
- [ ] Spring Boot can start successfully in dev mode (`mvn spring-boot:run`)
- [ ] Basic health check endpoint responds (e.g., GET /actuator/health)
- [ ] JUnit testing framework is accessible and a sample test runs
- [ ] Logging is properly configured and output appears in console

## Frontend (Angular) Validation
- [ ] Angular project created via Angular CLI
- [ ] All npm dependencies install without conflicts (`npm install` succeeds)
- [ ] Angular app compiles without errors (`ng build`)
- [ ] Angular dev server can start (`ng serve`) and app loads in browser at http://localhost:4200
- [ ] Directory structure created: components/, services/, models/, modules/
- [ ] HTTP client module configured for backend API calls
- [ ] Karma/Jasmine testing framework runs successfully (`ng test`)
- [ ] No console errors or warnings in browser dev tools

## Development Environment Validation
- [ ] .gitignore properly excludes Maven target/, node_modules/, .angular/
- [ ] .editorconfig file present and VS Code respects it
- [ ] README.md updated with setup and run instructions
- [ ] DEVELOPMENT.md created with detailed developer guide
- [ ] Recommended VS Code extensions documented
- [ ] At least one developer can clone the repo and run both applications locally

## Integration Points Validation
- [ ] Backend runs on configured port (default 8080)
- [ ] Frontend can reach backend API URL during development (CORS configured if needed)
- [ ] No port conflicts between backend and frontend

## Code Quality Validation
- [ ] Code follows Java conventions (camelCase, package naming)
- [ ] Code follows TypeScript/Angular conventions
- [ ] At least one unit test per project runs successfully
- [ ] No compiler warnings (or documented exceptions)

## Final Sign-Off
- [ ] All checklist items verified
- [ ] Project structure matches standards documented in specs/tech-stack.md
- [ ] Both applications ready for Phase 2 (Core Backend API)
- [ ] Documentation complete and accurate
- [ ] Branch ready for code review and merge
