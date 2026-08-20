# loop-w06-listing-detail

status: DONE  
orchestrator: IN_DEVELOPMENT → APP_EXECUTION → PERSONA_VALIDATION → DONE

## goal

Anúncio na ordem canônica + selos explicáveis + TrustScore com motivos.

## personas

Primária: Lucas · Contraste: Beatriz

## AC

- [x] Ordem: fotos→preço→selos→entrega→defeitos→acessórios→specs→testes→vendedor→outras ofertas→semelhantes
- [x] Selos só se GRANTED no mock; com data
- [x] TrustScore com nível + motivos (nunca nota isolada)
- [x] Sem fingir verificação

## agents

agt-web-react-developer, agt-persona-simulator

## in / out / evidence

- out: `src/02-pages/listing`, `entities/seal/ui`, `entities/trust-score/ui`
- evidence: specs anuncio-e-evidencias; entity UI tests
