# 18장. 운영 점검표 + 백업 (혼자 운영하는 사람용)

> **이 장에서 완성하는 것**  
> 1) **주·월 점검 리스트** (`docs/OPERATIONS_CHECKLIST.md`)  
> 2) **장애 30분 행동표** (`docs/INCIDENT_RUNBOOK.md`)  
> 3) **누적 엑셀 자동 백업** (`.github/workflows/backup-workbook.yml`)  
>
> **선행**: 12·14·16·17장  
> **소요 시간**: 약 1시간  
> **난이도**: ★★

---

## 18-1. 운영 점검표

레포에 **`docs/OPERATIONS_CHECKLIST.md`** 가 있습니다.

1. 파일을 열어 **사이트 URL·관리자 이메일** 빈칸 채우기  
2. `git add docs/OPERATIONS_CHECKLIST.md` → commit → push  
3. 매주 월요일 / 매월 1일 체크박스 실행

포함 항목 (현행 앱):

| 주기 | 내용 |
|------|------|
| 매주 | `step 0~2` 테스트 신청, `#/admin` 목록, Storage 엑셀, Webhook·Edge Logs |
| 매월 | 비번·Supabase 한도·Actions·백업 Artifact·등록부·`app_admins` |
| 시즌 종료 | 엑셀 별도 보관 → 15장 초기화 → `optionsCatalog.js` 갱신 |

> 예전 `?admin=1` → **`#/admin`** (13장).

---

## 18-2. 장애 시 행동표

레포에 **`docs/INCIDENT_RUNBOOK.md`** 가 있습니다.

| # | 증상 |
|---|------|
| 1 | 흰 화면 |
| 2 | 신청완료 오류 |
| 3 | 관리자 로그인 실패 |
| 4 | 관리자 목록 0건 |
| 5 | 엑셀 다운로드 401/403 |
| 6 | 엑셀에 줄 안 쌓임 |
| 7 | Supabase 장애 |

하단 **연락·계정** 표에 URL·이메일을 채워 두세요.  
더 많은 코드는 교재 **19장** 에러 카탈로그.

---

## 18-3. 자동 백업 (GitHub Actions)

Supabase 무료 플랜은 DB PITR이 제한적입니다.  
**매일 새벽** Storage 의 `yyc-contract-live_V1.xlsx`(12장 누적본)를 Artifact로 보관합니다.

### (1) GitHub Secrets

**Settings → Secrets and variables → Actions**

| Name | 값 |
|------|-----|
| `VITE_SUPABASE_URL` | 16장과 동일 (`https://xxxx.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → **service_role** (비공개) |

> ⚠️ `service_role` 은 **GitHub Secret + Supabase 대시보드** 에만. 코드·`.env`·Pages에 넣지 않음.

### (2) 워크플로 (레포에 있음)

**`.github/workflows/backup-workbook.yml`**

| 항목 | 값 |
|------|-----|
| 스케줄 | `cron: 0 18 * * *` → **KST 03:00** |
| 수동 | Actions → **Backup application workbook** → Run workflow |
| 저장 | `backups/yyc-contract-live_YYYYMMDD.xlsx` |
| 보관 | Artifact **30일** |

Storage URL (워크플로 내부):

`{VITE_SUPABASE_URL}/storage/v1/object/application-workbook/yyc-contract-live_V1.xlsx`

### (3) 첫 실행

1. Secrets 2개 등록  
2. GitHub → **Actions** → **Backup application workbook** → **Run workflow**  
3. run 페이지 **Artifacts** → xlsx 다운로드·열기  

✅ 다음 날 03:00 KST 전후 자동 run 1건 추가.

### (4) DB만 따로 백업하고 싶을 때

- Table Editor → `applications` → Export CSV (시즌 마감 시)  
- 15장 마감 전 **관리자 엑셀 다운로드** 3중 보관 권장

---

## 18-4. 완료 체크리스트

- [ ] `docs/OPERATIONS_CHECKLIST.md` 빈칸 채움·push
- [ ] `docs/INCIDENT_RUNBOOK.md` 연락처 채움
- [ ] Secrets: `VITE_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `backup-workbook` 수동 Run ✅, Artifact 다운로드
- [ ] 다음 날 자동 백업 1건 확인

---

## 18-5. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| Missing secrets in workflow | Secret 이름 오타 | 위 2개 이름 정확히 |
| Download failed HTTP 404 | 버킷·파일명 | 12장 `yyc-contract-live_V1.xlsx` |
| HTTP 401 | service_role 오류 | Secret 재등록 |
| 0바이트 파일 | 객체 없음 | 신청 1건 후 Webhook·Storage 확인 |
| cron 안 돌음 | 지연·권한 | UTC+9h; Private 레포 Actions 한도 |
| Artifact 없음 | retention 만료 | 수동 Run 또는 retention-days ↑ |

---

## 18-6. 보안 메모

- `service_role` = DB·Storage 풀권한 → 유출 시 즉시 Reset + Secret 갱신.  
- Artifact는 **리포 접근 권한자**만 다운로드.  
- **30일 Artifact** + **시즌 종료 USB 보관** 2단 구조 권장.

---

> 💪 **16·17·18**  
> 자동 배포 · RLS/XSS · 운영·백업까지 한 사이클 완성.  
> 다음: **19장** 에러 카탈로그, **20장** 시즌 시작/종료.
