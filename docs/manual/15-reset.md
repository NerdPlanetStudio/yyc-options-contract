# 15장. 관리자 — 시즌 종료용 "초기화"

> **이 장에서 완성하는 것**  
> 관리자 화면 **「초기화」** 한 번으로:  
> 1) `applications` 전부 삭제  
> 2) `yyc_receipt_counter` 비움 → 다음 접수번호 **001**부터  
> 3) Storage 누적 xlsx → **피벗 템플릿**으로 덮어쓰기  
>
> **선행**: 13·14장, `admin_clear_all_applications.sql`, `reset-application-workbook` 배포  
> **소요 시간**: 약 1시간  
> **난이도**: ★★★★

---

## 15-1. 미리 알아두기

| 단계 | 담당 |
|------|------|
| DB 비우기 | RPC `admin_clear_all_applications` (없으면 배치 DELETE) |
| 접수번호 | RPC `admin_reset_yyc_receipt_counter` (위 RPC에 포함돼도 재호출 OK) |
| 엑셀 | Edge `reset-application-workbook` + `TEMPLATE_PUBLIC_URL` |

앱 (`App.jsx`): 확인창 **1번** → 위 순서 실행. (예전 교재의 `RESET` 입력 2단계는 **현재 UI에 없음**.)

---

## 15-2. SQL — 레포 파일 실행

SQL Editor:

```text
supabase/sql/admin_clear_all_applications.sql   ← 전체 Run
```

포함 내용:

- `admin_clear_all_applications()` → `applications` TRUNCATE + `yyc_receipt_counter` TRUNCATE, 삭제 건수 `bigint` 반환  
- `admin_reset_yyc_receipt_counter()` → 카운터만 TRUNCATE  

> 예전 교재의 `is_admin()` 검사·`yyc_receipt_counter(id, current_no)` INSERT 는 **현재 SQL과 다름.**  
> 카운터 테이블 구조는 `next_yyc_receipt_no.sql` (year/seq) 기준.

RPC 미설치 시: `applications_delete_policy.sql` 후 앱이 **id 배치 DELETE** 폴백.

---

## 15-3. `reset-application-workbook` 배포

레포: `supabase/functions/reset-application-workbook/index.ts`

### 템플릿 URL (12장 피벗과 동일 헤더)

1. 12-2 와 같은 **헤더만 있는** `yyc-contract-pivot-template.xlsx`  
2. `public/templates/` 에 넣고 push  
3. Pages URL 예:

`https://내아이디.github.io/yyc-options/templates/yyc-contract-pivot-template.xlsx`  
(16장 push 후 `public/templates/` 에 파일이 있어야 404 가 나지 않음)

```bash
supabase secrets set TEMPLATE_PUBLIC_URL="https://내아이디.github.io/yyc-options/templates/yyc-contract-pivot-template.xlsx"
supabase secrets set WORKBOOK_RESET_ALLOWED_EMAILS="admin@admin.com"
supabase functions deploy reset-application-workbook --no-verify-jwt
```

12장 `append-workbook-row` 와 **같은 `TEMPLATE_PUBLIC_URL`** 을 쓰면 관리가 쉽습니다.

---

## 15-4. 앱에서 시험

`#/admin` → 로그인 → (선택) 신청 1~2건 → **초기화**

| 단계 | 기대 |
|------|------|
| confirm | DB·접수번호·Storage 안내 문구 |
| 진행 | 버튼 「삭제 중…」→ 「접수번호 초기화…」→ 「엑셀 초기화…」 |
| 완료 | 「접수 기록이 없습니다.」 |
| 일반 화면 신청 | 접수번호 `YYC-YYYYMMDD001` 형식 (11장) |
| 엑셀 다운로드 | 헤더만 → 새 신청 1줄 |

DB만 비우고 엑셀 실패 시 alert 로 Storage 오류 안내 (DB는 이미 비운 상태).

---

## 15-5. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| 삭제 후에도 N건 남음 | RPC 없음·RLS | `admin_clear_all_applications.sql` Run |
| `TEMPLATE_PUBLIC_URL unset` | secret 누락 | 15-3 secrets |
| template fetch failed | 404 | 브라우저로 템플릿 URL 직접 열기 |
| 엑셀에 옛 샘플 155행 | 템플릿에 데이터 포함 | 헤더 1행만 남기고 재업로드 |
| 403 on reset | 화이트리스트 | `WORKBOOK_RESET_ALLOWED_EMAILS` |
| duplicate 동·호 | UNIQUE (있을 때) | 다른 동·호로 테스트 |

---

## 15-6. 완료 체크리스트

- [ ] `admin_clear_all_applications.sql` 적용
- [ ] `reset-application-workbook` + `TEMPLATE_PUBLIC_URL`
- [ ] 초기화 → 목록 0건
- [ ] 새 신청 → `YYC-YYYYMMDD001` …
- [ ] Storage xlsx → 헤더만 후 Webhook 으로 1행 추가

---

## 15-7. 보안 메모

- 초기화 RPC 는 `authenticated` 에 GRANT — **17장 RLS** 로 관리자만 DELETE/SELECT 되게 잠그세요.  
- 엑셀 리셋: JWT + (선택) 이메일 화이트리스트.  
- confirm 1회 — 운영 전 스테이징에서 반드시 한 번 시험.

---

> 💪 **13·14·15**  
> 관리자 **목록 → 상세 → 누적 엑셀 받기 → 시즌 초기화** 운영 세트 완성.
