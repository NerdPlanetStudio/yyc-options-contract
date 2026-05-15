# 18장. 운영 점검표 + 백업 (혼자 운영하는 사람용)

> **이 장에서 완성하는 것**  
> 1) **주 1회·월 1회 점검 리스트** 1장  
> 2) **신청 데이터 자동 백업** 1가지 (Supabase → Storage)  
> 3) **장애 시 첫 30분 행동표** 1장  
>
> **소요 시간**: 약 1.5시간  
> **난이도**: ★★ (대부분 클릭/복붙)

---

## 18-1. 운영 점검표 (이거 한 장만 폴더에 둬도 충분)

`docs/OPERATIONS_CHECKLIST.md` 새 파일을 만들고 그대로 복붙.

```md
# ○○아파트 옵션 신청 — 운영 점검표

## 매주 1회 (월요일 오전)
- [ ] 사이트 접속 확인 (https://내아이디.github.io/yyc-options/)
- [ ] 일반 신청 흐름 1회 테스트(가짜 입주민으로) — done 화면까지
- [ ] `?admin=1` 로그인 → 신청 목록 표시
- [ ] 누적 엑셀 1회 다운로드 → 마지막 행이 방금 신청인지 확인
- [ ] Supabase → Database → Webhooks → 최근 7일 이내 실패 로그 0건
- [ ] Supabase → Edge Functions → Logs 에 5xx 0건

## 매월 1회 (1일)
- [ ] 관리자 비밀번호 외부 메모 잘 있는지 확인 (분실 시 복구 절차)
- [ ] Supabase 사용량 확인 (Database/Storage/Auth 한계 근접 X)
- [ ] GitHub Actions 최근 30일 모두 ✅
- [ ] 백업 파일이 최근 30일치 다 있는지 (18-3 참고)
- [ ] 입주민 등록부 변동 사항 반영 (필요 시 SQL 한 줄)

## 시즌 종료 시
- [ ] 최종 누적 엑셀 안전 위치에 별도 보관 (USB / 사내 드라이브)
- [ ] 관리자 화면 → 초기화 (15장)
- [ ] 새 시즌 옵션 카탈로그(`src/optionsCatalog.js`) 갱신 후 push
```

이 문서는 **본인 + 인수인계용**. push 해서 GitHub에 같이 두세요.

---

## 18-2. AI에게 "장애 시 30분 행동표" 같이 만들라고 시키기 🎯

> 🎯 **Cursor에 그대로 복사**  
> ```
> docs/INCIDENT_RUNBOOK.md 라는 새 파일을 만들고
> 다음 7가지 장애 시나리오에 대한 "원인 가설 / 즉시 확인 명령 / 1차 조치 / 사용자 안내 문구" 를
> 표 형태로 정리해줘. 한국어, 매뉴얼 톤, 비전공자도 따라할 수 있게.
>
> 1) 사이트가 흰 화면
> 2) 신청 제출 시 "일시적인 오류"
> 3) 관리자 로그인 실패가 모두 "비밀번호 오류"
> 4) 관리자 표 0건 (신청은 들어오는데)
> 5) 누적 엑셀 다운로드 시 401/403
> 6) 누적 엑셀에 새 신청이 안 쌓임 (Webhook 침묵)
> 7) Supabase 가 점검(Outage) 중
>
> 각 항목 아래 "체크 후에도 안 풀리면 → 다음 단계" 까지.
> ```

→ Apply.

✅ `docs/INCIDENT_RUNBOOK.md` 가 생기면 한 번 훑어보고, 본인 환경 정보(URL/이메일)를 빈칸에 채워두세요.

---

## 18-3. 신청 데이터 자동 백업 (가장 가성비 좋은 방법)

> Supabase 무료 플랜은 자동 PITR/백업이 제한적입니다.  
> 가장 간단·무료한 방법은 **GitHub Actions 가 매일 새벽에 누적 엑셀을 받아 다른 폴더에 보관**.

### (1) GitHub Secret 1개 추가

Settings → Secrets and variables → Actions → New repository secret

| Name | Secret |
|------|--------|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Settings → API 의 service_role 키 |

> ⚠️ 이건 **비밀 중의 비밀**. 다른 어디에도 적지 말고 GitHub Secret 에만.

### (2) AI에게 백업 워크플로우 만들라고 시키기 🎯

> 🎯 **Cursor에 그대로 복사**  
> ```
> .github/workflows/backup-workbook.yml 을 만들어줘.
>
> 트리거:
>   - schedule: cron '0 18 * * *'   # UTC 18:00 = KST 03:00
>   - workflow_dispatch
>
> 한 번에 하나의 Job (backup):
>   1) checkout (default)
>   2) Node 20
>   3) curl 로 Supabase Storage object 다운로드:
>      URL = ${{ secrets.VITE_SUPABASE_URL }}/storage/v1/object/application-workbook/yyc-contract-live_V1.xlsx
>      Header: Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
>             apikey: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
>      저장: backups/yyc-contract-live_$(date -u +%Y%m%d).xlsx
>   4) actions/upload-artifact@v4
>      name: workbook-backup-${{ github.run_id }}
>      path: backups/
>      retention-days: 30
>
> 코드에는 하드코딩된 키 절대 X. 모두 ${{ secrets.* }} 만.
> 변경 후 Apply.
> ```

### (3) 한 번 수동 실행해 보기

GitHub → Actions → `backup-workbook` → **Run workflow** → 잠시 후 ✅  
→ 해당 run 페이지 하단 **Artifacts** 에서 엑셀 다운로드.

[스크린샷: Actions Artifacts — workbook-backup_xxxx]

### (4) 매일 03:00 KST 자동 실행 확인

다음 날 Actions 탭에 자동 실행 1줄 추가됐는지.

> 💡 **30일 보관**으로 충분치 않으면, 워크플로우에서 같은 파일을 별도 사설 리포에 push 하는 식으로 늘릴 수 있어요. (부록 D 에서 다룸)

---

## 18-4. 18장 완료 체크리스트

- [ ] `docs/OPERATIONS_CHECKLIST.md` 가 리포에 있다
- [ ] `docs/INCIDENT_RUNBOOK.md` 가 리포에 있다 (빈칸 채움)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 가 **오직 GitHub Secret** 에만 존재
- [ ] `backup-workbook.yml` 수동 실행 ✅, Artifact 다운로드 가능
- [ ] 다음 날 03:00 KST (UTC 18:00) 자동 실행 1건 ✅

---

## 18-5. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| 401 Unauthorized | service_role 키 오타/누락 | Secret 다시 등록 |
| 200인데 파일 빈 0바이트 | 파일명/버킷 오타 | URL 의 bucket·objectKey 확인 |
| cron 안 도는데? | 계정 무료 한도/지연 | UTC 시간 + 5~30분 지연 가능. 다음 날 다시 |
| Artifact 다운 안 됨 | 보관 기간 만료 | retention-days 늘리기 |
| 키가 워크플로우 로그에 보일까봐 걱정 | secret 은 자동 마스킹 | `echo $SECRET` 같은 명령만 안 쓰면 됨 |

---

## 18-6. 보안 메모 (운영 단계)

- service_role 키는 **Supabase 시크릿 + GitHub Secret + 개인 비밀 보관소** 외 어디에도 두지 않음.  
- 백업 파일은 GitHub Actions Artifact (리포 권한자만 다운로드 가능) 에 보관.  
- "30일 자동 보관" + "시즌 종료 시 별도 백업"의 2단 구조로 거의 모든 사고 복구 가능.  
- 관리자 비밀번호는 분기 1회 변경 권장 (`docs/OPERATIONS_CHECKLIST.md` 매월 항목에 미리 적어 둠).

---

> 💪 **여기까지 오신 분께**  
> 16·17·18 묶음으로 **자동 배포 + 보안 최종 잠금 + 운영/백업** 까지 완성.
