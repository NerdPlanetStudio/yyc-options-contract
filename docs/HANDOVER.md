# 인수인계 — 옵션 전자 신청 시스템

## 1) 한 줄 요약

입주민이 **동·호·계약자·휴대폰 뒷4자리·평형**을 입력 → 등록부(`verify_yyc_resident`) 통과 후  
옵션 선택(`step 1`) → 확인·서명·제출(`step 2`) → DB 저장 + Storage 피벗 엑셀 자동 누적(12장 Webhook).

## 2) 접속 주소

| 용도 | URL |
|------|-----|
| 입주민 신청 | `https://________.github.io/yyc-options/` |
| 관리자 | 위 URL + `#/admin` |

## 3) 관리자 계정

| 항목 | 값 |
|------|-----|
| Supabase Auth 이메일 | (예: admin@admin.com) |
| 비밀번호 | (별도 금고 — 문서에 적지 않음) |
| `app_admins` | 위 이메일이 SQL에 등록되어 있어야 목록 조회 (17장) |

## 4) 인프라

| 서비스 | 정보 |
|--------|------|
| GitHub 레포 | |
| Supabase URL | `https://________.supabase.co` |
| GitHub Secrets | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| Supabase secrets | `WORKBOOK_*`, `TEMPLATE_PUBLIC_URL` (12·14·15장) |

## 5) 자주 쓰는 작업

| 할 일 | 방법 |
|------|------|
| 옵션·가격·이미지 변경 | `src/optionsCatalog.js` → push (16장 배포) |
| 입주민 명단 | `yyc_resident_registry` INSERT (5장) |
| 접수 목록·상세·서명 | `#/admin` |
| 결산 엑셀 | 관리자 「엑셀(.xlsx) 내려받기」 |
| 시즌 마감 후 비우기 | 「초기화」(15장) — **백업 후** |
| 장애 | `docs/INCIDENT_RUNBOOK.md` → 교재 19장 |

## 6) 신청 화면 흐름 (앱)

| step | 내용 |
|------|------|
| 0 | 계약자 4칸 + 평형 → 입주민 검증 |
| 1 | 평면도 + 옵션 카드 |
| 2 | 요약 + 서명 + 「신청완료」 |

## 7) 정기 작업

- 매주: `docs/OPERATIONS_CHECKLIST.md`
- 매일 03:00 KST: `backup-workbook` (18장)

## 8) 절대 금지

- `service_role` · webhook secret · DB 비번을 코드·채팅·메일에 기록
- RLS 끄기
- Storage 버킷 Public 전환
- 백업 없이 초기화

## 9) 권한 회수 (퇴사·인계)

1. Supabase Auth — 관리자 비밀번호 Reset  
2. API — `service_role` Reset → GitHub `SUPABASE_SERVICE_ROLE_KEY` 갱신  
3. `WORKBOOK_WEBHOOK_SECRET` 갱신 → Database Webhook 헤더 동기화  
4. GitHub Collaborator / `app_admins` 에서 이전 담당자 제거  

## 10) 교육 매뉴얼

- 통합본: `docs/manual/MANUAL-FULL.md`  
- PDF: `npm run manual:pdf`
