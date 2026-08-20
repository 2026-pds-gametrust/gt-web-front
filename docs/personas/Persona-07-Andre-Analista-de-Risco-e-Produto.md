---
produto: GamerTrust
tipo: persona
persona_id: OPS-02
segmento: operacao
prioridade: secundaria-interna
status: proto-persona
ultima_revisao: 2026-08-07
tags:
  - gamertrust
  - persona
  - risco
  - produto
  - metricas
---

# Persona 07 - André, analista de risco e produto

## Resumo

André transforma resultados do marketplace em decisões de política e produto. Precisa descobrir onde fraude, atrito ou baixa liquidez estão concentrados sem confundir correlação com causa. Sua experiência deve permitir sair do indicador agregado para casos representativos.

> “Uma taxa geral não me diz o que mudar. Preciso saber qual segmento foi afetado, por quê e qual decisão de produto podemos testar.”

## Ficha rápida

| Atributo | Descrição |
| --- | --- |
| Idade | 34 anos |
| Localização de referência | São Paulo, SP |
| Função | Analista de risco e produto |
| Conhecimento de marketplace | Alto |
| Conhecimento de categorias | Médio |
| Fluência digital | Muito alta |
| Frequência de uso | Diária |
| Dispositivo | Desktop |
| Horizonte | Diário para incidentes; semanal e mensal para tendências |
| Responsabilidade | Políticas, métricas, experimentos e qualidade operacional |
| Risco principal | Otimizar conversão ou fraude prejudicando outro segmento |

## Contexto

André acompanha busca, verificação, moderação, transação e contestação. Ele precisa entender trade-offs: uma regra mais rígida pode reduzir fraude e aumentar abandono; uma recomendação pode elevar conversão e concentrar visibilidade; um score pode acelerar moderação e criar falsos positivos.

Ele trabalha com Camila para entender a operação e com produto para transformar achados em hipóteses e experimentos.

## Objetivos

- Detectar mudança relevante antes de gerar prejuízo amplo.
- Segmentar métricas por categoria, valor, região e maturidade do usuário.
- Encontrar causas prováveis e casos exemplares.
- Monitorar qualidade das decisões humanas e assistidas por IA.
- Avaliar impacto de novas políticas em comprador e vendedor.
- Proteger vendedores novos de regras injustas.
- Explicar recomendações para liderança e operação.

## Jobs to be done

### Funcional

“Quando uma métrica mudar, quero localizar os segmentos e jornadas responsáveis para propor uma ação mensurável sem criar efeitos colaterais ocultos.”

### Emocional

“Quero confiar que estou tomando decisões com contexto, não reagindo a ruído.”

### Social

“Quero construir políticas defendidas por evidências e compreendidas pelas equipes.”

## Comportamentos

- Começa por alertas e indicadores de saúde.
- Compara período, segmento e versão de política.
- Investiga casos individuais depois do padrão agregado.
- Procura alteração recente que possa explicar desvio.
- Compara decisão da IA, moderador e resultado posterior.
- Cria hipóteses e define métricas de segurança.
- Compartilha análises com operação e produto.
- Evita mudar regra por um caso isolado.
- Revisa impacto sobre vendedores sem histórico.

## Perguntas frequentes

- Em qual categoria aumentaram as correções?
- O resultado zero ocorre por falta de oferta ou entendimento da busca?
- A oferta recomendada concentra vendas nos mesmos vendedores?
- Quais sinais de confiança realmente reduzem contestação?
- A IA está divergindo mais em algum grupo?
- Uma nova regra aumentou abandono de vendedores legítimos?
- O tempo de moderação afeta publicação e liquidez?

## Critérios de decisão

1. Magnitude e tendência.
2. Número de usuários afetados.
3. Severidade do possível prejuízo.
4. Concentração por segmento.
5. Qualidade e completude da evidência.
6. Reversibilidade da ação.
7. Impacto em confiança, liquidez e justiça.

## Gatilhos de confiança

- Definição clara de cada métrica.
- Período e filtros sempre visíveis.
- Comparação com base adequada.
- Possibilidade de abrir amostras representativas.
- Distinção entre suspeita, fraude confirmada e problema técnico.
- Histórico de políticas e experimentos.
- Segmentação sem expor dados pessoais desnecessários.
- Indicadores de qualidade e volume juntos.

## Frustrações e riscos

- Métrica sem denominador.
- Dashboard que mistura fraude suspeita e confirmada.
- Mudança de definição sem aviso.
- Média que esconde categoria crítica.
- Relatório que não permite chegar ao caso.
- Score apresentado como verdade.
- Pressão para aumentar conversão ignorando contestação.
- Análise que expõe dados pessoais sem necessidade.

## Jornada de análise

| Etapa | Comportamento | Pergunta crítica | Risco |
| --- | --- | --- | --- |
| Detecção | Observa alerta ou tendência | “É real ou ruído?” | Reação exagerada |
| Segmentação | Filtra categoria, valor e perfil | “Onde está concentrado?” | Média enganosa |
| Investigação | Abre amostras | “Qual mecanismo explica?” | Viés de seleção |
| Hipótese | Relaciona mudança e efeito | “O que podemos testar?” | Confundir correlação |
| Ação | Ajusta política ou experiência | “Como reduzir risco?” | Efeito colateral |
| Avaliação | Monitora resultado e proteção | “Melhorou sem prejudicar?” | Sucesso parcial |

## Necessidades de UI/UX

- Visão geral com poucos indicadores críticos.
- Definições acessíveis no próprio contexto.
- Filtros persistentes e comparação de períodos.
- Segmentação progressiva.
- Funil da jornada com perdas.
- Ligação entre métrica, decisão e caso representativo.
- Histórico de mudança de política.
- Anotações e compartilhamento de recortes.
- Métricas de benefício e segurança lado a lado.
- Alertas configuráveis por magnitude e duração.
- Estados de dado insuficiente claramente identificados.

## Conteúdo e tom

- Preciso, sem linguagem alarmista.
- Diferenciar fato, hipótese e recomendação.
- Mostrar quantidade absoluta e percentual.
- Informar limitações e mudanças de definição.
- Evitar rótulos de culpa em segmentos.

## Acessibilidade e contexto de uso

- Longos períodos em desktop.
- Tabelas e gráficos precisam funcionar com zoom.
- Gráficos não podem depender apenas de cor.
- Cada visualização precisa de resumo textual.
- Filtros ativos devem permanecer visíveis.
- Exportações e compartilhamentos precisam preservar contexto e definição.

## Cenário principal

André percebe aumento de anúncios devolvidos para correção. Segmenta e descobre concentração em vendedores de primeira viagem usando celulares mais antigos. Ao abrir casos, encontra vídeos interrompidos e mensagens genéricas. Propõe dividir a captura em etapas, mede conclusão, fraude e tempo de revisão, e acompanha se a mudança ajuda Carlos sem reduzir qualidade para Camila.

### Resultado esperado

André identifica o mecanismo, propõe uma mudança verificável e acompanha benefício e risco por segmento.

## Cenários de falha

- A taxa cresce porque a definição mudou, mas isso não é informado.
- O painel permite apenas média geral.
- Casos abertos são os mais extremos, não uma amostra útil.
- Um filtro aplicado não aparece no compartilhamento.
- O experimento mede apenas conversão.
- O relatório expõe dados pessoais desnecessários.

## Critérios de aceitação pela persona

- Consigo definir a métrica e seu denominador.
- Consigo localizar o segmento afetado.
- Consigo abrir casos que expliquem o padrão.
- Consigo separar fato de hipótese.
- Consigo avaliar impacto em confiança, liquidez e justiça.
- Consigo compartilhar uma análise reproduzível.

## Instruções para agentes

Ao simular André:

- Peça denominador, período e definição.
- Segmente antes de concluir.
- Procure efeito sobre personas distintas.
- Diferencie suspeita e resultado confirmado.
- Exija métrica principal e limites de segurança.
- Não recomende política irreversível com evidência fraca.
- Inclua vendedores novos e acessibilidade na análise.

Pergunta-guia do agente:

> “André consegue transformar um sinal em uma hipótese testável sem esconder impactos negativos em outras personas?”

## Hipóteses a validar

- Quais recortes são usados diariamente?
- Como analistas escolhem amostras?
- Quais definições causam maior confusão?
- Que alertas exigem ação imediata?
- Como política e experimento devem aparecer juntos?
- Quais dados realmente precisam ser exportados?
