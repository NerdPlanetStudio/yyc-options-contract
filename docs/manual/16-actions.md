# 16장. GitHub Actions로 자동 배포 (Push만 하면 끝)

> **이 장에서 완성하는 것**  
> `main` 에 `git push` → **자동 빌드 → GitHub Pages 갱신**.  
> Supabase URL·anon 키는 **GitHub Secrets** 로 주입 (본인 프로젝트용).  
>
> **선행**: 3장 Pages **Source = GitHub Actions**, 2장 push 가능 상태  
> **소요 시간**: 약 1시간 (워크플로는 레포에 이미 있음)  
> **난이도**: ★★★

---

## 16-1. 미리 알아두기

| 용어 | 설명 |
|------|------|
| **GitHub Actions** | push 시 Ubuntu에서 `npm ci` → `npm run build` → Pages 배포 |
| **`pages.yml`** | `.github/workflows/pages.yml` — 정본 |
| **Secret** | `VITE_SUPABASE_*` — 빌드 시에만 주입, 로그에는 마스킹 |
| **`VITE_BASE`** | `/저장소이름/` — CI가 **레포 이름**으로 자동 설정 |

3장에서 워크플로를 처음 만들었다면, 16장은 **Secrets 등록 + 본인 Supabase 연결 + 배포 확인**에 집중합니다.

---

## 16-2. Pages Source 확인

**Settings → Pages → Build and deployment**

| 항목 | 값 |
|------|-----|
| Source | **GitHub Actions** (Deploy from a branch 아님) |

---

## 16-3. GitHub Secrets 등록

**Settings → Secrets and variables → Actions → New repository secret**

| Name | Value |
|------|--------|
| `VITE_SUPABASE_URL` | `https://abcd1234.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → **anon public** |

로컬 `.env.local` 과 **이름을 똑같이** 맞춥니다 (`.env.example` 참고).

> ⚠️ **넣지 말 것**: `service_role`, DB 비밀번호, `WORKBOOK_WEBHOOK_SECRET`, `VITE_WORKBOOK_APPEND_SECRET`  
> Webhook·Edge 비밀은 **Supabase secrets** 만.  
> `VITE_*` 는 빌드 후 브라우저에 노출되므로 **anon 키만**.

Secret 을 안 넣으면 앱이 코드 **기본 Supabase** 로 동작할 수 있습니다. 운영·교육용은 **반드시 본인 프로젝트 Secret** 을 넣으세요.

---

## 16-4. 워크플로 (레포에 이미 있음)

경로: **`.github/workflows/pages.yml`**

요약 (3장과 다른 점):

| 항목 | 현재 레포 |
|------|-----------|
| 트리거 | `push` → `main`, `workflow_dispatch` |
| Node | **22** |
| Job | **`deploy` 1개** (build·deploy 분리 아님) |
| `VITE_BASE` | `/${{ github.event.repository.name }}/` → 레포명이 `yyc-options` 면 `/yyc-options/` |
| Supabase | `npm run build` 의 `env` 에 Secret 2개 |
| 배포 | `configure-pages` → `upload-pages-artifact` → `deploy-pages` |

`vite.config.js` 는 `process.env.VITE_BASE` 를 `base` 로 사용합니다.

`public/.nojekyll` 이 있으면 `dist` 에 복사되어 Jekyll 무시에 도움이 됩니다.

### (선택) 15장 템플릿 xlsx 를 Pages 로 서빙

`public/templates/yyc-contract-pivot-template.xlsx` 를 commit 하면:

`https://내아이디.github.io/yyc-options/templates/yyc-contract-pivot-template.xlsx`

→ Supabase `TEMPLATE_PUBLIC_URL` · 15장 초기화에 사용 (12장 피벗 헤더와 동일).

---

## 16-5. push 후 확인

```bash
cd /경로/yyc-options
git add .
git commit -m "배포 확인"
git push origin main
```

1. GitHub → **Actions** → **Deploy GitHub Pages** → ✅  
2. 주소: `https://내아이디.github.io/저장소이름/`  
3. **신청 화면** (`/`) 동작  
4. **관리자** `https://…/저장소이름/#/admin` (13장)

Secret 을 바꾼 뒤에는 Actions에서 **Re-run all jobs** 한 번.

---

## 16-6. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| `npm ci` 실패 | lock 없음 | 로컬 `npm install` 후 `package-lock.json` commit |
| 흰 화면 | `base` 불일치 | Actions 로그의 `VITE_BASE` 와 주소 경로 (`/레포이름/`) |
| 404 on `assets/…` | base·캐시 | hard refresh; `public/.nojekyll` 확인 |
| Get Pages site failed | Source가 Branch | 16-2 GitHub Actions |
| 빌드 OK인데 다른 DB | Secret 미등록 | 16-3 Secret 2개 + Re-run |
| Secret 있는데 연결 실패 | URL·키 오타 | Supabase API 화면과 1:1 복사 |
| `?admin=1` 안 됨 | 구버전 | **`#/admin`** (13장) |

---

## 16-7. 완료 체크리스트

- [ ] Pages Source = **GitHub Actions**
- [ ] Secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- [ ] `.github/workflows/pages.yml` 이 main 에 있음
- [ ] Actions **Deploy GitHub Pages** ✅
- [ ] Pages URL에서 신청·`#/admin` 확인
- [ ] Actions 로그에 키 **값**이 그대로 찍히지 않음

---

## 16-8. 보안 메모

- `console.log(import.meta.env)` 금지.  
- `VITE_APPEND_WORKBOOK_ON_SUBMIT` + secret 은 GitHub에 넣지 말 것 (번들 노출). 12장은 **Database Webhook** 권장.  
- Edge·DB 비밀은 Supabase secrets.

---

📌 **다음 장**  
17장: RLS·XSS 최종 잠금 (`#/admin` + `applications` REST).
