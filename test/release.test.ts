import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

const repositoryRoot = new URL('..', import.meta.url).pathname
const releaseScript = join(repositoryRoot, 'scripts/release.sh')

function run(command: string, args: string[], cwd: string, env?: NodeJS.ProcessEnv) {
  return execFileSync(command, args, { cwd, encoding: 'utf8', env })
}

test('creates and pushes an annotated tag from package.json version', () => {
  const tempDirectory = mkdtempSync(join(tmpdir(), 'blog-kit-release-'))
  const remoteDirectory = join(tempDirectory, 'remote.git')
  const repositoryDirectory = join(tempDirectory, 'repository')

  try {
    run('git', ['init', '--bare', remoteDirectory], tempDirectory)
    run('git', ['init', '-b', 'main', repositoryDirectory], tempDirectory)
    run('git', ['config', 'user.name', 'Release Test'], repositoryDirectory)
    run('git', ['config', 'user.email', 'release-test@example.com'], repositoryDirectory)
    run('git', ['remote', 'add', 'origin', remoteDirectory], repositoryDirectory)
    writeFileSync(join(repositoryDirectory, 'package.json'), '{"version":"0.2.0"}\n')
    run('git', ['add', 'package.json'], repositoryDirectory)
    run('git', ['commit', '-m', 'feat: add release fixture'], repositoryDirectory)
    run('git', ['push', '-u', 'origin', 'main'], repositoryDirectory)

    run('bash', [releaseScript], repositoryDirectory)

    assert.equal(run('git', ['tag', '--points-at', 'HEAD'], repositoryDirectory).trim(), 'v0.2.0')
    assert.match(run('git', ['for-each-ref', 'refs/tags/v0.2.0', '--format=%(contents)'], repositoryDirectory), /Release v0\.2\.0/)
    assert.match(run('git', ['--git-dir', remoteDirectory, 'show-ref', '--tags'], tempDirectory), /refs\/tags\/v0\.2\.0/)
  } finally {
    rmSync(tempDirectory, { force: true, recursive: true })
  }
})

test('creates an annotated tag when the repository has no Git identity', () => {
  const tempDirectory = mkdtempSync(join(tmpdir(), 'blog-kit-release-'))
  const remoteDirectory = join(tempDirectory, 'remote.git')
  const repositoryDirectory = join(tempDirectory, 'repository')
  const {
    GIT_AUTHOR_EMAIL: _gitAuthorEmail,
    GIT_AUTHOR_NAME: _gitAuthorName,
    GIT_COMMITTER_EMAIL: _gitCommitterEmail,
    GIT_COMMITTER_NAME: _gitCommitterName,
    ...environmentWithoutGitIdentity
  } = process.env
  const isolatedGitEnvironment = {
    ...environmentWithoutGitIdentity,
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_GLOBAL: '/dev/null',
    HOME: join(tempDirectory, 'home'),
    XDG_CONFIG_HOME: join(tempDirectory, 'config'),
  }

  try {
    run('git', ['init', '--bare', remoteDirectory], tempDirectory)
    run('git', ['init', '-b', 'main', repositoryDirectory], tempDirectory)
    writeFileSync(join(repositoryDirectory, 'package.json'), '{"version":"0.2.1"}\n')
    run('git', ['add', 'package.json'], repositoryDirectory, isolatedGitEnvironment)
    run('git', ['-c', 'user.name=Release Test', '-c', 'user.email=release-test@example.com', 'commit', '-m', 'feat: add release fixture'], repositoryDirectory, isolatedGitEnvironment)
    run('git', ['remote', 'add', 'origin', remoteDirectory], repositoryDirectory, isolatedGitEnvironment)
    run('git', ['push', '-u', 'origin', 'main'], repositoryDirectory, isolatedGitEnvironment)

    run('bash', [releaseScript], repositoryDirectory, isolatedGitEnvironment)

    assert.equal(run('git', ['tag', '--points-at', 'HEAD'], repositoryDirectory, isolatedGitEnvironment).trim(), 'v0.2.1')
    assert.equal(run('git', ['for-each-ref', 'refs/tags/v0.2.1', '--format=%(taggername)'], repositoryDirectory, isolatedGitEnvironment).trim(), 'github-actions[bot]')
  } finally {
    rmSync(tempDirectory, { force: true, recursive: true })
  }
})
