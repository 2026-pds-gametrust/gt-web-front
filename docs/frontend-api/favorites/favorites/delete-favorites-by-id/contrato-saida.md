# Contrato de saída — Delete a favorite by id

**HTTP 204** — Deleted

_Sem body (204 No Content)._

## Erros documentados

- **401** — Missing, malformed, expired, invalid or logout-revoked Bearer token — AUTH_UNAUTHORIZED
- **403** — Actor is not the favorite owner and not backoffice/admin
- **404** — Not found
