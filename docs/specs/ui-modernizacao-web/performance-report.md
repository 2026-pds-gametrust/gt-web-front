# Performance Report — ui-modernizacao-web

Result: PASS_WITH_RISKS
Owner: agt-web-performance
Device / browser: desktop médio (análise estática)
Build version: frontend-web HEAD
Date: 2026-08-19

## Medições

| Métrica | Resultado | Aceitável? |
|---|---|---|
| LCP | não medido (Lab) | — |
| INP | animações só transform/opacity | sim (desenho) |
| CLS | skeletons com altura fixa de card | sim (desenho) |
| TTFB | n/a | — |
| Bundle (JS gzip) | sem lib de motion | sim |
| Tempo até interação | CSS only | sim |
| Listas (scroll) | rails overflow-x existente | sim |
| Imagens | galeria com key no src | sim |
| Chamadas de rede repetidas | inalteradas | sim |
| Lighthouse Performance | não rodado | risco |

## Findings

- PERF-01: Stagger em até 8 itens; sem animar layout (width/height).
- PERF-02: Shimmer desliga com reduced-motion.

## Evidence

Revisão de `motion.css` e ausência de Framer Motion/Tailwind.

## Recommendations

Rodar Lighthouse na home/busca após `yarn dev` em rede real.
