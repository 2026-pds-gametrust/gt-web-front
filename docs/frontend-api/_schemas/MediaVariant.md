# Schema: MediaVariant

**Schema OpenAPI:** `MediaVariant`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|----------|
| `size` | enum(THUMBNAIL \| CARD \| FULL) | sim |  |
| `format` | enum(WEBP \| JPEG) | sim |  |
| `width` | integer | sim |  |
| `height` | integer | sim |  |
| `byteSize` | integer | sim |  |
| `publicUrl` | string | não |  |

**Exemplo:**

```json
{
  "size": "THUMBNAIL",
  "format": "WEBP",
  "width": 0,
  "height": 0,
  "byteSize": 0,
  "publicUrl": "string"
}
```
