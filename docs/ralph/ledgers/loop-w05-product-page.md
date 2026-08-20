# loop-w05-product-page

status: DONE  
orchestrator: IN_DEVELOPMENT → APP_EXECUTION → DONE

## goal

Página do modelo: faixa de preço + lista de ofertas (Produto ≠ Oferta).

## personas

Primária: Beatriz · Contraste: Lucas

## AC

- [x] Título/specs do produto (modelo), não da oferta
- [x] Faixa de preço das ofertas
- [x] Lista de ofertas com condição, selos, TrustScore
- [x] CTA para `/anuncio/:id`

## agents

agt-web-react-developer

## in / out / evidence

- out: `src/02-pages/product`, catalog-api
- evidence: rota `/produto/:productId` no router
