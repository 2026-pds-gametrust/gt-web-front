# Contrato de saída — Create a presigned image upload grant

**HTTP 201** — Upload grant created

**Schema OpenAPI:** `MediaUploadGrant`

**Exemplo:**

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

## Erros documentados

- **400** — Invalid type or size
- **403** — Actor is not allowed for this purpose or owner
- **404** — Evidence case not found
