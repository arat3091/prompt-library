# Prompt Manager Frontend

Angular frontend for the Prompt Manager application.

## Prerequisites

- Node.js 20.x or later
- npm 10.x or later

## Installation

```bash
npm install
```

## Development Server

Run the development server:

```bash
npm start
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any source files.

## Building

Build the project for production:

```bash
npm run build:prod
```

The build artifacts will be stored in the `dist/` directory.

## Running Tests

Run unit tests via Karma:

```bash
npm test
```

Test results will be displayed in the console and in the browser.

## Development

The application uses:
- Angular 18
- TypeScript 5.4
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
