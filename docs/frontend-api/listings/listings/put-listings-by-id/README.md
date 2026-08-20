# Update listing

| | |
|--|--|
| **Domínio** | `listings` |
| **Tag OpenAPI** | Listings |
| **Método** | `PUT` |
| **Path** | `/listings/{id}` |
| **Status sucesso** | `200` |
| **Autorização** | Bearer obrigatório (`Authorization: Bearer <accessToken>`). Qualquer group válido (APP_USER+). |

## O que este endpoint faz

Página do anúncio: preço, condição, selos e confiança do vendedor.

## Ganho no produto

Página do anúncio: preço, condição, selos e confiança do vendedor.

## Como se relaciona

- `GET /products/{id}` — modelo (produto ≠ oferta)
- `POST /listings` → `POST .../submit` → verificação → `POST .../publish`
- `GET /seals?listingId=` — selo só se GRANTED
- `GET /trust-scores/{sellerId}` — motivos, não só cor

Fluxo completo: [00-fluxo-conta-ate-anuncio.md](../../../00-fluxo-conta-ate-anuncio.md)

## Arquivos deste contrato

- [curl.sh](./curl.sh)
- [contrato-entrada.md](./contrato-entrada.md)
- [contrato-saida.md](./contrato-saida.md)
- [parametros.md](./parametros.md)
- [casos.md](./casos.md) — sucesso e erro
- [exemplo-uso.md](./exemplo-uso.md)
