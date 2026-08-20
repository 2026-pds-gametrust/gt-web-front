# Exemplos de uso — Create taxonomy service

## Quando chamar no frontend

Taxonomia de serviços do marketplace — labels e filtros consistentes.

## Autorização

Bearer + group `backoffice` ou `admin` (`authorizeByGroup`).

## Sequência típica

1. Montar URL `/services` com path/query de [parametros.md](./parametros.md).
2. Validar o payload contra [contrato-entrada.md](./contrato-entrada.md) antes do submit.
3. Tratar HTTP `201` com [contrato-saida.md](./contrato-saida.md) e [casos.md](./casos.md).
4. Mapear erros para toast/empty-state — **não inventar estado de confiança** em falha.

## Fetch (TypeScript)

```ts
const res = await fetch('http://localhost:3000/services', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
  "id": "string",
  "slug": "string",
  "name": "string",
  "synonyms": [
    "string"
  ],
  "status": "ACTIVE"
}),
});
if (!res.ok) throw await res.json();
const data = await res.json();
```

## cURL

Ver [curl.sh](./curl.sh).
