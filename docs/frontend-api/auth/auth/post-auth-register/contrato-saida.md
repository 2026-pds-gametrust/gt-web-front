# Contrato de saída — Register a marketplace member and issue a session

**HTTP 201** — Registered with access and refresh tokens

**Schema OpenAPI:** `AuthSession`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|----------|
| `user` | User | sim |  |
| `accessToken` | string | sim |  |
| `refreshToken` | string | sim |  |

**Exemplo:**

```json
{
  "user": {
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
  },
  "accessToken": "string",
  "refreshToken": "string"
}
```

## Erros documentados

- **400** — Validation error or USER_UNDERAGE / FIELD_INVALID (including duplicate identifier)
- **429** — Auth throttle exhausted — generic limiter body, not an identifier oracle
- **500** — Server error
