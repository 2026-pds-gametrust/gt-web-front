# Casos de sucesso e erro — Get media asset metadata

## Sucesso (200)

Asset metadata (evidence never includes public URLs)

**Body típico:**

```json
{
  "id": "string",
  "purpose": "PRODUCT",
  "ownerId": "string",
  "status": "PENDING_UPLOAD",
  "contentType": "string",
  "byteSize": 0,
  "variants": [
    {
      "size": "THUMBNAIL",
      "format": "WEBP",
      "width": 0,
      "height": 0,
      "byteSize": 0,
      "publicUrl": "string"
    }
  ],
  "createdAt": "2026-08-07T12:00:00.000Z",
  "updatedAt": "2026-08-07T12:00:00.000Z"
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

