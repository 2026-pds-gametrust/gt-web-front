# Contrato de saída — Create listing draft

**HTTP 201** — Created

**Schema OpenAPI:** `Listing`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|----------|
| `id` | string | sim |  |
| `sellerId` | string | sim |  |
| `productId` | string | sim |  |
| `title` | string | sim |  |
| `description` | string | não |  |
| `condition` | enum(NEW \| LIKE_NEW \| GOOD \| FAIR \| POOR) | sim |  |
| `priceCents` | integer | sim |  |
| `listPriceCents` | integer | não |  |
| `currency` | string | sim |  |
| `attributes` | object | não |  |
| `media` | ListingMedia | sim |  |
| `shipping` | ListingShipping | sim |  |
| `locationApprox` | string | não |  |
| `warranty` | ListingWarranty | não |  |
| `acceptsOffers` | boolean | sim |  |
| `buyNowEnabled` | boolean | sim |  |
| `quantity` | integer | sim |  |
| `status` | enum(DRAFT \| SUBMITTED \| PUBLISHED \| PAUSED \| EXPIRED \| RESERVED \| SOLD) | sim |  |
| `createdAt` | string (date-time) | sim |  |
| `updatedAt` | string (date-time) | não |  |

**Exemplo:**

```json
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
```

## Erros documentados

- **401** — Missing, malformed, expired, invalid or logout-revoked Bearer token — AUTH_UNAUTHORIZED
- **403** — Actor is not the seller and not backoffice/admin
- **404** — Seller or product not found
- **500** — Server error
