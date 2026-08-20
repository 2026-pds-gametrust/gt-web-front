# Get verification case by id

| | |
|--|--|
| **Domínio** | `verification` |
| **Tag OpenAPI** | Verification |
| **Método** | `GET` |
| **Path** | `/verification-cases/{id}` |
| **Status sucesso** | `200` |
| **Autorização** | Público — sem Authorization. Discovery (Lucas) e auth register/login/refresh. |

## O que este endpoint faz

Detalhe do caso e evidências.

## Ganho no produto

Detalhe do caso e evidências.

## Como se relaciona

- `POST /listings/{id}/submit` abre o caso
- `POST .../approve` habilita publish
- UI: nunca mostrar selo sem `GRANTED`

Fluxo completo: [00-fluxo-conta-ate-anuncio.md](../../../00-fluxo-conta-ate-anuncio.md)

## Arquivos deste contrato

- [curl.sh](./curl.sh)
- [contrato-entrada.md](./contrato-entrada.md)
- [contrato-saida.md](./contrato-saida.md)
- [parametros.md](./parametros.md)
- [casos.md](./casos.md) — sucesso e erro
- [exemplo-uso.md](./exemplo-uso.md)
