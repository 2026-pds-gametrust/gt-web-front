# Casos de sucesso e erro — Lexical search over published listing documents

## Sucesso (200)

Matching search documents

**Body típico:**

```json
[
  {
    "id": "string",
    "listingId": "string",
    "productId": "string",
    "categoryId": "string",
    "sellerId": "string",
    "title": "string",
    "brand": "string",
    "model": "string",
    "condition": "string",
    "status": "string",
    "priceCents": 0,
    "listPriceCents": 0,
    "currency": "string",
    "locationApprox": "string",
    "shippingModes": [
      "string"
    ],
    "freeShipping": false,
    "trustScore": 0,
    "sellerLevel": "string",
    "sealTypes": [
      "string"
    ],
    "facets": {},
    "searchText": "string",
    "thumbnailUrl": "string",
    "embedding": [
      0
    ],
    "sourceOccurredAt": "2026-08-07T12:00:00.000Z",
    "updatedAt": "2026-08-07T12:00:00.000Z"
  }
]
```

## Erros

_Nenhum erro HTTP documentado neste path (além de falha de rede)._
