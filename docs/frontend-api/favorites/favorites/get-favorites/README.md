# List favorites for the authenticated actor

| | |
|--|--|
| **Domínio** | `favorites` |
| **Tag OpenAPI** | Favorites |
| **Método** | `GET` |
| **Path** | `/favorites` |
| **Status sucesso** | `200` |
| **Autorização** | Bearer obrigatório (`Authorization: Bearer <accessToken>`). Qualquer group válido (APP_USER+). |

## O que este endpoint faz

Lista salva do usuário — “quero depois”.

## Ganho no produto

Lista salva do usuário — “quero depois”.

## Como se relaciona

- Bearer: userId vem do token, não do body
- `GET /listings/{id}` — destino do favorito

Fluxo completo: [00-fluxo-conta-ate-anuncio.md](../../../00-fluxo-conta-ate-anuncio.md)

## Arquivos deste contrato

- [curl.sh](./curl.sh)
- [contrato-entrada.md](./contrato-entrada.md)
- [contrato-saida.md](./contrato-saida.md)
- [parametros.md](./parametros.md)
- [casos.md](./casos.md) — sucesso e erro
- [exemplo-uso.md](./exemplo-uso.md)
