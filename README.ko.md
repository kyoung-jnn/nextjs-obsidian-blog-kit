# Next.js Obsidian Blog Kit

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6)](https://www.typescriptlang.org/)

[English](README.md) | 한국어

<img width="1200" height="627" alt="nextjs obsidian blog kit" src="https://github.com/user-attachments/assets/97d27f51-35fd-4e8c-ac64-a3e627109ec7" />

> Obsidian에서 글쓰기. GitHub에 Push. 블로그 완성!

## 주요 기능

- **Obsidian CMS** — 로컬 마크다운으로 글 작성, Notion 스타일 대시보드로 관리
- **제로 설정** — `pnpm blog:setup` 하나로 모든 설정 자동 감지
- **퍼포먼스 최적화** — 정적 생성, 코드 스플리팅, Shiki 구문 강조
- **SEO 완전 지원** — Sitemap, RSS 피드, JSON-LD, Open Graph
- **라이트/다크 모드** — Radix Colors 기반 테마

## 시작하기

### 사전 준비

- [Node.js](https://nodejs.org/) v18 이상
- [pnpm](https://pnpm.io/) — `corepack enable`으로 활성화
- [Git](https://git-scm.com/)
- [Obsidian](https://obsidian.md/) (데스크톱 앱)
- [GitHub CLI](https://cli.github.com/) (선택 — Giscus 댓글 자동 설정)
- [Vercel](https://vercel.com/) 계정 (배포 시 필요)

### 1. 저장소 생성

이 페이지 상단의 **"Use this template"** 클릭 후:

```bash
git clone https://github.com/yourusername/your-blog.git
cd your-blog
pnpm blog:setup
```

끝. Git 설정(작성자, 이메일, GitHub URL, Giscus)을 자동 감지하고 Obsidian vault를 초기화합니다.

### 2. Obsidian에서 열기

프로젝트 폴더를 Obsidian vault로 열면 커뮤니티 플러그인이 이미 설치되어 있습니다

- **Dataview** — Notion 스타일 테이블 뷰로 글 관리
- **Obsidian Git** — Obsidian에서 바로 GitHub Push
- **Templater** — 새 노트 생성 시 블로그 템플릿 자동 적용

### 3. 글쓰기 & 배포

1. **dashboard.md** 클릭하여 Dashboard 확인
2. 새 노트 생성 (`Ctrl/Cmd+N`) — 템플릿 자동 적용
3. **posts/** 폴더에 글 작성
4. frontmatter에서 `published` 토글 켜기
5. GitHub에 Push → Vercel이 자동으로 빌드

### 4. 배포

Setup 마지막에 배포 여부를 물어봅니다. 또는 언제든:

```bash
pnpm blog:deploy
```

첫 실행 시 Vercel 프로젝트 연결 + 환경 변수 Push를 자동으로 처리합니다. 이후에는 `main` 브랜치에 Push할 때마다 자동 리빌드됩니다.

## 프로젝트 구조

```
<project-root>/              ← Obsidian Vault
├── .obsidian/                # Vault 설정 (자동 구성)
├── dashboard.md              # Dashboard (Obsidian 홈페이지)
├── posts/
│   ├── *.md                  # 블로그 글
│   └── templates/            # 포스트 템플릿 (숨김)
├── public/images/            # 이미지 첨부 (Obsidian이 자동 저장)
├── src/                      # Next.js 소스 코드
└── src/config/blog.config.ts # 블로그 설정 (setup으로 생성)
```

## Frontmatter 스키마

```yaml
---
date: 2026-03-14
published: true # Obsidian에서 토글
tags: [nextjs, blog] # 선택
slug: post-title # 선택 — 파일명에서 자동 생성
thumbnail: /images/cover.jpg # 선택
---
```

| 필드          | 타입    | 필수 | 설명                                       |
| ------------- | ------- | ---- | ------------------------------------------ |
| **date**      | date    | Yes  | 발행일 (YYYY-MM-DD)                        |
| **published** | boolean | Yes  | 발행 토글 (`true` / `false`)               |
| **tags**      | list    | No   | 포스트 태그                                |
| **slug**      | string  | No   | URL 경로 (비어있으면 파일명에서 자동 생성) |
| **thumbnail** | string  | No   | 이미지 경로 (예: `/images/cover.jpg`)      |

> `title`은 파일명에서 자동 사용됩니다. `description`은 본문 첫 160자에서 자동 추출됩니다.

## 스크립트

| 명령어             | 설명             |
| ------------------ | ---------------- |
| `pnpm dev`         | 개발 서버 시작   |
| `pnpm build`       | 프로덕션 빌드    |
| `pnpm blog:setup`  | 제로 설정        |
| `pnpm blog:deploy` | Vercel 배포      |
| `pnpm blog:doctor` | 진단 & 상태 확인 |

## 설정

모든 설정은 `blog.config.ts` 하나에서 관리합니다. `pnpm blog:setup` 실행 후 수정:

```ts
// blog.config.ts
const config = {
  title: 'My Blog',
  url: 'https://myblog.vercel.app',
  author: { name: '홍길동', ... },
  giscus: { repo: 'user/repo', ... },
  navigation: [{ href: '/article/list/1', name: 'articles', description: 'all posts' }],
}
```

파일 하나. 타입 안전. 환경변수 불필요.

## 작동 원리

```
Obsidian (글쓰기) → Git push → Vercel (자동 빌드) → 정적 사이트
```

1. **작성** — `posts/`에 YAML frontmatter가 포함된 `.md` 파일 생성
2. **Push** — Obsidian Git 플러그인 또는 터미널에서 `git push`
3. **빌드** — Vercel이 Push를 감지하고 `next build` 실행
4. **서빙** — Next.js가 `fs`로 마크다운을 읽어 Shiki + KaTeX로 정적 HTML 생성

Obsidian에서 이미지를 붙여넣으면 `public/images/`에 자동 저장되고, 빌드 시 경로가 자동 변환됩니다.

## 기여하기

기여는 언제나 환영합니다! Pull Request를 자유롭게 제출해주세요. 큰 변경사항의 경우, 먼저 이슈를 열어 논의해주세요.

## 기존 블로그 업데이트

이 템플릿으로 만든 블로그에서 `pnpm blog:update`를 실행하면 최신 정식 킷 버전을 적용합니다. 예전 블로그의 첫 업데이트 방법과 보존되는 파일은 [업데이트 가이드](docs/updating.ko.md)를 참고하세요.

## 릴리즈

새 `package.json` 버전이 `main`에 병합 또는 Push되면 템플릿 릴리즈가 자동으로 생성됩니다. 버전 규칙은 [릴리즈 가이드](docs/releasing.md)를 참고하세요.

## 라이선스

MIT 라이선스 — 자세한 내용은 [LICENSE](LICENSE)를 참조하세요.
