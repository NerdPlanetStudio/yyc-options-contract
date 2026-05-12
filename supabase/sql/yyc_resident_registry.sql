-- =============================================================================
-- 입주민 세대 등록부 + 검증 RPC (GitHub Pages 등 공개 배포에서 로컬 JSON 없이 검증)
--
-- 1) 이 파일 전체를 Supabase → SQL Editor 에서 실행
-- 2) 로컬에 src/data/allowedResidents.json 이 있으면:
--      npm run db:residents-sql > /tmp/seed.sql
--    생성된 INSERT 를 SQL Editor 에서 실행 (또는 일부만 붙여넣기)
-- =============================================================================

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

COMMENT ON TABLE public.yyc_resident_registry IS '옵션 게이트 동·호·계약자·휴대폰 뒤4자리·평형(type_key) 검증용';

ALTER TABLE public.yyc_resident_registry ENABLE ROW LEVEL SECURITY;

-- 직접 SELECT 금지 — RPC(SECURITY DEFINER)만 조회
REVOKE ALL ON public.yyc_resident_registry FROM PUBLIC;

DROP FUNCTION IF EXISTS public.verify_yyc_resident(text, text, text, text);

CREATE OR REPLACE FUNCTION public.verify_yyc_resident(
  p_dong text,
  p_ho text,
  p_contractor text,
  p_phone_tail text
)
RETURNS TABLE(type_key text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH q AS (
    SELECT
      regexp_replace(coalesce(p_dong, ''), '\D', '', 'g') AS dong,
      regexp_replace(coalesce(p_ho, ''), '\D', '', 'g') AS ho,
      trim(regexp_replace(coalesce(p_contractor, ''), '\s+', ' ', 'g')) AS contractor_name,
      (regexp_replace(coalesce(p_phone_tail, ''), '\D', '', 'g')) AS phone_tail
  )
  SELECT r.type_key::text
  FROM public.yyc_resident_registry r
  CROSS JOIN q
  WHERE r.dong = q.dong
    AND r.ho = q.ho
    AND r.contractor_name = q.contractor_name
    AND r.phone_tail = q.phone_tail
    AND length(q.dong) > 0
    AND length(q.ho) > 0
    AND length(q.contractor_name) > 0
    AND length(q.phone_tail) = 4
  LIMIT 1;
$$;

COMMENT ON FUNCTION public.verify_yyc_resident(text, text, text, text) IS '게이트: 네 값이 등록부와 일치하면 type_key 한 행, 없으면 빈 결과';

REVOKE ALL ON FUNCTION public.verify_yyc_resident(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_yyc_resident(text, text, text, text) TO anon, authenticated;
