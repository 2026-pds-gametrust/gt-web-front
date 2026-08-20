# Rebuild search_documents for PUBLISHED listings and synonym projections from taxonomy

| | |
|--|--|
| **Domínio** | `search` |
| **Tag OpenAPI** | Search |
| **Método** | `POST` |
| **Path** | `/search/reconcile` |
| **Status sucesso** | `200` |
| **Autorização** | Bearer + group `backoffice` ou `admin` (`authorizeByGroup`). |

## O que este endpoint faz

Backoffice-only reconciliation of search read models (DEC-033)

## Ganho no produto

Reindexação do read model — consistência operacional.

## Como se relaciona

- `GET /listings/{id}` — detalhe da oferta
- `GET /categories` — filtros
- Só listings PUBLISHED entram no índice

Fluxo completo: [00-fluxo-conta-ate-anuncio.md](../../../00-fluxo-conta-ate-anuncio.md)

## Arquivos deste contrato

- [curl.sh](./curl.sh)
- [contrato-entrada.md](./contrato-entrada.md)
- [contrato-saida.md](./contrato-saida.md)
- [parametros.md](./parametros.md)
- [casos.md](./casos.md) — sucesso e erro
- [exemplo-uso.md](./exemplo-uso.md)
