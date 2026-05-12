-- =============================================================================
-- (선택·레거시) 생년월일 컬럼 — 현재 앱은 휴대폰 뒷 4자리를 phone 에만 저장합니다.
-- 이미 birth_date 컬럼을 추가해 두었다면 그대로 두어도 됩니다. 없으면 이 스크립트는 생략 가능합니다.
-- =============================================================================

ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS birth_date text;

COMMENT ON COLUMN public.applications.birth_date IS '계약자 생년월일 YYYY-MM-DD';
