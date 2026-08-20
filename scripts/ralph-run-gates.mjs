#!/usr/bin/env node
/**
 * Run technical gates for a Ralph loop and write artifacts/ralph/<loopId>/gates.json
 * Usage: node scripts/ralph-run-gates.mjs --loop RL-20260819-001 [--e2e-pattern home]
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function parseArgs(argv) {
  const args = { loop: null, e2ePattern: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--loop' && argv[i + 1]) args.loop = argv[++i];
    else if (argv[i] === '--e2e-pattern' && argv[i + 1]) args.e2ePattern = argv[++i];
  }
  return args;
}

function run(command, cmdArgs, env = {}) {
  const startedAt = new Date().toISOString();
  const result = spawnSync(command, cmdArgs, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: false,
    env: { ...process.env, ...env },
  });
  const finishedAt = new Date().toISOString();
  return {
    command: [command, ...cmdArgs].join(' '),
    exitCode: result.status ?? 1,
    startedAt,
    finishedAt,
    stdout: (result.stdout || '').slice(-4000),
    stderr: (result.stderr || '').slice(-4000),
  };
}

function loadLoopConfig(loopId) {
  const configPath = resolve(ROOT, 'docs/ralph/loops', `${loopId}.config.json`);
  try {
    return JSON.parse(readFileSync(configPath, 'utf8'));
  } catch {
    return {};
  }
}

const { loop, e2ePattern: cliE2e } = parseArgs(process.argv);
if (!loop) {
  console.error('Usage: ralph-run-gates.mjs --loop RL-YYYYMMDD-NNN [--e2e-pattern name]');
  process.exit(1);
}

const loopConfig = loadLoopConfig(loop);
const e2ePattern = cliE2e ?? loopConfig.e2ePattern ?? null;
const a11yFile = loopConfig.a11yFile ?? 'e2e/ralph/a11y.spec.ts';
const visualFile = loopConfig.visualFile ?? 'e2e/ralph/visual.spec.ts';

const commands = [
  { name: 'lint', fn: () => run('yarn', ['lint']) },
  { name: 'typecheck', fn: () => run('yarn', ['typecheck']) },
  { name: 'test:unit', fn: () => run('yarn', ['test:unit']) },
  { name: 'test:integration', fn: () => run('yarn', ['test:integration']) },
  {
    name: 'test:coverage',
    fn: () => run('yarn', ['test:coverage', '--', '--coverageReporters=json-summary']),
  },
  {
    name: 'test:a11y',
    fn: () =>
      run('yarn', ['playwright', 'test', a11yFile, '--config=playwright.ralph.config.ts'], {
        CI: '1',
      }),
  },
  {
    name: 'test:visual',
    fn: () =>
      run('yarn', ['playwright', 'test', visualFile, '--config=playwright.ralph.config.ts'], {
        CI: '1',
        RALPH_LOOP_ID: loop,
      }),
  },
  {
    name: 'test:e2e',
    fn: () => {
      const args = ['test:e2e'];
      if (e2ePattern) args.push(e2ePattern);
      return run('yarn', args, { CI: '1' });
    },
  },
  { name: 'build', fn: () => run('yarn', ['build']) },
  { name: 'smoke', fn: () => run('yarn', ['smoke']) },
];

const results = [];
let allGreen = true;

for (const { name, fn } of commands) {
  console.log(`\n▶ ${name}`);
  const result = fn();
  results.push({ gate: name, ...result });
  const ok = result.exitCode === 0;
  console.log(ok ? `  ✓ exit 0` : `  ✗ exit ${result.exitCode}`);
  if (!ok) allGreen = false;
}

let coverage = null;
try {
  const summaryPath = resolve(ROOT, 'coverage/coverage-summary.json');
  const summary = JSON.parse(readFileSync(summaryPath, 'utf8'));
  const total = summary.total;
  coverage = {
    lines: total.lines.pct,
    branches: total.branches.pct,
    functions: total.functions.pct,
    statements: total.statements.pct,
  };
} catch {
  coverage = { lines: null, branches: null, note: 'coverage-summary.json not found' };
}

const outDir = resolve(ROOT, 'artifacts/ralph', loop);
mkdirSync(outDir, { recursive: true });

const payload = {
  loopId: loop,
  generatedAt: new Date().toISOString(),
  allGreen,
  coverage,
  commands: results,
};

writeFileSync(resolve(outDir, 'gates.json'), `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`\nWrote ${outDir}/gates.json (allGreen=${allGreen})`);
process.exit(allGreen ? 0 : 1);
