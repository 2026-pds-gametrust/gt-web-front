# Casos de sucesso e erro — Create a presigned image upload grant

## Sucesso (201)

Upload grant created

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
  "updatedAt": "2026-08-07T12:00:00.000Z",
  "upload": {
    "url": "string",
    "headers": {},
    "expiresAt": "2026-08-07T12:00:00.000Z"
  }
}
```

## Erros

### HTTP 400

Invalid type or size

**Body típico:**

```json
{
  "error": "string",
  "code": "RESOURCE_NOT_FOUND",
  "contextInfo": {}
}
```

**O que o front deve fazer:** validação / `USER_UNDERAGE` / `FIELD_INVALID` (register duplicado também é 400). Destacar campos; **não** tratar 400 de register como “email já existe” na copy.

### HTTP 403

Actor is not allowed for this purpose or owner

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

Evidence case not found

**Body típico:**

```json
{
  "error": "string",
  "code": "RESOURCE_NOT_FOUND",
  "contextInfo": {}
}
```

**O que o front deve fazer:** empty-state / 404 de página. Não inventar recurso.

