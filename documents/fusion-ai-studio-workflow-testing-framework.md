# Fusion AI Studio Workflow Testing Framework for Codex

Use this Markdown file as the instruction framework for Codex when testing a Fusion AI Studio Workflow from a VS Code workspace.

This framework is based on the internal Fusion AI Studio CLI and ATLAS workflow-testing guidance found in Oracle Central Confluence during the referenced research. Treat it as a practical test harness prompt, not as a replacement for the current product documentation or environment-specific release notes.

## Purpose

Create repeatable, source-controlled workflow tests for Fusion AI Studio Workflows using VS Code, the Fusion AI Studio CLI, and ATLAS workflow testing.

The default path is:

1. Authenticate to the target Fusion environment.
2. Confirm the current user with `whoami`.
3. Fetch or refresh the workflow into the VS Code workspace.
4. Generate an ATLAS workflow test from a realistic user scenario.
5. Record external BO/REST data needed by the workflow.
6. Run repeatable file-mode hybrid workflow tests.
7. Separately identify any live-mode integration checks that are still required.
8. Report failures, warnings, token usage, duration, and next actions.

## Required Inputs

Fill these values before running the framework.

```text
FUSION_POD_URL=<target Fusion pod URL>
FUSION_USERNAME=<Fusion username>
WORKSPACE_ROOT=<absolute path to VS Code workspace>
WORKFLOW_CODE=<workflow code>
WORKFLOW_DISPLAY_NAME=<workflow display name>
TEST_NAME=<stable kebab-case test name>
SCENARIO=<realistic user request to test>
EXPECTED_INTENT=<what the workflow should do>
EXPECTED_REQUIRED_PATHS=<nodes, branches, tools, or operations that must run>
EXPECTED_FORBIDDEN_PATHS=<nodes, branches, tools, or operations that must not run>
EXPECTED_FINAL_RESPONSE=<semantic expectation for the final assistant or workflow output>
LIVE_VALIDATION_REQUIRED=<yes/no>
```

Use stable names. Prefer `kebab-case` for test names and avoid embedding dates unless the date is part of the scenario.

## Assumptions

- The VS Code workspace already contains the Fusion AI Studio skill or can resolve the `aistudio` CLI.
- The Fusion AI Studio VS Code extension is installed when visual fetch, inspection, or designer validation is needed.
- The workflow source can be fetched into the workspace before testing.
- Authentication is interactive and environment-specific. Do not hardcode passwords, tokens, cookies, or session headers in tests.
- File-mode ATLAS tests are for repeatable workflow regression. They do not prove the live Fusion pod currently has the same data, permissions, or update behavior.

## Codex Operating Rules

When using this file, Codex should follow these rules:

- Inspect the workspace before assuming paths, workflow source locations, or CLI aliases.
- Prefer the project-local AI Studio CLI and skill over global commands when both exist.
- Keep tests source-controlled where the workspace normally stores AI Studio workflow tests.
- Do not publish, save to server, mutate live data, or run destructive integration checks unless explicitly authorized.
- Redact credentials and personal tokens from logs and reports.
- Separate repeatable file-mode regression results from live-mode integration findings.
- Report exact commands run, pass/fail status, warnings, token usage, duration, and unresolved evidence gaps.

## Step 1: Confirm CLI and Authentication

From the VS Code terminal, run the project-local CLI when available.

Example project-local form:

```bash
node .agents/skills/aistudio/scripts/aistudio.js authenticate
node .agents/skills/aistudio/scripts/aistudio.js whoami
```

Example alias form:

```bash
aistudio authenticate
aistudio whoami
```

Expected result:

- Authentication completes for the target pod.
- `whoami` returns the expected Fusion user.
- The pod and user match the test target.

Failure triage:

- If authentication fails, stop workflow testing and report the auth failure.
- If `whoami` returns the wrong user or pod, stop and ask for the correct environment.
- If the CLI is not found, inspect `.agents/skills/aistudio/scripts/`, workspace instructions, and any project-local guide before using a global command.

## Step 2: Fetch or Refresh the Workflow

Use VS Code when visual confirmation is needed:

```text
Command Palette -> Fusion AI Studio: Fetch from Server -> Workflow
```

Select:

```text
<WORKFLOW_CODE> / <WORKFLOW_DISPLAY_NAME>
```

CLI equivalent:

```bash
aistudio do-fetch-workflow \
  --workflow-code <WORKFLOW_CODE> \
  --force
```

Expected result:

- The workflow appears under the workspace `sources` area.
- The workflow opens in the visual designer.
- The local source corresponds to the intended server workflow.

Codex verification:

- Locate the fetched workflow files.
- Confirm the workflow code matches `<WORKFLOW_CODE>`.
- Identify existing test files, if any.
- Do not overwrite existing tests without first summarizing what will change.

## Step 3: Generate an ATLAS Workflow Test

Generate a test from a realistic user scenario.

```bash
aistudio do-generate-workflow-test \
  --workflow-code <WORKFLOW_CODE> \
  --scenario "<SCENARIO>"
```

Example:

```bash
aistudio do-generate-workflow-test \
  --workflow-code PRJ_PJF_PROJECT_INITIATION_ASSISTANT_TEAM \
  --scenario "Create a project named Vision Upgrade Readiness with Business Unit Vision India Demo. Start date 2026-07-01"
```

Codex prompt:

```text
Create an ATLAS workflow test for <WORKFLOW_CODE>.

Scenario:
<SCENARIO>

Use a stable test name:
<TEST_NAME>

The test must assert:
- Required workflow paths: <EXPECTED_REQUIRED_PATHS>
- Forbidden workflow paths: <EXPECTED_FORBIDDEN_PATHS>
- Final output semantics: <EXPECTED_FINAL_RESPONSE>

Use record-now external data capture if the test needs BO or REST responses.
Keep the test source-controlled and report the generated files.
```

Expected result:

- A workflow test file is generated in the workspace.
- The scenario is encoded as workflow input.
- The test contains deterministic assertions for routing, node execution, required data, and prohibited branches.
- The test contains semantic assertions where exact string matching would be brittle.

## Step 4: Record External BO/REST Data

Record representative external responses so file-mode tests can replay them.

```bash
aistudio do-record-workflow-test \
  --workflow-code <WORKFLOW_CODE> \
  --test-name <TEST_NAME> \
  --data-capture-policy record-now
```

Example:

```bash
aistudio do-record-workflow-test \
  --workflow-code PRJ_PJF_PROJECT_INITIATION_ASSISTANT_TEAM \
  --test-name project-preview-required-information \
  --data-capture-policy record-now
```

Expected result:

- Required BO/REST boundaries are recorded.
- Recorded data is compact enough for repeatable tests.
- The captured fields are sufficient for downstream routing, prompt inputs, and assertions.

If ATLAS reports `needs-model-test-data`:

1. Review the proposed compacted response.
2. Keep only fields and rows needed by routing, prompts, and assertions.
3. Remove volatile or irrelevant fields such as timestamps, generated IDs, session metadata, and large unused payload sections.
4. Preserve enough business identifiers to make failures diagnosable.
5. Re-run the recording step.

Practical target:

```text
Approximately 3 KB per recorded node where possible.
```

Do not over-minimize data if doing so hides business logic, branching conditions, permission-sensitive behavior, or error handling.

## Step 5: Run File-Mode Hybrid Tests

Run repeatable regression tests against local workflow source with recorded external data.

```bash
aistudio run-workflow-tests \
  --workflow-code <WORKFLOW_CODE> \
  --data-source file \
  --evaluation-mode hybrid
```

Example:

```bash
aistudio run-workflow-tests \
  --workflow-code PRJ_PJF_PROJECT_INITIATION_ASSISTANT_TEAM \
  --data-source file \
  --evaluation-mode hybrid
```

Codex prompt:

```text
Run all tests for <WORKFLOW_CODE> in file mode with hybrid evaluation.

Summarize:
- Passed tests
- Failed tests
- Warnings
- Deterministic path assertion results
- Semantic evaluation results
- Token usage
- Duration
- Changed files
- Recommended fixes

Do not perform live server mutations. If live validation appears necessary, list it separately as a proposed integration check.
```

Expected ATLAS behavior:

- Executes the local workflow source.
- Replays recorded BO/REST responses.
- Executes routing, code, conditions, and LLM nodes.
- Validates deterministic workflow path assertions.
- Uses semantic evaluation for natural-language outputs where exact text matching is inappropriate.
- Reports failures, warnings, usage, and duration.

## File-Mode Versus Live-Mode Validation

Keep these validation types separate.

| Validation type | Use for | Do not use for |
| --- | --- | --- |
| File-mode hybrid ATLAS test | Repeatable regression, workflow source behavior, routing, replayed BO/REST boundaries, deterministic and semantic assertions | Proving current live pod data, permissions, availability, or write/update success |
| Live-mode integration validation | Current Fusion authentication, BO/REST endpoint access, live data shape, permissions, update behavior, environment-specific wiring | Stable regression coverage unless explicitly isolated and controlled |

Live-mode checks require explicit authorization when they could read sensitive data, mutate records, trigger side effects, or depend on customer environments.

## Recommended Test Structure

Each workflow test should document:

```text
test_name:
workflow_code:
scenario:
mode:
data_source:
evaluation_mode:
inputs:
recorded_external_data:
required_paths:
forbidden_paths:
deterministic_assertions:
semantic_assertions:
expected_final_response:
known_limits:
live_validation_required:
```

Recommended assertion categories:

- Input capture: required user values are extracted correctly.
- Routing: the expected workflow path or branch runs.
- Tool/BO/REST use: the correct external boundaries are invoked or replayed.
- Guardrails: forbidden tools, branches, or updates do not run.
- Error handling: missing or invalid input produces the expected recovery path.
- Output semantics: the final answer contains the required business decision, summary, or next step.
- Efficiency: token usage and duration are within expected bounds when the test framework exposes those values.

## Example Test Matrix

| Test name | Scenario | Main assertion | Mode |
| --- | --- | --- | --- |
| happy-path-create-preview | User provides all required fields for a preview/create workflow | Required path runs and final answer summarizes the preview | File hybrid |
| missing-required-field | User omits a required field | Workflow asks for the missing value and does not call create/update operation | File hybrid |
| ambiguous-business-object | User gives a name that matches multiple records | Workflow asks for disambiguation and does not continue silently | File hybrid |
| external-data-empty | Recorded BO/REST response returns no matching rows | Workflow explains no match and offers a safe next step | File hybrid |
| permission-or-live-access | Confirm current user can access the target BO/REST endpoint | Live integration |

## Failure Triage

Use this sequence when tests fail.

1. Authentication and environment
   - Re-run `whoami`.
   - Confirm the pod, user, and workflow code.
   - Confirm the VS Code workspace is the intended workspace.

2. Workflow source
   - Confirm the workflow was fetched after the latest server change.
   - Check whether local workflow source changed after test generation.
   - Re-fetch only when the server version is the intended source of truth.

3. Recorded external data
   - Check for missing captured nodes.
   - Check whether compacted data removed fields required by prompts, routing, or assertions.
   - Re-record using `record-now` when the test data is stale or incomplete.

4. Deterministic assertions
   - Confirm node names, branch names, and operation identifiers still match the workflow.
   - Update assertions only if the intended workflow behavior changed.

5. Semantic assertions
   - Tighten vague expectations.
   - Replace brittle exact strings with meaning-based criteria.
   - Preserve exact assertions for IDs, dates, statuses, or other values that must be precise.

6. Live integration boundary
   - If file-mode passes but live behavior fails, treat it as an integration issue.
   - Check current BO/REST permissions, live data, endpoint versions, pod routing, and server-side workflow deployment state.

## Reporting Template

Codex should report results in this format:

````markdown
## Fusion AI Studio Workflow Test Report

Workflow: <WORKFLOW_CODE>
Workspace: <WORKSPACE_ROOT>
Mode: file
Data source: file
Evaluation: hybrid
Run time: <timestamp>

### Result

- Overall status: <pass/fail/blocked>
- Tests run: <count>
- Passed: <count>
- Failed: <count>
- Warnings: <count>
- Duration: <duration>
- Token usage: <token usage if reported>

### Commands Run

```bash
<commands>
```

### Changed Files

- <file path>

### Failures

| Test | Failure | Likely cause | Recommended action |
| --- | --- | --- | --- |
| <test name> | <failure> | <cause> | <action> |

### Live Validation Still Required

- <yes/no>
- <specific live checks, if any>

### Notes

- <important caveats>
````

## Ready-to-Use Codex Prompt

Copy this prompt into Codex from the VS Code workspace root.

```text
Use the Fusion AI Studio Workflow Testing Framework in this file.

Workflow:
- Code: <WORKFLOW_CODE>
- Display name: <WORKFLOW_DISPLAY_NAME>

Scenario:
<SCENARIO>

Expected behavior:
- Intent: <EXPECTED_INTENT>
- Required paths: <EXPECTED_REQUIRED_PATHS>
- Forbidden paths: <EXPECTED_FORBIDDEN_PATHS>
- Final response semantics: <EXPECTED_FINAL_RESPONSE>

Instructions:
1. Inspect the workspace and find the project-local AI Studio CLI.
2. Authenticate only if needed, then run whoami and confirm the user/pod.
3. Fetch or refresh the workflow if the local source is absent or stale.
4. Generate an ATLAS workflow test named <TEST_NAME>.
5. Record external data with record-now if the workflow calls BO/REST boundaries.
6. Run file-mode hybrid workflow tests.
7. Distinguish repeatable file-mode results from any live-mode integration validation still required.
8. Report commands, changed files, failures, warnings, token usage, duration, and next actions.

Do not publish, save to server, mutate live records, or run live integration checks unless I explicitly authorize that step.
```

## Command Reference

```bash
# Authenticate
aistudio authenticate

# Confirm identity
aistudio whoami

# Fetch workflow source
aistudio do-fetch-workflow \
  --workflow-code <WORKFLOW_CODE> \
  --force

# Generate a workflow test
aistudio do-generate-workflow-test \
  --workflow-code <WORKFLOW_CODE> \
  --scenario "<SCENARIO>"

# Record external BO/REST data
aistudio do-record-workflow-test \
  --workflow-code <WORKFLOW_CODE> \
  --test-name <TEST_NAME> \
  --data-capture-policy record-now

# Run repeatable workflow regression tests
aistudio run-workflow-tests \
  --workflow-code <WORKFLOW_CODE> \
  --data-source file \
  --evaluation-mode hybrid
```

Use the `node .agents/skills/aistudio/scripts/aistudio.js ...` form instead of `aistudio ...` when the workspace does not define the CLI alias.
