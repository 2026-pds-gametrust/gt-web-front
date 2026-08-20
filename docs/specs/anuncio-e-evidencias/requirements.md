# Requirements — anuncio-e-evidencias

Status: APPROVED
Version: 0.1.0
Owner: agt-web-product-owner
Date: 2026-08-07

## Problema

Lucas precisa validar uma unidade usada com ordem canônica, selos explicáveis e TrustScore com motivos — sem verificação falsa. Rafael/Carlos precisam publicar com evidências mínimas e sem selo até aprovação.

## Usuário afetado / Personas

- Primária (leitura): Lucas · Contraste: Beatriz
- Primária (venda): Rafael · Contraste: Carlos

## Jornada

`/anuncio/:id` (ordem canônica) · `/vender` (wizard 5 passos → under_review).

## Resultado esperado

Detalhe com selos só GRANTED + explicação; TrustScore com motivos; wizard sem selo até approved.

## Regras de negócio

```text
BR-01: Ordem: fotos→preço/CTA→selos→entrega→defeitos→acessórios→specs→testes→vendedor→outras ofertas→semelhantes
BR-02: Selos só status GRANTED; clique explica limites
BR-03: TrustScore nunca como nota isolada sem nível/motivos no detalhe
BR-04: Submit vender → under_review; seals=[]
BR-05: quantity=1; Produto ≠ Oferta
```

## Critérios de aceite

```md
### AC-01 — Ordem canônica

Given Lucas em /anuncio/:id
When a página carrega
Then as seções seguem a ordem canônica

### AC-02 — Sem fake seal

Given anúncio sem verificação
When a seção Selos renderiza
Then copy honesta de ausência
And nenhum chip de verificação inventado

### AC-03 — Vender

Given Rafael no wizard
When envia o anúncio
Then estado under_review sem selos
```

## Fora do escopo

Checkout, disputa, pagamento, moderação real.

## Aprovação

```md
Status: APPROVED
Requirements version: 0.1.0
Approved by: agt-web-product-owner (mock Fase 1)
Date: 2026-08-07
Conditions: mock only
```
