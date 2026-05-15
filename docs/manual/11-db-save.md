# 11장. 신청 데이터 인터넷 엑셀(DB)에 진짜 저장

> **이 장에서 완성하는 것**  
> 10장의 "제출" 누르면 → Supabase **applications** 테이블에 한 줄 저장.  
> 같은 동·호의 중복 신청은 거부.  
> 성공 시 **접수번호** 가 발급되고 "접수 완료" 화면으로 이동.  
>
> **소요 시간**: 약 2.5시간  
> **난이도**: ★★★★ (지금까지 중 가장 큼 — 그래도 SQL은 복붙)

---

## 11-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **applications 테이블** | "신청서 보관함 — 1줄 = 1신청" |
| **JSONB 칼럼** | "엑셀 셀 안에 작은 표를 그대로 넣을 수 있는 칸 (옵션 목록)" |
| **접수번호 (receipt_no)** | "올해의 N번째 신청이라는 카운터" |
| **submit_application RPC** | "1) 중복 검사 2) 접수번호 발급 3) 행 저장 — 한 매크로로" |
| **NOT NULL / CHECK** | "이 칸은 비면 안 됨 / 이 패턴이어야 함" |

---

## 11-2. SQL 한 번에 복붙 (테이블 + 카운터 + RPC)

Supabase **SQL Editor → New query** → 아래 전체 복붙 → **Run**.

```sql
-- 1) 신청서 테이블
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

-- 2) 접수번호 카운터
CREATE TABLE IF NOT EXISTS public.yyc_receipt_counter (
  id int PRIMARY KEY DEFAULT 1,
  current_no int NOT NULL DEFAULT 0,
  CHECK (id = 1)
);
INSERT INTO public.yyc_receipt_counter (id, current_no)
VALUES (1, 0) ON CONFLICT DO NOTHING;
ALTER TABLE public.yyc_receipt_counter DISABLE ROW LEVEL SECURITY;

-- 3) 다음 접수번호 발급 함수
CREATE OR REPLACE FUNCTION public.next_yyc_receipt_no()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_next int;
BEGIN
  UPDATE public.yyc_receipt_counter
     SET current_no = current_no + 1
   WHERE id = 1
   RETURNING current_no INTO v_next;
  RETURN 'YYC-' || to_char(now() AT TIME ZONE 'Asia/Seoul', 'YYYY')
              || '-' || lpad(v_next::text, 4, '0');
END;
$$;
REVOKE ALL ON FUNCTION public.next_yyc_receipt_no() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.next_yyc_receipt_no() TO anon, authenticated;

-- 4) RLS: 외부에서 직접 SELECT/INSERT 금지 (RPC만 허용)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.applications FROM PUBLIC;

-- 5) 한 번에 처리하는 submit_application RPC
DROP FUNCTION IF EXISTS public.submit_application(jsonb);

CREATE OR REPLACE FUNCTION public.submit_application(p jsonb)
RETURNS TABLE(receipt_no text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_dong text := regexp_replace(coalesce(p->>'dong',''), '\D', '', 'g');
  v_ho   text := regexp_replace(coalesce(p->>'ho',''),   '\D', '', 'g');
  v_receipt text;
BEGIN
  -- 중복 신청 차단
  IF EXISTS (SELECT 1 FROM public.applications WHERE dong = v_dong AND ho = v_ho) THEN
    RAISE EXCEPTION 'duplicate_application' USING ERRCODE = 'P0001';
  END IF;

  -- 접수번호 발급
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
END;
$$;
REVOKE ALL ON FUNCTION public.submit_application(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_application(jsonb) TO anon, authenticated;
```

✅ **Success. No rows returned** 메시지 확인.

⚠️ 빨간 에러면 메시지를 그대로 Cursor 채팅에 붙이면서:
> 🎯 **Cursor에 그대로 복사**  
> ```
> Supabase SQL Editor에서 위 SQL 돌렸는데 이 에러 떴어. 어디가 문제고 어떻게 고쳐?
> [에러 메시지 붙여넣기]
> ```

---

## 11-3. AI에게 "제출" 진짜 일하게 시키기 🎯

> 🎯 **Cursor에 그대로 복사**  
> ```
> @App.jsx step === 'sign' 의 "제출" 버튼 onClick 을 다음처럼 바꿔줘.
>
> 1) 새 상태:
>    - const [submitting, setSubmitting] = useState(false)
>    - const [submitError, setSubmitError] = useState('')
>    - const [receiptNo, setReceiptNo] = useState('')
>
> 2) 클릭 시:
>    - setSubmitting(true), setSubmitError('')
>    - selectedOptions = OPTIONS_CATALOG[verifiedTypeKey].filter(o => selected[o.key])
>      .map(o => ({ key: o.key, label: o.label, price: o.price }))
>    - totalAmount = selectedOptions.reduce((s,o)=>s+o.price,0)
>    - payload = {
>        customer_name, dong, ho, unit_type: verifiedTypeKey,
>        resident_id_first6, phone, email, address,
>        emergency_name, emergency_phone,
>        options: selectedOptions, total_amount: totalAmount,
>        signature_data_url: signature, admin_memo
>      }
>    - const { data, error } = await supabase.rpc('submit_application', { p: payload })
>    - error 가 있으면:
>        message = error.message || ''
>        if message.includes('duplicate_application')
>          → setSubmitError('이미 같은 동·호로 접수된 신청서가 있습니다. 관리자에게 문의해 주세요.')
>        else if message.includes('check') 또는 RLS 관련
>          → setSubmitError('입력값에 문제가 있습니다. 다시 확인해 주세요.')
>        else
>          → setSubmitError('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
>    - 성공이면 setReceiptNo(data[0].receipt_no), setStep('done')
>    - finally setSubmitting(false)
>
> 3) submitting 중이면 제출 버튼 텍스트 "제출 중..."
>    submitError 가 있으면 제출 버튼 위에 빨간 글씨
>
> 4) step === 'done' 화면:
>    - 큰 체크 아이콘 + "접수가 완료되었습니다"
>    - 접수번호: {receiptNo}  (복사 버튼 작게)
>    - "처음으로" 버튼 → 모든 state 초기화 후 setStep('verify')
>
> 변경 후 Apply.
> ```

---

## 11-4. 끝부터 끝까지 시험

브라우저 새로고침 → 6 → 7 → 8 → 9 → 10 → **제출**.

[스크린샷: "접수가 완료되었습니다 — 접수번호 YYC-2026-0001"]

| 시험 | 기대 |
|------|------|
| 정상 흐름 | 접수번호 1개 발급 + done 화면 |
| **같은 동·호로** 다시 시도 | 빨간 글씨 "이미 같은 동·호로 접수…" |
| 인터넷 끄고 제출 | "일시적인 오류…" |
| Supabase **Table Editor → applications** 확인 | 방금 보낸 1줄 그대로 (서명은 긴 dataURL) |

✅ 다 OK면 11장 통과 — **MVP 핵심 흐름 완성**.

---

## 11-5. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| `permission denied for function submit_application` | GRANT 안 됨 | 위 SQL 끝의 GRANT 줄 다시 Run |
| `null value in column "..."` | 폼에서 빈 값 보냄 | 9장 검증 다시 점검 |
| `duplicate key value violates unique constraint` | 같은 호 + applications_unique_per_unit | 정상. 안내문대로 |
| Console에 거대한 base64가 두 번 출력 | 디버그 로그 남음 | console.log 지움 |
| `function ... does not exist` | RPC 인자 타입 다름 | 클라에서 `{ p: payload }` 그대로 보냈는지 확인 |

---

## 11-6. 11장 완료 체크리스트

- [ ] `applications`, `yyc_receipt_counter` 테이블이 생겼다
- [ ] `submit_application(p jsonb)` RPC 가 있다
- [ ] 처음 신청 → 접수번호 `YYC-2026-0001`
- [ ] 같은 동·호 재시도 → 빨간 안내
- [ ] Table Editor 에서 신청 1줄이 보인다
- [ ] 처음으로 → 빈 입력 화면으로 정상 복귀

---

## 11-7. 보안 메모

- `applications` 테이블은 **RLS ON + 직접 SELECT 금지**.  
  외부 사람이 anon 키만 가지고는 1줄도 못 봅니다.  
- 화면에 입력한 값은 모두 `submit_application` 매크로 1개로만 들어감.  
- 다음 장(12)에서 **자동 누적 엑셀**까지 켜고 나면, **17장**에서 RLS·관리자 권한을 다시 한 번 단단히 잠급니다.

---

📌 **다음 장 미리보기**  
12장에서 한 줄 신청이 들어올 때마다 **Storage 의 엑셀 파일에 자동으로 한 줄씩 누적**되도록 만듭니다.  
Supabase **Edge Function + Database Webhook** 두 개를 처음 만져봅니다 — 그래도 복붙·클릭 위주.
