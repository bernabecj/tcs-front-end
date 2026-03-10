# Financial Products

Frontend application for managing financial products, built with Angular for the TCS technical exercise.

## Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Angular CLI** 18.x: `npm install -g @angular/cli@18`

## Backend

The frontend consumes a local Node.js API. You need to run it separately:

1. Go to the `repo-interview-main` folder (or extract `repo-interview-main.zip` if needed).
2. Install dependencies: `npm install`
3. Start the server: `npm run start:dev`
4. The API will be available at `http://localhost:3002`

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the development server**

   ```bash
   npm start
   ```

   Open [http://localhost:4200](http://localhost:4200) in your browser. The app will reload automatically on changes.

3. **Build for production**

   ```bash
   npm run build
   ```

   Output is in `dist/financial-products/`.

4. **Run unit tests**

   ```bash
   npm test
   ```

5. **Run tests with coverage**

   ```bash
   npm run test:coverage
   ```

   Coverage reports are generated in the `coverage/` folder.

## Tech Stack

- **Angular** 18
- **TypeScript** 5.5
- **SCSS** (no UI frameworks; custom styles only)
- **Jest** for unit tests
- **RxJS** for reactive flows

## Project Structure

```
src/app/
├── core/           # Singletons: services, interceptors, models
├── features/       # Feature modules (e.g. products)
├── shared/         # Reusable components, directives, pipes
└── environments/   # Environment configs (API URL, etc.)
```

## API Base URL

Configured in `src/environments/`:
- Development: `http://localhost:3002`
- Production: same (adjust in `environment.prod.ts` for deployment)
