# Casos de sucesso e erro — Delete a favorite by id

## Sucesso (204)

Deleted

Resposta sem corpo. Tratar `res.status === 204`.

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

Actor is not the favorite owner and not backoffice/admin

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

Not found

**Body típico:**

```json
{
  "error": "string",
  "code": "RESOURCE_NOT_FOUND",
  "contextInfo": {}
}
```

**O que o front deve fazer:** empty-state / 404 de página. Não inventar recurso.

