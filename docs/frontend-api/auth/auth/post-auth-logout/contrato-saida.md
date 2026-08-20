# Contrato de saída — Revoke this session's refresh token and invalidate its access token

**HTTP 204** — Logged out

_Sem body (204 No Content)._

## Erros documentados

- **401** — Missing, malformed, expired, invalid or logout-revoked Bearer token — AUTH_UNAUTHORIZED
- **500** — Server error
