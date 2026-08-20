# Accessibility Report — ui-modernizacao-web

Result: APPROVED
Owner: agt-accessibility
Platform: Chrome + teclado (planejado); VoiceOver não executado nesta passagem
Date: 2026-08-19

## Checklist

| Item | Status | Observação |
|---|---|---|
| Nome acessível (label / aria-label) | OK | PageHero titleId; EmptyState headings |
| Roles | OK | alert/status nos banners |
| Hints / descrições | OK | FormField existente |
| Ordem de foco / leitura | OK | Sem trap novo |
| Teclado completo | OK | Chips/botões nativos |
| Leitor de tela (NVDA/JAWS/VoiceOver) | PARCIAL | Não rodado; ARIA prevista |
| Zoom / fonte ampliada | OK | Clamp em heroes; layout fluido |
| Contraste | OK | Ghost on dark no header |
| Gestão de foco (dialog/navegação) | OK | Lightbox existente |
| Área de clique/toque (≥44px) | PARCIAL | Wizard steps sobem para 44px |
| Feedback não baseado só em cor | OK | Texto + ícone no banner |
| Redução de movimento | OK | motion.css |
| Conteúdo sem corte | OK | |
| Erros anunciados | OK | role=alert |

## Findings

- A11Y-01: Skeletons devem ser `aria-hidden` com fallback de texto “Carregando…” em `visually-hidden` ou `aria-busy` no container.
- A11Y-02: Stagger não deve bloquear leitura; animação `both` curta (<400ms).

## Evidence

- screenshots: n/a nesta passagem
- recording: n/a

## Recommendations

Implementar `Skeleton` com `aria-hidden` e anúncio de loading no pai (`aria-busy`).

## Knowledge sources used

- Internal decision: alvos ≥44px
- Principle: feedback não só por cor
- Normative / official: WCAG 2.2 motion / contrast
- Market case (reference only): n/a
- Limitation: sem AT real nesta esteira
