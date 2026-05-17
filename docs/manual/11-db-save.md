# 11장. 신청 데이터 인터넷 엑셀(DB)에 진짜 저장

> **이 장에서 완성하는 것**  
> 9장 **`step 2`** 에서 **「신청완료」** 를 누르면:  
> 1. **`next_yyc_receipt_no`** 로 접수번호 발급 (`YYC-20260516001` 형식)  
> 2. **`submit_application`** RPC 로 `applications` 테이블에 1줄 저장  
> 3. 같은 화면에 **초록 접수 배너** + **계약서 미리보기** 팝업  
>
> **개인정보**: 주민번호·이메일·주소는 **받지 않습니다.**  
> 게이트 4항목 + 선택 옵션 + 서명만 저장합니다.  
>
> **소요 시간**: 약 2시간  
> **난이도**: ★★★★ (SQL은 파일 복붙 위주)

---

## 11-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **`applications` 테이블** | "신청서 보관함 — 1줄 = 1신청" |
| **`selected_options` (jsonb)** | "선택한 옵션 목록을 통째로 넣는 칸" |
| **`selected_options_summary`** | "옵션 목록을 한 줄 글로 요약 (관리자·엑셀용)" |
| **`next_yyc_receipt_no`** | "오늘 날짜 기준 일련번호 매기기" |
| **`submit_application(payload)`** | "받은 JSON 그대로 INSERT (합계는 서버가 다시 계산)" |
| **`buildApplicationPayloadFromState`** | "화면 상태 → 저장용 JSON 만드는 함수 (`App.jsx`)" |

### 저장 흐름 (지금 코드)

```
신청완료 클릭
  → fetchNextReceiptNoFromSupabase()     // POST /rpc/next_yyc_receipt_no
  → buildApplicationPayloadFromState() // payload 조립
  → saveApplicationToSupabase()         // POST /rpc/submit_application  body: { payload }
  → 성공 배너 + 계약서 미리보기
```

---

## 11-2. `applications` 테이블 만들기 (처음 1회)

Supabase **SQL Editor → New query** → 아래 실행 → **Run**.

```sql
CREATE TABLE IF NOT EXISTS public.applications (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  receipt_no text UNIQUE NOT NULL,
  customer_name text NOT NULL DEFAULT '미입력',
  phone text NOT NULL DEFAULT '',
  dong text NOT NULL,
  ho text NOT NULL,
  unit_type text NOT NULL,
  selected_options jsonb NOT NULL DEFAULT '[]'::jsonb,
  selected_options_summary text,
  total_price numeric NOT NULL DEFAULT 0,
  signature_data_url text NOT NULL DEFAULT '',
  printed boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT '접수됨',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.applications FROM PUBLIC;
```

✅ Table Editor → `applications` 테이블이 보이면 성공.

> **예전 교재 스키마**(`resident_id_first6`, `email`, `options`, `total_amount` …) 로 이미 만들어 둔 DB라면 아래 **11-2-1** 을 쓰세요.  
> 테스트 DB만 비워도 되면: **`supabase/sql/applications_create_table.sql`** 만 실행해도 됩니다.

### 11-2-1. 옛 DB → 지금 스키마로 맞추기 (운영 데이터 있을 때)

1. (권장) Table Editor → `applications` → Export 백업  
2. SQL Editor에서 **`supabase/sql/applications_migrate_to_current_schema.sql`** 전체 **Run**  
3. 이어서 **11-3** (`next_yyc_receipt_no.sql` → `submit_application.sql`)

✅ Table Editor 칼럼에 `selected_options`, `total_price`, `status` 등이 보이고  
`resident_id_first6`, `email` 등은 사라지면 성공.

### (선택) 같은 동·호 중복 막기

운영 정책상 **1세대 1접수**만 허용할 때:

```sql
ALTER TABLE public.applications
  ADD CONSTRAINT applications_unique_per_unit UNIQUE (dong, ho);
```

> 현재 `submit_application.sql` 은 RPC 안에서 중복 검사를 **하지 않습니다.**  
> 위 제약이 있으면 두 번째 INSERT 시 DB 오류 → 앱에는 일반 실패 메시지로 보입니다.

---

## 11-3. 접수번호 + 저장 RPC SQL 파일 실행

레포에 있는 SQL을 **통째로** Supabase에서 실행합니다. (교재에 긴 SQL 다시 적지 않음)

### (1) 접수번호

1. Cursor에서 파일 열기: **`supabase/sql/next_yyc_receipt_no.sql`**
2. 전체 복사 → SQL Editor → **Run**

✅ `yyc_receipt_counter` 테이블 + `next_yyc_receipt_no()` 함수 생성.

테스트:

```sql
SELECT public.next_yyc_receipt_no();
-- 예: YYC-20260516001
```

### (2) 신청 저장 RPC

1. 파일: **`supabase/sql/submit_application.sql`**
2. 전체 복사 → SQL Editor → **Run**

✅ `submit_application(payload jsonb)` — **반환값 void** (접수번호는 앱이 미리 넣은 `payload.receipt_no` 사용).

> ⚠️ 인자 이름은 **`payload`** 입니다. `{ p: ... }` 가 아닙니다.

---

## 11-4. 앱이 보내는 `payload` 모양 (확인용)

`App.jsx` 의 `buildApplicationPayloadFromState` 가 만드는 JSON:

```json
{
  "receipt_no": "YYC-20260516001",
  "customer_name": "홍길동",
  "phone": "5604",
  "dong": "101",
  "ho": "1504",
  "unit_type": "59㎡A",
  "selected_options": [
    {
      "option_id": "kitchen",
      "option_key": "kitchen|주방 마감 및 가구 특화|...",
      "category": "주방 마감 및 가구 특화",
      "label": "...",
      "price": 4500000
    }
  ],
  "total_price": 4500000,
  "signature_data_url": "data:image/png;base64,...",
  "printed": true,
  "status": "접수됨"
}
```

| 필드 | 의미 |
|------|------|
| `phone` | **휴대폰 뒷 4자리** (전화번호 전체 아님) |
| `unit_type` | 화면 표시 평형명 (`59㎡A`) |
| `total_price` | 화면 합계 (DB에는 **옵션 price 합**으로 다시 계산해 저장) |

---

## 11-5. `App.jsx` 연결 확인 🎯

이미 들어 있으면 **읽기만** 하세요.

> 🎯 **처음부터 붙일 때 Cursor에 복사**  
> ```
> @App.jsx
> - onSubmitComplete (신청완료):
>   1) fetchNextReceiptNoFromSupabase() → receiptNo
>   2) buildApplicationPayloadFromState({ dong, ho, contractor, phoneLast4, unitType: typeData.name, selectedList, total, signData, receiptNo })
>   3) POST /rest/v1/rpc/submit_application  body: JSON.stringify({ payload })
>   4) 성공: submitResult ok 배너 + setContractPreviewOpen(true)
>   5) 실패: submitResult err + noticeModal
> - submitting 중 버튼 「제출 중...」, !signData 이면 disabled
> step 은 2 유지 (별도 step 'done' 없음). Apply.
> ```

---

## 11-6. 끝부터 끝까지 시험

```bash
cd /Users/dongwoolim/yyc-options
npm run dev
```

`step 0` → 입주민 통과 → `step 1` 옵션 선택 → `step 2` 서명 완료 → **신청완료**

| 시험 | 기대 |
|------|------|
| 정상 제출 | 초록 배너 + **계약서 미리보기** 팝업 |
| Table Editor | `receipt_no`, `dong`, `ho`, `selected_options`, `signature_data_url` 1줄 |
| 접수번호 형식 | `YYC-YYYYMMDD` + 3자리 일련 (예: `YYC-20260516001`) |
| 같은 호 재제출 | (UNIQUE dong,ho 넣었으면) 실패 메시지 |
| RPC 없음 | 빨간 배너 + 모달에 SQL 실행 안내 문구 |

[스크린샷: submit-banner--ok + Table Editor applications 1행]

✅ OK면 **MVP 핵심(신청→DB) 완성**.

---

## 11-7. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| `function next_yyc_receipt_no does not exist` | 11-3 (1) 미실행 | `next_yyc_receipt_no.sql` Run |
| `function submit_application does not exist` | 11-3 (2) 미실행 | `submit_application.sql` Run |
| `column "selected_options" does not exist` | 예전 테이블 스키마 | 11-2 마이그레이션 또는 새 테이블 |
| `Invalid API key` | `.env.local` / GitHub Secrets | URL·anon key 재입력, dev 재시작 |
| 접수번호 예전 형식 `YYC-2026-0001` | 옛 RPC | `next_yyc_receipt_no.sql` 다시 Run |
| `null value in column "resident_id_first6"` | 옛 테이블 + 새 앱 | 11-2 스키마로 맞추기 |
| 제출은 됐는데 합계가 0 | `selected_options` 비어 있음 | 정상(미선택형). price 숫자인지 확인 |

---

## 11-8. 11장 완료 체크리스트

- [ ] `applications` 테이블이 **지금 payload** 칼럼과 같다
- [ ] `next_yyc_receipt_no.sql` · `submit_application.sql` 실행 완료
- [ ] 테스트 신청 1건 → Table Editor에 1줄
- [ ] 접수번호 `YYC-YYYYMMDD001` 형식
- [ ] 신청 후 초록 배너 + 계약서 미리보기
- [ ] **새로 작성** 으로 `step 0` 복귀 가능

---

## 11-9. 보안 메모

- `applications` 는 **RLS ON + anon 직접 SELECT 금지** (13·17장에서 관리자만 조회).  
- 신청자는 **RPC 2개**(`next_yyc_receipt_no`, `submit_application`)만 호출.  
- 서명·개인정보는 DB에 들어가므로 Console `console.log(payload)` 남기지 않기.

---

📌 **다음 장 미리보기**  
12장: 위 INSERT 가 일어날 때 Webhook → `append-workbook-row` 가 Storage 피벗 엑셀(`selected_options` 열 펼침)에 **한 줄 추가**.
