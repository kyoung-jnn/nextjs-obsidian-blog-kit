import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const updateScript = new URL('../scripts/blog-update.mjs', import.meta.url).pathname;

function git(cwd: string, ...args: string[]) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

function write(root: string, path: string, contents: string) {
  const fullPath = join(root, path);
  mkdirSync(join(fullPath, '..'), { recursive: true });
  writeFileSync(fullPath, contents);
}

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'blog-kit-update-'));
  const upstream = join(root, 'upstream');
  const blog = join(root, 'blog');
  mkdirSync(upstream);
  mkdirSync(blog);
  git(upstream, 'init', '-b', 'main');
  git(blog, 'init', '-b', 'main');
  for (const cwd of [upstream, blog]) {
    git(cwd, 'config', 'user.name', 'Update Test');
    git(cwd, 'config', 'user.email', 'update-test@example.com');
  }
  return { root, upstream, blog };
}

function commit(cwd: string, message: string) {
  git(cwd, 'add', '.');
  git(cwd, 'commit', '-m', message);
}

function update(blog: string, upstream: string) {
  return spawnSync(process.execPath, [updateScript, '--source', upstream, '--no-install'], {
    cwd: blog,
    encoding: 'utf8',
  });
}

test('syncs kit code to the latest stable tag while preserving blog data', () => {
  const { root, upstream, blog } = fixture();
  try {
    write(upstream, 'package.json', '{"version":"1.0.0"}\n');
    write(upstream, 'src/app/page.tsx', 'old kit page\n');
    write(upstream, 'src/removed.ts', 'old kit code\n');
    write(upstream, 'src/config/blog.config.ts', 'upstream config\n');
    write(upstream, 'posts/Hello Blog.md', 'upstream post\n');
    commit(upstream, 'first release');
    git(upstream, 'tag', 'v1.0.0');

    write(upstream, 'package.json', '{"version":"1.1.0"}\n');
    write(upstream, 'src/app/page.tsx', 'new kit page\n');
    write(upstream, 'src/new.ts', 'new kit code\n');
    rmSync(join(upstream, 'src/removed.ts'));
    write(upstream, 'src/config/blog.config.ts', 'new upstream config\n');
    write(upstream, 'posts/Hello Blog.md', 'new upstream post\n');
    commit(upstream, 'second release');
    git(upstream, 'tag', 'v1.1.0');
    write(upstream, 'package.json', '{"version":"1.2.0-beta.1"}\n');
    commit(upstream, 'prerelease');
    git(upstream, 'tag', 'v1.2.0-beta.1');

    write(blog, 'package.json', '{"version":"1.0.0"}\n');
    write(blog, 'src/app/page.tsx', 'customized kit code\n');
    write(blog, 'src/removed.ts', 'old kit code\n');
    write(blog, 'src/config/blog.config.ts', 'personal config\n');
    write(blog, 'posts/Hello Blog.md', 'personal post\n');
    write(blog, 'public/images/cover.jpg', 'personal image\n');
    write(blog, '.obsidian/app.json', 'personal vault\n');
    write(blog, 'dashboard.md', 'personal dashboard\n');
    write(blog, 'src/custom.ts', 'personal extra code\n');
    commit(blog, 'personal blog');

    const result = update(blog, upstream);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readFileSync(join(blog, 'src/app/page.tsx'), 'utf8'), 'new kit page\n');
    assert.equal(readFileSync(join(blog, 'src/new.ts'), 'utf8'), 'new kit code\n');
    assert.equal(git(blog, 'ls-files', '--deleted'), 'src/custom.ts\nsrc/removed.ts');
    assert.equal(readFileSync(join(blog, 'package.json'), 'utf8'), '{"version":"1.1.0"}\n');
    assert.equal(
      readFileSync(join(blog, 'src/config/blog.config.ts'), 'utf8'),
      'personal config\n',
    );
    assert.equal(readFileSync(join(blog, 'posts/Hello Blog.md'), 'utf8'), 'personal post\n');
    assert.equal(readFileSync(join(blog, 'public/images/cover.jpg'), 'utf8'), 'personal image\n');
    assert.equal(readFileSync(join(blog, '.obsidian/app.json'), 'utf8'), 'personal vault\n');
    assert.equal(readFileSync(join(blog, 'dashboard.md'), 'utf8'), 'personal dashboard\n');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('first update of an unversioned blog syncs all kit code', () => {
  const { root, upstream, blog } = fixture();
  try {
    write(upstream, 'package.json', '{"version":"1.0.0"}\n');
    write(upstream, 'src/old.ts', 'old code\n');
    commit(upstream, 'first release');
    git(upstream, 'tag', 'v1.0.0');
    write(upstream, 'package.json', '{"version":"1.1.0"}\n');
    write(upstream, 'src/new.ts', 'new code\n');
    rmSync(join(upstream, 'src/old.ts'));
    commit(upstream, 'second release');
    git(upstream, 'tag', 'v1.1.0');

    write(blog, 'package.json', '{"name":"personal-blog"}\n');
    write(blog, 'src/new.ts', 'old customized code\n');
    write(blog, 'src/old.ts', 'old code\n');
    write(blog, 'src/legacy-extra.ts', 'obsolete local code\n');
    write(blog, 'eslint.config.mjs', 'obsolete tool config\n');
    write(blog, 'posts/my-post.md', 'my post\n');
    commit(blog, 'blog before versioning');

    const result = update(blog, upstream);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readFileSync(join(blog, 'src/new.ts'), 'utf8'), 'new code\n');
    assert.equal(
      git(blog, 'ls-files', '--deleted'),
      'eslint.config.mjs\nsrc/legacy-extra.ts\nsrc/old.ts',
    );
    assert.equal(readFileSync(join(blog, 'posts/my-post.md'), 'utf8'), 'my post\n');
    assert.equal(readFileSync(join(blog, 'package.json'), 'utf8'), '{"version":"1.1.0"}\n');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('refuses to update a blog with uncommitted changes', () => {
  const { root, upstream, blog } = fixture();
  try {
    write(upstream, 'package.json', '{"version":"1.1.0"}\n');
    commit(upstream, 'release');
    git(upstream, 'tag', 'v1.1.0');
    write(blog, 'package.json', '{"version":"1.0.0"}\n');
    commit(blog, 'blog');
    write(blog, 'posts/draft.md', 'unsaved draft\n');

    const result = update(blog, upstream);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /uncommitted changes/i);
    assert.equal(readFileSync(join(blog, 'package.json'), 'utf8'), '{"version":"1.0.0"}\n');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('refuses to overwrite a dangling symlink in a managed path', () => {
  const { root, upstream, blog } = fixture();
  try {
    write(upstream, 'package.json', '{"version":"1.0.0"}\n');
    write(upstream, 'src/app/page.tsx', 'old page\n');
    commit(upstream, 'first release');
    git(upstream, 'tag', 'v1.0.0');
    write(upstream, 'package.json', '{"version":"1.1.0"}\n');
    write(upstream, 'src/app/page.tsx', 'new page\n');
    commit(upstream, 'second release');
    git(upstream, 'tag', 'v1.1.0');

    write(blog, 'package.json', '{"version":"1.0.0"}\n');
    mkdirSync(join(blog, 'src/app'), { recursive: true });
    const outside = join(root, 'outside.tsx');
    symlinkSync(outside, join(blog, 'src/app/page.tsx'));
    commit(blog, 'blog with dangling link');

    const result = update(blog, upstream);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /non-file|non-directory/i);
    assert.equal(existsSync(outside), false);
    assert.equal(readFileSync(join(blog, 'package.json'), 'utf8'), '{"version":"1.0.0"}\n');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
