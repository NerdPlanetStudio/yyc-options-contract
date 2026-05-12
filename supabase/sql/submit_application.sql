-- =============================================================================
-- 신청 저장 RPC — 앱이 POST /rest/v1/rpc/submit_application body: {"payload":{...}} 로 호출
-- payload 의 phone 에 휴대폰 뒷 4자리 등 저장 (앱과 동일 키).
--
-- 순서: 이 파일 전체를 SQL Editor 에서 실행 (기존 함수가 있으면 DROP 후 재생성)
-- PostgreSQL 은 반환 타입이 다른 함수를 CREATE OR REPLACE 로 갈아끼울 수 없습니다.
-- 기존 submit_application 이 jsonb·uuid 등 void 가 아니면 아래 DROP 이 필요합니다.
-- (다른 객체가 이 함수에 의존하면 DROP … CASCADE 가 필요할 수 있습니다. 그때는 대시보드에서 의존성 확인.)
-- =============================================================================

DROP FUNCTION IF EXISTS public.submit_application(jsonb);

CREATE FUNCTION public.submit_application(payload jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.applications (
    receipt_no,
    customer_name,
    phone,
    dong,
    ho,
    unit_type,
    selected_options,
    total_price,
    signature_data_url,
    printed,
    status
  )
  VALUES (
    payload->>'receipt_no',
    COALESCE(NULLIF(TRIM(payload->>'customer_name'), ''), '미입력'),
    COALESCE(NULLIF(TRIM(payload->>'phone'), ''), ''),
    COALESCE(NULLIF(TRIM(payload->>'dong'), ''), ''),
    COALESCE(NULLIF(TRIM(payload->>'ho'), ''), ''),
    COALESCE(NULLIF(TRIM(payload->>'unit_type'), ''), '미입력'),
    COALESCE(payload->'selected_options', '[]'::jsonb),
    COALESCE((payload->>'total_price')::numeric, 0),
    COALESCE(payload->>'signature_data_url', ''),
    COALESCE((payload->>'printed')::boolean, true),
    COALESCE(NULLIF(TRIM(payload->>'status'), ''), '접수됨')
  );
END;
$$;

COMMENT ON FUNCTION public.submit_application(jsonb) IS '옵션 신청 저장 (phone 등 payload)';

REVOKE ALL ON FUNCTION public.submit_application(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_application(jsonb) TO anon, authenticated;
