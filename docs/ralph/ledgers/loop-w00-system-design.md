# Ledger — Loop W00: System design

## Status
**DONE**

## Objetivo
Publicar o system design canônico do frontend-web mock (Fase 1) e o índice de loops W00–W08, sem código de aplicação.

## Personas
- Primária (docs): Beatriz / Lucas (busca); Rafael / Carlos (vender)
- Contraste: velocidade vs validação; venda ocasional vs frequente

## Critérios de aceite
1. `docs/system-design/frontend-web-mock.md` cobre visão mock, rotas, FSD, Zustand, MockApi/`I*`, confiança, Pichau/ML, swap, índice W00–W08 e Mermaid.
2. Ledgers W00–W08 + README de índice existem sob `docs/ralph/ledgers/`.
3. Rotas canônicas: `/`, `/buscar`, `/produto/:productId`, `/anuncio/:listingId`, `/vender`.
4. Produto ≠ Oferta e semântica de selos/TrustScore/Patrocinado explícitas.
5. Plano mock→API real sem rewrite de pages/widgets.
6. Nenhum código de app alterado neste loop.
7. Prosa em pt-BR.

## Agentes
| Agente | Papel |
|--------|--------|
| `agt-web-orchestrator` | Entrega artefatos e marca W00 DONE |
| `agt-web-architecture` | Consulta (FSD / http) — referência |
| `agt-web-product-owner` | Alinhamento de escopo mock |

## Estado orquestrador
`DISCOVERY` → `TECHNICAL_DESIGN` → **`REQUIREMENTS_APPROVED`** (handoff pronto para W01)

## In / Out / Evidência
| | |
|--|--|
| **In** | `ARCHITECTURE.md`, `docs/backend-entities/`, benchmarks, paridade-visual, product context |
| **Out** | `frontend-web-mock.md`, README ledgers, loop-w00…w08 |
| **Evidência** | Arquivos versionados nos paths acima; W00 status DONE |

## Resultado
Handoff W00 concluído; próximo loop **W01**.
