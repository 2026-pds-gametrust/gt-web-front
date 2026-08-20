# Casos de sucesso e erro — List products

## Sucesso (200)

Product list

**Body típico:**

```json
[
  {
    "id": "string",
    "categoryId": "string",
    "brand": "string",
    "model": "string",
    "series": "string",
    "slug": "string",
    "mpn": "string",
    "ean": "string",
    "sku": "string",
    "specs": {},
    "imageUrls": [
      "string"
    ],
    "imageAssetIds": [
      "string"
    ],
    "referencePriceCents": 0,
    "currency": "string",
    "status": "ACTIVE",
    "createdAt": "2026-08-07T12:00:00.000Z",
    "updatedAt": "2026-08-07T12:00:00.000Z"
  }
]
```

## Erros

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

