#!/usr/bin/env bash

set -euo pipefail

version="$(node -p "require('./package.json').version")"

if [[ ! "$version" =~ ^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?(\+[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$ ]]; then
  echo "package.json version must be a valid SemVer version: $version" >&2
  exit 1
fi

tag="v$version"

if git rev-parse -q --verify "refs/tags/$tag" >/dev/null; then
  echo "Tag $tag already exists."
  exit 0
fi

if ! git config --local --get user.name >/dev/null; then
  git config user.name "github-actions[bot]"
fi

if ! git config --local --get user.email >/dev/null; then
  git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
fi

git tag -a "$tag" -m "Release $tag"
git push origin "$tag"
echo "$tag"
