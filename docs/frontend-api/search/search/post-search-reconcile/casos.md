# Casos de sucesso e erro — Rebuild search_documents for PUBLISHED listings and synonym projections from taxonomy

## Sucesso (200)

Reconciliation counts

**Body típico:**

```json
{
  "listingsReindexed": 0,
  "synonymsUpserted": 0
}
```

## Erros

### HTTP 401

Unauthorized

**Body típico:**

```json
{
  "error": "Não autorizado.",
  "code": "AUTH_UNAUTHORIZED"
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

