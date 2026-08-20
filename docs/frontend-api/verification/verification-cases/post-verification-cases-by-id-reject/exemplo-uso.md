# Exemplos de uso — Reject verification case (backoffice)

## Quando chamar no frontend

Rejeita com motivo — feedback acionável ao vendedor.

## Autorização

Bearer + group `backoffice` ou `admin` (`authorizeByGroup`).

## Sequência típica

1. Montar URL `/verification-cases/{id}/reject` com path/query de [parametros.md](./parametros.md).
2. Validar o payload contra [contrato-entrada.md](./contrato-entrada.md) antes do submit.
3. Tratar HTTP `200` com [contrato-saida.md](./contrato-saida.md) e [casos.md](./casos.md).
4. Mapear erros para toast/empty-state — **não inventar estado de confiança** em falha.

## Fetch (TypeScript)

```ts
const res = await fetch('http://localhost:3000/verification-cases/550e8400-e29b-41d4-a716-446655440000/reject', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
  "reason": "string"
}),
});
if (!res.ok) throw await res.json();
const data = await res.json();
```

## cURL

Ver [curl.sh](./curl.sh).
