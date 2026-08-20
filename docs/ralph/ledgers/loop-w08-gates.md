# loop-w08-gates

status: DONE  
orchestrator: QA_VALIDATION → PERSONA_VALIDATION → VISUAL_REVIEW → READY_FOR_RELEASE → DONE

## goal

Critical journey review (busca + vender), a11y, visual parity, fechar ledgers.

## personas

Lucas, Beatriz, Rafael (+ baixa-visão / conexão-instável se aplicável)

## AC

- [x] Happy path busca e vender documentados
- [x] Estados erro/empty exercitados
- [x] Gate a11y básico (foco, labels, contraste)
- [x] Ledgers W01–W07 DONE; system design as-built

## agents

agt-web-qa, agt-accessibility, agt-visual-review, agt-web-react-developer

## in / out / evidence

- out: QA/a11y/visual reports em `docs/specs/busca-e-descoberta` e `anuncio-e-evidencias`
- evidence: `yarn test:unit` + `yarn build`; brand tokens no system design
