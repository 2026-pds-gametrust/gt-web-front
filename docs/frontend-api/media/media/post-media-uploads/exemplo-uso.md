# Exemplos de uso — Create a presigned image upload grant

## Quando chamar no frontend

Grant de upload (URL temporária) — não inventar mídia no front.

## Autorização

Público — sem Authorization. Discovery (Lucas) e auth register/login/refresh.

## Sequência típica

1. Montar URL `/media/uploads` com path/query de [parametros.md](./parametros.md).
2. Validar o payload contra [contrato-entrada.md](./contrato-entrada.md) antes do submit.
3. Tratar HTTP `201` com [contrato-saida.md](./contrato-saida.md) e [casos.md](./casos.md).
4. Mapear erros para toast/empty-state — **não inventar estado de confiança** em falha.

## Fetch (TypeScript)

```ts
const res = await fetch('http://localhost:3000/media/uploads', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
  "id": "string",
  "purpose": "PRODUCT",
  "ownerId": "string",
  "contentType": "image/jpeg",
  "byteSize": 1
}),
});
if (!res.ok) throw await res.json();
const data = await res.json();
```

## cURL

Ver [curl.sh](./curl.sh).
