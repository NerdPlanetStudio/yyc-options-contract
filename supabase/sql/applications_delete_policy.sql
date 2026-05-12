-- =============================================================================
-- (선택) REST 로만 삭제할 때 — authenticated 에게 applications DELETE 가 필요합니다.
-- 실제 초기화는 admin_clear_all_applications.sql 의 RPC 를 쓰는 것을 권장합니다.
-- RLS 가 이미 켜져 있는데 DELETE 정책이 없을 때만 아래를 실행하세요.
-- Supabase → SQL Editor
-- =============================================================================

-- 동일 이름 정책이 있으면 먼저 DROP 후 다시 생성하세요.
DROP POLICY IF EXISTS "authenticated can delete applications" ON public.applications;

CREATE POLICY "authenticated can delete applications"
  ON public.applications
  FOR DELETE
  TO authenticated
  USING (true);
