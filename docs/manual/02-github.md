# 2장. GitHub에 처음 올리기 (Cursor에서 클릭 몇 번)

> **이 장에서 완성하는 것**  
> 1장에서 만든 `yyc-options` 폴더가 **GitHub 인터넷 클라우드**에 올라갑니다.  
> 이제 노트북이 부서져도 코드가 안 사라집니다.  
>
> **소요 시간**: 약 1시간  
> **난이도**: ★★ (Cursor의 클릭 몇 번 + 짧은 복붙)

---

## 2-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **Git** | "내 폴더 변경 내역을 자동으로 적어두는 일기장" |
| **GitHub** | "그 일기장을 인터넷 클라우드에 올려두는 곳" |
| **Repository (레포)** | "내 프로젝트 폴더 1개 = 인터넷에 올라간 1개 칸" |
| **Commit** | "지금까지 바꾼 거 한 묶음으로 도장 찍기" |
| **Push** | "내 컴퓨터 → GitHub로 업로드" |

> 💡 외울 필요 없습니다. 다 **버튼 한 번**으로 끝납니다.

---

## 2-2. GitHub에 빈 레포 만들기

### (1) GitHub 접속
[https://github.com](https://github.com) 로그인 → 오른쪽 위 **+ 버튼 → New repository**


### (2) 레포 정보 입력

| 항목 | 입력값 |
|------|-------|
| **Repository name** | `yyc-options` (1장 폴더명과 똑같이) |
| **Description** | `옵션 신청 시스템` (아무거나 써도 됨, 비워도 됨) |
| **Public / Private** | **Private** 추천 (나만 보기) |
| **Add a README / .gitignore / license** | **모두 체크 해제** ⚠️ 중요 |


### (3) 아래쪽 **Create repository** 초록 버튼 클릭

✅ **이런 화면이 보이면 성공**: “Quick setup” 안내 페이지 (까만 코드 박스 여러 줄)


> 💡 위 페이지에 보이는 까만 코드는 **읽지 마세요.** Cursor가 알아서 합니다.

---

## 2-3. Cursor에서 Git 시작하기

### (1) Cursor를 1장 프로젝트 창으로 이동
1장에서 띄워둔 `yyc-options` 창이면 그대로. 닫았으면:

- Cursor → **File → Open Folder** → 바탕화면의 `yyc-options` 선택

### (2) 왼쪽 사이드바 “나뭇가지” 아이콘 클릭


### (3) “Initialize Repository” 파란 버튼 클릭


✅ 왼쪽 패널에 “Changes” 라는 글자 + 파일 목록이 한 무더기 뜸.

---

## 2-4. 첫 Commit (도장 찍기)

### (1) 위쪽 **Message** 입력칸 클릭 → 한 줄 입력

```
첫 커밋
```


### (2) 위쪽 **체크 표시 ✓ Commit** 버튼 클릭

“No staged changes…” 라는 팝업이 뜨면 → **Yes** 클릭 (전부 한 번에 묶어준다는 뜻)

✅ 파일 목록이 비고, 아래쪽에 “Publish Branch” 같은 파란 버튼이 새로 뜸.

⚠️ **“user.email is not set” 같은 빨간 글씨가 뜨면**:  
→ 채팅창(`Cmd + L`)에 그대로 던지세요.

> 🎯 **Cursor에 그대로 복사**  
> ```
> Git 첫 commit 하려는데 "user.email is not set" 에러가 떠.
> 내 GitHub 가입 이메일과 아이디로 git config 설정하는 명령 알려줘.
> 그 후에 다시 commit 해줘.
> ```

---

## 2-5. GitHub에 올리기 (Push)

### (1) 사이드바 아래쪽 **Publish Branch** 또는 **... → Push** 클릭


### (2) GitHub 로그인 팝업이 뜸

브라우저로 이동되면서 **“Authorize Cursor”** 같은 페이지가 뜹니다.


→ **Authorize** 클릭. Cursor로 자동 돌아옵니다.

### (3) “publish to public or private?” 같은 선택지가 뜨면

→ **Private** 선택 (이미 GitHub에 만든 레포가 Private면 자동 매칭됨)

### (4) 잠시 (5~30초) 기다리기

✅ 사이드바 **Changes** 항목이 비어 있고, 아무 에러도 없음.

---

## 2-6. GitHub에서 진짜 올라갔는지 확인

### (1) 브라우저에서 본인 레포 페이지로 이동
주소: `https://github.com/내아이디/yyc-options`

### (2) 새로고침


✅ **이런 게 보이면 성공**: `src/`, `public/`, `package.json`, `index.html` 등 파일이 쭉 나열됨.

⚠️ **여전히 “Quick setup” 페이지면**: Push가 안 된 상태.  
→ Cursor 채팅에:

> 🎯 **Cursor에 그대로 복사**  
> ```
> 지금 main 브랜치 GitHub에 push가 안 된 상태야.
> origin 추가하고 푸시까지 한 번에 해줘.
> 내 레포 주소: https://github.com/내아이디/yyc-options
> ```

(`내아이디` 부분만 본인 아이디로 바꿔서 붙여넣기)

---

## 2-7. .gitignore 확인 (개인정보 안 올라가게)

GitHub 레포에 **`.env` 나 `node_modules` 폴더가 보이면 안 됩니다.**

### (1) 레포 메인 페이지에서 위 두 개가 안 보이는지 확인


✅ 안 보이면 정상 (Vite가 자동으로 .gitignore에 넣어 두었음).

⚠️ **`node_modules` 폴더가 보이면**:

> 🎯 **Cursor에 그대로 복사**  
> ```
> 내 .gitignore 에 node_modules, .env, .env.local, dist 가 있는지 확인하고
> 빠진 거 있으면 추가해 줘. 그 후에 변경사항 commit + push 까지 해줘.
> ```

---

## 2-8. 앞으로 코드 바꿀 때 (3단계만 기억)

매번 코드 고친 다음:

1. **사이드바 나뭇가지 아이콘** 클릭
2. Message에 한 줄 (예: `옵션 카탈로그 추가`) → **✓ Commit**
3. 아래쪽 **Sync Changes** 또는 `...` → **Push**


> 💡 막히면 그냥 **Cursor 채팅**에 한 줄:  
> “지금까지 바꾼 거 commit 메시지 알아서 정해서 push 해줘.”

---

## 2-9. 2장 완료 체크리스트

- [ ] GitHub에 **`yyc-options`** 레포가 만들어져 있다 (Private)
- [ ] Cursor 사이드바에 **나뭇가지 아이콘 + 체크된 상태** 가 보인다
- [ ] 브라우저에서 `https://github.com/내아이디/yyc-options` 들어가면 **`src/`, `package.json` 등 파일이 보인다**
- [ ] `node_modules` 폴더가 GitHub에 **안** 보인다
- [ ] 시험 삼아 `App.jsx` 한 글자 바꾸고 commit + push 했더니 GitHub에서 그 변경이 보인다

---

## 2-10. 자주 나는 에러 모음

| 화면 | 원인 | 해결 |
|------|------|------|
| `Permission denied (publickey)` | GitHub 인증 안 됨 | Cursor 재시작 후 다시 Push (재인증 팝업이 나옴) |
| `failed to push some refs` | 원격에 다른 게 있음 | 채팅창에 “git pull rebase 하고 다시 push 해줘” |
| `nothing to commit` | 바뀐 게 없음 | 정상. 그냥 다음 단계로 |
| Sync Changes 누르니 빨간 알림 | 인증 만료 / 충돌 | 메시지 그대로 복사해 채팅에 붙이기 |
| `node_modules` 가 GitHub에 보임 | .gitignore 누락 | 위 2-7 박스 그대로 |

---

📌 **다음 장 미리보기**  
3장에서는 GitHub에 올린 이 코드를 **GitHub Pages로 인터넷 주소까지 만들어** 봅니다.  
끝나면 친구한테 “이 주소 들어가 봐” 라고 보내줄 수 있는 진짜 사이트가 됩니다.

---

> 💪 **여기까지 오신 분께**  
> 1장에서 “내 컴퓨터에서만 보이던 사이트”의 **소스 코드가 인터넷에 백업**됐어요.  
> 다음 장에서 그 소스를 진짜 인터넷 주소로 띄울 거예요. 잠깐 쉬셨다 가시죠.
