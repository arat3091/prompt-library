# Prompt Manager Frontend

Angular 18 standalone frontend for the Prompt Manager application. Built with Material Design, featuring user authentication, prompt management, and responsive design.

## 📋 Table of Contents

- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Testing](#testing)
- [Building](#building)
- [Project Structure](#project-structure)
- [Features](#features)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🛠 Technology Stack

- **Framework**: Angular 18
- **Language**: TypeScript 5.4 (strict mode)
- **UI Components**: Angular Material 18
- **Forms**: Reactive Forms with FormBuilder
- **State Management**: RxJS BehaviorSubject
- **HTTP Client**: Angular HttpClient with custom interceptor
- **Authentication**: API Key-based (X-API-Key header)
- **Build Tool**: Angular CLI
- **Package Manager**: npm 10+

## 📦 Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+
- Java 21 (for running backend locally)
- Backend API running on `http://localhost:8080/api`

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd prompt-library
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages including:
- @angular/core@18
- @angular/material@18
- @angular/cdk@18
- typescript@5.4
- and more

### 3. Verify Installation

```bash
ng version
```

Should output Angular CLI version 18.x.x and Angular core version 18.x.x.

## 💻 Development

### Start Development Server

```bash
npm start
```

Or use ng serve directly:

```bash
ng serve --open
```

The app will be available at:
- **Primary**: `http://localhost:4200` (if available)
- **Fallback**: `http://localhost:53307+` (if port 4200 is in use)

The browser will automatically open and hot-reload on file changes.

### Stopping the Server

Press `Ctrl+C` in the terminal to stop the development server.

## 🧪 Testing

### Run All Tests

```bash
npm test
```

Executes all unit tests using Jasmine and Karma.

### Run Tests with Coverage

```bash
npm test -- --code-coverage
```

Generates code coverage report in `coverage/` directory.

### Run Specific Test Suite

```bash
ng test --include='**/auth.service.spec.ts'
```

### Run Tests in Headless Mode

```bash
ng test --browsers=ChromeHeadless --watch=false
```

Useful for CI/CD pipelines.

### Test Coverage Target

Target: **>80% code coverage**

Current coverage includes:
- **Services** (3 files):
  - `auth.service.spec.ts` - Auth operations and session management
  - `prompt.service.spec.ts` - Prompt CRUD operations
  - `auth.interceptor.spec.ts` - HTTP header injection

- **Components** (6 files):
  - `header.component.spec.ts` - Navigation and user menu
  - `auth-modal.component.spec.ts` - Login and registration forms
  - `prompt-list.component.spec.ts` - Prompt listing and pagination
  - `prompt-detail.component.spec.ts` - Prompt display and actions
  - `prompt-create-edit.component.spec.ts` - Form creation and editing
  - (App component covered via integration)

## 🏗 Building

### Build for Production

```bash
npm run build
```

Creates optimized production bundle in `dist/` directory.

### Build Output

```
Initial chunk files   | Names         |  Raw size | Estimated transfer size
main.xxx.js           | main          | xxx kB    | xxx kB
styles.xxx.css        | styles        | xxx kB    | xxx kB
polyfills.xxx.js      | polyfills     | xxx kB    | xxx kB
runtime.xxx.js        | runtime       | xxx kB    | xxx kB
```

### Build Configuration

See `angular.json` for build options and configurations.

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/                      # Navigation header
│   │   ├── auth-modal/                  # Login/Register modal
│   │   ├── prompt-list/                 # Prompts table view
│   │   ├── prompt-detail/               # Single prompt view
│   │   └── prompt-create-edit/          # Prompt form (create/edit)
│   ├── services/
│   │   ├── auth.service.ts              # Authentication & session
│   │   └── prompt.service.ts            # Prompt CRUD operations
│   ├── interceptors/
│   │   └── auth.interceptor.ts          # X-API-Key header injection
│   ├── models/
│   │   ├── prompt.model.ts              # Prompt interfaces
│   │   └── user.model.ts                # User interfaces
│   ├── app.component.*                  # Root component
│   ├── app.routes.ts                    # Routing configuration
│   └── app.config.ts                    # App configuration
├── styles.css                           # Global styles & Material theme
└── main.ts                              # Application entry point

tests/
└── *.spec.ts                            # Unit test files (collocated)
```

## ✨ Features

### Authentication
- User registration with email validation
- Stateless API key-based authentication
- Automatic API key injection via HTTP interceptor
- Session persistence in localStorage
- Real-time user state updates via RxJS

### Prompt Management
- **List View**: Paginated table of all prompts (20 per page)
- **Detail View**: Full prompt display with metadata
- **Create**: Form to create new prompts with validation
- **Edit**: Update existing prompts (author-only)
- **Delete**: Remove prompts (author-only)

### Form Validation
- Real-time validation feedback
- Username: 3-100 characters required
- Password: 8+ characters required
- Email: Valid email format required
- Prompt title: Required, max 255 characters
- Prompt content: Required, max 10,000 characters
- Character counters for text fields

### UI/UX
- Material Design components throughout
- Responsive design (mobile, tablet, desktop)
- Loading spinners for async operations
- Error messages with user guidance
- Retry functionality for failed operations
- Empty state indicators
- Smooth transitions and animations

### Error Handling
- User-friendly error messages
- Network error detection and recovery
- 404 handling for missing resources
- Form validation error display
- Loading state management

## 🔧 Troubleshooting

### Common Issues

#### 1. Port 4200 Already in Use

**Error**: `Port 4200 is already in use`

**Solution**:
```bash
# Kill process on port 4200
lsof -i :4200 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or use different port
ng serve --port 4201
```

#### 2. Backend API Not Accessible

**Error**: `Failed to load resource: net::ERR_CONNECTION_REFUSED`

**Solution**:
```bash
# Ensure backend is running on port 8080
cd ../backend
java -jar target/prompt-manager-backend-1.0.0.jar

# Or build and run
mvn clean package -DskipTests
java -jar target/prompt-manager-backend-1.0.0.jar
```

#### 3. CORS Policy Error

**Error**: `No 'Access-Control-Allow-Origin' header`

**Solution**: 
- Backend CORS must be configured for `http://localhost:4200` and `http://localhost:53307`
- Check `SecurityConfig.java` in backend for CORS bean configuration

#### 4. Module Not Found Errors

**Error**: `Cannot find module '@angular/material'`

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use --force flag
npm install --force
```

#### 5. Angular Version Mismatch

**Error**: `Angular version mismatch (found X, expected Y)`

**Solution**:
```bash
# Use correct Angular version
npm install @angular/core@18 @angular/material@18 @angular/cdk@18

# Or reinstall all dependencies
npm install
```

#### 6. Tests Not Running

**Error**: `Cannot find Chrome or ChromeHeadless`

**Solution**:
```bash
# Install Chrome or use Firefox
npm test -- --browsers=Firefox

# Or use headless mode with ChromeHeadless
npm test -- --browsers=ChromeHeadless --watch=false
```

#### 7. Hot Reload Not Working

**Error**: Changes not reflecting on save

**Solution**:
- Check if dev server is still running: `npm start`
- Verify file was saved properly
- Try manual browser refresh (Ctrl+R or Cmd+R)
- Clear browser cache: Devtools → Network → "Disable cache"

#### 8. Authorization Errors (403)

**Error**: `Failed to load resource: 403 Forbidden`

**Solution**:
- Register a new user first via Login/Register modal
- Check API key is being injected: Check browser DevTools → Network → Headers
- Verify backend authentication is working: Test with curl

### Debug Mode

Enable detailed logging:

```bash
ng serve --configuration development --source-map
```

Check browser DevTools Console for errors:
- F12 or Cmd+Option+I
- Go to Console tab
- Look for error messages with stack traces

## 📝 Contributing

### Code Style

- Use TypeScript strict mode (no `any`)
- Follow Angular style guide
- Use reactive forms pattern
- Implement proper error handling
- Add unit tests for new features (target >80% coverage)

### Commit Message Format

```
feat: Add new feature description
fix: Bug fix description
test: Add or update tests
docs: Documentation updates
style: Code style changes
refactor: Code refactoring
```

## 📄 License

See LICENSE file in root directory.

## 🤝 Support

For issues and questions:
1. Check this troubleshooting section
2. Review test files for usage examples
3. Check Angular Material documentation: https://material.angular.io
4. Open an issue in the repository

## 🔗 Related Documentation

- [Angular 18 Documentation](https://angular.io)
- [Angular Material](https://material.angular.io)
- [TypeScript 5.4 Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev)
- [Reactive Forms Guide](https://angular.io/guide/reactive-forms)

## ✅ Checklist for New Developers

- [ ] Node.js 20+ installed
- [ ] Repository cloned
- [ ] `npm install` completed
- [ ] Backend running on port 8080
- [ ] `npm start` working (dev server running)
- [ ] Can access http://localhost:4200 or localhost:53307+
- [ ] Login/Register modal opens
- [ ] `npm test` runs without errors
- [ ] All tests pass with >80% coverage

- Jasmine for testing
- Karma as test runner

### Project Structure

- `src/app/components/` - Angular components
- `src/app/services/` - API services and business logic
- `src/app/models/` - TypeScript interfaces and models
- `src/app/modules/` - Feature modules
- `src/environments/` - Environment-specific configurations

### API Configuration

API URL is configured in `src/environments/environment.ts` for development and `src/environments/environment.prod.ts` for production.

Default development API URL: `http://localhost:8080/api`
