---
name: ralph-visual-loop
description: >-
  Executa um Ralph Loop de auditoria visual: reancoragem, audit, fix, test,
  verify e ledger. Usar ao iniciar ou continuar RL-YYYYMMDD-NNN.
disable-model-invocation: true
---

# Skill: Ralph Visual Loop

**Orquestrador:** `agt-web-orchestrator` · **Verificador:** `agt-web-verifier`

## Contrato de prompt

```text
Você está executando exatamente um Ralph Loop: {{LOOP_ID}}.

OBJETIVO IMUTÁVEL
{{OBJECTIVE}}

ESCOPO
{{SURFACE_AND_JOURNEY}}

FONTES DE VERDADE
1. docs/specs/{{SPEC_FILES}}
2. docs/ralph/loops/{{LOOP_ID}}.md
3. docs/ralph/ledger.jsonl
4. código, testes e evidências do repositório

REGRAS
- Reancore-se nas fontes de verdade no início de cada iteração.
- Escolha somente a próxima ação pendente de maior prioridade.
- Audite a superfície real antes de alterar o código.
- Transforme todo problema do escopo em um finding rastreável.
- Corrija no mesmo loop todo finding criado por este loop.
- Para cada regressão corrigida, crie o teste correspondente.
- Execute lint, tipos, testes, build e validação real no browser/dispositivo.
- Solicite code review e QA VERIFY independentes.
- Registre timestamps, agents, contexto, problema, causa, solução,
  arquivos, testes, comandos, resultados e evidências no ledger.
- Nunca trate narrativa de um agent como evidência de execução.
- Não emita completion promise com finding aberto, teste não executado,
  falha, review pendente ou ledger incompleto.
- Se não puder avançar com segurança, registre BLOCKED e a próxima ação.

CONCLUSÃO
Emita a completion promise somente quando scripts/verify-ralph-loop.*
retornar código 0 e agt-web-verifier registrar PASS:

<promise loop="{{LOOP_ID}}" status="COMPLETED">
  ALL_GATES_GREEN
</promise>
```

## Definition of Ready

- `loopId` único · objetivo mensurável · uma superfície · personas · viewports · ACs · baseline capturável · comandos de gate · ambiente executável.

## Definition of Done

Todos os gates em `docs/ralph/README.md` · findings `VERIFIED` · `yarn ralph:verify -- --loop <id>` exit 0 · ledger completo.

## Memória

Chat **não** é fonte de verdade. Persistir em `docs/ralph/ledger.jsonl`, `docs/ralph/loops/<id>.md` e `artifacts/ralph/<id>/`.
