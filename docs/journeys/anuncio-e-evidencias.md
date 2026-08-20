# Criação de anúncio e evidências

## Objetivo

Orientar o vendedor a identificar o produto, descrever a unidade, precificar com faixa e enviar evidências sem frustração — até revisão/publicação.

## Precondições

- Conta de vendedor (ou fluxo de cadastro concluído)
- Permissões de câmera quando o cenário incluir captura
- Roteiro de evidências por categoria disponível (real ou mock)

## Passos

1. Entrar em **Vender**.
2. Identificar o produto (nome, modelo, código ou imagem “provável até confirmação”).
3. Descrever condição, defeitos, acessórios, entrega/garantia.
4. Ver faixa de preço sugerida (faixa, não imposição).
5. Seguir roteiro de evidências (código no frame, fotos, vídeo/testes).
6. Revisar resumo, pendências e enviar para análise.
7. Observar estados de moderação (em análise, correção solicitada, aprovado com selos + data).

## Estados esperados

- draft, identifying_product, pricing, capturing_evidence, submitting, under_review, changes_requested, approved, rejected

## Erros possíveis

- Evidência incompleta sem indicar o que falta
- IA acusando fraude sem revisão humana
- Selos aplicados sem processo concluído
- Perda do rascunho após falha de rede

## Analytics

- listing_started, product_identified, evidence_step_completed, listing_submitted, listing_approved

## Personas relevantes

- Primária: Rafael (recorrente) ou Carlos (ocasional)
- Contraste: Camila (moderação)
- Anti-persona: abuso de evidências falsas ([anti-personas](../personas/GamerTrust-Anti-Personas-e-Casos-de-Abuso.md))

## Critérios críticos

- Progresso claro do que falta antes de enviar
- Correções levam ao campo/evidência correspondente
- Nunca inventar atributos do produto
- Após aprovação: selos com data e limitações

## Paridade visual

Mesmo fluxo e semântica de selos/progresso em Web, iOS e Android; captura de evidências usa APIs nativas de câmera nos apps (web pode orientar ou redirecionar).
