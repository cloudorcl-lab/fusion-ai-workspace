# App Test Authoring

Use this reference after creating or materially editing an Agentic App. App tests validate the app panel contract, not only the backing workflow.

## When To Run App Test Sync

After a successful app create or material app edit, do not stop after writing the app file, validating the app, or syncing workflow tests. Unless the user explicitly opted out or asked only for planning, run app test sync when the app has at least one top-level agent container.

Run:

```text
node .agents/skills/aistudio/scripts/aistudio.js get-app-test-sync-plan --file <app-file>
```

Mode selection matters. If the user asks to show, inspect, preview, display, or get the app test sync plan, run only `get-app-test-sync-plan --file <app-file>` and stop after explaining that read-only plan. Do not run backing workflow sync, `do-sync-app-tests`, app test generation, app test runs, or judge attachment for a preview request. If the user asks to run, execute, generate, regenerate, sync, create/update tests, or complete the app test sync plan, treat it as execution mode: complete required backing workflow sync loops, run `do-sync-app-tests`, then run `get-app-test-final-summary --file <app-file>`.

If the sync plan returns only `NO_CONTAINERS`, stop and report that the app shell has no testable panels yet. Do not fabricate app tests for an empty app shell. App tests start once the app has a top-level agent container wired to a workflow.

## What App Tests Prove

Phase 1 app tests target `InitDisplay` for each top-level app panel.

They prove:

- the selected app panel resolves to the intended workflow agent
- the workflow has an `InitDisplay` app-stage route
- the debug request uses the app-stage input shape
- required path assertions execute for that app-stage route
- recordable workflow nodes can replay from stored data in file mode
- returned `oraInfoDisplay` widgets match the panel's stored widget contract
- malformed widget JSON is treated as a deterministic failure

They do not replace workflow tests. Workflow tests still cover workflow-level branches, Query/Summary app-stage paths, and boundary scenarios.

## Test Files

App tests are JSON files.

Legacy layout:

```text
test/apps/<app-code-folder>/<test-name>.json
```

App-package layout:

```text
app-pkg/<package>/tests/ai/self/<module-name>/applications/<app-code-folder>/<test-name>.json
```

The app code folder follows workflow test folder style: use the lowercased artifact code folder name and preserve underscores. Example:

```text
FABS_ANNUAL_TEAM_PERFORMANCE_DASHBOARD -> fabs_annual_team_performance_dashboard
```

There is no panel directory level. The panel segment is stored in JSON metadata and used in the test name, reports, and filters.

App test JSON must not depend on app source file paths or app versions. The stable app identity is `app.appCode`; panel identity and workflow identity live under `panel` and `agent`. File paths and current versions belong in command output and reports, not in the source-controlled test definition.

## Panel And Test Naming

Generated init display tests use:

```text
init_display_<panel_segment>
```

Panel segment precedence:

1. normalized panel title
2. normalized panel id
3. normalized container id

Normalize by trimming, lowercasing, replacing non-alphanumeric runs with `_`, collapsing repeated `_`, and trimming leading/trailing `_`.

If sibling panels collide, suffix every member of the collision group with `__<last-8-container-id-chars>`.

## Sync Loop

1. Run `get-app-test-sync-plan --file <app-file>` to discover the app panels and referenced backing workflow files.
2. For each workflow listed under `Required backing workflow sync loops` or `Required app-related workflow coverage`, execute the normal workflow test sync loop from `workflow-test-authoring.md` to completion before app test sync. Workflows listed under `Current backing workflow sync loops` or `Current app-related workflow coverage` are already current; do not rerun their suites just to prove completion. Process required workflows sequentially, one workflow at a time: complete one workflow sync loop to its exit condition before starting the next. When the app sync plan prints a required workflow command, treat it as work for the assistant to execute; do not hand that command back to the user as the next step unless blocked by authentication, remote conflict, destructive action approval, explicit synthetic-data approval, missing live data, invalid workflow/app runtime behavior, or another concrete blocker. If a backing workflow was just created or materially changed, save and normalize that workflow once before generating, updating, recording, or running its workflow tests. Do not save a backing workflow after its workflow suite has passed unless you changed the workflow again after that pass. Workflow app-stage input design belongs to `workflow-test-authoring.md`: preserve the trigger envelope, provide meaningful stage-specific semantic input when required, and never treat an empty Query message as meaningful semantic Query coverage unless the test is explicitly limited empty-message smoke coverage. Do not create workflow tests that mirror app panel names, panel titles, widget names, or app test names; app panel validation belongs in app tests under `test/apps`. Do not batch all workflows and move to app sync after the first workflow passes. Do not limit workflow sync to InitDisplay, panel-prerequisite routes, or workflows that already have app tests. If recording is blocked by auth, missing environment data, invalid workflow output, workflow execution errors, missing non-Query app-stage input context, or remote save failures, report that blocker under that workflow with the test name and command that remains blocked.
3. Before live app runtime execution for a newly created or materially changed app, save the app DRAFT with `do-save-app --file <app.app>`. Do not save every backing workflow as a routine app-sync preflight. Workflow saves belong to the workflow sync loop before workflow test generation/recording/runs when the workflow was newly created or materially changed, and to the workflow debug runner's safe `FAI-40300` recovery path. Do not overwrite a newer remote DRAFT without the normal version safety checks.
4. Run `do-sync-app-tests --file <app-file>` after the backing workflow sync loop has finished or produced explicit blockers. `do-sync-app-tests` generates or updates app panel tests, runs app tests, and writes app/consolidated reports. It does not generate, record, or run workflow tests. After `do-sync-app-tests` completes, always run `get-app-test-final-summary --file <app-file>`. Compose the final response with your concise creation, update, or run summary first, then add a section named exactly `Validation and Insights` based on the command output. The command output is authoritative evidence, not mandatory prose: you may reformat and deduplicate it, but you must preserve app test counts, the consolidated report, the app suite report, and every backing workflow's suite report, `Metrics:`, and `Optimization:`. Preserve compact issue and next-step guidance when present. All test and report details belong under `Validation and Insights`, not in the creation summary. Do not return the `do-sync-app-tests` marked block as the final user-facing answer. If `get-app-test-final-summary` fails, report that command failure and the exact command instead of writing a substitute validation summary.
5. If you manually execute the app plan instead of `do-sync-app-tests`, for each app `create` action run `do-generate-app-test --file <app-file> --panel-segment <panelSegment> --data-capture-policy record-later`.
6. For each app `update` action, run `do-update-app-test --file <app-file> --test-file <testFile>`.
7. For each app `review` action, stop and report the review reason. Do not rename or overwrite custom tests automatically.
8. Only if you are not using `do-sync-app-tests`, or the command failed before producing reports and you are manually executing a sync plan, run deterministic validation:

```text
node .agents/skills/aistudio/scripts/aistudio.js run-app-tests --app-code <APP_CODE> --data-source file --evaluation-mode deterministic
```

9. Repair app, workflow, test data, path assertions, or widget expectations based on deterministic failures.
10. Only if you are not using `do-sync-app-tests`, or the command failed before producing app reports and you are manually executing the app test plan, run the final app suite without overriding evaluation mode:

```text
node .agents/skills/aistudio/scripts/aistudio.js run-app-tests --app-code <APP_CODE>
```

11. If local app judge requests are produced, create matching judge result JSON files and attach them once:

```text
node .agents/skills/aistudio/scripts/aistudio.js do-attach-app-test-judge-results --report-root-dir test-reports/apps --cleanup-scratch true
```

Use app-package report roots when the CLI prints package-local paths.

After judge attachment, run `get-app-test-final-summary --file <app-file>` and use that command output as evidence for the final response section named exactly `Validation and Insights`. Judge attachment already refreshes parent reports; do not rerun `do-sync-app-tests` or replay workflow suites merely to refresh status or summary text.

## Pre-App-Sync Gate

Before running `do-sync-app-tests`, read the latest `get-app-test-sync-plan --file <app-file>` output and verify every workflow listed under `Required backing workflow sync loops` or `Required app-related workflow coverage` has reached a terminal workflow sync state. A terminal workflow sync state is one of: workflow suite passed; workflow suite failed with a concrete failure reason; local judge remains pending with the judge request path and attach command; or a concrete blocker is reported for that workflow with workflow code, test name, blocked command, and reason. Workflows listed under `Current backing workflow sync loops` or `Current app-related workflow coverage` are already current and do not need another workflow suite run just to prove completion. If any required workflow still has missing or out-of-sync workflow actions and no concrete blocker, continue that workflow's normal workflow-test-authoring loop. Do not run `do-sync-app-tests` yet.

Do not treat `Ready panels` in the app sync plan as permission to run app sync while backing workflow actions remain missing or out of sync. `Ready panels` only means app panel test definitions can exist; it does not mean backing workflow coverage is complete. Do not treat existing pending app test files as progress that replaces workflow sync. Do not ask the user to run the printed workflow commands; execute them yourself unless blocked by authentication, remote conflict, destructive action approval, explicit synthetic-data approval, missing live data, invalid workflow or app runtime behavior, or another concrete blocker.

Before the first `do-sync-app-tests` command in an app flow, keep a short internal checklist for each backing workflow: workflow code, workflow file, latest sync-plan counts, suite report path if one exists, and terminal state. If any checklist item is still `missing` or `out_of_sync` without a blocker, the next action is the workflow sync loop for that workflow, not app sync.

If `do-sync-app-tests` blocks because backing workflow sync is incomplete, do not try to clear the gate by rerunning workflow suites first. Read the latest `get-app-test-sync-plan`, then for each blocked workflow run `get-workflow-test-sync-plan --file <workflow-file>` and execute only the missing or out-of-sync workflow sync actions it reports. Run that workflow's suite once only after a test file, test data, or judge state changed. Attach workflow judge results only when the latest workflow suite reports `needsJudge > 0`. Do not run both `run-workflow-tests --workflow-code <workflow-code>` and `run-workflow-tests --app-file <app-file>` for the same app sync gate. Do not use `run-workflow-tests --app-file <app-file>` to clear a `do-sync-app-tests` gate. Use `--app-file` only when the user explicitly asks to run the app-scoped workflow suite or when doing a user-requested model comparison or benchmark across all workflows backing an app.

## Final Response Checkpoint

Before answering the user after an app test sync flow, verify the final response includes a concise action summary followed by a section named exactly `Validation and Insights` based on the latest `get-app-test-final-summary --file <app-file>` output. For app creation or app modification, the action summary may include app and workflow names, file paths, panels created, and implemented behavior. For existing-app test generation, summarize only the test refresh work. For run-only requests, summarize what was run and do not use creation language. Do not duplicate test counts, report links, `Metrics:`, `Optimization:`, or next steps outside `Validation and Insights`.

## Reports

App test runs write the same three report formats as workflow tests:

```text
result.json
result.md
result.html
suite-result.json
suite-result.md
suite-result.html
```

App reports should foreground app-specific signal: widget assertions, panel contract, returned widgets, judge result, deterministic app checks, final output, and then workflow path diagnostics. Path assertions remain useful, but they are secondary in app reports.

After final workflow and app suites run, prefer the top-level report link when it exists:

```text
test-reports/suite-result.html
```

If only app tests ran, use the app suite report:

```text
test-reports/apps/suite-result.html
```

For app-package layout, use the package-local `test-reports/suite-result.html` or package-local application suite report printed by the CLI.

## Final Summary Rules

After `do-sync-app-tests`, `run-app-tests`, or an app-package test run, use `get-app-test-final-summary --file <app-file>` as the authoritative evidence source for the final section named exactly `Validation and Insights`. Compose the final app-facing response yourself, with creation, update, refresh, or run information first when applicable. You may reformat and deduplicate the command output, but do not drop app test counts, the consolidated report, the app suite report, or any backing workflow's suite report, `Metrics:`, or `Optimization:`. Preserve compact issue and next-step guidance when present. Do not wrap the section in a fenced code block and do not hand assemble these facts from report JSON. Use `--format json` only for explicit structured diagnostics or detailed failure investigation.

When both app and workflow suites ran, `get-app-test-final-summary` must include the app suite and every backing workflow from the app sync plan. If it reports blockers or unavailable Metrics/Optimization, present those lines from the command output. Do not collapse multiple workflow sections into one blob. Do not turn bare directory paths (paths without a file extension, such as `test/apps/my_app` or `test/workflows/my_workflow`) into Markdown links. Only report files ending in `.html`, `.json`, or `.md` should be linked in final summaries.

Do not add a separate `Backing workflow suite reports` list when each workflow subsection already includes its own report link. Keep the consolidated report and app suite report at the app level; keep each workflow suite report inside that workflow's subsection.

Do not drop an `Optimization:` section because tests passed or because optimization was mentioned earlier. If the final-summary command includes a `To run it, reply:` prompt, preserve the action but make it workflow-specific when presenting a multi-workflow app summary. Replace ambiguous text such as `this workflow` with the workflow name from that subsection, for example `Run the model optimization sweep for Delta Team Calibration Intelligence`. If multiple backing workflows have optimization available, show separate next actions per workflow. If the user later asks only to run `the optimization sweep` and multiple workflows are eligible, ask which workflow unless the prior user prompt clearly named one. If the user asks to run it for all backing workflows, run sweeps one workflow at a time.

The final response is incomplete if it omits app test counts, consolidated or app suite report links, or any backing workflow's suite report, `Metrics:`, or `Optimization:` from `Validation and Insights`. `appSuite.summaryText` is app-suite evidence only; it is not the authoritative final app-flow validation summary.

If the app suite passed, do not add unrelated caveats about git status, pre-existing untracked files, or sync-plan churn unless the CLI summary or report says user action is required. Report those only when they block the test run or require a follow-up decision.

If app tests run in hybrid mode and produce pending judge requests, create and attach the app judge results before the final user response unless a real blocker prevents judging. After attachment, use the refreshed app suite and consolidated report statuses. Do not quote the pre-attachment `needs-judge` status as the final result.

## Widget Expectations

Generation and sync derive widget expectations in this order:

1. nonempty panel or agent `displayWidgetList` or init display widget override
2. terminal workflow node `aiAppOutputSpecification.dataDisplay.layouts`
3. no widget contract

At run time, validation uses the stored `widgetAssertions.allowedPatternIds` in the test JSON. It does not recompute expectations from the app or workflow during the run.

If both panel widget list and workflow terminal layouts are absent, the app test can still run but widget validation falls back to structural checks only.

## Tags

App test tags follow workflow test tag behavior.

- Creation: `do-generate-app-test --tags smoke,regression`
- Update add: `do-update-app-test --add-tags regression`
- Update remove: `do-update-app-test --remove-tags smoke`
- Update replace: `do-update-app-test --tags release-upgrade`

Tags are user-owned metadata. Preserve existing tags unless the user explicitly asks to change them.

## Command Reference

Use these commands for app tests:

- `get-app-test-context --file <app-file>`
- `get-app-test-sync-plan --file <app-file>`
- `list-app-tests --app-code <APP_CODE>`
- `do-generate-app-test --file <app-file> --panel-segment <segment> --data-capture-policy record-later`
- `do-update-app-test --file <app-file> --test-file <test-file>`
- `do-record-app-test-data --test-file <test-file>`
- `do-apply-app-test-data --test-file <test-file> --test-data @<file> --cleanup-scratch true`
- `run-app-test --test-file <test-file>`
- `run-app-tests --app-code <APP_CODE>`
- `do-attach-app-test-judge-results --report-root-dir <app-report-root> --cleanup-scratch true`

Do not run bare `run-app-tests` for a focused app request unless the user explicitly asks for all app tests in the workspace.
