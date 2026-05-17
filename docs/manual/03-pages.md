# 3장. GitHub Pages로 진짜 인터넷 주소 만들기

> **이 장에서 완성하는 것**  
> 1·2장에서 만든 사이트가 **인터넷 주소**로 떠오릅니다.  
> 친구한테 카톡으로 주소 보내면 폰에서도 보입니다.  
>
> 주소 모양: `https://내아이디.github.io/yyc-options/`  
>
> **소요 시간**: 약 1시간  
> **난이도**: ★★ (복붙 위주, 마지막에 5분 기다리는 게 길게 느껴짐)  
> **🏁 1차 체크포인트** 챕터입니다.

---

## 3-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **GitHub Pages** | "GitHub 레포 → 무료 인터넷 사이트" |
| **GitHub Actions** | "Push 할 때마다 자동으로 빌드·배포해주는 알바" |
| **워크플로(workflow)** | "그 알바한테 시킬 일을 적어둔 메모지" |
| **base path** | "내 사이트 주소 끝에 붙는 폴더 이름 (`/yyc-options/`)" |

---

## 3-2. GitHub Pages 켜기

### (1) 본인 레포 페이지 접속
`https://github.com/내아이디/yyc-options`

### (2) 위 메뉴 **Settings** 클릭


### (3) 왼쪽 사이드바 **Pages** 클릭


### (4) **Build and deployment** 박스에서 **Source** 항목

→ 드롭다운 클릭 → **GitHub Actions** 선택  
(*“Deploy from a branch” 가 아니라 **GitHub Actions** 입니다 ⚠️*)


✅ 따로 저장 버튼 없이 자동 저장됨.

⚠️ **드롭다운에 “GitHub Actions” 가 안 보이면**:  
→ 페이지 새로고침 한 번. 그래도 없으면 레포가 **Public**으로 되어 있는지 확인 (무료 계정은 Private에서 Pages 못 쓰는 경우 있음 → Settings → General → 아래쪽 Danger Zone 에서 Public으로 바꾸기).

---

## 3-3. Vite 사이트 주소 맞추기 (base 설정)

지금 그대로 배포하면 사이트가 흰 화면만 나옵니다.  
이유: GitHub Pages는 주소 끝에 `/yyc-options/` 가 붙는데, Vite가 그걸 모름.  
→ AI에게 시키면 끝.

Cursor 채팅창(`Cmd + L` 또는 `Ctrl + L`):

> 🎯 **Cursor에 그대로 복사**  
> ```
> 이 프로젝트를 GitHub Pages 에 배포할 거야.
> @vite.config.js 를 수정해서, 환경변수 VITE_BASE 가 있으면 그 값을 base 로,
> 없으면 "/" 를 base 로 쓰도록 바꿔줘.
> 변경 후 Apply 해줘.
> ```


→ **Apply** 클릭.

✅ `vite.config.js` 안에 `base: process.env.VITE_BASE || "/"` 같은 줄이 들어가 있으면 OK.

---

## 3-4. GitHub Actions 워크플로 만들기 (자동 배포 알바)

이게 핵심. 한 번 만들면 앞으로 **Push만 하면 자동으로 사이트 갱신**됩니다.

### (1) AI에게 한 줄로 시키기

> 🎯 **Cursor에 그대로 복사**  
> ```
> .github/workflows/pages.yml 파일을 새로 만들어 줘.
> 내용:
> - main 브랜치에 push 되면 자동 실행
> - Node 22 사용
> - npm ci → npm run build (env: VITE_BASE = /yyc-options/)
> - dist 폴더를 GitHub Pages 로 배포
> 표준 actions/configure-pages, actions/upload-pages-artifact, actions/deploy-pages 를 써줘.
> 만든 다음 Apply 해줘.
> ```


→ **Apply** 클릭.

### (2) 만들어진 파일 위치 확인

왼쪽 파일 트리에서 **`.github/workflows/pages.yml`** 가 새로 보여야 함.


✅ 파일 안에 `name: Deploy GitHub Pages`, `branches: [main]`,  
`VITE_BASE: /${{ github.event.repository.name }}/` 가 보이면 OK (레포 이름에 맞게 **자동**).

⚠️ GitHub **Secrets** (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) 는 16장에서 등록합니다.

---

## 3-5. Push 해서 배포 시작시키기

2장에서 배운 그대로:

1. 사이드바 **나뭇가지 아이콘**
2. Message: `GitHub Pages 자동 배포 추가`
3. **✓ Commit** → **Sync / Push**


또는 막히면:

> 🎯 **Cursor에 그대로 복사**  
> ```
> 지금 바뀐 거 commit 메시지 정해서 push 해줘.
> ```

---

## 3-6. Actions에서 자동 배포 진행 보기

### (1) GitHub 레포 위 메뉴 **Actions** 클릭


### (2) 왼쪽 **Deploy GitHub Pages** 워크플로 선택

### (3) 위쪽에 방금 commit 이름이 노란 동그라미(돌고 있음)로 떠 있음


### (4) **30초~1분 30초** 기다리면 초록 ✅ 로 바뀜


⚠️ **빨간 ❌가 뜨면**: 그 줄 클릭 → 빨간 단계 클릭 → 빨간 글씨 한 줄 복사 → Cursor 채팅에:

> 🎯 **Cursor에 그대로 복사**  
> ```
> GitHub Actions 빨간 에러 떴어. 메시지 붙여넣을게. 원인이랑 고치는 법 알려주고
> 필요하면 코드/yml 수정해서 Apply 해줘.
>
> [여기에 빨간 글씨 한 줄 붙여넣기]
> ```

---

## 3-7. 진짜 사이트 주소 확인

### (1) 같은 워크플로 가장 최근 ✅ 클릭


또는

### (2) Settings → Pages 다시 가면 위에 **Your site is live at …** 표시


### (3) 그 주소를 클릭


✅ **“Hello ○○아파트”** 가 인터넷 주소에서 보이면 = 진짜 사이트가 살아 있는 상태.

⚠️ **404 가 뜨면**: 5분만 더 기다리세요. GitHub Pages가 처음 활성화될 때 1~10분 지연 정상.  
⚠️ **흰 화면만 뜨면**: `vite.config.js` 의 `base` 가 `/yyc-options/` 가 맞는지 확인 (3-3 단계).

---

## 3-8. 친구한테 보내 보기 (1차 체크포인트 🏁)

### (1) 위 주소를 그대로 카톡으로 본인 친구에게 전송

### (2) 친구 폰에서 “Hello ○○아파트” 가 잘 보이는지 확인


✅ 친구 폰에서 보이면 **3장 합격 + 1차 체크포인트 통과**.

---

## 3-9. 앞으로의 흐름 (외울 필요 X, 그냥 알아두기)

```
코드 수정 → Cursor에서 commit + push
       ↓
GitHub Actions 가 자동으로 빌드
       ↓
30초~1분 후 인터넷 주소가 자동으로 갱신
```

**= 한 번 세팅하면 끝.** 앞으론 push만 하면 됩니다.

---

## 3-10. 3장 완료 체크리스트

- [ ] **Settings → Pages** Source 가 **GitHub Actions** 로 되어 있다
- [ ] `.github/workflows/pages.yml` 파일이 GitHub 레포에서도 보인다
- [ ] **Actions** 탭에 **Deploy GitHub Pages** 워크플로가 ✅ 초록으로 끝났다
- [ ] `https://내아이디.github.io/yyc-options/` 들어가면 **“Hello ○○아파트”** 가 보인다
- [ ] **다른 사람 폰**에서도 같은 페이지가 뜬다
- [ ] 시험 삼아 `App.jsx` 글자 한 글자 바꿔 push → 1분 후 인터넷 주소도 같이 바뀌었다

---

## 3-11. 자주 나는 에러 모음

| 화면 | 원인 | 해결 |
|------|------|------|
| `404 — File not found` | Pages 활성화 직후 지연 | 5~10분 기다리기 |
| 흰 화면만 뜸 | `base` 설정이 `/` 임 | `vite.config.js` 의 `base: "/yyc-options/"` 확인 |
| Actions 가 안 돌아감 | Source 가 “Branch” 로 되어 있음 | Settings → Pages → **GitHub Actions** 로 다시 |
| `Pages site failed` 빨간 에러 | 권한 부족 | Settings → Actions → General → **Workflow permissions** → **Read and write** 체크 |
| 폰에선 글자 잘림 | CSS 미적용 | 정상. 6장에서 모바일 스타일 잡습니다 |
| 폰에서 안 들어가짐 | 같은 와이파이라 캐시 꼬임 | 폰을 LTE로 바꿔 다시 |

---

📌 **다음 장 미리보기**  
4장부터 본격 데이터 다루기. **Supabase 프로젝트**를 만들고 “인터넷 엑셀” 한 칸을 열어봅니다.  
이게 끝나면 “저장된 신청자 데이터” 를 다룰 수 있는 토대가 생깁니다.

---

> 💪 **여기까지 오신 분께**  
> 코드 0회차에서 **이미 인터넷에 본인 사이트가 떠 있는 사람**이 됐어요.  
> 명함에 본인 사이트 주소 한 줄 적어도 됩니다 😄  
> 한 잔 마시고 4장 가시죠.

 The user confirmed they want to continue, so I'm moving on to chapter 3 about creating a real internet address using GitHub Pages. I'll structure it the same way as the previous chapters, showing the final result, time estimate, and starting the checklist.

The first checkpoint is getting the page live so a friend can view it on their phone and see the "Hello" message. I need to cover enabling GitHub Pages in settings, configuring the Vite base path, setting up the GitHub Actions workflow file, pushing the changes, monitoring the build process, confirming the Pages URL, and collecting common errors that might come up.
