# XDX Learning Phase 0 Implementation Plan

> **For agentic workers:** Execute inline with test-first development. Each task must complete its listed red-green verification before the next task starts.

**Goal:** Build the smallest Git-portable learning loop: initialize a redacted Phase 0 ledger, capture structured candidate evidence, and find relevant workspace knowledge seeded by the workflow testing framework and workflow structural index.

**Architecture:** A dependency-free Node ESM CLI owns only Phase 0. It creates a small tracked `.xdx-learning/` state tree, while its generated/cache state is ignored. The knowledge catalog holds compact routing cards; `find` scores those cards and candidate evidence with deterministic token overlap, returning source paths and heading pointers instead of injecting full documents.

**Tech Stack:** Node.js built-ins (`node:fs`, `node:path`, `node:crypto`, `node:test`, `node:assert`); existing npm workflow-test command for the demonstration run.

## Global Constraints

- New implementation-owned names use `XDX_` where the object namespace applies; the CLI name is `xdx-learn` because it is a filesystem command, not an AI Studio object.
- Exclude `aiapps/` from all source configuration and discovery.
- Do not execute delivered artifacts, use remote saves/publishes, or store credentials, raw payloads, transcripts, or raw test output.
- Phase 0 contains only `init`, `capture`, and `find`; no `learn`, BM25, session lifecycle, packet exchange, CI gate, or extractor engine.
- Git-tracked learning state is limited to policy, catalog, manifests, candidate evidence, and durable redacted receipts.

---

### Task 1: Create and validate Phase 0 workspace state

**Files:**
- Create: `scripts/xdx-learning/core.mjs`
- Create: `scripts/xdx-learn.mjs`
- Create: `test/xdx-learning/init.test.mjs`

**Interfaces:**
- Produces `initializeWorkspace(rootDir): Promise<{ created: string[] }>`.
- Produces `resolveLearningPaths(rootDir): LearningPaths` for the CLI and later commands.
- `init` creates `.xdx-learning/policy/policy.json`, `.xdx-learning/catalog/knowledge-catalog.json`, `.xdx-learning/manifests/seed-sources.json`, `.xdx-learning/ledger/candidates.jsonl`, `.xdx-learning/receipts/.gitkeep`, and `.xdx-learning/.gitignore`.

- [ ] **Step 1: Write failing initialization tests**

```js
test('initializeWorkspace creates tracked Phase 0 state and excludes aiapps', async () => {
  await initializeWorkspace(tempRoot);
  const policy = JSON.parse(await readFile(join(tempRoot, '.xdx-learning/policy/policy.json')));
  assert.deepEqual(policy.excludedRoots, ['aiapps/']);
  assert.ok(policy.trackedState.includes('ledger/candidates.jsonl'));
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test test/xdx-learning/init.test.mjs`

Expected: failure because `core.mjs` and `initializeWorkspace` do not exist.

- [ ] **Step 3: Implement the minimal initializer**

Implement the exported functions using Node built-ins. Seed a single `workflow-testing-framework` routing card pointing to `documents/fusion-ai-studio-workflow-testing-framework.md`, its source SHA-256, phases `test`, `debug`, `handoff`, and the approved heading pointers. Seed source-manifest metadata from `server-snapshots/aistudio-workflows/workflow-index.json` when present; record no raw snapshot content.

- [ ] **Step 4: Re-run the initialization test**

Run: `node --test test/xdx-learning/init.test.mjs`

Expected: PASS.

### Task 2: Capture schema-validated, redacted candidate evidence

**Files:**
- Modify: `scripts/xdx-learning/core.mjs`
- Modify: `scripts/xdx-learn.mjs`
- Create: `test/xdx-learning/capture.test.mjs`

**Interfaces:**
- Produces `captureCandidate(rootDir, input): Promise<CandidateRecord>`.
- Required input fields: `id`, `objectRef`, `claim`, `evidenceRef`, `method`, `source`.
- Rejects records containing deterministic secret patterns or missing required fields.

- [ ] **Step 1: Write failing capture tests**

```js
test('captureCandidate appends a structured candidate receipt', async () => {
  const record = await captureCandidate(tempRoot, validCandidate);
  assert.equal(record.status, 'observed');
  assert.match(await readFile(candidateLedger), /XDX_TEST_RECORD/);
});

test('captureCandidate rejects a bearer token', async () => {
  await assert.rejects(() => captureCandidate(tempRoot, { ...validCandidate, claim: 'Bearer abc.def.ghi' }), /sensitive/i);
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test test/xdx-learning/capture.test.mjs`

Expected: failure because `captureCandidate` does not exist.

- [ ] **Step 3: Implement the minimal capture contract**

Validate required strings, scan all persisted text fields for bearer tokens, passwords, private-key markers, and JWT-like values, then append one JSON object per line with `status: "observed"`, `schemaVersion`, and `capturedAt`. Never accept arbitrary raw payload fields.

- [ ] **Step 4: Re-run the capture test**

Run: `node --test test/xdx-learning/capture.test.mjs`

Expected: PASS.

### Task 3: Find phase-relevant routing cards and candidate evidence

**Files:**
- Modify: `scripts/xdx-learning/core.mjs`
- Modify: `scripts/xdx-learn.mjs`
- Create: `test/xdx-learning/find.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces `findKnowledge(rootDir, query): Promise<Array<KnowledgeMatch>>`.
- `KnowledgeMatch` exposes `kind`, `score`, `title`, `sourcePath`, `readNext`, `status`, and `summary`.
- CLI: `node scripts/xdx-learn.mjs init|capture|find`; `find --json <query>` provides machine-readable output.

- [ ] **Step 1: Write failing find tests**

```js
test('findKnowledge routes workflow testing queries to the canonical framework', async () => {
  await initializeWorkspace(tempRoot);
  const matches = await findKnowledge(tempRoot, 'test and debug a workflow with ATLAS');
  assert.equal(matches[0].title, 'Fusion AI Studio Workflow Testing Framework');
  assert.equal(matches[0].sourcePath, 'documents/fusion-ai-studio-workflow-testing-framework.md');
  assert.ok(matches[0].readNext.includes('Failure Triage'));
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test test/xdx-learning/find.test.mjs`

Expected: failure because `findKnowledge` does not exist.

- [ ] **Step 3: Implement deterministic retrieval and CLI wiring**

Tokenize normalized query/card text, score matched token counts with a higher multiplier for card title, phases, artifact types, and triggers, then return stable score-descending results. Include redacted candidate records in the same result model. Add `npm run test:learning` using `node --test test/xdx-learning/*.test.mjs`.

- [ ] **Step 4: Re-run learning tests**

Run: `npm run test:learning`

Expected: PASS.

### Task 4: Demonstrate the system with the existing testing framework

**Files:**
- Modify: `documents/2026-08-08-xdx-delivered-framework-learning-system-design.md`
- Create: `.xdx-learning/` Phase 0 state through `init`

**Interfaces:**
- `find` returns the workflow-testing framework card and heading pointers for a workflow-test query.
- Existing `npm test` remains the framework-driven workflow-test demonstration.

- [ ] **Step 1: Initialize learning state**

Run: `node scripts/xdx-learn.mjs init`

Expected: tracked Phase 0 state exists; no `aiapps/` root is admitted.

- [ ] **Step 2: Demonstrate guidance retrieval**

Run: `node scripts/xdx-learn.mjs find --json "test and debug the XDX supplier workflow with ATLAS"`

Expected: the first routing result points to `documents/fusion-ai-studio-workflow-testing-framework.md` and lists the relevant section anchors.

- [ ] **Step 3: Run the existing workflow testing framework**

Run: `npm test`

Expected: existing workflow test suite completes; report its actual pass/fail result without claiming live validation.

- [ ] **Step 4: Update design evidence and verify all tests**

Record the implementation/test demonstration outcome in the design document without copying raw test output. Run `npm run test:learning` and `npm test`; run `git diff --check` on tracked modifications.

## Plan self-review

- Spec coverage: Tasks 1–3 implement the approved Phase 0 only; Task 4 proves routing through the existing testing framework and runs its existing suite.
- No placeholders: every task defines exact files, commands, interfaces, and expected red/green behavior.
- Scope check: BM25, `learn`, broad baseline analysis, packets, lifecycle automation, CI, signatures, Docker, SQLite, and AST caching remain deferred.
