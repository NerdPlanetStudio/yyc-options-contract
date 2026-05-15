# 4장. Supabase 프로젝트 만들고 "인터넷 엑셀" 열기

> **이 장에서 완성하는 것**  
> Supabase 가입 → 프로젝트 1개 생성 → 빈 테이블 1개 만들기.  
> 5장에서 진짜 입주민 데이터를 넣을 빈 박스를 미리 준비합니다.  
>
> **소요 시간**: 약 1시간  
> **난이도**: ★★ (대부분 클릭, SQL은 5장에서)

---

## 4-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **Supabase 프로젝트** | "회사 1개 = 인터넷 엑셀 창고 1동" |
| **Database** | "그 창고 안의 엑셀 파일 (여러 시트=테이블)" |
| **Table (테이블)** | "엑셀 시트 1장" |
| **Row / Column** | "엑셀의 행 / 열" |
| **API URL · API Key** | "내 사이트가 이 창고에 들어갈 때 쓰는 주소·열쇠" |

---

## 4-2. 새 Supabase 프로젝트 만들기

### (1) Supabase 로그인
[https://supabase.com/dashboard](https://supabase.com/dashboard) → 0장에서 만든 GitHub 계정으로 로그인.

### (2) 가운데 초록 **New project** 클릭

[스크린샷: Supabase 대시보드 — New project 초록 버튼]

### (3) 프로젝트 정보 입력

| 항목 | 입력값 |
|------|--------|
| **Organization** | 자동 생성된 거 그대로 |
| **Project name** | `yyc-options` |
| **Database Password** | **무작위 generate 클릭 → 메모장에 따로 저장** ⚠️ |
| **Region** | **Northeast Asia (Seoul)** |
| **Pricing plan** | **Free** |

[스크린샷: New project 폼 — 이름·비번 generate·Seoul 지역 선택]

### (4) 아래쪽 **Create new project** 클릭

→ 1~2분 대기 (회사 설립 중)

✅ **이런 화면이 보이면 성공**: 왼쪽 사이드바에 **🏠 Home, 🗄️ Database, 🔐 Authentication** 같은 메뉴가 보임.

⚠️ **비밀번호 잃어버리면**: Settings → Database → Reset password 가능. 그래도 메모장에 적어 두는 게 편함.

---

## 4-3. 내 프로젝트 주소(URL)와 열쇠(API Key) 복사하기

이건 **5장 이후 코드에서 계속 씁니다.** 메모장에 미리 따로 적어 두세요.

### (1) 왼쪽 메뉴 맨 아래 ⚙️ **Project Settings**

### (2) 왼쪽 사이드바 **API** 클릭

[스크린샷: Project Settings → API 탭]

### (3) 두 개를 메모장에 복사

| 이름 | 어디에 있나 | 형태 |
|------|-------------|------|
| **Project URL** | 위쪽 "Project URL" 박스 | `https://abcd1234.supabase.co` |
| **anon (public) key** | "Project API Keys" 의 첫 번째 줄 | `eyJhbGc...` (긴 문자열) |

[스크린샷: API 페이지 — Project URL과 anon key의 Copy 버튼]

✅ 메모장에 두 줄 다 들어 있음.

> ⚠️ **service_role** 라고 쓰여 있는 두 번째 키는 **절대 복사·공유하지 마세요.** 17장에서 따로 다룹니다.

---

## 4-4. 빈 테이블 1개 만들어 보기 (연습용)

진짜 테이블은 5장에서 SQL로 만들 거예요. 여기선 **"테이블이 뭔지" 클릭으로 한 번 체험**.

### (1) 왼쪽 메뉴 **Table Editor** 클릭

[스크린샷: Supabase 왼쪽 메뉴 — Table Editor]

### (2) 가운데 **+ New table** 클릭

### (3) 입력

| 항목 | 값 |
|------|-----|
| Name | `test_table` |
| Description | (비워두기) |
| **Enable Row Level Security** | **체크 OFF** (연습용이라) |

→ **Save** 클릭

[스크린샷: New table 모달 — name과 RLS 체크박스]

### (4) 줄 한 개 넣어 보기

테이블 화면 위쪽 **+ Insert → Insert row** → `id` 자동 → **Save**

[스크린샷: Insert row — id만 있는 한 줄 추가]

✅ 표에 한 줄이 보임 = 인터넷 엑셀에 데이터 한 줄 넣은 상태.

### (5) 연습 끝났으니 지우기

위 메뉴 ⋯ → **Delete table** → `DELETE` 입력 → 확인  
(일부러 비우는 거라 다음 장에 영향 없음)

---

## 4-5. 4장 완료 체크리스트

- [ ] Supabase에 **`yyc-options`** 프로젝트가 떠 있다
- [ ] 메모장에 **Project URL + anon key** 두 줄이 적혀 있다
- [ ] 데이터베이스 비밀번호도 메모장에 적혀 있다
- [ ] Table Editor 들어가면 빈 화면이 뜬다
- [ ] (연습) 테이블 만들고 → 줄 넣고 → 지우는 흐름을 한 번 해봤다

---

## 4-6. 자주 나는 에러 모음

| 화면 | 원인 | 해결 |
|------|------|------|
| 프로젝트 만들고 30분 지나도 표시 안 됨 | 프리 플랜 가끔 지연 | F5. 그래도면 다시 만들기 |
| API 페이지에 키가 회색 | 마우스 올리면 "Reveal" 버튼 보임 | Reveal 후 복사 |
| Region 못 고름 | 일부 국가에서 잠금 | 가까운 다른 region (Tokyo 등) 선택 |
| 비번 강도 약함 경고 | 너무 짧음 | generate 버튼 한 번 더 |

---

📌 **다음 장 미리보기**  
5장에선 진짜 입주민 등록부 테이블을 SQL로 만듭니다. SQL 박스에 **그대로 복붙** 한 번이면 끝.
