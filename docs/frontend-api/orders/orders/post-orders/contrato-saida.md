# Contrato de saída — Create buy-now order

**HTTP 201** — `Order`

Pode retornar `AWAITING_PAYMENT` ou `CONFIRMED` (quando o escrow simulado conclui no mesmo request drain).

```json
{
  "id": "9c42503a-b36d-4417-b8a1-6d21a7b5a515",
  "listingId": "6a866b680037442176763f34",
  "buyerId": "buyer-uuid",
  "sellerId": "seller-uuid",
  "shippingMode": "PICKUP",
  "priceCents": 350000,
  "currency": "BRL",
  "status": "CONFIRMED",
  "reservationExpiresAt": "2026-08-20T12:15:00.000Z",
  "createdAt": "2026-08-20T12:00:00.000Z"
}
```
