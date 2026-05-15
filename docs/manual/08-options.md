# 8장. 평형별 옵션 화면 만들기

> **이 장에서 완성하는 것**  
> 7장 통과 후 → 평형(예: `59A`)에 맞는 **옵션 카드 목록**이 나옵니다.  
> 체크박스로 고르면 우측 합계가 실시간 갱신.  
>
> **소요 시간**: 약 2시간  
> **난이도**: ★★★

---

## 8-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **옵션 카탈로그** | "평형별 메뉴판 (이 평형엔 이 옵션·이 가격)" |
| **JSON / JS 객체** | "엑셀의 한 행을 그대로 코드로 적은 메모" |
| **map / filter** | "엑셀 칼럼 변환·줄 골라내기" |
| **합계 (reduce)** | "선택된 가격만 더하기 = SUMIF" |

---

## 8-2. 카탈로그 파일 만들기

`src/optionsCatalog.js` 파일을 새로 만들어 **그대로 복붙**.

```js
export const OPTIONS_CATALOG = {
  '59A': [
    { key: 'kitchen-up',   label: '주방 상부장 업그레이드',  price: 1_200_000 },
    { key: 'floor-grade2', label: '바닥재 2등급',           price:   850_000 },
    { key: 'window-blind', label: '전체 창 전동블라인드',    price: 2_400_000 },
    { key: 'pantry',       label: '팬트리 추가',            price:   650_000 },
  ],
  '52A': [
    { key: 'kitchen-up',   label: '주방 상부장 업그레이드',  price: 1_100_000 },
    { key: 'floor-grade2', label: '바닥재 2등급',           price:   780_000 },
    { key: 'pantry',       label: '팬트리 추가',            price:   620_000 },
  ],
  '48B': [
    { key: 'kitchen-up',   label: '주방 상부장 업그레이드',  price: 1_000_000 },
    { key: 'floor-grade2', label: '바닥재 2등급',           price:   720_000 },
  ],
  '65A': [
    { key: 'kitchen-up',   label: '주방 상부장 업그레이드',  price: 1_300_000 },
    { key: 'window-blind', label: '전체 창 전동블라인드',    price: 2_700_000 },
    { key: 'pantry',       label: '팬트리 추가',            price:   720_000 },
    { key: 'wine',         label: '와인셀러',               price: 1_900_000 },
  ],
  '79':  [
    { key: 'kitchen-up',   label: '주방 상부장 업그레이드',  price: 1_500_000 },
    { key: 'window-blind', label: '전체 창 전동블라인드',    price: 3_100_000 },
    { key: 'wine',         label: '와인셀러',               price: 2_100_000 },
    { key: 'aircon',       label: '시스템 에어컨 1대 추가',  price: 2_800_000 },
  ],
};
```

> 💡 **나중에 옵션·가격이 바뀌면 이 파일만 수정**해서 push 하면 끝.

---

## 8-3. AI에게 옵션 화면 만들라고 시키기 🎯

> 🎯 **Cursor에 그대로 복사**  
> ```
> @App.jsx 에 다음을 추가/변경.
>
> 1) 위에 import { OPTIONS_CATALOG } from './optionsCatalog'
>
> 2) 상태:
>    - const [step, setStep] = useState('verify')   // 'verify' | 'options' | 'form' | 'done'
>    - const [selected, setSelected] = useState({}) // { key: true } 형태
>
> 3) 7장의 검증 통과 시 setStep('options') 호출. (verifiedTypeKey 도 그대로 유지)
>
> 4) step === 'options' 일 때 화면:
>    - 상단: "동 ○○○호 ○○○ 님 — 평형 {verifiedTypeKey}" (수정 버튼: setStep('verify'))
>    - 가운데: OPTIONS_CATALOG[verifiedTypeKey] 목록을 카드로 출력
>      각 카드: 좌측 체크박스 + 옵션명 + 우측 가격(천단위 콤마, 끝에 "원")
>      체크 시 카드 보더가 파란색·옅은 파란 배경
>    - 하단(스크롤해도 따라오는 sticky bar):
>      "선택 {n}개 / 합계 {amount}원"  +  큰 "신청서 작성" 버튼
>      선택 0개면 신청서 작성 버튼 disabled
>      신청서 작성 클릭 시 setStep('form')
>
> 5) OPTIONS_CATALOG[verifiedTypeKey] 가 비어있거나 undefined 면
>    "이 평형은 옵션 대상이 아닙니다" 안내.
>
> 모바일에서도 sticky bar 가 화면 아래 붙도록 position: sticky bottom: 0.
> 변경 후 Apply.
> ```

---

## 8-4. 브라우저 확인

7장 통과 → 옵션 화면이 떠야 함.

1. 카드 체크/해제할 때 합계 즉시 변동
2. 다 해제하면 "신청서 작성" 회색
3. 위쪽 "수정" 누르면 다시 6장 입력 화면
4. 폰 화면(F12 모바일 모드)에서 sticky bar가 아래 붙어 있나

[스크린샷: 옵션 카드 + sticky 합계 바]

✅ 다 OK면 8장 통과.

---

## 8-5. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| 옵션 화면이 빈 화면 | type_key 가 카탈로그에 없음 | 5장 등록부 type_key 와 카탈로그 키 일치 확인 |
| 합계가 NaN | price가 문자열 | 카탈로그 가격을 숫자(number)로 |
| 모바일에서 sticky bar 안 붙음 | 부모에 overflow: hidden | App 컨테이너 overflow 제거 |
| 체크해도 색 변화 없음 | className 조건 누락 | "체크 시 카드 클래스 'selected' 토글" 추가 지시 |

---

## 8-6. 8장 완료 체크리스트

- [ ] `optionsCatalog.js` 파일이 만들어졌고 본인 평형도 들어 있다
- [ ] 옵션 카드가 평형별로 다르게 나온다
- [ ] 체크 시 합계가 즉시 갱신
- [ ] 0개 선택 → "신청서 작성" 회색
- [ ] "수정" 누르면 입력 화면으로 복귀
- [ ] 모바일에서 합계 바가 아래 붙어 있다

---

📌 **다음 장 미리보기**  
9장에선 "신청서 작성" 클릭 후의 **개인정보 입력 폼**(주민번호 앞6, 주소, 이메일, 비상연락처 등)을 만듭니다.
