#!/usr/bin/env node
/**
 * Deterministic Ralph loop verifier.
 * Usage: node scripts/verify-ralph-loop.mjs --loop RL-20260819-001
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const LEDGER = resolve(ROOT, 'docs/ralph/ledger.jsonl');

const REQUIRED_AGENTS = [
  'agt-web-orchestrator',
  'agt-web-product-owner',
  'agt-ui-ux-auditor',
  'agt-user-research',
  'agt-accessibility',
  'agt-web-architecture',
  'agt-web-qa',
  'agt-web-react-developer',
  'agt-code-review',
  'agt-web-verifier',
];

const OPEN_FINDING_STATUSES = new Set(['OPEN', 'IN_PROGRESS']);

function parseArgs(argv) {
  let loop = null;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--loop' && argv[i + 1]) loop = argv[++i];
  }
  return { loop };
}

function fail(errors) {
  console.error('\n❌ Ralph verify FAILED:');
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

function readLedgerEvents(loopId) {
  if (!existsSync(LEDGER)) return [];
  const lines = readFileSync(LEDGER, 'utf8').trim().split('\n').filter(Boolean);
  return lines
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch {
        throw new Error(`Invalid JSON at ledger line ${index + 1}`);
      }
    })
    .filter((e) => e.loopId === loopId);
}

function readLoopMd(loopId) {
  return resolve(ROOT, 'docs/ralph/loops', `${loopId}.md`);
}

function loadLoopConfig(loopId) {
  const p = resolve(ROOT, 'docs/ralph/loops', `${loopId}.config.json`);
  if (!existsSync(p)) return { allowlist: [] };
  return JSON.parse(readFileSync(p, 'utf8'));
}

function latestFindingStatuses(events) {
  const map = new Map();
  for (const e of events) {
    if (e.finding?.findingId && e.finding?.status) {
      map.set(e.finding.findingId, e.finding.status);
    }
    if (e.eventType === 'FINDING_VERIFIED' && e.finding?.findingId) {
      map.set(e.finding.findingId, 'VERIFIED');
    }
  }
  return map;
}

function collectAgents(events) {
  const agents = new Set();
  for (const e of events) {
    if (e.actor?.agentId) agents.add(e.actor.agentId);
  }
  return agents;
}

function checkGates(loopId) {
  const gatesPath = resolve(ROOT, 'artifacts/ralph', loopId, 'gates.json');
  if (!existsSync(gatesPath)) return ['gates.json missing'];
  const gates = JSON.parse(readFileSync(gatesPath, 'utf8'));
  const errors = [];
  if (!gates.allGreen) errors.push('gates.json reports allGreen=false');
  const requiredGates = [
    'lint',
    'typecheck',
    'test:unit',
    'test:integration',
    'test:coverage',
    'test:a11y',
    'test:visual',
    'test:e2e',
    'build',
    'smoke',
  ];
  for (const name of requiredGates) {
    const cmd = gates.commands?.find((c) => c.gate === name);
    if (!cmd) errors.push(`gates.json missing gate: ${name}`);
    else if (cmd.exitCode !== 0) errors.push(`gate ${name} exit ${cmd.exitCode}`);
  }
  if (gates.coverage?.lines != null && gates.coverage.lines < 80) {
    const configPath = resolve(ROOT, 'docs/ralph/loops', `${loopId}.config.json`);
    let riskAccepted = false;
    try {
      const cfg = JSON.parse(readFileSync(configPath, 'utf8'));
      riskAccepted = cfg.coverageRiskAccepted === true;
    } catch {
      /* no config */
    }
    if (!riskAccepted) {
      errors.push(
        `coverage lines ${gates.coverage.lines}% below 80% floor (set coverageRiskAccepted in loop config if PO accepted)`,
      );
    }
  }
  return errors;
}

function checkFindings(events) {
  const errors = [];
  const statuses = latestFindingStatuses(events);
  const created = events.filter((e) => e.eventType === 'FINDING_CREATED');
  if (created.length === 0) {
    errors.push('no FINDING_CREATED events (audit required at least one finding or explicit empty audit decision)');
  }
  for (const [id, status] of statuses) {
    if (OPEN_FINDING_STATUSES.has(status)) {
      errors.push(`finding ${id} still ${status}`);
    }
    if (status !== 'VERIFIED') {
      errors.push(`finding ${id} not VERIFIED (status=${status})`);
    }
  }
  for (const e of events.filter((x) => x.eventType === 'FINDING_VERIFIED')) {
    const f = e.finding;
    if (!f?.testIds?.length) errors.push(`FINDING_VERIFIED ${f?.findingId} missing testIds`);
    if (!f?.evidenceBefore?.length) errors.push(`FINDING_VERIFIED ${f?.findingId} missing evidenceBefore`);
    if (!f?.evidenceAfter?.length) errors.push(`FINDING_VERIFIED ${f?.findingId} missing evidenceAfter`);
    for (const path of [...(f?.evidenceBefore ?? []), ...(f?.evidenceAfter ?? [])]) {
      if (!existsSync(resolve(ROOT, path))) {
        errors.push(`evidence file missing: ${path}`);
      }
    }
  }
  return errors;
}

const { loop } = parseArgs(process.argv);
if (!loop) {
  console.error('Usage: verify-ralph-loop.mjs --loop RL-YYYYMMDD-NNN');
  process.exit(1);
}

const errors = [];
const loopMd = readLoopMd(loop);
if (!existsSync(loopMd)) errors.push(`loop record missing: docs/ralph/loops/${loop}.md`);

const events = readLedgerEvents(loop);
if (events.length === 0) errors.push('no ledger events for loop');

const eventTypes = new Set(events.map((e) => e.eventType));
if (!eventTypes.has('LOOP_CREATED')) errors.push('missing LOOP_CREATED');
if (!eventTypes.has('LOOP_COMPLETED') && !eventTypes.has('LOOP_BLOCKED')) {
  errors.push('missing LOOP_COMPLETED or LOOP_BLOCKED');
}
if (eventTypes.has('LOOP_BLOCKED') && eventTypes.has('LOOP_COMPLETED')) {
  errors.push('both LOOP_BLOCKED and LOOP_COMPLETED present');
}

const agents = collectAgents(events);
for (const required of REQUIRED_AGENTS) {
  if (!agents.has(required)) errors.push(`missing agent pass: ${required}`);
}

if (!eventTypes.has('CODE_REVIEWED')) errors.push('missing CODE_REVIEWED');
else {
  const review = events.find((e) => e.eventType === 'CODE_REVIEWED');
  if (review?.verification?.verdict !== 'APPROVED') {
    errors.push('CODE_REVIEWED verdict not APPROVED');
  }
}

if (!eventTypes.has('QA_VERIFIED')) errors.push('missing QA_VERIFIED');
else {
  const qa = events.find((e) => e.eventType === 'QA_VERIFIED');
  if (qa?.verification?.verdict !== 'PASS') errors.push('QA_VERIFIED verdict not PASS');
}

if (!eventTypes.has('VERIFIER_SIGNED')) errors.push('missing VERIFIER_SIGNED');
else {
  const v = events.find((e) => e.eventType === 'VERIFIER_SIGNED');
  if (v?.verification?.verdict !== 'PASS') errors.push('VERIFIER_SIGNED verdict not PASS');
}

errors.push(...checkFindings(events));
errors.push(...checkGates(loop));

// Temporal order
const sorted = [...events].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
for (let i = 1; i < sorted.length; i++) {
  if (Date.parse(sorted[i].timestamp) < Date.parse(sorted[i - 1].timestamp)) {
    errors.push('ledger events out of temporal order');
    break;
  }
}

if (errors.length) fail(errors);

console.log(`\n✅ Ralph verify PASSED for ${loop}`);
console.log(`<promise loop="${loop}" status="COMPLETED">\n  ALL_GATES_GREEN\n</promise>`);
process.exit(0);
