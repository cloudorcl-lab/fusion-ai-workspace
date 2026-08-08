import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { captureCandidate, initializeWorkspace, resolveLearningPaths } from '../../scripts/xdx-learning/core.mjs';

const validCandidate = {
  id: 'XDX_TEST_RECORD',
  objectRef: 'src/workflows/xdx_supplier_query_team.wf',
  claim: 'File-mode workflow validation needs a separate live-validation gap.',
  evidenceRef: 'documents/fusion-ai-studio-workflow-testing-framework.md#file-mode-versus-live-mode-validation',
  method: 'documentation review',
  source: 'workspace-approved',
};

test('captureCandidate appends a structured candidate receipt', async (t) => {
  const rootDir = await mkdtemp(join(tmpdir(), 'xdx-learning-capture-'));
  t.after(() => rm(rootDir, { recursive: true, force: true }));
  await initializeWorkspace(rootDir);

  const record = await captureCandidate(rootDir, validCandidate);
  const ledger = await readFile(resolveLearningPaths(rootDir).candidates, 'utf8');

  assert.equal(record.status, 'observed');
  assert.equal(record.schemaVersion, 1);
  assert.match(ledger, /XDX_TEST_RECORD/);
});

test('captureCandidate rejects a bearer token', async (t) => {
  const rootDir = await mkdtemp(join(tmpdir(), 'xdx-learning-sensitive-'));
  t.after(() => rm(rootDir, { recursive: true, force: true }));
  await initializeWorkspace(rootDir);

  await assert.rejects(
    () => captureCandidate(rootDir, { ...validCandidate, claim: 'Bearer abc.def.ghi' }),
    /sensitive/i,
  );
});
