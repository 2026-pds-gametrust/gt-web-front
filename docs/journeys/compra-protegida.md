# Compra protegida

## Objetivo

Levar o comprador da validação da oferta até o pagamento protegido com clareza do que foi verificado, proteções e o que ainda depende dele.

## Precondições

- Oferta com selos/TrustScore coerentes com o protocolo
- Fluxo de pagamento disponível (ou mock de proteção)
- Preferência v1: uma compra por transação

## Passos

1. Abrir página do anúncio e percorrer a ordem canônica (fotos → preço/CTA → selos → proteção → defeitos → …).
2. Tocarselecionar selos e ler limitações + data da revisão.
3. Confirmar entrega/retirada e proteção antes do CTA de compra.
4. Iniciar compra/pagamento protegido.
5. Observar confirmação, estados de erro/retry e ausência de cobrança duplicada.
6. (Opcional) Iniciar contestação a partir do pós-compra.

## Estados esperados

- browsing_offer, confirming_protection, payment_loading, payment_success, payment_error, retrying, contested

## Erros possíveis

- CTA de compra antes de expor proteção/defeitos
- Linguagem de “risco zero”
- Timeout de pagamento sem idempotência
- Selos sem explicação

## Analytics

- offer_viewed, trust_badge_opened, checkout_started, payment_succeeded, payment_failed, dispute_opened

## Personas relevantes

- Primária: Mariana (iniciante) ou Lucas (cauteloso)
- Contraste: Carlos (retirada) / Rafael (vendedor)
- Restrição: conexão instável no pagamento

## Critérios críticos

- Antes do pagamento: o que foi verificado, quando, defeitos, proteção
- Nunca fingir verificação
- Feedback acionável em falha de rede
- Paridade de conteúdo de confiança Web ↔ iOS ↔ Android

## Paridade visual

Ordem da página do anúncio e semântica de proteção idênticas nos dois apps.
