-- =============================================================================
-- 관리자「초기화」용 — public.applications 비우기
-- SECURITY DEFINER 로 RLS 를 우회합니다.
--
-- 일부 환경에서는 DELETE 가 "DELETE requires a WHERE clause" 로 막힙니다.
-- 그 경우 TRUNCATE 는 DELETE 가 아니어서 같은 제약에 걸리지 않는 경우가 많습니다.
--
-- Supabase → SQL Editor 에서 한 번 실행한 뒤, 관리자 화면에서 초기화를 다시 시도하세요.
--
-- 다른 테이블이 applications 를 FK 로 참조하면 TRUNCATE 가 실패할 수 있습니다.
-- 그때는 FK 를 정리하거나, 해당 자식 테이블까지 함께 비우는 정책을 별도로 잡아야 합니다.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.admin_clear_all_applications()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n bigint;
BEGIN
  SELECT COUNT(*)::bigint INTO n FROM public.applications;
  TRUNCATE TABLE public.applications;
  -- 접수번호 일련: next_yyc_receipt_no 가 다시 001부터 나가도록 카운터 비움
  DELETE FROM public.yyc_receipt_counter;
  RETURN COALESCE(n, 0);
END;
$$;

COMMENT ON FUNCTION public.admin_clear_all_applications() IS '관리자 초기화: applications TRUNCATE + yyc_receipt_counter 비우기(접수번호 일련 초기화)';

-- =============================================================================
-- admin_clear_all_applications RPC 가 없는 환경에서 배치 DELETE 만 쓸 때 —
-- 접수번호 카운터만 비우기 (위 RPC에 포함되어 있으면 중복 호출해도 무방)
-- =============================================================================

CREATE OR REPLACE FUNCTION public.admin_reset_yyc_receipt_counter()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.yyc_receipt_counter;
END;
$$;

COMMENT ON FUNCTION public.admin_reset_yyc_receipt_counter() IS '관리자: 접수번호 일련 카운터만 초기화';

REVOKE ALL ON FUNCTION public.admin_reset_yyc_receipt_counter() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_reset_yyc_receipt_counter() TO authenticated;

REVOKE ALL ON FUNCTION public.admin_clear_all_applications() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_clear_all_applications() TO authenticated;
