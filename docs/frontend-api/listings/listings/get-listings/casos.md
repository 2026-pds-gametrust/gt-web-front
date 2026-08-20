# Casos de sucesso e erro — List listings

## Sucesso (200)

Listing list

**Body típico:**

```json
[
  {
    "id": "string",
    "sellerId": "string",
    "productId": "string",
    "title": "string",
    "description": "string",
    "condition": "NEW",
    "priceCents": 0,
    "listPriceCents": 0,
    "currency": "string",
    "attributes": {},
    "media": {
      "photoUrls": [
        "string"
      ],
      "videoUrl": "string",
      "coverPhotoUrl": "string",
      "assetIds": [
        "string"
      ]
    },
    "shipping": {
      "modes": [
        "PICKUP"
      ],
      "packageWeightGrams": 0,
      "packageLengthCm": 0,
      "packageWidthCm": 0,
      "packageHeightCm": 0,
      "freeShipping": false
    },
    "locationApprox": "string",
    "warranty": {
      "type": "NONE",
      "months": 0
    },
    "acceptsOffers": false,
    "buyNowEnabled": false,
    "quantity": 0,
    "status": "DRAFT",
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

