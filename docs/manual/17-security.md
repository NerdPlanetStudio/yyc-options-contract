# 17장. 보안 최종 잠금 (RLS · 권한 · XSS)

> **이 장에서 완성하는 것**  
> 1) 일반인(anon)은 `applications`·등록부 **직접 SELECT/쓰기 불가** — RPC만  
> 2) 관리자(`#/admin` + `app_admins`)만 접수 목록·수정  
> 3) 관리자 화면 사용자 입력 **escape + 서명 URL 화이트리스트**  
> 4) 민감 로그·시크릿 노출 점검  
>
> **선행**: 13장 `app_admins` / `is_admin()`, 11장 RPC, 16장 배포  
> **소요 시간**: 약 1.5시간  
> **난이도**: ★★★★

---

## 17-1. 미리 알아두기

| 구분 | 일반 신청 화면 | 관리자 `#/admin` |
|------|----------------|------------------|
| DB 읽기 | ❌ REST `applications` 직접 | ✅ JWT + `is_admin()` RLS |
| DB 쓰기 | ✅ `verify_yyc_resident`, `next_yyc_receipt_no`, `submit_application` RPC | ✅ PATCH·초기화 RPC |
| Storage 엑셀 | ❌ | ✅ `sign-application-workbook` (14장) |

| 용어 | 설명 |
|------|------|
| **RLS** | 행 단위로 “누가 이 줄을 볼 수 있나” |
| **SECURITY DEFINER RPC** | RLS를 우회해 허용된 동작만 수행 (`submit_application` 등) |
| **XSS** | 입력에 `<script>` 등이 들어와 실행되는 사고 |
| **`escapeHtml`** | 관리자 UI `innerHTML` 조립 시 사용자 값 이스케이프 |

---

## 17-2. SQL — 레포 파일 한 번에 실행

**선행**: 13-3 `app_admins` + `is_admin()` 이 이미 있어야 합니다.

SQL Editor → **`supabase/sql/applications_rls_lockdown.sql`** 전체 **Run**.

하는 일 요약:

- `applications`, `yyc_resident_registry`, `app_admins` 에 **RLS ON** + anon/authenticated **REVOKE**  
- 관리자만 `applications` SELECT·UPDATE·DELETE (`is_admin()`)  
- 신청 INSERT 는 **정책 없음** → `submit_application` RPC 만  
- 느슨한 `"authenticated can delete applications"` 정책 있으면 **제거**  
- RPC `GRANT`: `verify_yyc_resident`, `submit_application`, `next_yyc_receipt_no`, `is_admin`, `admin_clear_*`

> 예전 교재의 `list_applications` / `get_application` RPC 는 **현재 앱이 쓰지 않습니다.**

부록 **A-5** 도 같은 내용입니다.

---

## 17-3. 잠겼는지 시험

### (1) anon — 일반 신청 화면 F12

`#/admin` **없이** 메인 화면 → Console (본인 Supabase URL·anon 키로):

```js
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const res = await fetch(`${url}/rest/v1/applications?select=id&limit=1`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` }
});
console.log(res.status, await res.json());
```

✅ **기대**: `401` / `403` / 빈 배열·RLS 오류 — 신청 데이터가 **보이면 안 됨**.

### (2) 관리자

`#/admin` 로그인 → 접수 목록 표 표시.  
Network → `applications?select=*` **200**.

### (3) 신청 한 바퀴

`step 0` 검증 → 옵션 선택 → `step 2` 신청완료 → 관리자 목록에 1건.

셋 다 OK면 RLS 통과.

---

## 17-4. XSS — 앱에 이미 적용됨 (확인만)

정본: `src/App.jsx`

| 항목 | 구현 |
|------|------|
| 관리자 표·상세 | `escapeHtml` / `escapeHtmlAttr` 로 `innerHTML` 조립 |
| 서명 이미지 | `safeSignatureSrc` — `data:image/(png\|jpeg\|…);base64,…` 만 |
| 신청 React UI | JSX `{값}` 출력 (기본 이스케이프) |
| 에러 | 사용자에게 Supabase 원문 대신 짧은 한국어 안내 |

**새로 AI에게 짤 필요 없습니다.** 관리자 화면에 필드를 추가할 때만 `escapeHtml(사용자입력)` 규칙을 지키면 됩니다.

남은 주의:

- `admin-detail-msg` 등에 `err.message` 를 **escape 없이** 넣지 않기  
- `console.log(payload)`, `console.log(signature)` 금지 — `console.error` 는 개발자용으로만

---

## 17-5. XSS 시험

1. 일반 화면에서 계약자명에  
   `<img src=x onerror="alert(1)">` 입력 후 신청  
2. `#/admin` → 해당 행 상세

✅ **alert 없음**, 화면에 **글자 그대로** 보이면 OK.

---

## 17-6. (선택) Content-Security-Policy

`index.html` 에 CSP 를 넣으면 보안은 강해지지만, **Pretendard CDN**·Vite HMR 과 충돌할 수 있습니다.

넣을 경우 최소 예 (Supabase + CDN):

```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self';
           connect-src 'self' https://*.supabase.co;
           img-src 'self' data: https:;
           script-src 'self';
           style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
           font-src 'self' https://cdn.jsdelivr.net;
           base-uri 'self'; frame-ancestors 'none';" />
```

화면이 깨지면 **제거**하고 17-2·17-4 만으로도 MVP 운영 가능합니다.

---

## 17-7. 완료 체크리스트

- [ ] `applications_rls_lockdown.sql` 실행
- [ ] anon REST 로 `applications` 조회 불가
- [ ] `#/admin` 목록·상태/메모 저장 OK
- [ ] 일반 신청·접수번호·Webhook 엑셀 정상
- [ ] XSS 시험(악성 이름) 통과
- [ ] Repo·Pages·`.env` 에 `service_role` / webhook secret 없음

---

## 17-8. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| 관리자 목록 0건 | `app_admins` 에 이메일 없음 | 13-3 INSERT |
| 신청 시 permission denied | RPC GRANT 누락 | `applications_rls_lockdown.sql` 다시 |
| 검증만 안 됨 | 등록부 데이터 | 5장 seed |
| PATCH 실패 | `admin_memo` 없음 | 13-3 (2) ALTER |
| 초기화 forbidden | RLS·비관리자 JWT | 관리자 로그인 + `is_admin()` |
| XSS alert | escape 누락 | 해당 `innerHTML` 에 `escapeHtml` |
| CSP 후 흰 화면 | CDN 차단 | 17-6 CSP 완화 또는 제거 |

---

## 17-9. 보안 한 줄 요약

| 항목 | 상태 |
|------|------|
| anon → applications SELECT | 차단 |
| anon → 신청 저장 | `submit_application` RPC 만 |
| 입주민 검증 | `verify_yyc_resident` RPC (등록부 직접 SELECT 불가) |
| Storage 누적 xlsx | 비공개 + 서명 URL |
| 관리자 가입 | Email signup OFF + `app_admins` |
| 화면 출력 | escapeHtml + safeSignatureSrc |
| service_role · webhook secret | Supabase secrets / GitHub Actions secret 만 |

---

📌 **다음 장**  
18장: 운영 점검표·백업.
