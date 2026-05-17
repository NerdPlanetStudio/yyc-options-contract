# 청량리역 요진 와이시티 옵션 신청 — 운영 점검표

> 빈칸을 본인 환경에 맞게 채운 뒤, 매주·매월 체크합니다.  
> 사이트: `https://________________.github.io/yyc-options/`  
> 관리자: 위 주소 + `#/admin`

## 매주 1회 (월요일 오전 권장)

- [ ] 사이트 접속 — 신청 화면(`step 0` 게이트) 정상
- [ ] 등록부에 있는 **테스트 세대**로 신청 1건 → `step 2` 신청완료·접수번호 배너
- [ ] `#/admin` 로그인 → 목록에 방금 건 표시, 상세·서명 확인
- [ ] 「엑셀(.xlsx) 내려받기」→ 12장 Storage 누적본에 마지막 행 일치
- [ ] Supabase → **Database → Webhooks** → 최근 7일 실패 0건
- [ ] Supabase → **Edge Functions** → `append-workbook-row` 5xx 0건

## 매월 1회 (1일 권장)

- [ ] 관리자 비밀번호·복구 절차 메모 확인
- [ ] Supabase 사용량 (Database / Storage / Auth 한도)
- [ ] GitHub **Actions** → Deploy GitHub Pages · backup-workbook 최근 30일 ✅
- [ ] **backup-workbook** Artifact 1개 다운로드해 열리는지 확인
- [ ] 입주민 등록부(`yyc_resident_registry`) 변동 반영 여부
- [ ] `app_admins` 에 운영 담당 이메일 등록 여부 (17장)

## 시즌 종료 시

- [ ] 최종 누적 엑셀 + (선택) Table Editor Export → USB/사내 드라이브 보관
- [ ] 관리자 **초기화** (15장) — 백업 **후에만**
- [ ] `src/optionsCatalog.js` 다음 시즌 반영 후 `git push`

## 긴급 시

→ `docs/INCIDENT_RUNBOOK.md`  
→ 교재 19장 에러 카탈로그
