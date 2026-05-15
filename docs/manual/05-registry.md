# 5장. 입주민 등록부 테이블 만들기 (SQL 복붙)

> **이 장에서 완성하는 것**  
> "등록부" 테이블 + 진짜/가짜 입주민 5명 + 검증 함수까지 한 번에.  
> 7장에서 "이 사람 진짜야?" 검증할 때 이 데이터가 쓰입니다.  
>
> **소요 시간**: 약 1.5시간  
> **난이도**: ★★★ (SQL 첫 등장 — 그래도 복붙)

---

## 5-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **SQL** | "엑셀에 'A1 셀에 이거 넣어' 라고 적어주는 메모" |
| **CREATE TABLE** | "새 시트 만들기" |
| **INSERT INTO** | "새 행 추가" |
| **RLS (Row Level Security)** | "이 시트는 비밀번호 가진 사람만 봐" |
| **RPC (함수)** | "엑셀 매크로 — 이름만 부르면 안에서 알아서 처리" |
| **SECURITY DEFINER** | "이 매크로는 만든 사람 권한으로 돈다 (RLS 무시)" |

---

## 5-2. SQL Editor 열기

### (1) Supabase 왼쪽 메뉴 **SQL Editor** 클릭

[스크린샷: 왼쪽 메뉴 — SQL Editor 항목]

### (2) 위쪽 **+ New query** 또는 가운데 빈 칸

[스크린샷: SQL Editor — 새 쿼리 작성 화면]

✅ 가운데에 큰 검은 입력창이 떠 있음.

---

## 5-3. 등록부 테이블 + 검증 함수 한 번에 만들기

아래 SQL **전체를 그대로 복사** → 가운데 큰 칸에 붙여넣기 → 오른쪽 아래 **Run** (또는 `Cmd + Enter`)

```sql
-- 1) 등록부 테이블
CREATE TABLE IF NOT EXISTS public.yyc_resident_registry (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  dong text NOT NULL,
  ho text NOT NULL,
  contractor_name text NOT NULL,
  phone_tail text NOT NULL,
  type_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT yyc_resident_phone_chk CHECK (phone_tail ~ '^[0-9]{4}$'),
  CONSTRAINT yyc_resident_unique UNIQUE (dong, ho, contractor_name, phone_tail)
);

-- 2) RLS 켜고, 직접 SELECT 금지 (RPC 통해서만 조회)
ALTER TABLE public.yyc_resident_registry ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.yyc_resident_registry FROM PUBLIC;

-- 3) 검증 함수 (이름·동호·휴대폰뒤4 다 맞으면 type_key 한 줄 반환)
DROP FUNCTION IF EXISTS public.verify_yyc_resident(text, text, text, text);

CREATE OR REPLACE FUNCTION public.verify_yyc_resident(
  p_dong text,
  p_ho text,
  p_contractor text,
  p_phone_tail text
)
RETURNS TABLE(type_key text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.type_key
  FROM public.yyc_resident_registry r
  WHERE r.dong = regexp_replace(coalesce(p_dong,''), '\D', '', 'g')
    AND r.ho = regexp_replace(coalesce(p_ho,''), '\D', '', 'g')
    AND r.contractor_name = trim(regexp_replace(coalesce(p_contractor,''), '\s+', ' ', 'g'))
    AND r.phone_tail = regexp_replace(coalesce(p_phone_tail,''), '\D', '', 'g')
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.verify_yyc_resident(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_yyc_resident(text, text, text, text) TO anon, authenticated;
```

[스크린샷: SQL Editor — 위 코드 붙여넣고 오른쪽 Run 버튼]

✅ **아래 결과창에 "Success. No rows returned"** 가 뜨면 성공 (테이블·함수가 만들어졌다는 뜻).

⚠️ **빨간 에러가 뜨면**: 메시지 한 줄 그대로 복사 → Cursor 채팅에:

> 🎯 **Cursor에 그대로 복사**  
> ```
> Supabase SQL Editor 에서 이 SQL 돌렸는데 에러 떴어. 원인이랑 고친 SQL 줘.
> [에러 메시지 붙여넣기]
> ```

---

## 5-4. 가짜 입주민 5명 넣기 (테스트용)

새 쿼리 창에 또 복붙 → Run.

```sql
INSERT INTO public.yyc_resident_registry
  (dong, ho, contractor_name, phone_tail, type_key)
VALUES
  ('101', '1504', '임동우', '5604', '59A'),
  ('101', '1101', '홍길동', '0001', '52A'),
  ('102', '203',  '이수민', '1234', '48B'),
  ('102', '901',  '박지훈', '5678', '65A'),
  ('103', '1801', '정수정', '9999', '79')
ON CONFLICT DO NOTHING;
```

[스크린샷: SQL Editor — INSERT 5줄 + Success]

✅ **"Success. 5 rows"** 비슷한 메시지.

### 들어갔는지 눈으로 확인

왼쪽 **Table Editor → `yyc_resident_registry`** 클릭

[스크린샷: Table Editor — 입주민 5줄 표시]

✅ 표에 5줄 보이면 OK.

> 💡 본인 이름·동호로 1줄 추가해 두면 7장 테스트할 때 편함. 위 INSERT 형식 그대로 본인 정보 1줄 더 넣고 Run.

---

## 5-5. 검증 함수가 잘 도는지 SQL로 한 번 시험

```sql
SELECT * FROM public.verify_yyc_resident('101', '1504', '임동우', '5604');
```

✅ `type_key` 칸에 `59A` 한 줄이 떠야 함.  
`SELECT * FROM ...('101','1504','임동우','9999')` 처럼 휴대폰 뒷자리 다르면 → **0 rows** (정상).

[스크린샷: SQL Editor — 검증 함수 호출 결과 1줄]

---

## 5-6. 5장 완료 체크리스트

- [ ] **Table Editor → yyc_resident_registry** 가 보인다
- [ ] 그 안에 입주민 **5줄 이상** 들어 있다
- [ ] 본인 정보로 한 줄 더 넣어 두었다 (선택)
- [ ] `SELECT * FROM verify_yyc_resident(...)` 호출 시 본인 평형이 나온다
- [ ] 일부러 틀린 값으로 호출하면 **0 rows** 나온다

---

## 5-7. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| `relation "yyc_resident_registry" already exists` | 이미 만든 거 또 함 | 정상. 무시 |
| `permission denied` | 보호 모드 | SQL Editor 위쪽 "Read only mode" 끄기 |
| INSERT 했는데 0 rows | UNIQUE 충돌 | 같은 동·호·이름·뒷4가 이미 있음. 정상 |
| 함수 호출에 매번 0 rows | 입력값 공백/한자 | 한글 이름 정확히, 휴대폰 4자리 숫자만 |

---

📌 **다음 장 미리보기**  
6장에서 사이트 첫 화면에 **입력칸 4개 + 다음 버튼**을 만들어 봅니다. AI 시키면 끝.
