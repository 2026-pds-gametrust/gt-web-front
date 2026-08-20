---
produto: GamerTrust
tipo: anti-personas
status: ativo
ultima_revisao: 2026-08-07
tags:
  - gamertrust
  - anti-personas
  - abuso
  - confianca
  - fraude
---

# GamerTrust - Anti-personas e casos de abuso

## Objetivo

Anti-personas representam comportamentos que tentam explorar o marketplace. Elas não devem orientar a experiência principal, mas precisam ser consideradas para que recursos úteis não criem oportunidades de golpe, manipulação ou assédio.

Não usar estes perfis para tratar todo usuário como suspeito. A proteção deve ser proporcional e preservar vendedores e compradores legítimos.

## Anti-persona 1 - Vendedor de produto inexistente

### Objetivo

Publicar item que não possui usando fotos, vídeos ou dados de terceiros.

### Comportamentos

- Reutiliza mídia encontrada na internet.
- Tenta evitar código e instruções específicas.
- Cria urgência e preço muito abaixo do mercado.
- Busca levar pagamento para fora.
- Abandona conta quando é questionado.

### Superfícies exploradas

- Criação de anúncio.
- Evidências.
- Chat ou negociação.
- Pagamento externo.
- Conta nova.

### Guardrails de produto

- Desafio temporário associado ao anúncio.
- Evidências recentes e específicas.
- Alerta em mídia repetida.
- Limites proporcionais para conta nova.
- Avisos contra pagamento externo.
- Preço anormal acompanhado de cautela, sem acusação automática.
- Caminho rápido de denúncia.

## Anti-persona 2 - Vendedor que oculta defeito

### Objetivo

Vender produto real omitindo desgaste, reparo ou falha intermitente.

### Comportamentos

- Escolhe ângulos que escondem danos.
- Usa descrição vaga.
- Faz apenas teste mínimo.
- Pressiona retirada sem conferência.
- Tenta interpretar selo como garantia total.

### Guardrails de produto

- Perguntas específicas por categoria.
- Fotos orientadas de áreas críticas.
- Declaração explícita de reparos e defeitos.
- Checklist de funcionamento.
- Resumo público do que foi e não foi revisado.
- Checklist de recebimento.
- Contestação vinculada ao anúncio original.

## Anti-persona 3 - Comprador de falsa contestação

### Objetivo

Receber produto correto e tentar obter reembolso indevido, troca de peça ou vantagem.

### Comportamentos

- Alega item diferente sem evidência consistente.
- Substitui acessório ou componente.
- Abre múltiplas contestações semelhantes.
- Pressiona vendedor fora do fluxo.

### Guardrails de produto

- Registro da versão comprada e acessórios.
- Evidência de entrega ou retirada.
- Checklist dos dois lados.
- Solicitação proporcional de evidências.
- Histórico de contestações sem condenação automática.
- Direito de resposta do vendedor.
- Revisão humana para caso ambíguo.

## Anti-persona 4 - Golpista de pagamento externo

### Objetivo

Convencer a outra parte a pagar, entregar ou compartilhar dados fora da proteção.

### Comportamentos

- Envia comprovante falso.
- Solicita e-mail, telefone ou link externo.
- Cria urgência.
- Afirma que a plataforma está com problema.
- Pede taxa adicional inesperada.

### Guardrails de produto

- Estado de pagamento inequívoco.
- Mensagem “pode entregar” somente após confirmação real.
- Avisos contextuais quando alguém tenta sair do fluxo.
- Nenhuma confirmação baseada em imagem de comprovante.
- Denúncia de mensagem ou usuário.
- Educação curta no momento de risco.

## Anti-persona 5 - Manipulador de reputação

### Objetivo

Criar avaliações, transações ou contas coordenadas para aumentar TrustScore ou prejudicar concorrentes.

### Comportamentos

- Avaliações combinadas.
- Transações de baixo valor sem finalidade real.
- Contas relacionadas.
- Denúncias em massa.
- Repetição de comentários.

### Guardrails de produto

- Avaliação apenas após transação concluída.
- TrustScore composto por vários fatores.
- Peso proporcional ao histórico e contexto.
- Detecção e revisão de padrões coordenados.
- Não expor regras detalhadas que facilitem manipulação.
- Direito de recurso.

## Anti-persona 6 - Anunciante enganoso

### Objetivo

Comprar visibilidade para oferta pouco relevante ou arriscada, fazendo-a parecer recomendação orgânica.

### Comportamentos

- Usa palavras-chave não relacionadas.
- Duplica anúncios.
- Tenta imitar selos na imagem.
- Esconde defeito no título ou foto.
- Usa publicidade para superar baixa qualidade.

### Guardrails de produto

- Patrocinado sempre identificado.
- Relevância mínima mesmo em publicidade.
- Selos oficiais separados do conteúdo do vendedor.
- Duplicidade controlada.
- Confiança e alertas não podem ser removidos por pagamento.

## Anti-persona 7 - Coletor abusivo de dados

### Objetivo

Obter contato, localização, mídia privada ou informações pessoais para uso fora da finalidade.

### Comportamentos

- Tenta acessar endereço antes da compra.
- Solicita documentos ou contato.
- Coleta muitas páginas e perfis.
- Reutiliza fotos e descrições.
- Explora evidências privadas.

### Guardrails de produto

- Exposição progressiva de localização.
- Evidências completas não são públicas.
- Dados pessoais removidos de imagens públicas.
- Contato direto restrito ao momento necessário.
- Denúncia e bloqueio.
- Limitação de comportamento incompatível com uso humano.

## Casos de abuso por feature

| Feature | Abuso provável | Pergunta obrigatória |
| --- | --- | --- |
| Busca | Palavra-chave enganosa e duplicidade | Resultado relevante e único? |
| Oferta recomendada | Manipulação por publicidade ou reputação | Critério visível e justo? |
| Alertas | Spam e falsa urgência | Existe mudança real? |
| Chat | Pagamento externo e assédio | Há prevenção, denúncia e bloqueio? |
| Evidências | Reuso, edição e exposição pessoal | É recente, suficiente e privada? |
| TrustScore | Jogo de métrica | Composição resiste a coordenação? |
| Avaliação | Retaliação e conluio | Origina de transação real? |
| Retirada | Exposição de endereço e coerção | Dados aparecem no momento certo? |
| Contestação | Reembolso indevido ou intimidação | Ambos têm voz e evidência proporcional? |
| IA | Acusação ou confiança falsa | Existe explicação, limite e revisão? |

## Regras para agentes

Ao avaliar uma feature:

1. Selecione o abuso mais provável.
2. Descreva como ele exploraria a experiência.
3. Proponha prevenção proporcional.
4. Preserve o caminho da persona legítima.
5. Defina detecção, recuperação e recurso.
6. Evite revelar detalhes que facilitem contornar controles.
7. Verifique falsos positivos sobre vendedores novos.

## Critério de qualidade

Uma proteção é inadequada se:

- transforma todo usuário em suspeito;
- impede recuperação de erro legítimo;
- depende apenas de punição depois do prejuízo;
- não permite revisão ou recurso;
- oculta o motivo da ação quando poderia explicá-lo;
- expõe mais dados para tentar gerar confiança;
- prejudica desproporcionalmente uma persona legítima.
