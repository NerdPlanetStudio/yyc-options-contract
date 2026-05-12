-- =============================================================================
-- 신청 저장 RPC — 앱이 POST /rest/v1/rpc/submit_application body: {"payload":{...}} 로 호출
-- payload 의 phone 에 휴대폰 뒷 4자리 등 저장 (앱과 동일 키).
--
-- · selected_options(jsonb) 기준으로 total_price 를 서버에서 재계산해 저장합니다.
-- · selected_options_summary(text) 에 읽기 쉬운 한 줄 요약을 함께 저장합니다(표/CSV용).
--
-- 순서: 이 파일 전체를 SQL Editor 에서 실행 (기존 함수가 있으면 DROP 후 재생성)
-- PostgreSQL 은 반환 타입이 다른 함수를 CREATE OR REPLACE 로 갈아끼울 수 없습니다.
-- 기존 submit_application 이 jsonb·uuid 등 void 가 아니면 아래 DROP 이 필요합니다.
-- =============================================================================

ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS selected_options_summary text;

COMMENT ON COLUMN public.applications.selected_options_summary IS '선택 옵션을 한 줄로 요약(카테고리: 라벨 (금액원) | …)';

DROP FUNCTION IF EXISTS public.submit_application(jsonb);

CREATE FUNCTION public.submit_application(payload jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total numeric := 0;
  v_summary text := '';
  elem jsonb;
  v_price text;
  v_num numeric;
  v_cat text;
  v_lab text;
BEGIN
  FOR elem IN
    SELECT value
    FROM jsonb_array_elements(COALESCE(payload->'selected_options', '[]'::jsonb)) AS t(value)
  LOOP
    v_price := trim(COALESCE(elem->>'price', ''));
    IF v_price ~ '^-?[0-9]+(\.[0-9]+)?$' THEN
      v_num := v_price::numeric;
    ELSE
      v_num := 0;
    END IF;
    v_total := v_total + COALESCE(v_num, 0);

    v_cat := trim(COALESCE(elem->>'category', ''));
    v_lab := trim(COALESCE(NULLIF(elem->>'label', ''), NULLIF(elem->>'name', ''), '-'));

    IF v_summary <> '' THEN
      v_summary := v_summary || ' | ';
    END IF;

    IF v_cat <> '' THEN
      v_summary := v_summary || v_cat || ': ' || v_lab || ' (' || COALESCE(elem->>'price', '0') || '원)';
    ELSE
      v_summary := v_summary || v_lab || ' (' || COALESCE(elem->>'price', '0') || '원)';
    END IF;
  END LOOP;

  INSERT INTO public.applications (
    receipt_no,
    customer_name,
    phone,
    dong,
    ho,
    unit_type,
    selected_options,
    selected_options_summary,
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
    NULLIF(v_summary, ''),
    v_total,
    COALESCE(payload->>'signature_data_url', ''),
    COALESCE((payload->>'printed')::boolean, true),
    COALESCE(NULLIF(TRIM(payload->>'status'), ''), '접수됨')
  );
END;
$$;

COMMENT ON FUNCTION public.submit_application(jsonb) IS '옵션 신청 저장 — total_price 는 selected_options 의 price 합으로 서버 계산';

REVOKE ALL ON FUNCTION public.submit_application(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_application(jsonb) TO anon, authenticated;
