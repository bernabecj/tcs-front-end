# API Reference

Base URL: `http://localhost:3002`

## Endpoints

### Get products

- **URL:** `GET /bp/products`
- **Response (200):** `{ "data": Product[] }`

### Create product

- **URL:** `POST /bp/products`
- **Body:** `Product` (id, name, description, logo, date_release, date_revision)
- **Response (200):** `{ "message": string, "data": Product }`

### Update product

- **URL:** `PUT /bp/products/:id`
- **Body:** `Product` (without id)
- **Response (200):** `{ "message": string, "data": Product }`

### Delete product

- **URL:** `DELETE /bp/products/:id`
- **Response (200):** `{ "message": string }`

### Verify product ID exists

- **URL:** `GET /bp/products/verification/:id`
- **Response (200):** `true` | `false`
