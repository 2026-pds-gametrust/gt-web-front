# Schema: NewMediaUpload

**Schema OpenAPI:** `NewMediaUpload`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|----------|
| `id` | string | não |  |
| `purpose` | enum(PRODUCT \| LISTING \| EVIDENCE) | sim |  |
| `ownerId` | string | sim |  |
| `contentType` | enum(image/jpeg \| image/png \| image/webp) | sim |  |
| `byteSize` | integer | sim |  |

**Exemplo:**

```json
{
  "id": "string",
  "purpose": "PRODUCT",
  "ownerId": "string",
  "contentType": "image/jpeg",
  "byteSize": 1
}
```
