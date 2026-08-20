# Technical Design — app-shell

Status: APPROVED
Version: 0.1.0
Owner: agt-web-architecture
Requirements version: 0.1.0
Date: 2026-08-07

## Mapa FSD

```text
Page:      (todas as pages 02-pages/* envolvem AppShell)
Widgets:   src/03-widgets/app-shell/app-shell.tsx
Features:  —
Entities:  —
Shared:    src/06-shared/styles/{index.css,tokens.css,base.css,motion.css}
           public/brand/gametrust-logo.png
```

## Navegação

`react-router-dom` NavLink; rotas stub `/em-breve/:topic`. Brand Link → `/`.

## Ownership do estado

Nenhum. Shell é presentational.

## Integração com API

Nenhuma.

## Layout responsivo

Header sticky; nav wrap; breakpoints Tailwind `nav` (760px) / `panel` (720px).

## Acessibilidade técnica

`aria-label` no brand e na nav; foco visível com outline laranja; logo com texto oculto acessível.

## Paridade com iOS/Android

Mesmos rótulos/destinos; HTML/CSS adapta layout.

## Estratégia de teste

Cobertura indireta via `home-page.test.tsx`; visual via W08.

## Knowledge sources used

- Brand: `images/gametrust-logo.png` → tokens #F84000 / #181818 / #F5F5F5
- Fonts: Exo 2 (display) + Rajdhani (UI)
- Paridade: `docs/design-system/paridade-visual.md`
