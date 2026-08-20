# Casos de sucesso e erro — List favorites for the authenticated actor

## Sucesso (200)

Favorites bound to the access-token subject

**Body típico:**

```json
[
  {
    "id": "string",
    "userId": "string",
    "targetType": "PRODUCT",
    "targetId": "string",
    "createdAt": "2026-08-07T12:00:00.000Z"
  }
]
```

## Erros

### HTTP 401

Missing, malformed, expired, invalid or logout-revoked Bearer token — AUTH_UNAUTHORIZED

**Body típico:**

```json
{
  "error": "string",
  "code": "RESOURCE_NOT_FOUND",
  "contextInfo": {}
}
```

**O que o front deve fazer:** limpar sessão se o access expirou; tentar `POST /auth/refresh`; se falhar, ir para login. **Não** spoofar `x-user-id`.

