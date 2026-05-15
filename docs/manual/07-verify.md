# 7장. "다음" 누르면 진짜 입주민인지 확인하기

> **이 장에서 완성하는 것**  
> 6장에서 만든 **다음** 버튼이 일하게 됩니다.  
> 누르면 5장에서 만든 **`verify_yyc_resident`** 함수가 돌고,  
> 통과면 → 다음 화면(평형 표시),  
> 실패면 → "등록되지 않은 정보입니다" 빨간 메시지.  
>
> **소요 시간**: 약 1.5시간  
> **난이도**: ★★★ (Supabase ↔ 화면 첫 연결)

---

## 7-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **Supabase Client** | "내 사이트가 인터넷 엑셀에 전화 걸 때 쓰는 전화기" |
| **rpc('함수명', { 인자 })** | "5장에서 만든 매크로를 이름으로 부르기" |
| **async / await** | "전화 걸고 답 올 때까지 기다림" |
| **try / catch** | "전화 끊기거나 에러 나면 잡아서 메시지 띄우기" |

---

## 7-2. Supabase 전화기 설치

Cursor 터미널:

```bash
npm install @supabase/supabase-js
```

✅ 끝나면 빨간 글자 없이 새 줄.

---

## 7-3. URL·열쇠 환경변수에 적기

루트(`yyc-options/`)에 **`.env.local`** 파일을 만들고 4장에서 메모해 둔 값을 넣습니다.

> Cursor 왼쪽 파일 트리 빈 곳 우클릭 → New File → `.env.local`

```
VITE_SUPABASE_URL=https://abcd1234.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...본인거...
```

[스크린샷: .env.local 파일에 두 줄]

⚠️ **이 파일은 Git에 올라가면 안 됨.** Cursor가 자동으로 `.gitignore`에 넣어주지만, 직접 확인:

`.gitignore` 안에 `.env.local` 한 줄이 있는지 보고 없으면 추가.

> 💡 **수정한 .env.local 은 `npm run dev` 다시 켜야 적용됨.** Ctrl+C → 다시 `npm run dev`.

---

## 7-4. AI에게 "다음 버튼 일 시키기" 🎯

> 🎯 **Cursor에 그대로 복사**  
> ```
> @App.jsx 에 다음 변경을 적용해줘.
>
> 1) 파일 맨 위에 Supabase 클라이언트 1개 만들기
>    - import { createClient } from '@supabase/supabase-js'
>    - const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
>
> 2) 상태 추가
>    - const [loading, setLoading] = useState(false)
>    - const [errorMsg, setErrorMsg] = useState('')
>    - const [verifiedTypeKey, setVerifiedTypeKey] = useState('')
>
> 3) 다음 버튼 onClick 동작:
>    - setLoading(true), setErrorMsg('')
>    - 입력값 정규화: 동·호는 숫자만, 이름은 trim·연속공백 1칸, 휴대폰은 숫자 4자리
>    - supabase.rpc('verify_yyc_resident', {
>        p_dong: 동, p_ho: 호, p_contractor: 이름, p_phone_tail: 뒤4
>      })
>    - 결과 data가 1줄 이상이면 setVerifiedTypeKey(data[0].type_key)
>    - 0줄이면 setErrorMsg('등록되지 않은 정보입니다. 동·호·계약자명·휴대폰 뒤 4자리를 다시 확인해 주세요.')
>    - error 가 있으면 setErrorMsg('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
>    - finally setLoading(false)
>
> 4) 화면 추가:
>    - 다음 버튼 위에 errorMsg 가 있으면 빨간 글씨로 보이기
>    - loading 중이면 다음 버튼 텍스트가 "확인 중..." 으로
>    - verifiedTypeKey 가 채워지면 카드 아래 초록 박스로
>      "확인 완료 — 평형: {verifiedTypeKey}" 표시 (다음 장에서 진짜 화면으로 교체)
>
> 변경 후 Apply.
> ```

---

## 7-5. 브라우저에서 확인

새로고침 → 4칸 입력 → **다음** 클릭.

| 입력 | 기대 결과 |
|------|----------|
| 등록부에 있는 사람 (예: 101 / 1504 / 임동우 / 5604) | 초록 박스 "확인 완료 — 평형: 59A" |
| 한 칸이라도 틀림 | 빨간 글씨 "등록되지 않은 정보입니다" |
| 휴대폰에 3자리만 | 다음 버튼 회색 (6장에서 막아둠) |
| 인터넷 끄고 시도 | 빨간 글씨 "일시적인 오류…" |

[스크린샷: 통과 — 초록 박스 / 실패 — 빨간 글씨 두 컷]

✅ 두 경우 다 동작하면 7장 통과.

---

## 7-6. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| Console에 `Invalid API key` | `.env.local` 키 오타 | 4장에서 다시 복사. dev 서버 재시작 |
| `function verify_yyc_resident does not exist` | 5장 SQL 안 돌렸음 | SQL Editor 다시 Run |
| 항상 "등록되지 않은…" | 입력값에 공백/한자 | 정규화 코드 들어갔는지 확인. 등록부 데이터도 확인 |
| CORS 에러 | URL 끝에 `/` 붙임 | `.env.local`의 URL은 `.co` 까지만 |
| 환경변수 undefined | dev 안 껐다 켰음 | Ctrl+C → `npm run dev` |

---

## 7-7. 7장 완료 체크리스트

- [ ] `.env.local` 에 URL·anon key 들어 있다
- [ ] `.gitignore`에 `.env.local` 들어 있다
- [ ] 통과 케이스 → 초록 박스 + 평형 표시
- [ ] 실패 케이스 → 빨간 메시지
- [ ] 통신 중 → 버튼이 "확인 중…"
- [ ] Console에 키 노출되는 에러 없음

---

📌 **다음 장 미리보기**  
8장에선 그 평형(`type_key`)에 맞는 **옵션 화면**을 띄웁니다. 옵션 카드 + 가격 + 합계까지.
