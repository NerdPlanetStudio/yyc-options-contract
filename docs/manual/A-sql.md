# 부록 A. SQL 설치 순서 (레포 파일 기준)

> **용도**: 새 Supabase 프로젝트·DB 재구축·"SQL 상태가 이상할 때"  
> **순서**: 아래 번호대로 SQL Editor에서 **파일 통째로** Run (가능하면 복붙 대신 레포 경로 확인).

---

## A-0. 처음만 — 전부 삭제 (운영 데이터 있으면 SKIP)

```sql
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.yyc_resident_registry CASCADE;
DROP TABLE IF EXISTS public.yyc_receipt_counter CASCADE;
DROP TABLE IF EXISTS public.app_admins CASCADE;
DROP FUNCTION IF EXISTS public.verify_yyc_resident(text,text,text,text);
DROP FUNCTION IF EXISTS public.next_yyc_receipt_no();
DROP FUNCTION IF EXISTS public.submit_application(jsonb);
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.admin_clear_all_applications();
DROP FUNCTION IF EXISTS public.admin_reset_yyc_receipt_counter();
-- 예전 교재 RPC (있으면 제거)
DROP FUNCTION IF EXISTS public.list_applications();
DROP FUNCTION IF EXISTS public.get_application(bigint);
```

---

## A-1. 입주민 등록부 + 검증 (5·7장)

**파일:** `supabase/sql/yyc_resident_registry.sql` 전체 Run  
→ 이어서 `npm run db:residents-sql` 로 생성한 INSERT 실행 (5장).

---

## A-2. 신청 테이블 + RPC (11장)

| 순서 | 파일 |
|------|------|
| 1 | `supabase/sql/applications_create_table.sql` **또는** `applications_migrate_to_current_schema.sql` (옛 DB) |
| 2 | `supabase/sql/next_yyc_receipt_no.sql` |
| 3 | `supabase/sql/submit_application.sql` |

앱 호출:

- `POST /rpc/next_yyc_receipt_no` body `{}`
- `POST /rpc/submit_application` body `{"payload":{ receipt_no, customer_name, phone, dong, ho, unit_type, selected_options, total_price, signature_data_url, … }}`

---

## A-3. 관리자 화이트리스트 (13·17장)

```sql
CREATE TABLE IF NOT EXISTS public.app_admins ( email text PRIMARY KEY );
INSERT INTO public.app_admins(email) VALUES ('admin@admin.com')
ON CONFLICT DO NOTHING;
ALTER TABLE public.app_admins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.app_admins FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.app_admins a
    WHERE a.email = lower(coalesce(auth.jwt()->>'email',''))
  );
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
```

> 현재 앱은 `list_applications` RPC 없이 **`GET /rest/v1/applications`** + RLS 로 목록 조회.

선택 (상태·메모 PATCH):

```sql
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS admin_memo text;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
```

---

## A-4. 초기화 RPC (15장)

**파일:** `supabase/sql/admin_clear_all_applications.sql` 전체 Run

- `admin_clear_all_applications()` — TRUNCATE applications + yyc_receipt_counter  
- `admin_reset_yyc_receipt_counter()` — 카운터만 TRUNCATE  

폴백 DELETE 정책(초기화 RPC 없을 때만): `applications_delete_policy.sql`

---

## A-5. RLS 잠금 (17장)

**파일:** `supabase/sql/applications_rls_lockdown.sql` 전체 Run (A-3 `is_admin()` 선행).

Storage 버킷(12장): `supabase/sql/storage_application_workbook_bucket.sql` (필요 시)

---

## A-6. 점검 쿼리

```sql
SELECT count(*) FROM public.applications;
SELECT unit_type, count(*) FROM public.applications GROUP BY 1;
SELECT count(*) FROM public.yyc_resident_registry;
SELECT year, seq FROM public.yyc_receipt_counter ORDER BY year;
SELECT * FROM public.app_admins;
SELECT public.is_admin();  -- 관리자 JWT 세션에서
```

---

## A-7. 파일 목록 한눈에

| 파일 | 장 |
|------|-----|
| `yyc_resident_registry.sql` | 5·7 |
| `applications_create_table.sql` | 11 |
| `applications_migrate_to_current_schema.sql` | 11 (옛 DB) |
| `next_yyc_receipt_no.sql` | 11 |
| `submit_application.sql` | 11 |
| `admin_clear_all_applications.sql` | 15 |
| `applications_rls_lockdown.sql` | 17 |
| `applications_delete_policy.sql` | 15 폴백 |
| `storage_application_workbook_bucket.sql` | 12 |
