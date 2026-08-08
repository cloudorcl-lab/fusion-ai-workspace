import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { captureCandidate, findKnowledge, initializeWorkspace } from '../../scripts/xdx-learning/core.mjs';

test('findKnowledge routes workflow testing queries to the canonical framework', async (t) => {
  const rootDir = await mkdtemp(join(tmpdir(), 'xdx-learning-find-'));
  t.after(() => rm(rootDir, { recursive: true, force: true }));
  await initializeWorkspace(rootDir);

  const matches = await findKnowledge(rootDir, 'test and debug a workflow with ATLAS');

  assert.equal(matches[0].title, 'Fusion AI Studio Workflow Testing Framework');
  assert.equal(matches[0].sourcePath, 'documents/fusion-ai-studio-workflow-testing-framework.md');
  assert.ok(matches[0].readNext.includes('Failure Triage'));
  assert.equal(matches[0].kind, 'routing-card');
});

test('findKnowledge includes matching candidate evidence with its observed status', async (t) => {
  const rootDir = await mkdtemp(join(tmpdir(), 'xdx-learning-candidate-find-'));
  t.after(() => rm(rootDir, { recursive: true, force: true }));
  await initializeWorkspace(rootDir);
  await captureCandidate(rootDir, {
    id: 'XDX_QUERY_RENDERING',
    objectRef: 'src/workflows/xdx_supplier_query_team.wf',
    claim: 'Supplier query results need a multi-record widget with empty rows for no matches.',
    evidenceRef: 'test/workflows/xdx_supplier_query_team/xdx-supplier-query-team-app-query.json',
    method: 'deterministic workflow test',
    source: 'workspace-approved',
  });

  const matches = await findKnowledge(rootDir, 'supplier query no matches widget');
  const candidate = matches.find((match) => match.kind === 'candidate-evidence');

  assert.equal(candidate.title, 'XDX_QUERY_RENDERING');
  assert.equal(candidate.status, 'observed');
});
