# Casos — POST /orders

| Caso | Status | Notas |
|------|--------|-------|
| Sucesso | 201 | Order criada |
| Sem token | 401 | Login |
| Compra próprio anúncio | 403 | |
| Listing inexistente | 404 | |
| Já reservado / indisponível | 409 | `LISTING_ALREADY_RESERVED` / `LISTING_NOT_AVAILABLE_FOR_PURCHASE` |
| shippingMode inválido | 400 | |
