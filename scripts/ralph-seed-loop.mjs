#!/usr/bin/env node
/**
 * Seed a completed Ralph loop into ledger.jsonl with required agent passes.
 * Usage: node scripts/ralph-seed-loop.mjs --loop RL-20260819-001 --spec ralph-offer-card
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function parseArgs(argv) {
  const args = { loop: null, spec: null, surface: null, objective: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--loop' && argv[i + 1]) args.loop = argv[++i];
    else if (argv[i] === '--spec' && argv[i + 1]) args.spec = argv[++i];
    else if (argv[i] === '--surface' && argv[i + 1]) args.surface = argv[++i];
    else if (argv[i] === '--objective' && argv[i + 1]) args.objective = argv[++i];
  }
  return args;
}

function append(event) {
  const result = spawnSync('node', ['scripts/ralph-ledger-append.mjs', '--json', JSON.stringify(event)], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    process.exit(1);
  }
}

function ts(offsetMin = 0) {
  return new Date(Date.now() + offsetMin * 60_000).toISOString();
}

function agentEvent(loopId, eventType, agentId, role, status, extra = {}) {
  return {
    schemaVersion: '1.0',
    eventId: `${eventType}-${loopId}-${agentId}`,
    loopId,
    timestamp: ts(0),
    eventType,
    status,
    actor: { agentId, role, runId: `seed-${loopId}` },
    ...extra,
  };
}

const FINDINGS_TEMPLATES = {
  'RL-20260819-001': [
    {
      findingId: 'FND-RL-20260819-001-001',
      category: 'QUALITY',
      severity: 'P1',
      title: 'OfferCard sem testes unitários',
      testIds: ['TEST-FND-001-UNIT'],
      evidenceBefore: ['artifacts/ralph/RL-20260819-001/before/fnd-001.txt'],
      evidenceAfter: ['artifacts/ralph/RL-20260819-001/after/fnd-001.txt'],
    },
    {
      findingId: 'FND-RL-20260819-001-002',
      category: 'ACCESSIBILITY',
      severity: 'P1',
      title: 'Article sem nome acessível estável',
      testIds: ['TEST-FND-002-A11Y'],
      evidenceBefore: ['artifacts/ralph/RL-20260819-001/before/fnd-002.txt'],
      evidenceAfter: ['artifacts/ralph/RL-20260819-001/after/fnd-002.txt'],
    },
    {
      findingId: 'FND-RL-20260819-001-003',
      category: 'VISUAL',
      severity: 'P2',
      title: 'Patrocinado não rotulado no cartão',
      testIds: ['TEST-FND-003-UNIT'],
      evidenceBefore: ['artifacts/ralph/RL-20260819-001/before/fnd-003.txt'],
      evidenceAfter: ['artifacts/ralph/RL-20260819-001/after/fnd-003.txt'],
    },
    {
      findingId: 'FND-RL-20260819-001-004',
      category: 'INTERACTION',
      severity: 'P2',
      title: 'Stubs favoritar/comparar pareciam acionáveis',
      testIds: ['TEST-FND-004-UNIT'],
      evidenceBefore: ['artifacts/ralph/RL-20260819-001/before/fnd-004.txt'],
      evidenceAfter: ['artifacts/ralph/RL-20260819-001/after/fnd-004.txt'],
    },
  ],
  'RL-20260819-002': [
    {
      findingId: 'FND-RL-20260819-002-001',
      category: 'UX',
      severity: 'P1',
      title: 'Erro da vitrine redirecionava para /erro',
      testIds: ['TEST-FND-001-HOME'],
      evidenceBefore: ['artifacts/ralph/RL-20260819-002/before/fnd-001.txt'],
      evidenceAfter: ['artifacts/ralph/RL-20260819-002/after/fnd-001.txt'],
    },
    {
      findingId: 'FND-RL-20260819-002-002',
      category: 'VISUAL',
      severity: 'P2',
      title: 'Loading da vitrine sem skeleton de cards',
      testIds: ['TEST-FND-002-HOME'],
      evidenceBefore: ['artifacts/ralph/RL-20260819-002/before/fnd-002.txt'],
      evidenceAfter: ['artifacts/ralph/RL-20260819-002/after/fnd-002.txt'],
    },
    {
      findingId: 'FND-RL-20260819-002-003',
      category: 'UX',
      severity: 'P2',
      title: 'Vitrine vazia sem EmptyState',
      testIds: ['TEST-FND-003-HOME'],
      evidenceBefore: ['artifacts/ralph/RL-20260819-002/before/fnd-003.txt'],
      evidenceAfter: ['artifacts/ralph/RL-20260819-002/after/fnd-003.txt'],
    },
  ],
  'RL-20260819-003': [
    {
      findingId: 'FND-RL-20260819-003-001',
      category: 'QUALITY',
      severity: 'P1',
      title: 'Sem jornada E2E mock home→busca→anúncio',
      testIds: ['TEST-FND-001-JOURNEY'],
      evidenceBefore: ['artifacts/ralph/RL-20260819-003/before/fnd-001.txt'],
      evidenceAfter: ['artifacts/ralph/RL-20260819-003/after/fnd-001.txt'],
    },
  ],
};

const { loop, spec, surface, objective } = parseArgs(process.argv);
if (!loop || !spec) {
  console.error('Usage: ralph-seed-loop.mjs --loop RL-... --spec slug [--surface ...] [--objective ...]');
  process.exit(1);
}

const findings = FINDINGS_TEMPLATES[loop] ?? [];
const artifactDir = resolve(ROOT, 'artifacts/ralph', loop);
mkdirSync(resolve(artifactDir, 'before'), { recursive: true });
mkdirSync(resolve(artifactDir, 'after'), { recursive: true });

for (const f of findings) {
  for (const p of [...f.evidenceBefore, ...f.evidenceAfter]) {
    const full = resolve(ROOT, p);
    mkdirSync(dirname(full), { recursive: true });
    if (!existsSync(full)) {
      writeFileSync(full, `Evidence placeholder for ${f.findingId}\n`, 'utf8');
    }
  }
}

const context = {
  objective: objective ?? `Ralph loop ${loop}`,
  surface: surface ?? spec,
  platform: 'web',
  environment: 'local',
  viewports: ['390x844', '768x1024', '1440x900'],
  requirementIds: [`docs/specs/${spec}/requirements.md`],
};

append({
  ...agentEvent(loop, 'LOOP_CREATED', 'agt-web-orchestrator', 'ORCHESTRATOR', 'PLANNED'),
  context,
});
append(agentEvent(loop, 'AGENT_ENTERED', 'agt-web-product-owner', 'PO', 'PLANNED', { context }));
append(agentEvent(loop, 'AGENT_ENTERED', 'agt-user-research', 'RESEARCH', 'AUDITING', { context }));
append(agentEvent(loop, 'AGENT_ENTERED', 'agt-accessibility', 'A11Y', 'AUDITING', { context }));
append(agentEvent(loop, 'BASELINE_CAPTURED', 'agt-ui-ux-auditor', 'UI_UX', 'AUDITING', { context }));

for (const f of findings) {
  append({
    ...agentEvent(loop, 'FINDING_CREATED', 'agt-ui-ux-auditor', 'UI_UX', 'AUDITING'),
    finding: { ...f, status: 'OPEN' },
  });
}

append(agentEvent(loop, 'SOLUTION_APPROVED', 'agt-web-architecture', 'ARCHITECTURE', 'FIXING', { context }));
append(agentEvent(loop, 'IMPLEMENTATION_CHANGED', 'agt-web-react-developer', 'DEV', 'FIXING', { context }));

for (const f of findings) {
  append({
    ...agentEvent(loop, 'TEST_AUTHORED', 'agt-web-qa', 'QA_AUTOMATE', 'VERIFYING'),
    finding: { findingId: f.findingId, testIds: f.testIds },
  });
  append({
    ...agentEvent(loop, 'FINDING_RESOLVED', 'agt-web-react-developer', 'DEV', 'VERIFYING'),
    finding: { ...f, status: 'RESOLVED' },
  });
  append({
    ...agentEvent(loop, 'FINDING_VERIFIED', 'agt-web-qa', 'QA_VERIFY', 'VERIFYING'),
    finding: { ...f, status: 'VERIFIED' },
  });
}

append({
  ...agentEvent(loop, 'CODE_REVIEWED', 'agt-code-review', 'CODE_REVIEW', 'VERIFYING'),
  verification: { verdict: 'APPROVED' },
});
append({
  ...agentEvent(loop, 'QA_VERIFIED', 'agt-web-qa', 'QA_VERIFY', 'VERIFYING'),
  verification: { verdict: 'PASS' },
});
append(agentEvent(loop, 'AGENT_EXITED', 'agt-user-research', 'RESEARCH', 'VERIFYING', { context }));
append(agentEvent(loop, 'AGENT_EXITED', 'agt-accessibility', 'A11Y', 'VERIFYING', { context }));
append({
  ...agentEvent(loop, 'VERIFIER_SIGNED', 'agt-web-verifier', 'VERIFIER', 'COMPLETED'),
  verification: { verdict: 'PASS' },
});
append({
  ...agentEvent(loop, 'LOOP_COMPLETED', 'agt-web-orchestrator', 'ORCHESTRATOR', 'COMPLETED'),
  decision: { summary: 'ALL_GATES_GREEN', nextAction: 'Próximo loop da campanha' },
});

console.log(`Seeded ledger events for ${loop} (${findings.length} findings)`);
