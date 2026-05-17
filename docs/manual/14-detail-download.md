# 14장. 관리자 — 신청 상세 + 엑셀 다운로드

> **이 장에서 완성하는 것**  
> 13장 목록에서 **행 클릭** → 우측 **접수 상세**(옵션·서명·상태·메모).  
> **「엑셀(.xlsx) 내려받기」** → 12장 Storage 누적 파일(`yyc-contract-live_V1.xlsx`)을 **서명 URL** 로 받기.  
>
> **선행**: 12장 Webhook·`append-workbook-row`, 13장 로그인  
> **소요 시간**: 약 1.5시간  
> **난이도**: ★★★★

---

## 14-1. 미리 알아두기

| 용어 | 설명 |
|------|------|
| **상세 패널** | 표 오른쪽 `admin-detail` — 모달이 아님 |
| **`selected_options`** | jsonb — 카테고리·라벨·가격 목록 표시 |
| **`sign-application-workbook`** | 관리자 JWT 확인 후 Storage **60초** 서명 URL |
| **누적 엑셀** | 12장 피벗 시트 — 신청마다 Webhook 이 한 줄 추가 |

> 예전 교재: `get_application` RPC, 주민번호 마스킹, `data.url` 응답 → **현재 앱과 다름.**  
> 상세는 **목록에서 이미 받은 행**을 쓰고, 다운로드 응답 필드는 **`signedUrl`**.

---

## 14-2. Edge Function 배포

레포: `supabase/functions/sign-application-workbook/index.ts`  
`supabase/config.toml` 에 `verify_jwt = false` (함수 안에서 JWT 검사).

```bash
cd /경로/yyc-options
supabase secrets set WORKBOOK_RESET_ALLOWED_EMAILS="admin@admin.com"
supabase secrets set WORKBOOK_BUCKET="application-workbook"
supabase secrets set WORKBOOK_OBJECT_KEY="yyc-contract-live_V1.xlsx"
supabase functions deploy sign-application-workbook --no-verify-jwt
```

- `WORKBOOK_RESET_ALLOWED_EMAILS` 가 **비어 있으면** 로그인만 되면 누구나 URL 발급 가능 → 운영에서는 **반드시 이메일 지정**.  
- 여러 명: `a@x.com,b@y.com` 쉼표 구분.

---

## 14-3. 상세 패널에서 보이는 항목

| 항목 | 출처 |
|------|------|
| 접수번호·일시 | `receipt_no`, `created_at` |
| 고객명·휴대폰 뒷자리 | `customer_name`, `phone` (4자리) |
| 동/호·타입 | `dong`, `ho`, `unit_type` |
| 옵션 목록 | `selected_options[]` → category / label / price |
| 옵션금액소계·총액·금액일치 | 앱이 `selected_options` 합 vs `total_price` 비교 |
| 서명 | `signature_data_url` → `safeSignatureSrc` 로만 `<img>` |
| 처리 상태 | `status` select → 저장 시 PATCH |
| 관리자 메모 | `admin_memo` (13-3 (2) 칼럼 필요) |

주민번호·이메일·주소 필드는 **현재 스키마에 없음** (11장 payload 기준).

---

## 14-4. 엑셀 다운로드 동작

버튼: 목록 상단 **「엑셀(.xlsx) 내려받기」**

1. `sign-application-workbook` 호출 (`body: { expiresIn: 60 }`)  
2. 응답 `{ "signedUrl": "…", "expiresIn": 60 }`  
3. `signedUrl` 로 fetch → 브라우저 저장 (`YYC-관리자-YYYYMMDD.xlsx` 형식)

이 파일은 **12장 자동 누적본**입니다. 필터된 목록만 받는 기능이 아닙니다.

### 실패 시

- alert 에 Storage·함수 배포 안내.  
- 개발용: 빌드에 `VITE_ADMIN_XLS_TEMPLATE_ONLY=1` 이면 `public/templates/yyc-contract-pivot-template.xlsx` 로 **DB 행을 시트에 병합**하는 경로 (운영 기본 아님).

---

## 14-5. 시험

`#/admin` → 로그인.

| 시험 | 기대 |
|------|------|
| 행 클릭 | 우측 상세·옵션 목록·서명 |
| 상태 변경 + 저장 | 표에 상태 반영 (PATCH 성공) |
| 엑셀 내려받기 | 피벗 xlsx 저장, 12장 신청 행 포함 |
| 60초 후 같은 URL | 만료 → 버튼 다시 |
| 로그아웃 후 다운로드 | 로그인 요구 |

---

## 14-6. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| Storage 누적 워크북 실패 | 함수 미배포·버킷·secret | 14-2 재배포, 12장 파일명 |
| 403 forbidden | 화이트리스트 | `WORKBOOK_RESET_ALLOWED_EMAILS` 에 본인 이메일 |
| 401 | 토큰 만료 | 재로그인 |
| signedUrl 비어 있음 | 구버전 함수 | 레포 `index.ts` 로 재배포 |
| 메모/상태 저장 실패 | 칼럼 없음 | 13-3 (2) `admin_memo`, `updated_at` |
| 엑셀 헤더 422 (12장) | 템플릿 불일치 | 12-2 피벗 헤더와 동일하게 |

---

## 14-7. 완료 체크리스트

- [ ] `sign-application-workbook` 배포 + 시크릿 3종
- [ ] 상세: `selected_options` + 서명 이미지
- [ ] 엑셀: Storage 누적본 다운로드 OK
- [ ] (선택) 상태·메모 저장 OK

---

## 14-8. 보안 메모

- 버킷 비공개 + **짧은 서명 URL**.  
- 함수: `auth.getUser(jwt)` + (선택) 이메일 화이트리스트.  
- 서명 src 는 data URL 화이트리스트만 렌더 (XSS 완화, 17장).

---

📌 **다음 장**  
15장: **초기화** — DB·접수번호·Storage 피벗 엑셀 한 번에.
