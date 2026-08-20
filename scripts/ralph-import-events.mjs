#!/usr/bin/env node
/**
 * Import a JSONL file of ledger events (one event per line or array file).
 * Usage: node scripts/ralph-import-events.mjs --file docs/ralph/loops/RL-20260819-001.events.jsonl
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function parseArgs(argv) {
  let file = null;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--file' && argv[i + 1]) file = argv[++i];
  }
  return { file };
}

const { file } = parseArgs(process.argv);
if (!file) {
  console.error('Usage: ralph-import-events.mjs --file events.jsonl');
  process.exit(1);
}

const raw = readFileSync(resolve(ROOT, file), 'utf8').trim();
const lines = raw.startsWith('[')
  ? JSON.parse(raw).map((e) => JSON.stringify(e)).join('\n').split('\n')
  : raw.split('\n').filter(Boolean);

for (const line of lines) {
  JSON.parse(line);
  const result = spawnSync('node', ['scripts/ralph-ledger-append.mjs', '--json', line], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    process.exit(1);
  }
}

console.log(`Imported ${lines.length} events from ${file}`);
