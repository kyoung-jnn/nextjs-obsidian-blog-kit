#!/bin/bash
# ─── Obsidian Blog Vault Initializer ─────────────────────────────────
# Sets up the project root as an Obsidian vault with blog content
# structure, templates, and a sample post.
# Optimized for Make.md plugin (Notion-like experience).
#
# Usage:
#   bash scripts/content.sh
#   Called by: pnpm blog:setup

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/common.sh"

POSTS_DIR="posts"
TODAY=$(date +%Y-%m-%d)
QUIET=${QUIET:-false}
LOCALE=${LOCALE:-en}

# Suppress output in quiet mode (called from setup.sh)
if [ "$QUIET" = true ]; then
    success() { :; }
fi

if [ "$QUIET" != true ]; then
    banner "Obsidian Blog Vault Setup"

    if [ ! -f "package.json" ]; then
        fail "package.json not found! Are you in the project root?"
        exit 1
    fi

    if [ -d ".obsidian" ]; then
        echo -e "  ${YELLOW}Project root${NC} already has an Obsidian vault."
        if ! confirm "Re-initialize? (existing posts will be preserved)"; then
            echo ""
            echo "  Aborted."
            exit 0
        fi
        echo ""
    fi

    echo -e "${BOLD}Creating Obsidian blog vault...${NC}"
    echo ""
fi

# ─── 1. Directory Structure ──────────────────────────────────────────

mkdir -p "$POSTS_DIR"
mkdir -p "$POSTS_DIR/templates"
mkdir -p "public/images"
mkdir -p ".obsidian/plugins/dataview"
mkdir -p ".obsidian/plugins/obsidian-git"
mkdir -p ".obsidian/plugins/make-md"
mkdir -p ".obsidian/plugins/templater-obsidian"

success "Directory structure created"

# ─── 2. Obsidian App Settings ────────────────────────────────────────

cat > ".obsidian/app.json" << 'OBSIDIAN_EOF'
{
  "attachmentFolderPath": "public/images",
  "newFileLocation": "folder",
  "newFileFolderPath": "posts",
  "useMarkdownLinks": true,
  "showLineCount": true,
  "strictLineBreaks": true,
  "propertiesInDocument": "visible",
  "livePreview": true
}
OBSIDIAN_EOF

success "Obsidian app settings"

# ─── 3. Core Plugins ─────────────────────────────────────────────────
# Disable file-explorer — Make.md Navigator replaces it

cat > ".obsidian/core-plugins.json" << 'OBSIDIAN_EOF'
{
  "file-explorer": false,
  "global-search": true,
  "switcher": false,
  "graph": false,
  "backlink": false,
  "outgoing-link": false,
  "tag-pane": true,
  "page-preview": false,
  "daily-notes": false,
  "templates": true,
  "note-composer": false,
  "command-palette": true,
  "slash-command": false,
  "editor-status": true,
  "markdown-importer": false,
  "zk-prefixer": false,
  "random-note": false,
  "outline": true,
  "word-count": true,
  "slides": false,
  "audio-recorder": false,
  "workspaces": false,
  "file-recovery": false,
  "publish": false,
  "sync": false,
  "canvas": false,
  "footnotes": false,
  "properties": true,
  "bookmarks": true,
  "bases": false,
  "webviewer": false
}
OBSIDIAN_EOF

success "Core plugins configured (file-explorer disabled → Make.md Navigator)"

# ─── 4. Community Plugins ────────────────────────────────────────────

cat > ".obsidian/community-plugins.json" << 'OBSIDIAN_EOF'
[
  "dataview",
  "obsidian-git",
  "make-md",
  "templater-obsidian"
]
OBSIDIAN_EOF

success "Community plugins registered"

# ─── 5. Templates Plugin Settings ────────────────────────────────────

cat > ".obsidian/templates.json" << 'OBSIDIAN_EOF'
{
  "folder": "posts/templates",
  "dateFormat": "YYYY-MM-DD",
  "timeFormat": "HH:mm"
}
OBSIDIAN_EOF

success "Templates plugin configured"

# ─── 6. Appearance ───────────────────────────────────────────────────

cat > ".obsidian/appearance.json" << 'OBSIDIAN_EOF'
{
  "accentColor": "#808080",
  "baseFontSize": 16,
  "translucency": true
}
OBSIDIAN_EOF

success "Appearance settings"

# ─── 7. Obsidian Git Plugin ──────────────────────────────────────────

cat > ".obsidian/plugins/obsidian-git/data.json" << 'OBSIDIAN_EOF'
{
  "autoSaveInterval": 0,
  "autoPushInterval": 0,
  "autoPullInterval": 0,
  "commitMessage": "📝 publish: {{numFiles}} file(s) — {{date}}",
  "autoCommitMessage": "✏️ draft: {{numFiles}} file(s) — {{date}}",
  "listChangedFilesInMessageBody": true,
  "pushOnBackup": true,
  "pullBeforePush": true,
  "disablePush": false,
  "syncMethod": "merge",
  "showStatusBar": true,
  "updateSubmodules": false,
  "changedFilesInStatusBar": true,
  "showedMobileNotice": true,
  "autoBackupAfterFileChange": false,
  "basePath": "",
  "differentIntervalCommitAndPush": false,
  "autoPullOnBoot": true
}
OBSIDIAN_EOF

success "Obsidian Git plugin settings"

# ─── 8. Dataview Plugin ──────────────────────────────────────────────

cat > ".obsidian/plugins/dataview/data.json" << 'OBSIDIAN_EOF'
{
  "renderNullAs": "-",
  "taskCompletionTracking": false,
  "warnOnEmptyResult": true,
  "refreshEnabled": true,
  "refreshInterval": 2500,
  "defaultDateFormat": "YYYY-MM-DD",
  "defaultDateTimeFormat": "YYYY-MM-DD HH:mm",
  "maxRecursiveRenderDepth": 4,
  "showResultCount": true,
  "enableDataviewJs": false,
  "enableInlineDataview": true,
  "enableInlineDataviewJs": false,
  "prettyRenderInlineFields": true,
  "prettyRenderInlineFieldsInLivePreview": true
}
OBSIDIAN_EOF

success "Dataview plugin settings"

# ─── 9. Make.md Plugin ───────────────────────────────────────────────
# Notion-like experience: Navigator, Flow editor, folder notes, banners

cat > ".obsidian/plugins/make-md/data.json" << 'MAKEMD_EOF'
{
  "newNotePlaceholder": "Untitled",
  "defaultInitialization": false,
  "navigatorEnabled": true,
  "filePreviewOnHover": false,
  "blinkEnabled": true,
  "datePickerTime": false,
  "imageThumbnails": false,
  "noteThumbnails": false,
  "spacesMDBInHidden": true,
  "cacheIndex": true,
  "spacesRightSplit": false,
  "contextEnabled": true,
  "spaceViewEnabled": true,
  "saveAllContextToFrontmatter": false,
  "autoOpenFileContext": false,
  "activeView": "posts",
  "hideFrontmatter": false,
  "activeSpace": "",
  "defaultDateFormat": "YYYY-MM-DD",
  "defaultTimeFormat": "HH:mm",
  "spacesEnabled": true,
  "syncFormulaToFrontmatter": true,
  "spacesPerformance": false,
  "currentWaypoint": 0,
  "enableFolderNote": false,
  "folderIndentationLines": true,
  "revealActiveFile": false,
  "spacesStickers": true,
  "spaceRowHeight": 29,
  "mobileSpaceRowHeight": 40,
  "bannerHeight": 200,
  "spacesDisablePatch": false,
  "folderNoteInsideFolder": true,
  "folderNoteName": "",
  "sidebarTabs": true,
  "showRibbon": true,
  "vaultSelector": true,
  "deleteFileOption": "system-trash",
  "expandedSpaces": [
    "/",
    "posts"
  ],
  "expandFolderOnClick": true,
  "spacesFolder": ".spaces",
  "suppressedWarnings": [],
  "spaceSubFolder": ".space",
  "hiddenFiles": [
    "node_modules",
    ".next",
    "src",
    ".git",
    "scripts",
    "public",
    ".env",
    ".env.example",
    ".gitignore",
    ".claude",
    ".husky",
    ".obsidian",
    ".obsidianignore",
    ".makemd",
    ".space",
    ".spaces",
    ".vscode",
    ".nvmrc",
    "Tags",
    "biome.json",
    "next-env.d.ts",

    "next.config.mjs",
    "postcss.config.mjs",
    "package.json",
    "pnpm-lock.yaml",
    "tsconfig.json",
    "LICENSE",
    "README.md",
    "README.ko.md",
    "posts/templates",
    "tsconfig.tsbuildinfo"
  ],
  "hiddenExtensions": [
    ".mdb",
    "_assets",
    "_blocks",
    ".base",
    ".gitkeep"
  ],
  "newFileLocation": "folder",
  "newFileFolderPath": "posts",
  "inlineBacklinks": false,
  "inlineContext": true,
  "inlineBacklinksExpanded": false,
  "inlineContextExpanded": true,
  "inlineContextProperties": false,
  "inlineContextSectionsExpanded": true,
  "banners": true,
  "inlineContextNameLayout": "vertical",
  "spacesUseAlias": false,
  "fmKeyAlias": "aliases",
  "fmKeyBanner": "banner",
  "fmKeyColor": "color",
  "fmKeyBannerOffset": "banner_y",
  "fmKeySticker": "sticker",
  "openSpacesOnLaunch": true,
  "indexSVG": false,
  "readableLineWidth": true,
  "autoAddContextsToSubtags": true,
  "releaseNotesPrompt": 0,
  "enableDefaultSpaces": true,
  "showSpacePinIcon": true,
  "experimental": false,
  "systemName": "Blog",
  "defaultSpaceTemplate": "",
  "selectedKit": "default",
  "actionMaxSteps": 100,
  "contextPagination": 25,
  "skipFolders": [
    "node_modules",
    ".next",
    "src",
    ".git",
    "scripts",
    ".claude",
    ".husky",
    ".vscode"
  ],
  "skipFolderNames": [],
  "enhancedLogs": false,
  "basics": true,
  "basicsSettings": {
    "flowMenuEnabled": true,
    "markSans": false,
    "makeMenuPlaceholder": true,
    "mobileMakeBar": false,
    "mobileSidepanel": false,
    "inlineStyler": true,
    "inlineStylerColors": true,
    "inlineStylerSelectedPalette": "",
    "editorFlow": true,
    "internalLinkClickFlow": true,
    "internalLinkSticker": true,
    "editorFlowStyle": "minimal",
    "menuTriggerChar": "/",
    "inlineStickerMenu": true,
    "emojiTriggerChar": ":",
    "flowState": false
  },
  "firstLaunch": false,
  "notesPreview": false,
  "editStickerInSidebar": true,
  "overrideNativeMenu": false,
  "onboardingCompleted": true,
  "contextCreateUseModal": false,
  "homepagePath": "dashboard.md",
  "mobileMakeHeader": false
}
MAKEMD_EOF

success "Make.md plugin (Notion-like: Navigator, Flow, folder notes)"

# ─── 10. Templater Plugin ────────────────────────────────────────────
# Auto-apply blog-post template when creating new notes in posts/

cat > ".obsidian/plugins/templater-obsidian/manifest.json" << 'TEMPLATER_EOF'
{
  "id": "templater-obsidian",
  "name": "Templater",
  "version": "2.18.1",
  "minAppVersion": "1.5.0",
  "description": "Create and use templates",
  "author": "SilentVoid",
  "authorUrl": "https://github.com/SilentVoid13",
  "helpUrl": "https://silentvoid13.github.io/Templater/",
  "isDesktopOnly": false
}
TEMPLATER_EOF

cat > ".obsidian/plugins/templater-obsidian/data.json" << 'TEMPLATER_EOF'
{
  "command_timeout": 5,
  "templates_folder": "posts/templates",
  "templates_pairs": [],
  "trigger_on_file_creation": true,
  "auto_jump_to_cursor": true,
  "enable_system_commands": false,
  "shell_path": "",
  "user_scripts_folder": "",
  "enable_folder_templates": true,
  "folder_templates": [
    {
      "folder": "posts",
      "template": "posts/templates/blog-post.md"
    }
  ],
  "syntax_highlighting": true,
  "syntax_triggering": true,
  "enabled_templates_hotkey_file_creation": [],
  "context_menu": true
}
TEMPLATER_EOF

success "Templater plugin (auto-apply template in posts/)"

# ─── 11. Blog Post Template (Templater syntax) ──────────────────────────────────────────

cat > "$POSTS_DIR/templates/blog-post.md" << 'TEMPLATE_EOF'
---
date: <% tp.date.now("YYYY-MM-DD") %>
slug:  # optional — auto-generated from filename
published: false
thumbnail:
---

TEMPLATE_EOF

success "Blog post template"

# ─── 12. Sample Post ─────────────────────────────────────────────────

if [ ! -f "$POSTS_DIR/Hello Blog.md" ]; then
    if [ "$LOCALE" = "ko" ]; then
        cat > "$POSTS_DIR/Hello Blog.md" << SAMPLE_EOF
---
date: $TODAY
published: false
---

Obsidian 블로그 키트에 오신 것을 환영합니다!

## 글 작성 방법

1. \`Ctrl/Cmd+N\`으로 새 노트 생성 (템플릿 자동 적용)
2. frontmatter의 \`published\` 토글 켜기
3. \`Ctrl+P\` → **Obsidian Git: Push** (또는 터미널에서 \`git push\`)
4. Vercel이 자동으로 빌드 & 배포

## Frontmatter

| 필드        | 타입    | 필수 | 설명                              |
| ----------- | ------- | ---- | --------------------------------- |
| \`date\`      | string  | Yes  | 발행일 (YYYY-MM-DD)              |
| \`published\` | boolean | Yes  | 발행 토글                         |
| \`slug\`      | string  | No   | URL 경로 (비어있으면 파일명 사용) |
| \`thumbnail\` | string  | No   | 썸네일 이미지 경로                |

> [!tip] 자동 처리
> - \`title\`은 파일명에서 자동 사용
> - \`description\` meta tag는 본문 첫 160자에서 자동 추출
> - \`slug\` 비우면 파일명에서 자동 생성
> - 이미지 붙여넣기 시 \`public/images/\`에 자동 저장

## 이미지 예시

![Sample landscape](../public/images/sample.jpg)

## 지원되는 마크다운

**굵게**, *기울임*, ~~취소선~~, \`인라인 코드\`

> 인용문도 지원됩니다.

\`\`\`typescript
function greet(name: string): string {
  return "Hello, " + name + "!"
}
\`\`\`

| 기능              | 지원 |
| ----------------- | ---- |
| 제목 (h1-h6)      | O    |
| 코드 블록 (Shiki) | O    |
| 테이블 (GFM)      | O    |
| 이미지            | O    |
| 수식 (KaTeX)      | O    |

### 수식

인라인 수식: \$E = mc^2\$

블록 수식:

\$\$
\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n
\$\$

---

이 샘플 포스트를 수정하거나 삭제하고, 자신만의 글을 작성해보세요!
SAMPLE_EOF
    else
        cat > "$POSTS_DIR/Hello Blog.md" << SAMPLE_EOF
---
date: $TODAY
published: false
---

Welcome to the Obsidian Blog Kit!

## How to Write

1. Create a new note (\`Ctrl/Cmd+N\`) — template is auto-applied
2. Toggle \`published\` on in frontmatter
3. \`Ctrl+P\` → **Obsidian Git: Push** (or \`git push\` from terminal)
4. Vercel auto-builds & deploys

## Frontmatter

| Field       | Type    | Required | Description                             |
| ----------- | ------- | -------- | --------------------------------------- |
| \`date\`      | string  | Yes      | Publication date (YYYY-MM-DD)           |
| \`published\` | boolean | Yes      | Publish toggle                          |
| \`slug\`      | string  | No       | URL path (auto-generated from filename) |
| \`thumbnail\` | string  | No       | Thumbnail image path                    |

> [!tip] Auto-handled
> - \`title\` is auto-derived from the filename
> - \`description\` meta tag is auto-extracted from the first 160 characters
> - \`slug\` is auto-generated from filename if empty
> - Pasted images are auto-saved to \`public/images/\`

## Image Example

![Sample landscape](../public/images/sample.jpg)

## Supported Markdown

**Bold**, *italic*, ~~strikethrough~~, \`inline code\`

> Blockquotes are supported too.

\`\`\`typescript
function greet(name: string): string {
  return "Hello, " + name + "!"
}
\`\`\`

| Feature            | Supported |
| ------------------ | --------- |
| Headings (h1-h6)   | Yes       |
| Code blocks (Shiki) | Yes      |
| Tables (GFM)       | Yes       |
| Images             | Yes       |
| Math (KaTeX)       | Yes       |

### Math

Inline math: \$E = mc^2\$

Block math:

\$\$
\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n
\$\$

---

Edit or delete this sample post, and start writing your own!
SAMPLE_EOF
    fi
    success "Sample post (posts/Hello Blog.md)"
else
    success "Sample post already exists (skipped)"
fi

# ─── 13. Dashboard (project root) ────────────────────────────────────
# Dashboard — opens on Obsidian launch via homepagePath

cat > "dashboard.md" << 'DASHBOARD_EOF'
---
sticker: emoji//1f4cb
---

> [!note]- Write & Deploy
> ### Write
> 1. \`Ctrl/Cmd+N\` to create a new post (template auto-applied)
> 2. Toggle \`published\` checkbox when ready
>
> ### Deploy
> - **From Obsidian** — \`Ctrl+P\` → \`Obsidian Git: Commit\` → \`Obsidian Git: Push\`
> - **From terminal** — \`git add . && git commit -m "publish" && git push\`
> - Vercel rebuilds automatically on every push to \`main\`

```dataview
TABLE WITHOUT ID
  file.link AS "title",
  dateformat(date, "yyyy-MM-dd") AS "date",
  choice(published, "🟢", "🟡") AS "status"
FROM "posts" AND -"posts/templates"
SORT date DESC
```
DASHBOARD_EOF

success "Dashboard (dashboard.md)"

# ─── 14. public/images/.gitkeep ──────────────────────────────────────

touch public/images/.gitkeep
success "public/images/ directory"

# ─── Summary ──────────────────────────────────────────────────────────

if [ "$QUIET" != true ]; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  ✓ Obsidian Blog Vault Created!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "  ${BLUE}pnpm dev${NC}             Start dev server"
    echo -e "  ${BLUE}Open in Obsidian${NC}     This folder → Make.md Navigator"
    echo -e "  ${BLUE}dashboard.md${NC}         Click to open Dashboard"
    echo ""
fi
