# List profiles

| | |
|--|--|
| **Domínio** | `identity` |
| **Tag OpenAPI** | Profiles |
| **Método** | `GET` |
| **Path** | `/profiles` |
| **Status sucesso** | `200` |
| **Autorização** | Bearer + group `backoffice` ou `admin` (`authorizeByGroup`). |

## O que este endpoint faz

Perfil e endereços — apresentação do vendedor/entrega.

## Ganho no produto

Perfil e endereços — apresentação do vendedor/entrega.

## Como se relaciona

- `POST /auth/register` — conta antes do perfil
- `GET /profiles/by-user/{userId}` — seller page
- `POST /listings` — vender exige perfil/conta

Fluxo completo: [00-fluxo-conta-ate-anuncio.md](../../../00-fluxo-conta-ate-anuncio.md)

## Arquivos deste contrato

- [curl.sh](./curl.sh)
- [contrato-entrada.md](./contrato-entrada.md)
- [contrato-saida.md](./contrato-saida.md)
- [parametros.md](./parametros.md)
- [casos.md](./casos.md) — sucesso e erro
- [exemplo-uso.md](./exemplo-uso.md)
