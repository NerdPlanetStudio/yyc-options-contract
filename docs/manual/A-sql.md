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

## A-2. 신청서 + 접수번호 카운터 + RPC (11장)

```sql
CREATE TABLE IF NOT EXISTS public.applications (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  receipt_no text UNIQUE,
  customer_name text NOT NULL,
  dong text NOT NULL,
  ho text NOT NULL,
  unit_type text NOT NULL,
  resident_id_first6 text NOT NULL CHECK (resident_id_first6 ~ '^[0-9]{6}$'),
  phone text NOT NULL,
  email text NOT NULL,
  address text NOT NULL,
  emergency_name text,
  emergency_phone text,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_amount integer NOT NULL DEFAULT 0,
  signature_data_url text NOT NULL,
  admin_memo text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT applications_unique_per_unit UNIQUE (dong, ho)
);

CREATE TABLE IF NOT EXISTS public.yyc_receipt_counter (
  id int PRIMARY KEY DEFAULT 1,
  current_no int NOT NULL DEFAULT 0,
  CHECK (id = 1)
);
INSERT INTO public.yyc_receipt_counter(id, current_no) VALUES (1, 0)
ON CONFLICT DO NOTHING;
ALTER TABLE public.yyc_receipt_counter DISABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.next_yyc_receipt_no()
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_next int;
BEGIN
  UPDATE public.yyc_receipt_counter
     SET current_no = current_no + 1
   WHERE id = 1
   RETURNING current_no INTO v_next;
  RETURN 'YYC-' || to_char(now() AT TIME ZONE 'Asia/Seoul', 'YYYY')
              || '-' || lpad(v_next::text, 4, '0');
END $$;
REVOKE ALL ON FUNCTION public.next_yyc_receipt_no() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.next_yyc_receipt_no() TO anon, authenticated;

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.applications FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.submit_application(p jsonb)
RETURNS TABLE(receipt_no text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_dong text := regexp_replace(coalesce(p->>'dong',''), '\D','','g');
  v_ho   text := regexp_replace(coalesce(p->>'ho',''),   '\D','','g');
  v_receipt text;
BEGIN
  IF EXISTS (SELECT 1 FROM public.applications WHERE dong = v_dong AND ho = v_ho) THEN
    RAISE EXCEPTION 'duplicate_application' USING ERRCODE = 'P0001';
  END IF;
  v_receipt := public.next_yyc_receipt_no();
  INSERT INTO public.applications(
    receipt_no, customer_name, dong, ho, unit_type,
    resident_id_first6, phone, email, address,
    emergency_name, emergency_phone,
    options, total_amount, signature_data_url, admin_memo
  ) VALUES (
    v_receipt,
    trim(p->>'customer_name'),
    v_dong, v_ho,
    p->>'unit_type',
    p->>'resident_id_first6',
    p->>'phone',
    lower(trim(p->>'email')),
    p->>'address',
    nullif(trim(coalesce(p->>'emergency_name','')), ''),
    nullif(trim(coalesce(p->>'emergency_phone','')), ''),
    coalesce(p->'options', '[]'::jsonb),
    coalesce((p->>'total_amount')::int, 0),
    p->>'signature_data_url',
    nullif(trim(coalesce(p->>'admin_memo','')), '')
  );
  RETURN QUERY SELECT v_receipt;
END $$;
REVOKE ALL ON FUNCTION public.submit_application(jsonb) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.submit_application(jsonb) TO anon, authenticated;
```

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

```sql
REVOKE ALL ON public.applications           FROM anon, authenticated;
REVOKE ALL ON public.yyc_resident_registry  FROM anon, authenticated;
REVOKE ALL ON public.yyc_receipt_counter    FROM anon, authenticated;
REVOKE ALL ON public.app_admins             FROM anon, authenticated;

ALTER TABLE public.applications          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yyc_resident_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_admins            ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS applications_select_admin ON public.applications;
DROP POLICY IF EXISTS applications_modify_admin ON public.applications;
DROP POLICY IF EXISTS registry_admin_only       ON public.yyc_resident_registry;
DROP POLICY IF EXISTS admins_select_admin       ON public.app_admins;

CREATE POLICY applications_select_admin
  ON public.applications FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY applications_modify_admin
  ON public.applications FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY registry_admin_only
  ON public.yyc_resident_registry FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY admins_select_admin
  ON public.app_admins FOR SELECT TO authenticated
  USING (public.is_admin());

GRANT EXECUTE ON FUNCTION public.verify_yyc_resident(text,text,text,text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_application(jsonb)                TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.next_yyc_receipt_no()                    TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin()                               TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_applications()                      TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_application(bigint)                  TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_clear_all_applications()           TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_reset_yyc_receipt_counter()        TO authenticated;
```

---

## A-6. 빠른 점검 쿼리 모음

```sql
-- 신청 건수 / 평형별
SELECT count(*) FROM public.applications;
SELECT unit_type, count(*) FROM public.applications GROUP BY 1 ORDER BY 1;

-- 옵션별 매출 합계 (jsonb 풀어 보기)
SELECT o->>'label' AS option_label,
       sum((o->>'price')::int) AS total
FROM public.applications, jsonb_array_elements(options) o
GROUP BY 1 ORDER BY 2 DESC;

-- 등록부 인원
SELECT count(*) FROM public.yyc_resident_registry;

-- 현재 접수번호
SELECT current_no FROM public.yyc_receipt_counter WHERE id = 1;

-- 관리자 명단
SELECT * FROM public.app_admins;

-- (관리자로 로그인 후) 본인 인식되는지
SELECT public.is_admin();
```
