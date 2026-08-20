# Lexical search over published listing documents

| | |
|--|--|
| **Domínio** | `search` |
| **Tag OpenAPI** | Search |
| **Método** | `GET` |
| **Path** | `/search` |
| **Status sucesso** | `200` |
| **Autorização** | Público — sem Authorization. Discovery (Lucas) e auth register/login/refresh. |

## O que este endpoint faz

Busca principal de ofertas com query e filtros.

## Ganho no produto

Busca principal de ofertas com query e filtros.

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
