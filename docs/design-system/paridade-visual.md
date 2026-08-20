# Paridade visual e de UX — Web, iOS e Android

> Cópia de trabalho do **frontend-web**. Contrato de semântica compartilhado entre os três canais.

## Objetivo

Garantir que **Web, iOS e Android** compartilhem **o mesmo significado, hierarquia e regras de confiança**. A diferença permitida é apenas de linguagem e componentes de plataforma (HTML/CSS vs SwiftUI vs Jetpack Compose, gestos, navegação).

## Papel do canal web

Web é o canal natural para explorar o catálogo, pesquisar profundamente, comparar produtos, acompanhar preços e gerenciar anúncios. Apps móveis cobrem evidências, criação rápida e uso cotidiano. Capacidades essenciais existem nos três canais; UX adapta ao dispositivo.

## Território de marca

O GamerTrust deve parecer:

- confiável sem burocracia;
- tecnológico sem frio;
- especializado sem dificuldade;
- premium sem afastar quem busca economia;
- seguro sem comunicar medo o tempo todo.

Tom: direto, transparente, especialista, protetor, moderno. Mensagem institucional: *Tecnologia usada. Confiança renovada.*

## Navegação principal (paridade)

Em todos os canais, a navegação deve cobrir:

- Início
- Buscar
- Categorias
- Favoritos
- Vender
- Compras e vendas
- Notificações
- Perfil

Adaptação de nav (tabs, sidebar desktop, stack) é permitida; **rótulos e destinos** devem permanecer equivalentes.

## Home

- Barra de busca **dominante**
- Continuar pesquisando
- Ofertas verificadas próximas
- Produtos populares por categoria
- Queda de preço em favoritos
- Recomendações **com motivo**
- Atalhos de orçamento
- Conteúdo educativo curto só em categorias de maior risco

## Produto ≠ Oferta

| Conceito | Significado |
|----------|-------------|
| **Produto** | Modelo conhecido (ex.: RTX 4060 8 GB) |
| **Oferta** | Unidade usada de um vendedor (preço, condição, evidências, selos) |

Listas e detalhe devem deixar essa distinção óbvia em todos os canais.

## Cartão de resultado

Cada cartão permite decisão preliminar sem abrir a página:

- foto real principal
- nome padronizado
- preço
- condição
- acessórios principais
- local/distância
- entrega
- **no máximo 3 diferenciais prioritários**
- selos relevantes (sem excesso)
- TrustScore / nível do vendedor
- favorito e comparação

Evitar excesso de selos, textos e cores. Patrocinado sempre rotulado; nunca simular selo de confiança.

## Selos (semântica idêntica)

| Selo | Significado |
|------|-------------|
| Posse verificada | Evidências compatíveis com posse no momento da análise |
| Funcionamento revisado | Teste solicitado apresentado e revisado (não é garantia total) |
| Identidade verificada | Vendedor concluiu confirmação de identidade |
| Compra protegida | Pagamento/contestação seguem regras da plataforma |
| Garantia disponível | Prazo e cobertura visíveis |

Regras:

- Explicar ao interação (toque/clique/teclado)
- Mostrar data da revisão e limitações em linguagem simples
- **Nunca** usar cor/ícone de verificação sem processo concluído
- Revogar/expirar quando houver alteração relevante

## TrustScore

Níveis: `Novo` · `Em evolução` · `Confiável` · `Excelente`, sempre com **motivos visíveis** (ex.: “12 vendas”, “98% sem problema”). Evitar nota isolada absoluta.

## Ordem da página do anúncio

1. Fotos reais e título  
2. Preço, condição e CTA  
3. Selos e resumo de confiança  
4. Entrega, retirada e proteção  
5. Defeitos e conservação  
6. Acessórios  
7. Especificações do modelo  
8. Resumo dos testes  
9. Perfil e TrustScore do vendedor  
10. Outras ofertas do mesmo produto  
11. Produtos semelhantes  

## Comparador e compra

- Comparador: 2–4 ofertas; trade-offs claros sem esconder dados (web privilegiado para lado a lado).
- Carrinho v1: priorizar **uma compra por transação** (itens únicos usados).

## Busca

- Barra global nas telas principais; autocomplete cedo
- Ordenação padrão: **Mais relevantes** (não só preço)
- Zero resultados: nunca tela vazia — correção, filtros, equivalentes, alerta
- Voltar preserva termo, filtros e posição
- Rede instável: sempre orientação acionável

## IA na UI

Permitido: guia de evidências, identificação “provável até confirmação”, resumos explicáveis, recomendações com motivo.

Proibido: inventar atributos/estado/garantia; preço “correto” sem faixa; patrocinado como neutro; resumo que esconde defeitos.

## O que pode divergir entre canais

| Pode divergir | Não pode divergir |
|---------------|-------------------|
| HTML/CSS vs SwiftUI vs Compose | Significado dos selos e TrustScore |
| Nav desktop (sidebar) vs tabs móveis | Ordem da página do anúncio |
| Gestos e navegação nativa / browser | Hierarquia busca > preço > confiança |
| Tipografia/sistema de tokens do canal | Regra “nunca fingir verificação” |
| Ícones do sistema (com equivalente semântico) | Conteúdo dos diferenciais e limitações |
| Densidade de filtros no desktop | Produto ≠ Oferta |

## Validação

`agt-visual-review` (em cada canal) e auditoria UX devem falhar se Web, iOS ou Android divergirem em semântica de confiança, cartão, nav ou ordem do anúncio — mesmo que o layout seja idiomático ao canal.