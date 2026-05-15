# 부록 D. 더 안전·확장 (선택 사항)

> **이 부록의 용도**  
> MVP 가 끝난 후 "있으면 좋다" 항목들. 한 항목씩 필요한 것만 골라 적용.

---

## D-1. 커스텀 도메인 붙이기 (예: `apply.example.com`)

**언제 좋나**: 회사 메일 안내문에 GitHub URL 보다 자체 도메인이 보이는 게 신뢰감 ↑.

1. 도메인 1개 구입 (Namecheap/가비아 등) — 보통 만 원/년대.
2. GitHub 리포 → Settings → Pages → **Custom domain** 에 도메인 입력 → Save.
3. 도메인 관리 페이지에서 `CNAME` 레코드 추가  
   - 호스트: `apply` → 값: `__GITHUB_ID__.github.io`
4. 1~30분 후 GitHub Pages 가 자동으로 HTTPS 발급.
5. **Enforce HTTPS** 체크 On.
6. `vite.config.js` 의 `base` 를 `'/'` 로 변경 (도메인 루트 사용 시) → push.

⚠️ Supabase Auth 의 redirect URL, Edge Function CORS 가 새 도메인을 허용하는지 확인.

---

## D-2. 입주민 인증 강도 ↑ (휴대폰 SMS OTP)

**언제 좋나**: 등록부 4칸만으로 부족, "문자 인증 1회"까지 받고 싶을 때.

1. Supabase Authentication → Phone provider 켜기 (Twilio/메시지 비용 발생).
2. AI에게:

> 🎯 **Cursor에 그대로 복사**  
> ```
> @App.jsx 7장 검증 통과 후 다음 단계로 가기 전에
> 사용자가 입력한 휴대폰 풀 번호로 supabase.auth.signInWithOtp({ phone })
> 호출 → 6자리 OTP 입력 → verifyOtp 통과해야 setStep('options').
> 실패 시 한국어 안내. 변경 후 Apply.
> ```

⚠️ 비용·발신 한도 확인 필수. MVP 단계엔 **선택**.

---

## D-3. 신청 완료 시 관리자 이메일 알림

**언제 좋나**: 신청이 들어오자마자 "1건 도착" 알림 받고 싶을 때.

1. Resend ([https://resend.com](https://resend.com)) 가입 → API 키 발급 (무료 100건/일).
2. Supabase secret 등록:
```bash
supabase secrets set RESEND_API_KEY="re_xxx" \
                     ALERT_EMAIL_TO="admin@admin.com" \
                     ALERT_EMAIL_FROM="onboarding@resend.dev"
```
3. AI에게:

> 🎯 **Cursor에 그대로 복사**  
> ```
> supabase/functions/notify-new-application/index.ts 를 만들어줘.
> 동작:
> - POST 로 webhook 호출 받기 (x-workbook-secret 인증 동일)
> - body.record 에서 receipt_no, dong, ho, customer_name, total_amount 만 추출
> - Resend API 로 ALERT_EMAIL_TO 에게 이메일 1통 발송
>   from: ALERT_EMAIL_FROM
>   subject: "[옵션신청] {접수번호} {동}-{호} {이름}"
>   text: 간단한 본문 (개인정보 자세히 X — 접수번호와 평형 위주)
> verify_jwt = false. config.toml에도 추가.
> ```
4. Database Webhook 1개 더 만들기: applications INSERT → 위 함수 URL.

⚠️ 메일 본문에 주민번호·서명 등 민감정보 X. 접수번호·평형까지만.

---

## D-4. 백업 보관 30일 → 1년 (사설 리포 사용)

**언제 좋나**: 시즌 끝난 한참 뒤 자료가 필요할 때를 대비.

1. GitHub에 사설 리포 1개 만들기 (`yyc-options-backups`).
2. 18-3 워크플로우에 단계 추가:

> 🎯 **Cursor에 그대로 복사**  
> ```
> .github/workflows/backup-workbook.yml 마지막 step 다음에
> 사설 리포 (yyc-options-backups) 의 main 브랜치로
> backups/ 폴더 push 하는 step 을 추가해줘.
> peaceiris/actions-gh-pages 같은 액션 대신 일반 git push 사용.
> credentials 는 secrets.GH_BACKUP_TOKEN (Personal Access Token, repo scope) 로.
> ```

⚠️ 사설 리포는 절대 Public 으로 바꾸지 말기. 개인정보 들어 있음.

---

## D-5. 회원 가입 막을지 / 일부 풀지

본 매뉴얼은 "관리자 1명만" 기본. 만약 "여러 직원이 보는 화면" 이 필요하면:

1. Authentication → Email signups **여전히 OFF**.
2. Supabase Auth → Users → Invite 로 이메일 초대.
3. SQL:
```sql
INSERT INTO public.app_admins(email)
VALUES ('staff1@회사.com'), ('staff2@회사.com');
```
4. 직원도 `?admin=1` 로그인 후 화면 사용 가능.

> 절대 "Email signups ON + 화이트리스트 X" 조합으로 두지 말기. 외부인이 가입만 하면 RLS 밖에서 정책 회피 시도 가능.

---

## D-6. CSP 더 단단히 + 로깅

`index.html` 의 CSP (17-6) 를 운영 단계에선 다음처럼 좁힐 수 있음.

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'none';
  base-uri 'self';
  frame-ancestors 'none';
  form-action 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self' data:;
  connect-src 'self' https://__PROJECT_REF__.supabase.co;
" />
```

→ Supabase URL 한 도메인만 허용. 외부 스크립트는 100% 차단.

---

## D-7. 모바일 앱 만들기 (최소 변경)

**언제 좋나**: "앱으로 깔아 놔야 안내하기 편함" 같은 상황.

가장 빠른 길: **PWA (홈 화면에 설치)**. 별도 스토어 등록 불필요.

> 🎯 **Cursor에 그대로 복사**  
> ```
> 이 Vite 앱을 PWA 로 만들어줘. vite-plugin-pwa 사용.
> manifest 의 name 은 "○○아파트 옵션 신청", short_name 은 "옵션신청".
> 아이콘은 public/pwa-192.png, public/pwa-512.png (자리만 잡고, 실제 이미지는 후속).
> 오프라인 시 "인터넷 연결을 확인해 주세요" 안내 페이지 1장.
> 변경 후 Apply.
> ```

`https://...` HTTPS 라면 Safari·Chrome 에서 "홈 화면에 추가" 로 설치됨.

---

## D-8. 더 큰 시즌 / 동시 접속 폭증 대비

- Supabase Pro 플랜 ($25/월) 으로 업그레이드: PITR 백업·동시접속·DB 크기 ↑.
- Edge Function 의 무거운 작업(엑셀 read·write)을 가능한 짧게 (지금 코드 OK).
- 마감 1시간 동안의 폭증이 예상되면 **마감 시간 분산 안내** (예: 동·호 끝자리별 시간대).
- 모니터링: Supabase Logs + GitHub Actions backup 의 빈도/실패 알림 (이메일).

---

## D-9. 운영 자동화 (Slack 알림)

신청 1건마다 Slack 채널에 한 줄 알림.

> 🎯 **Cursor에 그대로 복사**  
> ```
> supabase/functions/notify-slack/index.ts 를 만들어줘.
> Webhook 으로 신청 INSERT 받기 (x-workbook-secret 인증).
> SLACK_WEBHOOK_URL 시크릿으로 Incoming Webhook 호출.
> 메시지: "[옵션신청] {receipt_no} 동{dong}-{ho} {customer_name} 합계 {total_amount}원"
> verify_jwt = false. config.toml 에도 추가.
> ```

같은 webhook 에 Database Webhook 1개 더 연결.

---

## D-10. 매뉴얼 자체 백업

이 매뉴얼(`docs/*.md`) 도 운영 자산. 다음을 권장:

- 모든 챕터 파일을 PDF 로 1회 export → 사내 드라이브에 보관 (전기 끊겨도 종이로 출력 가능).
- Cursor에:

> 🎯 **Cursor에 그대로 복사**  
> ```
> docs/ 폴더의 모든 .md 를 합쳐 docs/MANUAL-FULL.md 한 장으로 묶고,
> 목차 자동 생성. 변경 후 Apply.
> ```

→ 그 파일 1장으로 외부에 인쇄·공유.

---

# 마치며

> **여기까지 정말 수고하셨습니다.**  
> 0장에서 "Cursor 설치" 한 줄로 시작해서, 지금은:  
> - 사용자 사이트 (GitHub Pages)  
> - 인터넷 엑셀(DB·Storage)  
> - 자동 누적 엑셀 (Webhook + Edge Function)  
> - 관리자 운영 화면 (목록·상세·다운로드·초기화)  
> - 자동 배포 (GitHub Actions)  
> - 보안 잠금 (RLS·XSS·Signed URL)  
> - 운영 점검표·인수인계 문서·자동 백업  
>
> 까지 한 세트가 본인 손으로 굴러갑니다.  
>
> 매뉴얼은 한 번에 다 외울 필요 전혀 없어요.  
> **막힐 때마다 "해당 장 + Cursor + 에러 메시지 한 줄"** 이 모든 답입니다.  
> 새 시즌 1번씩 돌릴 때마다 본 매뉴얼에 본인 메모(에러·해결·팁) 를 한 줄씩 더해 두세요.  
> 1년 뒤 본인이 가장 든든해 합니다. 화이팅.
