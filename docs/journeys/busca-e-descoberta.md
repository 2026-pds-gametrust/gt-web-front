# Busca e descoberta

## Objetivo

Permitir que o comprador encontre o produto certo com risco, condição e custo total compreensíveis — não apenas o preço mais baixo.

## Precondições

- Frontend web (desktop/mobile) ou apps nativos com sessão anônima ou autenticada
- Catálogo com produtos e ofertas (ou mocks fiéis ao contrato)
- Paridade visual aplicada ([paridade-visual.md](../design-system/paridade-visual.md))

## Passos

1. Abrir Início e focar a busca dominante.
2. Digitar termo parcial (ex.: `rtx 40`) e observar sugestões (modelos, categorias, intenções).
3. Selecionar sugestão ou submeter busca.
4. Alternar visualização agrupada por produto ↔ ofertas individuais.
5. Aplicar filtros; confirmar chips removíveis e ausência de “sumiço” silencioso de resultados.
6. Abrir um cartão e validar ≤3 diferenciais, selos tocáveis e TrustScore com motivos.
7. Voltar e confirmar preservação de termo, filtros e posição de scroll.
8. (Opcional) Simular zero resultados e verificar alternativas/alerta.

## Estados esperados

- initial, typing_suggestions, loading, success, empty_with_guidance, filter_applied, offline_or_slow, retrying

## Erros possíveis

- Timeout de busca sem retry
- Filtro que zera resultados sem explicação
- Patrocinado sem rótulo
- Selo de verificação em oferta não verificada

## Analytics

- search_submitted, suggestion_selected, filter_applied, result_opened, zero_results_shown

## Personas relevantes

- Primária: Lucas (cauteloso) ou Beatriz (comparadora)
- Contraste: Mariana (iniciante)
- Restrição: baixa visão / conexão instável conforme cenário

## Critérios críticos

- Ordenação padrão: Mais relevantes
- Produto ≠ Oferta visível
- Nunca tela vazia sem orientação
- Confiança explicável no cartão

## Paridade visual

Mesma hierarquia e semântica em Web, iOS e Android; só componentes do canal podem diferir.
