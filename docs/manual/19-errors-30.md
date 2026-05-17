# 19장. 자주 만나는 에러 — 빠른 해결 카탈로그

> 운영 중 빨간 메시지 → **Cmd+F** 로 검색 → 안 풀리면 `docs/INCIDENT_RUNBOOK.md` → Cursor.  
> **2026 현행 앱**: step 0~2, `#/admin`, `selected_options`, `YYC-YYYYMMDD001`.

---

## 19-1. 화면 (Frontend)

### F-01. 흰 화면
- **원인**: GitHub Pages `base` ≠ 실제 URL 경로.  
- **해결**: `vite.config.js` + Actions `VITE_BASE=/${{ repository.name }}/`. 16장.

### F-02. `Failed to fetch`
- **원인**: 네트워크 / Supabase 장애 / 함수 미배포.  
- **해결**: status.supabase.com · Edge Functions 목록.

### F-03. `Invalid API key`
- **원인**: anon 키 오타·Secret 미반영.  
- **해결**: GitHub Secrets + Actions Re-run · 로컬 `.env.local` + dev 재시작.

### F-04. CORS
- **원인**: Supabase URL 형식 / Edge CORS.  
- **해결**: URL 끝 `/` 제거 · 함수 `Access-Control-Allow-*` 헤더.

### F-05. `VITE_*` undefined
- **원인**: env 파일 위치·서버 미재시작.  
- **해결**: 루트 `.env.local` · `npm run dev` 재실행.

### F-06. 서명 시 페이지 스크롤
- **해결**: 캔버스 `touchAction: 'none'` (10장).

### F-07. 게이트에서 막힘 / 평형 안 맞음
- **원인**: 등록부 없음·`type_key` 불일치·뒷4자리 오타.  
- **해결**: 5·7장 · `verify_yyc_resident` SQL 직접 호출.

### F-08. 「옵션 계약 신청」 버튼 비활성
- **원인**: step 0 네 칸·평형 미선택.  
- **해결**: 동·호·이름·휴대폰 뒷4자리·평형 버튼.

### F-09. 그림 안 보임 / `ENOENT package.json`
- **원인**: Imgur URL · 홈에서 `npm run dev`.  
- **해결**: 8장 · `cd yyc-options`.

### F-10. `?admin=1` 로 관리자 안 열림
- **원인**: 구버전 주소.  
- **해결**: **`#/admin`** (13장).

### F-11. Storage 누적 워크북 다운로드 실패 (관리자)
- **원인**: `sign-application-workbook` · secrets.  
- **해결**: 14장 · 응답 필드 `signedUrl`.

---

## 19-2. DB / RPC / RLS

### D-01. `permission denied for function`
- **해결**: `applications_rls_lockdown.sql` GRANT 절.

### D-02. function does not exist
- **해결**: A-2 순서 — `next_yyc_receipt_no.sql`, `submit_application.sql`.

### D-03. duplicate key (동·호 UNIQUE 있을 때)
- **해결**: 정상 차단 또는 15장 초기화.

### D-04. not-null constraint
- **해결**: 11장 스키마 · `applications_migrate_to_current_schema.sql`.

### D-05. `column "selected_options" does not exist`
- **해결**: 11장 마이그레이션 SQL.

### D-06. anon이 applications 조회됨
- **해결**: `applications_rls_lockdown.sql` · 17-3 시험.

### D-07. 관리자 목록 0건
- **해결**: `app_admins` INSERT · `#/admin` 재로그인.

### D-08. 접수번호 `YYC-2026-0001` 형식
- **해결**: `next_yyc_receipt_no.sql` 재실행.

### D-09. 초기화 후 카운터
- **해결**: `admin_clear_all_applications.sql`.

### D-10. truncate + RLS
- **해결**: 초기화는 **RPC** 사용(15장). 직접 TRUNCATE 대신.

### D-11. verify 항상 실패
- **해결**: 5장 등록부 · 공백/숫자 정규화.

### D-12. app_admins permission denied
- **해결**: 17장 `admins_select_admin` 정책.

### D-13. 상태/메모 저장 실패
- **해결**: A-3 `admin_memo`, `updated_at` 칼럼 추가.

---

## 19-3. Edge / Webhook / Storage

### E-01. Webhook 401
- **해결**: `WORKBOOK_WEBHOOK_SECRET` = 헤더 `x-workbook-secret`.

### E-02. 422 header mismatch
- **해결**: 12장 피벗 `HEADERS` = 엑셀 1행.

### E-02b. pivot sheet missing
- **해결**: 시트명 `옵션 신청 현황` 또는 `Sheet1 (2)`.

### E-02c. 400 missing record
- **해결**: Webhook Insert · `applications`.

### E-03. workbook missing
- **해결**: Storage 업로드 · `TEMPLATE_PUBLIC_URL`.

### E-04. 500 storage upload
- **해결**: `application-workbook` · service_role.

### E-05. Webhook OK, 엑셀 안 변함
- **해결**: Storage Updated · 캐시.

### E-06. CLI not in project directory
- **해결**: `cd yyc-options`.

### E-07. verify_jwt 401 (Edge)
- **해결**: `--no-verify-jwt` · config.toml.

### E-08. sign 401/403
- **해결**: `#/admin` 로그인 · `WORKBOOK_RESET_ALLOWED_EMAILS`.

### E-09. signedUrl 만료
- **해결**: 다시 「엑셀 내려받기」.

### E-10. 초기화 후 샘플 행 많음
- **해결**: 템플릿 헤더만.

### E-11. Functions Logs 비어 있음
- **해결**: Webhook URL·Insert 이벤트.

---

## 19-4. 인증 / 보안

### S-01. Email signups disabled
- **정상** — 가입 OFF, 로그인만 (13장).

### S-02. 관리자 비번 분실
- **해결**: Auth Users → Reset password.

### S-03. 키 GitHub에 push
- **해결**: API 키 Reset · history 정리 (D-3 참고).

### S-04. XSS alert
- **해결**: 17장 `escapeHtml` · `safeSignatureSrc`.

### S-05. anon으로 데이터 유출
- **해결**: `applications_rls_lockdown.sql`.

---

## 19-5. CI / Pages / 백업

### C-01. npm ci 실패
- **해결**: `package-lock.json` commit.

### C-02. Get Pages site failed
- **해결**: Pages Source = GitHub Actions.

### C-03. assets 404
- **해결**: `VITE_BASE` · `public/.nojekyll`.

### C-04. push 후 사이트 안 바뀜
- **해결**: hard refresh.

### C-05. backup-workbook 401
- **해결**: `SUPABASE_SERVICE_ROLE_KEY` Secret.

### C-06. backup cron 안 돔
- **해결**: UTC 18:00 = KST 03:00 · 수동 Run.

---

## 19-6. 사용 팁

에러 한 줄을 Cursor에 붙이고 「19장 형식으로 원인·해결」 요청.  
새 에러는 이 파일에 **한 줄 추가**해 두세요.

---

📌 **관련 문서**  
`docs/INCIDENT_RUNBOOK.md` · `docs/OPERATIONS_CHECKLIST.md` · 부록 A~D
