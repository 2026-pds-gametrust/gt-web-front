# Requirements — app-shell

Status: APPROVED
Version: 0.1.0
Owner: agt-web-product-owner
Date: 2026-08-07

## Problema

Compradores e vendedores precisam de navegação canônica e identidade de marca coerente em todas as páginas do mock web, sem inventar destinos fora do escopo.

## Usuário afetado / Personas

- Primária: Lucas (orientação no shell)
- Contraste: Beatriz (atalhos rápidos para Buscar)

## Jornada

Entrada em qualquer rota → orientação via nav → destino P1 ou placeholder “em breve”.

## Resultado esperado

Shell com logo real, tokens de marca e nav com rótulos/destinos alinhados à paridade visual.

## Regras de negócio

```text
BR-01: Rótulos canônicos: Início, Buscar, Categorias, Favoritos, Vender, Compras e vendas, Notificações, Perfil
BR-02: Itens fora de escopo P1 → /em-breve/* com copy honesta
BR-03: Tokens em 06-shared; CTAs em laranja de marca (#F84000); sem verde de accent legado
BR-04: Logo acessível (img + texto para AT)
```

## Critérios de aceite

```md
### AC-01 — Nav canônica

Given o usuário em qualquer página com AppShell
When inspeciona a nav Principal
Then vê os oito rótulos canônicos
And alvos de toque/foco ≥44px

### AC-02 — Marca

Given o header
When carrega
Then exibe `/brand/gametrust-logo.png`
And o nome GamerTrust permanece acessível a leitores de tela
```

## Estados

initial (shell sempre presente); loading/erro ficam nas pages filhas.

## Fora do escopo

Auth real, notificações, favoritos, perfil.

## Aprovação

```md
Status: APPROVED
Requirements version: 0.1.0
Approved by: agt-web-product-owner (mock Fase 1)
Date: 2026-08-07
Conditions: mock only
```
