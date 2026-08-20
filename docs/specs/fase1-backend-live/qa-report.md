# QA Report — fase1-backend-live

QA result: FAIL
Mode: VERIFY + EXPLORATORY
Owner: agt-web-qa
Feature slug: fase1-backend-live
Requirements version: app-shell 0.1.0 · busca-e-descoberta 0.1.0 · anuncio-e-evidencias 0.1.0
Build version: 0.1.0
Date: 2026-08-14

> App em execução em `http://localhost:5173` contra gt-backend `http://localhost:3000`. Evidência de browser (Chrome) + suíte automatizada.

## Platforms

- Chrome: FAIL (desktop + viewport 390×844) — UI e guardas ok; chamadas XHR/fetch ao backend bloqueadas no browser
- Firefox: N/A
- Safari: N/A
- Mobile web: PASS parcial (layout empilha nav; mesma falha de API)

## Personas

- Primária: Lucas (discovery) / Carlos (vender)
- Contraste: Beatriz (comparação) / Camila (moderação)
- Dispositivo: Chrome desktop + mobile 390×844
- Objetivo: explorar catálogo, autenticar, vender
- Estado: Lucas cauteloso; Carlos quer publicar
- Restrição: sessão E2E não semeada (`.env` vazio)

## Acceptance criteria

- AC-01 Home busca dominante (Lucas): PASS_WITH_RISKS — hero search visível; vitrine não carrega (DEF-01)
- AC-02 Resultados + Patrocinado (Beatriz): FAIL — `/buscar` e `/buscar?q=RTX` mostram alerta de falha (DEF-01)
- AC-03 Empty state: BLOCKED — erro de rede mascara empty real; curl `GET /search` retorna `[]`
- AC-01 Nav canônica: PASS_WITH_RISKS — Início, Buscar, Categorias, Favoritos, Compras e vendas, Notificações, Perfil; Vender está no header (CTA), não na nav Principal; alvo de toque da nav = 40px (AC pedia ≥44px)
- AC-02 Marca: PASS — logo + nome acessível “GamerTrust”
- AC-01 Ordem canônica do anúncio: FAIL — página fica em “Carregando anúncio…” (DEF-02); catálogo vazio no backend
- AC-02 Sem fake seal: BLOCKED — detalhe não renderiza
- AC-03 Vender autenticado: BLOCKED — anônimo redireciona (ok); cadastro via UI falha (DEF-01); E2E autenticado SKIP

## Automated tests

| Comando | Resultado | Exit |
|---|---|---|
| `yarn test:unit` | 12 suites, 43 tests passed | 0 |
| `yarn test:integration` | 3 suites, 21 tests passed | 0 |
| `yarn test:e2e` | 3 passed, 3 skipped | 0 |
| `yarn lint` | 0 errors, 1 warning | 0 |

E2E skipped (esperado — env vazio):

- `authenticated › favorites page loads for the signed-in actor`
- `authenticated › moderation is closed to a member without the backoffice group`
- `backoffice › moderation queue is reachable`

E2E passed:

- `e2e/home.spec.ts` — home mostra marca
- `discovery (public) › home renders and search navigates`
- `discovery (public) › anonymous visitor is sent to the login screen`

Lint warning (não bloqueia o script):

```text
src/02-pages/sell/sell-page.tsx:33:6
React Hook useEffect has a missing dependency: 'store'
```

Unit/integration cobrem auth copy, máscaras, session/refresh, home stubada, moderação 403≠401. Não exercitam CORS do browser contra o backend real.

## Exploratory tests

| Fluxo | URL | Resultado |
|---|---|---|
| Home, busca hero, nav, marca | `/` | Shell ok. Alert “Não foi possível carregar a vitrine agora.” |
| Buscar sem query e com `q=RTX` | `/buscar`, `/buscar?q=RTX` | Toggle Ofertas / Agrupado por produto. Alert “Não foi possível carregar os resultados.” Copy de Patrocinado honesta. |
| Login inválido | `/entrar` | Formulário ok. Submit → “Sem conexão com o servidor…” (não a copy de credenciais). Curl no mesmo payload: 401 `AUTH_INVALID_CREDENTIALS`. |
| Criar conta — validação | `/criar-conta` | Botão desabilitado com campos vazios. Máscaras: telefone `(11) 98765-4321`, CPF `529.982.247-25`. Copy não finge verificação. |
| Criar conta — submit | `/criar-conta` | UI: “Sem conexão com o servidor…”. Curl `POST /auth/register` no mesmo backend: 201 Created. |
| Favoritos anônimo | `/favoritos` | Redirect `/entrar` + heading Entrar |
| Vender anônimo | `/vender` | Redirect `/entrar` |
| Moderação anônimo | `/moderacao` | Redirect `/entrar` (não vaza a fila) |
| Perfil anônimo | `/perfil` | Redirect `/entrar` |
| Anúncio inexistente | `/anuncio/listing-ps5-carlos-1` | Fica em “Carregando anúncio…” (não empty). Curl: 404 `RESOURCE_NOT_FOUND`. |
| Em breve | `/em-breve/compras` | Placeholder honesto, mas copy ainda fala em “anúncio mockado” (DEF-04). |
| Mobile 390×844 | `/` e `/buscar?q=RTX` | Nav empilha; busca usável; mesma falha de API. CTA Entrar ilegível (DEF-03). |

## Defects

### DEF-01 — Browser não consome o gt-backend (CORS / CORP)

- Fluxo: Lucas na home/busca; login inválido; Carlos criando conta
- URL: `/`, `/buscar`, `/entrar`, `/criar-conta`
- Esperava: vitrine/resultados (ou empty honesto); login 401 com “E-mail ou senha inválidos.”; registro 201 → `/perfil`
- Ocorreu: `Failed to fetch` / copy “Sem conexão com o servidor” / “Não foi possível carregar a vitrine/os resultados.”
- Evidência: `GET /search` e `GET /categories` via curl = 200 `[]`; `POST /auth/login` = 401 `AUTH_INVALID_CREDENTIALS`; `POST /auth/register` = 201. Respostas **sem** `Access-Control-Allow-Origin`. Helmet: `Cross-Origin-Resource-Policy: same-origin`. OPTIONS `/search` = 405. Vite **sem** proxy. Front chama `http://localhost:3000` a partir de `http://localhost:5173`.
- Severidade: P0 — bloqueia discovery e auth na UI contra backend real.

### DEF-02 — Detalhe do anúncio nunca sai do loading se a API falha

- Fluxo: Lucas abre `/anuncio/:id`
- URL: `/anuncio/listing-ps5-carlos-1`
- Esperava: empty “Anúncio não encontrado” (404) ou erro recuperável
- Ocorreu: “Carregando anúncio…” persistente (>5s). `listing-page.tsx` não tem `try/catch`; rejeição deixa `loading === true`.
- Evidência: screenshot + curl 404 `RESOURCE_NOT_FOUND`. Home/busca tratam erro; anúncio não.
- Severidade: P1 (fica P0 junto com DEF-01 no ambiente live).

### DEF-03 — CTA “Entrar” invisível no header escuro

- Fluxo: qualquer página anônima
- URL: `/`, `/entrar`, `/criar-conta`
- Esperava: rótulo “Entrar” visível (contraste no header de marca)
- Ocorreu: quadrado vazio à direita de Vender. A11y name existe (`link name: Entrar`). `.gt-button--ghost` usa `color: var(--gt-text)` (#181818) sobre `--gt-header` escuro.
- Evidência: screenshots desktop/mobile; snapshot a11y.
- Severidade: P1 visual / a11y de contraste.

### DEF-04 — Placeholder “em breve” ainda cita anúncio mockado

- Fluxo: Categorias / Compras e vendas
- URL: `/em-breve/compras` (e rotas irmãs)
- Esperava: copy honesta pós-remoção do mock
- Ocorreu: “publicar um anúncio mockado”
- Evidência: snapshot da página.
- Severidade: P2 copy.

## Accessibility findings

- Marca: logo + `visually-hidden` “GamerTrust” — PASS
- Login/cadastro: labels associadas, `role="alert"` nos erros — PASS
- Nav Principal: `min-height: 40px` (AC pedia ≥44px)
- DEF-03: contraste do ghost “Entrar” no header

## Visual findings

- Tokens de marca (laranja #F84000, header escuro) aplicados
- Busca duplicada na home (header + hero) alinhada ao AC de busca dominante
- DEF-03: Entrar fantasma
- Mobile: conteúdo ~390px; nav em duas linhas — aceitável, não pixel-perfect

## Residual risks

- Catálogo vazio no backend (`/search`, `/categories`, `/listings` = `[]`). Mesmo com CORS corrigido, vitrine/rails ficam vazios até haver listing PUBLISHED indexado (`POST /search/reconcile`).
- Specs autenticados e backoffice não rodaram (env vazio, por desenho).
- Firefox/Safari não exercitados.
- Warning `react-hooks/exhaustive-deps` em `sell-page.tsx`.
- Vender fora da nav Principal (só CTA) — desvio do AC-01 original do app-shell; CTA existe.
- Conta criada via curl neste QA (`lucas.qa.20260814b@example.com`) não passou pela UI.

## Evidence

- `yarn test:unit` 43 passed, exit 0
- `yarn test:integration` 21 passed, exit 0
- `yarn test:e2e` 3 passed / 3 skipped, exit 0
- `yarn lint` 0 errors / 1 warning, exit 0
- Browser Chrome: home, buscar, entrar (login inválido), criar-conta (máscaras + submit), redirects anônimos, anúncio stuck, em-breve, mobile 390×844
- curl: `/health` 200, `/search` 200 `[]`, login 401 com código estável, register 201, listing 404
