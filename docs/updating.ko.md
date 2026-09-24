# 템플릿으로 만든 블로그 업데이트

블로그 저장소 루트에서 다음 명령어를 실행하세요.

```bash
pnpm blog:update
```

최신 정식 킷 태그의 파일을 적용하고 `pnpm install --frozen-lockfile`을 실행합니다. 변경사항은 자동 커밋하거나 푸시하지 않습니다. `git status`와 `git diff`로 확인하고 `pnpm build`를 실행한 뒤 커밋하세요.

업데이트 전에는 Git 작업 트리가 깨끗해야 합니다. `posts/`, `public/images/`, `.obsidian/`, `dashboard.md`, `src/config/blog.config.ts`, README, GitHub 워크플로는 보존합니다. 킷 코드와 빌드 설정, 패키지 파일은 최신 태그와 동일하게 맞추므로 해당 영역의 개인 수정 파일은 교체되거나 삭제됩니다.

## 예전 블로그의 첫 업데이트

`blog:update` 명령어가 없는 블로그에서는 저장소 루트에서 다음 명령어를 한 번 실행하세요.

```bash
curl -fsSL https://raw.githubusercontent.com/kyoung-jnn/nextjs-obsidian-blog-kit/main/scripts/blog-update.mjs -o /tmp/blog-kit-update.mjs && node /tmp/blog-kit-update.mjs
```

Windows PowerShell에서는 다음을 실행하세요.

```powershell
Invoke-WebRequest https://raw.githubusercontent.com/kyoung-jnn/nextjs-obsidian-blog-kit/main/scripts/blog-update.mjs -OutFile "$env:TEMP\blog-kit-update.mjs"
node "$env:TEMP\blog-kit-update.mjs"
```

첫 업데이트를 커밋한 다음부터는 `pnpm blog:update`를 사용하면 됩니다.
