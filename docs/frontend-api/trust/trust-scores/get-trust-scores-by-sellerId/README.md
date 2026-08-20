# Get trust score for seller (default 0)

| | |
|--|--|
| **Domínio** | `trust` |
| **Tag OpenAPI** | Trust |
| **Método** | `GET` |
| **Path** | `/trust-scores/{sellerId}` |
| **Status sucesso** | `200` |
| **Autorização** | Público — sem Authorization. Discovery (Lucas) e auth register/login/refresh. |

## O que este endpoint faz

Score do vendedor na página do anúncio e perfil.

## Ganho no produto

Score do vendedor na página do anúncio e perfil.

## Como se relaciona

- `GET /listings/{id}` — PDP mostra score do `sellerId`
- `GET /seals` — selo da oferta, não do score
- Nunca reduzir TrustScore a cor sem motivo da API

Fluxo completo: [00-fluxo-conta-ate-anuncio.md](../../../00-fluxo-conta-ate-anuncio.md)

## Arquivos deste contrato

- [curl.sh](./curl.sh)
- [contrato-entrada.md](./contrato-entrada.md)
- [contrato-saida.md](./contrato-saida.md)
- [parametros.md](./parametros.md)
- [casos.md](./casos.md) — sucesso e erro
- [exemplo-uso.md](./exemplo-uso.md)
