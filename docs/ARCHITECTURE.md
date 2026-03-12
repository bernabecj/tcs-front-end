# Architecture

## Overview

The app follows a **core / features / shared** structure to separate global logic from feature-specific code and reusable pieces. Main application code lives under `src/app/`; configuration and environment-specific values live under `src/environments/`.

## Main Folders (src)

- **`app/`** — Angular application: components, services, routing, and feature modules.
- **`environments/`** — Environment configuration (e.g. API base URL, production vs development). Used by the build via file replacements; services import from `environments/environment`.

## App Structure (app/)

- **`core/`** — Singletons used app-wide. No feature imports.
  - `models/` — Data interfaces and types.
  - `services/` — HTTP and app-level services (e.g. API client, notification, logging).
  - `interceptors/` — HTTP interceptors (e.g. error handling).
  - `errors/` — Global error handlers.
- **`features/`** — Business logic by domain. Each feature can have its own routes, pages, components, and validators.
- **`shared/`** — Reusable UI and utilities across features.
  - `components/` — Shared components (e.g. header, notification banner).
  - `pipes/` — Shared pipes.
  - `styles/` — Shared SCSS (e.g. buttons, variables).
- **Root** — `app.component`, `app.config.ts`, `app.routes.ts` (shell and lazy-loaded feature routes).

## Data Flow

1. Components in **features** call services from **core**.
2. Services use `HttpClient` and values from **environments** (e.g. API URL).
3. Error handling is centralized in the HTTP interceptor and global error handler; they log errors and show messages via a notification service.
4. Routing is lazy-loaded per feature.

## Products Feature (example)

- **Pages:** product-list, product-form (add/edit).
- **Routes:** `/products`, `/products/add`, `/products/edit/:id`.
