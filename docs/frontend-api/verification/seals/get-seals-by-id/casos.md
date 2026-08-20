# Casos de sucesso e erro — Get seal by id

## Sucesso (200)

Found

**Body típico:**

```json
{
  "id": "string",
  "listingId": "string",
  "caseId": "string",
  "type": "POSSESSION",
  "status": "GRANTED",
  "grantedAt": "2026-08-07T12:00:00.000Z",
  "expiresAt": "2026-08-07T12:00:00.000Z",
  "createdAt": "2026-08-07T12:00:00.000Z",
  "updatedAt": "2026-08-07T12:00:00.000Z"
}
```

## Erros

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

