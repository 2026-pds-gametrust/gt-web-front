# Technical Design — <feature-slug>

Status: DRAFT | APPROVED
Version: 0.1.0
Owner: agt-web-architecture
Requirements version:
Date:

## Mapa FSD

```text
Page:      src/02-pages/<...>
Widgets:   src/03-widgets/<...>
Features:  src/04-features/<...>
Entities:  src/05-entities/<...>
Shared:    src/06-shared/<...>
```

## Navegação

<!-- Rotas react-router-dom, deep links web, gating de sessão. -->

## Ownership do estado

<!-- Qual store Zustand, em qual camada (entities vs features/model). O estado sobrevive à navegação? -->

## Integração com API

<!-- Endpoints, contratos I*, mapeamento de erros de domínio. HTTP via @shared/lib/http. -->

## Estados e resiliência

- Loading:
- Erro / retry:
- Vazio:
- Offline:
- Timeout:
- Risco de duplicação (idempotência):
- Persistência local / retomada:

## Layout responsivo

<!-- Breakpoints desktop/tablet/mobile web; teclado e foco. -->

## Acessibilidade técnica

<!-- nomes acessíveis, roles, ARIA, foco, anúncio de erros, alvos ≥44px. -->

## Analytics / Observabilidade

<!-- Eventos via adapter em shared. Sem PII. -->

## Paridade com iOS/Android

<!-- O que deve ser semanticamente idêntico vs. o que adapta ao canal web. -->

## Estratégia de teste

<!-- Unit (*.test co-localizado), integração (__tests__/*.spec), E2E Playwright em e2e/. -->

## Rollout

<!-- Feature flag, deploy web, rollback CDN/CI. -->

## Knowledge sources used

- Internal decision:
- Principle:
- Architecture docs:
- Market case (reference only):
- Limitation:
