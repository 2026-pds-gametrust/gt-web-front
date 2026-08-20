# UI/UX Audit — ui-modernizacao-web

Result: AUDIT_CREATED
Owner: agt-ui-ux-auditor
Feature slug: ui-modernizacao-web
App version: frontend-web HEAD
Platform: desktop web
Browser: inspeção de código + rotas (Chrome alvo)
Date: 2026-08-19

## Journey executed

- Home `/` — busca dominante, rails, trust strip, CTA vender
- Busca `/buscar` — chips, empty, loading texto
- Produto `/produto/:id` — modelo vs ofertas
- Anúncio `/anuncio/:id` — 11 blocos canônicos
- Auth `/entrar`, `/criar-conta`, `/criar-conta/sucesso`
- Vender `/vender`, Meus anúncios, Favoritos, Perfil
- Moderação `/moderacao`, admin catálogo/usuários

## Findings

- UX-01 [UX_MAJOR]: Busca, produto e anúncio ainda usam “Carregando…” em texto, sem skeleton compartilhado.
- UX-02 [UX_MAJOR]: Erro de busca é `<p role="alert">` sem retry via `FeedbackBanner`.
- UX-03 [UX_MAJOR]: Empty states inconsistentes (markup cru vs `.empty-state`).
- UX-04 [UX_MINOR]: Cartão tem hover básico; rails sem entrada stagger; ícones favoritar/comparar ainda stub.
- UX-05 [UX_MINOR]: Página do anúncio tem ordem canônica, mas blocos sem motion/hierarquia de superfície.
- UX-06 [UX_MINOR]: Nav do header tem `is-active`, mas chips/categorias sem transição de estado.
- UX-07 [UX_MAJOR]: Moderação e admin usam mensagem de operação/erro em parágrafo, não `FeedbackBanner`.
- UX-08 [UX_MINOR]: Wizard de vender: indicadores de passo baixos (36px) e campos sem `FormField`.
- UX-09 [UX_OPPORTUNITY]: ~~Tokens e motion misturados em `global.css`~~ — resolvido: Tailwind v4 + `tokens.css` / `base.css` / `motion.css`.
- UX-10 [UX_OPPORTUNITY]: Home search panel é um bloco branco; falta hero tipográfico GT.
- UX-11 [UX_MINOR]: RequireAuth mostra “Carregando sessão…” sem skeleton.
- UX-12 [UX_MINOR]: Auth já tem banners animados (baseline) — não regressar DEF-03 nem anti-oráculo.

## Estados verificados

| Estado | Presente? | Observação |
|---|---|---|
| initial | sim | Pages montam com loading |
| loading | parcial | Home tem skeleton; busca/listing/produto texto |
| success | sim | Rails e grids |
| empty | parcial | Busca/favoritos ok; produto sem ofertas é texto |
| validation_error | sim | Auth FormField |
| server_error | parcial | Home FeedbackBanner; busca/listing fraco |
| offline | parcial | Auth copy de rede; discovery não diferencia |
| timeout | não | Tratado como erro genérico |

## Motion permitida vs proibida

Permitida: fade-up de cards, hover lift, skeleton shimmer, check de conta criada (não selo).
Proibida: check verde de “verificado”, selo animado sem `GRANTED`, pulse infinito em CTA.

## Evidence

- screenshots: inspeção de código das rotas listadas
- recording: n/a nesta passagem
- logs: n/a

## Personas affected

- Beatriz (comparação na busca/home)
- Lucas (confiança no anúncio)
- Carlos (vender)
- Camila/André (moderação)

## Recommended owner

- agt-web-product-owner (requirements)
- agt-web-react-developer (implementação)

## Knowledge sources used

- Internal decision: KB-DEC-001 design tokens
- Principle: confiança > volume; Produto ≠ Oferta
- Normative / official: docs/design-system/paridade-visual.md
- Market case (reference only): rails estilo marketplace, sem copiar selos
- Limitation: audit baseada em código; evidência de browser na fase APP_EXECUTION
