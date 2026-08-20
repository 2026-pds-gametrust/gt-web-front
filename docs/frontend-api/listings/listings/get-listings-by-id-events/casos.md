# Casos de sucesso e erro — List listing status events

## Sucesso (200)

Event ledger

**Body típico:**

```json
[
  {
    "id": "string",
    "listingId": "string",
    "fromStatus": "DRAFT",
    "toStatus": "DRAFT",
    "reason": "string",
    "actorId": "string",
    "occurredAt": "2026-08-07T12:00:00.000Z"
  }
]
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

### HTTP 500

Server error

**Body típico:**

```json
{
  "message": "User not found",
  "status": 404,
  "timestamp": "2025-07-15T17:30:00.000Z",
  "path": "/users/123"
}
```

**O que o front deve fazer:** erro genérico; não vazar detalhes internos.

