# Contrato de saída — Delete a user

**HTTP 200** — User deleted successfully

**Schema OpenAPI:** `SuccessMessage`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|----------|
| `message` | string | sim | Success message |
| `timestamp` | string (date-time) | não | When the operation was completed |

**Exemplo:**

```json
{
  "message": "User deleted successfully",
  "timestamp": "2025-07-15T17:30:00.000Z"
}
```

## Erros documentados

- **401** — Missing, malformed, expired, invalid or logout-revoked Bearer token — AUTH_UNAUTHORIZED
- **403** — Authenticated caller is not the owner or ADMIN
- **404** — User not found
- **500** — Server error
