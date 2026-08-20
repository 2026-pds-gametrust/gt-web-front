# Casos de sucesso e erro — List trust events by sellerId

## Sucesso (200)

Event ledger

**Body típico:**

```json
[
  {
    "id": "string",
    "sellerId": "string",
    "type": "USER_VERIFIED",
    "sourceEventId": "string",
    "payload": {},
    "occurredAt": "2026-08-07T12:00:00.000Z",
    "createdAt": "2026-08-07T12:00:00.000Z"
  }
]
```

## Erros

_Nenhum erro HTTP documentado neste path (além de falha de rede)._
