# 10장. (선택) 서명 캔버스 컴포넌트 분리

> **이 장은 필수가 아닙니다.**  
> **9장**에서 이미 `App.jsx` 안에 서명(캔버스 + 서명 완료 + `signData`)이 들어 있습니다.  
> 코드가 길어져서 **서명 부분만 파일로 빼고 싶을 때** 이 장을 따르세요.  
>
> **소요 시간**: 약 1시간  
> **난이도**: ★★

---

## 10-1. 언제 하면 좋나

| 상황 | 10장 필요? |
|------|------------|
| 9장까지 화면·제출이 잘 됨 | ❌ 건너뛰어도 됨 |
| `App.jsx` 가 너무 길어서 정리하고 싶음 | ✅ |
| 서명 UI만 다른 프로젝트에 재사용 | ✅ |

---

## 10-2. AI에게 `SignaturePad.jsx` 만들라고 시키기 🎯

> 🎯 **Cursor에 그대로 복사**  
> ```
> src/SignaturePad.jsx 를 만들고 App.jsx step 2 서명 부분을 교체해줘.
>
> SignaturePad props: { value, onChange }
> - canvas + pointer/mouse/touch 그리기, touch-action none
> - 지우기 → onChange('')
> - 서명 완료 버튼은 부모(App)에 두고, onChange(dataURL) 로 signData 설정
>
> App.jsx 의 confirmSign/crop 로직은 SignaturePad 내부 또는 onChange 직전에 유지.
> step 흐름(0·1·2)과 onSubmitComplete 는 건드리지 마.
> Apply.
> ```

---

## 10-3. 확인

9장과 동일: 서명 → 서명 완료 → 신청완료 활성.

---

## 10-4. 10장 체크리스트

- [ ] `SignaturePad.jsx` (또는 동일 역할 파일) 존재
- [ ] `App.jsx` import 후 `step 2` 에서 사용
- [ ] 9장 시험 항목이 그대로 통과

---

📌 **다음**: **11장** — `신청완료` 시 Supabase `submit_application` 저장.
