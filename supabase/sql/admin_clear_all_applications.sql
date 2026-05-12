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
  RETURN COALESCE(n, 0);
END;
$$;

COMMENT ON FUNCTION public.admin_clear_all_applications() IS '관리자 초기화: applications 전체 비우기(TRUNCATE)';

REVOKE ALL ON FUNCTION public.admin_clear_all_applications() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_clear_all_applications() TO authenticated;
