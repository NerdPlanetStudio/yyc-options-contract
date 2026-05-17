# 부록 A. 모든 SQL 한 페이지 (복붙용)

> **이 부록의 용도**  
> 새 환경에 설치하거나, 의심스러울 때 "지금 SQL 상태가 깨끗한가?" 한 번에 다시 깔 때.  
> **위에서 아래로 순서대로** 한 번씩 Run 하면 본 매뉴얼 시점의 DB가 똑같이 만들어집니다.  
>
> 사용 순서: 4장 프로젝트 생성 → 이 부록 A 한 번 → 14·17장 부분만 다시 확인.

---

## A-0. 처음 한 번만 — 위험 명령 (이미 운영 중이면 SKIP)

```sql
-- 깔끔히 다시 시작할 때만. 운영 데이터 모두 사라짐.
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.yyc_resident_registry CASCADE;
DROP TABLE IF EXISTS public.yyc_receipt_counter CASCADE;
DROP TABLE IF EXISTS public.app_admins CASCADE;
DROP FUNCTION IF EXISTS public.verify_yyc_resident(text,text,text,text);
DROP FUNCTION IF EXISTS public.next_yyc_receipt_no();
DROP FUNCTION IF EXISTS public.submit_application(jsonb);
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.list_applications();
DROP FUNCTION IF EXISTS public.get_application(bigint);
DROP FUNCTION IF EXISTS public.admin_clear_all_applications();
DROP FUNCTION IF EXISTS public.admin_reset_yyc_receipt_counter();
```

---

## A-1. 등록부 + 검증 함수 (5장)

```sql
CREATE TABLE IF NOT EXISTS public.yyc_resident_registry (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  dong text NOT NULL,
  ho text NOT NULL,
  contractor_name text NOT NULL,
  phone_tail text NOT NULL,
  type_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT yyc_resident_phone_chk CHECK (phone_tail ~ '^[0-9]{4}$'),
  CONSTRAINT yyc_resident_unique UNIQUE (dong, ho, contractor_name, phone_tail)
);
ALTER TABLE public.yyc_resident_registry ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.yyc_resident_registry FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.verify_yyc_resident(
  p_dong text, p_ho text, p_contractor text, p_phone_tail text
)
RETURNS TABLE(type_key text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT r.type_key FROM public.yyc_resident_registry r
  WHERE r.dong = regexp_replace(coalesce(p_dong,''), '\D','','g')
    AND r.ho   = regexp_replace(coalesce(p_ho,''),   '\D','','g')
    AND r.contractor_name = trim(regexp_replace(coalesce(p_contractor,''), '\s+',' ','g'))
    AND r.phone_tail = regexp_replace(coalesce(p_phone_tail,''), '\D','','g')
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.verify_yyc_resident(text,text,text,text) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.verify_yyc_resident(text,text,text,text) TO anon, authenticated;
```

---

## A-2. 신청서 + 접수번호 + 저장 RPC (11장)

### (1) 테이블

**빈 DB:** `supabase/sql/applications_create_table.sql` 전체 Run.

**옛 스키마 DB:** `supabase/sql/applications_migrate_to_current_schema.sql` Run 후 (2) 실행.

<details><summary>또는 아래 SQL 직접 붙여넣기</summary>

```sql
CREATE TABLE IF NOT EXISTS public.applications (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  receipt_no text UNIQUE NOT NULL,
  customer_name text NOT NULL DEFAULT '미입력',
  phone text NOT NULL DEFAULT '',
  dong text NOT NULL,
  ho text NOT NULL,
  unit_type text NOT NULL,
  selected_options jsonb NOT NULL DEFAULT '[]'::jsonb,
  selected_options_summary text,
  total_price numeric NOT NULL DEFAULT 0,
  signature_data_url text NOT NULL DEFAULT '',
  printed boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT '접수됨',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.applications FROM PUBLIC;
```

</details>

### (2) 함수 — 레포 SQL 파일 **전체** 실행 (권장)

| 순서 | 파일 |
|------|------|
| 1 | `supabase/sql/next_yyc_receipt_no.sql` |
| 2 | `supabase/sql/submit_application.sql` |

앱 호출: `POST /rpc/next_yyc_receipt_no` `{}` → `POST /rpc/submit_application` `{"payload":{...}}`

---

## A-3. 관리자 화이트리스트 + 조회 RPC (13장)

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
GRANT  EXECUTE ON FUNCTION public.is_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.list_applications()
RETURNS TABLE(
  id bigint, receipt_no text, customer_name text,
  dong text, ho text, unit_type text,
  total_amount integer, created_at timestamptz
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'forbidden' USING ERRCODE='42501'; END IF;
  RETURN QUERY
    SELECT a.id, a.receipt_no, a.customer_name,
           a.dong, a.ho, a.unit_type,
           a.total_amount, a.created_at
      FROM public.applications a
     ORDER BY a.created_at DESC;
END $$;
REVOKE ALL ON FUNCTION public.list_applications() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.list_applications() TO authenticated;

CREATE OR REPLACE FUNCTION public.get_application(p_id bigint)
RETURNS SETOF public.applications
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'forbidden' USING ERRCODE='42501'; END IF;
  RETURN QUERY SELECT * FROM public.applications WHERE id = p_id;
END $$;
REVOKE ALL ON FUNCTION public.get_application(bigint) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_application(bigint) TO authenticated;
```

---

## A-4. 초기화 RPC (15장)

```sql
CREATE OR REPLACE FUNCTION public.admin_clear_all_applications()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'forbidden' USING ERRCODE='42501'; END IF;
  TRUNCATE TABLE public.applications RESTART IDENTITY;
  TRUNCATE TABLE public.yyc_receipt_counter;
  INSERT INTO public.yyc_receipt_counter(id, current_no) VALUES (1, 0)
    ON CONFLICT DO NOTHING;
END $$;
REVOKE ALL ON FUNCTION public.admin_clear_all_applications() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.admin_clear_all_applications() TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_reset_yyc_receipt_counter()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'forbidden' USING ERRCODE='42501'; END IF;
  TRUNCATE TABLE public.yyc_receipt_counter;
  INSERT INTO public.yyc_receipt_counter(id, current_no) VALUES (1, 0);
END $$;
REVOKE ALL ON FUNCTION public.admin_reset_yyc_receipt_counter() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.admin_reset_yyc_receipt_counter() TO authenticated;
```

---

## A-5. 보안 최종 잠금 (17장)

**한 번에:** `supabase/sql/applications_rls_lockdown.sql` 전체 Run (13-3 `is_admin()` 선행).

- `list_applications` / `get_application` GRANT 없음 (현재 앱은 REST `applications` + RLS)
- 느슨한 DELETE 정책(`applications_delete_policy.sql`) 은 잠금 후 **불필요** — 있으면 lockdown SQL 이 DROP

---

## A-6. 빠른 점검 쿼리 모음

```sql
-- 신청 건수 / 평형별
SELECT count(*) FROM public.applications;
SELECT unit_type, count(*) FROM public.applications GROUP BY 1 ORDER BY 1;

-- 옵션별 매출 합계 (jsonb 풀어 보기)
SELECT o->>'label' AS option_label,
       sum((o->>'price')::numeric) AS total
FROM public.applications, jsonb_array_elements(selected_options) o
GROUP BY 1 ORDER BY 2 DESC;

-- 등록부 인원
SELECT count(*) FROM public.yyc_resident_registry;

-- 올해 접수번호 일련 (카운터)
SELECT year, seq FROM public.yyc_receipt_counter ORDER BY year;

-- 관리자 명단
SELECT * FROM public.app_admins;

-- (관리자로 로그인 후) 본인 인식되는지
SELECT public.is_admin();
```
