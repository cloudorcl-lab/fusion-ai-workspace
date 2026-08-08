import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';

const execFileAsync = promisify(execFile);
const cliPath = resolve('scripts/xdx-learn.mjs');

test('CLI initializes state and returns workflow testing guidance as JSON', async (t) => {
  const rootDir = await mkdtemp(join(tmpdir(), 'xdx-learning-cli-'));
  t.after(() => rm(rootDir, { recursive: true, force: true }));

  await execFileAsync(process.execPath, [cliPath, 'init', '--root', rootDir]);
  const { stdout } = await execFileAsync(process.execPath, [
    cliPath,
    'find',
    '--root',
    rootDir,
    '--json',
    'test workflow with ATLAS',
  ]);

  const matches = JSON.parse(stdout);
  assert.equal(matches[0].title, 'Fusion AI Studio Workflow Testing Framework');
});
