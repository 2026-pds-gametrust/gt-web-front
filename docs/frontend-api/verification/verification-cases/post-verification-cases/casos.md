# Casos de sucesso e erro — Open verification case for listing

## Sucesso (201)

Created

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

### HTTP 404

Listing not found

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

Open case already exists

**Body típico:**

```json
{
  "error": "string",
  "code": "RESOURCE_NOT_FOUND",
  "contextInfo": {}
}
```

**O que o front deve fazer:** conflito (ex.: email já existe no POST /users ADMIN). Mostrar o `code` do catálogo.

