# Frontend API — contratos por domínio

Base gerada a partir de `src/contracts/service.yaml` para consumo pelo frontend.

| | |
|--|--|
| **Fonte** | [`src/contracts/service.yaml`](../../../gt-backend/src/contracts/service.yaml) |
| **Base URL local** | `http://localhost:3000` |
| **Endpoints documentados** | **66** |
| **Schemas** | **57** — [_schemas/](./_schemas/) |
| **Gerado em** | 2026-08-13 |

## Comece por aqui (jornada)

1. [Fluxo da conta até o anúncio publicado](./00-fluxo-conta-ate-anuncio.md)
2. [Como os endpoints se relacionam](./01-relacionamento-endpoints.md)
3. [Sessão, tokens e headers](./02-sessao-e-tokens.md)
4. [Estrutura das entidades](./03-entidades.md)
5. [Matriz de autorização](./04-matriz-autorizacao.md)

## Domínios

| Domínio | Endpoints | Pasta |
|---------|-----------|-------|
| **auth** | 5 | [auth/](./auth/) |
| **catalog** | 15 | [catalog/](./catalog/) |
| **favorites** | 3 | [favorites/](./favorites/) |
| **identity** | 12 | [identity/](./identity/) |
| **listings** | 8 | [listings/](./listings/) |
| **media** | 4 | [media/](./media/) |
| **search** | 3 | [search/](./search/) |
| **trust** | 5 | [trust/](./trust/) |
| **verification** | 11 | [verification/](./verification/) |

## Índice completo de endpoints

| Domínio | Método | Path | Resumo | Pasta |
|---------|--------|------|--------|-------|
| auth | `POST` | `/auth/login` | Log in with email and password | [auth/auth/post-auth-login](./auth/auth/post-auth-login/) |
| auth | `POST` | `/auth/logout` | Revoke this session's refresh token and invalidate its access token | [auth/auth/post-auth-logout](./auth/auth/post-auth-logout/) |
| auth | `GET` | `/auth/me` | Return the authenticated public User | [auth/auth/get-auth-me](./auth/auth/get-auth-me/) |
| auth | `POST` | `/auth/refresh` | Rotate a refresh token | [auth/auth/post-auth-refresh](./auth/auth/post-auth-refresh/) |
| auth | `POST` | `/auth/register` | Register a marketplace member and issue a session | [auth/auth/post-auth-register](./auth/auth/post-auth-register/) |
| catalog | `GET` | `/categories` | List categories | [catalog/categories/get-categories](./catalog/categories/get-categories/) |
| catalog | `POST` | `/categories` | Create category | [catalog/categories/post-categories](./catalog/categories/post-categories/) |
| catalog | `GET` | `/categories/{categoryId}/attribute-schema` | Get category attribute schema | [catalog/categories/get-categories-by-categoryId-attribute-schema](./catalog/categories/get-categories-by-categoryId-attribute-schema/) |
| catalog | `PUT` | `/categories/{categoryId}/attribute-schema` | Upsert category attribute schema | [catalog/categories/put-categories-by-categoryId-attribute-schema](./catalog/categories/put-categories-by-categoryId-attribute-schema/) |
| catalog | `GET` | `/categories/{id}` | Get category by id | [catalog/categories/get-categories-by-id](./catalog/categories/get-categories-by-id/) |
| catalog | `PUT` | `/categories/{id}` | Update category | [catalog/categories/put-categories-by-id](./catalog/categories/put-categories-by-id/) |
| catalog | `GET` | `/products` | List products | [catalog/products/get-products](./catalog/products/get-products/) |
| catalog | `POST` | `/products` | Create product | [catalog/products/post-products](./catalog/products/post-products/) |
| catalog | `GET` | `/products/{id}` | Get product by id | [catalog/products/get-products-by-id](./catalog/products/get-products-by-id/) |
| catalog | `PUT` | `/products/{id}` | Update product | [catalog/products/put-products-by-id](./catalog/products/put-products-by-id/) |
| catalog | `GET` | `/products/{productId}/price-history` | List price history for a product | [catalog/products/get-products-by-productId-price-history](./catalog/products/get-products-by-productId-price-history/) |
| catalog | `GET` | `/services` | List taxonomy services | [catalog/services/get-services](./catalog/services/get-services/) |
| catalog | `POST` | `/services` | Create taxonomy service | [catalog/services/post-services](./catalog/services/post-services/) |
| catalog | `GET` | `/services/{id}` | Get taxonomy service by id | [catalog/services/get-services-by-id](./catalog/services/get-services-by-id/) |
| catalog | `PUT` | `/services/{id}` | Update taxonomy service | [catalog/services/put-services-by-id](./catalog/services/put-services-by-id/) |
| favorites | `GET` | `/favorites` | List favorites for the authenticated actor | [favorites/favorites/get-favorites](./favorites/favorites/get-favorites/) |
| favorites | `POST` | `/favorites` | Create a favorite | [favorites/favorites/post-favorites](./favorites/favorites/post-favorites/) |
| favorites | `DELETE` | `/favorites/{id}` | Delete a favorite by id | [favorites/favorites/delete-favorites-by-id](./favorites/favorites/delete-favorites-by-id/) |
| identity | `GET` | `/profiles` | List profiles | [identity/profiles/get-profiles](./identity/profiles/get-profiles/) |
| identity | `POST` | `/profiles` | Create a profile | [identity/profiles/post-profiles](./identity/profiles/post-profiles/) |
| identity | `GET` | `/profiles/{id}` | Get profile by id | [identity/profiles/get-profiles-by-id](./identity/profiles/get-profiles-by-id/) |
| identity | `PUT` | `/profiles/{id}` | Update profile by id | [identity/profiles/put-profiles-by-id](./identity/profiles/put-profiles-by-id/) |
| identity | `GET` | `/profiles/by-user/{userId}` | Get profile by user id | [identity/profiles/get-profiles-by-user-by-userId](./identity/profiles/get-profiles-by-user-by-userId/) |
| identity | `GET` | `/users` | Get all users | [identity/users/get-users](./identity/users/get-users/) |
| identity | `POST` | `/users` | Create a new user | [identity/users/post-users](./identity/users/post-users/) |
| identity | `DELETE` | `/users/{id}` | Delete a user | [identity/users/delete-users-by-id](./identity/users/delete-users-by-id/) |
| identity | `GET` | `/users/{id}` | Get a user by ID | [identity/users/get-users-by-id](./identity/users/get-users-by-id/) |
| identity | `PUT` | `/users/{id}` | Update a user | [identity/users/put-users-by-id](./identity/users/put-users-by-id/) |
| identity | `PUT` | `/users/{id}/groups` | Assign user groups (ADMIN only) | [identity/users/put-users-by-id-groups](./identity/users/put-users-by-id-groups/) |
| identity | `POST` | `/users/{id}/verify` | Verify a user identity | [identity/users/post-users-by-id-verify](./identity/users/post-users-by-id-verify/) |
| listings | `GET` | `/listings` | List listings | [listings/listings/get-listings](./listings/listings/get-listings/) |
| listings | `POST` | `/listings` | Create listing draft | [listings/listings/post-listings](./listings/listings/post-listings/) |
| listings | `GET` | `/listings/{id}` | Get listing by id | [listings/listings/get-listings-by-id](./listings/listings/get-listings-by-id/) |
| listings | `PUT` | `/listings/{id}` | Update listing | [listings/listings/put-listings-by-id](./listings/listings/put-listings-by-id/) |
| listings | `GET` | `/listings/{id}/events` | List listing status events | [listings/listings/get-listings-by-id-events](./listings/listings/get-listings-by-id-events/) |
| listings | `POST` | `/listings/{id}/pause` | Pause published listing | [listings/listings/post-listings-by-id-pause](./listings/listings/post-listings-by-id-pause/) |
| listings | `POST` | `/listings/{id}/publish` | Publish listing (MVP backoffice gate) | [listings/listings/post-listings-by-id-publish](./listings/listings/post-listings-by-id-publish/) |
| listings | `POST` | `/listings/{id}/submit` | Submit listing for verification | [listings/listings/post-listings-by-id-submit](./listings/listings/post-listings-by-id-submit/) |
| media | `GET` | `/media/assets/{id}` | Get media asset metadata | [media/media/get-media-assets-by-id](./media/media/get-media-assets-by-id/) |
| media | `GET` | `/media/assets/{id}/content` | Get a short-lived content grant | [media/media/get-media-assets-by-id-content](./media/media/get-media-assets-by-id-content/) |
| media | `POST` | `/media/uploads` | Create a presigned image upload grant | [media/media/post-media-uploads](./media/media/post-media-uploads/) |
| media | `POST` | `/media/uploads/{id}/complete` | Confirm the object arrived and start processing | [media/media/post-media-uploads-by-id-complete](./media/media/post-media-uploads-by-id-complete/) |
| search | `GET` | `/search` | Lexical search over published listing documents | [search/search/get-search](./search/search/get-search/) |
| search | `POST` | `/search/reconcile` | Rebuild search_documents for PUBLISHED listings and synonym projections from taxonomy | [search/search/post-search-reconcile](./search/search/post-search-reconcile/) |
| search | `GET` | `/synonyms` | List synonym projections for expansion | [search/synonyms/get-synonyms](./search/synonyms/get-synonyms/) |
| trust | `GET` | `/seller-levels/{sellerId}` | Get seller level (default NEW) | [trust/seller-levels/get-seller-levels-by-sellerId](./trust/seller-levels/get-seller-levels-by-sellerId/) |
| trust | `GET` | `/trust-events` | List trust events by sellerId | [trust/trust-events/get-trust-events](./trust/trust-events/get-trust-events/) |
| trust | `POST` | `/trust-events` | Append trust event (backoffice) | [trust/trust-events/post-trust-events](./trust/trust-events/post-trust-events/) |
| trust | `GET` | `/trust-scores/{sellerId}` | Get trust score for seller (default 0) | [trust/trust-scores/get-trust-scores-by-sellerId](./trust/trust-scores/get-trust-scores-by-sellerId/) |
| trust | `POST` | `/trust-scores/{sellerId}/recompute` | Recompute trust score from ledger | [trust/trust-scores/post-trust-scores-by-sellerId-recompute](./trust/trust-scores/post-trust-scores-by-sellerId-recompute/) |
| verification | `GET` | `/seals` | List seals by listingId | [verification/seals/get-seals](./verification/seals/get-seals/) |
| verification | `GET` | `/seals/{id}` | Get seal by id | [verification/seals/get-seals-by-id](./verification/seals/get-seals-by-id/) |
| verification | `POST` | `/seals/{id}/revoke` | Revoke an active seal (backoffice) | [verification/seals/post-seals-by-id-revoke](./verification/seals/post-seals-by-id-revoke/) |
| verification | `GET` | `/verification-cases` | List verification cases | [verification/verification-cases/get-verification-cases](./verification/verification-cases/get-verification-cases/) |
| verification | `POST` | `/verification-cases` | Open verification case for listing | [verification/verification-cases/post-verification-cases](./verification/verification-cases/post-verification-cases/) |
| verification | `GET` | `/verification-cases/{caseId}/evidence` | List evidence metadata for a case | [verification/verification-cases/get-verification-cases-by-caseId-evidence](./verification/verification-cases/get-verification-cases-by-caseId-evidence/) |
| verification | `POST` | `/verification-cases/{caseId}/evidence` | Add evidence metadata to a case | [verification/verification-cases/post-verification-cases-by-caseId-evidence](./verification/verification-cases/post-verification-cases-by-caseId-evidence/) |
| verification | `GET` | `/verification-cases/{id}` | Get verification case by id | [verification/verification-cases/get-verification-cases-by-id](./verification/verification-cases/get-verification-cases-by-id/) |
| verification | `POST` | `/verification-cases/{id}/approve` | Approve case and grant seal (backoffice) | [verification/verification-cases/post-verification-cases-by-id-approve](./verification/verification-cases/post-verification-cases-by-id-approve/) |
| verification | `POST` | `/verification-cases/{id}/assign` | Assign reviewer (backoffice) | [verification/verification-cases/post-verification-cases-by-id-assign](./verification/verification-cases/post-verification-cases-by-id-assign/) |
| verification | `POST` | `/verification-cases/{id}/reject` | Reject verification case (backoffice) | [verification/verification-cases/post-verification-cases-by-id-reject](./verification/verification-cases/post-verification-cases-by-id-reject/) |

## Estrutura por endpoint

```text
docs/frontend-api/<dominio>/<recurso>/<metodo-path>/
  README.md              # o que faz + produto + relações
  curl.sh                # curl pronto
  contrato-entrada.md    # request body
  contrato-saida.md      # response + erros
  parametros.md          # path/query/headers
  casos.md               # sucesso e erro (body + o que o front faz)
  exemplo-uso.md         # fetch TS + fluxo front
```

## Regras de produto (não negociáveis no front)

1. **Confiança > volume** — nunca exibir selo/verificação sem status concluído da API.
2. **Produto ≠ Oferta** — `/products` é modelo; `/listings` é unidade/oferta.
3. **IA não inventa** — atributos vêm de `attribute-schema` e da resposta; não preencher gaps.
4. **TrustScore com motivo** — usar eventos/score retornados; não reduzir a cor sem texto.
5. **Identidade só no JWT** — nunca spoofar `x-user-id` / `x-user-groups`.
6. **Cadastro público** é `POST /auth/register`, não `POST /users` (este é ADMIN).

## Como regenerar

A partir de `gt-backend`:

```bash
FRONTEND_API_DOCS_OUT=../frontend-web/docs/frontend-api \\
FRONTEND_API_BASE_URL=http://localhost:3000 \\
FRONTEND_API_SPEC_LINK=../../../gt-backend/src/contracts/service.yaml \\
node scripts/generate-frontend-api-docs.js
```

Depois os guias manuais `00-` … `04-` são preservados automaticamente se já existirem na pasta de saída.
