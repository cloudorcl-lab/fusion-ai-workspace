#!/usr/bin/env node
import process from 'node:process';

import { captureCandidate, findKnowledge, initializeWorkspace } from './xdx-learning/core.mjs';

function parseArguments(argv) {
  const [command, ...rest] = argv;
  const options = { command, root: process.cwd(), json: false, positional: [] };
  for (let index = 0; index < rest.length; index += 1) {
    const value = rest[index];
    if (value === '--root') {
      options.root = rest[++index];
    } else if (value === '--json') {
      options.json = true;
    } else if (value.startsWith('--')) {
      const key = value.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      options[key] = rest[++index];
    } else {
      options.positional.push(value);
    }
  }
  return options;
}

function usage() {
  return [
    'Usage:',
    '  node scripts/xdx-learn.mjs init [--root <workspace>]',
    '  node scripts/xdx-learn.mjs find [--root <workspace>] [--json] <query>',
    '  node scripts/xdx-learn.mjs capture [--root <workspace>] --id <id> --object-ref <path> --claim <claim> --evidence-ref <reference> --method <method> --source <source>',
  ].join('\n');
}

function printMatches(matches, json) {
  if (json) {
    process.stdout.write(`${JSON.stringify(matches, null, 2)}\n`);
    return;
  }
  for (const match of matches) {
    process.stdout.write(`${match.kind}: ${match.title} [${match.status}]\n`);
    process.stdout.write(`  Source: ${match.sourcePath}\n`);
    process.stdout.write(`  Summary: ${match.summary}\n`);
    if (match.readNext.length > 0) process.stdout.write(`  Read next: ${match.readNext.join('; ')}\n`);
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.command === 'init') {
    const result = await initializeWorkspace(options.root);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }
  if (options.command === 'find') {
    const query = options.positional.join(' ');
    printMatches(await findKnowledge(options.root, query), options.json);
    return;
  }
  if (options.command === 'capture') {
    const record = await captureCandidate(options.root, {
      id: options.id,
      objectRef: options.objectRef,
      claim: options.claim,
      evidenceRef: options.evidenceRef,
      method: options.method,
      source: options.source,
    });
    process.stdout.write(`${JSON.stringify(record, null, 2)}\n`);
    return;
  }
  throw new Error(usage());
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
