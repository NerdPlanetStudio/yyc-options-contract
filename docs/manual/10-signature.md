# 10장. 손가락·마우스 서명 칸 만들기

> **이 장에서 완성하는 것**  
> 9장 "다음(서명)" 누르면 → **빈 서명 칸 1개 + 지우기 + 제출** 화면.  
> 사용자가 마우스/손가락으로 서명 → PNG 이미지로 변환 → 다음 단계로 넘김.  
> *진짜 저장은 11장에서.*  
>
> **소요 시간**: 약 1.5시간  
> **난이도**: ★★★

---

## 10-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **Canvas (캔버스)** | "그림판 — 좌표에 선을 그릴 수 있는 빈 도화지" |
| **pointer 이벤트** | "마우스든 손가락이든 똑같이 처리하는 통합 이벤트" |
| **toDataURL('image/png')** | "지금 그린 그림을 PNG 문자열로 뽑기 (base64)" |
| **base64** | "이미지를 '문자' 로 표현한 긴 글자 = DB에 그대로 저장 가능" |

---

## 10-2. AI에게 서명 컴포넌트 만들라고 시키기 🎯

> 🎯 **Cursor에 그대로 복사**  
> ```
> src/SignaturePad.jsx 라는 새 파일을 만들어줘.
>
> 요구사항:
> - props: { value, onChange }
>   - value: 현재 서명 dataURL (없으면 빈 문자열)
>   - onChange(dataURL): 그릴 때마다 호출
> - canvas 폭 100% (최대 480px), 높이 200px, 흰 배경, 1px 회색 보더, 둥근 모서리
> - pointerdown / pointermove / pointerup 으로 그리기
>   - 손가락(터치) + 마우스 동시 지원 (pointer events)
>   - 선 굵기 2.5, 색 검정, lineCap round
>   - touch-action: none 으로 스크롤 막기
> - 우측 위에 "지우기" 작은 버튼 → 캔버스 clear + onChange('')
> - HiDPI 지원: window.devicePixelRatio 적용해서 흐림 방지
> - export default SignaturePad
>
> @App.jsx 의 step === 'sign' 화면도 만들어줘.
>   - 위 안내문 "아래 박스에 서명해 주세요. (마우스 또는 손가락)"
>   - <SignaturePad value={signature} onChange={setSignature} />
>   - const [signature, setSignature] = useState('')
>   - 하단 두 버튼:
>     - 좌측 "이전" → setStep('form')
>     - 우측 "제출" → signature 가 비어있으면 disabled, 아니면 활성
>       (실제 저장은 다음 장에서. 지금은 console.log({ ...form, signature: signature.slice(0,30)+'...' }))
>
> 변경 후 Apply.
> ```

---

## 10-3. 브라우저 확인

새로고침 → 6 → 7 → 8 → 9 → **다음(서명)** 까지 진행 → 서명 화면.

[스크린샷: 서명 캔버스에 "홍길동" 같은 서명 + 지우기·이전·제출 버튼]

| 시험 | 기대 |
|------|------|
| 마우스로 그림 | 검정 선 보임 |
| 폰(F12 모바일 모드)에서 손가락 드래그 | 선 그림, 페이지 스크롤 안 됨 |
| 지우기 버튼 | 캔버스 비워지고 제출 회색으로 |
| 제출 버튼 | Console에 `{ ..., signature: 'data:image/png;base64,iVBOR...' }` 찍힘 |

✅ 다 OK면 10장 통과.

---

## 10-4. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| 폰에서 그릴 때 화면이 같이 스크롤됨 | `touch-action` 미적용 | 캔버스에 `style={{ touchAction: 'none' }}` 추가 |
| 선이 흐리고 두 줄로 보임 | DPR 미적용 | "devicePixelRatio 스케일 적용" 다시 지시 |
| 클릭만 하면 점 하나도 안 찍힘 | pointerdown에 한 점 그리기 안 함 | 첫 점에 작은 dot 찍는 로직 추가 |
| 캔버스 좌표가 어긋남 | getBoundingClientRect 안 씀 | rect.left/top 빼서 좌표 보정 |
| 지우기 후에도 제출 활성 | onChange('') 안 보냄 | clear 후 `onChange('')` 호출 확인 |

---

## 10-5. 10장 완료 체크리스트

- [ ] `src/SignaturePad.jsx` 파일이 생겼다
- [ ] PC·모바일 둘 다 그릴 수 있다
- [ ] 지우기 → 캔버스 비워지고 제출 회색
- [ ] 제출 시 Console 에 PNG dataURL 시작 부분이 찍힌다
- [ ] 이전 → 신청서로 돌아갔다 다시 와도 화면 정상

---

📌 **다음 장 미리보기**  
11장에서 "제출"이 진짜 일을 합니다.  
신청 데이터 + 서명을 **`applications` 테이블에 한 줄로 저장**하고,  
같은 호수 중복 신청을 막는 **`submit_application` RPC**도 만듭니다.
