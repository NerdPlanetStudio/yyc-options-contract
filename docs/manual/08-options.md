# 8장. 평형별 옵션 화면 만들기

> **이 장에서 완성하는 것**  
> 6·7장에서 만든 **첫 화면(계약자 정보)** 에서 입주민 확인이 끝나면 →  
> **`step === 1` 옵션 화면**으로 넘어가고, 평형(예: `59㎡A`)에 맞는 **카테고리별 옵션 카드**가 나옵니다.  
> **「선택」** 버튼으로 고르면 **오른쪽 사이드바 합계**가 바로 바뀝니다.  
>
> **소요 시간**: 약 2시간 (이미지 넣기는 8-7절 — 추가 1~2일)  
> **난이도**: ★★★

---

## 8-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **`src/optionsCatalog.js`** | "19개 평형 **메뉴판 + 가격 + 그림 주소** 한 파일 (단일 소스)" |
| **`TYPES`** | "메뉴판 묶음 배열 — 평형 1개 = 객체 1개" |
| **`opts`** | "그 평형의 마감·주방·붙박이·공간 옵션 줄 목록" |
| **`getAppliances(t)`** | "가전(인덕션·냉장고·비데 등) 목록 — 평형마다 `ac`·`vent`·`dual` 가격만 다름" |
| **`step`** | "지금 몇 번째 화면인지 번호 (0=입력, 1=옵션, 2=서명·제출)" |
| **`sel`** | "선택한 옵션 id → 가격 맵 (엑셀 SUMIF용 메모)" |
| **`CatalogImage`** | "평면도·2열 비교 그림 표시 — Imgur 로드 후 **밝은 여백 trim** + 흰 패딩 (`catalogImage.js`, 냉장고 URL 제외)" |
| **`cmp-card` CSS** | "옵션 비교 카드 높이·`object-fit: contain` — **전 평형 동일** (가전 `.app-table` 은 별도)" |

### 화면 흐름 (지금 프로젝트 기준)

| step | 화면 | 하는 일 |
|------|------|---------|
| **0** | 계약자 정보 + 평형 버튼 | 동·호·이름·휴대폰 4자리 → **옵션 계약 신청 →** (입주민 RPC 확인) |
| **1** | 평면도 + 옵션 카드 + **오른쪽 합계** | 카테고리별 **선택** 토글 → **신청서 확인 →** |
| **2** | 신청 요약 + 서명 | 서명 후 제출 (10·11장과 연결) |

> 💡 예전 교재의 `OPTIONS_CATALOG` 이름은 **쓰지 않습니다.** 지금은 **`TYPES` + `getAppliances`** 입니다.

---

## 8-2. `optionsCatalog.js` 구조 이해하기

파일 위치: **`src/optionsCatalog.js`** (이미 있으면 **열어서 가격·문구만 수정**).

### (1) 평형 1개 블록 예시 (`59A`)

```js
export const TYPES = [
  // ... 다른 평형 ...
  {key:'59A', name:'59㎡A', opts:[
    {id:'wall', cat:'벽 마감재 특화', label:'벽(현관, 복도, 거실, 주방) 시트 판넬', base:'실크 벽지', price:3400000},
    {id:'living', cat:'거실마감재 특화', label:'거실 아트월(...)', base:'거실 아트월(...)', price:4200000, notes:['※ ...']},
    {id:'kitchen', cat:'주방 마감 및 가구 특화', label:'...', base:'...', price:4500000,
      baseImg:'https://i.imgur.com/y8vaEXd.png', img:'https://i.imgur.com/ukypmcj.png'},
    {id:'closet_침실1', cat:'붙박이장', label:'...', base:'', price:3900000, baseImg:'...', img:'...'},
    {id:'space', cat:'공간(드레스룸) 특화', label:'...', base:'', price:1200000,
      baseImg:'...', img:'...', group:'g59A'},
  ],
  ac:6400000, vent:1200000, dual:true,
  floorPlan:'https://i.imgur.com/UW6y8Yf.png',
  fridgeBaseImg:'https://i.imgur.com/Wwqgatz.png',
  fridgeImg:'https://i.imgur.com/CUL8p92.png'},
];
```

### (2) 칼럼(필드) 표 — 옵션 한 줄(`opts` 안)

| 필드 | 필수 | 의미 |
|------|------|------|
| `id` | ✅ | 옵션 고유 이름 (영문·숫자, 예: `kitchen`) |
| `cat` | ✅ | 화면 카테고리 제목 (예: `거실마감재 특화`) |
| `label` | ✅ | 유상 선택형 설명 (긴 문장 OK) |
| `base` | ✅ | 미선택형 설명 (`''` 가능) |
| `price` | ✅ | 숫자만 (따옴표 없음) `4500000` |
| `notes` | | 주의 문구 배열 `['※ ...', '※ ...']` |
| `baseImg` / `img` | | 2열 비교 그림 URL (8-7절) |
| `group` | | **상호 배타** — 같은 `group` 은 하나만 선택 |

### (3) 평형 줄 끝 필드

| 필드 | 의미 |
|------|------|
| `ac` | 시스템에어컨 가격 (가전 목록에 반영) |
| `vent` | 환풍기 가격 |
| `dual` | `true` = 욕실 2개 타입(비데 2세트), `false` = 1세트 |
| `floorPlan` | 상단 평면도 URL |
| `fridgeBaseImg` / `fridgeImg` | 냉장고 미선택/선택 그림 |

### (4) 19개 평형 키 (`key`)

`43`, `48A`, `48B`, `52A`, `52B`, `52C`, `55A`, `55B`,  
`59A`, `59B`, `59C`, `59D`, `59E`, `59F`, `65A`, `65B`, `68`, `79`, `84`

> 5장 등록부 `type_key` 와 **철자까지 동일**해야 자동 평형 선택이 맞습니다.

### (5) 가전은 `getAppliances(t)` 에 있음

`opts` 에 넣지 않아도 됩니다. `App.jsx` 가 평형 객체 `t` 를 넘겨 **인덕션·오븐·냉장고·비데** 등을 붙입니다.  
가전 가격 중 `ac`, `vent` 는 평형 줄의 숫자를 씁니다.

> 💡 **옵션·가격·주의문·이미지 URL이 바뀌면** 이 파일만 고치고 push 하면 신청 화면·관리자 엑셀 열이 같이 따라갑니다.

---

## 8-3. `App.jsx` 와 연결 (이미 되어 있는지 확인)

`App.jsx` 상단에 아래가 있으면 **8-3은 읽기만** 하면 됩니다.

```js
import { TYPES, getAppliances } from "./optionsCatalog.js";
import { CatalogImage } from "./CatalogImage.jsx";
```

> 🎯 **처음부터 다시 붙일 때만** Cursor에 복사  
> ```
> @App.jsx @optionsCatalog.js
> - import { TYPES, getAppliances } from './optionsCatalog.js'
> - step 0: 계약자 4칸 + TYPES 평형 버튼 + verify_yyc_resident 통과 시 setStep(1)
> - step 1: typeData = TYPES.find(t => t.key === typeKey)
>   - 상단 floorPlan (CatalogImage)
>   - getOrderedOptionCategories 로 PDF 순서대로 cat-section
>   - 마감 옵션: cmp-card + 선택 토글, baseImg/img 있으면 2열 그림
>   - 가전: app-table 맨 아래, 냉장고만 baseImg/img
>   - 오른쪽 sidebar: 선택 목록 + 합계 + 「신청서 확인 →」 setStep(2)
> - sel 상태: { [optionId]: price }
> - group 있는 옵션은 상호 배타(다른 선택 시 excluded 표시)
> 기존 10·11장 제출·서명 흐름은 유지. Apply.
> ```

### 8-3-1. `CatalogImage` 가 하는 일 (이미 구현됨)

| 구분 | 동작 |
|------|------|
| **평면도·주방/붙박이/공간 비교** | `CatalogImage` → 브라우저에서 이미지 로드 → 외곽 밝은색 여백 잘라내기 → `#fff` 패딩 후 표시 |
| **냉장고** (`fridgeBaseImg` / `fridgeImg`) | Imgur ID 4종은 **trim 안 함** — 원본 URL 그대로 `<img>` |
| **2열 칸이 안 나오는 경우** | `App.jsx` 는 `주방 마감 및 가구 특화` · `붙박이장` · `공간(드레스룸) 특화` 만 2열 UI. **`baseImg`/`img` 둘 다 없으면** 글자만 (55A 주방 등 — 정상) |
| **표시 크기** | 픽셀 맞출 필요 없음 — `index.css` 의 `.plan-box` · `.cmp-card .cmp-imgs` 가 맞춤 |

> Imgur CORS 때문에 trim 이 안 되면 **원본 URL** 그대로 보입니다. 그림은 뜨면 OK.

---

## 8-4. 브라우저 확인 (`step === 1`)

```bash
cd /Users/dongwoolim/yyc-options
npm run dev
```

등록부에 있는 **테스트 동·호**로 6장 입력 → **옵션 계약 신청 →** 클릭.

✅ **성공 화면**

1. **맨 위** 평면도(또는 placeholder)
2. **카테고리 제목** (예: ▣ 거실마감재 특화 옵션 선택) — PDF 순서와 비슷
3. 각 줄 **「선택」** → 누르면 파란 테두리 + 오른쪽 **선택 내역**에 추가
4. **가전 옵션** 블록이 **맨 아래** (냉장고 2열 그림 포함 가능)
5. 오른쪽 **합계** 숫자가 선택할 때마다 즉시 변경
6. **「신청서 확인 →」** → 서명 화면(`step 2`)

[스크린샷: 평면도 + 옵션 카드 + 오른쪽 선택 내역·합계]

> 선택을 **0개**로 둬도 **「신청서 확인 →」** 는 누를 수 있습니다 (전체 미선택형 신청).

---

## 8-5. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| 평형 버튼이 안 눌림 / 다음 회색 | 등록부 4항목 불일치 | 5장 `type_key`·이름·휴대폰 뒷4자리 확인 |
| 옵션 화면이 비어 있음 | `typeKey` 가 `TYPES` 에 없음 | `optionsCatalog.js` 의 `key` 와 등록부 일치 |
| 합계가 `NaN` | `price` 에 따옴표·쉼표 | `price:4500000` 숫자만 |
| 카테고리 순서가 PDF와 다름 | `TYPE_OPTION_CARD_ORDER` | `App.jsx` 해당 객체에 평형 키 추가·순서 수정 |
| 붙박이·공간 둘 다 안 됨 | `group` 상호 배타 | PDF 안내대로 하나만 선택 가능 (정상) |
| 2열 그림이 안 나옴 | `cat` 이름 또는 URL 없음 | `주방 마감 및 가구 특화` 등 + `baseImg`/`img` (8-7) |
| `npm ENOENT package.json` | 홈(`~`)에서 npm 실행 | `cd .../yyc-options` 후 실행 |

---

## 8-6. 8장 완료 체크리스트

- [ ] `src/optionsCatalog.js` 에 **19개** `key` 가 있다
- [ ] 등록부 `type_key` 와 카탈로그 `key` 가 같다
- [ ] `step 1` 에서 평형별 **카테고리·옵션 문구**가 다르게 보인다
- [ ] **선택** 토글 시 오른쪽 합계·선택 내역이 즉시 바뀐다
- [ ] **신청서 확인 →** 로 `step 2` (서명) 이동
- [ ] **← 처음으로** 로 `step 0` 복귀
- [ ] (선택) 8-7~8-12 로 평면도·비교 이미지 URL 입력 완료

---

## 8-7. 평면도·옵션 비교 이미지 넣기 (실무 추가 작업)

> **이 절에서 완성하는 것**  
> PDF 안내서에 있는 **평면도**, **미선택형/선택형 비교 그림**이 신청 화면에 보입니다.  
> **코드는 이미 들어 있습니다.** 운영자가 할 일은 **그림 파일 올리기 + URL 한 줄 붙이기** 뿐입니다.  
>
> **소요 시간**: 평형 1개당 약 10~20분 (19개 타입이면 하루~이틀 분량)  
> **난이도**: ★★ (복붙 위주)

### 8-7-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **`optionsCatalog.js`** | "19개 평형 메뉴판 + 그림 주소록 **한 파일**" |
| **`floorPlan`** | "맨 위 큰 평면도 주소" |
| **`baseImg` / `img`** | "왼쪽(미선택형) / 오른쪽(선택형) 비교 그림 주소" |
| **Imgur** | "그림을 인터넷에 올려 두고 링크만 받는 무료 사진 창고" |
| **표시 크기** | URL만 맞으면 됨 — `CatalogImage` + CSS가 여백·높이 통일 (타입별 픽셀 작업 불필요) |

### 8-7-2. 어떤 그림을 어디에 넣나

| 화면에 보이는 것 | `optionsCatalog.js` 에 넣는 위치 | 필수? |
|------------------|----------------------------------|--------|
| 상단 **평면도** | 해당 평형 `{ key:'59A', ... floorPlan:'https://...' }` | ✅ 타입마다 1장 |
| **주방·붙박이·공간** 2열 비교 | 해당 옵션 `{ ..., baseImg:'...', img:'...' }` | PDF에 그림 있을 때만 |
| **냉장고** 미선택/선택 | `fridgeBaseImg`, `fridgeImg` (평형 줄 끝) | 가전 옵션 쓰는 타입만 |
| 거실·욕실 등 **텍스트만** 옵션 | `baseImg` 없음 → 그림 칸 안 나옴 (정상) | — |

> 💡 **작업 순서 추천**: ① 19개 타입 `floorPlan` 전부 → ② 주방/붙박이/공간 `baseImg`·`img` → ③ 냉장고(같은 URL 여러 타입 재사용 가능)

---

## 8-8. PDF에서 캡처 → Imgur에 올리기

### (1) PDF에서 영역만 캡처

1. PDF 뷰어(미리보기·Adobe 등)에서 **평면도 페이지** 또는 **옵션 비교 페이지**를 연다.
2. **Mac**: `Command + Shift + 4` → 드래그해서 영역만 저장.  
   **Windows**: `Win + Shift + S` → 영역 선택 → 저장.
3. 파일 이름 예: `59A-평면도.png`, `59A-주방-미선택.png`

[스크린샷: PDF 평면도 + 영역 캡처]

✅ **성공 화면**: 바탕이 흰색에 가깝고, 도면·범례가 잘리지 않은 PNG 파일 1개가 바탕화면(또는 다운로드)에 생김.

### (2) Imgur에 업로드

1. 브라우저에서 [https://imgur.com/upload](https://imgur.com/upload) 연다.
2. 방금 저장한 PNG를 **끌어다 놓기** (또는 "New post" → 파일 선택).
3. 업로드가 끝나면 그림 위에서 **우클릭 → "이미지 주소 복사"** (또는 "Copy image address").

✅ **성공 화면**: 클립보드에 아래처럼 **https 로 시작**하는 주소가 복사됨.

```text
https://i.imgur.com/xxxxxxxx.png
```

> ⚠️ `http://` 만 있거나, 페이지 주소(`imgur.com/a/...`)가 아니라 **직접 그림 주소**(`i.imgur.com/....png`) 인지 확인합니다.

### (3) 캡처 팁 (나중에 화면이 예쁘게 나오게)

- PDF 여백이 너무 크면 도면이 작아 보입니다. **도면+범례만** 최대한 타이트하게 캡처.
- 회색 바탕 PDF는 사이트에서 **흰 배경**으로 맞춰 보이도록 이미 처리되어 있습니다. (냉장고 사진은 별도 규칙)

---

## 8-9. `optionsCatalog.js`에 URL 붙이기

### (1) 파일 열기

1. Cursor 왼쪽 파일 트리 → **`src/optionsCatalog.js`** 클릭.
2. `Command + F` 로 평형 키 검색 (예: `59A`).

### (2) 평면도 1줄 넣기

해당 평형 블록 **맨 끝 쉼표 앞**에 `floorPlan` 을 추가하거나 수정합니다.

```js
{key:'59A', name:'59㎡A', opts:[ /* ... */ ],
  ac:6400000, vent:1200000, dual:true,
  floorPlan:'https://i.imgur.com/UW6y8Yf.png',
  fridgeBaseImg:'https://i.imgur.com/Wwqgatz.png',
  fridgeImg:'https://i.imgur.com/CUL8p92.png'},
```

> 작은따옴표 `'` 로 감싸고, 주소 끝에 **쉼표** 있는지 확인.

### (3) 옵션 비교 그림 2줄 넣기 (주방·붙박이·공간)

PDF에 **미선택형 / 선택형** 그림이 있는 옵션만 넣습니다.

```js
{id:'kitchen', cat:'주방 마감 및 가구 특화', label:'...', base:'...', price:4500000,
  baseImg:'https://i.imgur.com/y8vaEXd.png',
  img:'https://i.imgur.com/ukypmcj.png',
  notes:[ /* ... */ ]},
```

| 필드 | 의미 |
|------|------|
| `baseImg` | 왼쪽 칸 — **기본 미선택형** 그림 |
| `img` | 오른쪽 칸 — **유상 선택형** 그림 |

### (4) 냉장고 (가전) 그림

여러 평형이 **같은 냉장고 사진**을 쓰면 URL을 **그대로 복사**해 넣어도 됩니다.

```js
fridgeBaseImg:'https://i.imgur.com/Wwqgatz.png',
fridgeImg:'https://i.imgur.com/CUL8p92.png',
```

### (5) 저장 → GitHub에 올리기

1. `Command + S` 저장.
2. Cursor Source Control(왼쪽 가지 모양) → **Commit** → **Push** (2·3장에서 했던 것과 동일).
3. GitHub Actions 배포가 끝난 뒤(16장) 사이트에서 확인.

> 🎯 **Cursor에 그대로 복사** (한 타입 일괄 반영할 때)  
> ```
> @optionsCatalog.js 에서 key가 '52C' 인 타입에 아래 URL을 넣어줘.
> - floorPlan: https://i.imgur.com/eSeJZFl.png
> - (해당 opts 중 space 옵션에) baseImg: ..., img: ...
> 냉장고 URL은 건드리지 마. 문법(쉼표·따옴표) 깨지지 않게 Apply.
> ```

---

## 8-10. 화면에서 확인하기

### (1) 로컬에서 먼저 보기

터미널은 **반드시 프로젝트 폴더**에서 실행합니다.

```bash
cd /Users/dongwoolim/yyc-options
npm run dev
```

브라우저에 나온 주소(보통 `http://localhost:5173`) → 입주민 검증 통과 → 해당 평형 선택.

✅ **성공 화면**

1. **맨 위** 흰 카드 안에 평면도가 보인다 (잘리지 않고, 좌우 회색 띠 없음).
2. **주방 마감 및 가구 특화 / 붙박이장 / 공간(드레스룸) 특화** 카드에 **왼쪽·오른쪽** 그림 2칸이 보인다.
3. **가전(냉장고)** 맨 아래 — 냉장고만 trim 제외(원본), 평면도·2열 비교는 `CatalogImage` 처리.
4. **55A** 등 `baseImg` 없는 주방 카드는 **2열 칸 없이** 텍스트만 — URL 없으면 정상.

[스크린샷: 평면도 + 2열 옵션 비교 + 냉장고 구역]

### (2) 19개 타입 점검표 (운영용)

| 확인 | 타입 키 |
|------|---------|
| ☐ | 43, 48A, 48B, 52A, 52B, 52C, 55A, 55B |
| ☐ | 59A, 59B, 59C, 59D, 59E, 59F |
| ☐ | 65A, 65B, 68, 79, 84 |

각 타입마다: `floorPlan` 있음 → 비교 그림 필요한 카테고리만 `baseImg`/`img` 있음.

### (3) 선택: 로컬 파일로 일괄 정규화 (고급)

Imgur 대신 **GitHub Pages `/images/catalog/`** 로 두고 싶을 때:

```bash
cd /Users/dongwoolim/yyc-options
npm install          # sharp 포함 (최초 1회)
npm run images:normalize
```

| 항목 | 내용 |
|------|------|
| 대상 | `optionsCatalog.js` 안 Imgur URL (냉장고 4 ID **제외**) |
| 결과 | `public/images/catalog/*.png` 생성 + 카탈로그 URL 치환 |
| 실패 시 | 네트워크/Imgur 차단 환경에서는 0건 처리 — **8-8~8-9 Imgur 방식 유지** (브라우저 `CatalogImage` 만으로도 운영 가능) |
| 배포 | 치환 후 `git push` → 16장 Pages |

> **MVP 권장**: Imgur URL만 넣고 push. `images:normalize` 는 선택.

---

## 8-11. 이미지 관련 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| `npm error ENOENT package.json` | 홈 폴더(`~`)에서 `npm run dev` 실행 | `cd /Users/dongwoolim/yyc-options` 후 다시 실행 |
| 평면도 깨진 아이콘 🖼 | URL 오타 / Imgur 삭제 | 브라우저 새 탭에 URL 붙여 넣어 그림이 뜨는지 확인 |
| 옵션 카드에 그림 칸 없음 | `baseImg`·`img` 둘 다 없음 | PDF에 그림 없으면 정상. 있으면 8-9대로 추가 |
| 주방만 글자, 그림 없음 | 카테고리명이 `주방 마감 특화` (가구 없음) | 2열 그림은 **`주방 마감 및 가구 특화`** 등에만 표시 |
| 평면도만 너무 작고 여백 많음 | PDF 캡처 여백이 큼 | 8-8에서 도면을 더 타이트하게 다시 캡처 |
| 배포 후에도 옛 그림 | 캐시 / Actions 미완료 | 시크릿 창 + Actions 초록 ✅ 확인 후 재접속 |

---

## 8-12. 8장(이미지 포함) 완료 체크리스트

- [ ] 19개 타입 모두 `floorPlan` URL 있음
- [ ] PDF에 있는 비교 그림은 `baseImg` / `img` 쌍으로 들어감
- [ ] Imgur 주소가 `https://i.imgur.com/xxxx.png` 형식
- [ ] 로컬 `npm run dev` 로 2~3개 타입(작은 평형·큰 평형·59A) 눈으로 확인
- [ ] Push 후 GitHub Pages에서도 동일하게 보임

---

📌 **다음 장 미리보기**  
9장에선 **「신청서 확인 →」** 이후 **`step 2`** — 옵션 요약·**서명**·**신청완료** 화면을 다룹니다.
