# Casos de sucesso e erro — List price history for a product

## Sucesso (200)

Price history list

**Body típico:**

```json
[
  {
    "id": "string",
    "productId": "string",
    "priceCents": 0,
    "currency": "string",
    "source": "LISTING_PUBLISHED",
    "observedAt": "2026-08-07T12:00:00.000Z",
    "createdAt": "2026-08-07T12:00:00.000Z"
  }
]
```

## Erros

### HTTP 404

Product not found

**Body típico:**

```json
{
  "error": "string",
  "code": "RESOURCE_NOT_FOUND",
  "contextInfo": {}
}
```

**O que o front deve fazer:** empty-state / 404 de página. Não inventar recurso.

### HTTP 500

Server error

**Body típico:**

```json
{
  "message": "User not found",
  "status": 404,
  "timestamp": "2025-07-15T17:30:00.000Z",
  "path": "/users/123"
}
```

**O que o front deve fazer:** erro genérico; não vazar detalhes internos.

