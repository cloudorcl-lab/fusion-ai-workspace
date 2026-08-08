import { createHash } from 'node:crypto';
import { appendFile, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const XDX_SCHEMA_VERSION = 1;

export function resolveLearningPaths(rootDir) {
  const learningRoot = join(rootDir, '.xdx-learning');
  return {
    learningRoot,
    policy: join(learningRoot, 'policy', 'policy.json'),
    catalog: join(learningRoot, 'catalog', 'knowledge-catalog.json'),
    testingFrameworkIndex: join(learningRoot, 'catalog', 'sources', 'workflow-testing-framework.index.json'),
    manifest: join(learningRoot, 'manifests', 'seed-sources.json'),
    candidates: join(learningRoot, 'ledger', 'candidates.jsonl'),
    receiptsDirectory: join(learningRoot, 'receipts'),
    gitignore: join(learningRoot, '.gitignore'),
  };
}

function headingAnchor(heading) {
  return `#${heading
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')}`;
}

async function buildHeadingIndex(rootDir, sourcePath) {
  try {
    const content = await readFile(join(rootDir, sourcePath), 'utf8');
    const sections = content.split(/\r?\n/)
      .map((line) => /^(#{1,6})\s+(.+?)\s*$/.exec(line))
      .filter(Boolean)
      .map((match) => ({
        heading: match[2],
        level: match[1].length,
        anchor: headingAnchor(match[2]),
      }));
    return {
      schemaVersion: XDX_SCHEMA_VERSION,
      sourceId: 'workflow-testing-framework',
      sourcePath,
      sourceHash: createHash('sha256').update(content).digest('hex'),
      sections,
    };
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return {
        schemaVersion: XDX_SCHEMA_VERSION,
        sourceId: 'workflow-testing-framework',
        sourcePath,
        sourceHash: null,
        sections: [],
      };
    }
    throw error;
  }
}

async function fileHash(filePath) {
  try {
    return createHash('sha256').update(await readFile(filePath)).digest('hex');
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

async function readJsonIfPresent(filePath) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

async function writeIfMissing(filePath, content) {
  try {
    await stat(filePath);
    return false;
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
    await writeFile(filePath, content, 'utf8');
    return true;
  }
}

export async function initializeWorkspace(rootDir) {
  const paths = resolveLearningPaths(rootDir);
  await Promise.all([
    mkdir(join(paths.learningRoot, 'policy'), { recursive: true }),
    mkdir(join(paths.learningRoot, 'catalog'), { recursive: true }),
    mkdir(join(paths.learningRoot, 'catalog', 'sources'), { recursive: true }),
    mkdir(join(paths.learningRoot, 'manifests'), { recursive: true }),
    mkdir(join(paths.learningRoot, 'ledger'), { recursive: true }),
    mkdir(paths.receiptsDirectory, { recursive: true }),
  ]);

  const testingFrameworkPath = 'documents/fusion-ai-studio-workflow-testing-framework.md';
  const snapshotIndexPath = 'server-snapshots/aistudio-workflows/workflow-index.json';
  const sourceHash = await fileHash(join(rootDir, testingFrameworkPath));
  const testingFrameworkIndex = await buildHeadingIndex(rootDir, testingFrameworkPath);
  const snapshotIndex = await readJsonIfPresent(join(rootDir, snapshotIndexPath));
  const created = [];
  const initialFiles = [
    [paths.policy, JSON.stringify({
      schemaVersion: XDX_SCHEMA_VERSION,
      excludedRoots: ['aiapps/'],
      trackedState: [
        'policy/policy.json',
        'catalog/knowledge-catalog.json',
        'catalog/sources/workflow-testing-framework.index.json',
        'manifests/seed-sources.json',
        'ledger/candidates.jsonl',
        'receipts/',
      ],
      rawContentPolicy: 'ignored',
    }, null, 2) + '\n'],
    [paths.catalog, JSON.stringify({
      schemaVersion: XDX_SCHEMA_VERSION,
      cards: [{
        id: 'workflow-testing-framework',
        title: 'Fusion AI Studio Workflow Testing Framework',
        sourcePath: testingFrameworkPath,
        sourceHash,
        sectionIndexPath: '.xdx-learning/catalog/sources/workflow-testing-framework.index.json',
        authority: 'workspace-approved',
        phases: ['test', 'debug', 'handoff'],
        artifactTypes: ['workflow', 'workflow-backed-app'],
        triggers: ['test', 'debug', 'validate', 'atlas', 'file-mode', 'live-mode', 'test report'],
        summary: 'Repeatable workflow testing that distinguishes file-mode checks from live validation and retains test evidence.',
        constraints: ['Use interactive authentication.', 'Do not treat file-mode results as live validation.'],
        readNext: ['Required Inputs', 'Step 1: Confirm CLI and Authentication', 'Step 3: Generate an ATLAS Workflow Test', 'Failure Triage', 'Reporting Template'],
      }],
    }, null, 2) + '\n'],
    [paths.testingFrameworkIndex, JSON.stringify(testingFrameworkIndex, null, 2) + '\n'],
    [paths.manifest, JSON.stringify({
      schemaVersion: XDX_SCHEMA_VERSION,
      sources: [{
        id: 'workflow-testing-framework',
        sourcePath: testingFrameworkPath,
        sha256: sourceHash,
        available: sourceHash !== null,
      }, {
        id: 'workflow-snapshot-index',
        sourcePath: snapshotIndexPath,
        sha256: await fileHash(join(rootDir, snapshotIndexPath)),
        expectedCount: snapshotIndex?.expectedCount ?? null,
        downloadedCount: snapshotIndex?.downloadedCount ?? null,
        failedCount: snapshotIndex?.failedCount ?? null,
      }],
    }, null, 2) + '\n'],
    [paths.candidates, ''],
    [join(paths.receiptsDirectory, '.gitkeep'), ''],
    [paths.gitignore, ['baseline/', 'brief.json', 'brief.md', 'sessions/', 'tracker/', 'users/', 'tmp/', '*.log', 'cache/'].join('\n') + '\n'],
  ];

  for (const [filePath, content] of initialFiles) {
    if (await writeIfMissing(filePath, content)) created.push(filePath);
  }

  await writeFile(paths.testingFrameworkIndex, JSON.stringify(testingFrameworkIndex, null, 2) + '\n', 'utf8');
  const catalog = await readJsonIfPresent(paths.catalog);
  const frameworkCard = catalog?.cards?.find((card) => card.id === 'workflow-testing-framework');
  if (frameworkCard !== undefined) {
    const sectionIndexPath = '.xdx-learning/catalog/sources/workflow-testing-framework.index.json';
    if (frameworkCard.sourceHash !== sourceHash || frameworkCard.sectionIndexPath !== sectionIndexPath) {
      frameworkCard.sourceHash = sourceHash;
      frameworkCard.sectionIndexPath = sectionIndexPath;
      await writeFile(paths.catalog, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
    }
  }
  return { created };
}

const CANDIDATE_FIELDS = ['id', 'objectRef', 'claim', 'evidenceRef', 'method', 'source'];
const SENSITIVE_PATTERNS = [
  /\bbearer\s+\S+/i,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /\b(?:password|client_secret)\s*[:=]\s*\S+/i,
  /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/,
];

function validateCandidateInput(input) {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Candidate input must be an object.');
  }
  for (const field of CANDIDATE_FIELDS) {
    if (typeof input[field] !== 'string' || input[field].trim() === '') {
      throw new Error(`Candidate field ${field} is required.`);
    }
  }
  const serialized = CANDIDATE_FIELDS.map((field) => input[field]).join('\n');
  if (SENSITIVE_PATTERNS.some((pattern) => pattern.test(serialized))) {
    throw new Error('Candidate contains sensitive content and cannot be persisted.');
  }
}

export async function captureCandidate(rootDir, input) {
  validateCandidateInput(input);
  const paths = resolveLearningPaths(rootDir);
  const record = {
    schemaVersion: XDX_SCHEMA_VERSION,
    status: 'observed',
    id: input.id.trim(),
    objectRef: input.objectRef.trim(),
    claim: input.claim.trim(),
    evidenceRef: input.evidenceRef.trim(),
    method: input.method.trim(),
    source: input.source.trim(),
    capturedAt: new Date().toISOString(),
  };
  if (input.supersedes !== undefined) {
    if (typeof input.supersedes !== 'string' || input.supersedes.trim() === '') {
      throw new Error('Candidate field supersedes must be a non-empty string when provided.');
    }
    record.supersedes = input.supersedes.trim();
  }
  await appendFile(paths.candidates, `${JSON.stringify(record)}\n`, 'utf8');
  return record;
}

function tokenize(value) {
  return new Set(String(value).toLowerCase().match(/[a-z0-9]+/g) ?? []);
}

function scoreQuery(queryTokens, weightedFields) {
  let score = 0;
  for (const [value, weight] of weightedFields) {
    const tokens = tokenize(Array.isArray(value) ? value.join(' ') : value);
    for (const token of queryTokens) {
      if (tokens.has(token)) score += weight;
    }
  }
  return score;
}

async function readCandidateRecords(candidatePath) {
  try {
    const content = await readFile(candidatePath, 'utf8');
    return content.split('\n').filter(Boolean).map((line) => JSON.parse(line));
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
}

export async function findKnowledge(rootDir, query) {
  if (typeof query !== 'string' || query.trim() === '') {
    throw new Error('A non-empty knowledge query is required.');
  }
  const paths = resolveLearningPaths(rootDir);
  const catalog = await readJsonIfPresent(paths.catalog);
  if (catalog === null) throw new Error('Learning state is not initialized. Run xdx-learn init first.');
  const queryTokens = tokenize(query);
  const cards = catalog.cards.map((card) => ({
    kind: 'routing-card',
    score: scoreQuery(queryTokens, [
      [card.title, 5],
      [card.phases, 4],
      [card.artifactTypes, 3],
      [card.triggers, 4],
      [card.summary, 1],
      [card.constraints, 1],
    ]),
    title: card.title,
    sourcePath: card.sourcePath,
    readNext: card.readNext,
    status: card.authority,
    summary: card.summary,
  }));
  const candidateRecords = await readCandidateRecords(paths.candidates);
  const supersededIds = new Set(candidateRecords.map((record) => record.supersedes).filter(Boolean));
  const candidates = candidateRecords
    .filter((record) => !supersededIds.has(record.id))
    .map((record) => ({
    kind: 'candidate-evidence',
    score: scoreQuery(queryTokens, [
      [record.id, 4],
      [record.objectRef, 2],
      [record.claim, 3],
      [record.evidenceRef, 1],
      [record.method, 1],
    ]),
    title: record.id,
    sourcePath: record.objectRef,
    readNext: [],
    status: record.status,
      summary: record.claim,
    }));
  return [...cards, ...candidates]
    .filter((match) => match.score > 0)
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title));
}
