# Requirements — ui-modernizacao-web

Status: APPROVED
Version: 1.0.0
Owner: agt-web-product-owner
Date: 2026-08-19

## Problema

A UI web é semanticamente correta, mas visualmente irregular: loading/erro/vazio diferem por página, o marketplace (home, busca, cartão, anúncio) tem pouca hierarquia e motion, e o shell operacional ainda comunica estados com texto cru. Isso atrasa comparação (Beatriz) e reduz confiança percebida (Lucas) sem adicionar verificação falsa.

## Usuário afetado / Personas

- Primária: Beatriz (comparação)
- Contraste: Lucas (validação cuidadosa)
- Operacional: Camila/André (moderação/admin)
- Auth/venda: Carlos

## Jornada

Discovery (home → busca → produto → anúncio) e gestão (vender, favoritos, perfil, moderação).

## Resultado esperado

Interface mais moderna e consistente, com motion CSS sutil, componentes shared de hero/empty/skeleton, e feedback de erro/sucesso via `FeedbackBanner` — sem alterar semântica de selos, TrustScore ou Produto ≠ Oferta.

## Regras de negócio

```text
BR-01: Selos só via SealBadge e apenas GRANTED.
BR-02: Patrocinado, se existir, nunca usa visual de selo.
BR-03: Motion respeita prefers-reduced-motion.
BR-04: Copy de auth anti-oráculo permanece.
BR-05: Ordem canônica da página do anúncio (11 blocos) não muda.
BR-06: Tailwind v4 permitido via tema `@theme` / tokens `--gt-*`; Framer Motion proibido.
```

## Critérios de aceite

```md
### AC-01 — Estados de loading e erro nas pages públicas

Given a utilizadora na home, busca, produto ou anúncio
When a rede está lenta ou falha
Then vê skeleton (não só texto) no loading
And no erro vê FeedbackBanner com ação de tentar de novo quando aplicável

### AC-02 — Cartão e rails

Given uma lista de ofertas
When o conteúdo carrega
Then os cartões entram com fade-up sutil e hover lift
And selos só via SealBadge
And favoritar/comparar stub continuam rotulados como em breve (não fingir ação)

### AC-03 — Página do anúncio

Given um anúncio válido
When a página renderiza
Then os 11 blocos canônicos permanecem na mesma ordem
And galeria tem transição leve ao trocar mídia

### AC-04 — Redução de movimento

Given prefers-reduced-motion: reduce
When qualquer animação desta feature rodaria
Then não há shake/stagger/shimmer contínuo

### AC-05 — Formulários operacionais

Given vender, moderação ou admin
When há erro ou sucesso de operação
Then a mensagem usa FeedbackBanner (ou FormField no campo)
And wizard de vender destaca o passo atual

### AC-06 — Header

Given visitante anônimo no header escuro
When vê Entrar / Criar conta
Then o contraste permanece legível (DEF-03 não regressa)
```

## Estados

initial, loading (skeleton), success, empty (EmptyState), server_error (banner + retry), validation_error (FormField), reduced-motion.

## Erros e comportamento com rede ruim

Erro de discovery: banner + retry. 404 de produto/anúncio: EmptyState, não o mesmo copy de falha de rede.

## Permissões e dados sensíveis

Sem mudança de autorização. Moderação continua gated.

## Métricas

Tempo até primeiro conteúdo útil na home/busca (qualitativo); redução de abandono em empty/erro (qualitativo).

## Fora do escopo

Checkout, favoritar real no cartão, pixel-perfect mobile nativo, lib de toast.

## Aprovação

```md
Status: APPROVED
Requirements version: 1.0.0
Approved by: agt-web-product-owner (esteira orquestrada)
Date: 2026-08-19
Conditions: paridade-visual.md intacta
```
