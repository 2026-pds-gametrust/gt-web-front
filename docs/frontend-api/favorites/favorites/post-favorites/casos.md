# Casos de sucesso e erro — Create a favorite

## Sucesso (201)

Created

**Body típico:**

```json
{
  "id": "string",
  "userId": "string",
  "targetType": "PRODUCT",
  "targetId": "string",
  "createdAt": "2026-08-07T12:00:00.000Z"
}
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

### HTTP 403

Missing actor context

**Body típico:**

```json
{
  "error": "string",
  "code": "RESOURCE_NOT_FOUND",
  "contextInfo": {}
}
```

**O que o front deve fazer:** usuário autenticado sem permissão — mensagem de acesso negado, sem fingir que a ação ocorreu.

### HTTP 404

User or target not found

**Body típico:**

```json
{
  "error": "string",
  "code": "RESOURCE_NOT_FOUND",
  "contextInfo": {}
}
```

**O que o front deve fazer:** empty-state / 404 de página. Não inventar recurso.

### HTTP 409

Duplicate favorite

**Body típico:**

```json
{
  "error": "string",
  "code": "RESOURCE_NOT_FOUND",
  "contextInfo": {}
}
```

**O que o front deve fazer:** conflito (ex.: email já existe no POST /users ADMIN). Mostrar o `code` do catálogo.

