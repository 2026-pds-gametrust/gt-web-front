# Contrato de saída — Assign user groups (ADMIN only)

**HTTP 200** — User with updated groups

**Schema OpenAPI:** `User`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|----------|
| `id` | string | sim |  |
| `fullName` | string | sim |  |
| `email` | string | sim |  |
| `phone` | string | sim |  |
| `cpf` | string | sim | 11 digits; never included in domain events |
| `birthDate` | string (date) | sim | YYYY-MM-DD |
| `verified` | boolean | sim |  |
| `phoneVerified` | boolean | sim |  |
| `status` | enum(ACTIVE \| BLOCKED \| PENDING_VERIFICATION) | sim |  |
| `createdAt` | string (date-time) | sim |  |
| `updatedAt` | string (date-time) | não |  |
| `groups` | array<string> | não | HTTP-assignable groups; empty when unset. Never includes SYSTEM. |

**Exemplo:**

```json
{
  "id": "string",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "cpf": "string",
  "birthDate": "string",
  "verified": false,
  "phoneVerified": false,
  "status": "ACTIVE",
  "createdAt": "2026-08-07T12:00:00.000Z",
  "updatedAt": "2026-08-07T12:00:00.000Z",
  "groups": [
    "app-user"
  ]
}
```

## Erros documentados

- **400** — FIELD_INVALID (e.g. SYSTEM assignment)
- **401** — Missing, malformed, expired, invalid or logout-revoked Bearer token — AUTH_UNAUTHORIZED
- **403** — Not ADMIN (Access denied), or self-escalation FIELD_INVALID
- **404** — User not found
- **500** — Server error
