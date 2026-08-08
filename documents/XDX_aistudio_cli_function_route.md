# XDX AI Studio CLI Function Route

This guide classifies the bundled AI Studio CLI by the order in which a solution is normally designed, created, tested, operated, and maintained. Run commands from the project root as `node .agents/skills/aistudio/scripts/aistudio.js <command>`.

## 1. Establish access and workspace

| Goal | Functions |
| --- | --- |
| Authenticate interactively | `authenticate`, `whoami`, `logout` |
| Non-interactive OAuth | `login-with-key` |
| Basic/dev-mode authentication | `configure-basic-auth` |
| Start a blank workspace | `init`, `init-app-package` |
| Inspect CLI capabilities | `version`, `--help` |

Use `authenticate` then `whoami` before remote discovery, recording, running, saving, or fetching. Do not place credentials in source files.

## 2. Discover and query existing capabilities

Start here when reusing an existing object is preferred over creating a duplicate.

| Discover | Functions |
| --- | --- |
| Fetch source artifacts | `do-fetch-workflow`, `do-fetch-app`, `do-fetch-agent`, `do-fetch-tool`, `do-fetch-bo`, `do-fetch-deeplink`, `do-fetch-topic`, `do-fetch-function`, `do-fetch-approval-process`, `do-fetch-policy`, `do-fetch-policy-template` |
| Search reusable AI Studio assets | `search-workflows`, `search-agents`, `search-business-objects`, `search-deeplink-tools`, `search-external-rest-tools`, `search-document-tools` |
| Query tool and BO catalogs | `list-tool-families`, `list-tool-products`, `list-supported-business-objects`, `get-business-object-functions`, `get-bo-function-output-specification`, `get-bo-function-example-guidance` |
| Query workflow and model catalog | `list-workflow-families`, `list-workflow-products`, `list-workflow-model-configurations`, `get-workflow-model-configuration`, `get-workflow-model-override-targets` |
| Query connector and approval catalog | `search-connector-definitions`, `get-connector-definition-form`, `list-connector-user-groups`, `list-approval-processes`, `search-approval-users`, `list-approval-email-accounts` |

## 3. Design the runtime shape

Use the matching skill before mutation: `aistudio` for artifacts, `aistudio-apps-*` for domain app patterns.

| Runtime decision | Design rule | Relevant functions |
| --- | --- | --- |
| Agent data access | Agent -> BO Tool -> BO function | `do-create-agent`, `do-add-agent-tool`, `do-create-tool`, `get-business-object-functions` |
| Workflow data access | Workflow -> BO Function node -> BO function | `do-create-bo-function-from-operation`, `do-add-bo-function`, workflow node functions |
| App composition | App panel -> backing agent/workflow; app does not call BO directly | `do-create-app`, `do-add-agent`, `get-configured-workflow-agents`, `get-panel-metadata` |
| Deterministic workflow route | Model triggers, nodes, conditions, return paths, and testable branches | `do-create-workflow`, `do-create-node`, `do-modify-node`, `do-modify-node-edges`, `get-workflow-node-structure` |

## 4. Create artifacts

| Artifact | Create and extend functions |
| --- | --- |
| Workflow | `do-create-workflow`, `do-create-node`, `do-modify-node`, `do-modify-node-edges`, `do-delete-node`, `do-prettify-workflow` |
| App | `do-create-app`, `do-modify-page-pattern`, `do-modify-app-config`, `do-add-agent`, `do-add-communication`, `do-add-template`, `do-add-action` |
| Agent | `do-create-agent`, `do-update-agent`, `do-add-agent-tool`, `do-add-agent-topic` |
| Tool | `do-create-tool`, `do-create-business-object-tool`, `do-create-deeplink-tool`, `do-create-document-tool`, `do-create-external-rest-tool`, `do-create-mcp-tool`, `do-create-connector-tool` |
| Business Object | `do-create-bo`, `do-update-bo`, `do-add-bo-function`, `do-add-bo-function-parameter`, `do-add-bo-function-header`, `do-add-bo-function-example` |
| Supporting artifacts | `do-create-deeplink`, `do-create-topic`, `do-create-function`, `do-create-approval-process`, `do-create-policy`, `do-create-policy-template`, `do-create-document-schema`, `do-create-connector-instance` |

For each artifact family, use its paired `do-update-*`, `do-modify-*`, `do-remove-*`, or `do-delete-*` functions for targeted maintenance. Prefix developer-controlled new objects with `XDX_`.

## 5. Build, inspect, and validate locally

| Purpose | Functions |
| --- | --- |
| Validate artifact structure | `validate-workflow`, `validate-app`, `validate-agent`, `validate-tool`, `validate-bo`, `validate-deeplink`, `validate-topic`, `validate-function`, `validate-policy`, `validate-policy-template`, `validate-document-schema`, `validate-approval-process` |
| Inspect app contracts | `get-configured-workflow-agents`, `get-panel-metadata`, `get-communication`, `get-template`, `get-action` |
| Inspect workflow contracts | `get-workflow-node-structure`, `get-nodes-metadata-by-code` |
| Generate BO implementation detail | `do-generate-bo-function-description`, `do-generate-bo-function-example-description`, `do-fetch-bo-function-example-sample`, `do-apply-bo-function-example-payload` |
| Build reusable functions | `do-create-function-definition`, `do-generate-function-implementation`, `do-generate-function-test-cases`, `run-function`, `run-function-test-cases` |

## 6. Test and evaluate

### Workflow tests

1. Plan: `get-workflow-test-context`, `get-workflow-test-scenarios`, `get-workflow-test-sync-plan`.
2. Materialize: `do-generate-workflow-test`, `do-update-workflow-test`.
3. Prepare data: `do-record-workflow-test` or `do-apply-workflow-test-data`.
4. Execute: `run-workflow-test`, `run-workflow-tests`.
5. Judge: `get-workflow-test-judge-context`, `attach-workflow-test-judge-result`, `attach-workflow-test-judge-results`.
6. Report: `get-workflow-test-final-summary`.

### App tests

1. Plan: `get-app-test-context`, `get-app-test-sync-plan`.
2. Synchronize: `do-sync-app-tests`, or use `do-generate-app-test` / `do-update-app-test` for one test.
3. Prepare data: `do-record-app-test-data` or `do-apply-app-test-data`.
4. Execute: `run-app-test`, `run-app-tests`.
5. Judge: `do-attach-app-test-judge-results`.
6. Report: `get-app-test-final-summary`.

### Test-data and model quality

- Protect recorded data: `get-test-data-masking-context`, `do-create-test-data-masking-profile`, `do-mask-test-data`.
- Compare models: `propose-sweep-candidates`, `run-optimization-sweep`, `compare-workflow-test-runs`.
- Understand cost and quality: `analyze-token-usage`, `generate-optimization-report`.

## 7. Run and debug

| Run mode | Functions |
| --- | --- |
| Workflow debug execution | `run-workflow`, `run-workflow-chat` |
| Debug evidence | `get-nodes-executed-on-last-debug`, `get-debugger-results-for-nodes`, `list-pinned-outputs` |
| Controlled debugging | `get-debugger-node-override-schema`, `do-modify-node-overrides`, `do-clear-node-override`, `do-node-override-output`, `do-clear-node-output-override` |

Use debug overrides only for diagnosis. Keep durable behavior in the source artifact and its tests.

## 8. Save, deploy, and publish

| Target | Draft/save functions | Publish functions |
| --- | --- | --- |
| Workflow | `do-save-workflow` | CLI publication is intentionally not supported |
| App | `do-save-app` | Use approved UI process if publication is required |
| Agent, Tool, BO, Deeplink, Topic | `do-save-agent`, `do-save-tool`, `do-save-bo`, `do-save-deeplink`, `do-save-topic` | Follow approved environment process |
| Policy, Function, Document Schema | `do-save-policy`, `do-save-function`, `do-save-document-schema` | `do-publish-policy`, `do-publish-function`, `do-publish-document-schema` |
| Connector Definition | `do-save-connector-definition` | `do-publish-connector-definition`, `do-unpublish-connector-definition` |
| Connector Instance | `do-save-connector-instance` | Environment-managed |

Save only after local validation and relevant tests. Fetch server state only when explicitly needed; do not overwrite a differing local artifact without deliberate `--force` approval.

## 9. Maintenance route

1. Fetch or query the current server artifact.
2. Validate the local artifact before editing.
3. Make the smallest applicable `do-update-*` or `do-modify-*` change.
4. Validate again.
5. Run the artifact's workflow/app/function tests.
6. Save the draft only when authorized.
7. Record report links and unresolved environment constraints.

## Quick route selector

| Need | Start with |
| --- | --- |
| Reuse existing data access | Discovery commands, then `get-business-object-functions` |
| Build a deterministic backend route | Workflow creation and BO Function node route |
| Build an interactive panel | App creation, then backing workflow/agent selection |
| Fix a behavior regression | Artifact validation -> sync plan -> focused test -> report |
| Analyze cost or models | Passing workflow suite -> token analysis or optimization sweep |
| Refresh from server | `do-fetch-*` command for the exact artifact type |
