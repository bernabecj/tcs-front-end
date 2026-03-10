# Architecture

## Overview

The app follows a **core / features / shared** structure to separate global logic from feature-specific code and reusable pieces.

## Layers

- **Core:** Singletons (services, HTTP interceptors, models). No feature imports.
- **Features:** Business logic by domain. Each feature has its own routes, pages, and components.
- **Shared:** Reusable UI (components, directives, pipes) used across features.

## Data Flow

1. Components in **features** call services from **core**.
2. Services use `HttpClient` to call the backend at `http://localhost:3002`.
3. Error handling is centralized in an HTTP interceptor (to be added).
4. Routing is lazy-loaded per feature for better performance.

## Products Feature

- **Pages:** product-list, product-form (add/edit)
- **Components:** product-card, search bar, records selector, delete modal
- **Routes:** `/products`, `/products/add`, `/products/:id/edit`
