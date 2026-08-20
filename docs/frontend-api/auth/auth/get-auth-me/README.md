# Return the authenticated public User

| | |
|--|--|
| **Domínio** | `auth` |
| **Tag OpenAPI** | Auth |
| **Método** | `GET` |
| **Path** | `/auth/me` |
| **Status sucesso** | `200` |
| **Autorização** | Bearer obrigatório (`Authorization: Bearer <accessToken>`). Qualquer group válido (APP_USER+). |

## O que este endpoint faz

Hidrata a sessão no app: User público do token (sem senha).

## Ganho no produto

Hidrata a sessão no app: User público do token (sem senha).

## Como se relaciona

- `POST /auth/register` → sessão inicial
- `POST /auth/login` → sessão existente
- `POST /auth/refresh` → renovar access
- `POST /auth/logout` → encerrar sessão
- `GET /auth/me` → hidratar User
- `POST /profiles` → perfil após conta
- `POST /listings` → vender (Bearer)

Fluxo completo: [00-fluxo-conta-ate-anuncio.md](../../../00-fluxo-conta-ate-anuncio.md)

## Arquivos deste contrato

- [curl.sh](./curl.sh)
- [contrato-entrada.md](./contrato-entrada.md)
- [contrato-saida.md](./contrato-saida.md)
- [parametros.md](./parametros.md)
- [casos.md](./casos.md) — sucesso e erro
- [exemplo-uso.md](./exemplo-uso.md)
