#!/usr/bin/env node

import { execFileSync, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { chmodSync, lstatSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';

const DEFAULT_SOURCE = 'https://github.com/kyoung-jnn/nextjs-obsidian-blog-kit.git';
const VERSION_PATTERN = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const root = process.cwd();
const maxBuffer = 32 * 1024 * 1024;

function git(...args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer });
}

function gitBytes(...args) {
  return execFileSync('git', args, { cwd: root, maxBuffer });
}

function parseArgs(args) {
  let source = DEFAULT_SOURCE;
  let install = true;
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--source' && args[index + 1]) {
      source = args[index + 1];
      index += 1;
    } else if (args[index] === '--no-install') {
      install = false;
    } else {
      throw new Error(`Unknown option: ${args[index]}`);
    }
  }
  return { source, install };
}

function compareVersions(left, right) {
  const leftParts = left.slice(1).split('.').map(Number);
  const rightParts = right.slice(1).split('.').map(Number);
  for (let index = 0; index < 3; index += 1) {
    if (leftParts[index] !== rightParts[index]) return leftParts[index] - rightParts[index];
  }
  return 0;
}

function stableTags(source) {
  const lines = git('ls-remote', '--tags', '--refs', source).trim().split('\n');
  return lines
    .map((line) => line.split('\t')[1]?.replace('refs/tags/', ''))
    .filter((tag) => tag && VERSION_PATTERN.test(tag))
    .sort(compareVersions);
}

function isManaged(path) {
  if (path === 'src/config/blog.config.ts') return false;
  if (
    path.startsWith('src/') ||
    path.startsWith('scripts/') ||
    path.startsWith('test/') ||
    path.startsWith('public/svg/') ||
    path.startsWith('.husky/')
  ) {
    return true;
  }
  return (
    path === 'package.json' ||
    path === 'pnpm-lock.yaml' ||
    path === 'tsconfig.json' ||
    path === 'biome.json' ||
    path === '.nvmrc' ||
    path === '.env.example' ||
    path === '.gitignore' ||
    /^[^/]+\.config\.(?:js|mjs|ts|json)$/.test(path)
  );
}

function entriesAt(ref) {
  const entries = new Map();
  const output = gitBytes('ls-tree', '-r', '-z', ref);
  for (const record of output.toString('utf8').split('\0')) {
    if (!record) continue;
    const tab = record.indexOf('\t');
    const [mode, type] = record.slice(0, tab).split(' ');
    const path = record.slice(tab + 1);
    if (isManaged(path)) entries.set(path, { mode, type });
  }
  return entries;
}

function checkedDestination(path) {
  if (isAbsolute(path) || path.split('/').includes('..') || path.split('/').includes('.')) {
    throw new Error(`Unsafe path in kit release: ${path}`);
  }
  const destination = resolve(root, path);
  if (!relative(root, destination) || relative(root, destination).startsWith(`..${sep}`)) {
    throw new Error(`Unsafe path in kit release: ${path}`);
  }
  for (let directory = dirname(destination); directory !== root; directory = dirname(directory)) {
    const entry = lstatSync(directory, { throwIfNoEntry: false });
    if (entry && !entry.isDirectory()) {
      throw new Error(`Cannot update through non-directory: ${directory}`);
    }
  }
  const entry = lstatSync(destination, { throwIfNoEntry: false });
  if (entry && !entry.isFile()) {
    throw new Error(`Cannot replace non-file: ${destination}`);
  }
  return destination;
}

function applyUpdate(newRef) {
  const newEntries = entriesAt(newRef);
  const localFiles = git('ls-files', '-z')
    .split('\0')
    .filter((path) => path && isManaged(path));
  const paths = [...new Set([...localFiles, ...newEntries.keys()])];
  const operations = paths.map((path) => {
    const destination = checkedDestination(path);
    const entry = newEntries.get(path);
    if (!entry) return { path, destination, remove: true };
    if (entry.type !== 'blob' || !['100644', '100755'].includes(entry.mode)) {
      throw new Error(`Unsupported file type in kit release: ${path}`);
    }
    const content = gitBytes('show', `${newRef}:${path}`);
    return { path, destination, content, mode: entry.mode };
  });

  for (const operation of operations) {
    if (operation.remove) {
      if (lstatSync(operation.destination, { throwIfNoEntry: false }))
        unlinkSync(operation.destination);
    } else {
      mkdirSync(dirname(operation.destination), { recursive: true });
      writeFileSync(operation.destination, operation.content);
      chmodSync(operation.destination, operation.mode === '100755' ? 0o755 : 0o644);
    }
  }
  return operations.length;
}

function main() {
  const { source, install } = parseArgs(process.argv.slice(2));
  if (git('rev-parse', '--show-toplevel').trim() !== root) {
    throw new Error('Run this command from the blog repository root.');
  }
  if (git('status', '--porcelain', '--untracked-files=all').trim()) {
    throw new Error('Commit or stash uncommitted changes before updating.');
  }

  const currentVersion = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;
  if (currentVersion && !VERSION_PATTERN.test(`v${currentVersion}`)) {
    throw new Error(`Invalid current package version: ${currentVersion}`);
  }

  const tags = stableTags(source);
  if (tags.length === 0) throw new Error('No stable kit release tags were found.');
  const latest = tags.at(-1);
  const current = currentVersion && `v${currentVersion}`;
  if (current && compareVersions(current, latest) >= 0) {
    console.log(`Already up to date (${currentVersion}).`);
    return;
  }
  const refPrefix = `refs/blog-kit-update/${randomUUID()}`;
  const newRef = `${refPrefix}/new`;
  try {
    git('fetch', '--quiet', '--no-tags', source, `refs/tags/${latest}:${newRef}`);
    const releaseVersion = JSON.parse(git('show', `${newRef}:package.json`)).version;
    if (`v${releaseVersion}` !== latest) {
      throw new Error(`Kit release ${latest} has a mismatched package version.`);
    }
    const count = applyUpdate(newRef);
    console.log(`Updated kit ${current || 'unversioned'} → ${latest} (${count} files).`);
  } finally {
    try {
      git('update-ref', '-d', newRef);
    } catch {
      // A failed fetch may not have created this temporary ref.
    }
  }

  if (install) {
    const result = spawnSync('pnpm', ['install', '--frozen-lockfile'], {
      cwd: root,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    if (result.error || result.status !== 0) {
      throw new Error(
        'Kit files were updated, but pnpm install failed. Run it again after fixing the error.',
      );
    }
  }
  console.log('Review the changes with git status and git diff, then run pnpm build.');
}

try {
  main();
} catch (error) {
  console.error(`Update failed: ${error.message}`);
  process.exitCode = 1;
}
