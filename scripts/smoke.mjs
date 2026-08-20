#!/usr/bin/env node
/**
 * Smoke test: build + preview server + HTTP GET /
 */
import { spawn, spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PORT = 4173;
const URL = `http://127.0.0.1:${PORT}/`;

function waitForServer(maxMs = 30000) {
  const start = Date.now();
  return new Promise((resolvePromise, reject) => {
    const tick = () => {
      http
        .get(URL, (res) => {
          res.resume();
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
            resolvePromise();
          } else if (Date.now() - start > maxMs) {
            reject(new Error(`bad status ${res.statusCode}`));
          } else {
            setTimeout(tick, 300);
          }
        })
        .on('error', () => {
          if (Date.now() - start > maxMs) reject(new Error('timeout waiting for preview'));
          else setTimeout(tick, 300);
        });
    };
    tick();
  });
}

const build = spawnSync('yarn', ['build'], { cwd: ROOT, stdio: 'inherit' });
if (build.status !== 0) process.exit(build.status ?? 1);

const preview = spawn('yarn', ['preview', '--host', '127.0.0.1', '--port', String(PORT)], {
  cwd: ROOT,
  stdio: 'ignore',
  detached: true,
});

try {
  await waitForServer();
  console.log(`Smoke OK: ${URL}`);
  process.exit(0);
} catch (err) {
  console.error('Smoke FAILED:', err.message);
  process.exit(1);
} finally {
  try {
    process.kill(-preview.pid);
  } catch {
    preview.kill();
  }
}
