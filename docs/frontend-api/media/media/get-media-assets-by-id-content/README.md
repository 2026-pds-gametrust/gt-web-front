# Get a short-lived content grant

| | |
|--|--|
| **Domínio** | `media` |
| **Tag OpenAPI** | Media |
| **Método** | `GET` |
| **Path** | `/media/assets/{id}/content` |
| **Status sucesso** | `200` |
| **Autorização** | Público — sem Authorization. Discovery (Lucas) e auth register/login/refresh. |

## O que este endpoint faz

Grant de leitura do conteúdo.

## Ganho no produto

Grant de leitura do conteúdo.

## Como se relaciona

- Usar `id` do asset em `Listing.media` / evidência
- Só exibir quando status `READY`

Fluxo completo: [00-fluxo-conta-ate-anuncio.md](../../../00-fluxo-conta-ate-anuncio.md)

## Arquivos deste contrato

- [curl.sh](./curl.sh)
- [contrato-entrada.md](./contrato-entrada.md)
- [contrato-saida.md](./contrato-saida.md)
- [parametros.md](./parametros.md)
- [casos.md](./casos.md) — sucesso e erro
- [exemplo-uso.md](./exemplo-uso.md)
