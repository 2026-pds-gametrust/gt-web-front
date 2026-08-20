# Matriz de autorização (front → API)

Quem pode chamar o quê. Fonte: `security` no OpenAPI + `authorizeByGroup` + regras de ownership no Service.

Persona: implementar guards de rota e botões. Contraste: **não** esconder só na UI — o servidor recusa 401/403.

Legenda:

| Selo | Significado |
|------|-------------|
| **Público** | `security: []` — sem Bearer |
| **Bearer** | JWT válido, qualquer group HTTP (`app-user`+) |
| **Dono ou ADMIN** | JWT `sub` = recurso **ou** group `admin` (BACKOFFICE **não** lê PII de outro user) |
| **BO/ADMIN** | group `backoffice` ou `admin` |
| **ADMIN** | group `admin` só |

401 = sem token / token inválido / access desta sessão após logout. 403 = autenticado sem permissão.

---

## Auth

| Método | Path | Auth |
|--------|------|------|
| POST | `/auth/register` | Público |
| POST | `/auth/login` | Público |
| POST | `/auth/refresh` | Público (refresh no body) |
| POST | `/auth/logout` | Bearer |
| GET | `/auth/me` | Bearer |

Throttle 429 nas três públicas de credencial.

---

## Catalog (discovery pública; escrita operacional)

| Método | Path | Auth |
|--------|------|------|
| GET | `/categories` `/categories/{id}` `/categories/{categoryId}/attribute-schema` | Público |
| GET | `/products` `/products/{id}` `/products/{productId}/price-history` | Público |
| GET | `/services` `/services/{id}` | Público |
| POST/PUT | categorias, produtos, serviços, attribute-schema | **BO/ADMIN** |

---

## Listings

| Método | Path | Auth |
|--------|------|------|
| GET | `/listings` `/listings/{id}` `/listings/{id}/events` | Público (não promover draft na UI) |
| POST | `/listings` | Bearer + **dono** (`sellerId` = ator) |
| PUT | `/listings/{id}` | Bearer + dono |
| POST | `/listings/{id}/submit` | Bearer + dono |
| POST | `/listings/{id}/pause` | Bearer + dono |
| POST | `/listings/{id}/publish` | **BO/ADMIN** |

---

## Verification e selos

| Método | Path | Auth |
|--------|------|------|
| GET | `/seals` `/seals/{id}` | Público (UI filtra `GRANTED`) |
| GET | `/verification-cases` `/verification-cases/{id}` `/.../evidence` | ver OpenAPI da pasta — fila é operacional |
| POST | `/verification-cases` evidência | Bearer (vendedor no fluxo) |
| POST | `.../assign` `.../approve` `.../reject` | **BO/ADMIN** |
| POST | `/seals/{id}/revoke` | **BO/ADMIN** |

Detalhe por operação: pastas em [verification/](./verification/).

---

## Trust

| Método | Path | Auth |
|--------|------|------|
| GET | `/trust-scores/{sellerId}` `/trust-events` `/seller-levels/{sellerId}` | Público (PDP) |
| POST | `/trust-events` | **BO/ADMIN** |
| POST | `/trust-scores/{sellerId}/recompute` | **BO/ADMIN** |

---

## Search

| Método | Path | Auth |
|--------|------|------|
| GET | `/search` `/synonyms` | Público |
| POST | `/search/reconcile` | **BO/ADMIN** |

---

## Favorites

| Método | Path | Auth |
|--------|------|------|
| GET | `/favorites` | Bearer (lista do ator; query `userId` **não** prova ownership) |
| POST | `/favorites` | Bearer |
| DELETE | `/favorites/{id}` | Bearer + dono |

---

## Media

| Método | Path | Auth no OpenAPI |
|--------|------|-----------------|
| POST | `/media/uploads` | **Público no contrato** (`security: []`) |
| POST | `/media/uploads/{id}/complete` | Público no contrato |
| GET | `/media/assets/{id}` | Público no contrato |
| GET | `/media/assets/{id}/content` | Público no contrato |

O Service ainda valida purpose/owner (403 se o ator não pode). **Envie Bearer** quando houver sessão. Não use `x-user-id` para fingir dono.

---

## Identity

| Método | Path | Auth |
|--------|------|------|
| GET | `/users` | **BO/ADMIN** |
| POST | `/users` | **ADMIN** (sem senha; conflito **409**) |
| GET/PUT/DELETE | `/users/{id}` | **Dono ou ADMIN** |
| PUT | `/users/{id}/groups` | **ADMIN** (sem auto-escalada / sem SYSTEM) |
| POST | `/users/{id}/verify` | **BO/ADMIN** |
| GET | `/profiles` | **BO/ADMIN** (lista) |
| POST | `/profiles` | Bearer + `userId` = ator |
| GET | `/profiles/{id}` `/profiles/by-user/{userId}` | discovery / PDP |
| PUT | `/profiles/{id}` | Bearer + dono |

---

## Como o front deve reagir

| HTTP | Significado | UI |
|------|-------------|-----|
| 401 | não autenticado / sessão desta aba morta | refresh uma vez; senão login |
| 403 | autenticado, ação proibida | toast “sem permissão”; **não** deslogar |
| 404 | recurso inexistente | empty/404; não inventar |
| 409 | conflito (ex. `POST /users` ADMIN) | mostrar `code` |
| 400 | validação / underage / register duplicado | campos; copy genérica no register |
| 429 | throttle auth | esperar |
| 204 | logout ok | limpar tokens |

Fluxo ponta a ponta: [00-fluxo-conta-ate-anuncio.md](./00-fluxo-conta-ate-anuncio.md).
