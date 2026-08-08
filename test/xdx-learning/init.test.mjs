import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
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

test('initializeWorkspace indexes the canonical testing framework headings without copying its body', async (t) => {
  const rootDir = await mkdtemp(join(tmpdir(), 'xdx-learning-source-index-'));
  t.after(() => rm(rootDir, { recursive: true, force: true }));
  await mkdir(join(rootDir, 'documents'), { recursive: true });
  const frameworkPath = join(rootDir, 'documents', 'fusion-ai-studio-workflow-testing-framework.md');
  const indexPath = join(rootDir, '.xdx-learning', 'catalog', 'sources', 'workflow-testing-framework.index.json');
  await writeFile(frameworkPath, [
    '# Workflow Testing Framework',
    '',
    '## Required Inputs',
    '',
    '## Failure Triage',
    '',
    'Detailed canonical guidance remains in this document.',
  ].join('\n'));

  await initializeWorkspace(rootDir);

  const sourceIndex = JSON.parse(await readFile(
    join(rootDir, '.xdx-learning', 'catalog', 'sources', 'workflow-testing-framework.index.json'),
    'utf8',
  ));

  assert.equal(sourceIndex.sourcePath, 'documents/fusion-ai-studio-workflow-testing-framework.md');
  assert.deepEqual(sourceIndex.sections.map((section) => section.anchor), [
    '#workflow-testing-framework',
    '#required-inputs',
    '#failure-triage',
  ]);
  assert.equal('body' in sourceIndex, false);

  const catalog = JSON.parse(await readFile(join(rootDir, '.xdx-learning', 'catalog', 'knowledge-catalog.json'), 'utf8'));
  assert.equal(catalog.cards[0].sectionIndexPath, '.xdx-learning/catalog/sources/workflow-testing-framework.index.json');

  await writeFile(frameworkPath, '# Workflow Testing Framework\n## Changed Section\n', 'utf8');
  await initializeWorkspace(rootDir);
  const refreshedIndex = JSON.parse(await readFile(indexPath, 'utf8'));
  assert.deepEqual(refreshedIndex.sections.map((section) => section.anchor), [
    '#workflow-testing-framework',
    '#changed-section',
  ]);
});
