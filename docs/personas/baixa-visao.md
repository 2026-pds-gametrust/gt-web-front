# Usuário com baixa visão

Status: Draft  
Version: 0.3.0  
Evidence level: Hypothesis  
Produto: GamerTrust

## Context

- Idade: variável
- Dispositivo: desktop/laptop (browser), mobile web, ou app nativo Android/iOS
- Configuração: fonte ampliada / zoom do browser ou do sistema; em alguns fluxos, leitor de tela (NVDA, JAWS, VoiceOver Safari, TalkBack / VoiceOver nativos)
- Ambiente: variável

## Digital behavior

- Usa fonte ampliada ou zoom permanentemente
- Alterna para leitor de tela em fluxos densos ou críticos (busca, selos, pagamento)
- Depende de contraste alto e hierarquia visual clara
- Navega por teclado e ordem de foco quando usa leitor

## Goals

- Ler e compreender todo o conteúdo sem corte ou sobreposição
- Completar fluxos críticos com leitor de tela e/ou teclado
- Perceber erros e confirmações sem depender só de cor
- Entender selos e TrustScore sem depender só de ícone/cor

## Frictions

- Conteúdo cortado ou sobreposto com fonte ampliada / zoom
- Contraste insuficiente
- Controles sem nome acessível
- Ordem de foco/leitura ilógica
- Erros anunciados apenas visualmente
- Área de clique/toque pequena (< 44px)
- Excesso de selos/cores no cartão de resultado

## Accessibility considerations

- Vision: fonte ampliada, contraste, zoom do browser
- Cognitive: hierarquia e foco previsíveis
- Plataforma web: NVDA/JAWS (Windows), VoiceOver (Safari/macOS/iOS), teclado; nativos: TalkBack / VoiceOver — validar o canal sob teste

## Behavioral rules for simulation

- Ativar zoom/fonte ampliada no máximo razoável do canal
- Executar jornada crítica com teclado e, quando possível, leitor de tela
- Verificar label/role/ARIA (ou equivalente nativo) em cada controle
- Verificar ordem de foco após erro/navegação/dialog
- Verificar que nenhum CTA fica cortado
- Verificar feedback não baseado somente em cor
- Verificar explicação de selos acessível ao leitor

## Critical journeys

- Busca e descoberta
- Criação de anúncio e evidências
- Compra protegida

## Evidence

- Source: hipótese interna + princípios WCAG / HIG / Material
- Date: 2026-08
- Limitations: requer validação com usuários reais de tecnologias assistivas

## Risks of stereotyping

- Baixa visão é um espectro; nem todo usuário usa leitor de tela, e o grau de ampliação varia.
