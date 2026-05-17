# 새 시즌 시작 — 청량리역 요진 와이시티 옵션 신청

> 시즌 오픈 전 **한 번** 실행. 테스트 신청 후 **반드시 초기화**(15장).

## A. 옵션 카탈로그

- [ ] `src/optionsCatalog.js` — `TYPES` 평형·옵션·가격·Imgur URL을 이번 안내문과 일치
- [ ] 평형 `key`(예: `55A`, `59A`) 가 등록부 `type_key` 와 **완전 동일**
- [ ] `git commit` → `git push` → GitHub Actions **Deploy GitHub Pages** ✅

## B. 입주민 등록부

- [ ] 명단 수령 (동·호·계약자·휴대폰 뒷4자리·평형)
- [ ] (선택) `npm run db:residents-sql` 로 INSERT SQL 생성 → Supabase SQL Editor Run  
      또는 5장 형식으로 `INSERT INTO public.yyc_resident_registry …`
- [ ] `SELECT count(*) FROM public.yyc_resident_registry;` — 인원 수 일치

## C. 사이트 리허설 (오픈 전)

- [ ] `https://______.github.io/yyc-options/` — `step 0` 게이트 → 검증 → `step 1` 옵션 → `step 2` 신청완료
- [ ] 접수번호 `YYC-YYYYMMDD001` 형식 확인
- [ ] `#/admin` 로그인 → 목록·우측 상세·서명·「엑셀(.xlsx) 내려받기」
- [ ] Storage/Webhook: 12장 — 엑셀 마지막 행 1줄 추가 확인
- [ ] ★ **초기화**(15장) — DB·접수번호·누적 엑셀 비우기
- [ ] 엑셀 다시 받기 → **헤더만** (데이터 0건)

## D. 안내문

- [ ] 입주민 URL (위 Pages 주소)
- [ ] 접수 기간·문의처
- [ ] (선택) QR/단축 URL

## E. 운영 준비

- [ ] `docs/INCIDENT_RUNBOOK.md` · `docs/OPERATIONS_CHECKLIST.md` 빈칸 갱신
- [ ] `app_admins` 에 운영자 이메일 (13·17장)
- [ ] Actions → **Backup application workbook** 수동 1회 → Artifact 확인

✅ 위 완료 → **시즌 오픈**
