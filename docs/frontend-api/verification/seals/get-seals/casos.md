# Casos de sucesso e erro — List seals by listingId

## Sucesso (200)

Seal list

**Body típico:**

```json
[
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
]
```

## Erros

_Nenhum erro HTTP documentado neste path (além de falha de rede)._
