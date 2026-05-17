# 시즌 종료 (클로징)

> ⚠️ **B(백업·결산) 100% 끝난 뒤에만** C(초기화) 실행.

## A. 마감 직전

- [ ] (선택) `App.jsx` 상단 마감 안내 문구·배너
- [ ] `#/admin` 새로고침 → 총 접수 건수 기록

## B. 마감 후 결산

- [ ] 관리자 → **「엑셀(.xlsx) 내려받기」** → `yyc-시즌YYYY.xlsx` 등으로 저장 (12장 Storage 누적본)
- [ ] Table Editor → `applications` Export CSV (선택 이중 백업)
- [ ] Actions → **backup-workbook** 최신 Artifact 다운로드
- [ ] USB / 사내 드라이브 **3중 보관**
- [ ] 평형·옵션별 집계 (피벗 엑셀 또는 Cursor로 요약)
- [ ] 회사 보고 양식 제출

## C. 다음 시즌 준비

- [ ] `#/admin` → **초기화** (15장) — `applications`·접수번호·Storage 피벗 xlsx
- [ ] `docs/SEASON_START.md` A·B (카탈로그·등록부) 다시 진행
- [ ] GitHub Artifacts 30일 만료 참고 — 시즌 파일은 B에서 이미 로컬 보관

## D. 보안

- [ ] 관리자 Auth 비밀번호 변경 (권장)
- [ ] GitHub / Supabase Secrets 점검
- [ ] 17장 — anon으로 `applications` REST 조회 차단 재확인
