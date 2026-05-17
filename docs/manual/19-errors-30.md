# 19장. 자주 만나는 에러 30선 — 빠른 해결 카탈로그

> **이 장에서 완성하는 것**  
> 운영하다 만날 거의 모든 빨간 글씨를 **"이 화면이면 → 이거 1줄"** 로 빠르게.  
> 새 사고가 나면 이 장 한 번 훑고 → 안 풀리면 18장 INCIDENT_RUNBOOK → 그래도면 Cursor.  
>
> **사용법**: 검색(Cmd+F)에 에러 키워드만 치면 됩니다.  
> **난이도**: ★ (지식 사전)

---

## 19-1. 화면 (Frontend / 브라우저)

### F-01. 사이트 흰 화면 (콘솔에 빨간 줄)
- **원인**: `vite.config.js` 의 `base` 가 리포 경로와 다름.  
- **해결**: `base: '/yyc-options/'`. 16-4 기준대로 push.

### F-02. `Failed to fetch` (제출/다운로드 시)
- **원인**: 인터넷 끊김 / Supabase 도메인 차단 / Edge Function 미배포.  
- **해결**: 인터넷 → Supabase Status → `supabase functions list` 로 함수 존재 확인.

### F-03. 콘솔 `Invalid API key`
- **원인**: `VITE_SUPABASE_ANON_KEY` 오타·미반영.  
- **해결**: GitHub Secret 다시 + Actions 재실행. 로컬은 dev 재시작.

### F-04. CORS 에러 (`No 'Access-Control-Allow-Origin'`)
- **원인**: Supabase URL 끝 `/` / Edge Function CORS 헤더 누락.  
- **해결**: `.env`의 URL은 `.co` 까지만. 함수 `corsHeaders` 정의 확인.

### F-05. `import.meta.env.VITE_*` 가 undefined
- **원인**: dev 서버 재시작 안 함 / `.env.local` 위치 잘못.  
- **해결**: 프로젝트 루트에 `.env.local` → Ctrl+C → `npm run dev`.

### F-06. 폰에서 서명할 때 페이지 같이 스크롤
- **원인**: `touch-action` 미설정.  
- **해결**: 캔버스 `style={{ touchAction: 'none' }}`. 10-4 표 참고.

### F-07. 이메일 검증이 너무 헐거움 (`a@b` 통과)
- **원인**: 정규식 단순.  
- **해결**: 표준 RFC 정규식으로 교체. 9-5 표 참고.

### F-08. 다음 버튼 영원히 회색
- **원인**: trim 미적용 또는 검증 조건 OR/AND 버그.  
- **해결**: 4칸 모두 trim 후 비어있는지 확인. Cursor에 "현재 활성 조건 디버그 출력 후 고쳐줘".

### F-09. 평면도·옵션 그림 안 보임 / `npm ENOENT package.json`
- **원인**: Imgur URL 오타·삭제, 또는 **홈 폴더에서** `npm run dev` 실행.  
- **해결**: 8장 **8-8~8-11** 절차. `cd .../yyc-options` 후 `npm run dev`. URL을 새 탭에 붙여 그림이 뜨는지 확인.

---

## 19-2. 데이터베이스 (Postgres / RPC / RLS)

### D-01. `permission denied for function ...`
- **원인**: `GRANT EXECUTE ... TO authenticated;` 누락.  
- **해결**: 17-2 SQL 끝부분 GRANT 줄 다시 Run.

### D-02. `function ... does not exist`
- **원인**: `next_yyc_receipt_no.sql` / `submit_application.sql` 미실행.  
- **해결**: 11-3 순서대로 Run. RPC 인자는 `{ payload: ... }` (키 이름 `payload`).

### D-03. `duplicate key value violates unique constraint "applications_unique_per_unit"`
- **원인**: (선택) 동·호 UNIQUE 제약 + 같은 호 재신청.  
- **해결**: 정상 차단. 안내 문구 추가 또는 관리자 초기화.

### D-04. `null value in column "..." violates not-null constraint`
- **원인**: 옛 테이블 스키마(`email`, `resident_id_first6` 등) + 새 앱 payload.  
- **해결**: 11-2 테이블 정의로 맞추기. `signature_data_url`·`receipt_no` 빈값 여부 확인.

### D-05. `column "selected_options" does not exist` (또는 `options`)
- **원인**: DB는 예전 칼럼명, 앱은 `selected_options`.  
- **해결**: 11-2·`submit_application.sql` 기준으로 마이그레이션.

### D-06. anon 으로도 `applications` 가 SELECT 됨
- **원인**: RLS OFF 또는 정책에 USING (true).  
- **해결**: 17-2 그대로 다시 Run + 정책에 `is_admin()` 들어갔는지.

### D-07. 관리자 로그인 후에도 표가 0건
- **원인**: `app_admins` 에 본인 이메일 없음.  
- **해결**: `INSERT INTO app_admins(email) VALUES('admin@admin.com');`.

### D-08. 접수번호가 `YYC-2026-0001` 같은 옛 형식
- **원인**: 옛 `next_yyc_receipt_no` RPC.  
- **해결**: `supabase/sql/next_yyc_receipt_no.sql` 전체 다시 Run → `YYC-YYYYMMDD001` 형식.

### D-09. 초기화 후에도 카운터 안 줄어듦
- **원인**: 옛 `admin_clear_all_applications` 사용 중.  
- **해결**: 15-2 SQL 다시 Run.

### D-10. `cannot truncate ... because RLS policy`
- **원인**: 카운터 테이블 RLS ON.  
- **해결**: `ALTER TABLE yyc_receipt_counter DISABLE ROW LEVEL SECURITY;`.

### D-11. `verify_yyc_resident` 가 항상 0줄
- **원인**: 입력값 공백/한자 / 등록부 데이터 다름.  
- **해결**: 정규화(숫자만/연속공백 1칸) 적용. SQL Editor 에서 직접 호출 시험. 5-5.

### D-12. `permission denied for table app_admins`
- **원인**: REVOKE 후 정책 없이 SELECT 시도.  
- **해결**: 17-2 의 `admins_select_admin` 정책이 있는지.

---

## 19-3. Edge Functions / Webhook / Storage

### E-01. Webhook 결과 401
- **원인**: `WORKBOOK_WEBHOOK_SECRET` 과 헤더 `x-workbook-secret` 불일치.  
- **해결**: `supabase secrets set` + Webhook Header 둘 다 같은 값.

### E-02. 422 `header mismatch on pivot sheet`
- **원인**: 엑셀 1행 헤더가 `append-workbook-row/index.ts` 의 `HEADERS` 와 다름.  
- **해결**: 12-2 표 / `index.ts` 의 `HEADERS` 그대로 1행 수정 후 Storage 재업로드.

### E-02b. 422 `pivot sheet missing`
- **원인**: 시트 이름이 `옵션 신청 현황`, `Sheet1 (2)` 가 아님 (예: 예전 교재 `신청서`).  
- **해결**: 시트 이름 변경 또는 템플릿 교체.

### E-02c. 400 `missing record`
- **원인**: Webhook 본문에 `record` 없음 / 잘못된 테이블·이벤트.  
- **해결**: Table=`applications`, Event=**Insert** 만. 11장 INSERT 가 먼저 되는지 확인.

### E-03. 422 `workbook missing and TEMPLATE_PUBLIC_URL unset`
- **원인**: 버킷·파일명 오타 / 템플릿 URL 미설정.  
- **해결**: `WORKBOOK_OBJECT_KEY` = 실제 파일명. `TEMPLATE_PUBLIC_URL` 시크릿 등록.

### E-04. 500 `storage upload fail`
- **원인**: 버킷명 오타 또는 권한.  
- **해결**: `application-workbook` 정확히. service_role 키 정상인지.

### E-05. Webhook은 도는데 엑셀이 안 바뀜
- **원인**: 캐시 / 화면 새로고침 안 함.  
- **해결**: Storage 새로고침 → 업데이트 시간 확인.

### E-06. `not in a project directory` (CLI)
- **원인**: 홈 디렉토리에서 실행.  
- **해결**: `cd /Users/.../yyc-options` 후 다시.

### E-07. `verify_jwt` 401
- **원인**: 함수가 JWT 검사 모드인데 webhook 은 토큰 없음.  
- **해결**: `--no-verify-jwt` 로 배포 또는 `config.toml` 의 `verify_jwt=false` 확인.

### E-08. 다운로드 함수 401/403
- **원인**: 미로그인 / 화이트리스트 누락.  
- **해결**: 관리자 로그인 후 시도. `WORKBOOK_RESET_ALLOWED_EMAILS` 에 본인 이메일.

### E-09. 다운로드는 되는데 1초만에 만료
- **원인**: 시계 차이.  
- **해결**: `expires` 60 → 90~120.

### E-10. 초기화 후에도 1~155 행 보임
- **원인**: 템플릿 자체에 샘플 행.  
- **해결**: 템플릿 엑셀을 헤더 1줄만 두고 다시 push.

### E-11. Edge Function 배포는 됐는데 Logs 가 비어있음
- **원인**: Webhook 미연결 / Webhook URL 오타.  
- **해결**: Webhook URL 끝이 함수명과 정확히 일치하는지.

---

## 19-4. 인증 / 보안

### S-01. `Email signups are disabled` (관리자 로그인 화면)
- **원인**: 13-2(3)에서 OFF — 정상.  
- **해결**: 가입 X, 로그인만.

### S-02. 관리자 비번 분실
- **해결**: Supabase Authentication → Users → 본인 → ⋯ → **Send password recovery**. 받은 메일에서 재설정.

### S-03. 키가 GitHub 에 실수로 push 됨
- **해결**: 즉시 Supabase **Project Settings → API → Reset** 으로 키 회전. GitHub history 도 `git filter-repo` 등으로 청소(부록 D 참고).

### S-04. 관리자 화면에서 alert(1) 뜸 (XSS)
- **원인**: `dangerouslySetInnerHTML` 또는 raw `innerHTML` 잔여.  
- **해결**: `App.jsx` 관리자 `innerHTML` 에 `escapeHtml` 적용 여부 확인 (17-4).

### S-05. 일반인 anon 키로 데이터 다 읽힘
- **원인**: RLS OFF / 정책 USING (true).  
- **해결**: 17-2 SQL 다시. 17-3 시험.

---

## 19-5. CI / 배포 / GitHub Pages

### C-01. Actions 빨간 X — `npm ci` 실패
- **원인**: `package-lock.json` 누락.  
- **해결**: `npm install` 후 lock 파일 commit.

### C-02. `Get Pages site failed`
- **원인**: Pages Source 가 "Branch" 로 남음.  
- **해결**: Settings → Pages → Source = **GitHub Actions**.

### C-03. 사이트 404 on assets (`/assets/index-xxx.js`)
- **원인**: `.nojekyll` 누락 / `base` 잘못.  
- **해결**: 워크플로우의 `.nojekyll` 생성 단계 + `vite.config.js` `base`.

### C-04. push 했는데 사이트 그대로
- **원인**: GitHub Pages CDN 캐시.  
- **해결**: Cmd+Shift+R 하드 리프레시. 그래도 안 되면 시크릿 창.

### C-05. 백업 워크플로우 401
- **원인**: `SUPABASE_SERVICE_ROLE_KEY` 오타.  
- **해결**: Secret 다시 등록 → Re-run.

### C-06. 백업 cron 안 돔
- **원인**: GitHub Free 한도 / 일시 지연.  
- **해결**: UTC 시간 + 30분 정도 지연 가능. 다음 날 다시. 또는 수동 Run.

---

## 19-6. 19장 사용 팁

- 빨간 메시지 한 줄을 **그대로** Cursor 채팅에 붙이고 "이 매뉴얼 19장 표 형식으로 원인·해결 알려줘" 하면, 카탈로그가 자동으로 더 풍부해집니다.
- 새 에러를 만나면 이 파일에 **한 줄 추가**해 두세요. 1년 뒤 본인이 가장 고마워 합니다.

---

📌 **다음 장 미리보기**  
20장은 본 매뉴얼의 **마지막 본문**.  
시즌을 시작·끝내고 다른 사람에게 인수인계할 때 그대로 따라할 수 있는 "시즌 운영 가이드".
