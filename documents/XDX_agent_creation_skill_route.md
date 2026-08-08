# XDX Agent Creation Skill Route

Use this guide to select the right skills while designing and delivering a customer-ready agent. It is a route, not a requirement to invoke every skill: choose the smallest set that covers the task.

## 1. Start with the outcome, boundaries, and runtime

| Need | Skills | Use them for |
| --- | --- | --- |
| New capability or architecture | `superpowers:brainstorming`, `aegis:brainstorming` | Clarify users, jobs, inputs, output, constraints, and alternatives before implementation. |
| Shared terminology or ambiguous domain concepts | `aegis:establishing-project-context` | Define durable language for objects, stages, roles, and data. |
| Multi-step delivery | `superpowers:writing-plans`, `aegis:writing-plans` | Turn agreed scope into ordered, testable work. |
| Long-running work | `aegis:long-task-continuation` | Preserve evidence, checkpoints, and handoff state. |
| Workspace agent configuration | `workspace-agents:workspace-agents-build-agent` | Build or edit a Codex Workspace Agent rather than an Oracle AI Studio artifact. |

Before creating an Oracle AI Studio agent or app, decide one runtime path for each data operation:

1. **Regular AI agent:** `Agent -> Business Object Tool -> Business Object function`.
2. **Workflow agent:** `Workflow -> Business Object Function node -> Business Object function`.
3. **Agentic App:** a UI panel bound to a backing workflow or agent; the app does not call a Tool or BO directly.

Do not mix the first two paths for the same operation unless the design explicitly justifies it.

## 2. Select the agent delivery surface

| Surface | Primary skill | Best use |
| --- | --- | --- |
| Oracle AI Studio regular agent | `aistudio` | Tool-using conversational agent with approved tools, topics, and instructions. |
| Oracle AI Studio workflow agent | `aistudio` | Deterministic multi-step agent behavior, BO Function nodes, branching, and testable routes. |
| Oracle AI Studio Agentic App | `aistudio` | Web application panel composition over a backing agent/workflow. |
| Domain solution accelerator | `aistudio-apps-succession-management`, `aistudio-apps-warehouse-operations-shortages` | Domain-specific discovery, scope, validation, and extension patterns. |
| Codex Workspace Agent | `workspace-agents:workspace-agents-build-agent` | Custom workspace agent instructions, identity, and tools. |
| API-triggered workspace agent | `workspace-agents:workspace-agents-api-triggers` | API-trigger design and integration planning. |

## 3. Design safe, useful data access

| Data or integration need | Skills | Design guidance |
| --- | --- | --- |
| Fusion Business Objects | `aistudio`, `db`, `fusion` | Reuse approved functions; define narrow input and output contracts; default to read-only. |
| Oracle database and SQL | `db` | Use for SQL, PL/SQL, ORDS, performance, migrations, and database-safe guidance. |
| External REST, MCP, or connector | `aistudio`, `tool-advisor` | Create a least-privilege tool contract and test error behavior. |
| Browser state or logged-in application | `chrome:control-chrome`, `browser:control-in-app-browser` | Use visible authenticated browser state; do not capture bearer tokens. |
| Files, PDFs, Office documents, or sheets | `documents:documents`, `pdf:pdf`, `spreadsheets:Spreadsheets` | Extract, validate, and generate artifacts with rendering or workbook verification. |
| Connected business context | `data-analytics:gather-business-context`, `data-analytics:create-data-context` | Establish a governed semantic basis before analytical agents act on metrics. |

## 4. Build the agent in layers

| Layer | What to define | Helpful skills |
| --- | --- | --- |
| Contract | User intent, inputs, outputs, safety boundaries, failure behavior | `aistudio`, `aegis:brainstorming` |
| Reasoning route | Deterministic branch conditions, tool calls, handoffs, return schemas | `aistudio`, `aegis:first-principles-review` |
| UI | App panels, widgets, action boundaries, backing runtime codes | `aistudio`, `sites:sites-building` for standalone web experiences |
| Quality | Test scenarios, fixtures, assertions, semantic rubrics, observability | `aistudio`, `superpowers:test-driven-development`, `aegis:test-driven-development` |
| Knowledge | Grounded sources, document contracts, retrieval scope | `aistudio`, `documents:documents`, `data-analytics:create-data-context` |

For new developer-controlled AI Studio objects, use the `XDX_` prefix consistently.

## 5. Test before relying on an agent

| Test objective | Skills | Evidence to retain |
| --- | --- | --- |
| Workflow path correctness | `aistudio` | Workflow test sync plan, file data, deterministic path assertions, suite report. |
| App panel contract | `aistudio` | InitDisplay fixture, widget assertions, app suite report, backing workflow status. |
| Feature or bug fix | `superpowers:systematic-debugging`, `superpowers:test-driven-development` | Reproduction, root cause, failing test, minimal fix, passing regression. |
| Final verification | `superpowers:verification-before-completion`, `aegis:verification-before-completion` | Fresh command output, counts, report links, warnings, and remaining limitations. |
| Data quality | `data-analytics:analyze-data-quality`, `data-analytics:validate-data` | Freshness, completeness, assumptions, confidence, and decision suitability. |
| Security review | `vulnerability-discovery` | Scoped, authorized findings with reachability and remediation evidence. |

## 6. Optimize after correctness

| Question | Skills | Example output |
| --- | --- | --- |
| Which model belongs on which workflow node? | `aistudio` | Passing tests -> model candidates -> optimization sweep -> recommendations. |
| Why did a metric change? | `data-analytics:metric-diagnostics` | Driver analysis with evidence and uncertainty. |
| Which KPIs define success? | `data-analytics:design-kpis`, `data-analytics:kpi-reporting` | Definitions, targets, guardrails, scorecard. |
| Does the business case justify the agent? | `data-analytics:market-sizing`, `data-analytics:product-business-analysis` | Assumption-led opportunity and ROI analysis. |

Do not optimize model cost, latency, or prompts before a behaviorally correct baseline is tested.

## 7. Package, publish, and operate deliberately

| Delivery need | Skills | Guardrail |
| --- | --- | --- |
| Final code review | `code-review`, `superpowers:requesting-code-review`, `aegis:requesting-code-review` | Use independent review for meaningful changes. |
| Integrate a completed branch | `superpowers:finishing-a-development-branch`, `aegis:finishing-a-development-branch` | Verify tests, inspect remote state, then merge or push deliberately. |
| Git isolation | `superpowers:using-git-worktrees`, `aegis:using-git-worktrees` | Isolate concurrent feature work and preserve dirty user changes. |
| Documentation | `documentation-writer` | Produce task-focused tutorials, how-to guides, explanations, and references. |
| Reports and dashboards | `data-analytics:build-report`, `data-analytics:build-dashboard`, `data-analytics:visualize-data` | Make decisions traceable with validated data. |
| Standalone web hosting | `sites:sites-building`, `sites:sites-hosting` | Build and host web apps only when a site is the intended delivery surface. |

Remote saves, publication, repository pushes, and external messages require explicit authorization.

## 8. Practical agent authoring route

1. Frame the user job and the safety boundary.
2. Choose regular-agent, workflow-agent, or app-backed runtime for each data operation.
3. Discover approved tools, BO functions, workflows, and agents before creating replacements.
4. Write an implementation design: inputs, output schema, error paths, data minimization, and observability.
5. Create the smallest viable artifact set.
6. Validate each local artifact.
7. Create and run workflow tests; then synchronize and run app tests when panels exist.
8. Attach local semantic judgments and use final summaries as the test evidence source.
9. Optimize only from passing test evidence.
10. Review, document, and save/publish only with explicit approval.

## Skill selection anti-patterns

- Do not use a browser or REST tool to bypass an approved BO/Tool contract.
- Do not attach a Business Object directly to an agent; use a Business Object Tool.
- Do not attach a Business Object Tool through a workflow Tool node; use a Business Object Function node.
- Do not treat an Agentic App as the data-access layer.
- Do not claim test success from validation alone; run the relevant suite and inspect its final summary.
- Do not use broad data analytics or visualization skills when a small deterministic operational lookup is sufficient.
- Do not deploy or push because a local artifact looks complete; require explicit authority and fresh verification.

## 9. AI Studio CLI route within the agent lifecycle

Run the bundled CLI from the project root:

```text
node .agents/skills/aistudio/scripts/aistudio.js <command>
```

| Lifecycle stage | Primary CLI functions | Exit condition |
| --- | --- | --- |
| Access | `authenticate`, `whoami`, `login-with-key`, `logout` | Correct user and approved authentication path are confirmed. |
| Discover | `do-fetch-*`, `search-workflows`, `search-agents`, `search-business-objects`, `list-tool-families`, `get-business-object-functions` | Reusable server objects and supported functions are identified. |
| Design | `list-workflow-model-configurations`, `get-workflow-model-override-targets`, `get-bo-function-output-specification`, `get-panel-metadata` | Runtime path, output contract, and panel contract are explicit. |
| Create | `do-create-workflow`, `do-create-app`, `do-create-agent`, `do-create-tool`, `do-create-bo`, `do-create-*` supporting artifacts | Minimal local artifact set exists with `XDX_` names. |
| Assemble | `do-create-node`, `do-modify-node`, `do-modify-node-edges`, `do-add-agent-tool`, `do-add-agent`, `do-add-communication`, `do-add-template`, `do-add-action` | Nodes, tools, agents, and panels are bound to the selected runtime. |
| Validate | `validate-workflow`, `validate-app`, `validate-agent`, `validate-tool`, `validate-bo`, plus matching `validate-*` commands | Local structural validation has no errors. |
| Test workflow | `get-workflow-test-sync-plan`, `do-generate-workflow-test`, `do-record-workflow-test`, `run-workflow-tests`, `attach-workflow-test-judge-results`, `get-workflow-test-final-summary` | Deterministic assertions and semantic judgments are complete. |
| Test app | `get-app-test-sync-plan`, `do-sync-app-tests`, `do-record-app-test-data`, `run-app-tests`, `do-attach-app-test-judge-results`, `get-app-test-final-summary` | Panel/widget contract and backing workflow evidence pass. |
| Debug | `run-workflow`, `run-workflow-chat`, `get-nodes-executed-on-last-debug`, `get-debugger-results-for-nodes`, `do-modify-node-overrides` | Root cause is evidenced; temporary overrides are not relied on as durable behavior. |
| Optimize | `analyze-token-usage`, `propose-sweep-candidates`, `run-optimization-sweep`, `generate-optimization-report` | Recommendations are based on passing test evidence. |
| Save/deploy | `do-save-workflow`, `do-save-app`, `do-save-agent`, `do-save-tool`, `do-save-bo`, and supported `do-publish-*` functions | Local evidence is complete and remote action is explicitly authorized. |

### Artifact command map

| Artifact | Create and build | Inspect or validate | Save or fetch |
| --- | --- | --- | --- |
| Workflow | `do-create-workflow`, `do-create-node`, `do-modify-node`, `do-prettify-workflow` | `get-workflow-node-structure`, `validate-workflow` | `do-save-workflow`, `do-fetch-workflow` |
| App | `do-create-app`, `do-modify-page-pattern`, `do-add-agent` | `get-configured-workflow-agents`, `get-panel-metadata`, `validate-app` | `do-save-app`, `do-fetch-app` |
| Agent | `do-create-agent`, `do-update-agent`, `do-add-agent-tool`, `do-add-agent-topic` | `validate-agent` | `do-save-agent`, `do-fetch-agent` |
| Tool | `do-create-tool`, `do-update-tool` | `validate-tool`, catalog list functions | `do-save-tool`, `do-fetch-tool` |
| Business Object | `do-create-bo`, `do-add-bo-function`, parameter/header/example functions | `get-business-object-functions`, `validate-bo` | `do-save-bo`, `do-fetch-bo` |
| Policy, Function, Schema | `do-create-policy`, `do-create-function`, `do-create-document-schema` | matching `validate-*`, function test functions | matching `do-save-*`, supported `do-publish-*`, `do-fetch-*` |
| Connector and approval | `do-generate-connector-definition`, `do-create-connector-instance`, `do-create-approval-process` | connector/approval list and validation functions | matching save, fetch, and supported publish functions |

### Read-only query families

- Server artifacts: `do-fetch-workflow`, `do-fetch-app`, `do-fetch-agent`, `do-fetch-tool`, `do-fetch-bo`, `do-fetch-deeplink`, `do-fetch-topic`, `do-fetch-function`, `do-fetch-policy`.
- Discovery recommendations: `search-workflows`, `search-agents`, `search-business-objects`, `search-deeplink-tools`, `search-external-rest-tools`, `search-document-tools`.
- Catalogs: `list-tool-families`, `list-tool-products`, `list-supported-business-objects`, `list-workflow-families`, `list-workflow-products`, `list-policy-workflow-contexts`, `list-approval-processes`.
- Test and debug evidence: `get-*-test-context`, `get-*-test-sync-plan`, `get-*-test-final-summary`, `get-debugger-results-for-nodes`, `list-pinned-outputs`.

Always use the matching command help before an unfamiliar mutation: `node .agents/skills/aistudio/scripts/aistudio.js <command> --help`.
