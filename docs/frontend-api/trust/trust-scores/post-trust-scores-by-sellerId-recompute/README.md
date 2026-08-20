# Recompute trust score from ledger

| | |
|--|--|
| **Domínio** | `trust` |
| **Tag OpenAPI** | Trust |
| **Método** | `POST` |
| **Path** | `/trust-scores/{sellerId}/recompute` |
| **Status sucesso** | `200` |
| **Autorização** | Bearer + group `backoffice` ou `admin` (`authorizeByGroup`). |

## O que este endpoint faz

Recálculo operacional do score após eventos.

## Ganho no produto

Recálculo operacional do score após eventos.

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
