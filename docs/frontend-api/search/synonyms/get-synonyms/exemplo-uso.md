# Exemplos de uso — List synonym projections for expansion

## Quando chamar no frontend

Expansão de termos (ex.: PS5 ↔ PlayStation 5) — menos zero-result.

## Autorização

Público — sem Authorization. Discovery (Lucas) e auth register/login/refresh.

## Sequência típica

1. Montar URL `/synonyms` com path/query de [parametros.md](./parametros.md).
2. Não enviar body (apenas headers/params).
3. Tratar HTTP `200` com [contrato-saida.md](./contrato-saida.md) e [casos.md](./casos.md).
4. Mapear erros para toast/empty-state — **não inventar estado de confiança** em falha.

## Fetch (TypeScript)

```ts
const res = await fetch('http://localhost:3000/synonyms', {
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
