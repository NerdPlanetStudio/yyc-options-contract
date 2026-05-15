# 0장. 준비물 — 계정 만들고 프로그램 깔기

> **이 장에서 완성하는 것**  
> 컴퓨터 한 대에 **개발 도구 1개 + 인터넷 계정 3개**가 준비됩니다.  
> 다 끝나면 본격 작업 들어갈 준비 완료입니다.  
>
> **소요 시간**: 1.5~2시간  
> **난이도**: ★ (가장 쉬움. 클릭만 하시면 됩니다)

---

## 0-1. 이 장에서 만들 것

| 항목 | 뭐예요? (1줄 비유) |
|------|-------------------|
| **Cursor** | "AI가 코드 대신 짜주는 메모장" |
| **Node.js** | "코드를 컴퓨터가 읽게 해주는 번역기" |
| **GitHub 계정** | "코드 인터넷 클라우드 (구글 드라이브 비슷)" |
| **Supabase 계정** | "인터넷에 있는 엑셀 창고 + 자물쇠" |
| **Gmail 계정** | "위 3개 가입할 때 쓰는 이메일 (이미 있으면 패스)" |

> 💡 위 5개 모두 **무료**입니다. 신용카드 안 넣으셔도 됩니다.

---

## 0-2. Gmail 계정 (이미 있으면 통째로 건너뛰기)

이미 쓰는 메일이 있으면 그거 쓰셔도 됩니다. 새로 만드신다면:

1. [https://accounts.google.com/signup](https://accounts.google.com/signup) 접속
2. 이름·아이디·비밀번호 입력 → **다음** 계속 누르기
3. 휴대폰 번호 인증 (받은 6자리 숫자 입력)


✅ **이런 화면이 보이면 성공**: 오른쪽 위에 동그란 내 프로필 아이콘이 뜸.

---

## 0-3. GitHub 계정 만들기

1. [https://github.com](https://github.com) 접속 → 오른쪽 위 **Sign up** 클릭


2. 이메일·비밀번호·아이디 입력
   - **아이디는 영어로 짧게** (예: `nerdplanet2026`) — 나중에 사이트 주소에 들어갑니다
3. 캡차(“퍼즐 맞추기”) 풀고 → **Create account**
4. 가입 후 “What do you do?” 같은 질문 나오면 아무거나 선택 → **Continue**


✅ **이런 화면이 보이면 성공**: 왼쪽 위에 **고양이 옥토캣** 로고, 오른쪽 위에 내 프로필 아이콘이 뜸.

⚠️ **이런 화면이 뜨면**:
- "Username already taken" → 아이디가 이미 있음. 뒤에 숫자 붙이세요 (예: `nerdplanet2026`)
- 가입 메일이 안 와요 → 스팸함 확인. 거기도 없으면 5분 후 한 번 더 시도

---

## 0-4. Supabase 계정 만들기

1. [https://supabase.com](https://supabase.com) 접속 → 오른쪽 위 **Start your project** 클릭


2. **Continue with GitHub** 클릭 (방금 만든 GitHub 계정으로 자동 가입됨)
3. GitHub에서 “Authorize Supabase” 화면 나오면 **Authorize** 클릭


✅ **이런 화면이 보이면 성공**: Supabase 대시보드에 **New project** 라는 초록 버튼이 보임.

> 💡 프로젝트는 아직 만들지 마세요. 4장에서 같이 만듭니다.

---

## 0-5. Cursor 다운로드 + 설치

**Cursor = AI 비서가 옆에 앉아 코드를 대신 짜주는 메모장**입니다.

1. [https://cursor.com](https://cursor.com) 접속 → **Download** 클릭
2. 본인 컴퓨터 종류에 맞는 거 선택
   - **Mac (M1/M2/M3)** → "Download for Mac (Apple Silicon)"
   - **Mac (Intel)** → "Download for Mac (Intel)"
   - **Windows** → "Download for Windows"


3. 다운로드된 파일 더블클릭 → **응용프로그램 폴더로 드래그** (Mac) / **Next 계속** (Windows)
4. Cursor 첫 실행 → 로그인 화면이 뜨면 **GitHub 계정으로 로그인**


5. AI 모델 선택 화면이 뜨면 **무료 옵션** 선택 (`claude-3-haiku` 같은 거 무료)


✅ **이런 화면이 보이면 성공**: 검은 배경 메모장 같은 화면이 뜨고, 오른쪽에 채팅창이 보임.

---

## 0-6. Node.js 설치 (코드를 컴퓨터가 알아듣게 해주는 번역기)

1. [https://nodejs.org](https://nodejs.org) 접속
2. 페이지 가운데 **두 개 버튼 중 왼쪽 (LTS)** 클릭


3. 다운로드된 파일 더블클릭 → **계속 / Next** 만 누름 (옵션 건드리지 말기)

### 설치 잘 됐는지 확인 (Cursor에서)

1. Cursor 열기
2. 위 메뉴 **Terminal → New Terminal** 클릭


3. 아래쪽에 검은 창이 열림. 거기에 아래 한 줄 **그대로 붙여넣고 Enter**:

```bash
node --version
```

✅ **이런 게 뜨면 성공**: `v22.11.0` 같은 버전 숫자

⚠️ **`command not found: node` 가 뜨면** → 설치가 제대로 안 됨. **Cursor 한 번 껐다 다시 켜고** 같은 명령 다시 입력. 그래도 안 되면 Node.js 다시 설치.

---

## 0-7. (선택) Cursor에 한국어 메뉴 깔기

영어 메뉴가 어렵게 느껴지시면:

1. 왼쪽 사이드바 **사각형 4개 아이콘** (Extensions) 클릭
2. 검색창에 `Korean` 입력
3. **Korean Language Pack for Visual Studio Code** → **Install**
4. 오른쪽 아래 “Restart” 뜨면 클릭


✅ Cursor 메뉴가 한국어로 바뀌어 있음.

---

## 0-8. 0장 완료 체크리스트

아래 6개가 **전부 ✅** 면 1장으로 가셔도 됩니다.

- [ ] Gmail로 로그인됨 (또는 기존 메일 사용 결정)
- [ ] **GitHub** 계정 생성 + 로그인됨 → 내 아이디 메모: `__________`
- [ ] **Supabase** 대시보드 접속됨 (New project 버튼 보임)
- [ ] **Cursor** 설치 + 실행됨 + 채팅창 보임
- [ ] **Node.js** 설치 → `node --version` 에서 버전 숫자 나옴
- [ ] (선택) Cursor 한국어 메뉴

📌 **다음 장 미리보기**  
1장에서는 Cursor를 열어 **빈 React 프로젝트 1개**를 만들어 봅니다. AI에게 “React 빈 프로젝트 만들어 줘” 한 줄만 던지면 됩니다.

---

> 🎯 **Cursor에 그대로 복사** (1장에서 쓸 첫 프롬프트 미리보기)
> ```
> 내 컴퓨터의 바탕화면에 yyc-options 라는 폴더를 만들고,
> 그 안에 Vite + React 빈 프로젝트를 초기화해 줘.
> 진행하기 전에 어떤 명령어를 실행할지 먼저 보여줘.
> ```

---

> 💪 **여기까지 오신 분께**  
> 0장은 “계정 만들기”라 지루했을 수 있는데, 이게 끝나면 **이제부터는 진짜 만드는 재미**입니다. 한숨 돌리시고 1장으로 가세요.

 I'm planning out the structure for a beginner-friendly Chapter 0 guide that walks users through setup step-by-step, with visual screenshots, clear click-and-copy instructions, success verification checks, and a callout section for common mistakes.
