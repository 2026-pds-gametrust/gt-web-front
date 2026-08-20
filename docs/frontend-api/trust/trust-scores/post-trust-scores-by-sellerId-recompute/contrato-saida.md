# Contrato de saída — Recompute trust score from ledger

**HTTP 200** — Recomputed

**Schema OpenAPI:** `TrustScore`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|----------|
| `id` | string | sim |  |
| `sellerId` | string | sim |  |
| `score` | number | sim |  |
| `components` | object | sim |  |
| `computedAt` | string (date-time) | sim |  |
| `updatedAt` | string (date-time) | não |  |

**Exemplo:**

```json
{
  "id": "string",
  "sellerId": "string",
  "score": 0,
  "components": {},
  "computedAt": "2026-08-07T12:00:00.000Z",
  "updatedAt": "2026-08-07T12:00:00.000Z"
}
```

## Erros documentados

- **401** — Missing, malformed, expired, invalid or logout-revoked Bearer token — AUTH_UNAUTHORIZED
- **403** — Forbidden
