# Casos de sucesso e erro — List evidence metadata for a case

## Sucesso (200)

Evidence list

**Body típico:**

```json
[
  {
    "id": "string",
    "caseId": "string",
    "type": "PHOTO",
    "storageKey": "string",
    "assetId": "string",
    "contentHash": "string",
    "createdAt": "2026-08-07T12:00:00.000Z"
  }
]
```

## Erros

### HTTP 404

Case not found

**Body típico:**

```json
{
  "error": "string",
  "code": "RESOURCE_NOT_FOUND",
  "contextInfo": {}
}
```

**O que o front deve fazer:** empty-state / 404 de página. Não inventar recurso.

