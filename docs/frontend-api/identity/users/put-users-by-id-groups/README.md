# Assign user groups (ADMIN only)

| | |
|--|--|
| **Domínio** | `identity` |
| **Tag OpenAPI** | Users |
| **Método** | `PUT` |
| **Path** | `/users/{id}/groups` |
| **Status sucesso** | `200` |
| **Autorização** | Bearer + group `admin` apenas. |

## O que este endpoint faz

ADMIN atribui papéis (app-user, backoffice, admin). Sem auto-escalada nem SYSTEM.

## Ganho no produto

ADMIN atribui papéis (app-user, backoffice, admin). Sem auto-escalada nem SYSTEM.

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
