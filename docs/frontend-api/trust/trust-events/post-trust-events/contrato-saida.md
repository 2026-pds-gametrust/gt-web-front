# Contrato de saída — Append trust event (backoffice)

**HTTP 201** — Created or existing (idempotent)

**Schema OpenAPI:** `TrustEvent`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|----------|
| `id` | string | sim |  |
| `sellerId` | string | sim |  |
| `type` | enum(USER_VERIFIED \| SEAL_GRANTED \| SEAL_REVOKED \| ORDER_COMPLETED) | sim |  |
| `sourceEventId` | string | sim |  |
| `payload` | object | sim |  |
| `occurredAt` | string (date-time) | sim |  |
| `createdAt` | string (date-time) | sim |  |

**Exemplo:**

```json
{
  "id": "string",
  "sellerId": "string",
  "type": "USER_VERIFIED",
  "sourceEventId": "string",
  "payload": {},
  "occurredAt": "2026-08-07T12:00:00.000Z",
  "createdAt": "2026-08-07T12:00:00.000Z"
}
```

## Erros documentados

- **400** — Invalid payload
- **401** — Missing, malformed, expired, invalid or logout-revoked Bearer token — AUTH_UNAUTHORIZED
- **403** — Forbidden
