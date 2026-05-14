-- =============================================================================
-- 옵션 신청 → Storage 엑셀 누적용 버킷 (Edge append-workbook-row 와 이름 맞출 것)
-- Dashboard → Storage 에서 만들어도 됩니다. SQL 로 한 번에 만들 때만 실행.
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'application-workbook',
  'application-workbook',
  true,
  52428800,
  ARRAY['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 공개 버킷: 누적 엑셀 URL(VITE_LIVE_WORKBOOK_URL)로 누구나 읽기 가능 → 개인정보 주의
-- 비공개로 두려면 public = false 로 바꾸고, 관리자 다운로드는 서명 URL 등 별도 구현 필요
