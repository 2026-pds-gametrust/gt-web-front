# Como os endpoints se relacionam

Grafo de dependências HTTP do Phase 1. Cada seta é “precisa existir / precisa ter acontecido antes”, não um redirect.

Persona de leitura: **time de frontend** montando clients FSD (`src/04-features/*/api`). Contraste: **Camila** (backoffice) nos nós operacionais.

---

## Domínios

```text
auth ──► identity (User, Profile, groups)
              │
              ├──► media (assets READY)
              │         │
catalog ──────┴──► listings (oferta) ──► verification (caso + selo)
                                              │
                         search ◄── publish ──┤
                                              │
                         trust (score/nível) ◄┘
                         favorites ──► listing/product já existentes
```

| Domínio | Pasta | Papel no produto |
|---------|-------|------------------|
| [auth](./auth/) | sessão first-party | Entra no app |
| [identity](./identity/) | User + Profile | Quem é; vitrine |
| [catalog](./catalog/) | Category, Product, Service | Modelo; **não** é a oferta |
| [media](./media/) | upload/assets | Fotos do anúncio e evidência |
| [listings](./listings/) | Listing | Unidade à venda |
| [verification](./verification/) | Case, Evidence, Seal | Confiança auditável |
| [trust](./trust/) | Score, events, level | “Por que confiar” |
| [search](./search/) | índice + synonyms | Home / discovery |
| [favorites](./favorites/) | salvos | Reengajamento |

---

## Grafo por recurso

### Auth → Identity

```text
POST /auth/register  ──cria──► User (groups: app-user) + credencial (fora do User)
POST /auth/login     ──lê────► mesma credencial
GET  /auth/me        ──lê────► User público do JWT
POST /auth/refresh   ──gira──► tokens da sessão
POST /auth/logout    ──mata──► refresh + access desta sessão

POST /users          ──ADMIN──► User SEM senha (não é cadastro)
PUT  /users/{id}/groups ──ADMIN──► papéis HTTP
POST /users/{id}/verify ──BO────► user.verified (≠ selo de listing)
POST /profiles       ──Bearer──► Profile.userId = User.id
```

**Regra:** um `User` não guarda password. Tela de “minha conta” = `GET /auth/me` ou `GET /users/{id}` (dono). Vitrine = `Profile`.

### Catalog → Listing

```text
Category ──attribute-schema──► campos do formulário de anúncio
Product  (modelo)  ◄──productId──  Listing (oferta)
Service  ── taxonomia de serviços (filtros)
GET /products/{id}/price-history  ── histórico do MODELO, não da oferta
```

O front **nunca** trata `Product.title` como preço da unidade. Preço da venda = `Listing.priceCents`.

### Media → Listing / Evidence

```text
POST /media/uploads (purpose LISTING|EVIDENCE|PRODUCT)
        │
        ▼
  upload binário (URL do grant)
        │
        ▼
POST /media/uploads/{id}/complete
        │
        ▼
GET /media/assets/{id}  status READY
        │
        ├──► Listing.media
        └──► EvidenceItem.assetId
```

### Listing → Verification → Search

```text
POST /listings                 status DRAFT
PUT  /listings/{id}            ainda DRAFT
POST /listings/{id}/submit     SUBMITTED
POST /verification-cases       PENDING
POST .../evidence              fotos / hash
POST .../assign                IN_REVIEW          (backoffice)
POST .../approve               APPROVED + Seal GRANTED
POST /listings/{id}/publish    PUBLISHED          (backoffice)
GET  /search                   só PUBLISHED
POST /listings/{id}/pause      PAUSED (sai da busca)
POST /seals/{id}/revoke        some selo na PDP
```

`GET /listings` e `GET /listings/{id}` existem na discovery; o front **ainda assim** não deve promover draft/submitted como “à venda”.

### Trust paralelo ao selo

```text
User verified / Seal granted / Seal revoked / Order completed
        │
        ▼
POST /trust-events            (backoffice)
POST /trust-scores/{id}/recompute
GET  /trust-scores/{sellerId}  + GET /trust-events?sellerId=
GET  /seller-levels/{sellerId}
```

Selo é da **oferta** (`listingId`). Score é do **vendedor** (`sellerId`). Não misturar na UI: anúncio sem selo pode ter vendedor com nível `NEW`.

### Favorites

```text
JWT.sub ──► Favorite.userId (servidor ignora userId do body)
Favorite.targetType = PRODUCT | LISTING
                 │
                 ├── GET /products/{targetId}
                 └── GET /listings/{targetId}
```

---

## Sequências mínimas (copy-paste mental)

### Comprar / descobrir (Lucas, sem conta)

`GET /categories` → `GET /search` → `GET /listings/{id}` → `GET /seals` + `GET /trust-scores/{sellerId}` + `GET /profiles/by-user/{sellerId}`

### Favoritar (Lucas autenticado)

register/login → `POST /favorites` → `GET /favorites`

### Vender (Carlos)

register → `GET /auth/me` → `POST /profiles` → `GET /products/{id}` → `GET .../attribute-schema` → media READY → `POST /listings` → `POST .../submit` → evidências → (Camila approve + publish) → aparece no `GET /search`

### Operar (Camila)

login com group backoffice/admin → fila de cases → assign/approve/reject → `POST /listings/{id}/publish` → opcional `POST /search/reconcile`

---

## IDs que o front precisa amarrar

| ID | Nasce em | Aparece depois em |
|----|----------|-------------------|
| `user.id` | register / `POST /users` | JWT, `sellerId`, `Profile.userId`, `Favorite`, `ownerId` de mídia |
| `accessToken` | register/login/refresh | header Bearer |
| `refreshToken` | idem | só `POST /auth/refresh` e descartar após rotacionar |
| `profile.id` | `POST /profiles` | `PUT /profiles/{id}` |
| `product.id` | catálogo (BO) | `Listing.productId`, favorite PRODUCT |
| `listing.id` | `POST /listings` | submit/publish/pause/events, seals, search, favorites |
| `asset.id` | `POST /media/uploads` | listing media, evidence |
| `case.id` | `POST /verification-cases` | evidence, approve, `Seal.caseId` |
| `seal.id` | approve | GET seals, revoke |

---

## O que **não** se relaciona (erros comuns de integração)

| Erro de produto no front | Por quê está errado |
|--------------------------|---------------------|
| Tela de cadastro chama `POST /users` | Sem senha; 403 para `app-user`; duplicata 409. Cadastro = `/auth/register`. |
| Mostrar selo porque `user.verified` | Verificação de conta ≠ selo da oferta. |
| Preencher atributos “óbvios” com IA | Só `attribute-schema` + payload do listing. |
| Mandar `x-user-id` no lugar do Bearer | Identidade só no JWT. |
| Publicar pelo app do Carlos | `POST .../publish` é backoffice. |
| Buscar draft | Índice = PUBLISHED. |
| Tratar 400 de register como “e-mail em uso” | Anti-enumeração: copy genérica. |
