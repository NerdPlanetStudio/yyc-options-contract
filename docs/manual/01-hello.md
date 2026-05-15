# 1장. Cursor로 “Hello ○○아파트” 페이지 만들기

> **이 장에서 완성하는 것**  
> Cursor에서 AI에게 “빈 사이트 만들어 줘” 한 줄만 시키면, 내 컴퓨터에서 사이트가 떠 있고 거기에 “Hello ○○아파트” 라고 쓰여 있게 됩니다.  
>
> **소요 시간**: 약 1시간  
> **난이도**: ★★ (Cursor에 처음 명령 던져 보는 단계)

---

## 1-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **React** | "버튼·입력칸 같은 화면 부품을 조립하는 레고" |
| **Vite** | "그 레고를 빠르게 조립해서 화면에 띄워주는 기계" |
| **터미널** | "Cursor 아래쪽 검은 창. AI가 명령을 실행하는 곳" |
| **localhost** | "내 컴퓨터에서만 잠깐 보이는 사이트 주소" |

> 💡 위 단어 외울 필요 없습니다. **클릭만 하시면 됩니다.**

---

## 1-2. Cursor 열고 새 창 띄우기

1. **Cursor 실행** (0장에서 깐 거)
2. 위 메뉴 **File → New Window**


3. 새 창이 뜨면 가운데 큰 “Open Folder” 버튼이 보입니다.  
   **아직 누르지 마세요.** 폴더는 AI가 만들어 줄 거예요.

✅ **이런 화면이 보이면 성공**: 가운데 “Get Started” 또는 빈 환영 화면.

---

## 1-3. 터미널 열기

1. 위 메뉴 **Terminal → New Terminal**
2. 화면 아래쪽에 **검은 창**이 열립니다.


3. 검은 창 위에 보이는 경로(예: `~`) 가 어디든 상관 없습니다.

✅ **이런 게 보이면 성공**: 깜빡이는 커서가 있는 검은 입력창.

---

## 1-4. 바탕화면으로 이동 (1줄 복붙)

검은 창에 아래 **한 줄을 그대로 복사 → 붙여넣고 → Enter**:

```bash
cd ~/Desktop
```

✅ 입력창 앞부분이 `…/Desktop %` 처럼 바뀜.

⚠️ **`No such file or directory`** 가 뜨면 → 한국어 윈도우는 `~/Desktop` 대신 `~/바탕\ 화면` 일 수 있어요. **Cursor 채팅에 “바탕화면으로 이동하는 명령 알려줘” 라고 물어** 보면 됩니다.

---

## 1-5. AI에게 첫 프롬프트 던지기 🎯

오른쪽에 있는 **Cursor 채팅창** 클릭. 만약 안 보이면 위 메뉴 **View → Open Chat** 또는 단축키 **`Cmd + L`** (맥) / **`Ctrl + L`** (윈도).


> 🎯 **Cursor에 그대로 복사**  
> ```
> 지금 내 위치(바탕화면)에 yyc-options 라는 폴더를 만들고,
> 그 안에 Vite + React (JavaScript) 빈 프로젝트를 초기화해 줘.
>
> 진행 단계:
> 1) 어떤 명령어를 실행할지 먼저 보여줘
> 2) 내가 "go" 라고 답하면 그때 실행해 줘
> 3) 실행 끝나면 "다음에 할 일" 한 줄로 알려줘
> ```

엔터 치면 AI가 명령어를 보여 줍니다 (대략 `npm create vite@latest yyc-options …` 같은 줄).


내용을 슥 본 다음 채팅창에 한 글자만:

```
go
```

✅ AI가 터미널에 명령을 자동 입력하기 시작합니다.

---

## 1-6. 권한 요청 화면 (Allow 누르기)

명령 실행 도중 Cursor 가운데에 **“Run command?”** 같은 노란 박스가 뜹니다.


→ **Allow** 클릭 (한 번에 안 끝나면 몇 번 더 나옴 — 모두 Allow)

설치 도중 터미널이 멈춘 듯 보여도 **2~3분 기다리면** 자동으로 끝납니다. 절대 닫지 마세요.

✅ **이런 게 마지막에 보이면 성공**:
```
Done. Now run:
  cd yyc-options
  npm install
  npm run dev
```

---

## 1-7. AI에게 “끝까지 해줘” 한 번 더

AI가 위에서 멈췄으면 채팅창에 한 줄 더:

> 🎯 **Cursor에 그대로 복사**  
> ```
> 이어서 yyc-options 폴더로 들어가서 npm install 하고,
> 끝나면 npm run dev 까지 실행해 줘. 권한 박스 나오면 알려줘.
> ```

`Allow` 또 한두 번 누르면, 아래쪽 검은 창에 이런 글자가 뜹니다:

```
  VITE v8.x.x  ready in 432 ms
  ➜  Local:   http://localhost:5173/
```


✅ **`Local: http://localhost:5173/`** 이 보이면 사이트가 떠 있는 상태예요.

---

## 1-8. 진짜 사이트 보기

1. 위 주소를 **Cmd 누른 채 클릭** (맥) / **Ctrl + 클릭** (윈도)  
   → 브라우저가 자동으로 열림  
2. 또는 그냥 브라우저에 `http://localhost:5173/` 직접 입력


✅ React 로고가 빙글빙글 도는 화면이 뜸 = **첫 사이트 띄우기 성공**

⚠️ **흰 화면만 뜨면**: 5초 기다리시고 새로고침. 그래도면 터미널 빨간 글씨 한 줄 복사해 Cursor 채팅에 붙이고 “고쳐 줘”.

---

## 1-9. “Hello ○○아파트” 로 바꾸기

이제 화면 글자만 바꿔 봅시다.

1. 왼쪽 파일 트리에서 **`yyc-options` 폴더 → `src` → `App.jsx`** 더블클릭


2. 코드가 화면에 뜨면 그냥 보지 마시고, **AI에게 시켜요**.

> 🎯 **Cursor에 그대로 복사**  
> ```
> @App.jsx 파일 내용을 전부 지우고,
> 화면 한가운데에 큰 글씨로 "Hello ○○아파트" 만 보이게 바꿔 줘.
> 글씨는 진하게, 가운데 정렬.
> ```

`@App.jsx` 라고 입력하면 자동완성에서 그 파일이 떠요. 선택 후 엔터.

3. AI가 코드 변경 안을 보여 줍니다. 위쪽 **Apply / Accept** 버튼 클릭.


4. 브라우저로 가서 **새로고침 (`Cmd+R` / `Ctrl+R`)**.


✅ “Hello ○○아파트” 만 뜨면 성공.

---

## 1-10. 잠깐 멈추는 법 (저장은 자동)

- 사이트 그만 띄우고 싶을 때: 터미널에서 **`Ctrl + C`** → 다시 띄우려면 `npm run dev`
- Cursor에서 한 거 **자동 저장**됩니다. 따로 저장 안 누르셔도 돼요.

---

## 1-11. 1장 완료 체크리스트

- [ ] 바탕화면에 **`yyc-options`** 폴더가 생겼다
- [ ] 그 안에 `src`, `package.json` 같은 파일들이 보인다
- [ ] `npm run dev` 했을 때 터미널에 **`Local: http://localhost:5173/`** 가 떴다
- [ ] 브라우저로 그 주소 들어가면 **“Hello ○○아파트”** 가 보인다
- [ ] 같은 화면이 사라지지 않고 그대로 떠 있다 (터미널 닫지 말기)

---

## 1-12. 자주 나는 에러 모음

| 화면 | 원인 | 해결 |
|------|------|------|
| `command not found: npm` | Node.js 설치 실패 | 0장 다시. Cursor 껐다 켜기 |
| `EADDRINUSE: address already in use 5173` | 사이트가 이미 떠 있음 | 다른 터미널에서 `Ctrl+C`로 끄기 |
| 흰 화면 / `Cannot GET /` | dev 서버 아직 시작 중 | 5초 후 새로고침 |
| 한국 글자 깨짐 | 인코딩 문제 | Cursor 재시작 한 번 |
| Allow 박스 못 봄 | 권한 박스 닫혀버림 | 채팅에 “명령 다시 실행해줘” |

---

📌 **다음 장 미리보기**  
2장에서는 지금 만든 **`yyc-options` 폴더를 GitHub에 올립니다.** Cursor 안에서 클릭 몇 번이면 끝나요. 이게 되면 “내 코드가 인터넷에 백업됨” 상태가 됩니다.

---

> 💪 **여기까지 오신 분께**  
> 코드 한 줄 안 짰는데 사이트 한 페이지를 띄웠어요. **이게 진짜 시작점**입니다. 한 잔 마시고 2장 가시죠.

 I'm planning out Chapter 1, which will walk through creating a "Hello ○○아파트" page using Cursor, starting with opening the tool and setting up a folder structure, with an estimated completion time of one hour.

Now I need to structure the step-by-step instructions covering everything from launching Cursor through running the dev server and modifying the App component, including screenshots, success checkpoints, and troubleshooting tips, all written in a friendly tone with Cursor prompts highlighted in callout boxes.
