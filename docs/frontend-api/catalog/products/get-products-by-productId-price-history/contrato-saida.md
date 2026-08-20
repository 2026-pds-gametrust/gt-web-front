# Contrato de saída — List price history for a product

**HTTP 200** — Price history list

**Tipo:** array de `PriceHistory`

**Schema OpenAPI:** `PriceHistory`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|----------|
| `id` | string | sim |  |
| `productId` | string | sim |  |
| `priceCents` | integer | sim |  |
| `currency` | string | sim |  |
| `source` | enum(LISTING_PUBLISHED \| LISTING_SOLD \| MANUAL) | sim |  |
| `observedAt` | string (date-time) | sim |  |
| `createdAt` | string (date-time) | sim |  |

**Exemplo:**

```json
{
  "id": "string",
  "productId": "string",
  "priceCents": 0,
  "currency": "string",
  "source": "LISTING_PUBLISHED",
  "observedAt": "2026-08-07T12:00:00.000Z",
  "createdAt": "2026-08-07T12:00:00.000Z"
}
```

## Erros documentados

- **404** — Product not found
- **500** — Server error
