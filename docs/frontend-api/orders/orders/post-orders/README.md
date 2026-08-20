# Create a buy-now order

| | |
|--|--|
| **Domínio** | `orders` |
| **Tag OpenAPI** | Orders |
| **Método** | `POST` |
| **Path** | `/orders` |
| **Status sucesso** | `201` |
| **Autorização** | Bearer obrigatório |

## O que este endpoint faz

Cria um pedido Comprar agora para um anúncio `PUBLISHED` com `buyNowEnabled`, reserva a unidade e dispara escrow simulado.

## Arquivos deste contrato

- [curl.sh](./curl.sh)
- [contrato-entrada.md](./contrato-entrada.md)
- [contrato-saida.md](./contrato-saida.md)
- [parametros.md](./parametros.md)
- [casos.md](./casos.md)
- [exemplo-uso.md](./exemplo-uso.md)
