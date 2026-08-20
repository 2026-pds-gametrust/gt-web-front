# Update a user

| | |
|--|--|
| **Domínio** | `identity` |
| **Tag OpenAPI** | Users |
| **Método** | `PUT` |
| **Path** | `/users/{id}` |
| **Status sucesso** | `200` |
| **Autorização** | Bearer + dono do recurso **ou** `admin` (BACKOFFICE não basta em PII de User). |

## O que este endpoint faz

Update the information of an existing user by ID.

## Ganho no produto

PII: GET/PUT/DELETE só dono ou ADMIN. PUT do dono não grava verified/status.

## Como se relaciona

- `POST /auth/register` — cadastro público (não use POST /users)
- `GET /auth/me` — User da sessão
- `PUT /users/{id}/groups` — papéis (ADMIN)

Fluxo completo: [00-fluxo-conta-ate-anuncio.md](../../../00-fluxo-conta-ate-anuncio.md)

## Arquivos deste contrato

- [curl.sh](./curl.sh)
- [contrato-entrada.md](./contrato-entrada.md)
- [contrato-saida.md](./contrato-saida.md)
- [parametros.md](./parametros.md)
- [casos.md](./casos.md) — sucesso e erro
- [exemplo-uso.md](./exemplo-uso.md)
