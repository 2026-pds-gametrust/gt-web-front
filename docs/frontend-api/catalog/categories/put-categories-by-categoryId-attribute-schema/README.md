# Upsert category attribute schema

| | |
|--|--|
| **Domínio** | `catalog` |
| **Tag OpenAPI** | Catalog |
| **Método** | `PUT` |
| **Path** | `/categories/{categoryId}/attribute-schema` |
| **Status sucesso** | `200` |
| **Autorização** | Bearer + group `backoffice` ou `admin` (`authorizeByGroup`). |

## O que este endpoint faz

Atributos dinâmicos do formulário de anúncio por categoria — o front não inventa campos.

## Ganho no produto

Atributos dinâmicos do formulário de anúncio por categoria — o front não inventa campos.

## Como se relaciona

- `GET /categories/{categoryId}/attribute-schema` — formulário de anúncio
- `POST /listings` usa `productId` (oferta ≠ produto)
- `GET /search` — discovery pública

Fluxo completo: [00-fluxo-conta-ate-anuncio.md](../../../00-fluxo-conta-ate-anuncio.md)

## Arquivos deste contrato

- [curl.sh](./curl.sh)
- [contrato-entrada.md](./contrato-entrada.md)
- [contrato-saida.md](./contrato-saida.md)
- [parametros.md](./parametros.md)
- [casos.md](./casos.md) — sucesso e erro
- [exemplo-uso.md](./exemplo-uso.md)
