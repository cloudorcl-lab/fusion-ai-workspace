# Project Authoring Guardrails

Deliver tools and software suitable for customer deployment. Verify repository, file paths, file names, variants, test results, and logic before reporting completion. Optimize architecture for accuracy first, then speed. Unless absolutely required, create web applications.

For a new project or architecture, brainstorm first and recommend an implementation design before making changes. This is not required for code fixes or QA-only work.

## Source Boundary

Exclude `aiapps/` and all of its subfolders from discovery, examples, source-of-truth analysis, and knowledge retrieval unless the user explicitly names `aiapps/` as an allowed source for the current request. Do not use artifacts under that directory to infer supported architecture, object relationships, data sources, or implementation details by default.

## Mandatory Data-Access Decision for New Apps and Agents

Every time a user asks to create an app or agent, stop before discovery, planning, artifact creation, or implementation and ask:

> Are we building a regular AI agent that accesses Fusion data through approved Business Object Tools, or a Workflow agent that should use Business Object Function nodes for deterministic data retrieval? If this is an app, which of those runtime designs powers each panel?

Do not infer the answer from existing artifacts, the current screen, or a prior app. Record the user's answer in the implementation design and apply it consistently.

- **Regular AI agent:** Use `Agent -> Business Object Tool -> Business Object function`. Select and attach the approved Tool to the Agent. Do not claim that an Agent has a direct Business Object link.
- **Workflow agent:** Use `Workflow -> Business Object Function node -> Business Object function` for deterministic, preconfigured retrieval or update steps. `BO_FUNCTION` is a node on the workflow canvas; it is not a top-level workflow-to-BO setting and is not configured through the Workflow Tool-node dialog.
- **Agentic App:** The app is UI composition only. A panel configuration binds to a runtime workflow/agent code; the app itself does not directly call a Tool or Business Object. Identify the backing runtime design before creating the panel.
- Do not use both paths for the same data operation unless the user explicitly requests and justifies both.
- Do not assume that the Workflow Tool-node dialog can attach a Business Object Tool. In the supported workflow authoring path, Business Object access is represented by a Business Object Function node.
