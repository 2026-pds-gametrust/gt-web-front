# loop-w02-mock-domain

status: DONE  
orchestrator: TECHNICAL_DESIGN → IN_DEVELOPMENT → DONE

## goal

Entities `I*` + fixtures + MockApi alinhados a backend-entities.

## personas

N/A (infra)

## AC

- [x] Types: category, product, listing, search-document, seal, trust-score, evidence-item
- [x] Fixtures com e sem selos (nunca inventar verificação)
- [x] MockApi com mesma superfície que API futura
- [x] quantity=1; Produto ≠ Oferta nos dados

## agents

agt-web-architecture, agt-web-react-developer

## in / out / evidence

- out: `src/05-entities/*`, `src/06-shared/lib/mock-api`
- evidence: `mock-api.test.ts`; `docs/specs/mock-domain/design.md`
