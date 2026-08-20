# Casos de sucesso e erro — Get a short-lived content grant

## Sucesso (200)

Presigned GET

**Body típico:**

```json
{
  "url": "string",
  "expiresAt": "2026-08-07T12:00:00.000Z"
}
```

## Erros

### HTTP 403

Forbidden

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

Asset not found

**Body típico:**

```json
{
  "error": "string",
  "code": "RESOURCE_NOT_FOUND",
  "contextInfo": {}
}
```

**O que o front deve fazer:** empty-state / 404 de página. Não inventar recurso.

