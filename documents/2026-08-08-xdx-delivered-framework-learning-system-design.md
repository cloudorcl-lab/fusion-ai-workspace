# XDX Delivered-Framework Learning System — Design Review

**Status:** Revised after independent adversarial review; implementation remains unauthorized.

**Scope:** This workspace first. The package must later be portable to other teams and workspaces without carrying any team's delivered artifacts.

## Purpose

Create a reusable learning system that prevents delivered-framework discoveries from being lost between development cycles. It will give each user a workspace-specific baseline, surface only relevant learnings during authoring, retain new evidence at session close, and allow carefully governed community sharing.

The system must support customer-deployment quality: traceable evidence, safe data handling, explicit validation status, reproducible behavior, and continuity when a developer switches machines.

## Current state and design delta

This is not a greenfield workspace. The initial design must reuse, rather than recreate, these existing assets:

- `server-snapshots/aistudio-workflows/` already contains a structured local inventory of 954 parsed workflow definitions, with 24,869 nodes and 28,579 outcome edges. Its index records 955 expected downloads, 954 successful downloads, and one failed capture.
- `workflow-structures.json`, `workflow-structure-summary.json`, and `workflow-structure-analysis.md` are an injection-safe structural seed for early retrieval.
- `.agents/skills/aistudio/` provides the existing CLI and reference material.
- `documents/fusion-ai-studio-workflow-testing-framework.md`, `test/`, and the existing workflow-test runner provide the starting test methodology and executable tests.

The learning system is therefore a small retention and evidence layer over these assets. It does not replace the snapshot analysis, CLI, or test framework. The baseline manifest must include source pod identity where available, release, snapshot timestamp, expected/downloaded/failed counts, and completeness status. Hash changes alone do not establish freshness.

## Brainstorming record

### Problem framing

The delivered `ORA_` footprint is useful as reference material, but it is not automatically a supported implementation pattern. It has not been comprehensively tested. New development should therefore be governed around `XDX_` objects, while the delivered footprint supplies evidence and hypotheses.

The initial need is not another set of notes. It is a learning loop that captures discoveries, distinguishes confidence levels, retrieves the right knowledge for each task, and carries it into later sessions without filling the model context with raw history.

### Decisions made

| Decision | Outcome |
|---|---|
| Initial implementation scope | Start in this workspace. Defer cross-workspace aggregation. |
| Governed development surface | Only new `XDX_` objects are governed initially. |
| Delivered `ORA_` footprint | Analyze as baseline context; do not treat it as approved until tested. |
| First tracked activity | After Phase 0, assess and run a representative, safe delivered-footprint testability campaign. |
| Baseline coverage | Inventory configured allowed roots first; deeply analyze only approved structured formats in later phases. |
| Baseline creation | `xdx-learn learn` is deferred until after the retention hypothesis succeeds. |
| Retrieval | Phase 0 uses simple retrieval seeded from existing structural assets; local BM25 and a compact brief are deferred. |
| Session continuity | Phase 0 is `capture` and `find`; `start` / verify / `close` lifecycle is deferred. |
| Refresh | Snapshot age and completeness are visible immediately; incremental/full refresh follows `learn` in a later phase. |
| Persistence | Git tracks only redacted, schema-validated candidate evidence, receipts, promotions, manifests, and policy. Raw state and generated views are ignored. |
| Machine switching | A developer commits and explicitly pushes/pulls retained learning state using normal Git workflow; no automatic push. |
| Community sharing | Deferred until after Phase 0; records are versioned and serializable to preserve the option. |
| Deferred exploration | A separate per-user Git repository spanning many workspaces may be explored later. It is not part of the first build. |

### Existing workspace boundaries to honor

- All new developer-controlled objects use the `XDX_` prefix.
- `aiapps/` is excluded from discovery, source-of-truth analysis, and knowledge retrieval unless explicitly enabled for a particular operation.
- New app/agent work must use the workspace's required data-access decision before discovery or implementation.
- Remote save, publish, and push remain explicit-only actions.

## Proposed architecture

### First principle

The canonical retained knowledge is a Git-tracked evidence ledger. Search indexes, task briefs, and injected AI context are generated views and can be rebuilt. They are never the source of truth.

```text
Git-tracked evidence ledger
        ↓
Validated generated views
  - activity tracker
  - compact session brief
  - BM25 search corpus
        ↓
Skill/CLI session lifecycle and guarded XDX authoring
```

### Package and workspace state

The reusable package contains generic code and policy machinery only:

- Codex skill for task routing and session guidance;
- local `xdx-learn` CLI;
- schemas, allow-listed extractors, redaction checks, and policy rules;
- templates, test fixtures, and package tests;
- workspace configuration contract.

Each development repository contains a small, Git-tracked, redacted evidence layer:

```text
.xdx-learning/
  policy/              # roots, exclusions, redaction, authorization, identity
  ledger/              # schema-validated candidate evidence and promotions
  receipts/            # durable, redacted test-result receipts
  manifests/           # snapshot provenance, completeness, and freshness state
```

Ignored local state contains raw sessions, raw capture payloads, raw delivered observations, BM25 indexes, extraction caches, generated briefs/dashboards, temporary output, and full test logs. This preserves the user's cross-machine learning through Git-tracked, reviewable candidate receipts while avoiding the accept-once-forever risk of committing raw model/session data to a customer repository.

### Adopted security and performance controls

- **Context isolation:** Retrieved delivered material is untrusted data. Prompt bodies remain local retrieval-only references with explicit provenance and bounded rendering; they never enter the system/base context and are never interpreted as executable instructions. XML-style untrusted-data boundaries may improve clarity, but safety is enforced by the retrieval/assembly policy rather than markup alone.
- **Testing safety:** Read-only operation allow-lists, explicit target-environment classification, authorization checks, isolated tenants for writes, and cleanup plans are the primary controls. A local Node `vm` is not considered a security sandbox, and a container does not make a remote Fusion operation non-destructive.
- **Evidence sanitation:** Raw stdout, stderr, payloads, and transcripts are never committed. Deterministic secret patterns block a candidate receipt or promotion; entropy checks may flag a record for review but are not a standalone blocker.
- **Windows performance:** Use metadata comparison as a fast path, but periodically verify content hashes and available Git/snapshot revisions to avoid false freshness. SQLite state stores and AST caches are deferred until profiling demonstrates a material need.
- **Promotion trust:** Phase 0 relies on Git provenance, schema validation, and linked machine-verifiable test receipts. Cryptographic signatures and CI verification are deferred until a multi-contributor trust model, reviewer workflow, and key-recovery process are defined.

### Evidence and promotion model

Every capability, pattern, or constraint is a structured record with an evidence status:

1. **Observed** — found by an allow-listed static extractor or metadata inventory.
2. **Tested** — behavior confirmed by a linked, durable test receipt.
3. **XDX-approved** — eligible for reusable XDX authoring guidance after the tested evidence and any configured review requirement are met.
4. **Blocked**, **untestable**, **superseded**, or **rejected** — terminal states with a recorded reason and relevant owner or follow-up activity.

An observed record cannot directly create a template, guardrail, or approved XDX pattern. Every capture must provide structured object reference, claim, evidence pointer, and method; free-text-only records are rejected. A test receipt records environment/tenant fingerprint, release, test type, authorization level, read/write impact, run date, command/tool version, outcome, assertion summary, output hash, and retest/expiry policy. This is the portable evidence: it does not rely on an ignored `test-reports/` directory remaining present.

In a single-developer workspace, machine-verifiable linked evidence is the minimum promotion gate. A later multi-reviewer policy may add human approval without weakening that evidence requirement.

### Baseline and retrieval

Phase 0 does not build new extractors or require a BM25 engine. `find` is seeded from the existing structural workflow index and the existing testing/documentation assets, so it is useful before new learning has accumulated.

### Knowledge catalog and two-level retrieval

Existing detailed guidance in `documents/` is canonical source material, not content to duplicate into the learning ledger. The learning system maintains a small, Git-tracked knowledge catalog that routes work to these sub-frameworks at the appropriate lifecycle phase.

Each catalog entry contains a stable source ID, relative path, source hash, authority/status, applicable lifecycle phases, artifact types, activation triggers, concise summary, key constraints, and named `readNext` section anchors. The initial catalog entry is `documents/fusion-ai-studio-workflow-testing-framework.md`, with lifecycle phases `test`, `debug`, and `handoff` and section pointers for Required Inputs, Steps 1–5, Failure Triage, and Reporting Template.

The later BM25 corpus contains two record types:

1. **Routing cards** — compact records with title, phases, artifact types, triggers, summary, and section pointers. These fields receive high ranking weight so a query first finds the correct sub-framework.
2. **Section chunks** — heading-bounded excerpts linked to the same source ID and anchor. They provide the exact procedure only after the routing card has selected the source.

Retrieval runs in two passes: first rank routing cards using lifecycle phase and artifact type when known; then search only the selected document's relevant section chunks. The session receives a brief applicability statement, canonical path, section pointers, and bounded excerpts—not a full framework document. A source-hash mismatch marks the card stale until it is refreshed. Prompt content from any delivered artifact remains locally stored, retrieval-only untrusted data and never becomes system/base context.

After Phase 0 proves useful, `xdx-learn learn` performs the explicit full baseline refresh:

- scans configured, authorized roots without executing delivered files;
- applies type- and extension-specific extractors with resource limits;
- records relative paths, content hashes, extractor version, and evidence classification;
- detects additions, removals, and renames;
- regenerates baseline observations and a reviewable change report;
- rebuilds the local BM25 cache when required.

Session start performs a bounded freshness comparison against the manifest. It incrementally processes confirmed changes only. Large or ambiguous drift marks the baseline stale and asks for an explicit full refresh instead of silently performing an expensive scan.

After Phase 0, a generated, size-capped base brief may contain only durable high-priority rules, the baseline fingerprint, unresolved high-risk work, and retrieval pointers. It is a local generated view, not Git-tracked state. For a task, `xdx-learn find` retrieves a bounded set of relevant records. Retrieval results always display their evidence status, scope, and provenance. Ranking never overrides an approved policy rule.

### Session lifecycle

```text
start → retrieve relevant context → capture a structured candidate receipt
      → link test evidence or record blocker → close → reviewable Git change
```

- Phase 0 provides only `capture` and `find`; `start` and `close` are deferred until the retention loop is demonstrated.
- `capture` creates a redacted, schema-validated candidate record; it does not preserve a raw transcript or unverified model assertion.
- Normal Git review and explicit push/pull provide cross-machine continuity. No automatic remote action is permitted.
- Any future closeout gate starts warn-only and applies only to changed relevant `XDX_` artifacts. It records bypass/blocker rates and is hardened only if evidence shows it is useful rather than friction.

### Activity tracker and delivered-object testing

The first tracked campaign, after Phase 0, is a delivered-footprint testability assessment followed by a representative test plan across object classes rather than an unsafe blanket execution campaign.

Each activity records objective, object/reference, provenance class, risk level, testability classification, authorization status, test method, expected result, actual result, evidence, and follow-up. Provenance is authoritative: `delivered-snapshot`, `unclassified-external`, or `XDX-governed`; prefixes are only hints. Tests are read-only by default. Write-capable tests require explicit authorization, isolated test data, and a cleanup plan. Testability is derived from observed metadata plus available environment, dependencies, and authorization—not from a snapshot's `DRAFT` label alone.

### Learning packets

Learning packets are deferred beyond the first build. Phase 0 requires only that canonical records are schema-versioned, redacted, and serializable. A later packet design must use Git review/provenance as its initial trust mechanism, define a schema owner and migration policy, and never distribute delivered artifacts, raw payloads, credentials, or unredacted customer data.

## Adversarial review and design corrections

This table records the initial threat analysis. The post-adversarial implementation decisions below supersede its earlier assumptions about append-only raw session data, immediate BM25, packet exchange, and a hard closeout gate.

| Threat or gap | Design correction |
|---|---|
| Git merge conflicts and concurrent sessions | User-scoped append-only events are canonical; mutable tracker views are generated. |
| Skipped closeouts | Explicit lifecycle commands plus an XDX change gate; sessions can resume after interruption. |
| Noisy or surprising Git commits | Close prepares changes; policy decides whether it commits locally; never auto-push. |
| Secrets or customer data reaching Git | Default-deny content policy, redaction and secret scan before commit/export, explicit exception process. |
| Static inference mistaken for runtime truth | `observed → tested → XDX-approved` promotion boundaries, extractor provenance, and no automatic approval. |
| Unsafe or impossible ORA testing | Testability assessment, risk-based representative campaign, read-only default, explicit write authorization. |
| Prompt injection from delivered artifacts | Treat artifact content only as data; allow-listed structured extraction; never inject raw instructions into base context. |
| Poor BM25 matches | Policy precedence, visible provenance/status, counterexamples, and retrieval evaluation suite before authoring dependence. |
| Base context expands uncontrollably | Strict token budget and deterministic priority; detailed records stay on disk until retrieved. |
| Release, branch, or tenant drift | Content-hash/footprint fingerprints, stale marker, and explicit reconciliation. |
| Poisoned community packets | Quarantine, integrity/schema checks, identity and scope, local review/promotion only. |
| Unsafe analysis of executables | Configured roots, allow-listed file types, no execution during learn, resource caps, and conservative classifications. |
| Rule drift and permanent stale advice | Owner, scope, review date, supersession, retirement, and test evidence on approved records. |
| Package depends on this workspace | Generic package plus workspace configuration contract and fixture-workspace tests. |

## Non-goals for the first build

- A central hosted registry or service.
- Automatic remote Git push, remote AI Studio save, or workflow publishing.
- Copying or distributing delivered artifacts through learning packets.
- Treating static analysis as a substitute for runtime validation.
- Enabling `aiapps/` analysis without explicit user authorization.
- A universal cross-workspace personal-memory repository; retain this as a future exploration.

## Resolved review decisions

1. The customer-repository layout is acceptable only for redacted, schema-validated policy, manifests, candidate evidence, receipts, and promotions. Raw session material remains ignored.
2. The promotion ladder is valid only when `tested` includes a durable, machine-verifiable receipt; status names alone are insufficient.
3. The first implementation is narrower than originally proposed: ledger schema plus `capture` and `find`, seeded from existing assets. Deep extractors and full lifecycle features are deferred.
4. In this single-developer workspace, linked machine-verifiable evidence is mandatory. Workspace-owner approval is recorded for `XDX-approved`; independent review becomes an additional requirement only when the workspace adopts one.

## Post-adversarial implementation decisions

### Phase 0 — prove the retention hypothesis

Phase 0 is intentionally small:

1. Define the policy contract and versioned schemas for candidate evidence, durable test receipts, promotion records, and manifests.
2. Implement schema validation plus redaction/secret-scanning tests.
3. Implement only `xdx-learn capture` and `xdx-learn find`.
4. Seed `find` from the existing workflow structural index, testing framework, and approved documents. A canonical document may have a compact heading-only source index for routing, but do not build broad extractors, a tracker, BM25, session commands, packets, or CI gates.
5. Preserve Git portability through redacted candidate records and receipts. Keep raw transcripts, payloads, baseline observations, caches, and reports ignored.
6. Add manually curated knowledge-catalog entries for existing approved sub-frameworks, beginning with the workflow testing framework; use heading anchors rather than copying full documents.

### Later phases, only after Phase 0 qualifies

1. **Lifecycle and generated views** — add `start`/`close`, a generated brief, and local BM25 only after the Phase 0 record model has demonstrated value.
2. **Testability campaign** — derive a representative delivered-footprint test campaign from current snapshot metadata, dependency checks, and explicit authorization.
3. **Baseline refresh** — add `learn`, bounded freshness checks, and structured extractors. Workflow prompt bodies, if included, are retrieval-only untrusted data with visible attribution; they never enter the base/system context.
4. **Sharing and enforcement** — consider packets and a warn-only XDX closeout gate only after named consumers, a review channel, a schema owner, and demonstrated lifecycle use exist.

### Success, pivot, and stop criteria

Phase 0 succeeds only when all of the following are true:

- On 20 representative XDX authoring queries, the top five results contain a relevant approved or candidate record at least 80% of the time.
- At least four qualifying XDX development sessions use `capture` and `find` with schema-valid, redaction-clean records.
- Every promoted record links to a durable, machine-verifiable test receipt.

If either retrieval quality or qualifying-session adoption fails after four weeks of qualifying development work, pause expansion. Review the recorded failure modes and either simplify Phase 0 or retire the effort; do not add deferred features to compensate for weak adoption.

### Owners, review, and glossary

The workspace owner configures policy and decides whether a record is `XDX-approved`; machine-verifiable test evidence is mandatory even when the owner is also the author. A multi-reviewer policy may later require independent approval.

- **Footprint:** the configured local artifact set and its provenance/completeness manifest.
- **Candidate evidence:** a redacted, structured claim retained for review but not approved for reuse.
- **Test receipt:** durable minimal evidence of a test run; it is not a copy of raw test output.
- **Base brief:** a generated, size-capped local context view; it is not a Git-tracked source of truth.
- **Campaign:** a tracked set of testability and validation activities.
- **Packet:** a future serializable sharing envelope; it is not part of Phase 0.

### Accepted residual risks

- Structural seeding can find relevant architecture patterns but cannot establish runtime correctness.
- Redaction and secret scanning reduce, but cannot eliminate, customer-data disclosure risk; raw material remains ignored by default.
- The snapshot is incomplete by one expected workflow and can become stale until an explicitly authorized refresh occurs.

Each phase requires passing schema/behavior tests, redaction verification, a documented recovery path, and an updated design decision for any discovered constraint. No phase authorizes remote save, publish, push, or live write testing by default.

## Phase 0 implementation evidence

Phase 0 was implemented locally on the `codex/xdx-learning-phase-0` branch. The `xdx-learn` CLI provides only the approved `init`, `capture`, and `find` operations. It initializes the redacted `.xdx-learning/` policy, catalog, manifest, ledger, and receipt layout; it seeds the knowledge catalog with this workspace's workflow testing framework; and it rejects candidate records containing deterministic secret patterns.

Candidate evidence is append-only. When a later result corrects an earlier claim, `xdx-learn capture --supersedes <candidate-id>` records a new redacted candidate rather than rewriting history. `find` excludes a candidate whose ID has been superseded, so agents receive the current claim while Git retains the correction trail. This correction mechanism does not promote a record: `observed` remains the status until a durable, machine-verifiable test receipt supports `tested`.

The testing framework is now a first-class knowledge source. `init` generates `.xdx-learning/catalog/sources/workflow-testing-framework.index.json` from the canonical Markdown file. The generated index contains only the source path, SHA-256, and heading/anchor metadata (29 headings in the current framework); it deliberately does not contain the document body. The routing card links to that index, so agents can select the right framework section before opening the original document.

The knowledge demonstration queried `test and debug the XDX supplier workflow with ATLAS`. It routed first to `documents/fusion-ai-studio-workflow-testing-framework.md`, with pointers to Required Inputs, authentication, ATLAS test generation, Failure Triage, and Reporting Template. A captured `observed` candidate then recorded the actual test result for `XDX_SUPPLIER_QUERY_TEAM` without copying raw output.

The existing workflow testing framework was run through the bundled CLI. Both supplier scenarios passed their deterministic assertions (5/5 each). Local semantic judge results were reviewed and attached against the generated current requests, producing a canonical `passed` workflow suite: 2/2 passed, 0 failed, and 0 need judge. The final workflow summary also reported that AI-unit computation was unavailable because the runtime did not emit model names.
