# Exemplos de uso — Get a short-lived content grant

## Quando chamar no frontend

Grant de leitura do conteúdo.

## Autorização

Público — sem Authorization. Discovery (Lucas) e auth register/login/refresh.

## Sequência típica

1. Montar URL `/media/assets/{id}/content` com path/query de [parametros.md](./parametros.md).
2. Não enviar body (apenas headers/params).
3. Tratar HTTP `200` com [contrato-saida.md](./contrato-saida.md) e [casos.md](./casos.md).
4. Mapear erros para toast/empty-state — **não inventar estado de confiança** em falha.

## Fetch (TypeScript)

```ts
const res = await fetch('http://localhost:3000/media/assets/550e8400-e29b-41d4-a716-446655440000/content', {
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
