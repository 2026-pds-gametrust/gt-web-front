# Exemplos de uso — Get seal by id

## Quando chamar no frontend

Detalhe/explicação do selo na UI.

## Autorização

Público — sem Authorization. Discovery (Lucas) e auth register/login/refresh.

## Sequência típica

1. Montar URL `/seals/{id}` com path/query de [parametros.md](./parametros.md).
2. Não enviar body (apenas headers/params).
3. Tratar HTTP `200` com [contrato-saida.md](./contrato-saida.md) e [casos.md](./casos.md).
4. Mapear erros para toast/empty-state — **não inventar estado de confiança** em falha.

## Fetch (TypeScript)

```ts
const res = await fetch('http://localhost:3000/seals/550e8400-e29b-41d4-a716-446655440000', {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
});
if (!res.ok) throw await res.json();
const data = await res.json();
```

## cURL

Ver [curl.sh](./curl.sh).
