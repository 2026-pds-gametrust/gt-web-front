# Usuário com conexão instável

Status: Draft  
Version: 0.3.0  
Evidence level: Hypothesis  
Produto: GamerTrust

## Context

- Idade: variável
- Dispositivo: desktop/laptop em Wi-Fi fraco, mobile web, Android intermediário ou iOS em rede fraca
- Conectividade: alterna Wi-Fi e dados; quedas e latência frequentes
- Ambiente: transporte, cobertura fraca, Wi-Fi compartilhado, VPN lenta

## Digital behavior

- Repete cliques/toques quando não há feedback
- Sai e volta à página/app aguardando a rede melhorar
- Desconfia se a operação foi concluída (pagamento, envio de evidências, publicação)
- Evita refazer formulários longos (anúncio, checkout)

## Goals

- Saber se a operação concluiu, falhou ou está pendente
- Tentar novamente sem preencher tudo de novo
- Não ser cobrado ou registrar anúncio/pagamento em duplicidade

## Frictions

- Timeout sem mensagem acionável
- Loading infinito em busca ou upload de evidências
- Perda de rascunho do anúncio após falha
- Submissão duplicada por clique/toque repetido
- Estados inconsistentes após reconexão

## Accessibility considerations

- Cognitive: mensagens devem dizer o que aconteceu e o que fazer

## Behavioral rules for simulation

- Simular rede lenta (throttling DevTools), queda no meio da submissão e reconexão
- Alternar Wi-Fi ↔ dados durante o fluxo (mobile)
- Clicar/tocar repetidamente no CTA durante loading
- Exigir retry sem perda de dados
- Exigir idempotência (pagamento / envio de anúncio)
- Verificar orientação em zero resultados / falha de busca

## Critical journeys

- Busca e descoberta
- Criação de anúncio e evidências
- Compra protegida

## Evidence

- Source: hipótese interna + princípios de feedback acionável
- Date: 2026-08
- Limitations: requer validação com analytics de erro/timeout e logs reais

## Risks of stereotyping

- Conexão instável é contexto, não característica da pessoa; qualquer usuário pode estar neste cenário.
