# Updating a blog made from this template

From the root of your blog repository, run:

```bash
pnpm blog:update
```

The command finds the latest stable `vX.Y.Z` tag of Next.js Obsidian Blog Kit,
applies the kit changes, and runs `pnpm install --frozen-lockfile`. It leaves
the changes in your working tree for review; it does not commit or push them.
Run `git status`, `git diff`, and `pnpm build`, then commit the update in your
blog repository.

The update requires a clean Git working tree. Commit or stash local changes
before running it. It preserves `posts/`, `public/images/`, `.obsidian/`,
`dashboard.md`, `src/config/blog.config.ts`, your README, and your own GitHub
workflows. Kit code, build configuration, and package files are made identical
to the release. Extra files in these managed areas are removed, and local
changes to them are replaced.

## First update from an older template

Blogs created before `blog:update` was added do not have the command yet. In
those repositories, run this once from the repository root:

```bash
curl -fsSL https://raw.githubusercontent.com/kyoung-jnn/nextjs-obsidian-blog-kit/main/scripts/blog-update.mjs -o /tmp/blog-kit-update.mjs && node /tmp/blog-kit-update.mjs
```

On Windows PowerShell:

```powershell
Invoke-WebRequest https://raw.githubusercontent.com/kyoung-jnn/nextjs-obsidian-blog-kit/main/scripts/blog-update.mjs -OutFile "$env:TEMP\blog-kit-update.mjs"
node "$env:TEMP\blog-kit-update.mjs"
```

On this first update, a blog without `package.json.version` receives the current
kit files. Personal content and settings listed above are preserved. After
committing the update, future updates use `pnpm blog:update`.
