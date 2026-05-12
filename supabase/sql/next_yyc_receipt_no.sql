-- =============================================================================
-- 접수번호: YYC-{YYYYMMDD(서울)}{일련}  예) YYC-20260511001, YYC-20260511002
--   · 하이픈은 YYC- 뒤 한 번만, 그 다음 8자리 날짜 + 일련(001~999는 3자리 0패딩, 1000↑는 그대로)
--   · 일련 = 해당 연도 기준(자정 넘어가도 이어짐, 해 바뀌면 1부터)
--   · 3자리(001)로 충분한 이유: 본 단지(청량리역 요진 와이시티) 세대수 155세대 — 연간 접수 상한을 999 안으로 두어도 됨
-- Supabase 대시보드 → SQL Editor 에서 한 번 실행하세요.
-- 이후 앱에서 POST /rest/v1/rpc/next_yyc_receipt_no (body: {}) 로 발급합니다.
-- 신청 저장 RPC(submit_application 등)가 payload 의 receipt_no 를 무시하고 예전 규칙으로 다시 만들면, 그 함수도 함께 수정해야 합니다.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.yyc_receipt_counter (
  year smallint PRIMARY KEY,
  seq integer NOT NULL DEFAULT 0 CHECK (seq >= 0)
);

CREATE OR REPLACE FUNCTION public.next_yyc_receipt_no()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  y smallint;
  d date;
  n integer;
BEGIN
  y := (EXTRACT(year FROM (timezone('Asia/Seoul', clock_timestamp()))))::smallint;
  d := (timezone('Asia/Seoul', clock_timestamp()))::date;

  INSERT INTO public.yyc_receipt_counter (year, seq)
  VALUES (y, 1)
  ON CONFLICT (year) DO UPDATE
  SET seq = public.yyc_receipt_counter.seq + 1
  RETURNING seq INTO n;

  RETURN 'YYC-' || to_char(d, 'YYYYMMDD') ||
    CASE WHEN n <= 999 THEN lpad(n::text, 3, '0') ELSE n::text END;
END;
$$;

COMMENT ON FUNCTION public.next_yyc_receipt_no() IS 'YYC-YYYYMMDD001 형식, 연도별 일련';

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.next_yyc_receipt_no() TO anon, authenticated;

ALTER TABLE public.yyc_receipt_counter ENABLE ROW LEVEL SECURITY;

-- 기존 접수와 번호를 이어가려면 (예: 2026년이 이미 47건이었다면):
-- INSERT INTO public.yyc_receipt_counter (year, seq) VALUES (2026, 47)
-- ON CONFLICT (year) DO UPDATE SET seq = EXCLUDED.seq;
