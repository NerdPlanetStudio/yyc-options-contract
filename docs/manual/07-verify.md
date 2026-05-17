# 7장. 입주민 검증 + 옵션 화면으로 들어가기 (`step 0` → `step 1`)

> **이 장에서 완성하는 것**  
> 6장 **`step 0`** 에서 **「옵션 계약 신청 →」**(또는 변경 신청)을 누르면:  
> 1. Supabase **`verify_yyc_resident`** 로 동·호·이름·휴대폰 뒷4자리 확인  
> 2. **선택한 평형(`typeKey`)** 이 등록부와 같으면 → **`setStep(1)`** (8장 옵션 화면)  
> 3. 틀리면 → **팝업(모달)** 으로 안내 (빨간 글씨 한 줄이 아님)  
>
> 추가: 4칸을 입력하는 동안 **등록부와 맞는 평형 버튼이 자동으로 선택**될 수 있습니다.  
>
> **소요 시간**: 약 1.5시간  
> **난이도**: ★★★ (Supabase ↔ 화면 첫 연결)

---

## 7-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **Supabase RPC** | "5장에서 만든 검색 매크로를 이름으로 부르기" |
| **`verify_yyc_resident`** | "4가지 정보로 등록부 1줄 찾기" |
| **`tryEnterOptionsFromGate`** | "신청 버튼 눌렀을 때 검증 후 step 1 로 보내는 함수" |
| **`lookupResidentTypeQuiet`** | "입력할 때 조용히 평형만 맞춰 주는 자동완성" |
| **`noticeModal`** | "틀렸을 때 뜨는 안내 팝업" |
| **로컬 폴백 (`DEV`)** | "개발 PC에만 있는 샘플 등록부 JSON" |

---

## 7-2. Supabase 전화기 준비

### (1) 패키지 (이미 있으면 생략)

```bash
cd /Users/dongwoolim/yyc-options
npm install @supabase/supabase-js
```

### (2) `.env.local` (로컬 개발용)

프로젝트 루트에:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...본인키...
```

[스크린샷: .env.local 두 줄]

⚠️ Git에 올리지 않기 (`.gitignore`에 `.env.local` 있는지 확인).  
수정 후 **`npm run dev` 재시작** (Ctrl+C → 다시 실행).

> 배포(GitHub Pages)는 **GitHub Secrets** 에 같은 이름으로 넣습니다 (16장).

---

## 7-3. 5장 SQL이 돌아가 있는지 확인

Supabase → **SQL Editor** → 5장에서 실행한  
`supabase/sql/yyc_resident_registry.sql` + 세대 **INSERT** 가 되어 있어야 합니다.

✅ Table Editor → `yyc_resident_registry` 에 테스트 행이 보임.

---

## 7-4. AI에게 검증 + `step 1` 이동 붙이기 🎯

> 🎯 **Cursor에 그대로 복사**  
> ```
> @App.jsx @optionsCatalog.js
>
> 1) verify_yyc_resident 호출 (REST rpc 또는 supabase.rpc):
>    p_dong, p_ho, p_contractor, p_phone_tail — 동·호는 숫자만, 이름 trim
>
> 2) async function tryEnterOptionsFromGate:
>    - !typeKey 이면 noticeModal "평형 선택"
>    - gateVerifying true
>    - verifyResidentForGate(...) → { typeKey } 또는 null
>    - null: noticeModal "등록 정보 불일치"
>    - row.typeKey !== typeKey: noticeModal "평형 확인" (등록 평형 이름 표시)
>    - 통과: setStep(1)
>    - finally gateVerifying false
>
> 3) step===0 의 「옵션 계약 신청 →」「옵션 계약 변경 신청 →」 onClick = tryEnterOptionsFromGate
>    disabled: gateVerifying || !dong || !ho || !contractor || phoneLast4.length!==4 || !typeKey
>    텍스트: gateVerifying ? "확인 중…" : 기본 문구
>
> 4) useEffect (step===0): 4칸 다 차면 lookupResidentTypeQuiet → typeKey 자동 설정 (바뀌면 setSel({}))
>
> 5) noticeModal: 제목+본문+확인 버튼 (alertdialog)
>
> DEV: RPC 빈 결과일 때 allowedResidents.sample.json 폴백 허용.
> Apply.
> ```

---

## 7-5. 브라우저에서 확인

```bash
cd /Users/dongwoolim/yyc-options
npm run dev
```

| 시험 | 입력·동작 | 기대 결과 |
|------|-----------|----------|
| **자동 평형** | 등록부와 맞는 4칸 입력 | 0.4초 안에 해당 **평형 버튼이 파란색** |
| **통과** | 맞는 4칸 + 맞는 평형 → **옵션 계약 신청 →** | **옵션 화면** (`step 1`) — 평면도·카드·오른쪽 합계 |
| **4항목 불일치** | 이름·휴대폰 등 하나 틀림 | 팝업 **「등록 정보 불일치」** |
| **평형만 틀림** | 4칸 맞고 다른 평형 버튼 선택 후 신청 | 팝업 **「평형 확인」** — 등록 평형 이름 안내 |
| **확인 중** | 신청 클릭 직후 | 버튼 **「확인 중…」** |
| **4칸 미완** | 휴대폰 3자리 | 신청 버튼 **회색** |

[스크린샷: 통과 — step1 헤더바 / 실패 — 등록 정보 불일치 팝업]

✅ 통과 시 **8장 옵션 화면**까지 보이면 7장 완료.

---

## 7-6. 로컬만 테스트할 때 (등록부 JSON)

공개 Git에는 실명 DB를 안 올립니다. 개발 PC에만:

1. `src/data/allowedResidents.json` (또는 샘플 복사)
2. 터미널: `npm run db:residents-sql` → 나온 SQL을 Supabase에서 실행  
   **또는** DEV 모드에서 샘플 JSON 폴백으로만 확인

> 운영(실제 입주)은 **Supabase 등록부만** 신뢰합니다.

---

## 7-7. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| `Invalid API key` | `.env.local` 오타 | 4장 키 다시 복사, dev 재시작 |
| `verify_yyc_resident does not exist` | 5장 SQL 미실행 | `yyc_resident_registry.sql` 전체 Run |
| 항상 등록 불일치 | DB에 행 없음 / 뒷4자리 다름 | Table Editor 데이터 확인 |
| 평형 확인 팝업 | `typeKey` 수동 선택이 등록과 다름 | 안내된 평형 버튼으로 다시 선택 |
| CORS / Failed to fetch | URL·네트워크 | URL 끝 `/` 없음, Supabase 상태 확인 |
| 자동 평형이 안 맞음 | RPC 실패·빈 결과 | 5장 SQL·INSERT, DEV면 JSON 폴백 |
| 팝업만 뜨고 step1 안 감 | `setStep(1)` 누락 | 7-4 프롬프트 다시 Apply |

---

## 7-8. 7장 완료 체크리스트

- [ ] `.env.local` (로컬) 또는 GitHub Secrets (배포) 설정
- [ ] 등록부에 있는 4칸 → **옵션 계약 신청 →** → **`step 1`** 진입
- [ ] 틀린 4칸 → **등록 정보 불일치** 팝업
- [ ] 평형만 틀림 → **평형 확인** 팝업
- [ ] 확인 중 **「확인 중…」** 표시
- [ ] (선택) 4칸 입력 시 평형 버튼 **자동 선택**

---

📌 **다음 장 미리보기**  
8장: `step 1` 에서 **`optionsCatalog.js`** 기준 옵션 카드·가격·합계·이미지(8-7절)를 다룹니다.
