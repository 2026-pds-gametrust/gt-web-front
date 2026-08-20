# Schema: NewProfile

**Schema OpenAPI:** `NewProfile`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|----------|
| `id` | string | sim |  |
| `userId` | string | sim |  |
| `displayName` | string | não |  |
| `bio` | string | não |  |
| `locationApprox` | string | não |  |
| `addresses` | array<Address> | não |  |
| `defaultShippingAddressId` | string | não |  |
| `setupItems` | array<object> | não |  |

**Exemplo:**

```json
{
  "id": "string",
  "userId": "string",
  "displayName": "string",
  "bio": "string",
  "locationApprox": "string",
  "addresses": [
    {
      "id": "string",
      "label": "string",
      "recipientName": "string",
      "postalCode": "string",
      "street": "string",
      "number": "string",
      "complement": "string",
      "district": "string",
      "city": "string",
      "state": "string",
      "country": "BR",
      "isBilling": false,
      "isShipping": false
    }
  ],
  "defaultShippingAddressId": "string",
  "setupItems": [
    {}
  ]
}
```
