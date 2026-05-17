# 부록 D. 확장 (선택)

> MVP 완료 후 필요한 항목만 골라 적용.

---

## D-1. 커스텀 도메인

GitHub Pages → Custom domain → DNS `CNAME` → `vite` `base: '/'` (루트 도메인 시).  
Supabase Auth redirect·CORS에 새 도메인 추가.

---

## D-2. SMS OTP (7장 보강)

Supabase Phone provider + Twilio 비용.  
게이트 통과 후 `signInWithOtp` — MVP에선 등록부 4칸으로 충분하면 생략.

---

## D-3. 신청 시 관리자 이메일

`notify-new-application` Edge Function + Resend.  
Webhook INSERT 시 `receipt_no`, `dong`, `ho`, `customer_name`, **`total_price`** 만 본문에 (민감정보 X).

---

## D-4. 백업 1년 보관

18장 `backup-workbook` Artifact(30일) + 시즌 종료 시 로컬 3중 보관.  
장기: 사설 리포 `yyc-options-backups` + PAT `GH_BACKUP_TOKEN` 으로 push step 추가.

---

## D-5. 관리자 여러 명

Email signup **OFF** 유지 · Auth Invite · `app_admins` 에 이메일 추가.  
접속: **`#/admin`**.

---

## D-6. CSP 강화

17-6 참고. Pretendard CDN 사용 시 `style-src`·`font-src` 에 `cdn.jsdelivr.net` 포함 필수.

---

## D-7. PWA

`vite-plugin-pwa` — 홈 화면 추가. HTTPS Pages 필요.

---

## D-8. 트래픽·Pro

Supabase Pro · 마감 시간 분산 안내 · backup-workbook 실패 알림.

---

## D-9. Slack 알림

`notify-slack` + `SLACK_WEBHOOK_URL` · Webhook INSERT.  
메시지 예: `[옵션신청] YYC-20260516001 101-1201 홍길동 5000000원`

---

## D-10. 매뉴얼 PDF

```bash
cd yyc-options
npm run manual:pdf
```

통합본: `docs/manual/MANUAL-FULL.md` (`npm run manual:merge`).

---

# 마치며

0~20장 + 부록으로 **신청 → DB → 피벗 엑셀 → `#/admin` → 배포·RLS·운영** 한 세트가 완성됩니다.  
막힐 때: **해당 장 + 19장 검색 + `INCIDENT_RUNBOOK`**.
