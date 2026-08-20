# Create product

| | |
|--|--|
| **Domínio** | `catalog` |
| **Tag OpenAPI** | Catalog |
| **Método** | `POST` |
| **Path** | `/products` |
| **Status sucesso** | `201` |
| **Autorização** | Bearer + group `backoffice` ou `admin` (`authorizeByGroup`). |

## O que este endpoint faz

Modelo de produto (catálogo), não a oferta unitária — base de busca e comparação.

## Ganho no produto

Modelo de produto (catálogo), não a oferta unitária — base de busca e comparação.

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
