# Contrato de saída — Approve case and grant seal (backoffice)

**HTTP 200** — Approved

**Schema OpenAPI:** `VerificationCase`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|----------|
| `id` | string | sim |  |
| `listingId` | string | sim |  |
| `status` | enum(PENDING \| IN_REVIEW \| APPROVED \| REJECTED) | sim |  |
| `checklist` | object | não |  |
| `decisionReason` | string | não |  |
| `moderatorId` | string | não |  |
| `createdAt` | string (date-time) | sim |  |
| `updatedAt` | string (date-time) | não |  |

**Exemplo:**

```json
{
  "id": "string",
  "listingId": "string",
  "status": "PENDING",
  "checklist": {},
  "decisionReason": "string",
  "moderatorId": "string",
  "createdAt": "2026-08-07T12:00:00.000Z",
  "updatedAt": "2026-08-07T12:00:00.000Z"
}
```

## Erros documentados

- **401** — Missing, malformed, expired, invalid or logout-revoked Bearer token — AUTH_UNAUTHORIZED
- **403** — Forbidden
- **404** — Not found
- **409** — Invalid transition or active seal exists
