# Contrato de entrada — Create buy-now order

**Schema OpenAPI:** `NewOrder`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|----------|
| `id` | string | não | Idempotência opcional do cliente |
| `listingId` | string | sim | Oferta a comprar |
| `shippingMode` | enum(PICKUP \| SHIPPING) | sim | Deve estar em `listing.shipping.modes` |

```json
{
  "id": "9c42503a-b36d-4417-b8a1-6d21a7b5a515",
  "listingId": "6a866b680037442176763f34",
  "shippingMode": "PICKUP"
}
```
