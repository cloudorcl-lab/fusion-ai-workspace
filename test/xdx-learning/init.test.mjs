import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { initializeWorkspace } from '../../scripts/xdx-learning/core.mjs';

test('initializeWorkspace creates tracked Phase 0 state and excludes aiapps', async (t) => {
  const rootDir = await mkdtemp(join(tmpdir(), 'xdx-learning-init-'));
  t.after(() => rm(rootDir, { recursive: true, force: true }));

  await initializeWorkspace(rootDir);

  const policy = JSON.parse(
    await readFile(join(rootDir, '.xdx-learning', 'policy', 'policy.json'), 'utf8'),
  );
  const catalog = JSON.parse(
    await readFile(join(rootDir, '.xdx-learning', 'catalog', 'knowledge-catalog.json'), 'utf8'),
  );
  const ignored = await readFile(join(rootDir, '.xdx-learning', '.gitignore'), 'utf8');

  assert.deepEqual(policy.excludedRoots, ['aiapps/']);
  assert.ok(policy.trackedState.includes('ledger/candidates.jsonl'));
  assert.equal(catalog.cards[0].id, 'workflow-testing-framework');
  assert.equal(catalog.cards[0].sourcePath, 'documents/fusion-ai-studio-workflow-testing-framework.md');
  assert.match(ignored, /^sessions\/$/m);
});
