# Changelog — Reestruturação da arquitetura de IA

Documento que explica **o que mudou**, **por quê** e **como usar** a nova esteira de agents, skills, rules e docs do repositório `st-app-rn`.

Referência de processo: [`guia-fluxo-agents-mobile-react-native.md`](../guia-fluxo-agents-mobile-react-native.md).

---

## 1. Resumo em uma frase

A pasta `.cursor/` deixou de ser uma coleção de gates de QA redundantes e passou a ser uma **esteira de produto** (da ideia à release), com docs de suporte reais (`arquitetura FSD`, personas, specs e jornadas) e sem duplicação de papéis.

---

## 2. Problema que existia

Antes da reestruturação:

| Problema | Detalhe |
|---|---|
| Redundância | 4 artefatos cobriam o mesmo núcleo FSD (`agt-architecture-guardian`, `agt-guardiao-arquitetura-fsd`, `fsd-architecture-qa`, `revisar-conformidade-fsd`) |
| Foco estreito | Quase tudo era gate de QA técnico; faltavam papéis de produto, pesquisa, persona, acessibilidade, visual e release |
| Docs quebrados | `docs/arquitetura-camadas-fsd.md` era citado por agents/skills/rules, mas **não existia** |
| Artefatos ausentes | Não havia `docs/specs/`, `docs/personas/` nem `docs/journeys/` |
| Nome antigo | Vários arquivos ainda falavam em `st-app-boilerplate` |
| Rules incompletas | Descriptions vazias; `convencoes-nomenclatura-st-app.mdc` com conteúdo duplicado |

---

## 3. Estratégia adotada

**Fusão (merge)**, não substituição cega:

1. A esteira do guia virou a espinha dorsal (orchestrator + 12 papéis de produto/qualidade).
2. Conteúdo útil dos agents/skills antigos foi **absorvido** nos novos papéis.
3. Especialistas que ainda faziam sentido sozinhos foram **mantidos** (contrato API, pre-push, AppLoading, auth).
4. Docs de suporte foram criados para que as citações deixassem de apontar para o vazio.

Nenhum código de `src/` foi alterado nesta mudança.

---

## 4. Arquitetura alvo

```text
Ideia
  → Discovery / Research / UI audit / Persona
  → Requirements aprovados (PO)
  → Design técnico FSD (Architecture)
  → QA PLAN
  → Implementação (React Native Developer)
  → App em execução (evidência obrigatória)
  → Code review (+ Contract Validator se tocar API)
  → QA VERIFY / EXPLORATORY
  → Visual / Performance / Accessibility
  → Release (+ Pre-Push Guard)
  → Monitoramento
```

Orquestração: **`agt-mobile-orchestrator`**.

---

## 5. O que foi criado

### 5.1 Docs de suporte

| Path | Conteúdo |
|---|---|
| [`docs/arquitetura-camadas-fsd.md`](arquitetura-camadas-fsd.md) | Documento canônico FSD (§1–§14), alinhado às citações já existentes |
| [`docs/personas/`](personas/) | Template + 6 personas (hipóteses a validar) |
| [`docs/specs/_templates/`](specs/_templates/) | 11 templates de artefato por feature |
| [`docs/journeys/`](journeys/) | Catálogo + login, signup, app-loading |

**Personas:**

- `dona-maria.md`
- `joao-pratico.md`
- `carla-cuidadora.md`
- `lucas-digital.md`
- `baixa-visao.md`
- `conexao-instavel.md`
- `persona-template.md`

**Templates de spec** (`docs/specs/<feature-slug>/` usa estes modelos):

- `requirements.md`, `research-notes.md`, `ui-ux-audit.md`, `persona-review.md`
- `design.md`, `test-plan.md`
- `accessibility-report.md`, `visual-review.md`, `performance-report.md`
- `qa-report.md`, `release-report.md`

### 5.1.1 Knowledge base (fundação)

A partir de 2026-07-16 existe [`docs/knowledge-base/`](knowledge-base/) com sources curadas, principles, decisions (`KB-DEC-*`), playbooks, agent-context e `index.yml`. Personas e journeys **permanecem** em `docs/personas/` e `docs/journeys/`. Detalhes: [`knowledge-base/CHANGELOG.md`](knowledge-base/CHANGELOG.md).

### 5.2 Agents da esteira (13)

| Agent | Papel |
|---|---|
| `agt-mobile-orchestrator` | Máquina de estados, seleção de agents, gates |
| `agt-mobile-product-owner` | Requirements (`requirements.md`); integra Jira via `task-jira` |
| `agt-user-research` | Evidências → `research-notes.md` |
| `agt-persona-simulator` | Simulação comportamental com `docs/personas/` |
| `agt-ui-ux-auditor` | Auditoria de UX em app em execução |
| `agt-accessibility` | A11y como gate |
| `agt-mobile-architecture` | Design técnico FSD + consulta “onde colocar arquivo” |
| `agt-mobile-qa` | PLAN / AUTOMATE / VERIFY / EXPLORATORY |
| `agt-react-native-developer` | Implementação FSD + slice canônico |
| `agt-visual-review` | Fidelidade visual / Design System |
| `agt-mobile-performance` | Performance + runtime RN |
| `agt-code-review` | Gate Approved/Rejected (FSD + requisitos) |
| `agt-mobile-release` | Prontidão de publicação |

### 5.3 Skills da esteira (10)

| Skill | Uso |
|---|---|
| `mobile-product-refinement` | Refinar problema → requirements |
| `mobile-ui-ux-audit` | Auditoria UX + estados de UI |
| `persona-evaluation` | Avaliação por persona |
| `mobile-accessibility` | Checklist e gate de a11y |
| `mobile-architecture` | Design técnico + matriz V1–V7 de conformidade |
| `mobile-quality-assurance` | QA nos 4 modos + pipeline PR |
| `react-native-implementation` | Implementação fases A→G |
| `mobile-visual-review` | Review visual |
| `mobile-performance` | Performance / runtime |
| `mobile-release-readiness` | Checklist de release |

### 5.4 Ajuste em `AGENTS.md`

Nova seção **§0 Feature Delivery Pipeline**: aponta orchestrator, `docs/arquitetura-camadas-fsd.md`, specs, personas e journeys como fluxo oficial.

---

## 6. O que foi fundido (antes → depois)

### Agents removidos (conteúdo absorvido)

| Removido | Absorvido por |
|---|---|
| `agt-ui-ux-state-inspector` | `agt-ui-ux-auditor` |
| `agt-guardiao-arquitetura-fsd` (consultivo) | `agt-mobile-architecture` |
| `agt-architecture-guardian` (gate) | `agt-code-review` |
| `agt-test-coverage-enforcer` | `agt-mobile-qa` (VERIFY) |
| `agt-e2e-journey-runner` | `agt-mobile-qa` (EXPLORATORY / E2E) |
| `agt-dev-frontend` | `agt-react-native-developer` |
| `agt-assistente-slice-feature` | `agt-react-native-developer` (apêndice de slice) |
| `agt-mobile-runtime-specialist` | `agt-mobile-performance` + `agt-mobile-release` |

### Skills removidas (conteúdo absorvido)

| Removida | Absorvida por |
|---|---|
| `ui-component-qa` | `mobile-ui-ux-audit` |
| `fsd-architecture-qa` | `mobile-architecture` |
| `revisar-conformidade-fsd` | `mobile-architecture` (matriz V1–V7) |
| `unit-test-qa` | `mobile-quality-assurance` |
| `slice-integration-qa` | `mobile-quality-assurance` |
| `e2e-qa` | `mobile-quality-assurance` |
| `navigation-qa` | `mobile-quality-assurance` |
| `qa-pipeline-pr` | `mobile-quality-assurance` |
| `nova-capacidade-fsd` | `react-native-implementation` |

---

## 7. O que foi mantido (especialistas)

### Agents

| Agent | Motivo |
|---|---|
| `agt-contract-validator` | Contrato front↔back; chamado pelo code review quando o diff toca API/`I*` |
| `agt-pre-push-git-guard` | Gate GO/NO-GO pré-push/PR (read-only) |
| `agt-apploading-flow` | Vertical do bootstrap AppLoading |
| `agt-auth-flow-specialist` | Vertical de auth/sessão |

### Skills

| Skill | Motivo |
|---|---|
| `api-contract-qa` | Contrato de API |
| `observability-qa` | Analytics / adapter sem PII |
| `pre-push-pr-guard` | Invoca o pre-push guard |

### Command

| Command | Status |
|---|---|
| `.cursor/commands/task-jira.md` | Mantido; referenciado pelo product-owner |

---

## 8. Contagem final

| Tipo | Antes | Depois |
|---|---|---|
| Agents | 12 | **17** (13 esteira + 4 especialistas) |
| Skills | 12 | **13** (10 esteira + 3 especialistas) |
| Docs canônicos FSD | 0 (citado, inexistente) | **1** (`arquitetura-camadas-fsd.md`) |
| Personas | 0 | **6 + template** |
| Templates de spec | 0 | **11** |
| Jornadas | 0 | **3 + README** |

---

## 9. Rules corrigidas

| Rule | Mudança |
|---|---|
| `fsd-camadas-st-app.mdc` | Description preenchida; título atualizado para `st-app-rn` |
| `fsd-imports-e-api-publica.mdc` | Description preenchida |
| `fsd-testes-st-app.mdc` | Description preenchida |
| `convencoes-nomenclatura-st-app.mdc` | Description preenchida; **bloco duplicado removido** |

Varredura geral:

- `st-app-boilerplate` → `st-app-rn`
- `Agents.md` → `AGENTS.md`
- Referências a agents/skills removidos limpas

---

## 10. Como usar no dia a dia

### Feature nova ou melhoria de produto

1. Abrir com **`agt-mobile-orchestrator`** (classifica demanda e escolhe a esteira).
2. Discovery: research + UI audit + personas.
3. PO gera `docs/specs/<feature-slug>/requirements.md`.
4. Architecture gera `design.md`.
5. QA gera `test-plan.md` (modo PLAN).
6. Developer implementa com FSD / i18n / Design System / estados.
7. Só depois: code review, QA VERIFY/EXPLORATORY, visual, performance, release.

### Bug ou PR técnico pequeno

Não precisa da esteira inteira. Em geral:

- `agt-code-review` + `mobile-architecture` (se tocar camadas)
- `agt-mobile-qa` VERIFY
- `agt-contract-validator` se tocar API
- `agt-pre-push-git-guard` antes de subir

### Regra de ouro

**PASS / aprovação de UX ou QA exige evidência do app em execução.** Inspeção estática sozinha não fecha a feature.

---

## 11. O que não mudou (de propósito)

- Código de aplicação em `src/`
- Scripts do `package.json` (ainda **não há** script E2E; E2E fica “quando disponível”)
- Command `task-jira`
- Rules de domínio pontuais (`app-loading-extensoes`, `expo-file-system-modern-api`)

---

## 12. Onde encontrar cada coisa

```text
.cursor/
├── agents/          # 17 agents
├── skills/          # 13 skills
├── rules/           # FSD, testes, nomenclatura, AppLoading, FileSystem
└── commands/        # task-jira

docs/
├── arquitetura-camadas-fsd.md
├── knowledge-base/          # base curada (sources, principles, decisions, playbooks)
├── personas/
├── journeys/
├── specs/_templates/
└── changelog-reestruturacao-arquitetura-ia.md   ← este arquivo

guia-fluxo-agents-mobile-react-native.md         # processo completo
guia-base-conhecimento-agents-mobile-ui-ux.md    # spec da knowledge base
fontes-pesquisa-agents-mobile-ui-ux.md           # lista de descoberta (não curada)
AGENTS.md                                        # §0 aponta a esteira
```

---

## 13. Nota sobre o Cursor

Os novos agents só passam a aparecer na lista de subagents invocáveis depois que o Cursor recarregar a configuração (reiniciar a janela do IDE, se necessário).
