# 16장. GitHub Actions로 자동 배포 (Push만 하면 끝)

> **이 장에서 완성하는 것**  
> 코드를 `git push` 하면 → **자동으로 빌드 → GitHub Pages 갱신**.  
> 환경변수(VITE_SUPABASE_URL 등)도 GitHub 비밀 저장소에 안전하게.  
>
> **소요 시간**: 약 1.5시간  
> **난이도**: ★★★

---

## 16-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **GitHub Actions** | "GitHub가 무료로 빌려주는 자동화 알바" |
| **워크플로우 (workflow)** | "알바한테 시킬 일 목록 (yml 한 장)" |
| **Secret / Variable** | "공개 안 되는 비밀 메모 / 그냥 메모" |
| **Job / Step** | "큰 단위 일 / 그 안의 작은 단계" |
| **gh-pages** | "빌드 결과 폴더를 인터넷 주소로 띄워주는 GitHub 기능" |

---

## 16-2. GitHub Pages 모드를 "Actions" 로 바꾸기

3장에서 "Deploy from a branch" 로 했다면 한 번만 바꿉니다.

### (1) GitHub 리포 → **Settings → Pages**
### (2) **Source** 드롭다운에서 **GitHub Actions** 선택

[스크린샷: Pages 설정 — Source: GitHub Actions]

→ Save (자동 저장될 수도 있음).

---

## 16-3. 비밀값 GitHub에 등록 (Secrets)

`.env.local` 의 두 줄을 GitHub에도 알려줘야 합니다.

### (1) Settings → **Secrets and variables → Actions**
### (2) **New repository secret** 두 번

| Name | Secret |
|------|--------|
| `VITE_SUPABASE_URL` | `https://abcd1234.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGc...본인거...` |

[스크린샷: Actions secrets 화면 — 두 줄 등록됨]

> ⚠️ **service_role 키, Supabase DB 비밀번호, WORKBOOK_WEBHOOK_SECRET 같은 건 여기 절대 넣지 마세요.** 프런트 빌드는 anon 키만 알면 됩니다.

---

## 16-4. AI에게 워크플로우 만들라고 시키기 🎯

> 🎯 **Cursor에 그대로 복사**  
> ```
> 프로젝트 루트에 .github/workflows/pages.yml 파일을 만들어줘.
>
> 요구사항:
> - main 브랜치에 push 되면 트리거
> - workflow_dispatch (수동 실행)도 가능
> - permissions: contents:read, pages:write, id-token:write
> - jobs:
>   1) build:
>      - actions/checkout@v4
>      - actions/setup-node@v4 (node-version 20, cache: 'npm')
>      - npm ci
>      - npm run build
>        env:
>          VITE_SUPABASE_URL:      ${{ secrets.VITE_SUPABASE_URL }}
>          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
>          VITE_BASE: "/yyc-options/"
>      - 빌드 후 dist 폴더에 .nojekyll 빈 파일 생성
>      - actions/upload-pages-artifact@v3 (path: ./dist)
>   2) deploy:
>      - needs: build
>      - environment: name: github-pages, url: ${{ steps.deployment.outputs.page_url }}
>      - actions/deploy-pages@v4 (id: deployment)
>
> 그리고 vite.config.js 가 base 옵션을 import.meta.env.BASE_URL 또는
> process.env.VITE_BASE 를 쓰게 되어 있는지 확인하고, 안 되어 있으면 그렇게 수정.
>
> 변경 후 Apply.
> ```

---

## 16-5. push 후 자동 배포 확인

### (1) 평소처럼 commit + push
- Cursor 사이드바 나뭇가지 → Message: `actions 자동 배포` → ✓ → Sync.

### (2) GitHub 리포 → **Actions** 탭
- 방금 push 워크플로우가 노란 점 → 초록 체크로 변하는지 확인.

[스크린샷: Actions 탭 — build / deploy 둘 다 ✅]

### (3) 인터넷 주소 새로고침
- `https://내아이디.github.io/yyc-options/` 에 변경 사항 반영됨.

✅ Push만으로 자동 반영되면 16장 통과.

---

## 16-6. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| Actions 빨간 X — `npm ci` 실패 | `package-lock.json` 누락 | 로컬에서 `npm install` 후 lock 파일 commit |
| 사이트가 흰 화면 | base 경로 잘못 | `vite.config.js` 에 `base: '/yyc-options/'` |
| 404 on assets | `.nojekyll` 누락 | yml 의 ".nojekyll 생성" 단계 확인 |
| "Get Pages site failed" | Pages 모드 Branch로 남아있음 | 16-2 다시 |
| `secrets.VITE_SUPABASE_URL` 비어 있음 | 16-3 안 함 | secret 등록 후 "Re-run workflow" |
| 빌드는 되는데 anon key 없음 | secret 이름 오타 | yml의 env 이름과 secret 이름 1:1 |

---

## 16-7. 16장 완료 체크리스트

- [ ] Pages Source = **GitHub Actions**
- [ ] Repo Secrets 2개 등록 (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] `.github/workflows/pages.yml` 생성·push
- [ ] Actions 탭에 ✅ 두 잡 (build, deploy)
- [ ] 코드 수정 → push 만으로 사이트 자동 갱신
- [ ] Actions 로그에 anon/service 키 "값" 이 노출 안 됨

---

## 16-8. 보안 메모

- secret 은 **로그에 마스킹**되지만, `console.log(env)` 같은 건 절대 코드에 두지 말기.  
- `VITE_*` 로 시작하는 건 **빌드 후 클라이언트에 그대로 박힘** = 누구나 볼 수 있음. 그래서 `anon` 키만 OK, `service_role` 은 절대 X.  
- Webhook secret, DB 비번 등은 GitHub 가 아니라 **Supabase secrets** 에만 둡니다.

---

📌 **다음 장 미리보기**  
17장에서 **권한(RLS) + XSS** 를 한 번에 단단히 잠급니다. 마지막 보안 검수.
