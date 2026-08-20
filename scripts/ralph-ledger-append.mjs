#!/usr/bin/env node
/**
 * Append a validated ledger event to docs/ralph/ledger.jsonl (append-only).
 * Usage: node scripts/ralph-ledger-append.mjs --file event.json
 *    or: node scripts/ralph-ledger-append.mjs --json '{...}'
 */
import { readFileSync, appendFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const LEDGER_PATH = resolve(ROOT, 'docs/ralph/ledger.jsonl');

const REQUIRED = ['schemaVersion', 'eventId', 'loopId', 'timestamp', 'eventType', 'status', 'actor'];
const LOOP_ID_PATTERN = /^RL-[0-9]{8}-[0-9]{3}$/;
const EVENT_TYPES = new Set([
  'LOOP_CREATED',
  'AGENT_ENTERED',
  'AGENT_EXITED',
  'BASELINE_CAPTURED',
  'FINDING_CREATED',
  'SOLUTION_APPROVED',
  'IMPLEMENTATION_CHANGED',
  'TEST_AUTHORED',
  'TEST_EXECUTED',
  'FINDING_RESOLVED',
  'FINDING_VERIFIED',
  'CODE_REVIEWED',
  'QA_VERIFIED',
  'LOOP_BLOCKED',
  'LOOP_COMPLETED',
  'VERIFIER_SIGNED',
]);

function parseArgs(argv) {
  const args = { file: null, json: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--file' && argv[i + 1]) {
      args.file = argv[++i];
    } else if (argv[i] === '--json' && argv[i + 1]) {
      args.json = argv[++i];
    }
  }
  return args;
}

function validateEvent(event) {
  const errors = [];
  for (const key of REQUIRED) {
    if (event[key] === undefined || event[key] === null || event[key] === '') {
      errors.push(`missing required field: ${key}`);
    }
  }
  if (event.schemaVersion !== '1.0') {
    errors.push('schemaVersion must be "1.0"');
  }
  if (event.loopId && !LOOP_ID_PATTERN.test(event.loopId)) {
    errors.push(`invalid loopId: ${event.loopId}`);
  }
  if (event.eventType && !EVENT_TYPES.has(event.eventType)) {
    errors.push(`unknown eventType: ${event.eventType}`);
  }
  if (event.actor && (!event.actor.agentId || !event.actor.role)) {
    errors.push('actor must have agentId and role');
  }
  const ts = Date.parse(event.timestamp ?? '');
  if (Number.isNaN(ts)) {
    errors.push('timestamp must be ISO 8601');
  }
  return errors;
}

function loadEvent(args) {
  if (args.file) {
    const raw = readFileSync(resolve(ROOT, args.file), 'utf8');
    return JSON.parse(raw);
  }
  if (args.json) {
    return JSON.parse(args.json);
  }
  console.error('Usage: ralph-ledger-append.mjs --file event.json | --json \'{...}\'');
  process.exit(1);
}

const args = parseArgs(process.argv);
const event = loadEvent(args);
const errors = validateEvent(event);
if (errors.length) {
  console.error('Validation failed:');
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

const line = JSON.stringify(event);
appendFileSync(LEDGER_PATH, `${line}\n`, 'utf8');
console.log(`Appended ${event.eventType} for ${event.loopId} (${event.eventId})`);
