# Persona Review — ui-modernizacao-web

Result: PERSONA_REVIEW_COMPLETED
Owner: agt-persona-simulator
Date: 2026-08-19

## Beatriz — Comparar ofertas na busca e na home

Platform: desktop web

### Completion

- completed (simulação): encontra busca, chips e cartões; fricção em loading/empty.

### Friction points

- Loading textual não ajuda a comparar enquanto espera.
- Filtros sem feedback de hover/active além da cor.

### Potential mistakes

- Confundir agrupamento por produto com oferta se o cartão não destacar modelo.

### Trust concerns

- Baixo, se selos continuarem só via SealBadge.

### Probable abandonment point

- Busca vazia sem CTA clara após erro de rede.

### Recommendations

- Skeleton + stagger nos cards; empty com CTA; chips com transição.

## Lucas — Validar anúncio antes de favoritar

Platform: desktop web

### Completion

- completed (simulação): ordem canônica presente; loading do anúncio é fraco.

### Friction points

- “Carregando anúncio…” sem estrutura da página.
- 404 só com link, sem EmptyState padronizado.

### Potential mistakes

- Interpretação de CTA “Compra protegida” desabilitada — copy já explica mock.

### Trust concerns

- Motion não pode parecer selo concedido.

### Probable abandonment point

- Erro silencioso se listing falha (hoje cai em “não encontrado”).

### Recommendations

- Distinguir 404 vs erro de rede; skeleton da galeria + preço.

## Carlos — Publicar anúncio

Platform: desktop web

### Completion

- completed (simulação): wizard funciona; passos pouco visíveis.

### Friction points

- Indicadores de passo pequenos; campos sem FormField.

### Potential mistakes

- Pular evidências se o passo atual não for óbvio.

### Trust concerns

- Banner de sucesso não deve implicar selo.

### Probable abandonment point

- Erro no último passo só como texto.

### Recommendations

- Highlight do passo atual; FormField; FeedbackBanner já usado no submit.

## Camila — Fila de moderação

Platform: desktop web

### Completion

- completed (simulação): layout denso ok para desktop.

### Friction points

- Loading da fila é texto; mensagem de ação em parágrafo.

### Potential mistakes

- Perder o resultado da ação se não for banner.

### Trust concerns

- Não conceder selo visual na UI da fila.

### Probable abandonment point

- Fila vazia/erro sem retry.

### Recommendations

- Skeleton da fila; FeedbackBanner em opsMessage.

## Knowledge sources used

- Persona files: docs/personas/ (Lucas, Beatriz, Carlos, Camila)
- Internal decision: canal web = comparação e gestão
- Principle: confiança > volume
- Market case (reference only): n/a
- Simulation limitations: sem sessão real de backoffice nesta passagem
