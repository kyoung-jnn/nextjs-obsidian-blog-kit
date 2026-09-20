# Releases

`package.json` is the single source of truth for this template's release version.

When a commit reaches `main`, GitHub Actions validates the project. If the
corresponding `vX.Y.Z` tag does not exist, it creates an annotated tag and a
GitHub Release with automatically generated release notes.

## Releasing an update

1. Update the `version` field in `package.json` in the same change as the
   template update.
2. Merge the pull request or push the commit to `main`.
3. After CI succeeds, verify the generated `vX.Y.Z` tag and GitHub Release.

Use Semantic Versioning:

- `patch` for compatible fixes.
- `minor` for compatible features.
- `major` for changes that require template users to alter their configuration
  or project structure.

Do not manually create the corresponding tag before the workflow runs. The
workflow is idempotent: later pushes with an existing tag do not create another
tag or Release.
