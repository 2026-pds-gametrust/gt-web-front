# Accessibility Report — busca-e-descoberta

Result: APPROVED
Owner: agt-accessibility
Platform: Chrome + teclado (mock Fase 1)
Date: 2026-08-07

## Checklist

| Item | Status | Observação |
|---|---|---|
| Nome acessível (label / aria-label) | PASS | Brand, nav, cards, search |
| Roles | PASS | `role="search"` na home |
| Ordem de foco / leitura | PASS | Header → main |
| Teclado completo | PASS | Nav, busca, chips, sugestões |
| Contraste | PASS | Carbon #181818 / laranja #F84000 em superfícies claras |
| Área de clique/toque (≥44px) | PASS | Nav, botões, input busca |
| Feedback não baseado só em cor | PASS | Patrocinado textual; selos com label |
| Erros anunciados | PARTIAL | Empty state textual; sem live region de erro API |

## Findings

- A11Y-01 [minor]: Empty/erro de busca poderia usar `aria-live` — não bloqueante no mock.

## Recommendations

Adicionar `aria-live` em estados de erro da search store na próxima iteração.

## Knowledge sources used

- Paridade visual / a11y playbook GamerTrust
- Brand tokens do logo
