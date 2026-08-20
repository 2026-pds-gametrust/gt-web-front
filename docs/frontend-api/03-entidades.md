# Estrutura das entidades (contratos OpenAPI)

Espelho de `components/schemas` para o frontend. Detalhe campo a campo: [`_schemas/`](./_schemas/).

Persona: time web mapeando `src/05-entities`. Contraste: não copiar `IM*` / Mongo — só estes JSON.

---

## Mapa mental

```text
AuthSession
  ├── User          (identidade pública; SEM senha)
  ├── accessToken
  └── refreshToken

User 1 ──1 Profile (vitrine + Address[])
User 1 ──* Listing (sellerId)     ≠ Product (modelo de catálogo)
Listing 1 ──* ListingEvent
Listing 1 ──? VerificationCase ──* EvidenceItem
Listing 1 ──* Seal
User (seller) 1 ──1 TrustScore
User (seller) 1 ──1 SellerLevel
User (seller) 1 ──* TrustEvent
User 1 ──* Favorite → PRODUCT | LISTING
MediaAsset (purpose PRODUCT | LISTING | EVIDENCE)
```

---

## Auth

### [`AuthSession`](./_schemas/AuthSession.md)

| Campo | Tipo | Notas |
|-------|------|--------|
| `user` | `User` | público |
| `accessToken` | string | JWT; header Bearer |
| `refreshToken` | string | opaco; só no refresh |

### [`NewAuthRegistration`](./_schemas/NewAuthRegistration.md)

Obrigatórios: `id`, `fullName`, `email`, `phone`, `cpf`, `birthDate`, `password`.

### [`AuthLogin`](./_schemas/AuthLogin.md)

`email` + `password`.

### [`AuthRefresh`](./_schemas/AuthRefresh.md)

`refreshToken`.

---

## Identity

### [`User`](./_schemas/User.md)

| Campo | Tipo | Notas de produto |
|-------|------|------------------|
| `id` | string | igual ao `sub` do JWT |
| `fullName`, `email`, `phone` | string | PII — não logar |
| `cpf` | string | 11 dígitos; **não** vai para eventos de domínio |
| `birthDate` | date | idade / `USER_UNDERAGE` |
| `verified` | boolean | identidade de conta; **≠** selo de listing |
| `phoneVerified` | boolean | idem |
| `status` | `ACTIVE` \| `BLOCKED` \| `PENDING_VERIFICATION` | BLOCKED não autentica |
| `groups` | `app-user` \| `partner` \| `admin` \| `backoffice` | nunca `SYSTEM` |
| `createdAt` / `updatedAt` | date-time | |

`NewUser` (ADMIN) **não** tem password. `UpdateUser` do dono: nome/email/phone/cpf/birthDate — **sem** verified/status.

### [`UpdateUserGroups`](./_schemas/UpdateUserGroups.md)

`{ "groups": ["app-user", "backoffice"] }` — só ADMIN.

### [`Profile`](./_schemas/Profile.md)

| Campo | Notas |
|-------|--------|
| `id`, `userId` | 1:1 típico com User |
| `displayName`, `bio`, `locationApprox` | vitrine (Carlos na seller page) |
| `addresses` | array [`Address`](./_schemas/Address.md) |
| `defaultShippingAddressId` | |
| `setupItems` | objeto livre — não inventar na UI sem API |

`NewProfile` exige `id` + `userId` (= ator).

---

## Catalog (modelo)

### [`Category`](./_schemas/Category.md) / [`Product`](./_schemas/Product.md) / [`ServiceTaxonomy`](./_schemas/ServiceTaxonomy.md)

Produto = ficha de modelo (marca, categoria). **Não** tem `sellerId` nem `priceCents` da unidade.

### [`CategoryAttributeSchema`](./_schemas/CategoryAttributeSchema.md)

Define o formulário dinâmico do anúncio. O front **não** adiciona chaves em `Listing.attributes` que o schema não descreve.

### [`PriceHistory`](./_schemas/PriceHistory.md)

Série do **productId**, transparência do modelo.

---

## Listing (oferta)

### [`Listing`](./_schemas/Listing.md)

| Campo | Notas |
|-------|--------|
| `id`, `sellerId`, `productId` | oferta ≠ produto |
| `title`, `description` | copy da unidade |
| `condition` | `NEW` \| `LIKE_NEW` \| `GOOD` \| `FAIR` \| `POOR` |
| `priceCents`, `listPriceCents`, `currency` | preço **em centavos** |
| `attributes` | só o schema da categoria |
| `media` | [`ListingMedia`](./_schemas/ListingMedia.md) |
| `shipping` | [`ListingShipping`](./_schemas/ListingShipping.md) `PICKUP` \| `SHIPPING` |
| `warranty` | [`ListingWarranty`](./_schemas/ListingWarranty.md) `NONE` \| `SELLER` \| `MANUFACTURER_REMAINING` |
| `acceptsOffers`, `buyNowEnabled`, `quantity` | |
| `status` | ver máquina abaixo |
| `locationApprox` | |

**Máquina de status (MVP):**

```text
DRAFT → SUBMITTED → PUBLISHED → PAUSED
                              ↘ EXPIRED | RESERVED | SOLD
```

UI:

| Status | Comprador (Lucas) | Vendedor (Carlos) |
|--------|-------------------|-------------------|
| `DRAFT` | não promover | editar |
| `SUBMITTED` | não à venda | “em verificação”, sem selo |
| `PUBLISHED` | PDP + busca | pausar |
| `PAUSED` | não buscar | retomar via fluxo operacional |

`NewListing` exige `id`, `sellerId` (= JWT), `productId`, `title`, `condition`, `priceCents`, `media`, `shipping`.

### [`ListingEvent`](./_schemas/ListingEvent.md)

Timeline para `GET /listings/{id}/events` — transparência, não inventar estados.

---

## Verification e selos

### [`VerificationCase`](./_schemas/VerificationCase.md)

`status`: `PENDING` \| `IN_REVIEW` \| `APPROVED` \| `REJECTED`. `decisionReason` no reject. `moderatorId` na operação.

### [`EvidenceItem`](./_schemas/EvidenceItem.md)

`type`: `PHOTO` \| `VIDEO` \| `PROOF_CODE_HASH`. Ligar `assetId` de mídia `purpose: EVIDENCE`.

### [`Seal`](./_schemas/Seal.md)

| Campo | Valores |
|-------|---------|
| `type` | `POSSESSION` \| `FUNCTIONING` \| `IDENTITY` \| `PROTECTED_PURCHASE` \| `WARRANTY` |
| `status` | `GRANTED` \| `SUSPENDED` \| `EXPIRED` \| `REVOKED` |

**Regra de UI:** pintar selo **somente** se `status === "GRANTED"`. `IDENTITY` no selo ≠ `User.verified` sozinho.

---

## Trust

### [`TrustScore`](./_schemas/TrustScore.md)

`score` (número) + `components` (mapa de contribuições). Sempre mostrar motivo (`GET /trust-events`), nunca só cor.

### [`TrustEvent`](./_schemas/TrustEvent.md)

`type`: `USER_VERIFIED` \| `SEAL_GRANTED` \| `SEAL_REVOKED` \| `ORDER_COMPLETED`.

### [`SellerLevel`](./_schemas/SellerLevel.md)

`NEW` \| `EVOLVING` \| `TRUSTED` \| `EXCELLENT`. Default `NEW` se ainda não há histórico.

---

## Search e favorites

### [`SearchDocument`](./_schemas/SearchDocument.md)

Projeção para `GET /search`. Campos de listing publicado + `searchText`. Não é a PDP completa — após o clique, `GET /listings/{id}`.

### [`Favorite`](./_schemas/Favorite.md)

`targetType`: `PRODUCT` \| `LISTING`. Ownership pelo JWT.

---

## Media

### [`MediaAsset`](./_schemas/MediaAsset.md)

`status`: `PENDING_UPLOAD` → `UPLOADED` → `PROCESSING` → `READY` | `FAILED`.

`purpose`: `PRODUCT` \| `LISTING` \| `EVIDENCE`.

`contentType`: `image/jpeg` \| `image/png` \| `image/webp`. `byteSize` ≤ 10485760.

### [`MediaUploadGrant`](./_schemas/MediaUploadGrant.md)

`MediaAsset` + objeto `upload` (URL/método temporários). O PUT do arquivo **não** é documentado como path Express.

### [`MediaVariant`](./_schemas/MediaVariant.md)

`THUMBNAIL` \| `CARD` \| `FULL` — usar na lista vs PDP.

---

## Erros

### [`TranslatedApiError`](./_schemas/TranslatedApiError.md)

```json
{ "error": "mensagem do catálogo", "code": "FIELD_INVALID", "contextInfo": {} }
```

O front ramifica por `code` estável (`AUTH_UNAUTHORIZED`, `AUTH_INVALID_CREDENTIALS`, `RESOURCE_NOT_FOUND`, `RESOURCE_CONFLICT`, `FIELD_INVALID`, `USER_UNDERAGE`, …), não por texto.

### 403 middleware

Em várias rotas, 403 de group vem como `{ "error": "Access denied" }` (pacote `authorizeByGroup`), não necessariamente `TranslatedApiError`. Tratar os dois.

### 429 auth

[`AuthRateLimitError`](./_schemas/AuthRateLimitError.md): `{ "message": "Too many requests, please try again later." }` — sem e-mail/CPF.

### 204

Logout: sem schema. Não chamar `res.json()`.

---

## Relação produto vs oferta (não negociável)

| Conceito | Entidade | Endpoint típico |
|----------|----------|-----------------|
| Modelo no catálogo | `Product` | `GET /products/{id}` |
| Unidade à venda | `Listing` | `GET /listings/{id}` |
| Confiança da oferta | `Seal` | `GET /seals?listingId=` |
| Confiança do vendedor | `TrustScore` + eventos | `GET /trust-scores/{sellerId}` |
| Pessoa logada | `User` | `GET /auth/me` |
| Vitrine | `Profile` | `GET /profiles/by-user/{userId}` |
