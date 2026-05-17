# 20장. 시즌 시작/종료 + 인수인계 가이드

> **이 장에서 완성하는 것**  
> 시즌 **오픈·마감·인계**용 문서 3개를 레포에 두고, **리허설 시즌** 1회로 전체를 검증합니다.  
>
> **선행**: 5·11~18장  
> **소요 시간**: 약 1.5시간  
> **난이도**: ★★

---

## 20-1. 미리 알아두기

| 용어 | 설명 |
|------|------|
| **시즌** | 옵션 모집 1회차 |
| **카탈로그** | `src/optionsCatalog.js` (`TYPES`, Imgur) |
| **등록부** | `yyc_resident_registry` + `verify_yyc_resident` |
| **클로징** | 백업 → 결산 → 초기화 → 다음 시즌 준비 |

앱 흐름: `step 0` 게이트 → `step 1` 옵션 → `step 2` 서명·제출.  
관리자: `#/admin`. 접수번호: `YYC-YYYYMMDD001`.

---

## 20-2. 새 시즌 시작

**정본:** `docs/SEASON_START.md`

1. 파일 열기 → 체크박스 실행  
2. URL·연락처 빈칸 채우기 → commit  

핵심 순서:

```
카탈로그·등록부 갱신 → push 배포
→ 테스트 신청 1건 (검증·옵션·신청완료)
→ #/admin · Webhook · 엑셀 1줄 확인
→ ★ 초기화 (15장) → 엑셀 헤더만
→ 시즌 오픈
```

---

## 20-3. 시즌 종료

**정본:** `docs/SEASON_CLOSE.md`

```
마감 직전 건수 확인
→ 엑셀·CSV·Artifact 3중 백업
→ 결산·보고
→ (백업 확인 후) 초기화
→ SEASON_START 로 다음 시즌 준비
```

⚠️ **초기화는 백업 완료 후에만.**

---

## 20-4. 인수인계 1장

**정본:** `docs/HANDOVER.md`

- 빈칸(`________`) 채운 뒤 PDF 출력 가능  
- `docs/OPERATIONS_CHECKLIST.md`, `docs/INCIDENT_RUNBOOK.md` 와 함께 전달  

다른 담당자가 **30분 안에** 접수 확인·엑셀 다운·초기화까지 할 수 있게 구성됨.

---

## 20-5. 리허설 시즌 (오픈 전 1회)

| 단계 | 할 일 | 기대 |
|------|------|------|
| 1 | SEASON_START A·B — 가짜 카탈로그·등록부 | push, INSERT |
| 2 | 일반 화면 신청 3건 | `YYC-YYYYMMDD001` ~ 003 |
| 3 | `#/admin` 목록·상세·서명 | 3건 |
| 4 | 엑셀 다운로드 + Webhook Logs | 피벗 3행 |
| 5 | backup-workbook 수동 Run | Artifact 동일 파일 |
| 6 | **초기화** | 목록 0건 |
| 7 | 신청 1건 | 접수번호 다시 **001** |

✅ 7단계 무오류 → 실전 오픈 OK.

---

## 20-6. 완료 체크리스트

- [ ] `docs/SEASON_START.md` / `SEASON_CLOSE.md` / `HANDOVER.md` 존재·빈칸 채움
- [ ] 리허설 7단계 통과
- [ ] backup-workbook 자동 실행 최근 1건 ✅
- [ ] 인계 시 위 3문서 + OPERATIONS + INCIDENT_RUNBOOK 전달

---

## 20-7. 시즌 단위 사고

| 증상 | 해결 |
|------|------|
| 「등록되지 않은 정보」 다수 | 등록부 누락·`type_key` 불일치 → 5장·SEASON_START B |
| DB엔 있는데 엑셀 없음 | 12장 Webhook·피벗 헤더 |
| 마감 후 다운로드 실패 | 14장 `sign-application-workbook` · secrets |
| 새 시즌에 옛 데이터 | 15장 초기화 — 백업 먼저 |
| 인수인계 후 막힘 | HANDOVER 빈칸 · `#/admin` |

상세 코드: 교재 **19장**, `docs/INCIDENT_RUNBOOK.md`.

---

## 20-8. 보안 (시즌)

- 마감 후 **백업 → 초기화**로 PII 체류 최소화  
- 인계 시 **service_role·관리자 비번·webhook secret** 회전  
- 시즌 엑셀은 Artifact 30일 + 로컬 영구 보관 병행

---

> 💪 **0~20장 본문 완료**  
> 부록 A~D·19장은 참고·확장용입니다.  
> PDF: `npm run manual:pdf`
