# loop-w07-sell-listing

status: DONE  
orchestrator: IN_DEVELOPMENT → APP_EXECUTION → PERSONA_VALIDATION → DONE

## goal

Wizard Vender stub (5 passos) + estados draft→under_review; sem selo até aprovado.

## personas

Primária: Rafael · Contraste: Carlos

## AC

- [x] Passos: identificar → descrever → preço → evidências → revisão
- [x] Estados mock: draft, under_review, changes_requested, approved
- [x] Nenhum selo na UI até approved
- [x] Rascunho sobrevive a navegação no fluxo (Zustand)

## agents

agt-web-react-developer

## in / out / evidence

- out: `src/02-pages/sell`, `useSellStore`
- evidence: `mock-api.test.ts` submit seals=[]
