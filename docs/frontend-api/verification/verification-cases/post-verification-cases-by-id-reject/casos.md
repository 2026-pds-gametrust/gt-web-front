# Casos de sucesso e erro — Reject verification case (backoffice)

## Sucesso (200)

Rejected

**Body típico:**

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

## Erros

### HTTP 400

Reason required

**Body típico:**

```json
{
  "error": "string",
  "code": "RESOURCE_NOT_FOUND",
  "contextInfo": {}
}
```

**O que o front deve fazer:** validação / `USER_UNDERAGE` / `FIELD_INVALID` (register duplicado também é 400). Destacar campos; **não** tratar 400 de register como “email já existe” na copy.

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

Forbidden

**Body típico:**

```json
{
  "error": "Access denied"
}
```

**O que o front deve fazer:** usuário autenticado sem permissão — mensagem de acesso negado, sem fingir que a ação ocorreu.

### HTTP 409

Invalid transition

**Body típico:**

```json
{
  "error": "string",
  "code": "RESOURCE_NOT_FOUND",
  "contextInfo": {}
}
```

**O que o front deve fazer:** conflito (ex.: email já existe no POST /users ADMIN). Mostrar o `code` do catálogo.

