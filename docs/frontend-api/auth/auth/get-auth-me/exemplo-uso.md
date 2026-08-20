# Exemplos de uso — Return the authenticated public User

## Quando chamar no frontend

Hidrata a sessão no app: User público do token (sem senha).

## Autorização

Bearer obrigatório (`Authorization: Bearer <accessToken>`). Qualquer group válido (APP_USER+).

## Sequência típica

1. Montar URL `/auth/me` com path/query de [parametros.md](./parametros.md).
2. Não enviar body (apenas headers/params).
3. Tratar HTTP `200` com [contrato-saida.md](./contrato-saida.md) e [casos.md](./casos.md).
4. Mapear erros para toast/empty-state — **não inventar estado de confiança** em falha.

## Fetch (TypeScript)

```ts
const res = await fetch('http://localhost:3000/auth/me', {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`,
  },
});
if (!res.ok) throw await res.json();
const data = await res.json();
```

## cURL

Ver [curl.sh](./curl.sh).
