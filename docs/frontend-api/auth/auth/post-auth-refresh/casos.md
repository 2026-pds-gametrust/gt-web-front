# Casos de sucesso e erro — Rotate a refresh token

## Sucesso (200)

New access and refresh tokens

**Body típico:**

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

## Erros

### HTTP 401

AUTH_INVALID_CREDENTIALS (unknown, expired, revoked/reuse, or BLOCKED)

**Body típico:**

```json
{
  "error": "string",
  "code": "RESOURCE_NOT_FOUND",
  "contextInfo": {}
}
```

**O que o front deve fazer:** limpar sessão se o access expirou; tentar `POST /auth/refresh`; se falhar, ir para login. **Não** spoofar `x-user-id`.

### HTTP 429

Auth throttle exhausted — generic limiter body, not an identifier oracle

**Body típico:**

```json
{
  "message": "Too many requests, please try again later."
}
```

**O que o front deve fazer:** throttle: esperar e retry com backoff. Não enumerar identidade.

### HTTP 500

Server error

**Body típico:**

```json
{
  "message": "User not found",
  "status": 404,
  "timestamp": "2025-07-15T17:30:00.000Z",
  "path": "/users/123"
}
```

**O que o front deve fazer:** erro genérico; não vazar detalhes internos.

