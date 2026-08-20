# Test Plan — fase1-backend-live

Owner: agt-web-qa (modo PLAN + VERIFY + EXPLORATORY)
Requirements version: app-shell 0.1.0 · busca-e-descoberta 0.1.0 · anuncio-e-evidencias 0.1.0
Date: 2026-08-14

## Escopo

Verificar o frontend-web contra o gt-backend real (`http://localhost:3000`), com o app em `yarn dev` (`http://localhost:5173`).

- Primária: Lucas (discovery) / Carlos (vender)
- Contraste: Beatriz (comparação) / Camila (moderação)
- Dispositivo: Chrome desktop + viewport mobile 390×844
- Auth E2E: `E2E_EMAIL` / `E2E_PASSWORD` vazios → specs autenticados devem SKIP, não FAIL

## Matriz de casos

| ID | Persona | AC | Plataforma | Estado | Nível | Prioridade |
|---|---|---|---|---|---|---|
| TC-01 | Lucas | AC-01 busca / AC-02 marca | Chrome | Home `/` busca dominante + marca | E2E + Manual | P0 |
| TC-02 | Beatriz | AC-02 resultados | Chrome | `/buscar` ofertas ↔ produto, Patrocinado | E2E + Manual | P0 |
| TC-03 | Lucas | AC-03 empty | Chrome | Busca sem hits com empty state | Manual | P1 |
| TC-04 | Lucas | Guardas | Chrome | Anônimo em `/favoritos` `/vender` `/moderacao` `/perfil` → `/entrar` | E2E + Manual | P0 |
| TC-05 | Lucas | Auth copy | Chrome | Login inválido: “E-mail ou senha inválidos.” sem oráculo | Manual + Unit | P0 |
| TC-06 | Carlos | Cadastro | Chrome | `/criar-conta` máscaras, botão desabilitado, maior de idade | Manual + Integration | P0 |
| TC-07 | Carlos | AC-03 vender | Chrome | Wizard autenticado (bloqueado sem sessão E2E) | E2E skip | P1 |
| TC-08 | Camila | Moderação | Chrome | Fila exige backoffice (skip sem `E2E_BACKOFFICE_*`) | E2E skip | P1 |
| TC-09 | Lucas | AC-01 anúncio | Chrome | `/anuncio/:id` ordem canônica | Manual | P0 |
| TC-10 | Lucas | Mobile | Mobile web 390×844 | Home + buscar usáveis | Manual | P1 |
| TC-11 | — | Qualidade | CI local | `yarn test:unit` `test:integration` `test:e2e` `lint` | Automated | P0 |

## Convenções

- Unit: `*.test.ts(x)` co-localizado.
- Integração: `__tests__/*.spec.ts(x)`.
- E2E: `e2e/` Playwright, Chromium, `baseURL` `http://127.0.0.1:5173`.
- Contas autenticadas só via env; vazio = skip.

## Dados e ambiente

- Frontend: `http://localhost:5173` (Vite)
- Backend: `http://localhost:3000` (`GET /health` → `{"status":"OK"}`)
- `VITE_API_BASE_URL=http://localhost:3000`
- Catálogo observado via curl: `GET /search` → `[]`, `GET /categories` → `[]`, `GET /listings` → `[]`

## Riscos e fora do escopo

- Firefox/Safari não exercitados.
- Checkout, disputa, pagamento.
- Não alterar código de produção nesta rodada.
