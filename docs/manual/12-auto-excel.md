# 12장. 신청 들어올 때마다 엑셀에 자동 누적

> **이 장에서 완성하는 것**  
> 누가 신청서를 제출하면 → 1초 안에 **Storage 의 `yyc-contract-live_V1.xlsx` 마지막 줄에 자동 추가**.  
> 관리자는 항상 "지금까지 모든 신청" 이 들어찬 엑셀 1개를 받게 됩니다.  
>
> **소요 시간**: 약 2.5시간  
> **난이도**: ★★★★ (Edge Function 첫 등장)

---

## 12-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **Storage 버킷** | "Supabase 안의 클라우드 폴더" |
| **Edge Function** | "DB 옆에 사는 작은 알바 — Supabase가 직접 돌려줌" |
| **Database Webhook** | "행이 들어오면 → 알바한테 전화해줘" |
| **`xlsx` 라이브러리** | "엑셀 파일 읽고/쓰는 도구" |
| **WORKBOOK_WEBHOOK_SECRET** | "알바실 출입 비밀번호 — 아무나 못 부르게" |

전체 흐름:
```
[사용자 제출] → applications INSERT
              → Database Webhook
                → Edge Function append-workbook-row 호출
                  → Storage의 엑셀 다운 → 한 줄 추가 → 다시 업로드
```

---

## 12-2. Storage 버킷·템플릿 준비

### (1) Supabase 왼쪽 메뉴 **Storage**
### (2) **New bucket**

| 항목 | 값 |
|------|-----|
| Name | `application-workbook` |
| Public bucket | ⛔ **OFF** (비공개) |

→ Create bucket.

[스크린샷: New bucket 모달]

### (3) 빈 템플릿 엑셀 1개 준비

엑셀 새 파일 → **A1=순번, B1=접수번호, C1=용도, … (헤더만)** ← **데이터 줄 없음** 으로 저장.  
파일명: `yyc-contract-live_V1.xlsx`.

> 💡 헤더 목록은 코드에서 정확히 일치해야 합니다. 가장 간단한 방법은:  
> 12-3 의 Edge Function 코드를 먼저 본 뒤 그 안의 `HEADERS` 배열을 그대로 엑셀 1행에 가로로 복사.

[스크린샷: 엑셀 파일 — 1행만 헤더, 2행 이후 비어 있음]

### (4) 버킷에 업로드

Storage → `application-workbook` 클릭 → **Upload file** → 위 엑셀 선택.  
업로드 후 파일명이 정확히 **`yyc-contract-live_V1.xlsx`** 인지 확인.

---

## 12-3. Edge Function 폴더·파일 만들기

Cursor 왼쪽 트리 → 프로젝트 루트에 폴더 생성:
```
supabase/
  functions/
    append-workbook-row/
      index.ts
```

`index.ts` 에 그대로 복붙:

```ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import * as XLSX from "https://esm.sh/xlsx@0.18.5";

const HEADERS = [
  "순번","접수번호","용도","동","호","평형",
  "계약자명","주민등록번호 앞6","휴대폰","이메일","주소",
  "비상연락처(이름)","비상연락처(전화)",
  "선택옵션","합계금액","관리자메모","접수일시"
];

const SHEET_NAME = "신청서";

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers":
    "authorization, x-client-info, apikey, content-type, x-workbook-secret"
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const expected = Deno.env.get("WORKBOOK_WEBHOOK_SECRET") ?? "";
    const got = req.headers.get("x-workbook-secret") ?? "";
    if (!expected || got !== expected) {
      return new Response("unauthorized", { status: 401, headers: corsHeaders });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const bucket = Deno.env.get("WORKBOOK_BUCKET") ?? "application-workbook";
    const objectKey = Deno.env.get("WORKBOOK_OBJECT_KEY") ?? "yyc-contract-live_V1.xlsx";
    const templateUrl = Deno.env.get("TEMPLATE_PUBLIC_URL") ?? "";

    const body = await req.json();
    const r = body?.record ?? {};

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { persistSession: false }
    });

    let buf: ArrayBuffer | null = null;
    const dl = await supabase.storage.from(bucket).download(objectKey);
    if (dl.data) {
      buf = await dl.data.arrayBuffer();
    } else if (templateUrl) {
      const res = await fetch(templateUrl);
      if (!res.ok) return new Response("422 template fetch failed", { status: 422, headers: corsHeaders });
      buf = await res.arrayBuffer();
    } else {
      return new Response("422 workbook missing and TEMPLATE_PUBLIC_URL unset", { status: 422, headers: corsHeaders });
    }

    const wb = XLSX.read(new Uint8Array(buf), { type: "array" });
    const ws = wb.Sheets[SHEET_NAME] ?? wb.Sheets[wb.SheetNames[0]];
    if (!ws) return new Response("422 sheet missing", { status: 422, headers: corsHeaders });

    const head = XLSX.utils.sheet_to_json(ws, { header: 1, range: 0 })[0] as string[];
    if (!head || HEADERS.some((h, i) => (head[i] ?? "").toString().trim() !== h)) {
      return new Response("422 header mismatch on pivot sheet", { status: 422, headers: corsHeaders });
    }

    const existing = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
    const nextNo = existing.length;

    const optionsLabel = Array.isArray(r.options)
      ? r.options.map((o: any) => `${o.label}(${(o.price ?? 0).toLocaleString()}원)`).join(", ")
      : "";
    const createdAt = new Date(r.created_at ?? Date.now())
      .toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

    const newRow = [
      nextNo, r.receipt_no, "옵션신청",
      r.dong, r.ho, r.unit_type,
      r.customer_name, r.resident_id_first6,
      r.phone, r.email, r.address,
      r.emergency_name ?? "", r.emergency_phone ?? "",
      optionsLabel, r.total_amount ?? 0,
      r.admin_memo ?? "", createdAt
    ];

    XLSX.utils.sheet_add_aoa(ws, [newRow], { origin: -1 });
    const out = XLSX.write(wb, { type: "array", bookType: "xlsx" });

    const up = await supabase.storage.from(bucket)
      .upload(objectKey, new Blob([out]), { upsert: true, contentType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    if (up.error) return new Response("500 " + up.error.message, { status: 500, headers: corsHeaders });

    return new Response(JSON.stringify({ ok: true, no: nextNo }), {
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  } catch (e) {
    return new Response("500 " + (e?.message ?? String(e)), { status: 500, headers: corsHeaders });
  }
});
```

루트에 **`supabase/config.toml`** 도 만들고:

```toml
project_id = "yyc-options"

[functions.append-workbook-row]
verify_jwt = false
```

---

## 12-4. Supabase CLI 설치 + 로그인 + 시크릿

### (1) CLI 설치 (한 번만)
Cursor 터미널:
```bash
npm install -g supabase
```
✅ 끝나면 `supabase --version` 으로 버전 1줄.

### (2) 로그인
```bash
supabase login
```
→ 브라우저 자동 열림 → Authorize.

### (3) 프로젝트 연결
4장에서 받은 프로젝트 Ref 가 필요. URL `https://abcd1234.supabase.co` 에서 **`abcd1234`** 부분.

```bash
supabase link --project-ref abcd1234
```

### (4) 비밀번호 정해서 시크릿 등록
이 비밀번호는 12-5의 웹훅에도 똑같이 넣을 거예요. 메모장에 적어두기.

```bash
supabase secrets set WORKBOOK_WEBHOOK_SECRET="원하는비밀번호16자이상"
supabase secrets set WORKBOOK_BUCKET="application-workbook"
supabase secrets set WORKBOOK_OBJECT_KEY="yyc-contract-live_V1.xlsx"
```

### (5) 배포
```bash
supabase functions deploy append-workbook-row --no-verify-jwt
```
✅ `Deployed Function` 메시지가 뜨면 OK.

⚠️ `not in a project directory` → `cd /경로/yyc-options` 후 다시.

---

## 12-5. Database Webhook 만들기 (Supabase 대시보드)

### (1) 왼쪽 메뉴 **Database → Webhooks** → **Create a new hook**

[스크린샷: Database → Webhooks 메뉴]

### (2) 입력

| 항목 | 값 |
|------|-----|
| Name | `applications-insert-to-workbook` |
| Table | `applications` |
| Events | ✅ **Insert** 만 |
| Type | `HTTP Request` |
| Method | `POST` |
| URL | `https://abcd1234.supabase.co/functions/v1/append-workbook-row` |
| HTTP Headers | `x-workbook-secret` = 12-4(4)에서 정한 비밀번호 |

→ **Confirm**

[스크린샷: Webhook 폼 — URL과 헤더 한 줄]

---

## 12-6. 끝부터 끝까지 시험

브라우저에서 신청 1건 더 제출.  
1) Supabase **Storage → application-workbook → yyc-contract-live_V1.xlsx** "업데이트 시간"이 방금으로 바뀌었나  
2) 다운로드해서 열기 → 마지막 행에 방금 신청 1줄 추가됐나

[스크린샷: 엑셀 마지막 행에 새 신청 한 줄]

✅ 잘 추가되면 **자동 누적 엑셀** 완성. 14장(관리자 다운로드)에서 이 파일을 안전하게 받게 만듭니다.

---

## 12-7. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| Webhook 결과 401 | secret 불일치 | 시크릿/헤더 양쪽 비번 똑같이 |
| 422 header mismatch | 엑셀 1행 헤더가 코드와 다름 | 엑셀 1행을 코드의 `HEADERS` 그대로 |
| 422 workbook missing | 버킷·파일명 불일치 | secrets 의 `WORKBOOK_OBJECT_KEY` 와 실제 파일명 동일 |
| 500 storage upload fail | 버킷 권한/이름 오타 | `application-workbook` 정확히 |
| Webhook 도는데 엑셀 안 바뀜 | 캐시 | Storage 새로고침. 한 번 더 신청 |
| `not in a project directory` | CLI 위치 | `cd 프로젝트경로` |
| `verify_jwt` 401 | jwt 검사 켜짐 | 배포 시 `--no-verify-jwt` 또는 config.toml 확인 |

---

## 12-8. 12장 완료 체크리스트

- [ ] `application-workbook` 버킷 (비공개) 안에 헤더만 있는 엑셀 1개 업로드
- [ ] `supabase/functions/append-workbook-row/index.ts` 가 있다
- [ ] CLI 로 `secrets set` 3개 + `functions deploy` 완료
- [ ] Webhook 1개 (Insert + URL + 헤더) 등록
- [ ] 새 신청 1건 → 엑셀 마지막 줄 자동 추가
- [ ] **Functions → Logs** 에 200 OK 가 보인다

---

## 12-9. 보안 메모

- 버킷은 **비공개** 상태. 인터넷에서 URL 만으론 못 받음 → 14장에서 **서명 URL** 로 안전하게 받음.  
- 웹훅·Edge Function 사이는 `WORKBOOK_WEBHOOK_SECRET` 로 보호.  
- Edge Function 안에선 **service_role 키** 를 쓰지만, **외부엔 절대 안 노출** (Supabase 환경변수에만 존재).

---

> 💪 **여기까지 오신 분께**  
> 10·11·12 묶음으로 **신청 한 번 → DB 저장 → 자동 누적 엑셀** 까지 흐름이 한 번에 도는 진짜 시스템이 완성됐어요.
