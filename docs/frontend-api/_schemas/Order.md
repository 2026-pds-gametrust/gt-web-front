# Schema: Order

**OpenAPI schema:** `Order`

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | sim |
| `listingId` | string | sim |
| `buyerId` | string | sim |
| `sellerId` | string | sim |
| `shippingMode` | enum(PICKUP \| SHIPPING) | sim |
| `priceCents` | integer | sim |
| `currency` | string | sim |
| `status` | OrderStatus | sim |
| `reservationExpiresAt` | string (date-time) | sim |
| `createdAt` | string (date-time) | sim |
| `updatedAt` | string (date-time) | não |
