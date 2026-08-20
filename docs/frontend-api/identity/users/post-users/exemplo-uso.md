# Exemplos de uso — Create a new user

## Quando chamar no frontend

ADMIN cria User sem credencial (não é cadastro público). Lista BACKOFFICE/ADMIN.

## Autorização

Bearer + group `admin` apenas.

## Sequência típica

1. Montar URL `/users` com path/query de [parametros.md](./parametros.md).
2. Validar o payload contra [contrato-entrada.md](./contrato-entrada.md) antes do submit.
3. Tratar HTTP `201` com [contrato-saida.md](./contrato-saida.md) e [casos.md](./casos.md).
4. Mapear erros para toast/empty-state — **não inventar estado de confiança** em falha.

## Fetch (TypeScript)

```ts
const res = await fetch('http://localhost:3000/users', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
  "id": "string",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "cpf": "string",
  "birthDate": "string",
  "verified": false,
  "phoneVerified": false,
  "status": "ACTIVE"
}),
});
if (!res.ok) throw await res.json();
const data = await res.json();
```

## cURL

Ver [curl.sh](./curl.sh).
