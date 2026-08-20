# Casos de sucesso e erro — List profiles

## Sucesso (200)

Profile list

**Body típico:**

```json
[
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
    ],
    "createdAt": "2026-08-07T12:00:00.000Z",
    "updatedAt": "2026-08-07T12:00:00.000Z"
  }
]
```

## Erros

### HTTP 403

Caller is not in an allowed user group

**Body típico:**

```json
{
  "error": "Access denied"
}
```

**O que o front deve fazer:** usuário autenticado sem permissão — mensagem de acesso negado, sem fingir que a ação ocorreu.

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

