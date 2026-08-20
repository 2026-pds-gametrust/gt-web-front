# Requirements — buy-now-checkout-web

Status: APPROVED
Version: 0.1.0
Owner: Product
Date: 2026-08-20

Classification: Feature slice (frontend catch-up)

## Related specifications

- Backend: `gt-backend/docs/specs/buy-now-checkout-mvp/requirements.md` (Approved)
- Product: `context/GamerTrust-05-MARKETPLACE-EXPERIENCE.md` (uma compra por transação; sem carrinho)

## Problema

Lucas vê anúncios publicados com `buyNowEnabled`, mas o CTA “Compra protegida” está desabilitado e “Compras e vendas” aponta para `/em-breve`. O backend já expõe `POST/GET /orders` com escrow simulado.

## Usuário afetado / Personas

- Primária: **Lucas** (comprador) — concluir compra protegida de uma unidade.
- Contraste: **Rafael** (vendedor) — ver pedidos da sua oferta.
- Anti-persona: golpista de pagamento externo (fluxo força checkout da plataforma).

## Jornada

1. Lucas abre `/anuncio/:listingId` elegível.
2. Clica em Comprar agora → `/checkout/:listingId` (auth).
3. Escolhe modo de entrega entre os oferecidos; confirma.
4. Sistema chama `POST /orders`; redireciona para detalhe do pedido.
5. Lucas/Rafael acessam `/compras` e `/compras/:orderId`.

## Resultado esperado

Checkout Comprar agora e histórico Compras/vendas funcionais contra a API real, sem fingir PSP, frete cotado, carrinho ou disputa.

## Regras de negócio (UI)

```text
BR-01: CTA ativo só se listing PUBLISHED + buyNowEnabled + ator ≠ seller (guest → login).
BR-02: shippingMode deve estar em listing.shipping.modes.
BR-03: Copy de proteção não inventa adquirente real nem frete cotado por CEP.
BR-04: Erros 403/404/409 mapeados para mensagens honestas (próprio anúncio, indisponível, já reservado).
BR-05: Detalhe do pedido: comprador ou vendedor; 404 para estranho (BOLA no backend).
BR-06: Sem carrinho; uma listing por pedido.
```

## Critérios de aceite

```md
### AC-01 — CTA elegível

Given um anúncio PUBLISHED com buyNowEnabled e Lucas autenticado (≠ seller)
When Lucas vê a página do anúncio
Then o CTA “Comprar agora” está habilitado
And navega para /checkout/:listingId

### AC-02 — Checkout cria pedido

Given Lucas no checkout com shippingMode válido
When confirma a compra
Then o cliente envia POST /orders com listingId e shippingMode
And em sucesso navega para /compras/:orderId
And o status exibido é CONFIRMED ou AWAITING_PAYMENT conforme a API

### AC-03 — CTA bloqueado com motivo

Given listing SOLD, RESERVED, buyNow desligado, ou ator = seller
When a página do anúncio renderiza
Then o CTA está desabilitado (ou oculto para seller) com motivo claro
And guest é direcionado a /entrar com returnUrl

### AC-04 — Lista Compras e vendas

Given Lucas ou Rafael autenticado com pedidos
When abre /compras
Then vê GET /orders paginado
And pode abrir /compras/:orderId

### AC-05 — BOLA no detalhe

Given um pedido de outro ator
When estranho abre /compras/:orderId
Then a UI trata 404 sem vazar dados do pedido
```

## Estados

- listing CTA: eligible | disabled(reason) | guest
- checkout: loading | ready | submitting | success | error
- orders list: loading | empty | success | error
- order detail: loading | success | not_found | error

## Erros e comportamento com rede ruim

- Network: banner “Não foi possível concluir. Tente de novo.”
- 409 LISTING_ALREADY_RESERVED / LISTING_NOT_AVAILABLE_FOR_PURCHASE: “Esta oferta acabou de ser reservada ou vendida.”
- 403 próprio anúncio: “Você não pode comprar o próprio anúncio.”

## Permissões e dados sensíveis

- Bearer obrigatório em checkout e compras.
- Não exibir PII de endereço neste slice (API de orders não devolve endereço).

## Métricas

- Conversão listing → POST /orders (futuro).

## Fora do escopo

Carrinho, oferta/contraproposta, cotação de frete por CEP, PSP real, disputas, reviews, notificações in-app, comparador.

## Aprovação

```md
Status: APPROVED
Requirements version: 0.1.0
Approved by: Plan execution gate (frontend buy-now catch-up)
Date: 2026-08-20
Conditions: Implementação FSD contra gt-backend /orders; copy honesta sobre escrow simulado.
```
