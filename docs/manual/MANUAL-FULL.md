<!-- 앞장 (front-pages.html) — MANUAL-FULL 맨 앞 HTML 블록 -->
<div class="manual-front-pages">
<style>
.manual-front-pages *{margin:0;padding:0;box-sizing:border-box}
/* ── 페이지 공통 ── */
.manual-front-pages .page {
    width:210mm;min-height:297mm;
    margin:0 auto 20px;
    position:relative;overflow:hidden;
    page-break-after:always;
  }

  /* ══════════════════════════════
     PAGE 1 — 표지
  ══════════════════════════════ */
  .cover{
    background:#0A1628;
    color:#fff;
    display:flex;flex-direction:column;
    padding:56px 64px;
    justify-content:space-between;
  }
  .cover-grid{
    position:absolute;top:0;left:0;width:100%;height:100%;
    background-image:
      linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
    background-size:36px 36px;
    pointer-events:none;
  }
  .cover-accent{width:56px;height:4px;background:#0D9488;border-radius:2px;position:relative;z-index:1}
  .cover-main{flex:1;display:flex;flex-direction:column;justify-content:center;gap:0;position:relative;z-index:1;padding:48px 0 32px}
  .cover-label{font-size:11px;letter-spacing:3px;color:#64748B;text-transform:uppercase;margin-bottom:28px;font-weight:400}
  .cover-title-sub{font-size:40px;font-weight:700;line-height:1.15;color:#0D9488;margin-bottom:6px}
  .cover-title-main{font-size:40px;font-weight:700;line-height:1.15;color:#F1F5F9;margin-bottom:32px}
  .cover-divider{width:48px;height:1px;background:#1E3A5F;margin-bottom:32px}
  .cover-desc{font-size:19px;color:#94A3B8;font-weight:300;margin-bottom:10px;line-height:1.5}
  .cover-subdesc{font-size:14px;color:#475569;line-height:1.6}
  .cover-stack{border-top:1px solid #1E293B;padding-top:28px;position:relative;z-index:1}
  .cover-stack-label{font-size:10px;letter-spacing:2.5px;color:#334155;text-transform:uppercase;margin-bottom:14px}
  .stack-row{display:flex;gap:12px;flex-wrap:wrap}
  .stack-badge{
    padding:5px 14px;font-size:12px;border-radius:4px;font-weight:500;
    border:1px solid;letter-spacing:.3px;
  }
  .badge-react{background:#0A1F3C;border-color:#1E3A5F;color:#60A5FA}
  .badge-supa{background:#071E1E;border-color:#0F3030;color:#2DD4BF}
  .badge-github{background:#0F1E30;border-color:#1E2F44;color:#7DD3FC}
  .badge-cursor{background:#150F2E;border-color:#2A1A50;color:#A78BFA}
  .badge-sql{background:#1A1200;border-color:#382500;color:#FBB83A}
  .cover-footer{
    display:flex;justify-content:space-between;align-items:center;
    margin-top:28px;padding-top:18px;border-top:1px solid #1E293B;
    font-size:11px;color:#334155;position:relative;z-index:1;
  }

  /* ══════════════════════════════
     PAGE 2 — 목차
  ══════════════════════════════ */
  .toc{
    background:#ffffff;
    padding:52px 58px;
    display:flex;flex-direction:column;
  }
  .toc-header{margin-bottom:36px}
  .toc-title{font-size:28px;font-weight:700;color:#0F172A;letter-spacing:-.3px;margin-bottom:8px}
  .toc-underline{width:40px;height:3px;background:#0D9488;border-radius:2px}
  .toc-parts{display:flex;flex-direction:column;gap:18px}
  .toc-part{}
  .part-header{
    display:flex;align-items:center;gap:10px;
    margin-bottom:8px;padding-bottom:6px;
    border-bottom:1px solid #E2E8F0;
  }
  .part-num{
    font-size:10px;font-weight:700;color:#fff;
    background:#0D9488;border-radius:3px;
    padding:2px 7px;letter-spacing:.5px;
  }
  .part-num.p2{background:#3B82F6}
  .part-num.p3{background:#6366F1}
  .part-num.p4{background:#8B5CF6}
  .part-num.p5{background:#F59E0B}
  .part-num.p6{background:#EF4444}
  .part-num.pa{background:#64748B}
  .part-title{font-size:13px;font-weight:700;color:#1E293B;flex:1}
  .chapter-list{display:flex;flex-direction:column;gap:3px}
  .chapter-item{
    display:flex;align-items:baseline;gap:8px;
    padding:2px 4px;border-radius:3px;
  }
  .ch-num{font-size:11px;font-weight:700;color:#94A3B8;min-width:32px}
  .ch-title{font-size:12px;color:#334155;flex:1;line-height:1.4}
  .ch-star{font-size:10px;color:#CBD5E1;white-space:nowrap}
  .ch-star.s1{color:#FCD34D}
  .ch-star.s2{color:#F59E0B}
  .ch-star.s3{color:#F97316}
  .ch-star.s4{color:#EF4444}
  .toc-legend{
    margin-top:18px;padding:10px 14px;
    background:#F8FAFC;border-radius:6px;
    border:1px solid #E2E8F0;
    font-size:10px;color:#64748B;line-height:1.8;
  }

  /* ══════════════════════════════
     PAGE 3 — 파이프라인
  ══════════════════════════════ */
  .pipeline{
    background:#ffffff;
    padding:48px 52px;
    display:flex;flex-direction:column;
  }
  .pipe-header{margin-bottom:28px}
  .pipe-title{font-size:22px;font-weight:700;color:#0F172A;margin-bottom:6px}
  .pipe-sub{font-size:13px;color:#64748B}
  .pipe-section-label{font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:700;margin:16px 0 10px;color:#94A3B8}
  .pipe-section-label.first{margin-top:0}
  .pipe-svg-wrap{width:100%}

  @media print{
.manual-front-pages .page {margin:0;page-break-after:always}
  }

/* PDF: 각 앞장 페이지 분리 */
.manual-front-pages .page {
  page-break-after: always !important;
  break-after: page !important;
}
.manual-front-pages .page:last-child {
  page-break-after: auto !important;
  break-after: auto !important;
}
@media print {
  .manual-front-pages .page {
    page-break-after: always !important;
    break-after: page !important;
  }
  .manual-front-pages .page:last-child {
    page-break-after: auto !important;
    break-after: auto !important;
  }
}
</style>

<!-- ════════════════════════════════
     PAGE 1 : 표지
════════════════════════════════ -->
<div class="page cover">
  <div class="cover-grid"></div>

  <div class="cover-accent"></div>

  <div class="cover-main">
    <div class="cover-label">Full-Stack Development Manual · 풀스택 실전 매뉴얼</div>
    <div class="cover-title-sub">○○아파트</div>
    <div class="cover-title-main">옵션 신청 시스템 만들기</div>
    <div class="cover-divider"></div>
    <div class="cover-desc">코딩 0회차를 위한 풀스택 실전 매뉴얼</div>
    <div class="cover-subdesc">
      마우스 클릭 + AI 복붙만으로 완성하는 실전 SaaS 시스템<br>
      0장 ~ 20장 + 부록 A·B·C·D
    </div>
  </div>

  <div class="cover-stack">
    <div class="cover-stack-label">기술 스택</div>
    <div class="stack-row">
      <span class="stack-badge badge-react">React + Vite</span>
      <span class="stack-badge badge-supa">Supabase</span>
      <span class="stack-badge badge-github">GitHub Pages</span>
      <span class="stack-badge badge-cursor">Cursor AI</span>
      <span class="stack-badge badge-sql">PostgreSQL · Edge Functions</span>
    </div>
  </div>

  <div class="cover-footer">
    <span>v1.0 &nbsp;·&nbsp; 2026년 5월</span>
    <span>코딩 0회차 기준 &nbsp;·&nbsp; 21개 챕터 + 부록</span>
  </div>
</div>


<!-- ════════════════════════════════
     PAGE 2 : 목차
════════════════════════════════ -->
<div class="page toc">
  <div class="toc-header">
    <div class="toc-title">목차</div>
    <div class="toc-underline"></div>
  </div>

  <div class="toc-parts">

    <!-- 1부 -->
    <div class="toc-part">
      <div class="part-header">
        <span class="part-num">1부</span>
        <span class="part-title">준비 — 계정 만들고 도구 깔기</span>
      </div>
      <div class="chapter-list">
        <div class="chapter-item"><span class="ch-num">0장</span><span class="ch-title">준비물 — 계정 만들고 프로그램 깔기</span><span class="ch-star s1">★</span></div>
        <div class="chapter-item"><span class="ch-num">1장</span><span class="ch-title">Cursor로 "Hello ○○아파트" 페이지 만들기</span><span class="ch-star s1">★★</span></div>
        <div class="chapter-item"><span class="ch-num">2장</span><span class="ch-title">GitHub에 처음 올리기</span><span class="ch-star s1">★★</span></div>
        <div class="chapter-item"><span class="ch-num">3장</span><span class="ch-title">GitHub Pages로 진짜 인터넷 주소 만들기 🏁</span><span class="ch-star s1">★★</span></div>
      </div>
    </div>

    <!-- 2부 -->
    <div class="toc-part">
      <div class="part-header">
        <span class="part-num p2">2부</span>
        <span class="part-title">백엔드 토대 만들기</span>
      </div>
      <div class="chapter-list">
        <div class="chapter-item"><span class="ch-num">4장</span><span class="ch-title">Supabase 프로젝트 만들고 "인터넷 엑셀" 열기</span><span class="ch-star s2">★★</span></div>
        <div class="chapter-item"><span class="ch-num">5장</span><span class="ch-title">입주민 등록부 테이블 만들기 (SQL 복붙)</span><span class="ch-star s2">★★★</span></div>
      </div>
    </div>

    <!-- 3부 -->
    <div class="toc-part">
      <div class="part-header">
        <span class="part-num p3">3부</span>
        <span class="part-title">사용자 신청 흐름 — 앞 + 뒤 연결</span>
      </div>
      <div class="chapter-list">
        <div class="chapter-item"><span class="ch-num">6장</span><span class="ch-title">동·호·이름·휴대폰 입력 칸 만들기 🏁</span><span class="ch-star s2">★★★</span></div>
        <div class="chapter-item"><span class="ch-num">7장</span><span class="ch-title">"다음" 누르면 진짜 입주민인지 확인하기</span><span class="ch-star s2">★★★</span></div>
        <div class="chapter-item"><span class="ch-num">8장</span><span class="ch-title">평형별 옵션 화면 만들기</span><span class="ch-star s2">★★★</span></div>
        <div class="chapter-item"><span class="ch-num">9장</span><span class="ch-title">신청서 작성 폼 (개인정보 입력)</span><span class="ch-star s2">★★★</span></div>
        <div class="chapter-item"><span class="ch-num">10장</span><span class="ch-title">손가락·마우스 서명 칸 만들기</span><span class="ch-star s2">★★★</span></div>
        <div class="chapter-item"><span class="ch-num">11장</span><span class="ch-title">신청 데이터 인터넷 엑셀(DB)에 진짜 저장</span><span class="ch-star s3">★★★★</span></div>
        <div class="chapter-item"><span class="ch-num">12장</span><span class="ch-title">신청 들어올 때마다 엑셀에 자동 누적</span><span class="ch-star s3">★★★★</span></div>
      </div>
    </div>

    <!-- 4부 -->
    <div class="toc-part">
      <div class="part-header">
        <span class="part-num p4">4부</span>
        <span class="part-title">관리자 운영 도구</span>
      </div>
      <div class="chapter-list">
        <div class="chapter-item"><span class="ch-num">13장</span><span class="ch-title">관리자 로그인 + 신청 목록 화면</span><span class="ch-star s2">★★★</span></div>
        <div class="chapter-item"><span class="ch-num">14장</span><span class="ch-title">관리자 — 신청서 상세 + 엑셀 안전 다운로드</span><span class="ch-star s3">★★★★</span></div>
        <div class="chapter-item"><span class="ch-num">15장</span><span class="ch-title">관리자 — 시즌 종료용 "초기화" 버튼</span><span class="ch-star s3">★★★★</span></div>
      </div>
    </div>

    <!-- 5부 -->
    <div class="toc-part">
      <div class="part-header">
        <span class="part-num p5">5부</span>
        <span class="part-title">자동 배포 + 보안 + 운영</span>
      </div>
      <div class="chapter-list">
        <div class="chapter-item"><span class="ch-num">16장</span><span class="ch-title">GitHub Actions로 자동 배포</span><span class="ch-star s2">★★★</span></div>
        <div class="chapter-item"><span class="ch-num">17장</span><span class="ch-title">보안 최종 잠금 (RLS · 권한 · XSS)</span><span class="ch-star s3">★★★★</span></div>
        <div class="chapter-item"><span class="ch-num">18장</span><span class="ch-title">운영 점검표 + 백업</span><span class="ch-star s1">★★</span></div>
      </div>
    </div>

    <!-- 6부 -->
    <div class="toc-part">
      <div class="part-header">
        <span class="part-num p6">6부</span>
        <span class="part-title">사고 대응 + 시즌 운영</span>
      </div>
      <div class="chapter-list">
        <div class="chapter-item"><span class="ch-num">19장</span><span class="ch-title">자주 만나는 에러 30선 — 빠른 해결 카탈로그</span><span class="ch-star s1">★</span></div>
        <div class="chapter-item"><span class="ch-num">20장</span><span class="ch-title">시즌 시작/종료 + 인수인계 가이드</span><span class="ch-star s1">★★</span></div>
      </div>
    </div>

    <!-- 부록 -->
    <div class="toc-part">
      <div class="part-header">
        <span class="part-num pa">부록</span>
        <span class="part-title">부록 A·B·C·D</span>
      </div>
      <div class="chapter-list">
        <div class="chapter-item"><span class="ch-num">A</span><span class="ch-title">모든 SQL 한 페이지 (복붙용)</span><span class="ch-star"></span></div>
        <div class="chapter-item"><span class="ch-num">B</span><span class="ch-title">모든 Edge Function 코드 모음</span><span class="ch-star"></span></div>
        <div class="chapter-item"><span class="ch-num">C</span><span class="ch-title">환경변수·시크릿 전체 표</span><span class="ch-star"></span></div>
        <div class="chapter-item"><span class="ch-num">D</span><span class="ch-title">더 안전·확장 (선택 사항)</span><span class="ch-star"></span></div>
      </div>
    </div>

  </div>

  <div class="toc-legend">
    <strong>난이도 안내</strong> &nbsp;·&nbsp;
    ★ 클릭만 &nbsp;·&nbsp;
    ★★ 약간 복붙 &nbsp;·&nbsp;
    ★★★ AI 활용 + 검증 &nbsp;·&nbsp;
    ★★★★ SQL / Edge Function &nbsp;·&nbsp;
    🏁 체크포인트 챕터
  </div>
</div>


<!-- ════════════════════════════════
     PAGE 3 : 파이프라인
════════════════════════════════ -->
<div class="page pipeline">
  <div class="pipe-header">
    <div class="pipe-title">시스템 파이프라인</div>
    <div class="pipe-sub">배포 → 서비스 흐름 → 자동화 파이프라인 전체 구조</div>
  </div>

  <!-- 배포 레이블 -->
  <div class="pipe-section-label first">① 배포 파이프라인</div>

  <!-- 파이프라인 SVG — hardcoded colors (standalone HTML용) -->
  <div class="pipe-svg-wrap">
<svg width="100%" viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" role="img"
  style="font-family:'Apple SD Gothic Neo','Noto Sans KR','Malgun Gothic',sans-serif">
<title>○○아파트 옵션 신청 시스템 파이프라인</title>
<desc>배포, 서비스, 자동화 흐름을 보여주는 시스템 파이프라인 다이어그램</desc>
<defs>
  <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M2 1L8 5L2 9" fill="none" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </marker>
  <marker id="arr-teal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M2 1L8 5L2 9" fill="none" stroke="#0F6E56" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </marker>
  <marker id="arr-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M2 1L8 5L2 9" fill="none" stroke="#185FA5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </marker>
  <marker id="arr-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M2 1L8 5L2 9" fill="none" stroke="#854F0B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </marker>
</defs>

<!-- ── ROW 1: 배포 ── -->
<!-- 코드 Push (gray) -->
<rect x="10" y="4" width="118" height="44" rx="8" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="0.5"/>
<text x="69" y="22" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="600" fill="#2C2C2A">코드 Push</text>
<text x="69" y="38" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#5F5E5A">개발자 → Git</text>

<line x1="130" y1="26" x2="152" y2="26" stroke="#64748B" stroke-width="1" marker-end="url(#arr)"/>

<!-- GitHub Actions (gray) -->
<rect x="154" y="4" width="158" height="44" rx="8" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="0.5"/>
<text x="233" y="22" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="600" fill="#2C2C2A">GitHub Actions</text>
<text x="233" y="38" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#5F5E5A">빌드 + 자동 배포</text>

<line x1="314" y1="26" x2="336" y2="26" stroke="#64748B" stroke-width="1" marker-end="url(#arr)"/>

<!-- GitHub Pages (blue) -->
<rect x="338" y="4" width="332" height="44" rx="8" fill="#E6F1FB" stroke="#185FA5" stroke-width="0.5"/>
<text x="504" y="18" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="600" fill="#0C447C">GitHub Pages</text>
<text x="504" y="36" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#185FA5">React SPA · 신청 화면 + 관리자 화면 호스팅</text>

<!-- 구분선 -->
<line x1="10" y1="60" x2="670" y2="60" stroke="#CBD5E1" stroke-width="0.5" stroke-dasharray="4 3"/>
<text x="340" y="72" text-anchor="middle" font-size="10" fill="#94A3B8" letter-spacing="1.5">② 서비스 흐름</text>

<!-- ── ROW 2: 서비스 ── -->
<!-- 입주민 신청 (teal) -->
<rect x="10" y="80" width="178" height="56" rx="8" fill="#E1F5EE" stroke="#0F6E56" stroke-width="0.5"/>
<text x="99" y="100" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="600" fill="#085041">입주민 신청</text>
<text x="99" y="118" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#0F6E56">검증 → 옵션 → 서명 → 저장</text>

<line x1="190" y1="108" x2="230" y2="108" stroke="#0F6E56" stroke-width="1" marker-end="url(#arr-teal)"/>

<!-- Supabase 백엔드 (blue) -->
<rect x="232" y="80" width="216" height="56" rx="8" fill="#E6F1FB" stroke="#185FA5" stroke-width="0.5"/>
<text x="340" y="100" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="600" fill="#0C447C">Supabase 백엔드</text>
<text x="340" y="118" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#185FA5">PostgreSQL · Auth · RPC · Storage</text>

<line x1="450" y1="108" x2="490" y2="108" stroke="#185FA5" stroke-width="1" marker-end="url(#arr-blue)"/>

<!-- 관리자 운영 (purple) -->
<rect x="492" y="80" width="178" height="56" rx="8" fill="#EEEDFE" stroke="#534AB7" stroke-width="0.5"/>
<text x="581" y="100" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="600" fill="#3C3489">관리자 운영</text>
<text x="581" y="118" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#534AB7">조회 · 다운로드 · 초기화</text>

<!-- Supabase → 자동화 L-path (dashed) -->
<path d="M340,136 L340,162 L99,162 L99,178" fill="none" stroke="#94A3B8" stroke-width="1" stroke-dasharray="4 3" marker-end="url(#arr)"/>

<!-- 구분선 -->
<line x1="10" y1="170" x2="670" y2="170" stroke="#CBD5E1" stroke-width="0.5" stroke-dasharray="4 3"/>
<text x="340" y="179" text-anchor="middle" font-size="10" fill="#94A3B8" letter-spacing="1.5">③ 자동화 파이프라인</text>

<!-- ── ROW 3: 자동화 ── -->
<!-- DB Webhook (amber) -->
<rect x="10" y="183" width="162" height="56" rx="8" fill="#FAEEDA" stroke="#854F0B" stroke-width="0.5"/>
<text x="91" y="203" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="600" fill="#633806">Database Webhook</text>
<text x="91" y="221" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#854F0B">INSERT 자동 트리거</text>

<line x1="174" y1="211" x2="206" y2="211" stroke="#854F0B" stroke-width="1" marker-end="url(#arr-amber)"/>

<!-- Edge Function (amber) -->
<rect x="208" y="183" width="214" height="56" rx="8" fill="#FAEEDA" stroke="#854F0B" stroke-width="0.5"/>
<text x="315" y="203" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="600" fill="#633806">Edge Function</text>
<text x="315" y="221" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#854F0B">append-workbook-row</text>

<line x1="424" y1="211" x2="456" y2="211" stroke="#854F0B" stroke-width="1" marker-end="url(#arr-amber)"/>

<!-- Storage (green) -->
<rect x="458" y="183" width="212" height="56" rx="8" fill="#EAF3DE" stroke="#3B6D11" stroke-width="0.5"/>
<text x="564" y="203" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="600" fill="#27500A">Storage</text>
<text x="564" y="221" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#3B6D11">xlsx 누적 파일 자동 갱신</text>

<!-- 범례 -->
<text x="10" y="258" font-size="10" fill="#94A3B8">범례</text>
<line x1="40" y1="258" x2="78" y2="258" stroke="#94A3B8" stroke-width="1" stroke-dasharray="4 3"/>
<text x="82" y="258" font-size="10" fill="#94A3B8">자동 트리거</text>
<line x1="148" y1="258" x2="186" y2="258" stroke="#64748B" stroke-width="1" marker-end="url(#arr)"/>
<text x="190" y="258" font-size="10" fill="#94A3B8">데이터 흐름</text>

</svg>
  </div>

  <!-- 보충 설명 -->
  <div style="margin-top:24px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
    <div style="padding:12px 14px;background:#F8FAFC;border-radius:8px;border:1px solid #E2E8F0">
      <div style="font-size:10px;font-weight:700;color:#0D9488;letter-spacing:1px;margin-bottom:6px">① 배포</div>
      <div style="font-size:11px;color:#475569;line-height:1.6">코드를 GitHub에 Push하면 Actions가 자동으로 빌드하고 GitHub Pages에 올립니다.</div>
    </div>
    <div style="padding:12px 14px;background:#F8FAFC;border-radius:8px;border:1px solid #E2E8F0">
      <div style="font-size:10px;font-weight:700;color:#3B82F6;letter-spacing:1px;margin-bottom:6px">② 서비스</div>
      <div style="font-size:11px;color:#475569;line-height:1.6">입주민은 신청 화면에서 검증 후 옵션을 선택합니다. 관리자는 별도 화면에서 신청 내역을 관리합니다.</div>
    </div>
    <div style="padding:12px 14px;background:#F8FAFC;border-radius:8px;border:1px solid #E2E8F0">
      <div style="font-size:10px;font-weight:700;color:#F59E0B;letter-spacing:1px;margin-bottom:6px">③ 자동화</div>
      <div style="font-size:11px;color:#475569;line-height:1.6">신청이 DB에 저장될 때마다 Webhook이 Edge Function을 호출해 엑셀 파일에 자동으로 행을 추가합니다.</div>
    </div>
  </div>
</div>


<!-- ════════════════════════════════
     PAGE 4 : 코딩 파이프라인
════════════════════════════════ -->
<div class="page pipeline">
  <div class="pipe-header">
    <div class="pipe-title">코딩 파이프라인</div>
    <div class="pipe-sub">요구사항 → Cursor AI → 코드 생성 → 테스트 → 배포 — 개발 전체 흐름</div>
  </div>

  <div class="pipe-section-label first">① 개발 사이클 — 에러가 나면 Cursor로 돌아온다</div>

  <div class="pipe-svg-wrap">
<svg width="100%" viewBox="0 0 680 210"
  xmlns="http://www.w3.org/2000/svg" role="img"
  style="font-family:'Apple SD Gothic Neo','Noto Sans KR','Malgun Gothic',sans-serif">
<title>코딩 파이프라인</title>
<desc>요구사항 파악부터 GitHub Pages 배포까지의 개발 흐름</desc>
<defs>
  <marker id="ca" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M2 1L8 5L2 9" fill="none" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </marker>
  <marker id="ca-r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M2 1L8 5L2 9" fill="none" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </marker>
  <marker id="ca-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M2 1L8 5L2 9" fill="none" stroke="#0F6E56" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </marker>
</defs>

<!-- ── 에러 루프 경로 (위) ── -->
<path d="M634,50 L654,50 L654,8 L248,8 L248,24"
  fill="none" stroke="#FCA5A5" stroke-width="1.2" stroke-dasharray="5 3"
  marker-end="url(#ca-r)"/>
<rect x="360" y="2" width="168" height="16" rx="3" fill="#FEF2F2" stroke="#FCA5A5" stroke-width="0.5"/>
<text x="444" y="10" text-anchor="middle" dominant-baseline="central"
  font-size="10" font-weight="600" fill="#DC2626">에러 발생 → 에러 메시지 복사 → Cursor로</text>

<!-- ── ROW 1: 개발 사이클 (y=24-76) ── -->

<!-- Box1: 요구사항 파악 (gray) -->
<rect x="20" y="24" width="140" height="52" rx="8" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="0.5"/>
<text x="90" y="42" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="600" fill="#2C2C2A">요구사항 파악</text>
<text x="90" y="58" text-anchor="middle" dominant-baseline="central" font-size="10" fill="#5F5E5A">무엇을 만들지 정리</text>

<line x1="162" y1="50" x2="176" y2="50" stroke="#64748B" stroke-width="1" marker-end="url(#ca)"/>

<!-- Box2: Cursor AI (purple — 핵심!) -->
<rect x="178" y="24" width="140" height="52" rx="8" fill="#EEEDFE" stroke="#534AB7" stroke-width="1.5"/>
<text x="248" y="40" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="#3C3489">Cursor AI</text>
<text x="248" y="56" text-anchor="middle" dominant-baseline="central" font-size="10" fill="#534AB7">🎯 프롬프트 붙여넣기</text>

<line x1="320" y1="50" x2="334" y2="50" stroke="#64748B" stroke-width="1" marker-end="url(#ca)"/>

<!-- Box3: 코드 생성 (blue) -->
<rect x="336" y="24" width="140" height="52" rx="8" fill="#E6F1FB" stroke="#185FA5" stroke-width="0.5"/>
<text x="406" y="42" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="600" fill="#0C447C">코드 생성·적용</text>
<text x="406" y="58" text-anchor="middle" dominant-baseline="central" font-size="10" fill="#185FA5">Apply 클릭 → 파일 반영</text>

<line x1="478" y1="50" x2="492" y2="50" stroke="#64748B" stroke-width="1" marker-end="url(#ca)"/>

<!-- Box4: 로컬 테스트 (teal) -->
<rect x="494" y="24" width="140" height="52" rx="8" fill="#E1F5EE" stroke="#0F6E56" stroke-width="0.5"/>
<text x="564" y="42" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="600" fill="#085041">로컬 테스트</text>
<text x="564" y="58" text-anchor="middle" dominant-baseline="central" font-size="10" fill="#0F6E56">npm run dev → 브라우저 확인</text>

<!-- ── 성공 경로 (아래) ── -->
<path d="M564,76 L564,104 L90,104 L90,128"
  fill="none" stroke="#0F6E56" stroke-width="1.2"
  marker-end="url(#ca-g)"/>
<rect x="244" y="98" width="152" height="16" rx="3" fill="#F0FDF4" stroke="#86EFAC" stroke-width="0.5"/>
<text x="320" y="106" text-anchor="middle" dominant-baseline="central"
  font-size="10" font-weight="600" fill="#15803D">✅ 완성 → 배포 파이프라인으로</text>

<!-- ── ROW 2: 배포 파이프라인 (y=128-180) ── -->

<!-- Box1: Git Commit (gray) -->
<rect x="20" y="128" width="140" height="52" rx="8" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="0.5"/>
<text x="90" y="146" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="600" fill="#2C2C2A">Git Commit</text>
<text x="90" y="162" text-anchor="middle" dominant-baseline="central" font-size="10" fill="#5F5E5A">변경사항 저장 · 메시지 입력</text>

<line x1="162" y1="154" x2="176" y2="154" stroke="#64748B" stroke-width="1" marker-end="url(#ca)"/>

<!-- Box2: GitHub Push (gray) -->
<rect x="178" y="128" width="140" height="52" rx="8" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="0.5"/>
<text x="248" y="146" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="600" fill="#2C2C2A">GitHub Push</text>
<text x="248" y="162" text-anchor="middle" dominant-baseline="central" font-size="10" fill="#5F5E5A">클라우드에 업로드</text>

<line x1="320" y1="154" x2="334" y2="154" stroke="#64748B" stroke-width="1" marker-end="url(#ca)"/>

<!-- Box3: GitHub Actions (blue) -->
<rect x="336" y="128" width="140" height="52" rx="8" fill="#E6F1FB" stroke="#185FA5" stroke-width="0.5"/>
<text x="406" y="146" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="600" fill="#0C447C">GitHub Actions</text>
<text x="406" y="162" text-anchor="middle" dominant-baseline="central" font-size="10" fill="#185FA5">빌드 자동 실행</text>

<line x1="478" y1="154" x2="492" y2="154" stroke="#64748B" stroke-width="1" marker-end="url(#ca)"/>

<!-- Box4: GitHub Pages (green) -->
<rect x="494" y="128" width="140" height="52" rx="8" fill="#EAF3DE" stroke="#3B6D11" stroke-width="0.5"/>
<text x="564" y="146" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="600" fill="#27500A">GitHub Pages 배포</text>
<text x="564" y="162" text-anchor="middle" dominant-baseline="central" font-size="10" fill="#3B6D11">🌐 실제 인터넷 주소 반영</text>

<!-- 루프 설명 레이블 -->
<text x="20" y="200" font-size="10" fill="#64748B">※ 에러가 나도 괜찮습니다.</text>
<text x="20" y="212" font-size="10" fill="#64748B">에러 메시지를 Cursor 채팅에 붙여넣으면 AI가 자동으로 고쳐줍니다.</text>

</svg>
  </div>

  <!-- 핵심 원칙 카드 -->
  <div style="margin-top:16px;display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
    <div style="padding:12px 14px;background:#F8F5FF;border-radius:8px;border:1px solid #DDD6FE">
      <div style="font-size:10px;font-weight:700;color:#534AB7;margin-bottom:5px">Cursor AI</div>
      <div style="font-size:11px;color:#4C1D95;line-height:1.5">코드를 이해할 필요 없습니다. 🎯 박스 프롬프트를 그대로 복사해 붙여넣기만 하세요.</div>
    </div>
    <div style="padding:12px 14px;background:#F0FDF4;border-radius:8px;border:1px solid #86EFAC">
      <div style="font-size:10px;font-weight:700;color:#15803D;margin-bottom:5px">에러가 나면</div>
      <div style="font-size:11px;color:#166534;line-height:1.5">에러 메시지를 Cursor 채팅에 그대로 붙여넣고 "고쳐줘"라고 하면 됩니다.</div>
    </div>
    <div style="padding:12px 14px;background:#EFF6FF;border-radius:8px;border:1px solid #BFDBFE">
      <div style="font-size:10px;font-weight:700;color:#1D4ED8;margin-bottom:5px">배포 자동화</div>
      <div style="font-size:11px;color:#1E3A5F;line-height:1.5">Push 한 번이면 GitHub Actions가 알아서 빌드하고 배포합니다. 별도 작업 없음.</div>
    </div>
    <div style="padding:12px 14px;background:#F0FDF4;border-radius:8px;border:1px solid #BBF7D0">
      <div style="font-size:10px;font-weight:700;color:#0F6E56;margin-bottom:5px">완성 기준</div>
      <div style="font-size:11px;color:#064E3B;line-height:1.5">브라우저에서 직접 눌러봤을 때 의도대로 동작하면 그 장은 완성입니다.</div>
    </div>
  </div>

  <!-- 장별 연결 요약 -->
  <div style="margin-top:16px;padding:14px 18px;background:#FAFAFA;border-radius:8px;border:1px solid #E2E8F0">
    <div style="font-size:11px;font-weight:700;color:#1E293B;margin-bottom:8px">챕터별 코딩 파이프라인 연결</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:11px;color:#475569;line-height:1.6">
      <div><span style="font-weight:600;color:#0F172A">0~3장</span> — 환경 세팅 + 첫 배포 (파이프라인 뼈대 완성)</div>
      <div><span style="font-weight:600;color:#0F172A">4~12장</span> — 기능 구현 (Cursor 사이클 반복)</div>
      <div><span style="font-weight:600;color:#0F172A">13~20장</span> — 관리자·보안·운영 (마무리)</div>
    </div>
  </div>
</div>
</div>

---

<div class='page-break'></div>

# ○○아파트 옵션 신청 시스템 만들기

### — 코딩 0회차를 위한 풀스택 실전 매뉴얼 —

> **누구를 위한 책?**  
> 코딩 0회차, 터미널·Git 한 번도 안 써본 분이  
> 마우스 클릭 + 복붙만으로 실전 풀스택 웹 시스템을 처음부터 끝까지 만들어 보는 책.  
>
> **다 끝나면 손에 남는 것**  
> - 인터넷 주소(GitHub Pages)에 올라간 신청 사이트  
> - 인터넷 엑셀(DB + Storage)  
> - 신청 들어오면 자동으로 누적되는 엑셀 파일  
> - 관리자 페이지(목록·상세·다운로드·초기화)  
> - 보안 잠금(RLS · XSS · 서명 URL)  
> - Push 한 번이면 자동 배포(GitHub Actions)  
> - 운영 점검표·인수인계 문서·자동 백업까지

---

## 전체 목차

### 1부. 준비 (계정 만들고 도구 깔기)
- **0장.** 준비물 — 계정 만들고 프로그램 깔기 ★
- **1장.** Cursor로 "Hello ○○아파트" 페이지 만들기 ★★
- **2장.** GitHub에 처음 올리기 ★★
- **3장.** GitHub Pages로 진짜 인터넷 주소 만들기 ★★ 🏁

### 2부. 백엔드 토대 만들기
- **4장.** Supabase 프로젝트 만들고 "인터넷 엑셀" 열기 ★★
- **5장.** 입주민 등록부 테이블 만들기 (SQL 복붙) ★★★

### 3부. 사용자 신청 흐름 (앞 + 뒤 연결)
- **6장.** 계약자 4칸 + 평형 선택 게이트 (`step 0`) ★★★ 🏁
- **7장.** 입주민 검증 RPC + 옵션 화면 진입 (`step 0`→`1`) ★★★
- **8장.** 평형별 옵션 화면 만들기 + **평면도·옵션 이미지 넣기(Imgur)** ★★★
- **9장.** 신청서 확인 · 서명 · 제출 (`step 2`) ★★★
- **10장.** (선택) 서명 캔버스 파일 분리 ★★
- **11장.** 신청 데이터 인터넷 엑셀(DB)에 진짜 저장 ★★★★
- **12장.** 신청 들어올 때마다 엑셀에 자동 누적 ★★★★

### 4부. 관리자 운영 도구
- **13장.** 관리자 로그인 + 신청 목록 화면 ★★★
- **14장.** 관리자 — 신청서 상세 + 엑셀 안전 다운로드 ★★★★
- **15장.** 관리자 — 시즌 종료용 "초기화" 버튼 ★★★★

### 5부. 자동 배포 + 보안 + 운영
- **16장.** GitHub Actions로 자동 배포 ★★★
- **17장.** 보안 최종 잠금 (RLS · 권한 · XSS) ★★★★
- **18장.** 운영 점검표 + 백업 ★★

### 6부. 사고 대응 + 시즌 운영
- **19장.** 자주 만나는 에러 30선 — 빠른 해결 카탈로그 ★
- **20장.** 시즌 시작/종료 + 인수인계 가이드 ★★

### 부록
- **부록 A.** 모든 SQL 한 페이지 (복붙용)
- **부록 B.** 모든 Edge Function 코드 모음
- **부록 C.** 환경변수·시크릿 전체 표
- **부록 D.** 더 안전·확장 (선택 사항)

---

> ★ = 클릭만 / ★★ = 약간 복붙 / ★★★ = AI 활용 + 검증 / ★★★★ = SQL/Edge Function / ★★★★★ = 디버깅 동반  
> 🏁 = 체크포인트 (지금까지 한 게 잘 됐는지 한번 멈춰서 확인하는 챕터)

---

<div class='page-break'></div>

# 0장. 준비물 — 계정 만들고 프로그램 깔기

> **이 장에서 완성하는 것**  
> 컴퓨터 한 대에 **개발 도구 1개 + 인터넷 계정 3개**가 준비됩니다.  
> 다 끝나면 본격 작업 들어갈 준비 완료입니다.  
>
> **소요 시간**: 1.5~2시간  
> **난이도**: ★ (가장 쉬움. 클릭만 하시면 됩니다)

---

## 0-1. 이 장에서 만들 것

| 항목 | 뭐예요? (1줄 비유) |
|------|-------------------|
| **Cursor** | "AI가 코드 대신 짜주는 메모장" |
| **Node.js** | "코드를 컴퓨터가 읽게 해주는 번역기" |
| **GitHub 계정** | "코드 인터넷 클라우드 (구글 드라이브 비슷)" |
| **Supabase 계정** | "인터넷에 있는 엑셀 창고 + 자물쇠" |
| **Gmail 계정** | "위 3개 가입할 때 쓰는 이메일 (이미 있으면 패스)" |

> 💡 위 5개 모두 **무료**입니다. 신용카드 안 넣으셔도 됩니다.

---

## 0-2. Gmail 계정 (이미 있으면 통째로 건너뛰기)

이미 쓰는 메일이 있으면 그거 쓰셔도 됩니다. 새로 만드신다면:

1. [https://accounts.google.com/signup](https://accounts.google.com/signup) 접속
2. 이름·아이디·비밀번호 입력 → **다음** 계속 누르기
3. 휴대폰 번호 인증 (받은 6자리 숫자 입력)


✅ **이런 화면이 보이면 성공**: 오른쪽 위에 동그란 내 프로필 아이콘이 뜸.

---

## 0-3. GitHub 계정 만들기

1. [https://github.com](https://github.com) 접속 → 오른쪽 위 **Sign up** 클릭


2. 이메일·비밀번호·아이디 입력
   - **아이디는 영어로 짧게** (예: `nerdplanet2026`) — 나중에 사이트 주소에 들어갑니다
3. 캡차(“퍼즐 맞추기”) 풀고 → **Create account**
4. 가입 후 “What do you do?” 같은 질문 나오면 아무거나 선택 → **Continue**


✅ **이런 화면이 보이면 성공**: 왼쪽 위에 **고양이 옥토캣** 로고, 오른쪽 위에 내 프로필 아이콘이 뜸.

⚠️ **이런 화면이 뜨면**:
- "Username already taken" → 아이디가 이미 있음. 뒤에 숫자 붙이세요 (예: `nerdplanet2026`)
- 가입 메일이 안 와요 → 스팸함 확인. 거기도 없으면 5분 후 한 번 더 시도

---

## 0-4. Supabase 계정 만들기

1. [https://supabase.com](https://supabase.com) 접속 → 오른쪽 위 **Start your project** 클릭


2. **Continue with GitHub** 클릭 (방금 만든 GitHub 계정으로 자동 가입됨)
3. GitHub에서 “Authorize Supabase” 화면 나오면 **Authorize** 클릭


✅ **이런 화면이 보이면 성공**: Supabase 대시보드에 **New project** 라는 초록 버튼이 보임.

> 💡 프로젝트는 아직 만들지 마세요. 4장에서 같이 만듭니다.

---

## 0-5. Cursor 다운로드 + 설치

**Cursor = AI 비서가 옆에 앉아 코드를 대신 짜주는 메모장**입니다.

1. [https://cursor.com](https://cursor.com) 접속 → **Download** 클릭
2. 본인 컴퓨터 종류에 맞는 거 선택
   - **Mac (M1/M2/M3)** → "Download for Mac (Apple Silicon)"
   - **Mac (Intel)** → "Download for Mac (Intel)"
   - **Windows** → "Download for Windows"


3. 다운로드된 파일 더블클릭 → **응용프로그램 폴더로 드래그** (Mac) / **Next 계속** (Windows)
4. Cursor 첫 실행 → 로그인 화면이 뜨면 **GitHub 계정으로 로그인**


5. AI 모델 선택 화면이 뜨면 **무료 옵션** 선택 (`claude-3-haiku` 같은 거 무료)


✅ **이런 화면이 보이면 성공**: 검은 배경 메모장 같은 화면이 뜨고, 오른쪽에 채팅창이 보임.

---

## 0-6. Node.js 설치 (코드를 컴퓨터가 알아듣게 해주는 번역기)

1. [https://nodejs.org](https://nodejs.org) 접속
2. 페이지 가운데 **두 개 버튼 중 왼쪽 (LTS)** 클릭


3. 다운로드된 파일 더블클릭 → **계속 / Next** 만 누름 (옵션 건드리지 말기)

### 설치 잘 됐는지 확인 (Cursor에서)

1. Cursor 열기
2. 위 메뉴 **Terminal → New Terminal** 클릭


3. 아래쪽에 검은 창이 열림. 거기에 아래 한 줄 **그대로 붙여넣고 Enter**:

```bash
node --version
```

✅ **이런 게 뜨면 성공**: `v22.11.0` 같은 버전 숫자

⚠️ **`command not found: node` 가 뜨면** → 설치가 제대로 안 됨. **Cursor 한 번 껐다 다시 켜고** 같은 명령 다시 입력. 그래도 안 되면 Node.js 다시 설치.

---

## 0-7. (선택) Cursor에 한국어 메뉴 깔기

영어 메뉴가 어렵게 느껴지시면:

1. 왼쪽 사이드바 **사각형 4개 아이콘** (Extensions) 클릭
2. 검색창에 `Korean` 입력
3. **Korean Language Pack for Visual Studio Code** → **Install**
4. 오른쪽 아래 “Restart” 뜨면 클릭


✅ Cursor 메뉴가 한국어로 바뀌어 있음.

---

## 0-8. 0장 완료 체크리스트

아래 6개가 **전부 ✅** 면 1장으로 가셔도 됩니다.

- [ ] Gmail로 로그인됨 (또는 기존 메일 사용 결정)
- [ ] **GitHub** 계정 생성 + 로그인됨 → 내 아이디 메모: `__________`
- [ ] **Supabase** 대시보드 접속됨 (New project 버튼 보임)
- [ ] **Cursor** 설치 + 실행됨 + 채팅창 보임
- [ ] **Node.js** 설치 → `node --version` 에서 버전 숫자 나옴
- [ ] (선택) Cursor 한국어 메뉴

📌 **다음 장 미리보기**  
1장에서는 Cursor를 열어 **빈 React 프로젝트 1개**를 만들어 봅니다. AI에게 “React 빈 프로젝트 만들어 줘” 한 줄만 던지면 됩니다.

---

> 🎯 **Cursor에 그대로 복사** (1장에서 쓸 첫 프롬프트 미리보기)
> ```
> 내 컴퓨터의 바탕화면에 yyc-options 라는 폴더를 만들고,
> 그 안에 Vite + React 빈 프로젝트를 초기화해 줘.
> 진행하기 전에 어떤 명령어를 실행할지 먼저 보여줘.
> ```

---

> 💪 **여기까지 오신 분께**  
> 0장은 “계정 만들기”라 지루했을 수 있는데, 이게 끝나면 **이제부터는 진짜 만드는 재미**입니다. 한숨 돌리시고 1장으로 가세요.

 I'm planning out the structure for a beginner-friendly Chapter 0 guide that walks users through setup step-by-step, with visual screenshots, clear click-and-copy instructions, success verification checks, and a callout section for common mistakes.

---

<div class='page-break'></div>

# 1장. Cursor로 “Hello ○○아파트” 페이지 만들기

> **이 장에서 완성하는 것**  
> Cursor에서 AI에게 “빈 사이트 만들어 줘” 한 줄만 시키면, 내 컴퓨터에서 사이트가 떠 있고 거기에 “Hello ○○아파트” 라고 쓰여 있게 됩니다.  
>
> **소요 시간**: 약 1시간  
> **난이도**: ★★ (Cursor에 처음 명령 던져 보는 단계)

---

## 1-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **React** | "버튼·입력칸 같은 화면 부품을 조립하는 레고" |
| **Vite** | "그 레고를 빠르게 조립해서 화면에 띄워주는 기계" |
| **터미널** | "Cursor 아래쪽 검은 창. AI가 명령을 실행하는 곳" |
| **localhost** | "내 컴퓨터에서만 잠깐 보이는 사이트 주소" |

> 💡 위 단어 외울 필요 없습니다. **클릭만 하시면 됩니다.**

---

## 1-2. Cursor 열고 새 창 띄우기

1. **Cursor 실행** (0장에서 깐 거)
2. 위 메뉴 **File → New Window**


3. 새 창이 뜨면 가운데 큰 “Open Folder” 버튼이 보입니다.  
   **아직 누르지 마세요.** 폴더는 AI가 만들어 줄 거예요.

✅ **이런 화면이 보이면 성공**: 가운데 “Get Started” 또는 빈 환영 화면.

---

## 1-3. 터미널 열기

1. 위 메뉴 **Terminal → New Terminal**
2. 화면 아래쪽에 **검은 창**이 열립니다.


3. 검은 창 위에 보이는 경로(예: `~`) 가 어디든 상관 없습니다.

✅ **이런 게 보이면 성공**: 깜빡이는 커서가 있는 검은 입력창.

---

## 1-4. 바탕화면으로 이동 (1줄 복붙)

검은 창에 아래 **한 줄을 그대로 복사 → 붙여넣고 → Enter**:

```bash
cd ~/Desktop
```

✅ 입력창 앞부분이 `…/Desktop %` 처럼 바뀜.

⚠️ **`No such file or directory`** 가 뜨면 → 한국어 윈도우는 `~/Desktop` 대신 `~/바탕\ 화면` 일 수 있어요. **Cursor 채팅에 “바탕화면으로 이동하는 명령 알려줘” 라고 물어** 보면 됩니다.

---

## 1-5. AI에게 첫 프롬프트 던지기 🎯

오른쪽에 있는 **Cursor 채팅창** 클릭. 만약 안 보이면 위 메뉴 **View → Open Chat** 또는 단축키 **`Cmd + L`** (맥) / **`Ctrl + L`** (윈도).


> 🎯 **Cursor에 그대로 복사**  
> ```
> 지금 내 위치(바탕화면)에 yyc-options 라는 폴더를 만들고,
> 그 안에 Vite + React (JavaScript) 빈 프로젝트를 초기화해 줘.
>
> 진행 단계:
> 1) 어떤 명령어를 실행할지 먼저 보여줘
> 2) 내가 "go" 라고 답하면 그때 실행해 줘
> 3) 실행 끝나면 "다음에 할 일" 한 줄로 알려줘
> ```

엔터 치면 AI가 명령어를 보여 줍니다 (대략 `npm create vite@latest yyc-options …` 같은 줄).


내용을 슥 본 다음 채팅창에 한 글자만:

```
go
```

✅ AI가 터미널에 명령을 자동 입력하기 시작합니다.

---

## 1-6. 권한 요청 화면 (Allow 누르기)

명령 실행 도중 Cursor 가운데에 **“Run command?”** 같은 노란 박스가 뜹니다.


→ **Allow** 클릭 (한 번에 안 끝나면 몇 번 더 나옴 — 모두 Allow)

설치 도중 터미널이 멈춘 듯 보여도 **2~3분 기다리면** 자동으로 끝납니다. 절대 닫지 마세요.

✅ **이런 게 마지막에 보이면 성공**:
```
Done. Now run:
  cd yyc-options
  npm install
  npm run dev
```

---

## 1-7. AI에게 “끝까지 해줘” 한 번 더

AI가 위에서 멈췄으면 채팅창에 한 줄 더:

> 🎯 **Cursor에 그대로 복사**  
> ```
> 이어서 yyc-options 폴더로 들어가서 npm install 하고,
> 끝나면 npm run dev 까지 실행해 줘. 권한 박스 나오면 알려줘.
> ```

`Allow` 또 한두 번 누르면, 아래쪽 검은 창에 이런 글자가 뜹니다:

```
  VITE v8.x.x  ready in 432 ms
  ➜  Local:   http://localhost:5173/
```


✅ **`Local: http://localhost:5173/`** 이 보이면 사이트가 떠 있는 상태예요.

---

## 1-8. 진짜 사이트 보기

1. 위 주소를 **Cmd 누른 채 클릭** (맥) / **Ctrl + 클릭** (윈도)  
   → 브라우저가 자동으로 열림  
2. 또는 그냥 브라우저에 `http://localhost:5173/` 직접 입력


✅ React 로고가 빙글빙글 도는 화면이 뜸 = **첫 사이트 띄우기 성공**

⚠️ **흰 화면만 뜨면**: 5초 기다리시고 새로고침. 그래도면 터미널 빨간 글씨 한 줄 복사해 Cursor 채팅에 붙이고 “고쳐 줘”.

---

## 1-9. “Hello ○○아파트” 로 바꾸기

이제 화면 글자만 바꿔 봅시다.

1. 왼쪽 파일 트리에서 **`yyc-options` 폴더 → `src` → `App.jsx`** 더블클릭


2. 코드가 화면에 뜨면 그냥 보지 마시고, **AI에게 시켜요**.

> 🎯 **Cursor에 그대로 복사**  
> ```
> @App.jsx 파일 내용을 전부 지우고,
> 화면 한가운데에 큰 글씨로 "Hello ○○아파트" 만 보이게 바꿔 줘.
> 글씨는 진하게, 가운데 정렬.
> ```

`@App.jsx` 라고 입력하면 자동완성에서 그 파일이 떠요. 선택 후 엔터.

3. AI가 코드 변경 안을 보여 줍니다. 위쪽 **Apply / Accept** 버튼 클릭.


4. 브라우저로 가서 **새로고침 (`Cmd+R` / `Ctrl+R`)**.


✅ “Hello ○○아파트” 만 뜨면 성공.

---

## 1-10. 잠깐 멈추는 법 (저장은 자동)

- 사이트 그만 띄우고 싶을 때: 터미널에서 **`Ctrl + C`** → 다시 띄우려면 `npm run dev`
- Cursor에서 한 거 **자동 저장**됩니다. 따로 저장 안 누르셔도 돼요.

---

## 1-11. 1장 완료 체크리스트

- [ ] 바탕화면에 **`yyc-options`** 폴더가 생겼다
- [ ] 그 안에 `src`, `package.json` 같은 파일들이 보인다
- [ ] `npm run dev` 했을 때 터미널에 **`Local: http://localhost:5173/`** 가 떴다
- [ ] 브라우저로 그 주소 들어가면 **“Hello ○○아파트”** 가 보인다
- [ ] 같은 화면이 사라지지 않고 그대로 떠 있다 (터미널 닫지 말기)

---

## 1-12. 자주 나는 에러 모음

| 화면 | 원인 | 해결 |
|------|------|------|
| `command not found: npm` | Node.js 설치 실패 | 0장 다시. Cursor 껐다 켜기 |
| `EADDRINUSE: address already in use 5173` | 사이트가 이미 떠 있음 | 다른 터미널에서 `Ctrl+C`로 끄기 |
| 흰 화면 / `Cannot GET /` | dev 서버 아직 시작 중 | 5초 후 새로고침 |
| 한국 글자 깨짐 | 인코딩 문제 | Cursor 재시작 한 번 |
| Allow 박스 못 봄 | 권한 박스 닫혀버림 | 채팅에 “명령 다시 실행해줘” |

---

📌 **다음 장 미리보기**  
2장에서는 지금 만든 **`yyc-options` 폴더를 GitHub에 올립니다.** Cursor 안에서 클릭 몇 번이면 끝나요. 이게 되면 “내 코드가 인터넷에 백업됨” 상태가 됩니다.

---

> 💪 **여기까지 오신 분께**  
> 코드 한 줄 안 짰는데 사이트 한 페이지를 띄웠어요. **이게 진짜 시작점**입니다. 한 잔 마시고 2장 가시죠.

 I'm planning out Chapter 1, which will walk through creating a "Hello ○○아파트" page using Cursor, starting with opening the tool and setting up a folder structure, with an estimated completion time of one hour.

Now I need to structure the step-by-step instructions covering everything from launching Cursor through running the dev server and modifying the App component, including screenshots, success checkpoints, and troubleshooting tips, all written in a friendly tone with Cursor prompts highlighted in callout boxes.

---

<div class='page-break'></div>

# 2장. GitHub에 처음 올리기 (Cursor에서 클릭 몇 번)

> **이 장에서 완성하는 것**  
> 1장에서 만든 `yyc-options` 폴더가 **GitHub 인터넷 클라우드**에 올라갑니다.  
> 이제 노트북이 부서져도 코드가 안 사라집니다.  
>
> **소요 시간**: 약 1시간  
> **난이도**: ★★ (Cursor의 클릭 몇 번 + 짧은 복붙)

---

## 2-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **Git** | "내 폴더 변경 내역을 자동으로 적어두는 일기장" |
| **GitHub** | "그 일기장을 인터넷 클라우드에 올려두는 곳" |
| **Repository (레포)** | "내 프로젝트 폴더 1개 = 인터넷에 올라간 1개 칸" |
| **Commit** | "지금까지 바꾼 거 한 묶음으로 도장 찍기" |
| **Push** | "내 컴퓨터 → GitHub로 업로드" |

> 💡 외울 필요 없습니다. 다 **버튼 한 번**으로 끝납니다.

---

## 2-2. GitHub에 빈 레포 만들기

### (1) GitHub 접속
[https://github.com](https://github.com) 로그인 → 오른쪽 위 **+ 버튼 → New repository**


### (2) 레포 정보 입력

| 항목 | 입력값 |
|------|-------|
| **Repository name** | `yyc-options` (1장 폴더명과 똑같이) |
| **Description** | `옵션 신청 시스템` (아무거나 써도 됨, 비워도 됨) |
| **Public / Private** | **Private** 추천 (나만 보기) |
| **Add a README / .gitignore / license** | **모두 체크 해제** ⚠️ 중요 |


### (3) 아래쪽 **Create repository** 초록 버튼 클릭

✅ **이런 화면이 보이면 성공**: “Quick setup” 안내 페이지 (까만 코드 박스 여러 줄)


> 💡 위 페이지에 보이는 까만 코드는 **읽지 마세요.** Cursor가 알아서 합니다.

---

## 2-3. Cursor에서 Git 시작하기

### (1) Cursor를 1장 프로젝트 창으로 이동
1장에서 띄워둔 `yyc-options` 창이면 그대로. 닫았으면:

- Cursor → **File → Open Folder** → 바탕화면의 `yyc-options` 선택

### (2) 왼쪽 사이드바 “나뭇가지” 아이콘 클릭


### (3) “Initialize Repository” 파란 버튼 클릭


✅ 왼쪽 패널에 “Changes” 라는 글자 + 파일 목록이 한 무더기 뜸.

---

## 2-4. 첫 Commit (도장 찍기)

### (1) 위쪽 **Message** 입력칸 클릭 → 한 줄 입력

```
첫 커밋
```


### (2) 위쪽 **체크 표시 ✓ Commit** 버튼 클릭

“No staged changes…” 라는 팝업이 뜨면 → **Yes** 클릭 (전부 한 번에 묶어준다는 뜻)

✅ 파일 목록이 비고, 아래쪽에 “Publish Branch” 같은 파란 버튼이 새로 뜸.

⚠️ **“user.email is not set” 같은 빨간 글씨가 뜨면**:  
→ 채팅창(`Cmd + L`)에 그대로 던지세요.

> 🎯 **Cursor에 그대로 복사**  
> ```
> Git 첫 commit 하려는데 "user.email is not set" 에러가 떠.
> 내 GitHub 가입 이메일과 아이디로 git config 설정하는 명령 알려줘.
> 그 후에 다시 commit 해줘.
> ```

---

## 2-5. GitHub에 올리기 (Push)

### (1) 사이드바 아래쪽 **Publish Branch** 또는 **... → Push** 클릭


### (2) GitHub 로그인 팝업이 뜸

브라우저로 이동되면서 **“Authorize Cursor”** 같은 페이지가 뜹니다.


→ **Authorize** 클릭. Cursor로 자동 돌아옵니다.

### (3) “publish to public or private?” 같은 선택지가 뜨면

→ **Private** 선택 (이미 GitHub에 만든 레포가 Private면 자동 매칭됨)

### (4) 잠시 (5~30초) 기다리기

✅ 사이드바 **Changes** 항목이 비어 있고, 아무 에러도 없음.

---

## 2-6. GitHub에서 진짜 올라갔는지 확인

### (1) 브라우저에서 본인 레포 페이지로 이동
주소: `https://github.com/내아이디/yyc-options`

### (2) 새로고침


✅ **이런 게 보이면 성공**: `src/`, `public/`, `package.json`, `index.html` 등 파일이 쭉 나열됨.

⚠️ **여전히 “Quick setup” 페이지면**: Push가 안 된 상태.  
→ Cursor 채팅에:

> 🎯 **Cursor에 그대로 복사**  
> ```
> 지금 main 브랜치 GitHub에 push가 안 된 상태야.
> origin 추가하고 푸시까지 한 번에 해줘.
> 내 레포 주소: https://github.com/내아이디/yyc-options
> ```

(`내아이디` 부분만 본인 아이디로 바꿔서 붙여넣기)

---

## 2-7. .gitignore 확인 (개인정보 안 올라가게)

GitHub 레포에 **`.env` 나 `node_modules` 폴더가 보이면 안 됩니다.**

### (1) 레포 메인 페이지에서 위 두 개가 안 보이는지 확인


✅ 안 보이면 정상 (Vite가 자동으로 .gitignore에 넣어 두었음).

⚠️ **`node_modules` 폴더가 보이면**:

> 🎯 **Cursor에 그대로 복사**  
> ```
> 내 .gitignore 에 node_modules, .env, .env.local, dist 가 있는지 확인하고
> 빠진 거 있으면 추가해 줘. 그 후에 변경사항 commit + push 까지 해줘.
> ```

---

## 2-8. 앞으로 코드 바꿀 때 (3단계만 기억)

매번 코드 고친 다음:

1. **사이드바 나뭇가지 아이콘** 클릭
2. Message에 한 줄 (예: `옵션 카탈로그 추가`) → **✓ Commit**
3. 아래쪽 **Sync Changes** 또는 `...` → **Push**


> 💡 막히면 그냥 **Cursor 채팅**에 한 줄:  
> “지금까지 바꾼 거 commit 메시지 알아서 정해서 push 해줘.”

---

## 2-9. 2장 완료 체크리스트

- [ ] GitHub에 **`yyc-options`** 레포가 만들어져 있다 (Private)
- [ ] Cursor 사이드바에 **나뭇가지 아이콘 + 체크된 상태** 가 보인다
- [ ] 브라우저에서 `https://github.com/내아이디/yyc-options` 들어가면 **`src/`, `package.json` 등 파일이 보인다**
- [ ] `node_modules` 폴더가 GitHub에 **안** 보인다
- [ ] 시험 삼아 `App.jsx` 한 글자 바꾸고 commit + push 했더니 GitHub에서 그 변경이 보인다

---

## 2-10. 자주 나는 에러 모음

| 화면 | 원인 | 해결 |
|------|------|------|
| `Permission denied (publickey)` | GitHub 인증 안 됨 | Cursor 재시작 후 다시 Push (재인증 팝업이 나옴) |
| `failed to push some refs` | 원격에 다른 게 있음 | 채팅창에 “git pull rebase 하고 다시 push 해줘” |
| `nothing to commit` | 바뀐 게 없음 | 정상. 그냥 다음 단계로 |
| Sync Changes 누르니 빨간 알림 | 인증 만료 / 충돌 | 메시지 그대로 복사해 채팅에 붙이기 |
| `node_modules` 가 GitHub에 보임 | .gitignore 누락 | 위 2-7 박스 그대로 |

---

📌 **다음 장 미리보기**  
3장에서는 GitHub에 올린 이 코드를 **GitHub Pages로 인터넷 주소까지 만들어** 봅니다.  
끝나면 친구한테 “이 주소 들어가 봐” 라고 보내줄 수 있는 진짜 사이트가 됩니다.

---

> 💪 **여기까지 오신 분께**  
> 1장에서 “내 컴퓨터에서만 보이던 사이트”의 **소스 코드가 인터넷에 백업**됐어요.  
> 다음 장에서 그 소스를 진짜 인터넷 주소로 띄울 거예요. 잠깐 쉬셨다 가시죠.

---

<div class='page-break'></div>

# 3장. GitHub Pages로 진짜 인터넷 주소 만들기

> **이 장에서 완성하는 것**  
> 1·2장에서 만든 사이트가 **인터넷 주소**로 떠오릅니다.  
> 친구한테 카톡으로 주소 보내면 폰에서도 보입니다.  
>
> 주소 모양: `https://내아이디.github.io/yyc-options/`  
>
> **소요 시간**: 약 1시간  
> **난이도**: ★★ (복붙 위주, 마지막에 5분 기다리는 게 길게 느껴짐)  
> **🏁 1차 체크포인트** 챕터입니다.

---

## 3-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **GitHub Pages** | "GitHub 레포 → 무료 인터넷 사이트" |
| **GitHub Actions** | "Push 할 때마다 자동으로 빌드·배포해주는 알바" |
| **워크플로(workflow)** | "그 알바한테 시킬 일을 적어둔 메모지" |
| **base path** | "내 사이트 주소 끝에 붙는 폴더 이름 (`/yyc-options/`)" |

---

## 3-2. GitHub Pages 켜기

### (1) 본인 레포 페이지 접속
`https://github.com/내아이디/yyc-options`

### (2) 위 메뉴 **Settings** 클릭


### (3) 왼쪽 사이드바 **Pages** 클릭


### (4) **Build and deployment** 박스에서 **Source** 항목

→ 드롭다운 클릭 → **GitHub Actions** 선택  
(*“Deploy from a branch” 가 아니라 **GitHub Actions** 입니다 ⚠️*)


✅ 따로 저장 버튼 없이 자동 저장됨.

⚠️ **드롭다운에 “GitHub Actions” 가 안 보이면**:  
→ 페이지 새로고침 한 번. 그래도 없으면 레포가 **Public**으로 되어 있는지 확인 (무료 계정은 Private에서 Pages 못 쓰는 경우 있음 → Settings → General → 아래쪽 Danger Zone 에서 Public으로 바꾸기).

---

## 3-3. Vite 사이트 주소 맞추기 (base 설정)

지금 그대로 배포하면 사이트가 흰 화면만 나옵니다.  
이유: GitHub Pages는 주소 끝에 `/yyc-options/` 가 붙는데, Vite가 그걸 모름.  
→ AI에게 시키면 끝.

Cursor 채팅창(`Cmd + L` 또는 `Ctrl + L`):

> 🎯 **Cursor에 그대로 복사**  
> ```
> 이 프로젝트를 GitHub Pages 에 배포할 거야.
> @vite.config.js 를 수정해서, 환경변수 VITE_BASE 가 있으면 그 값을 base 로,
> 없으면 "/" 를 base 로 쓰도록 바꿔줘.
> 변경 후 Apply 해줘.
> ```


→ **Apply** 클릭.

✅ `vite.config.js` 안에 `base: process.env.VITE_BASE || "/"` 같은 줄이 들어가 있으면 OK.

---

## 3-4. GitHub Actions 워크플로 만들기 (자동 배포 알바)

이게 핵심. 한 번 만들면 앞으로 **Push만 하면 자동으로 사이트 갱신**됩니다.

### (1) AI에게 한 줄로 시키기

> 🎯 **Cursor에 그대로 복사**  
> ```
> .github/workflows/pages.yml 파일을 새로 만들어 줘.
> 내용:
> - main 브랜치에 push 되면 자동 실행
> - Node 22 사용
> - npm ci → npm run build (env: VITE_BASE = /yyc-options/)
> - dist 폴더를 GitHub Pages 로 배포
> 표준 actions/configure-pages, actions/upload-pages-artifact, actions/deploy-pages 를 써줘.
> 만든 다음 Apply 해줘.
> ```


→ **Apply** 클릭.

### (2) 만들어진 파일 위치 확인

왼쪽 파일 트리에서 **`.github/workflows/pages.yml`** 가 새로 보여야 함.


✅ 파일 안에 `name: Deploy GitHub Pages`, `branches: [main]`,  
`VITE_BASE: /${{ github.event.repository.name }}/` 가 보이면 OK (레포 이름에 맞게 **자동**).

⚠️ GitHub **Secrets** (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) 는 16장에서 등록합니다.

---

## 3-5. Push 해서 배포 시작시키기

2장에서 배운 그대로:

1. 사이드바 **나뭇가지 아이콘**
2. Message: `GitHub Pages 자동 배포 추가`
3. **✓ Commit** → **Sync / Push**


또는 막히면:

> 🎯 **Cursor에 그대로 복사**  
> ```
> 지금 바뀐 거 commit 메시지 정해서 push 해줘.
> ```

---

## 3-6. Actions에서 자동 배포 진행 보기

### (1) GitHub 레포 위 메뉴 **Actions** 클릭


### (2) 왼쪽 **Deploy GitHub Pages** 워크플로 선택

### (3) 위쪽에 방금 commit 이름이 노란 동그라미(돌고 있음)로 떠 있음


### (4) **30초~1분 30초** 기다리면 초록 ✅ 로 바뀜


⚠️ **빨간 ❌가 뜨면**: 그 줄 클릭 → 빨간 단계 클릭 → 빨간 글씨 한 줄 복사 → Cursor 채팅에:

> 🎯 **Cursor에 그대로 복사**  
> ```
> GitHub Actions 빨간 에러 떴어. 메시지 붙여넣을게. 원인이랑 고치는 법 알려주고
> 필요하면 코드/yml 수정해서 Apply 해줘.
>
> [여기에 빨간 글씨 한 줄 붙여넣기]
> ```

---

## 3-7. 진짜 사이트 주소 확인

### (1) 같은 워크플로 가장 최근 ✅ 클릭


또는

### (2) Settings → Pages 다시 가면 위에 **Your site is live at …** 표시


### (3) 그 주소를 클릭


✅ **“Hello ○○아파트”** 가 인터넷 주소에서 보이면 = 진짜 사이트가 살아 있는 상태.

⚠️ **404 가 뜨면**: 5분만 더 기다리세요. GitHub Pages가 처음 활성화될 때 1~10분 지연 정상.  
⚠️ **흰 화면만 뜨면**: `vite.config.js` 의 `base` 가 `/yyc-options/` 가 맞는지 확인 (3-3 단계).

---

## 3-8. 친구한테 보내 보기 (1차 체크포인트 🏁)

### (1) 위 주소를 그대로 카톡으로 본인 친구에게 전송

### (2) 친구 폰에서 “Hello ○○아파트” 가 잘 보이는지 확인


✅ 친구 폰에서 보이면 **3장 합격 + 1차 체크포인트 통과**.

---

## 3-9. 앞으로의 흐름 (외울 필요 X, 그냥 알아두기)

```
코드 수정 → Cursor에서 commit + push
       ↓
GitHub Actions 가 자동으로 빌드
       ↓
30초~1분 후 인터넷 주소가 자동으로 갱신
```

**= 한 번 세팅하면 끝.** 앞으론 push만 하면 됩니다.

---

## 3-10. 3장 완료 체크리스트

- [ ] **Settings → Pages** Source 가 **GitHub Actions** 로 되어 있다
- [ ] `.github/workflows/pages.yml` 파일이 GitHub 레포에서도 보인다
- [ ] **Actions** 탭에 **Deploy GitHub Pages** 워크플로가 ✅ 초록으로 끝났다
- [ ] `https://내아이디.github.io/yyc-options/` 들어가면 **“Hello ○○아파트”** 가 보인다
- [ ] **다른 사람 폰**에서도 같은 페이지가 뜬다
- [ ] 시험 삼아 `App.jsx` 글자 한 글자 바꿔 push → 1분 후 인터넷 주소도 같이 바뀌었다

---

## 3-11. 자주 나는 에러 모음

| 화면 | 원인 | 해결 |
|------|------|------|
| `404 — File not found` | Pages 활성화 직후 지연 | 5~10분 기다리기 |
| 흰 화면만 뜸 | `base` 설정이 `/` 임 | `vite.config.js` 의 `base: "/yyc-options/"` 확인 |
| Actions 가 안 돌아감 | Source 가 “Branch” 로 되어 있음 | Settings → Pages → **GitHub Actions** 로 다시 |
| `Pages site failed` 빨간 에러 | 권한 부족 | Settings → Actions → General → **Workflow permissions** → **Read and write** 체크 |
| 폰에선 글자 잘림 | CSS 미적용 | 정상. 6장에서 모바일 스타일 잡습니다 |
| 폰에서 안 들어가짐 | 같은 와이파이라 캐시 꼬임 | 폰을 LTE로 바꿔 다시 |

---

📌 **다음 장 미리보기**  
4장부터 본격 데이터 다루기. **Supabase 프로젝트**를 만들고 “인터넷 엑셀” 한 칸을 열어봅니다.  
이게 끝나면 “저장된 신청자 데이터” 를 다룰 수 있는 토대가 생깁니다.

---

> 💪 **여기까지 오신 분께**  
> 코드 0회차에서 **이미 인터넷에 본인 사이트가 떠 있는 사람**이 됐어요.  
> 명함에 본인 사이트 주소 한 줄 적어도 됩니다 😄  
> 한 잔 마시고 4장 가시죠.

 The user confirmed they want to continue, so I'm moving on to chapter 3 about creating a real internet address using GitHub Pages. I'll structure it the same way as the previous chapters, showing the final result, time estimate, and starting the checklist.

The first checkpoint is getting the page live so a friend can view it on their phone and see the "Hello" message. I need to cover enabling GitHub Pages in settings, configuring the Vite base path, setting up the GitHub Actions workflow file, pushing the changes, monitoring the build process, confirming the Pages URL, and collecting common errors that might come up.

---

<div class='page-break'></div>

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

---

<div class='page-break'></div>

# 5장. 입주민 등록부 테이블 만들기 (SQL 복붙)

> **이 장에서 완성하는 것**  
> "등록부" 테이블 + 진짜/가짜 입주민 5명 + 검증 함수까지 한 번에.  
> 7장에서 "이 사람 진짜야?" 검증할 때 이 데이터가 쓰입니다.  
>
> **소요 시간**: 약 1.5시간  
> **난이도**: ★★★ (SQL 첫 등장 — 그래도 복붙)

---

## 5-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **SQL** | "엑셀에 'A1 셀에 이거 넣어' 라고 적어주는 메모" |
| **CREATE TABLE** | "새 시트 만들기" |
| **INSERT INTO** | "새 행 추가" |
| **RLS (Row Level Security)** | "이 시트는 비밀번호 가진 사람만 봐" |
| **RPC (함수)** | "엑셀 매크로 — 이름만 부르면 안에서 알아서 처리" |
| **SECURITY DEFINER** | "이 매크로는 만든 사람 권한으로 돈다 (RLS 무시)" |

---

## 5-2. SQL Editor 열기

### (1) Supabase 왼쪽 메뉴 **SQL Editor** 클릭

[스크린샷: 왼쪽 메뉴 — SQL Editor 항목]

### (2) 위쪽 **+ New query** 또는 가운데 빈 칸

[스크린샷: SQL Editor — 새 쿼리 작성 화면]

✅ 가운데에 큰 검은 입력창이 떠 있음.

---

## 5-3. 등록부 테이블 + 검증 함수 한 번에 만들기

아래 SQL **전체를 그대로 복사** → 가운데 큰 칸에 붙여넣기 → 오른쪽 아래 **Run** (또는 `Cmd + Enter`)

```sql
-- 1) 등록부 테이블
CREATE TABLE IF NOT EXISTS public.yyc_resident_registry (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  dong text NOT NULL,
  ho text NOT NULL,
  contractor_name text NOT NULL,
  phone_tail text NOT NULL,
  type_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT yyc_resident_phone_chk CHECK (phone_tail ~ '^[0-9]{4}$'),
  CONSTRAINT yyc_resident_unique UNIQUE (dong, ho, contractor_name, phone_tail)
);

-- 2) RLS 켜고, 직접 SELECT 금지 (RPC 통해서만 조회)
ALTER TABLE public.yyc_resident_registry ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.yyc_resident_registry FROM PUBLIC;

-- 3) 검증 함수 (이름·동호·휴대폰뒤4 다 맞으면 type_key 한 줄 반환)
DROP FUNCTION IF EXISTS public.verify_yyc_resident(text, text, text, text);

CREATE OR REPLACE FUNCTION public.verify_yyc_resident(
  p_dong text,
  p_ho text,
  p_contractor text,
  p_phone_tail text
)
RETURNS TABLE(type_key text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.type_key
  FROM public.yyc_resident_registry r
  WHERE r.dong = regexp_replace(coalesce(p_dong,''), '\D', '', 'g')
    AND r.ho = regexp_replace(coalesce(p_ho,''), '\D', '', 'g')
    AND r.contractor_name = trim(regexp_replace(coalesce(p_contractor,''), '\s+', ' ', 'g'))
    AND r.phone_tail = regexp_replace(coalesce(p_phone_tail,''), '\D', '', 'g')
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.verify_yyc_resident(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_yyc_resident(text, text, text, text) TO anon, authenticated;
```

[스크린샷: SQL Editor — 위 코드 붙여넣고 오른쪽 Run 버튼]

✅ **아래 결과창에 "Success. No rows returned"** 가 뜨면 성공 (테이블·함수가 만들어졌다는 뜻).

⚠️ **빨간 에러가 뜨면**: 메시지 한 줄 그대로 복사 → Cursor 채팅에:

> 🎯 **Cursor에 그대로 복사**  
> ```
> Supabase SQL Editor 에서 이 SQL 돌렸는데 에러 떴어. 원인이랑 고친 SQL 줘.
> [에러 메시지 붙여넣기]
> ```

---

## 5-4. 가짜 입주민 5명 넣기 (테스트용)

새 쿼리 창에 또 복붙 → Run.

```sql
INSERT INTO public.yyc_resident_registry
  (dong, ho, contractor_name, phone_tail, type_key)
VALUES
  ('101', '1504', '임동우', '5604', '59A'),
  ('101', '1101', '홍길동', '0001', '52A'),
  ('102', '203',  '이수민', '1234', '48B'),
  ('102', '901',  '박지훈', '5678', '65A'),
  ('103', '1801', '정수정', '9999', '79')
ON CONFLICT DO NOTHING;
```

[스크린샷: SQL Editor — INSERT 5줄 + Success]

✅ **"Success. 5 rows"** 비슷한 메시지.

### 들어갔는지 눈으로 확인

왼쪽 **Table Editor → `yyc_resident_registry`** 클릭

[스크린샷: Table Editor — 입주민 5줄 표시]

✅ 표에 5줄 보이면 OK.

> 💡 본인 이름·동호로 1줄 추가해 두면 7장 테스트할 때 편함. 위 INSERT 형식 그대로 본인 정보 1줄 더 넣고 Run.

---

## 5-5. 검증 함수가 잘 도는지 SQL로 한 번 시험

```sql
SELECT * FROM public.verify_yyc_resident('101', '1504', '임동우', '5604');
```

✅ `type_key` 칸에 `59A` 한 줄이 떠야 함.  
`SELECT * FROM ...('101','1504','임동우','9999')` 처럼 휴대폰 뒷자리 다르면 → **0 rows** (정상).

[스크린샷: SQL Editor — 검증 함수 호출 결과 1줄]

---

## 5-6. 5장 완료 체크리스트

- [ ] **Table Editor → yyc_resident_registry** 가 보인다
- [ ] 그 안에 입주민 **5줄 이상** 들어 있다
- [ ] 본인 정보로 한 줄 더 넣어 두었다 (선택)
- [ ] `SELECT * FROM verify_yyc_resident(...)` 호출 시 본인 평형이 나온다
- [ ] 일부러 틀린 값으로 호출하면 **0 rows** 나온다

---

## 5-7. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| `relation "yyc_resident_registry" already exists` | 이미 만든 거 또 함 | 정상. 무시 |
| `permission denied` | 보호 모드 | SQL Editor 위쪽 "Read only mode" 끄기 |
| INSERT 했는데 0 rows | UNIQUE 충돌 | 같은 동·호·이름·뒷4가 이미 있음. 정상 |
| 함수 호출에 매번 0 rows | 입력값 공백/한자 | 한글 이름 정확히, 휴대폰 4자리 숫자만 |

---

📌 **다음 장 미리보기**  
6장에서 사이트 첫 화면에 **입력칸 4개 + 다음 버튼**을 만들어 봅니다. AI 시키면 끝.

---

<div class='page-break'></div>

# 6장. 동·호·이름·휴대폰 + 평형 선택 화면 (`step 0`)

> **이 장에서 완성하는 것**  
> 사이트 **첫 화면(`step === 0`)** 이 아래처럼 보입니다.  
> - **계약자 정보** 4칸 (동·호·계약자명·휴대폰 뒷 4자리)  
> - **평형 버튼** 19개 (`43㎡` ~ `84㎡` 등)  
> - **「옵션 계약 신청 →」** / **「옵션 계약 변경 신청 →」** (4칸+평형이 채워져야 활성)  
>
> 아직 **DB 검증은 7장**에서 연결합니다. 6장은 **화면·입력·버튼 잠금**만 맞추면 됩니다.  
>
> **소요 시간**: 약 1.5시간  
> **난이도**: ★★★ (Cursor가 거의 다 해줌)  
> **🏁 2차 체크포인트** 챕터입니다.

---

## 6-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **`step`** | "지금 몇 번째 화면인지 번호 (0=입력·평형, 1=옵션, 2=서명)" |
| **State** | "사용자가 입력한 값을 잠깐 기억하는 메모지" |
| **`typeKey`** | "선택한 평형 코드 (`59A`, `52C` …)" |
| **`disabled`** | "조건 안 맞으면 버튼 회색으로 잠그기" |
| **`form-card`** | "흰색 입력 카드 박스" |

---

## 6-2. 사이트 띄우기 (프로젝트 폴더에서)

```bash
cd /Users/dongwoolim/yyc-options
npm run dev
```

브라우저 → `http://localhost:5173` (또는 터미널에 나온 주소)

✅ **성공 화면**: 상단 **「청량리역 요진 와이시티」** 제목, 아래 **계약자 정보** 카드.

> ⚠️ 홈 폴더(`~`)에서 `npm run dev` 하면 `package.json` 없음 오류 → 반드시 **`yyc-options` 폴더**에서 실행.

---

## 6-3. AI에게 `step 0` 화면 만들라고 시키기 🎯

> 🎯 **Cursor에 그대로 복사**  
> ```
> @App.jsx step === 0 화면을 다음처럼 만들어/확인해줘.
>
> 1) const [step, setStep] = useState(0)
> 2) 상태: dong, ho, contractor, phoneLast4, typeKey (문자열)
> 3) hero: "청량리역 요진 와이시티" / "멀티플러스 옵션 전자 신청 시스템"
> 4) form-card 안:
>    - 계약자 정보 4행 (동·호·계약자명·휴대폰 뒷4자리)
>    - 휴대폰: 숫자만, maxLength 4, inputMode numeric
>    - 안내: 동·호·성함·휴대폰 뒷4자리가 등록과 일치해야 한다는 문구
>    - TYPES.map 으로 평형 버튼 그리드 (type-btn, 선택 시 active)
>    - 버튼 2개 (같은 동작 나중에 연결):
>      「옵션 계약 신청 →」「옵션 계약 변경 신청 →」
>    - 4칸 미입력 또는 phoneLast4.length !== 4 또는 !typeKey 이면 disabled
> 5) 평형 버튼 클릭 시 setTypeKey + 선택 옵션 sel 초기화
>
> 6장이므로 버튼 onClick 은 우선 console.log({dong,ho,contractor,phoneLast4,typeKey}) 만.
> 기존 index.css 의 form-card, type-grid, primary-btn 스타일 사용.
> Apply.
> ```

[스크린샷: Cursor — 변경안 미리보기]

→ **Apply** 클릭.

---

## 6-4. 브라우저에서 확인

새로고침 (`Cmd + R`).

[스크린샷: 계약자 4칸 + 평형 버튼 그리드 + 회색 신청 버튼]

### 잘 동작하는지 시험

1. 4칸이 비어 있으면 → 두 신청 버튼 **회색**
2. 4칸 채우고 **평형 버튼 하나** 클릭 (예: `59㎡A`) → 버튼 **파란색** 테두리
3. 신청 버튼 **파란색 활성** → 클릭 시 Console에 5개 값 출력
4. 휴대폰에 글자 입력 안 됨, 5자리 이상 안 됨

✅ 위 4가지 OK면 **6장 UI 통과**.

---

## 6-5. 모바일에서 보이게 (선택)

> 🎯 **Cursor에 그대로 복사**  
> ```
> step 0 계약자 폼·평형 버튼·신청 버튼을 모바일(360px)에서도
> 글씨 16px+, 입력 높이 44px+, 버튼 48px+, 좌우 16px 여백으로 키워줘.
> ```

F12 → 📱 아이콘 → iPhone 등으로 확인.

[스크린샷: 모바일 시뮬레이터 — 평형 버튼 2열·3열]

---

## 6-6. GitHub Pages에 반영

1. Source Control → Message: `입주민 게이트 화면 step0`
2. Commit → Push
3. Actions 배포 후 인터넷 주소에서도 동일 화면 확인

---

## 6-7. 6장 완료 체크리스트

- [ ] `cd yyc-options` 후 `npm run dev` 로 사이트가 뜬다
- [ ] **계약자 정보 4칸** + **평형 버튼** + **신청 버튼 2개**가 보인다
- [ ] 4칸·평형 없으면 신청 버튼 **회색**
- [ ] 평형 선택 후 신청 버튼 **활성**
- [ ] 휴대폰은 **숫자 4자리**만
- [ ] (선택) GitHub Pages에서도 같다

---

## 6-8. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| `ENOENT package.json` | 프로젝트 밖에서 npm | `cd .../yyc-options` |
| 버튼 누르면 새로고침 | `<form>` 기본 제출 | `type="button"` 또는 preventDefault |
| 평형 버튼이 안 보임 | `TYPES` import 누락 | `import { TYPES } from './optionsCatalog.js'` |
| 휴대폰에 문자 입력됨 | 필터 없음 | onChange에서 `\D` 제거 + slice(0,4) |

---

📌 **다음 장 미리보기**  
7장에서 **「옵션 계약 신청 →」** 를 누르면 Supabase **`verify_yyc_resident`** 로 등록부를 확인하고,  
통과하면 **`setStep(1)`** 옵션 화면(8장)으로 넘어갑니다.  
4칸을 다 채우면 **평형 버튼이 자동으로 맞게 켜지는 기능**도 7장에 있습니다.

---

> 💪 **여기까지**  
> 화면(앞) 골격이 잡혔습니다. 7장에서 **인터넷 엑셀(DB)** 과 연결합니다.

---

<div class='page-break'></div>

# 7장. 입주민 검증 + 옵션 화면으로 들어가기 (`step 0` → `step 1`)

> **이 장에서 완성하는 것**  
> 6장 **`step 0`** 에서 **「옵션 계약 신청 →」**(또는 변경 신청)을 누르면:  
> 1. Supabase **`verify_yyc_resident`** 로 동·호·이름·휴대폰 뒷4자리 확인  
> 2. **선택한 평형(`typeKey`)** 이 등록부와 같으면 → **`setStep(1)`** (8장 옵션 화면)  
> 3. 틀리면 → **팝업(모달)** 으로 안내 (빨간 글씨 한 줄이 아님)  
>
> 추가: 4칸을 입력하는 동안 **등록부와 맞는 평형 버튼이 자동으로 선택**될 수 있습니다.  
>
> **소요 시간**: 약 1.5시간  
> **난이도**: ★★★ (Supabase ↔ 화면 첫 연결)

---

## 7-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **Supabase RPC** | "5장에서 만든 검색 매크로를 이름으로 부르기" |
| **`verify_yyc_resident`** | "4가지 정보로 등록부 1줄 찾기" |
| **`tryEnterOptionsFromGate`** | "신청 버튼 눌렀을 때 검증 후 step 1 로 보내는 함수" |
| **`lookupResidentTypeQuiet`** | "입력할 때 조용히 평형만 맞춰 주는 자동완성" |
| **`noticeModal`** | "틀렸을 때 뜨는 안내 팝업" |
| **로컬 폴백 (`DEV`)** | "개발 PC에만 있는 샘플 등록부 JSON" |

---

## 7-2. Supabase 전화기 준비

### (1) 패키지 (이미 있으면 생략)

```bash
cd /Users/dongwoolim/yyc-options
npm install @supabase/supabase-js
```

### (2) `.env.local` (로컬 개발용)

프로젝트 루트에:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...본인키...
```

[스크린샷: .env.local 두 줄]

⚠️ Git에 올리지 않기 (`.gitignore`에 `.env.local` 있는지 확인).  
수정 후 **`npm run dev` 재시작** (Ctrl+C → 다시 실행).

> 배포(GitHub Pages)는 **GitHub Secrets** 에 같은 이름으로 넣습니다 (16장).

---

## 7-3. 5장 SQL이 돌아가 있는지 확인

Supabase → **SQL Editor** → 5장에서 실행한  
`supabase/sql/yyc_resident_registry.sql` + 세대 **INSERT** 가 되어 있어야 합니다.

✅ Table Editor → `yyc_resident_registry` 에 테스트 행이 보임.

---

## 7-4. AI에게 검증 + `step 1` 이동 붙이기 🎯

> 🎯 **Cursor에 그대로 복사**  
> ```
> @App.jsx @optionsCatalog.js
>
> 1) verify_yyc_resident 호출 (REST rpc 또는 supabase.rpc):
>    p_dong, p_ho, p_contractor, p_phone_tail — 동·호는 숫자만, 이름 trim
>
> 2) async function tryEnterOptionsFromGate:
>    - !typeKey 이면 noticeModal "평형 선택"
>    - gateVerifying true
>    - verifyResidentForGate(...) → { typeKey } 또는 null
>    - null: noticeModal "등록 정보 불일치"
>    - row.typeKey !== typeKey: noticeModal "평형 확인" (등록 평형 이름 표시)
>    - 통과: setStep(1)
>    - finally gateVerifying false
>
> 3) step===0 의 「옵션 계약 신청 →」「옵션 계약 변경 신청 →」 onClick = tryEnterOptionsFromGate
>    disabled: gateVerifying || !dong || !ho || !contractor || phoneLast4.length!==4 || !typeKey
>    텍스트: gateVerifying ? "확인 중…" : 기본 문구
>
> 4) useEffect (step===0): 4칸 다 차면 lookupResidentTypeQuiet → typeKey 자동 설정 (바뀌면 setSel({}))
>
> 5) noticeModal: 제목+본문+확인 버튼 (alertdialog)
>
> DEV: RPC 빈 결과일 때 allowedResidents.sample.json 폴백 허용.
> Apply.
> ```

---

## 7-5. 브라우저에서 확인

```bash
cd /Users/dongwoolim/yyc-options
npm run dev
```

| 시험 | 입력·동작 | 기대 결과 |
|------|-----------|----------|
| **자동 평형** | 등록부와 맞는 4칸 입력 | 0.4초 안에 해당 **평형 버튼이 파란색** |
| **통과** | 맞는 4칸 + 맞는 평형 → **옵션 계약 신청 →** | **옵션 화면** (`step 1`) — 평면도·카드·오른쪽 합계 |
| **4항목 불일치** | 이름·휴대폰 등 하나 틀림 | 팝업 **「등록 정보 불일치」** |
| **평형만 틀림** | 4칸 맞고 다른 평형 버튼 선택 후 신청 | 팝업 **「평형 확인」** — 등록 평형 이름 안내 |
| **확인 중** | 신청 클릭 직후 | 버튼 **「확인 중…」** |
| **4칸 미완** | 휴대폰 3자리 | 신청 버튼 **회색** |

[스크린샷: 통과 — step1 헤더바 / 실패 — 등록 정보 불일치 팝업]

✅ 통과 시 **8장 옵션 화면**까지 보이면 7장 완료.

---

## 7-6. 로컬만 테스트할 때 (등록부 JSON)

공개 Git에는 실명 DB를 안 올립니다. 개발 PC에만:

1. `src/data/allowedResidents.json` (또는 샘플 복사)
2. 터미널: `npm run db:residents-sql` → 나온 SQL을 Supabase에서 실행  
   **또는** DEV 모드에서 샘플 JSON 폴백으로만 확인

> 운영(실제 입주)은 **Supabase 등록부만** 신뢰합니다.

---

## 7-7. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| `Invalid API key` | `.env.local` 오타 | 4장 키 다시 복사, dev 재시작 |
| `verify_yyc_resident does not exist` | 5장 SQL 미실행 | `yyc_resident_registry.sql` 전체 Run |
| 항상 등록 불일치 | DB에 행 없음 / 뒷4자리 다름 | Table Editor 데이터 확인 |
| 평형 확인 팝업 | `typeKey` 수동 선택이 등록과 다름 | 안내된 평형 버튼으로 다시 선택 |
| CORS / Failed to fetch | URL·네트워크 | URL 끝 `/` 없음, Supabase 상태 확인 |
| 자동 평형이 안 맞음 | RPC 실패·빈 결과 | 5장 SQL·INSERT, DEV면 JSON 폴백 |
| 팝업만 뜨고 step1 안 감 | `setStep(1)` 누락 | 7-4 프롬프트 다시 Apply |

---

## 7-8. 7장 완료 체크리스트

- [ ] `.env.local` (로컬) 또는 GitHub Secrets (배포) 설정
- [ ] 등록부에 있는 4칸 → **옵션 계약 신청 →** → **`step 1`** 진입
- [ ] 틀린 4칸 → **등록 정보 불일치** 팝업
- [ ] 평형만 틀림 → **평형 확인** 팝업
- [ ] 확인 중 **「확인 중…」** 표시
- [ ] (선택) 4칸 입력 시 평형 버튼 **자동 선택**

---

📌 **다음 장 미리보기**  
8장: `step 1` 에서 **`optionsCatalog.js`** 기준 옵션 카드·가격·합계·이미지(8-7절)를 다룹니다.

---

<div class='page-break'></div>

# 8장. 평형별 옵션 화면 만들기

> **이 장에서 완성하는 것**  
> 6·7장에서 만든 **첫 화면(계약자 정보)** 에서 입주민 확인이 끝나면 →  
> **`step === 1` 옵션 화면**으로 넘어가고, 평형(예: `59㎡A`)에 맞는 **카테고리별 옵션 카드**가 나옵니다.  
> **「선택」** 버튼으로 고르면 **오른쪽 사이드바 합계**가 바로 바뀝니다.  
>
> **소요 시간**: 약 2시간 (이미지 넣기는 8-7절 — 추가 1~2일)  
> **난이도**: ★★★

---

## 8-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **`src/optionsCatalog.js`** | "19개 평형 **메뉴판 + 가격 + 그림 주소** 한 파일 (단일 소스)" |
| **`TYPES`** | "메뉴판 묶음 배열 — 평형 1개 = 객체 1개" |
| **`opts`** | "그 평형의 마감·주방·붙박이·공간 옵션 줄 목록" |
| **`getAppliances(t)`** | "가전(인덕션·냉장고·비데 등) 목록 — 평형마다 `ac`·`vent`·`dual` 가격만 다름" |
| **`step`** | "지금 몇 번째 화면인지 번호 (0=입력, 1=옵션, 2=서명·제출)" |
| **`sel`** | "선택한 옵션 id → 가격 맵 (엑셀 SUMIF용 메모)" |
| **`CatalogImage`** | "평면도·비교 그림 여백을 흰색으로 맞춰 주는 표시 부품 (코드에 이미 있음)" |

### 화면 흐름 (지금 프로젝트 기준)

| step | 화면 | 하는 일 |
|------|------|---------|
| **0** | 계약자 정보 + 평형 버튼 | 동·호·이름·휴대폰 4자리 → **옵션 계약 신청 →** (입주민 RPC 확인) |
| **1** | 평면도 + 옵션 카드 + **오른쪽 합계** | 카테고리별 **선택** 토글 → **신청서 확인 →** |
| **2** | 신청 요약 + 서명 | 서명 후 제출 (10·11장과 연결) |

> 💡 예전 교재의 `OPTIONS_CATALOG` 이름은 **쓰지 않습니다.** 지금은 **`TYPES` + `getAppliances`** 입니다.

---

## 8-2. `optionsCatalog.js` 구조 이해하기

파일 위치: **`src/optionsCatalog.js`** (이미 있으면 **열어서 가격·문구만 수정**).

### (1) 평형 1개 블록 예시 (`59A`)

```js
export const TYPES = [
  // ... 다른 평형 ...
  {key:'59A', name:'59㎡A', opts:[
    {id:'wall', cat:'벽 마감재 특화', label:'벽(현관, 복도, 거실, 주방) 시트 판넬', base:'실크 벽지', price:3400000},
    {id:'living', cat:'거실마감재 특화', label:'거실 아트월(...)', base:'거실 아트월(...)', price:4200000, notes:['※ ...']},
    {id:'kitchen', cat:'주방 마감 및 가구 특화', label:'...', base:'...', price:4500000,
      baseImg:'https://i.imgur.com/y8vaEXd.png', img:'https://i.imgur.com/ukypmcj.png'},
    {id:'closet_침실1', cat:'붙박이장', label:'...', base:'', price:3900000, baseImg:'...', img:'...'},
    {id:'space', cat:'공간(드레스룸) 특화', label:'...', base:'', price:1200000,
      baseImg:'...', img:'...', group:'g59A'},
  ],
  ac:6400000, vent:1200000, dual:true,
  floorPlan:'https://i.imgur.com/UW6y8Yf.png',
  fridgeBaseImg:'https://i.imgur.com/Wwqgatz.png',
  fridgeImg:'https://i.imgur.com/CUL8p92.png'},
];
```

### (2) 칼럼(필드) 표 — 옵션 한 줄(`opts` 안)

| 필드 | 필수 | 의미 |
|------|------|------|
| `id` | ✅ | 옵션 고유 이름 (영문·숫자, 예: `kitchen`) |
| `cat` | ✅ | 화면 카테고리 제목 (예: `거실마감재 특화`) |
| `label` | ✅ | 유상 선택형 설명 (긴 문장 OK) |
| `base` | ✅ | 미선택형 설명 (`''` 가능) |
| `price` | ✅ | 숫자만 (따옴표 없음) `4500000` |
| `notes` | | 주의 문구 배열 `['※ ...', '※ ...']` |
| `baseImg` / `img` | | 2열 비교 그림 URL (8-7절) |
| `group` | | **상호 배타** — 같은 `group` 은 하나만 선택 |

### (3) 평형 줄 끝 필드

| 필드 | 의미 |
|------|------|
| `ac` | 시스템에어컨 가격 (가전 목록에 반영) |
| `vent` | 환풍기 가격 |
| `dual` | `true` = 욕실 2개 타입(비데 2세트), `false` = 1세트 |
| `floorPlan` | 상단 평면도 URL |
| `fridgeBaseImg` / `fridgeImg` | 냉장고 미선택/선택 그림 |

### (4) 19개 평형 키 (`key`)

`43`, `48A`, `48B`, `52A`, `52B`, `52C`, `55A`, `55B`,  
`59A`, `59B`, `59C`, `59D`, `59E`, `59F`, `65A`, `65B`, `68`, `79`, `84`

> 5장 등록부 `type_key` 와 **철자까지 동일**해야 자동 평형 선택이 맞습니다.

### (5) 가전은 `getAppliances(t)` 에 있음

`opts` 에 넣지 않아도 됩니다. `App.jsx` 가 평형 객체 `t` 를 넘겨 **인덕션·오븐·냉장고·비데** 등을 붙입니다.  
가전 가격 중 `ac`, `vent` 는 평형 줄의 숫자를 씁니다.

> 💡 **옵션·가격·주의문·이미지 URL이 바뀌면** 이 파일만 고치고 push 하면 신청 화면·관리자 엑셀 열이 같이 따라갑니다.

---

## 8-3. `App.jsx` 와 연결 (이미 되어 있는지 확인)

`App.jsx` 상단에 아래가 있으면 **8-3은 읽기만** 하면 됩니다.

```js
import { TYPES, getAppliances } from "./optionsCatalog.js";
import { CatalogImage } from "./CatalogImage.jsx";
```

> 🎯 **처음부터 다시 붙일 때만** Cursor에 복사  
> ```
> @App.jsx @optionsCatalog.js
> - import { TYPES, getAppliances } from './optionsCatalog.js'
> - step 0: 계약자 4칸 + TYPES 평형 버튼 + verify_yyc_resident 통과 시 setStep(1)
> - step 1: typeData = TYPES.find(t => t.key === typeKey)
>   - 상단 floorPlan (CatalogImage)
>   - getOrderedOptionCategories 로 PDF 순서대로 cat-section
>   - 마감 옵션: cmp-card + 선택 토글, baseImg/img 있으면 2열 그림
>   - 가전: app-table 맨 아래, 냉장고만 baseImg/img
>   - 오른쪽 sidebar: 선택 목록 + 합계 + 「신청서 확인 →」 setStep(2)
> - sel 상태: { [optionId]: price }
> - group 있는 옵션은 상호 배타(다른 선택 시 excluded 표시)
> 기존 10·11장 제출·서명 흐름은 유지. Apply.
> ```

---

## 8-4. 브라우저 확인 (`step === 1`)

```bash
cd /Users/dongwoolim/yyc-options
npm run dev
```

등록부에 있는 **테스트 동·호**로 6장 입력 → **옵션 계약 신청 →** 클릭.

✅ **성공 화면**

1. **맨 위** 평면도(또는 placeholder)
2. **카테고리 제목** (예: ▣ 거실마감재 특화 옵션 선택) — PDF 순서와 비슷
3. 각 줄 **「선택」** → 누르면 파란 테두리 + 오른쪽 **선택 내역**에 추가
4. **가전 옵션** 블록이 **맨 아래** (냉장고 2열 그림 포함 가능)
5. 오른쪽 **합계** 숫자가 선택할 때마다 즉시 변경
6. **「신청서 확인 →」** → 서명 화면(`step 2`)

[스크린샷: 평면도 + 옵션 카드 + 오른쪽 선택 내역·합계]

> 선택을 **0개**로 둬도 **「신청서 확인 →」** 는 누를 수 있습니다 (전체 미선택형 신청).

---

## 8-5. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| 평형 버튼이 안 눌림 / 다음 회색 | 등록부 4항목 불일치 | 5장 `type_key`·이름·휴대폰 뒷4자리 확인 |
| 옵션 화면이 비어 있음 | `typeKey` 가 `TYPES` 에 없음 | `optionsCatalog.js` 의 `key` 와 등록부 일치 |
| 합계가 `NaN` | `price` 에 따옴표·쉼표 | `price:4500000` 숫자만 |
| 카테고리 순서가 PDF와 다름 | `TYPE_OPTION_CARD_ORDER` | `App.jsx` 해당 객체에 평형 키 추가·순서 수정 |
| 붙박이·공간 둘 다 안 됨 | `group` 상호 배타 | PDF 안내대로 하나만 선택 가능 (정상) |
| 2열 그림이 안 나옴 | `cat` 이름 또는 URL 없음 | `주방 마감 및 가구 특화` 등 + `baseImg`/`img` (8-7) |
| `npm ENOENT package.json` | 홈(`~`)에서 npm 실행 | `cd .../yyc-options` 후 실행 |

---

## 8-6. 8장 완료 체크리스트

- [ ] `src/optionsCatalog.js` 에 **19개** `key` 가 있다
- [ ] 등록부 `type_key` 와 카탈로그 `key` 가 같다
- [ ] `step 1` 에서 평형별 **카테고리·옵션 문구**가 다르게 보인다
- [ ] **선택** 토글 시 오른쪽 합계·선택 내역이 즉시 바뀐다
- [ ] **신청서 확인 →** 로 `step 2` (서명) 이동
- [ ] **← 처음으로** 로 `step 0` 복귀
- [ ] (선택) 8-7~8-12 로 평면도·비교 이미지 URL 입력 완료

---

## 8-7. 평면도·옵션 비교 이미지 넣기 (실무 추가 작업)

> **이 절에서 완성하는 것**  
> PDF 안내서에 있는 **평면도**, **미선택형/선택형 비교 그림**이 신청 화면에 보입니다.  
> **코드는 이미 들어 있습니다.** 운영자가 할 일은 **그림 파일 올리기 + URL 한 줄 붙이기** 뿐입니다.  
>
> **소요 시간**: 평형 1개당 약 10~20분 (19개 타입이면 하루~이틀 분량)  
> **난이도**: ★★ (복붙 위주)

### 8-7-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **`optionsCatalog.js`** | "19개 평형 메뉴판 + 그림 주소록 **한 파일**" |
| **`floorPlan`** | "맨 위 큰 평면도 주소" |
| **`baseImg` / `img`** | "왼쪽(미선택형) / 오른쪽(선택형) 비교 그림 주소" |
| **Imgur** | "그림을 인터넷에 올려 두고 링크만 받는 무료 사진 창고" |
| **표시 크기** | "주소만 맞으면 됨 — 화면 크기는 CSS가 맞춤 (타입마다 픽셀 맞출 필요 없음)" |

### 8-7-2. 어떤 그림을 어디에 넣나

| 화면에 보이는 것 | `optionsCatalog.js` 에 넣는 위치 | 필수? |
|------------------|----------------------------------|--------|
| 상단 **평면도** | 해당 평형 `{ key:'59A', ... floorPlan:'https://...' }` | ✅ 타입마다 1장 |
| **주방·붙박이·공간** 2열 비교 | 해당 옵션 `{ ..., baseImg:'...', img:'...' }` | PDF에 그림 있을 때만 |
| **냉장고** 미선택/선택 | `fridgeBaseImg`, `fridgeImg` (평형 줄 끝) | 가전 옵션 쓰는 타입만 |
| 거실·욕실 등 **텍스트만** 옵션 | `baseImg` 없음 → 그림 칸 안 나옴 (정상) | — |

> 💡 **작업 순서 추천**: ① 19개 타입 `floorPlan` 전부 → ② 주방/붙박이/공간 `baseImg`·`img` → ③ 냉장고(같은 URL 여러 타입 재사용 가능)

---

## 8-8. PDF에서 캡처 → Imgur에 올리기

### (1) PDF에서 영역만 캡처

1. PDF 뷰어(미리보기·Adobe 등)에서 **평면도 페이지** 또는 **옵션 비교 페이지**를 연다.
2. **Mac**: `Command + Shift + 4` → 드래그해서 영역만 저장.  
   **Windows**: `Win + Shift + S` → 영역 선택 → 저장.
3. 파일 이름 예: `59A-평면도.png`, `59A-주방-미선택.png`

[스크린샷: PDF 평면도 + 영역 캡처]

✅ **성공 화면**: 바탕이 흰색에 가깝고, 도면·범례가 잘리지 않은 PNG 파일 1개가 바탕화면(또는 다운로드)에 생김.

### (2) Imgur에 업로드

1. 브라우저에서 [https://imgur.com/upload](https://imgur.com/upload) 연다.
2. 방금 저장한 PNG를 **끌어다 놓기** (또는 "New post" → 파일 선택).
3. 업로드가 끝나면 그림 위에서 **우클릭 → "이미지 주소 복사"** (또는 "Copy image address").

✅ **성공 화면**: 클립보드에 아래처럼 **https 로 시작**하는 주소가 복사됨.

```text
https://i.imgur.com/xxxxxxxx.png
```

> ⚠️ `http://` 만 있거나, 페이지 주소(`imgur.com/a/...`)가 아니라 **직접 그림 주소**(`i.imgur.com/....png`) 인지 확인합니다.

### (3) 캡처 팁 (나중에 화면이 예쁘게 나오게)

- PDF 여백이 너무 크면 도면이 작아 보입니다. **도면+범례만** 최대한 타이트하게 캡처.
- 회색 바탕 PDF는 사이트에서 **흰 배경**으로 맞춰 보이도록 이미 처리되어 있습니다. (냉장고 사진은 별도 규칙)

---

## 8-9. `optionsCatalog.js`에 URL 붙이기

### (1) 파일 열기

1. Cursor 왼쪽 파일 트리 → **`src/optionsCatalog.js`** 클릭.
2. `Command + F` 로 평형 키 검색 (예: `59A`).

### (2) 평면도 1줄 넣기

해당 평형 블록 **맨 끝 쉼표 앞**에 `floorPlan` 을 추가하거나 수정합니다.

```js
{key:'59A', name:'59㎡A', opts:[ /* ... */ ],
  ac:6400000, vent:1200000, dual:true,
  floorPlan:'https://i.imgur.com/UW6y8Yf.png',
  fridgeBaseImg:'https://i.imgur.com/Wwqgatz.png',
  fridgeImg:'https://i.imgur.com/CUL8p92.png'},
```

> 작은따옴표 `'` 로 감싸고, 주소 끝에 **쉼표** 있는지 확인.

### (3) 옵션 비교 그림 2줄 넣기 (주방·붙박이·공간)

PDF에 **미선택형 / 선택형** 그림이 있는 옵션만 넣습니다.

```js
{id:'kitchen', cat:'주방 마감 및 가구 특화', label:'...', base:'...', price:4500000,
  baseImg:'https://i.imgur.com/y8vaEXd.png',
  img:'https://i.imgur.com/ukypmcj.png',
  notes:[ /* ... */ ]},
```

| 필드 | 의미 |
|------|------|
| `baseImg` | 왼쪽 칸 — **기본 미선택형** 그림 |
| `img` | 오른쪽 칸 — **유상 선택형** 그림 |

### (4) 냉장고 (가전) 그림

여러 평형이 **같은 냉장고 사진**을 쓰면 URL을 **그대로 복사**해 넣어도 됩니다.

```js
fridgeBaseImg:'https://i.imgur.com/Wwqgatz.png',
fridgeImg:'https://i.imgur.com/CUL8p92.png',
```

### (5) 저장 → GitHub에 올리기

1. `Command + S` 저장.
2. Cursor Source Control(왼쪽 가지 모양) → **Commit** → **Push** (2·3장에서 했던 것과 동일).
3. GitHub Actions 배포가 끝난 뒤(16장) 사이트에서 확인.

> 🎯 **Cursor에 그대로 복사** (한 타입 일괄 반영할 때)  
> ```
> @optionsCatalog.js 에서 key가 '52C' 인 타입에 아래 URL을 넣어줘.
> - floorPlan: https://i.imgur.com/eSeJZFl.png
> - (해당 opts 중 space 옵션에) baseImg: ..., img: ...
> 냉장고 URL은 건드리지 마. 문법(쉼표·따옴표) 깨지지 않게 Apply.
> ```

---

## 8-10. 화면에서 확인하기

### (1) 로컬에서 먼저 보기

터미널은 **반드시 프로젝트 폴더**에서 실행합니다.

```bash
cd /Users/dongwoolim/yyc-options
npm run dev
```

브라우저에 나온 주소(보통 `http://localhost:5173`) → 입주민 검증 통과 → 해당 평형 선택.

✅ **성공 화면**

1. **맨 위** 흰 카드 안에 평면도가 보인다 (잘리지 않고, 좌우 회색 띠 없음).
2. **주방 마감 및 가구 특화 / 붙박이장 / 공간(드레스룸) 특화** 카드에 **왼쪽·오른쪽** 그림 2칸이 보인다.
3. **가전(냉장고)** 는 맨 아래 — 평면도·주방 비교 그림만 `CatalogImage` 로 여백 정리 (냉장고는 원본 그대로, 정상).

[스크린샷: 평면도 + 2열 옵션 비교 + 냉장고 구역]

### (2) 19개 타입 점검표 (운영용)

| 확인 | 타입 키 |
|------|---------|
| ☐ | 43, 48A, 48B, 52A, 52B, 52C, 55A, 55B |
| ☐ | 59A, 59B, 59C, 59D, 59E, 59F |
| ☐ | 65A, 65B, 68, 79, 84 |

각 타입마다: `floorPlan` 있음 → 비교 그림 필요한 카테고리만 `baseImg`/`img` 있음.

### (3) 선택: 그림 파일을 프로젝트에 박아 두기 (고급)

인터넷(Imgur) 대신 **내 서버에 파일**로 두고 싶을 때만:

```bash
cd /Users/dongwoolim/yyc-options
npm run images:normalize
```

- 냉장고 URL은 **자동 제외**됩니다.
- `public/images/catalog/` 에 저장되고, `optionsCatalog.js` 주소가 바뀝니다.
- **Imgur에서 받기 실패**하면 이 명령은 안 됩니다. 그때는 8-8~8-9(Imgur)만 쓰면 됩니다.

---

## 8-11. 이미지 관련 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| `npm error ENOENT package.json` | 홈 폴더(`~`)에서 `npm run dev` 실행 | `cd /Users/dongwoolim/yyc-options` 후 다시 실행 |
| 평면도 깨진 아이콘 🖼 | URL 오타 / Imgur 삭제 | 브라우저 새 탭에 URL 붙여 넣어 그림이 뜨는지 확인 |
| 옵션 카드에 그림 칸 없음 | `baseImg`·`img` 둘 다 없음 | PDF에 그림 없으면 정상. 있으면 8-9대로 추가 |
| 주방만 글자, 그림 없음 | 카테고리명이 `주방 마감 특화` (가구 없음) | 2열 그림은 **`주방 마감 및 가구 특화`** 등에만 표시 |
| 평면도만 너무 작고 여백 많음 | PDF 캡처 여백이 큼 | 8-8에서 도면을 더 타이트하게 다시 캡처 |
| 배포 후에도 옛 그림 | 캐시 / Actions 미완료 | 시크릿 창 + Actions 초록 ✅ 확인 후 재접속 |

---

## 8-12. 8장(이미지 포함) 완료 체크리스트

- [ ] 19개 타입 모두 `floorPlan` URL 있음
- [ ] PDF에 있는 비교 그림은 `baseImg` / `img` 쌍으로 들어감
- [ ] Imgur 주소가 `https://i.imgur.com/xxxx.png` 형식
- [ ] 로컬 `npm run dev` 로 2~3개 타입(작은 평형·큰 평형·59A) 눈으로 확인
- [ ] Push 후 GitHub Pages에서도 동일하게 보임

---

📌 **다음 장 미리보기**  
9장에선 **「신청서 확인 →」** 이후 **`step 2`** — 옵션 요약·**서명**·**신청완료** 화면을 다룹니다.

---

<div class='page-break'></div>

# 9장. 신청서 확인 · 서명 · 제출 (`step 2`)

> **이 장에서 완성하는 것**  
> 8장 **`step 1`** 에서 **「신청서 확인 →」** 를 누르면 → **`step 2`** 화면이 뜹니다.  
> - 선택한 옵션 **요약 표** (동·호·계약자·평형은 **6장에서 입력한 값** 그대로)  
> - **정자 서명** (캔버스) → **서명 완료**  
> - **「신청완료」** (진짜 DB 저장은 **11장**)  
>
> ⚠️ 이 프로젝트에는 **주민번호·이메일·주소를 또 받는 폼이 없습니다.**  
> 개인정보 4항목은 **입주민 게이트(`step 0`)** 에서만 받습니다.  
>
> **소요 시간**: 약 2시간  
> **난이도**: ★★★

---

## 9-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **`step 2`** | "마지막 확인·서명·제출 화면" |
| **`summary-card`** | "신청서 한 장 요약지" |
| **`signData`** | "서명 PNG를 긴 문자(base64)로 저장한 값" |
| **`confirmSign`** | "그린 서명을 잘라서 확정" |
| **`onSubmitComplete`** | "신청완료 버튼 — DB·접수번호 (11장)" |
| **`contractPreviewOpen`** | "제출 후 계약서 PDF 형태 미리보기 팝업" |

### 화면 흐름 (지금 프로젝트)

| step | 화면 |
|------|------|
| 0 | 계약자 4칸 + 평형 + **옵션 계약 신청 →** |
| 1 | 옵션 선택 + **신청서 확인 →** |
| **2** | **요약 + 서명 + 신청완료** ← 이 장 |

---

## 9-2. `step 2` 화면에 무엇이 보이나

[스크린샷: summary-card — 제목·동호·계약자·옵션 표·합계·서명칸·버튼]

| 영역 | 내용 |
|------|------|
| **summary-info** | 평형, 동/호, 계약자명 |
| **summary-table** | 선택한 옵션 구분·내용·금액 (0개면 "전체 미선택형") |
| **서명** | 캔버스 → **서명 완료** → 작은 서명 이미지 + (인) |
| **버튼** | 신청완료 · 인쇄하기 · (성공 후) 계약서 미리보기 · 옵션 수정 · 새로 작성 |

---

## 9-3. AI에게 `step 2` 붙이기 🎯

> 🎯 **Cursor에 그대로 복사**  
> ```
> @App.jsx step 흐름 정리:
>
> - step===1 sidebar 「신청서 확인 →」 onClick → setStep(2)
> - step===2 (기본 return, step 0·1 이 아닐 때):
>   - summary-card: typeData.name, dong, ho, contractor
>   - selectedList + total 표
>   - canvas 서명 (mouse/touch), 지우기, 서명 완료 → signData (PNG base64, crop)
>   - 다시 쓰기 / sign-redo-inline
>   - primary 「신청완료」 disabled={!signData || submitting}
>     onClick → onSubmitComplete (11장에서 RPC 연결)
>   - secondary: 인쇄하기 window.print()
>   - 성공 후 계약서 미리보기 modal (ApplicationFormPrint)
>   - 「← 옵션 수정」 setStep(1)
>   - 「새로 작성」 setStep(0) + sel/sign 초기화
>
> 별도 step 'form' / 주민번호·이메일 폼은 만들지 않음.
> Apply.
> ```

---

## 9-4. 브라우저 확인

```bash
cd /Users/dongwoolim/yyc-options
npm run dev
```

`step 0` → `step 1` → 옵션 몇 개 선택 → **신청서 확인 →**

| 시험 | 동작 | 기대 |
|------|------|------|
| 요약 표 | 선택한 옵션·합계 | 8장에서 고른 것과 같음 |
| 서명 전 | **신청완료** | **회색** |
| 캔버스에 서명 | 선 그어짐 | placeholder 사라짐 |
| **서명 완료** | 클릭 | 서명 이미지로 바뀜 |
| **신청완료** | 클릭 | 11장 연결 시 접수 성공 배너 |
| **지우기 / 다시 쓰기** | | 서명 초기화, 완료 버튼 회색 |
| **← 옵션 수정** | | `step 1`, 선택 유지 |
| **인쇄하기** | | 인쇄 대화상자 (계약서 레이아웃) |
| 폰 F12 모바일 | 손가락 서명 | 페이지 스크롤 덜 튀도록 (touch-action) |

✅ 위가 되면 **9장 UI 통과** (DB는 11장).

---

## 9-5. 서명 동작만 따로 이해하기 (10장 보조)

서명은 **`App.jsx` 안의 `<canvas>`** 에 직접 그립니다. (`SignaturePad.jsx` 파일은 **없어도 됨**.)

1. **그리기** — `startDraw` / `moveDraw` / `endDraw`  
2. **서명 완료** — `confirmSign` 이 빈 여백 잘라 `signData` 저장  
3. **지우기** — `clearSign`

> 나중에 코드 정리만 하고 싶으면 10장(선택)처럼 `SignaturePad.jsx` 로 분리해도 됩니다.

---

## 9-6. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| 신청서 확인 눌러도 안 넘어감 | `setStep(2)` 없음 | 9-3 프롬프트 Apply |
| 신청완료 항상 회색 | `signData` 없음 | 서명 후 **서명 완료** 클릭 |
| 서명 완료 눌러도 반응 없음 | 한 점도 안 그림 | 캔버스에 선을 그은 뒤 클릭 |
| 폰에서 그릴 때 화면 스크롤 | touch 기본 동작 | `touch-action: none` on canvas box |
| 제출 실패 빨간 배너 | 11장 RPC·SQL | 11장·19장 F-02 참고 |
| 옵션 수정 후 합계 0 | 정상일 수 있음 | 선택 안 하면 미선택형 신청 |

---

## 9-7. 9장 완료 체크리스트

- [ ] `step 1` → **신청서 확인 →** → `step 2` 진입
- [ ] 동·호·계약자·선택 옵션이 **요약 표**에 맞게 보임
- [ ] 서명 없으면 **신청완료** 비활성
- [ ] **서명 완료** 후 **신청완료** 활성
- [ ] **옵션 수정** → `step 1` 복귀
- [ ] **새로 작성** → `step 0` 복귀
- [ ] (11장 후) 성공 시 **계약서 미리보기**·초록 배너

---

## 9-8. 개인정보 안내 (운영 문구용)

게이트(`step 0`) 안내와 맞춰 두세요.

- 수집: 동·호·계약자명·휴대폰 뒷 4자리·선택 옵션·서명  
- 목적: 옵션 계약 신청 처리  
- **주민번호 뒷자리·이메일·자택주소는 이 사이트 UI에서 받지 않음** (계약서·등록부와 별도 운영이면 내부 절차로)

---

📌 **다음 장 미리보기**  
- **10장**: 서명 캔버스만 파일로 분리하는 **선택** 정리  
- **11장**: **「신청완료」** → `submit_application` RPC 로 DB 저장 + 접수번호

---

<div class='page-break'></div>

# 10장. (선택) 서명 캔버스 컴포넌트 분리

> **이 장은 필수가 아닙니다.**  
> **9장**에서 이미 `App.jsx` 안에 서명(캔버스 + 서명 완료 + `signData`)이 들어 있습니다.  
> 코드가 길어져서 **서명 부분만 파일로 빼고 싶을 때** 이 장을 따르세요.  
>
> **소요 시간**: 약 1시간  
> **난이도**: ★★

---

## 10-1. 언제 하면 좋나

| 상황 | 10장 필요? |
|------|------------|
| 9장까지 화면·제출이 잘 됨 | ❌ 건너뛰어도 됨 |
| `App.jsx` 가 너무 길어서 정리하고 싶음 | ✅ |
| 서명 UI만 다른 프로젝트에 재사용 | ✅ |

---

## 10-2. AI에게 `SignaturePad.jsx` 만들라고 시키기 🎯

> 🎯 **Cursor에 그대로 복사**  
> ```
> src/SignaturePad.jsx 를 만들고 App.jsx step 2 서명 부분을 교체해줘.
>
> SignaturePad props: { value, onChange }
> - canvas + pointer/mouse/touch 그리기, touch-action none
> - 지우기 → onChange('')
> - 서명 완료 버튼은 부모(App)에 두고, onChange(dataURL) 로 signData 설정
>
> App.jsx 의 confirmSign/crop 로직은 SignaturePad 내부 또는 onChange 직전에 유지.
> step 흐름(0·1·2)과 onSubmitComplete 는 건드리지 마.
> Apply.
> ```

---

## 10-3. 확인

9장과 동일: 서명 → 서명 완료 → 신청완료 활성.

---

## 10-4. 10장 체크리스트

- [ ] `SignaturePad.jsx` (또는 동일 역할 파일) 존재
- [ ] `App.jsx` import 후 `step 2` 에서 사용
- [ ] 9장 시험 항목이 그대로 통과

---

📌 **다음**: **11장** — `신청완료` 시 Supabase `submit_application` 저장.

---

<div class='page-break'></div>

# 11장. 신청 데이터 인터넷 엑셀(DB)에 진짜 저장

> **이 장에서 완성하는 것**  
> 9장 **`step 2`** 에서 **「신청완료」** 를 누르면:  
> 1. **`next_yyc_receipt_no`** 로 접수번호 발급 (`YYC-20260516001` 형식)  
> 2. **`submit_application`** RPC 로 `applications` 테이블에 1줄 저장  
> 3. 같은 화면에 **초록 접수 배너** + **계약서 미리보기** 팝업  
>
> **개인정보**: 주민번호·이메일·주소는 **받지 않습니다.**  
> 게이트 4항목 + 선택 옵션 + 서명만 저장합니다.  
>
> **소요 시간**: 약 2시간  
> **난이도**: ★★★★ (SQL은 파일 복붙 위주)

---

## 11-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **`applications` 테이블** | "신청서 보관함 — 1줄 = 1신청" |
| **`selected_options` (jsonb)** | "선택한 옵션 목록을 통째로 넣는 칸" |
| **`selected_options_summary`** | "옵션 목록을 한 줄 글로 요약 (관리자·엑셀용)" |
| **`next_yyc_receipt_no`** | "오늘 날짜 기준 일련번호 매기기" |
| **`submit_application(payload)`** | "받은 JSON 그대로 INSERT (합계는 서버가 다시 계산)" |
| **`buildApplicationPayloadFromState`** | "화면 상태 → 저장용 JSON 만드는 함수 (`App.jsx`)" |

### 저장 흐름 (지금 코드)

```
신청완료 클릭
  → fetchNextReceiptNoFromSupabase()     // POST /rpc/next_yyc_receipt_no
  → buildApplicationPayloadFromState() // payload 조립
  → saveApplicationToSupabase()         // POST /rpc/submit_application  body: { payload }
  → 성공 배너 + 계약서 미리보기
```

---

## 11-2. `applications` 테이블 만들기 (처음 1회)

Supabase **SQL Editor → New query** → 아래 실행 → **Run**.

```sql
CREATE TABLE IF NOT EXISTS public.applications (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  receipt_no text UNIQUE NOT NULL,
  customer_name text NOT NULL DEFAULT '미입력',
  phone text NOT NULL DEFAULT '',
  dong text NOT NULL,
  ho text NOT NULL,
  unit_type text NOT NULL,
  selected_options jsonb NOT NULL DEFAULT '[]'::jsonb,
  selected_options_summary text,
  total_price numeric NOT NULL DEFAULT 0,
  signature_data_url text NOT NULL DEFAULT '',
  printed boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT '접수됨',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.applications FROM PUBLIC;
```

✅ Table Editor → `applications` 테이블이 보이면 성공.

> **예전 교재 스키마**(`resident_id_first6`, `email`, `options`, `total_amount` …) 로 이미 만들어 둔 DB라면 아래 **11-2-1** 을 쓰세요.  
> 테스트 DB만 비워도 되면: **`supabase/sql/applications_create_table.sql`** 만 실행해도 됩니다.

### 11-2-1. 옛 DB → 지금 스키마로 맞추기 (운영 데이터 있을 때)

1. (권장) Table Editor → `applications` → Export 백업  
2. SQL Editor에서 **`supabase/sql/applications_migrate_to_current_schema.sql`** 전체 **Run**  
3. 이어서 **11-3** (`next_yyc_receipt_no.sql` → `submit_application.sql`)

✅ Table Editor 칼럼에 `selected_options`, `total_price`, `status` 등이 보이고  
`resident_id_first6`, `email` 등은 사라지면 성공.

### (선택) 같은 동·호 중복 막기

운영 정책상 **1세대 1접수**만 허용할 때:

```sql
ALTER TABLE public.applications
  ADD CONSTRAINT applications_unique_per_unit UNIQUE (dong, ho);
```

> 현재 `submit_application.sql` 은 RPC 안에서 중복 검사를 **하지 않습니다.**  
> 위 제약이 있으면 두 번째 INSERT 시 DB 오류 → 앱에는 일반 실패 메시지로 보입니다.

---

## 11-3. 접수번호 + 저장 RPC SQL 파일 실행

레포에 있는 SQL을 **통째로** Supabase에서 실행합니다. (교재에 긴 SQL 다시 적지 않음)

### (1) 접수번호

1. Cursor에서 파일 열기: **`supabase/sql/next_yyc_receipt_no.sql`**
2. 전체 복사 → SQL Editor → **Run**

✅ `yyc_receipt_counter` 테이블 + `next_yyc_receipt_no()` 함수 생성.

테스트:

```sql
SELECT public.next_yyc_receipt_no();
-- 예: YYC-20260516001
```

### (2) 신청 저장 RPC

1. 파일: **`supabase/sql/submit_application.sql`**
2. 전체 복사 → SQL Editor → **Run**

✅ `submit_application(payload jsonb)` — **반환값 void** (접수번호는 앱이 미리 넣은 `payload.receipt_no` 사용).

> ⚠️ 인자 이름은 **`payload`** 입니다. `{ p: ... }` 가 아닙니다.

---

## 11-4. 앱이 보내는 `payload` 모양 (확인용)

`App.jsx` 의 `buildApplicationPayloadFromState` 가 만드는 JSON:

```json
{
  "receipt_no": "YYC-20260516001",
  "customer_name": "홍길동",
  "phone": "5604",
  "dong": "101",
  "ho": "1504",
  "unit_type": "59㎡A",
  "selected_options": [
    {
      "option_id": "kitchen",
      "option_key": "kitchen|주방 마감 및 가구 특화|...",
      "category": "주방 마감 및 가구 특화",
      "label": "...",
      "price": 4500000
    }
  ],
  "total_price": 4500000,
  "signature_data_url": "data:image/png;base64,...",
  "printed": true,
  "status": "접수됨"
}
```

| 필드 | 의미 |
|------|------|
| `phone` | **휴대폰 뒷 4자리** (전화번호 전체 아님) |
| `unit_type` | 화면 표시 평형명 (`59㎡A`) |
| `total_price` | 화면 합계 (DB에는 **옵션 price 합**으로 다시 계산해 저장) |

---

## 11-5. `App.jsx` 연결 확인 🎯

이미 들어 있으면 **읽기만** 하세요.

> 🎯 **처음부터 붙일 때 Cursor에 복사**  
> ```
> @App.jsx
> - onSubmitComplete (신청완료):
>   1) fetchNextReceiptNoFromSupabase() → receiptNo
>   2) buildApplicationPayloadFromState({ dong, ho, contractor, phoneLast4, unitType: typeData.name, selectedList, total, signData, receiptNo })
>   3) POST /rest/v1/rpc/submit_application  body: JSON.stringify({ payload })
>   4) 성공: submitResult ok 배너 + setContractPreviewOpen(true)
>   5) 실패: submitResult err + noticeModal
> - submitting 중 버튼 「제출 중...」, !signData 이면 disabled
> step 은 2 유지 (별도 step 'done' 없음). Apply.
> ```

---

## 11-6. 끝부터 끝까지 시험

```bash
cd /Users/dongwoolim/yyc-options
npm run dev
```

`step 0` → 입주민 통과 → `step 1` 옵션 선택 → `step 2` 서명 완료 → **신청완료**

| 시험 | 기대 |
|------|------|
| 정상 제출 | 초록 배너 + **계약서 미리보기** 팝업 |
| Table Editor | `receipt_no`, `dong`, `ho`, `selected_options`, `signature_data_url` 1줄 |
| 접수번호 형식 | `YYC-YYYYMMDD` + 3자리 일련 (예: `YYC-20260516001`) |
| 같은 호 재제출 | (UNIQUE dong,ho 넣었으면) 실패 메시지 |
| RPC 없음 | 빨간 배너 + 모달에 SQL 실행 안내 문구 |

[스크린샷: submit-banner--ok + Table Editor applications 1행]

✅ OK면 **MVP 핵심(신청→DB) 완성**.

---

## 11-7. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| `function next_yyc_receipt_no does not exist` | 11-3 (1) 미실행 | `next_yyc_receipt_no.sql` Run |
| `function submit_application does not exist` | 11-3 (2) 미실행 | `submit_application.sql` Run |
| `column "selected_options" does not exist` | 예전 테이블 스키마 | 11-2 마이그레이션 또는 새 테이블 |
| `Invalid API key` | `.env.local` / GitHub Secrets | URL·anon key 재입력, dev 재시작 |
| 접수번호 예전 형식 `YYC-2026-0001` | 옛 RPC | `next_yyc_receipt_no.sql` 다시 Run |
| `null value in column "resident_id_first6"` | 옛 테이블 + 새 앱 | 11-2 스키마로 맞추기 |
| 제출은 됐는데 합계가 0 | `selected_options` 비어 있음 | 정상(미선택형). price 숫자인지 확인 |

---

## 11-8. 11장 완료 체크리스트

- [ ] `applications` 테이블이 **지금 payload** 칼럼과 같다
- [ ] `next_yyc_receipt_no.sql` · `submit_application.sql` 실행 완료
- [ ] 테스트 신청 1건 → Table Editor에 1줄
- [ ] 접수번호 `YYC-YYYYMMDD001` 형식
- [ ] 신청 후 초록 배너 + 계약서 미리보기
- [ ] **새로 작성** 으로 `step 0` 복귀 가능

---

## 11-9. 보안 메모

- `applications` 는 **RLS ON + anon 직접 SELECT 금지** (13·17장에서 관리자만 조회).  
- 신청자는 **RPC 2개**(`next_yyc_receipt_no`, `submit_application`)만 호출.  
- 서명·개인정보는 DB에 들어가므로 Console `console.log(payload)` 남기지 않기.

---

📌 **다음 장 미리보기**  
12장: 위 INSERT 가 일어날 때 Webhook → `append-workbook-row` 가 Storage 피벗 엑셀(`selected_options` 열 펼침)에 **한 줄 추가**.

---

<div class='page-break'></div>

# 12장. 신청 들어올 때마다 엑셀에 자동 누적

> **이 장에서 완성하는 것**  
> 11장에서 `applications` 에 **INSERT** 될 때마다 → Storage 의 `yyc-contract-live_V1.xlsx` **피벗 시트** 마지막에 한 줄 추가.  
> 관리자는 항상 "지금까지 모든 신청" 이 들어찬 엑셀 1개를 받게 됩니다.  
>
> **선행**: 11장 (`submit_application` RPC + 테이블 스키마) 완료  
> **소요 시간**: 약 2.5시간  
> **난이도**: ★★★★ (Edge Function 첫 등장)

---

## 12-1. 미리 알아두기

| 용어 | 1줄 비유 |
|------|---------|
| **Storage 버킷** | Supabase 안의 클라우드 폴더 |
| **Edge Function** | DB 옆 작은 알바 — `append-workbook-row` |
| **Database Webhook** | `applications` 에 행이 생기면 알바에게 POST |
| **피벗 시트** | 옵션 종류마다 **열**이 나뉜 엑셀 (한 신청 = 한 행) |
| **`selected_options`** | 11장 JSON 배열 — 함수가 열 금액으로 펼침 |
| **WORKBOOK_WEBHOOK_SECRET** | Webhook ↔ 함수 사이 출입 비밀번호 |

전체 흐름 (11장과 이어짐):

```
[사용자 step 2 「신청완료」]
  → next_yyc_receipt_no
  → submit_application({ payload })
  → applications INSERT
       → Database Webhook (Insert)
            → POST …/functions/v1/append-workbook-row
                 → Storage xlsx 다운로드
                 → selected_options 를 피벗 열에 합산
                 → 마지막 데이터 행 다음에 1줄 추가 → 다시 업로드
```

Webhook 이 보내는 `record` 는 **DB에 저장된 한 행** 과 같습니다.  
예전 교재 필드(`options`, `total_amount`, `resident_id_first6` …)는 **쓰지 않습니다.**

| DB / Webhook `record` | 엑셀에 쓰이는 곳 |
|----------------------|------------------|
| `receipt_no` | 접수번호 |
| `unit_type` | 타입 |
| `dong`, `ho` | 동, 호수 |
| `customer_name` | 계약자 |
| `phone` (뒷 4자리) | 휴대폰 번호 4자리 |
| `selected_options` | 시트판넬 ~ 스마트복합환풍기 열 (금액) |
| `total_price` | 총액 |

---

## 12-2. Storage 버킷·템플릿 준비

### (1) Supabase **Storage** → **New bucket**

| 항목 | 값 |
|------|-----|
| Name | `application-workbook` |
| Public bucket | ⛔ **OFF** |

### (2) 피벗 템플릿 엑셀

시트 이름은 아래 **둘 중 하나** (코드가 순서대로 찾음):

- `옵션 신청 현황` (권장)
- `Sheet1 (2)`

**1행 헤더**는 `supabase/functions/append-workbook-row/index.ts` 의 `HEADERS` 와 **글자 하나까지** 같아야 합니다.

| 열 | 헤더 (1행) |
|----|------------|
| A~H | 순번, 접수번호, 용도, 타입, 동, 호수, 계약자, 휴대폰 번호 4자리 |
| I~Z | 시트판넬, 거실 마감재 특화, 욕실 마감재 특화, 주방 마감 및 가구 특화, 드레스룸 특화, 붙박이장(침실1~3), 인덕션(3구), 빌트인오븐, 식기세척기, 냉장고패키지, 시스템에어컨, 비데일체형 양변기(욕실1~2), 비데(욕실1~2), 스마트복합환풩기 |
| AA | 총액 |

- **2행 이후는 비움** (샘플 데이터 넣지 않기 — 15장 초기화 시 헷갈림).
- 파일명: **`yyc-contract-live_V1.xlsx`**

> 💡 가장 빠른 방법: 운영에서 쓰는 피벗 엑셀을 복사해 **데이터만 지우고** 1행 헤더만 남긴 뒤 업로드.

### (3) 버킷에 업로드

Storage → `application-workbook` → **Upload** → `yyc-contract-live_V1.xlsx`

---

## 12-3. Edge Function (레포에 이미 있음)

Cursor에서 확인:

```
supabase/functions/append-workbook-row/index.ts
supabase/config.toml
```

**새 프로젝트를 1장부터 만든 경우**에도, 이 레포를 clone 했다면 **파일을 새로 짤 필요 없습니다.**  
내용만 아래와 맞는지 눈으로 확인하세요.

- `Deno.serve` + `x-workbook-secret` 검증
- `body.record` (Webhook INSERT 본문) 읽기
- `selected_options` → `option_id` / `category` / `label` 로 피벗 열 인덱스 계산
- 시트 `옵션 신청 현황` 또는 `Sheet1 (2)`
- 용도 열 고정값: **`도시형생활주택`**

`supabase/config.toml` (JWT 끔 — Webhook 용):

```toml
[functions.append-workbook-row]
verify_jwt = false
```

> 부록 **B-1** 에도 요약이 있습니다. 전체 소스는 위 `index.ts` 가 정본입니다.

---

## 12-4. Supabase CLI + 시크릿 + 배포

### (1) CLI (한 번만)

```bash
npm install -g supabase
supabase --version
```

### (2) 로그인·연결

```bash
supabase login
supabase link --project-ref abcd1234
```

(`abcd1234` = 대시보드 URL `https://abcd1234.supabase.co` 의 Ref)

### (3) 시크릿

12-5 Webhook 헤더와 **같은** 비밀번호를 메모해 두세요.

```bash
supabase secrets set WORKBOOK_WEBHOOK_SECRET="원하는비밀번호16자이상"
supabase secrets set WORKBOOK_BUCKET="application-workbook"
supabase secrets set WORKBOOK_OBJECT_KEY="yyc-contract-live_V1.xlsx"
```

Storage 에 아직 xlsx 가 없으면 (15장 초기화용):

```bash
supabase secrets set TEMPLATE_PUBLIC_URL="https://내아이디.github.io/yyc-options/templates/피벗템플릿.xlsx"
```

### (4) 배포

```bash
cd /경로/yyc-options
supabase functions deploy append-workbook-row --no-verify-jwt
```

✅ `Deployed Function`  
⚠️ `not in a project directory` → `cd` 로 프로젝트 루트 이동 후 재실행.

---

## 12-5. Database Webhook

**Database → Webhooks → Create a new hook**

| 항목 | 값 |
|------|-----|
| Name | `applications-insert-to-workbook` |
| Table | `applications` |
| Events | ✅ **Insert** 만 |
| Type | HTTP Request |
| Method | POST |
| URL | `https://abcd1234.supabase.co/functions/v1/append-workbook-row` |
| HTTP Headers | `x-workbook-secret` = 12-4 에서 정한 비밀번호 |

Supabase 가 보내는 JSON 예시 (일부):

```json
{
  "type": "INSERT",
  "table": "applications",
  "record": {
    "receipt_no": "YYC-20260516001",
    "customer_name": "홍길동",
    "phone": "5678",
    "dong": "101",
    "ho": "1201",
    "unit_type": "55A",
    "selected_options": [
      { "option_id": "a_ind", "category": "주방", "label": "인덕션", "price": 500000 }
    ],
    "total_price": 500000,
    "status": "접수됨"
  }
}
```

함수는 `record.selected_options` 와 `record.total_price` 만 사용합니다.  
`signature_data_url` 은 엑셀에 넣지 않습니다 (DB·관리자 화면용).

---

## 12-6. 끝부터 끝까지 시험

1. 앱에서 **11장과 동일하게** 신청 1건 제출 (`step 2` 신청완료).  
2. Supabase **Table Editor** → `applications` 최신 행 확인.  
3. **Storage** → `application-workbook` → `yyc-contract-live_V1.xlsx` **Updated** 시간이 방금인지.  
4. xlsx 다운로드 → 마지막 행에 접수번호·동·호·옵션 열 금액·총액이 맞는지.  
5. **Edge Functions → append-workbook-row → Logs** 에 `200` + `{"ok":true,...}`.

✅ 되면 14장(관리자 다운로드)에서 같은 파일을 **서명 URL** 로 받게 합니다.

---

## 12-7. 자주 나는 에러

| 화면 / 로그 | 원인 | 해결 |
|-------------|------|------|
| 401 `unauthorized` | secret 불일치 | `secrets set` + Webhook 헤더 동일 값 |
| 400 `missing record` | Webhook 본문 없음 / 테이블 잘못 | Insert + `applications` 인지 |
| 422 `header mismatch on pivot sheet` | 1행 헤더 ≠ 코드 `HEADERS` | 12-2 표대로 1행 수정 후 재업로드 |
| 422 `pivot sheet missing` | 시트 이름 다름 | `옵션 신청 현황` 또는 `Sheet1 (2)` |
| 422 `workbook missing…` | 버킷에 파일 없음 | xlsx 업로드 또는 `TEMPLATE_PUBLIC_URL` |
| 500 storage upload | 버킷명·권한 | `application-workbook`, service_role |
| Webhook OK인데 열 비어 있음 | `selected_options` 빈 배열 | 앱에서 옵션 선택 후 재신청 |
| 옵션 열은 있는데 총액만 0 | `total_price` 미저장 | 11장 `submit_application.sql` 재실행 |

---

## 12-8. 완료 체크리스트

- [ ] 11장: `submit_application` INSERT 가 Table Editor 에 보인다
- [ ] `application-workbook` 비공개 버킷 + 피벗 헤더만 있는 xlsx
- [ ] `append-workbook-row` 배포 + `verify_jwt = false`
- [ ] Webhook 1개 (Insert + URL + `x-workbook-secret`)
- [ ] 신청 1건 → xlsx 마지막 행 + Functions Logs 200

---

## 12-9. 보안 메모

- 버킷은 **비공개**. URL 만으로는 다운로드 불가 → 14장 **sign-application-workbook**.  
- Webhook ↔ 함수는 `WORKBOOK_WEBHOOK_SECRET` 만 신뢰.  
- 함수 내부의 **service_role** 은 Supabase secrets 에만 두고, GitHub Pages·프런트에 넣지 않습니다.

---

> 💪 **10·11·12 묶음**  
> 신청 한 번 → DB 저장 → **피벗 엑셀 자동 누적** 까지 한 바퀴가 돕니다.  
> 다음: **13장** `#/admin` 관리자 목록 → **14장** 누적 xlsx 다운로드.

---

<div class='page-break'></div>

# 13장. 관리자 로그인 + 신청 목록 화면

> **이 장에서 완성하는 것**  
> `#/admin` (또는 `/admin`) 주소 → 관리자 로그인 → **접수 목록 표** + 검색·필터.  
> 행을 클릭하면 14장 **우측 상세 패널**이 열립니다.  
>
> **선행**: 11장 DB 저장, (권장) 17장 RLS — 관리자만 `applications` SELECT  
> **소요 시간**: 약 1.5시간 (레포에 UI 있음 → 배포·SQL 위주)  
> **난이도**: ★★★

---

## 13-1. 미리 알아두기

| 용어 | 설명 |
|------|------|
| **관리자 URL** | `http://localhost:5173/#/admin` 또는 Pages `…/yyc-options/#/admin` |
| **세션** | 로그인 후 `localStorage` 키 `yyc_admin_session` (access_token) |
| **목록 조회** | `GET /rest/v1/applications?select=*` (관리자 JWT) |
| **`app_admins` + `is_admin()`** | 17장 RLS — 관리자 이메일만 표 조회 허용 |

흐름:

```
[#/admin 접속]
  → 이메일·비번 (Supabase Auth)
  → access_token 저장
  → applications 전체 조회 (RLS 통과 시)
  → 표: 접수번호·일시·동/호·타입·총액·휴대폰 뒷자리·고객명·상태
```

> 예전 교재의 `?admin=1`, `list_applications` RPC 는 **현재 앱과 다릅니다.**  
> 코드 정본: `src/App.jsx` 의 `renderAdminDashboardIfNeeded`, `adminFetchApplications`.

---

## 13-2. Supabase 관리자 계정

### (1) **Authentication → Users → Add user**

| 항목 | 값 |
|------|-----|
| Email | `admin@admin.com` (운영용은 실제 메일) |
| Password | 16자 이상, 메모장 보관 |
| Auto Confirm User | ✅ |

### (2) 일반 가입 차단

**Authentication → Providers → Email**  
- **Enable Email Signups**: ⛔ OFF → Save

---

## 13-3. SQL (관리자·초기화·선택 칼럼)

SQL Editor에서 **아래 순서**로 실행합니다.

### (1) 관리자 화이트리스트 + `is_admin()` (17장 RLS용)

```sql
CREATE TABLE IF NOT EXISTS public.app_admins (
  email text PRIMARY KEY
);
INSERT INTO public.app_admins(email) VALUES ('admin@admin.com')
ON CONFLICT DO NOTHING;
ALTER TABLE public.app_admins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.app_admins FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.app_admins a
    WHERE a.email = lower(coalesce(auth.jwt()->>'email',''))
  );
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
```

`app_admins` 에 **로그인에 쓰는 이메일**이 있어야 17장 이후 목록이 보입니다.

### (2) 관리자 메모·상태 저장 (선택)

상세 패널에서 **상태/메모 저장**이 400 이면 칼럼 추가:

```sql
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS admin_memo text;
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
```

### (3) 초기화 RPC (15장)

레포 파일 **통째로** Run:

- `supabase/sql/admin_clear_all_applications.sql`  
  (`admin_clear_all_applications`, `admin_reset_yyc_receipt_counter`)

### (4) RPC 없을 때 삭제 폴백 (선택)

`admin_clear_all_applications` 미설치 환경용:

- `supabase/sql/applications_delete_policy.sql`

---

## 13-4. 앱에서 확인 (이미 구현됨)

레포를 clone 한 경우 **13-4 AI 지시는 생략**하고 동작만 확인합니다.

| 확인 | 방법 |
|------|------|
| 관리자 진입 | `npm run dev` → `http://localhost:5173/#/admin` |
| 로그인 | 13-2 계정 |
| 목록 | 11장에서 넣은 신청이 표에 보임 |
| 필터 | 검색·동·타입·상태 |
| 행 클릭 | 우측에 「접수 상세」(14장) |
| 일반 화면 | `#/admin` 없이 `/` → 신청 step 0 |

표 칼럼(현재 앱):

| 칼럼 | DB 필드 |
|------|---------|
| 접수번호 | `receipt_no` |
| 접수일시 | `created_at` |
| 동/호 | `dong`, `ho` |
| 타입 | `unit_type` |
| 총액 | `total_price` |
| 휴대폰 뒷자리 | `phone` |
| 고객명 | `customer_name` |
| 상태 | `status` (접수됨·확인중·계약완료·취소) |

---

## 13-5. GitHub Pages

push 후:

`https://내아이디.github.io/yyc-options/#/admin`

---

## 13-6. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| 로그인 실패 | Auth 계정·비번 | Users 에 계정·Auto Confirm |
| 목록 0건 / permission denied | RLS·화이트리스트 | 17장 정책 + `app_admins` 에 이메일 |
| `#/admin` 인데 신청 화면 | hash 없음 | 주소에 `#/admin` 포함 |
| 새로고침 시 로그아웃 | 토큰 만료 | 다시 로그인 |
| `?admin=1` 로 안 열림 | 구버전 교재 | **`#/admin`** 사용 |

---

## 13-7. 완료 체크리스트

- [ ] 관리자 Auth 계정 1개, 일반 가입 OFF
- [ ] `app_admins` + `is_admin()` 적용
- [ ] `#/admin` 로그인 → 목록 표
- [ ] 행 클릭 시 우측 상세 영역 표시
- [ ] (17장 후) anon 으로는 목록 조회 불가

---

## 13-8. 보안 메모

- 신청자는 `submit_application` RPC 만 — `applications` 직접 SELECT 불가(17장).  
- 관리자 목록은 **JWT + RLS** 로만. URL `#/admin` 은 “비밀 주소”일 뿐, 비번 없이는 못 들어감.

---

📌 **다음 장**  
14장: 행 선택 시 **상세·서명·엑셀 다운로드**(Storage 누적본).

---

<div class='page-break'></div>

# 14장. 관리자 — 신청 상세 + 엑셀 다운로드

> **이 장에서 완성하는 것**  
> 13장 목록에서 **행 클릭** → 우측 **접수 상세**(옵션·서명·상태·메모).  
> **「엑셀(.xlsx) 내려받기」** → 12장 Storage 누적 파일(`yyc-contract-live_V1.xlsx`)을 **서명 URL** 로 받기.  
>
> **선행**: 12장 Webhook·`append-workbook-row`, 13장 로그인  
> **소요 시간**: 약 1.5시간  
> **난이도**: ★★★★

---

## 14-1. 미리 알아두기

| 용어 | 설명 |
|------|------|
| **상세 패널** | 표 오른쪽 `admin-detail` — 모달이 아님 |
| **`selected_options`** | jsonb — 카테고리·라벨·가격 목록 표시 |
| **`sign-application-workbook`** | 관리자 JWT 확인 후 Storage **60초** 서명 URL |
| **누적 엑셀** | 12장 피벗 시트 — 신청마다 Webhook 이 한 줄 추가 |

> 예전 교재: `get_application` RPC, 주민번호 마스킹, `data.url` 응답 → **현재 앱과 다름.**  
> 상세는 **목록에서 이미 받은 행**을 쓰고, 다운로드 응답 필드는 **`signedUrl`**.

---

## 14-2. Edge Function 배포

레포: `supabase/functions/sign-application-workbook/index.ts`  
`supabase/config.toml` 에 `verify_jwt = false` (함수 안에서 JWT 검사).

```bash
cd /경로/yyc-options
supabase secrets set WORKBOOK_RESET_ALLOWED_EMAILS="admin@admin.com"
supabase secrets set WORKBOOK_BUCKET="application-workbook"
supabase secrets set WORKBOOK_OBJECT_KEY="yyc-contract-live_V1.xlsx"
supabase functions deploy sign-application-workbook --no-verify-jwt
```

- `WORKBOOK_RESET_ALLOWED_EMAILS` 가 **비어 있으면** 로그인만 되면 누구나 URL 발급 가능 → 운영에서는 **반드시 이메일 지정**.  
- 여러 명: `a@x.com,b@y.com` 쉼표 구분.

---

## 14-3. 상세 패널에서 보이는 항목

| 항목 | 출처 |
|------|------|
| 접수번호·일시 | `receipt_no`, `created_at` |
| 고객명·휴대폰 뒷자리 | `customer_name`, `phone` (4자리) |
| 동/호·타입 | `dong`, `ho`, `unit_type` |
| 옵션 목록 | `selected_options[]` → category / label / price |
| 옵션금액소계·총액·금액일치 | 앱이 `selected_options` 합 vs `total_price` 비교 |
| 서명 | `signature_data_url` → `safeSignatureSrc` 로만 `<img>` |
| 처리 상태 | `status` select → 저장 시 PATCH |
| 관리자 메모 | `admin_memo` (13-3 (2) 칼럼 필요) |

주민번호·이메일·주소 필드는 **현재 스키마에 없음** (11장 payload 기준).

---

## 14-4. 엑셀 다운로드 동작

버튼: 목록 상단 **「엑셀(.xlsx) 내려받기」**

1. `sign-application-workbook` 호출 (`body: { expiresIn: 60 }`)  
2. 응답 `{ "signedUrl": "…", "expiresIn": 60 }`  
3. `signedUrl` 로 fetch → 브라우저 저장 (`YYC-관리자-YYYYMMDD.xlsx` 형식)

이 파일은 **12장 자동 누적본**입니다. 필터된 목록만 받는 기능이 아닙니다.

### 실패 시

- alert 에 Storage·함수 배포 안내.  
- 개발용: 빌드에 `VITE_ADMIN_XLS_TEMPLATE_ONLY=1` 이면 `public/templates/yyc-contract-pivot-template.xlsx` 로 **DB 행을 시트에 병합**하는 경로 (운영 기본 아님).

---

## 14-5. 시험

`#/admin` → 로그인.

| 시험 | 기대 |
|------|------|
| 행 클릭 | 우측 상세·옵션 목록·서명 |
| 상태 변경 + 저장 | 표에 상태 반영 (PATCH 성공) |
| 엑셀 내려받기 | 피벗 xlsx 저장, 12장 신청 행 포함 |
| 60초 후 같은 URL | 만료 → 버튼 다시 |
| 로그아웃 후 다운로드 | 로그인 요구 |

---

## 14-6. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| Storage 누적 워크북 실패 | 함수 미배포·버킷·secret | 14-2 재배포, 12장 파일명 |
| 403 forbidden | 화이트리스트 | `WORKBOOK_RESET_ALLOWED_EMAILS` 에 본인 이메일 |
| 401 | 토큰 만료 | 재로그인 |
| signedUrl 비어 있음 | 구버전 함수 | 레포 `index.ts` 로 재배포 |
| 메모/상태 저장 실패 | 칼럼 없음 | 13-3 (2) `admin_memo`, `updated_at` |
| 엑셀 헤더 422 (12장) | 템플릿 불일치 | 12-2 피벗 헤더와 동일하게 |

---

## 14-7. 완료 체크리스트

- [ ] `sign-application-workbook` 배포 + 시크릿 3종
- [ ] 상세: `selected_options` + 서명 이미지
- [ ] 엑셀: Storage 누적본 다운로드 OK
- [ ] (선택) 상태·메모 저장 OK

---

## 14-8. 보안 메모

- 버킷 비공개 + **짧은 서명 URL**.  
- 함수: `auth.getUser(jwt)` + (선택) 이메일 화이트리스트.  
- 서명 src 는 data URL 화이트리스트만 렌더 (XSS 완화, 17장).

---

📌 **다음 장**  
15장: **초기화** — DB·접수번호·Storage 피벗 엑셀 한 번에.

---

<div class='page-break'></div>

# 15장. 관리자 — 시즌 종료용 "초기화"

> **이 장에서 완성하는 것**  
> 관리자 화면 **「초기화」** 한 번으로:  
> 1) `applications` 전부 삭제  
> 2) `yyc_receipt_counter` 비움 → 다음 접수번호 **001**부터  
> 3) Storage 누적 xlsx → **피벗 템플릿**으로 덮어쓰기  
>
> **선행**: 13·14장, `admin_clear_all_applications.sql`, `reset-application-workbook` 배포  
> **소요 시간**: 약 1시간  
> **난이도**: ★★★★

---

## 15-1. 미리 알아두기

| 단계 | 담당 |
|------|------|
| DB 비우기 | RPC `admin_clear_all_applications` (없으면 배치 DELETE) |
| 접수번호 | RPC `admin_reset_yyc_receipt_counter` (위 RPC에 포함돼도 재호출 OK) |
| 엑셀 | Edge `reset-application-workbook` + `TEMPLATE_PUBLIC_URL` |

앱 (`App.jsx`): 확인창 **1번** → 위 순서 실행. (예전 교재의 `RESET` 입력 2단계는 **현재 UI에 없음**.)

---

## 15-2. SQL — 레포 파일 실행

SQL Editor:

```text
supabase/sql/admin_clear_all_applications.sql   ← 전체 Run
```

포함 내용:

- `admin_clear_all_applications()` → `applications` TRUNCATE + `yyc_receipt_counter` TRUNCATE, 삭제 건수 `bigint` 반환  
- `admin_reset_yyc_receipt_counter()` → 카운터만 TRUNCATE  

> 예전 교재의 `is_admin()` 검사·`yyc_receipt_counter(id, current_no)` INSERT 는 **현재 SQL과 다름.**  
> 카운터 테이블 구조는 `next_yyc_receipt_no.sql` (year/seq) 기준.

RPC 미설치 시: `applications_delete_policy.sql` 후 앱이 **id 배치 DELETE** 폴백.

---

## 15-3. `reset-application-workbook` 배포

레포: `supabase/functions/reset-application-workbook/index.ts`

### 템플릿 URL (12장 피벗과 동일 헤더)

1. 12-2 와 같은 **헤더만 있는** `yyc-contract-pivot-template.xlsx`  
2. `public/templates/` 에 넣고 push  
3. Pages URL 예:

`https://내아이디.github.io/yyc-options/templates/yyc-contract-pivot-template.xlsx`  
(16장 push 후 `public/templates/` 에 파일이 있어야 404 가 나지 않음)

```bash
supabase secrets set TEMPLATE_PUBLIC_URL="https://내아이디.github.io/yyc-options/templates/yyc-contract-pivot-template.xlsx"
supabase secrets set WORKBOOK_RESET_ALLOWED_EMAILS="admin@admin.com"
supabase functions deploy reset-application-workbook --no-verify-jwt
```

12장 `append-workbook-row` 와 **같은 `TEMPLATE_PUBLIC_URL`** 을 쓰면 관리가 쉽습니다.

---

## 15-4. 앱에서 시험

`#/admin` → 로그인 → (선택) 신청 1~2건 → **초기화**

| 단계 | 기대 |
|------|------|
| confirm | DB·접수번호·Storage 안내 문구 |
| 진행 | 버튼 「삭제 중…」→ 「접수번호 초기화…」→ 「엑셀 초기화…」 |
| 완료 | 「접수 기록이 없습니다.」 |
| 일반 화면 신청 | 접수번호 `YYC-YYYYMMDD001` 형식 (11장) |
| 엑셀 다운로드 | 헤더만 → 새 신청 1줄 |

DB만 비우고 엑셀 실패 시 alert 로 Storage 오류 안내 (DB는 이미 비운 상태).

---

## 15-5. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| 삭제 후에도 N건 남음 | RPC 없음·RLS | `admin_clear_all_applications.sql` Run |
| `TEMPLATE_PUBLIC_URL unset` | secret 누락 | 15-3 secrets |
| template fetch failed | 404 | 브라우저로 템플릿 URL 직접 열기 |
| 엑셀에 옛 샘플 155행 | 템플릿에 데이터 포함 | 헤더 1행만 남기고 재업로드 |
| 403 on reset | 화이트리스트 | `WORKBOOK_RESET_ALLOWED_EMAILS` |
| duplicate 동·호 | UNIQUE (있을 때) | 다른 동·호로 테스트 |

---

## 15-6. 완료 체크리스트

- [ ] `admin_clear_all_applications.sql` 적용
- [ ] `reset-application-workbook` + `TEMPLATE_PUBLIC_URL`
- [ ] 초기화 → 목록 0건
- [ ] 새 신청 → `YYC-YYYYMMDD001` …
- [ ] Storage xlsx → 헤더만 후 Webhook 으로 1행 추가

---

## 15-7. 보안 메모

- 초기화 RPC 는 `authenticated` 에 GRANT — **17장 RLS** 로 관리자만 DELETE/SELECT 되게 잠그세요.  
- 엑셀 리셋: JWT + (선택) 이메일 화이트리스트.  
- confirm 1회 — 운영 전 스테이징에서 반드시 한 번 시험.

---

> 💪 **13·14·15**  
> 관리자 **목록 → 상세 → 누적 엑셀 받기 → 시즌 초기화** 운영 세트 완성.

---

<div class='page-break'></div>

# 16장. GitHub Actions로 자동 배포 (Push만 하면 끝)

> **이 장에서 완성하는 것**  
> `main` 에 `git push` → **자동 빌드 → GitHub Pages 갱신**.  
> Supabase URL·anon 키는 **GitHub Secrets** 로 주입 (본인 프로젝트용).  
>
> **선행**: 3장 Pages **Source = GitHub Actions**, 2장 push 가능 상태  
> **소요 시간**: 약 1시간 (워크플로는 레포에 이미 있음)  
> **난이도**: ★★★

---

## 16-1. 미리 알아두기

| 용어 | 설명 |
|------|------|
| **GitHub Actions** | push 시 Ubuntu에서 `npm ci` → `npm run build` → Pages 배포 |
| **`pages.yml`** | `.github/workflows/pages.yml` — 정본 |
| **Secret** | `VITE_SUPABASE_*` — 빌드 시에만 주입, 로그에는 마스킹 |
| **`VITE_BASE`** | `/저장소이름/` — CI가 **레포 이름**으로 자동 설정 |

3장에서 워크플로를 처음 만들었다면, 16장은 **Secrets 등록 + 본인 Supabase 연결 + 배포 확인**에 집중합니다.

---

## 16-2. Pages Source 확인

**Settings → Pages → Build and deployment**

| 항목 | 값 |
|------|-----|
| Source | **GitHub Actions** (Deploy from a branch 아님) |

---

## 16-3. GitHub Secrets 등록

**Settings → Secrets and variables → Actions → New repository secret**

| Name | Value |
|------|--------|
| `VITE_SUPABASE_URL` | `https://abcd1234.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → **anon public** |

로컬 `.env.local` 과 **이름을 똑같이** 맞춥니다 (`.env.example` 참고).

> ⚠️ **넣지 말 것**: `service_role`, DB 비밀번호, `WORKBOOK_WEBHOOK_SECRET`, `VITE_WORKBOOK_APPEND_SECRET`  
> Webhook·Edge 비밀은 **Supabase secrets** 만.  
> `VITE_*` 는 빌드 후 브라우저에 노출되므로 **anon 키만**.

Secret 을 안 넣으면 앱이 코드 **기본 Supabase** 로 동작할 수 있습니다. 운영·교육용은 **반드시 본인 프로젝트 Secret** 을 넣으세요.

---

## 16-4. 워크플로 (레포에 이미 있음)

경로: **`.github/workflows/pages.yml`**

요약 (3장과 다른 점):

| 항목 | 현재 레포 |
|------|-----------|
| 트리거 | `push` → `main`, `workflow_dispatch` |
| Node | **22** |
| Job | **`deploy` 1개** (build·deploy 분리 아님) |
| `VITE_BASE` | `/${{ github.event.repository.name }}/` → 레포명이 `yyc-options` 면 `/yyc-options/` |
| Supabase | `npm run build` 의 `env` 에 Secret 2개 |
| 배포 | `configure-pages` → `upload-pages-artifact` → `deploy-pages` |

`vite.config.js` 는 `process.env.VITE_BASE` 를 `base` 로 사용합니다.

`public/.nojekyll` 이 있으면 `dist` 에 복사되어 Jekyll 무시에 도움이 됩니다.

### (선택) 15장 템플릿 xlsx 를 Pages 로 서빙

`public/templates/yyc-contract-pivot-template.xlsx` 를 commit 하면:

`https://내아이디.github.io/yyc-options/templates/yyc-contract-pivot-template.xlsx`

→ Supabase `TEMPLATE_PUBLIC_URL` · 15장 초기화에 사용 (12장 피벗 헤더와 동일).

---

## 16-5. push 후 확인

```bash
cd /경로/yyc-options
git add .
git commit -m "배포 확인"
git push origin main
```

1. GitHub → **Actions** → **Deploy GitHub Pages** → ✅  
2. 주소: `https://내아이디.github.io/저장소이름/`  
3. **신청 화면** (`/`) 동작  
4. **관리자** `https://…/저장소이름/#/admin` (13장)

Secret 을 바꾼 뒤에는 Actions에서 **Re-run all jobs** 한 번.

---

## 16-6. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| `npm ci` 실패 | lock 없음 | 로컬 `npm install` 후 `package-lock.json` commit |
| 흰 화면 | `base` 불일치 | Actions 로그의 `VITE_BASE` 와 주소 경로 (`/레포이름/`) |
| 404 on `assets/…` | base·캐시 | hard refresh; `public/.nojekyll` 확인 |
| Get Pages site failed | Source가 Branch | 16-2 GitHub Actions |
| 빌드 OK인데 다른 DB | Secret 미등록 | 16-3 Secret 2개 + Re-run |
| Secret 있는데 연결 실패 | URL·키 오타 | Supabase API 화면과 1:1 복사 |
| `?admin=1` 안 됨 | 구버전 | **`#/admin`** (13장) |

---

## 16-7. 완료 체크리스트

- [ ] Pages Source = **GitHub Actions**
- [ ] Secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- [ ] `.github/workflows/pages.yml` 이 main 에 있음
- [ ] Actions **Deploy GitHub Pages** ✅
- [ ] Pages URL에서 신청·`#/admin` 확인
- [ ] Actions 로그에 키 **값**이 그대로 찍히지 않음

---

## 16-8. 보안 메모

- `console.log(import.meta.env)` 금지.  
- `VITE_APPEND_WORKBOOK_ON_SUBMIT` + secret 은 GitHub에 넣지 말 것 (번들 노출). 12장은 **Database Webhook** 권장.  
- Edge·DB 비밀은 Supabase secrets.

---

📌 **다음 장**  
17장: RLS·XSS 최종 잠금 (`#/admin` + `applications` REST).

---

<div class='page-break'></div>

# 17장. 보안 최종 잠금 (RLS · 권한 · XSS)

> **이 장에서 완성하는 것**  
> 1) 일반인(anon)은 `applications`·등록부 **직접 SELECT/쓰기 불가** — RPC만  
> 2) 관리자(`#/admin` + `app_admins`)만 접수 목록·수정  
> 3) 관리자 화면 사용자 입력 **escape + 서명 URL 화이트리스트**  
> 4) 민감 로그·시크릿 노출 점검  
>
> **선행**: 13장 `app_admins` / `is_admin()`, 11장 RPC, 16장 배포  
> **소요 시간**: 약 1.5시간  
> **난이도**: ★★★★

---

## 17-1. 미리 알아두기

| 구분 | 일반 신청 화면 | 관리자 `#/admin` |
|------|----------------|------------------|
| DB 읽기 | ❌ REST `applications` 직접 | ✅ JWT + `is_admin()` RLS |
| DB 쓰기 | ✅ `verify_yyc_resident`, `next_yyc_receipt_no`, `submit_application` RPC | ✅ PATCH·초기화 RPC |
| Storage 엑셀 | ❌ | ✅ `sign-application-workbook` (14장) |

| 용어 | 설명 |
|------|------|
| **RLS** | 행 단위로 “누가 이 줄을 볼 수 있나” |
| **SECURITY DEFINER RPC** | RLS를 우회해 허용된 동작만 수행 (`submit_application` 등) |
| **XSS** | 입력에 `<script>` 등이 들어와 실행되는 사고 |
| **`escapeHtml`** | 관리자 UI `innerHTML` 조립 시 사용자 값 이스케이프 |

---

## 17-2. SQL — 레포 파일 한 번에 실행

**선행**: 13-3 `app_admins` + `is_admin()` 이 이미 있어야 합니다.

SQL Editor → **`supabase/sql/applications_rls_lockdown.sql`** 전체 **Run**.

하는 일 요약:

- `applications`, `yyc_resident_registry`, `app_admins` 에 **RLS ON** + anon/authenticated **REVOKE**  
- 관리자만 `applications` SELECT·UPDATE·DELETE (`is_admin()`)  
- 신청 INSERT 는 **정책 없음** → `submit_application` RPC 만  
- 느슨한 `"authenticated can delete applications"` 정책 있으면 **제거**  
- RPC `GRANT`: `verify_yyc_resident`, `submit_application`, `next_yyc_receipt_no`, `is_admin`, `admin_clear_*`

> 예전 교재의 `list_applications` / `get_application` RPC 는 **현재 앱이 쓰지 않습니다.**

부록 **A-5** 도 같은 내용입니다.

---

## 17-3. 잠겼는지 시험

### (1) anon — 일반 신청 화면 F12

`#/admin` **없이** 메인 화면 → Console (본인 Supabase URL·anon 키로):

```js
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const res = await fetch(`${url}/rest/v1/applications?select=id&limit=1`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` }
});
console.log(res.status, await res.json());
```

✅ **기대**: `401` / `403` / 빈 배열·RLS 오류 — 신청 데이터가 **보이면 안 됨**.

### (2) 관리자

`#/admin` 로그인 → 접수 목록 표 표시.  
Network → `applications?select=*` **200**.

### (3) 신청 한 바퀴

`step 0` 검증 → 옵션 선택 → `step 2` 신청완료 → 관리자 목록에 1건.

셋 다 OK면 RLS 통과.

---

## 17-4. XSS — 앱에 이미 적용됨 (확인만)

정본: `src/App.jsx`

| 항목 | 구현 |
|------|------|
| 관리자 표·상세 | `escapeHtml` / `escapeHtmlAttr` 로 `innerHTML` 조립 |
| 서명 이미지 | `safeSignatureSrc` — `data:image/(png\|jpeg\|…);base64,…` 만 |
| 신청 React UI | JSX `{값}` 출력 (기본 이스케이프) |
| 에러 | 사용자에게 Supabase 원문 대신 짧은 한국어 안내 |

**새로 AI에게 짤 필요 없습니다.** 관리자 화면에 필드를 추가할 때만 `escapeHtml(사용자입력)` 규칙을 지키면 됩니다.

남은 주의:

- `admin-detail-msg` 등에 `err.message` 를 **escape 없이** 넣지 않기  
- `console.log(payload)`, `console.log(signature)` 금지 — `console.error` 는 개발자용으로만

---

## 17-5. XSS 시험

1. 일반 화면에서 계약자명에  
   `<img src=x onerror="alert(1)">` 입력 후 신청  
2. `#/admin` → 해당 행 상세

✅ **alert 없음**, 화면에 **글자 그대로** 보이면 OK.

---

## 17-6. (선택) Content-Security-Policy

`index.html` 에 CSP 를 넣으면 보안은 강해지지만, **Pretendard CDN**·Vite HMR 과 충돌할 수 있습니다.

넣을 경우 최소 예 (Supabase + CDN):

```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self';
           connect-src 'self' https://*.supabase.co;
           img-src 'self' data: https:;
           script-src 'self';
           style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
           font-src 'self' https://cdn.jsdelivr.net;
           base-uri 'self'; frame-ancestors 'none';" />
```

화면이 깨지면 **제거**하고 17-2·17-4 만으로도 MVP 운영 가능합니다.

---

## 17-7. 완료 체크리스트

- [ ] `applications_rls_lockdown.sql` 실행
- [ ] anon REST 로 `applications` 조회 불가
- [ ] `#/admin` 목록·상태/메모 저장 OK
- [ ] 일반 신청·접수번호·Webhook 엑셀 정상
- [ ] XSS 시험(악성 이름) 통과
- [ ] Repo·Pages·`.env` 에 `service_role` / webhook secret 없음

---

## 17-8. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| 관리자 목록 0건 | `app_admins` 에 이메일 없음 | 13-3 INSERT |
| 신청 시 permission denied | RPC GRANT 누락 | `applications_rls_lockdown.sql` 다시 |
| 검증만 안 됨 | 등록부 데이터 | 5장 seed |
| PATCH 실패 | `admin_memo` 없음 | 13-3 (2) ALTER |
| 초기화 forbidden | RLS·비관리자 JWT | 관리자 로그인 + `is_admin()` |
| XSS alert | escape 누락 | 해당 `innerHTML` 에 `escapeHtml` |
| CSP 후 흰 화면 | CDN 차단 | 17-6 CSP 완화 또는 제거 |

---

## 17-9. 보안 한 줄 요약

| 항목 | 상태 |
|------|------|
| anon → applications SELECT | 차단 |
| anon → 신청 저장 | `submit_application` RPC 만 |
| 입주민 검증 | `verify_yyc_resident` RPC (등록부 직접 SELECT 불가) |
| Storage 누적 xlsx | 비공개 + 서명 URL |
| 관리자 가입 | Email signup OFF + `app_admins` |
| 화면 출력 | escapeHtml + safeSignatureSrc |
| service_role · webhook secret | Supabase secrets / GitHub Actions secret 만 |

---

📌 **다음 장**  
18장: 운영 점검표·백업.

---

<div class='page-break'></div>

# 18장. 운영 점검표 + 백업 (혼자 운영하는 사람용)

> **이 장에서 완성하는 것**  
> 1) **주·월 점검 리스트** (`docs/OPERATIONS_CHECKLIST.md`)  
> 2) **장애 30분 행동표** (`docs/INCIDENT_RUNBOOK.md`)  
> 3) **누적 엑셀 자동 백업** (`.github/workflows/backup-workbook.yml`)  
>
> **선행**: 12·14·16·17장  
> **소요 시간**: 약 1시간  
> **난이도**: ★★

---

## 18-1. 운영 점검표

레포에 **`docs/OPERATIONS_CHECKLIST.md`** 가 있습니다.

1. 파일을 열어 **사이트 URL·관리자 이메일** 빈칸 채우기  
2. `git add docs/OPERATIONS_CHECKLIST.md` → commit → push  
3. 매주 월요일 / 매월 1일 체크박스 실행

포함 항목 (현행 앱):

| 주기 | 내용 |
|------|------|
| 매주 | `step 0~2` 테스트 신청, `#/admin` 목록, Storage 엑셀, Webhook·Edge Logs |
| 매월 | 비번·Supabase 한도·Actions·백업 Artifact·등록부·`app_admins` |
| 시즌 종료 | 엑셀 별도 보관 → 15장 초기화 → `optionsCatalog.js` 갱신 |

> 예전 `?admin=1` → **`#/admin`** (13장).

---

## 18-2. 장애 시 행동표

레포에 **`docs/INCIDENT_RUNBOOK.md`** 가 있습니다.

| # | 증상 |
|---|------|
| 1 | 흰 화면 |
| 2 | 신청완료 오류 |
| 3 | 관리자 로그인 실패 |
| 4 | 관리자 목록 0건 |
| 5 | 엑셀 다운로드 401/403 |
| 6 | 엑셀에 줄 안 쌓임 |
| 7 | Supabase 장애 |

하단 **연락·계정** 표에 URL·이메일을 채워 두세요.  
더 많은 코드는 교재 **19장** 에러 카탈로그.

---

## 18-3. 자동 백업 (GitHub Actions)

Supabase 무료 플랜은 DB PITR이 제한적입니다.  
**매일 새벽** Storage 의 `yyc-contract-live_V1.xlsx`(12장 누적본)를 Artifact로 보관합니다.

### (1) GitHub Secrets

**Settings → Secrets and variables → Actions**

| Name | 값 |
|------|-----|
| `VITE_SUPABASE_URL` | 16장과 동일 (`https://xxxx.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → **service_role** (비공개) |

> ⚠️ `service_role` 은 **GitHub Secret + Supabase 대시보드** 에만. 코드·`.env`·Pages에 넣지 않음.

### (2) 워크플로 (레포에 있음)

**`.github/workflows/backup-workbook.yml`**

| 항목 | 값 |
|------|-----|
| 스케줄 | `cron: 0 18 * * *` → **KST 03:00** |
| 수동 | Actions → **Backup application workbook** → Run workflow |
| 저장 | `backups/yyc-contract-live_YYYYMMDD.xlsx` |
| 보관 | Artifact **30일** |

Storage URL (워크플로 내부):

`{VITE_SUPABASE_URL}/storage/v1/object/application-workbook/yyc-contract-live_V1.xlsx`

### (3) 첫 실행

1. Secrets 2개 등록  
2. GitHub → **Actions** → **Backup application workbook** → **Run workflow**  
3. run 페이지 **Artifacts** → xlsx 다운로드·열기  

✅ 다음 날 03:00 KST 전후 자동 run 1건 추가.

### (4) DB만 따로 백업하고 싶을 때

- Table Editor → `applications` → Export CSV (시즌 마감 시)  
- 15장 마감 전 **관리자 엑셀 다운로드** 3중 보관 권장

---

## 18-4. 완료 체크리스트

- [ ] `docs/OPERATIONS_CHECKLIST.md` 빈칸 채움·push
- [ ] `docs/INCIDENT_RUNBOOK.md` 연락처 채움
- [ ] Secrets: `VITE_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `backup-workbook` 수동 Run ✅, Artifact 다운로드
- [ ] 다음 날 자동 백업 1건 확인

---

## 18-5. 자주 나는 에러

| 화면 | 원인 | 해결 |
|------|------|------|
| Missing secrets in workflow | Secret 이름 오타 | 위 2개 이름 정확히 |
| Download failed HTTP 404 | 버킷·파일명 | 12장 `yyc-contract-live_V1.xlsx` |
| HTTP 401 | service_role 오류 | Secret 재등록 |
| 0바이트 파일 | 객체 없음 | 신청 1건 후 Webhook·Storage 확인 |
| cron 안 돌음 | 지연·권한 | UTC+9h; Private 레포 Actions 한도 |
| Artifact 없음 | retention 만료 | 수동 Run 또는 retention-days ↑ |

---

## 18-6. 보안 메모

- `service_role` = DB·Storage 풀권한 → 유출 시 즉시 Reset + Secret 갱신.  
- Artifact는 **리포 접근 권한자**만 다운로드.  
- **30일 Artifact** + **시즌 종료 USB 보관** 2단 구조 권장.

---

> 💪 **16·17·18**  
> 자동 배포 · RLS/XSS · 운영·백업까지 한 사이클 완성.  
> 다음: **19장** 에러 카탈로그, **20장** 시즌 시작/종료.

---

<div class='page-break'></div>

# 19장. 자주 만나는 에러 30선 — 빠른 해결 카탈로그

> **이 장에서 완성하는 것**  
> 운영하다 만날 거의 모든 빨간 글씨를 **"이 화면이면 → 이거 1줄"** 로 빠르게.  
> 새 사고가 나면 이 장 한 번 훑고 → 안 풀리면 18장 INCIDENT_RUNBOOK → 그래도면 Cursor.  
>
> **사용법**: 검색(Cmd+F)에 에러 키워드만 치면 됩니다.  
> **난이도**: ★ (지식 사전)

---

## 19-1. 화면 (Frontend / 브라우저)

### F-01. 사이트 흰 화면 (콘솔에 빨간 줄)
- **원인**: `vite.config.js` 의 `base` 가 리포 경로와 다름.  
- **해결**: `base: '/yyc-options/'`. 16-4 기준대로 push.

### F-02. `Failed to fetch` (제출/다운로드 시)
- **원인**: 인터넷 끊김 / Supabase 도메인 차단 / Edge Function 미배포.  
- **해결**: 인터넷 → Supabase Status → `supabase functions list` 로 함수 존재 확인.

### F-03. 콘솔 `Invalid API key`
- **원인**: `VITE_SUPABASE_ANON_KEY` 오타·미반영.  
- **해결**: GitHub Secret 다시 + Actions 재실행. 로컬은 dev 재시작.

### F-04. CORS 에러 (`No 'Access-Control-Allow-Origin'`)
- **원인**: Supabase URL 끝 `/` / Edge Function CORS 헤더 누락.  
- **해결**: `.env`의 URL은 `.co` 까지만. 함수 `corsHeaders` 정의 확인.

### F-05. `import.meta.env.VITE_*` 가 undefined
- **원인**: dev 서버 재시작 안 함 / `.env.local` 위치 잘못.  
- **해결**: 프로젝트 루트에 `.env.local` → Ctrl+C → `npm run dev`.

### F-06. 폰에서 서명할 때 페이지 같이 스크롤
- **원인**: `touch-action` 미설정.  
- **해결**: 캔버스 `style={{ touchAction: 'none' }}`. 10-4 표 참고.

### F-07. 이메일 검증이 너무 헐거움 (`a@b` 통과)
- **원인**: 정규식 단순.  
- **해결**: 표준 RFC 정규식으로 교체. 9-5 표 참고.

### F-08. 다음 버튼 영원히 회색
- **원인**: trim 미적용 또는 검증 조건 OR/AND 버그.  
- **해결**: 4칸 모두 trim 후 비어있는지 확인. Cursor에 "현재 활성 조건 디버그 출력 후 고쳐줘".

### F-09. 평면도·옵션 그림 안 보임 / `npm ENOENT package.json`
- **원인**: Imgur URL 오타·삭제, 또는 **홈 폴더에서** `npm run dev` 실행.  
- **해결**: 8장 **8-8~8-11** 절차. `cd .../yyc-options` 후 `npm run dev`. URL을 새 탭에 붙여 그림이 뜨는지 확인.

---

## 19-2. 데이터베이스 (Postgres / RPC / RLS)

### D-01. `permission denied for function ...`
- **원인**: `GRANT EXECUTE ... TO authenticated;` 누락.  
- **해결**: 17-2 SQL 끝부분 GRANT 줄 다시 Run.

### D-02. `function ... does not exist`
- **원인**: `next_yyc_receipt_no.sql` / `submit_application.sql` 미실행.  
- **해결**: 11-3 순서대로 Run. RPC 인자는 `{ payload: ... }` (키 이름 `payload`).

### D-03. `duplicate key value violates unique constraint "applications_unique_per_unit"`
- **원인**: (선택) 동·호 UNIQUE 제약 + 같은 호 재신청.  
- **해결**: 정상 차단. 안내 문구 추가 또는 관리자 초기화.

### D-04. `null value in column "..." violates not-null constraint`
- **원인**: 옛 테이블 스키마(`email`, `resident_id_first6` 등) + 새 앱 payload.  
- **해결**: 11-2 테이블 정의로 맞추기. `signature_data_url`·`receipt_no` 빈값 여부 확인.

### D-05. `column "selected_options" does not exist` (또는 `options`)
- **원인**: DB는 예전 칼럼명, 앱은 `selected_options`.  
- **해결**: 11-2·`submit_application.sql` 기준으로 마이그레이션.

### D-06. anon 으로도 `applications` 가 SELECT 됨
- **원인**: RLS OFF 또는 정책에 USING (true).  
- **해결**: 17-2 그대로 다시 Run + 정책에 `is_admin()` 들어갔는지.

### D-07. 관리자 로그인 후에도 표가 0건
- **원인**: `app_admins` 에 본인 이메일 없음.  
- **해결**: `INSERT INTO app_admins(email) VALUES('admin@admin.com');`.

### D-08. 접수번호가 `YYC-2026-0001` 같은 옛 형식
- **원인**: 옛 `next_yyc_receipt_no` RPC.  
- **해결**: `supabase/sql/next_yyc_receipt_no.sql` 전체 다시 Run → `YYC-YYYYMMDD001` 형식.

### D-09. 초기화 후에도 카운터 안 줄어듦
- **원인**: 옛 `admin_clear_all_applications` 사용 중.  
- **해결**: 15-2 SQL 다시 Run.

### D-10. `cannot truncate ... because RLS policy`
- **원인**: 카운터 테이블 RLS ON.  
- **해결**: `ALTER TABLE yyc_receipt_counter DISABLE ROW LEVEL SECURITY;`.

### D-11. `verify_yyc_resident` 가 항상 0줄
- **원인**: 입력값 공백/한자 / 등록부 데이터 다름.  
- **해결**: 정규화(숫자만/연속공백 1칸) 적용. SQL Editor 에서 직접 호출 시험. 5-5.

### D-12. `permission denied for table app_admins`
- **원인**: REVOKE 후 정책 없이 SELECT 시도.  
- **해결**: 17-2 의 `admins_select_admin` 정책이 있는지.

---

## 19-3. Edge Functions / Webhook / Storage

### E-01. Webhook 결과 401
- **원인**: `WORKBOOK_WEBHOOK_SECRET` 과 헤더 `x-workbook-secret` 불일치.  
- **해결**: `supabase secrets set` + Webhook Header 둘 다 같은 값.

### E-02. 422 `header mismatch on pivot sheet`
- **원인**: 엑셀 1행 헤더가 `append-workbook-row/index.ts` 의 `HEADERS` 와 다름.  
- **해결**: 12-2 표 / `index.ts` 의 `HEADERS` 그대로 1행 수정 후 Storage 재업로드.

### E-02b. 422 `pivot sheet missing`
- **원인**: 시트 이름이 `옵션 신청 현황`, `Sheet1 (2)` 가 아님 (예: 예전 교재 `신청서`).  
- **해결**: 시트 이름 변경 또는 템플릿 교체.

### E-02c. 400 `missing record`
- **원인**: Webhook 본문에 `record` 없음 / 잘못된 테이블·이벤트.  
- **해결**: Table=`applications`, Event=**Insert** 만. 11장 INSERT 가 먼저 되는지 확인.

### E-03. 422 `workbook missing and TEMPLATE_PUBLIC_URL unset`
- **원인**: 버킷·파일명 오타 / 템플릿 URL 미설정.  
- **해결**: `WORKBOOK_OBJECT_KEY` = 실제 파일명. `TEMPLATE_PUBLIC_URL` 시크릿 등록.

### E-04. 500 `storage upload fail`
- **원인**: 버킷명 오타 또는 권한.  
- **해결**: `application-workbook` 정확히. service_role 키 정상인지.

### E-05. Webhook은 도는데 엑셀이 안 바뀜
- **원인**: 캐시 / 화면 새로고침 안 함.  
- **해결**: Storage 새로고침 → 업데이트 시간 확인.

### E-06. `not in a project directory` (CLI)
- **원인**: 홈 디렉토리에서 실행.  
- **해결**: `cd /Users/.../yyc-options` 후 다시.

### E-07. `verify_jwt` 401
- **원인**: 함수가 JWT 검사 모드인데 webhook 은 토큰 없음.  
- **해결**: `--no-verify-jwt` 로 배포 또는 `config.toml` 의 `verify_jwt=false` 확인.

### E-08. 다운로드 함수 401/403
- **원인**: 미로그인 / 화이트리스트 누락.  
- **해결**: 관리자 로그인 후 시도. `WORKBOOK_RESET_ALLOWED_EMAILS` 에 본인 이메일.

### E-09. 다운로드는 되는데 1초만에 만료
- **원인**: 시계 차이.  
- **해결**: `expires` 60 → 90~120.

### E-10. 초기화 후에도 1~155 행 보임
- **원인**: 템플릿 자체에 샘플 행.  
- **해결**: 템플릿 엑셀을 헤더 1줄만 두고 다시 push.

### E-11. Edge Function 배포는 됐는데 Logs 가 비어있음
- **원인**: Webhook 미연결 / Webhook URL 오타.  
- **해결**: Webhook URL 끝이 함수명과 정확히 일치하는지.

---

## 19-4. 인증 / 보안

### S-01. `Email signups are disabled` (관리자 로그인 화면)
- **원인**: 13-2(3)에서 OFF — 정상.  
- **해결**: 가입 X, 로그인만.

### S-02. 관리자 비번 분실
- **해결**: Supabase Authentication → Users → 본인 → ⋯ → **Send password recovery**. 받은 메일에서 재설정.

### S-03. 키가 GitHub 에 실수로 push 됨
- **해결**: 즉시 Supabase **Project Settings → API → Reset** 으로 키 회전. GitHub history 도 `git filter-repo` 등으로 청소(부록 D 참고).

### S-04. 관리자 화면에서 alert(1) 뜸 (XSS)
- **원인**: `dangerouslySetInnerHTML` 또는 raw `innerHTML` 잔여.  
- **해결**: `App.jsx` 관리자 `innerHTML` 에 `escapeHtml` 적용 여부 확인 (17-4).

### S-05. 일반인 anon 키로 데이터 다 읽힘
- **원인**: RLS OFF / 정책 USING (true).  
- **해결**: 17-2 SQL 다시. 17-3 시험.

---

## 19-5. CI / 배포 / GitHub Pages

### C-01. Actions 빨간 X — `npm ci` 실패
- **원인**: `package-lock.json` 누락.  
- **해결**: `npm install` 후 lock 파일 commit.

### C-02. `Get Pages site failed`
- **원인**: Pages Source 가 "Branch" 로 남음.  
- **해결**: Settings → Pages → Source = **GitHub Actions**.

### C-03. 사이트 404 on assets (`/assets/index-xxx.js`)
- **원인**: `.nojekyll` 누락 / `base` 잘못.  
- **해결**: 워크플로우의 `.nojekyll` 생성 단계 + `vite.config.js` `base`.

### C-04. push 했는데 사이트 그대로
- **원인**: GitHub Pages CDN 캐시.  
- **해결**: Cmd+Shift+R 하드 리프레시. 그래도 안 되면 시크릿 창.

### C-05. 백업 워크플로우 401
- **원인**: `SUPABASE_SERVICE_ROLE_KEY` 오타.  
- **해결**: Secret 다시 등록 → Re-run.

### C-06. 백업 cron 안 돔
- **원인**: GitHub Free 한도 / 일시 지연.  
- **해결**: UTC 시간 + 30분 정도 지연 가능. 다음 날 다시. 또는 수동 Run.

---

## 19-6. 19장 사용 팁

- 빨간 메시지 한 줄을 **그대로** Cursor 채팅에 붙이고 "이 매뉴얼 19장 표 형식으로 원인·해결 알려줘" 하면, 카탈로그가 자동으로 더 풍부해집니다.
- 새 에러를 만나면 이 파일에 **한 줄 추가**해 두세요. 1년 뒤 본인이 가장 고마워 합니다.

---

📌 **다음 장 미리보기**  
20장은 본 매뉴얼의 **마지막 본문**.  
시즌을 시작·끝내고 다른 사람에게 인수인계할 때 그대로 따라할 수 있는 "시즌 운영 가이드".

---

<div class='page-break'></div>

# 20장. 시즌 시작/종료 + 인수인계 가이드

> **이 장에서 완성하는 것**  
> 1) **새 시즌 시작 체크리스트** — 옵션·등록부·테스트 1회씩  
> 2) **시즌 종료(클로징) 체크리스트** — 백업 → 초기화 → 카탈로그 갱신  
> 3) **인수인계 1장** — 다른 사람이 30분 안에 접수받을 수 있게  
>
> **소요 시간**: 약 1.5시간 (실제 시즌 1번 시뮬레이션 포함)  
> **난이도**: ★★ (지금까지 한 일을 묶기만 함)

---

## 20-1. 미리 알아두기 (1줄 비유)

| 용어 | 1줄 비유 |
|------|---------|
| **시즌** | "한 단지 옵션 모집 1번 = 영업 1회차" |
| **카탈로그** | "이번 시즌의 메뉴판 (`src/optionsCatalog.js`)" |
| **등록부** | "이번 시즌의 명단 (`yyc_resident_registry`)" |
| **클로징** | "받기 끝 → 결산 → 다음 시즌 준비" |

---

## 20-2. 새 시즌 시작 체크리스트

`docs/SEASON_START.md` 새 파일에 그대로 복붙 (체크박스 그대로 사용).

```md
# 새 시즌 시작 — ○○아파트 옵션 신청

## A. 옵션 카탈로그 갱신
- [ ] `src/optionsCatalog.js` 의 평형·옵션·가격을 이번 시즌 안내문대로 수정
- [ ] 평형 키(type_key) 가 등록부의 type_key 와 정확히 일치 (예: 59A, 52A, 48B)
- [ ] commit / push (16장 자동 배포)

## B. 입주민 등록부 갱신
- [ ] 이번 시즌 명단 엑셀 받기
- [ ] 컬럼 5개로 정리: dong, ho, contractor_name, phone_tail(4자리), type_key
- [ ] Supabase SQL Editor 에서 INSERT (5-4 형식 그대로)
- [ ] `SELECT count(*) FROM yyc_resident_registry;` 로 인원 일치 확인

## C. 사이트 사전 점검
- [ ] 일반 신청 1건 테스트 (가짜 입주민) → `step 2` 신청완료
- [ ] 관리자 로그인 → 그 1건 표·상세·서명 정상
- [ ] 누적 엑셀 다운로드 → 1줄
- [ ] 그 후 **초기화 (15장)** 로 깔끔히 비우기 ← ★ 절대 잊지 말기
- [ ] 다시 누적 엑셀 다운로드 → 0줄(헤더만)

## D. 안내문/공지
- [ ] 입주민에게 보낼 URL: https://내아이디.github.io/yyc-options/
- [ ] 운영 기간 (시작·마감), 문의 연락처를 안내문에 명시
- [ ] (선택) 단축 URL/QR 만들어 공지문에 첨부

## E. 운영 도구 준비
- [ ] `docs/INCIDENT_RUNBOOK.md` 빈칸 (URL/이메일/번호) 다시 채움
- [ ] 관리자 비밀번호 메모 위치 확인
- [ ] 백업 워크플로우 1회 수동 실행 → Artifact 확인 (18-3)
```

✅ 위 체크 다 끝나면 "시즌 오픈" 가능 상태.

---

## 20-3. 시즌 종료 체크리스트

`docs/SEASON_CLOSE.md` 새 파일에 복붙.

```md
# 시즌 종료 (클로징) — ○○아파트 옵션 신청

## A. 마감 직전 (마감 1시간 전)
- [ ] 사이트 상단에 마감 안내 (Cursor에 "@App.jsx 상단에 빨간 띠 추가, 'X시 마감 임박' 문구")
- [ ] 관리자 화면 새로고침 → 신청 건수 메모

## B. 마감 후 결산
- [ ] 관리자 → 누적 엑셀 다운로드 → 파일명 `yyc-시즌YYYY.xlsx` 로 저장
- [ ] USB / 사내 드라이브 등 안전 위치에 별도 보관 (3중 백업 권장)
- [ ] 결산표 만들기:
      - 평형별 신청 건수
      - 옵션별 신청 수 / 매출 합계
      - (Cursor 에 엑셀 첨부 후 "이 시트 기반으로 평형·옵션별 합계표 만들어줘")
- [ ] 회사 양식대로 보고서 작성

## C. 다음 시즌 준비
- [ ] 관리자 화면 → "초기화" (15장) — DB·카운터·누적 엑셀 모두 0
- [ ] 새 시즌 카탈로그 갱신 (20-2 A)
- [ ] 새 시즌 등록부 갱신 (20-2 B)
- [ ] 백업 폴더 `backups/` 의 만료된 파일 정리 (선택)

## D. 보안 점검
- [ ] 관리자 비밀번호 변경 (분기 1회 권장)
- [ ] GitHub Secrets / Supabase Secrets 변동 사항 없는지
- [ ] 17장 RLS 정책 그대로 살아있는지 (anon SELECT 시험 1회)
```

⚠️ **C의 "초기화" 는 B의 백업이 100% 완료된 뒤에만**. 초기화하면 누적 엑셀과 DB가 모두 비워집니다.

---

## 20-4. 인수인계 1장 (다른 사람이 30분 안에 운영 가능)

`docs/HANDOVER.md` 새 파일에 복붙 → 빈칸을 채워 PDF 한 장으로 출력 가능.

```md
# 인수인계 — ○○아파트 옵션 신청 시스템

## 1) 한 줄 요약
입주민이 동·호·이름·휴대폰뒤4를 입력하면 등록부와 대조 후
평형별 옵션을 골라 신청하고, 신청은 자동으로 인터넷 엑셀에 누적됩니다.

## 2) 접속 주소
- 사용자 사이트: https://__GITHUB_ID__.github.io/yyc-options/
- 관리자 페이지: 위 주소 + `#/admin`

## 3) 관리자 계정
- 이메일: admin@admin.com
- 비밀번호: (별도 보관 — 회사 비밀번호 금고 "옵션신청-관리자")

## 4) 인프라 계정 (변경/회수 시 절차 ↓)
- GitHub: __GITHUB_ID__
- Supabase 프로젝트: yyc-options (URL: https://__PROJECT_REF__.supabase.co)
- Supabase 결제 카드: (해당 시) 명세
- 도메인: (사용 시) __DOMAIN__

## 5) 자주 쓰는 작업
- 옵션 가격 바꾸기 → src/optionsCatalog.js 수정 후 push
- 입주민 명단 갱신 → Supabase SQL Editor 에서 INSERT (5-4 형식)
- 신청 결산용 엑셀 받기 → 관리자 페이지 → "엑셀 다운로드"
- 시즌 초기화 → 관리자 페이지 → "초기화" (DB+카운터+엑셀 모두 비움)

## 6) 사고 시
- 우선 docs/INCIDENT_RUNBOOK.md 의 7가지 시나리오 따라하기
- 그래도 안 풀리면 docs/19장 카탈로그 검색
- 마지막 수단: Cursor 채팅에 에러 메시지 그대로 + "이 매뉴얼 기반으로 원인/해결 알려줘"

## 7) 정기 작업
- 매주 월요일: docs/OPERATIONS_CHECKLIST.md 의 "매주 1회" 6항목
- 매월 1일: 같은 문서의 "매월 1회" 5항목
- 백업: 매일 03:00 KST 자동 (GitHub Actions → backup-workbook)

## 8) 절대 하지 말 것
- service_role 키 / DB 비밀번호를 코드·메일·메신저에 적기
- 17장 RLS 정책을 임의로 끄기
- 누적 엑셀(application-workbook 버킷)을 Public 으로 바꾸기
- 백업 없이 "초기화" 누르기

## 9) 권한 회수 절차 (퇴사·인수인계 시)
1. Supabase Authentication 에서 admin@admin.com 비밀번호 재설정
2. Supabase Project Settings → API → service_role 키 Reset
3. 새 키를 GitHub Secret 에 갱신 (CI 재실행)
4. GitHub 리포 Collaborator 에서 이전 담당자 제거
```

→ 이 한 장만 있으면 **다른 사람이 30분 안에 "접수 받고, 받은 거 보고, 시즌 마감" 까지** 할 수 있습니다.

---

## 20-5. 끝부터 끝까지 "리허설 시즌" 한 번 돌려 보기

진짜 시즌 전에 **혼자서 시즌 1번을 시뮬레이션** 하는 걸 강력 추천.

| 시간 | 할 일 | 결과 |
|------|------|------|
| 0:00 | 20-2 A·B 따라 카탈로그·등록부 가짜 데이터로 갱신 | push, INSERT |
| 0:15 | 일반 화면에서 신청 3건 (가짜 입주민) | 접수번호 0001~0003 |
| 0:25 | 관리자 → 표·상세·서명 확인 | 3건 그대로 |
| 0:30 | 누적 엑셀 다운로드 → 3줄 | 정상 |
| 0:35 | 백업 워크플로우 수동 실행 → Artifact 다운로드 | 같은 파일 |
| 0:40 | 20-3 C "초기화" 실행 | 0건, 헤더만 엑셀 |
| 0:45 | 다시 신청 1건 → 접수번호 0001 | 통과 |

✅ 위 6단계가 **에러 없이** 다 통과하면 진짜 시즌 오픈 OK.

---

## 20-6. 20장 완료 체크리스트

- [ ] `docs/SEASON_START.md` / `SEASON_CLOSE.md` / `HANDOVER.md` 가 리포에 있다
- [ ] 인수인계 문서의 빈칸(`__GITHUB_ID__` 등)을 채워둠
- [ ] 리허설 시즌 1번 통과
- [ ] 백업 자동 실행이 어제 1건 이상 ✅
- [ ] 본인이 자리를 비울 때 **이 3개 문서만 줘도 시즌 운영이 가능**

---

## 20-7. 자주 나는 운영 사고 (시즌 단위)

| 화면 | 원인 | 해결 |
|------|------|------|
| 시즌 오픈 직후 "등록되지 않은 정보" 폭주 | 등록부 INSERT 누락/오타 | SQL 카운트와 명단 인원 비교, 빠진 행만 추가 |
| 신청은 들어오는데 엑셀에 안 쌓임 | Webhook 비활성/오타 | Database → Webhooks 활성·URL 점검 (E-11) |
| 마감 직전 폭증으로 응답 느림 | Free 플랜 한계 | 마감 1시간 전 안내 + 사전 분산 / 필요 시 Pro |
| 마감 후 누적 엑셀 다운 안 됨 | service_role 키 회전 직후 | Supabase secrets / GitHub secrets 양쪽 갱신 |
| 새 시즌 시작 후 옛 신청이 비침 | 초기화 안 함 | 20-3 C 실행. 백업이 됐는지 먼저 확인 |
| 인수인계 후 첫 운영자가 막힘 | 비번/접속 정보 부족 | `docs/HANDOVER.md` 빈칸 점검 |

---

## 20-8. 보안 메모 (시즌 단위)

- 시즌이 끝나면 **백업 → 초기화** 가 보안에도 좋습니다 (오래된 PII를 시스템에 두지 않음).  
- 백업본은 **30일 자동 + 시즌 1부 별도 보관**의 2단 구조로 충분.  
- 인수인계 시 **service_role 키와 관리자 비밀번호는 반드시 회전**.

---

> 💪 **여기까지 오신 분께**  
> 0~20장으로 본 매뉴얼의 **본문 전체** 가 끝났습니다.

---

<div class='page-break'></div>

# 부록 A. 모든 SQL 한 페이지 (복붙용)

> **이 부록의 용도**  
> 새 환경에 설치하거나, 의심스러울 때 "지금 SQL 상태가 깨끗한가?" 한 번에 다시 깔 때.  
> **위에서 아래로 순서대로** 한 번씩 Run 하면 본 매뉴얼 시점의 DB가 똑같이 만들어집니다.  
>
> 사용 순서: 4장 프로젝트 생성 → 이 부록 A 한 번 → 14·17장 부분만 다시 확인.

---

## A-0. 처음 한 번만 — 위험 명령 (이미 운영 중이면 SKIP)

```sql
-- 깔끔히 다시 시작할 때만. 운영 데이터 모두 사라짐.
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.yyc_resident_registry CASCADE;
DROP TABLE IF EXISTS public.yyc_receipt_counter CASCADE;
DROP TABLE IF EXISTS public.app_admins CASCADE;
DROP FUNCTION IF EXISTS public.verify_yyc_resident(text,text,text,text);
DROP FUNCTION IF EXISTS public.next_yyc_receipt_no();
DROP FUNCTION IF EXISTS public.submit_application(jsonb);
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.list_applications();
DROP FUNCTION IF EXISTS public.get_application(bigint);
DROP FUNCTION IF EXISTS public.admin_clear_all_applications();
DROP FUNCTION IF EXISTS public.admin_reset_yyc_receipt_counter();
```

---

## A-1. 등록부 + 검증 함수 (5장)

```sql
CREATE TABLE IF NOT EXISTS public.yyc_resident_registry (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  dong text NOT NULL,
  ho text NOT NULL,
  contractor_name text NOT NULL,
  phone_tail text NOT NULL,
  type_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT yyc_resident_phone_chk CHECK (phone_tail ~ '^[0-9]{4}$'),
  CONSTRAINT yyc_resident_unique UNIQUE (dong, ho, contractor_name, phone_tail)
);
ALTER TABLE public.yyc_resident_registry ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.yyc_resident_registry FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.verify_yyc_resident(
  p_dong text, p_ho text, p_contractor text, p_phone_tail text
)
RETURNS TABLE(type_key text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT r.type_key FROM public.yyc_resident_registry r
  WHERE r.dong = regexp_replace(coalesce(p_dong,''), '\D','','g')
    AND r.ho   = regexp_replace(coalesce(p_ho,''),   '\D','','g')
    AND r.contractor_name = trim(regexp_replace(coalesce(p_contractor,''), '\s+',' ','g'))
    AND r.phone_tail = regexp_replace(coalesce(p_phone_tail,''), '\D','','g')
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.verify_yyc_resident(text,text,text,text) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.verify_yyc_resident(text,text,text,text) TO anon, authenticated;
```

---

## A-2. 신청서 + 접수번호 + 저장 RPC (11장)

### (1) 테이블

**빈 DB:** `supabase/sql/applications_create_table.sql` 전체 Run.

**옛 스키마 DB:** `supabase/sql/applications_migrate_to_current_schema.sql` Run 후 (2) 실행.

<details><summary>또는 아래 SQL 직접 붙여넣기</summary>

```sql
CREATE TABLE IF NOT EXISTS public.applications (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  receipt_no text UNIQUE NOT NULL,
  customer_name text NOT NULL DEFAULT '미입력',
  phone text NOT NULL DEFAULT '',
  dong text NOT NULL,
  ho text NOT NULL,
  unit_type text NOT NULL,
  selected_options jsonb NOT NULL DEFAULT '[]'::jsonb,
  selected_options_summary text,
  total_price numeric NOT NULL DEFAULT 0,
  signature_data_url text NOT NULL DEFAULT '',
  printed boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT '접수됨',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.applications FROM PUBLIC;
```

</details>

### (2) 함수 — 레포 SQL 파일 **전체** 실행 (권장)

| 순서 | 파일 |
|------|------|
| 1 | `supabase/sql/next_yyc_receipt_no.sql` |
| 2 | `supabase/sql/submit_application.sql` |

앱 호출: `POST /rpc/next_yyc_receipt_no` `{}` → `POST /rpc/submit_application` `{"payload":{...}}`

---

## A-3. 관리자 화이트리스트 + 조회 RPC (13장)

```sql
CREATE TABLE IF NOT EXISTS public.app_admins ( email text PRIMARY KEY );
INSERT INTO public.app_admins(email) VALUES ('admin@admin.com')
ON CONFLICT DO NOTHING;
ALTER TABLE public.app_admins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.app_admins FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.app_admins a
    WHERE a.email = lower(coalesce(auth.jwt()->>'email',''))
  );
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.is_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.list_applications()
RETURNS TABLE(
  id bigint, receipt_no text, customer_name text,
  dong text, ho text, unit_type text,
  total_amount integer, created_at timestamptz
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'forbidden' USING ERRCODE='42501'; END IF;
  RETURN QUERY
    SELECT a.id, a.receipt_no, a.customer_name,
           a.dong, a.ho, a.unit_type,
           a.total_amount, a.created_at
      FROM public.applications a
     ORDER BY a.created_at DESC;
END $$;
REVOKE ALL ON FUNCTION public.list_applications() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.list_applications() TO authenticated;

CREATE OR REPLACE FUNCTION public.get_application(p_id bigint)
RETURNS SETOF public.applications
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'forbidden' USING ERRCODE='42501'; END IF;
  RETURN QUERY SELECT * FROM public.applications WHERE id = p_id;
END $$;
REVOKE ALL ON FUNCTION public.get_application(bigint) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_application(bigint) TO authenticated;
```

---

## A-4. 초기화 RPC (15장)

```sql
CREATE OR REPLACE FUNCTION public.admin_clear_all_applications()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'forbidden' USING ERRCODE='42501'; END IF;
  TRUNCATE TABLE public.applications RESTART IDENTITY;
  TRUNCATE TABLE public.yyc_receipt_counter;
  INSERT INTO public.yyc_receipt_counter(id, current_no) VALUES (1, 0)
    ON CONFLICT DO NOTHING;
END $$;
REVOKE ALL ON FUNCTION public.admin_clear_all_applications() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.admin_clear_all_applications() TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_reset_yyc_receipt_counter()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'forbidden' USING ERRCODE='42501'; END IF;
  TRUNCATE TABLE public.yyc_receipt_counter;
  INSERT INTO public.yyc_receipt_counter(id, current_no) VALUES (1, 0);
END $$;
REVOKE ALL ON FUNCTION public.admin_reset_yyc_receipt_counter() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.admin_reset_yyc_receipt_counter() TO authenticated;
```

---

## A-5. 보안 최종 잠금 (17장)

**한 번에:** `supabase/sql/applications_rls_lockdown.sql` 전체 Run (13-3 `is_admin()` 선행).

- `list_applications` / `get_application` GRANT 없음 (현재 앱은 REST `applications` + RLS)
- 느슨한 DELETE 정책(`applications_delete_policy.sql`) 은 잠금 후 **불필요** — 있으면 lockdown SQL 이 DROP

---

## A-6. 빠른 점검 쿼리 모음

```sql
-- 신청 건수 / 평형별
SELECT count(*) FROM public.applications;
SELECT unit_type, count(*) FROM public.applications GROUP BY 1 ORDER BY 1;

-- 옵션별 매출 합계 (jsonb 풀어 보기)
SELECT o->>'label' AS option_label,
       sum((o->>'price')::numeric) AS total
FROM public.applications, jsonb_array_elements(selected_options) o
GROUP BY 1 ORDER BY 2 DESC;

-- 등록부 인원
SELECT count(*) FROM public.yyc_resident_registry;

-- 올해 접수번호 일련 (카운터)
SELECT year, seq FROM public.yyc_receipt_counter ORDER BY year;

-- 관리자 명단
SELECT * FROM public.app_admins;

-- (관리자로 로그인 후) 본인 인식되는지
SELECT public.is_admin();
```

---

<div class='page-break'></div>

# 부록 B. 모든 Edge Function 코드 모음

> **이 부록의 용도**  
> 함수 3개를 한 번에 다시 깔거나, 다른 Supabase 프로젝트로 이식할 때.  
> 모두 `supabase/functions/<이름>/index.ts` 위치.

---

## B-0. `supabase/config.toml`

```toml
[functions.append-workbook-row]
verify_jwt = false

[functions.reset-application-workbook]
verify_jwt = false

[functions.sign-application-workbook]
verify_jwt = false
```

---

## B-1. `append-workbook-row/index.ts` (12장)

**정본**: 레포 `supabase/functions/append-workbook-row/index.ts` 전체를 복사·배포하세요.  
(교재에 긴 코드를 붙이지 않습니다 — 11장 `selected_options` 피벗 로직이 자주 바뀝니다.)

요약:

| 항목 | 값 |
|------|-----|
| 인증 | Header `x-workbook-secret` = `WORKBOOK_WEBHOOK_SECRET` |
| 입력 | Webhook `body.record` (`applications` INSERT 행) |
| 시트 | `옵션 신청 현황` 또는 `Sheet1 (2)` |
| 용도 열 | `도시형생활주택` 고정 |
| 옵션 | `record.selected_options` → 18개 옵션 열에 `price` 합산 |
| 합계 | `record.total_price` → `총액` |
| Storage | `WORKBOOK_BUCKET` / `WORKBOOK_OBJECT_KEY` (기본 `application-workbook` / `yyc-contract-live_V1.xlsx`) |

1행 `HEADERS` 는 12장 표와 `index.ts` 상단 배열이 같아야 합니다.

---

## B-2. `sign-application-workbook/index.ts` (14장)

**정본**: `supabase/functions/sign-application-workbook/index.ts`

| 항목 | 내용 |
|------|------|
| 메서드 | POST + `Authorization: Bearer <access_token>` |
| 검증 | `auth.getUser(jwt)` + (선택) `WORKBOOK_RESET_ALLOWED_EMAILS` |
| 응답 | `{ "signedUrl": "…", "expiresIn": 60 }` (앱은 `signedUrl` 사용) |
| 대상 | `WORKBOOK_BUCKET` / `WORKBOOK_OBJECT_KEY` 누적 xlsx |

---

## B-3. `reset-application-workbook/index.ts` (15장)

**정본**: `supabase/functions/reset-application-workbook/index.ts`

| 항목 | 내용 |
|------|------|
| 메서드 | POST + Bearer JWT |
| 동작 | `TEMPLATE_PUBLIC_URL` GET → Storage `WORKBOOK_OBJECT_KEY` upsert |
| SQL | `supabase/sql/admin_clear_all_applications.sql` (DB·카운터) |

---

## B-4. 한 번에 배포 (CLI 명령 묶음)

```bash
cd /경로/yyc-options
supabase link --project-ref __PROJECT_REF__

# 시크릿 (한 번에)
supabase secrets set \
  WORKBOOK_WEBHOOK_SECRET="원하는비밀번호16자이상" \
  WORKBOOK_BUCKET="application-workbook" \
  WORKBOOK_OBJECT_KEY="yyc-contract-live_V1.xlsx" \
  TEMPLATE_PUBLIC_URL="https://__GITHUB_ID__.github.io/yyc-options/templates/yyc-contract-pivot-template.xlsx" \
  WORKBOOK_RESET_ALLOWED_EMAILS="admin@admin.com"

# 함수 3개 배포
supabase functions deploy append-workbook-row     --no-verify-jwt
supabase functions deploy sign-application-workbook --no-verify-jwt
supabase functions deploy reset-application-workbook --no-verify-jwt
```

---

<div class='page-break'></div>

# 부록 C. 환경변수·시크릿 전체 표 (어디에 무엇을 두는가)

> **이 부록의 용도**  
> "어떤 키를 어디에 두라고 했지?" 가 한 페이지에. 보안 사고는 80%가 '잘못된 위치에 둔 키' 에서 나옵니다.

---

## C-1. 한눈에 보는 표

| 키 이름 | 어디에 두나 | 누가 보나 | 사용처 |
|---------|-------------|-----------|--------|
| **VITE_SUPABASE_URL** | `.env.local` (로컬) + GitHub Secret | 누구나 (빌드 후 클라에 박힘) | 프런트엔드 |
| **VITE_SUPABASE_ANON_KEY** | `.env.local` + GitHub Secret | 누구나 | 프런트엔드 |
| **VITE_BASE** | `.github/workflows/pages.yml` 의 env | 빌드 단계 | Vite base 경로 |
| **SUPABASE_SERVICE_ROLE_KEY** | **Supabase secrets** + GitHub Secret(백업용만) | ⚠️ 개발자만 | Edge Function · 백업 워크플로우 |
| **WORKBOOK_WEBHOOK_SECRET** | Supabase secrets + Database Webhook 헤더 | ⚠️ 개발자만 | append-workbook-row 인증 |
| **WORKBOOK_BUCKET** | Supabase secrets | 보통 | 함수들 |
| **WORKBOOK_OBJECT_KEY** | Supabase secrets | 보통 | 함수들 |
| **TEMPLATE_PUBLIC_URL** | Supabase secrets | 공개 OK | reset-application-workbook |
| **WORKBOOK_RESET_ALLOWED_EMAILS** | Supabase secrets | 보통 | sign·reset 함수 |
| **DB Password** | 본인 메모장 (오프라인) | 본인만 | DB 직접 접속 시 |
| **관리자(admin@admin.com) 비번** | 회사 비밀번호 금고 | 인수인계 대상 | 관리자 로그인 |

---

## C-2. 절대 두면 안 되는 위치 (자주 실수)

| 키 | 절대 X 위치 | 이유 |
|----|-------------|------|
| `SUPABASE_SERVICE_ROLE_KEY` | 코드, README, 메일, 메신저, `VITE_*` 환경변수 | DB 풀권한. 누설 즉시 모든 데이터 위험 |
| `WORKBOOK_WEBHOOK_SECRET` | 코드, README | 웹훅 위장 가능 |
| `DB Password` | GitHub, Slack, 메일 | DB 직접 접근 가능 |
| 관리자 비밀번호 | 평문 메모, 공유 문서 | 어떤 백업·관리 작업도 가능 |

---

## C-3. 키 회전(주기적으로 바꾸기) 체크리스트

| 키 | 주기 | 절차 |
|----|------|------|
| 관리자 비번 | 분기 1회 | Supabase Auth → Users → Reset password |
| `service_role` | 6개월 1회·노출 의심 시 즉시 | Project Settings → API → Reset → Supabase secrets · GitHub Secret 둘 다 갱신 → CI 재실행 |
| `WORKBOOK_WEBHOOK_SECRET` | 노출 의심 시 | Supabase secrets 갱신 + Database Webhook 헤더 같은 값으로 |
| anon key | 회전 거의 X (필요 시 가능) | Reset 후 `.env`/Secret 갱신 |
| DB Password | 6개월 1회 | Settings → Database → Reset password (직접 접속 도구 다 갱신) |

---

## C-4. 빠른 점검 명령

```bash
# 어떤 시크릿이 등록되어 있는지
supabase secrets list

# Edge Function 목록
supabase functions list

# 로컬 환경변수가 잡히는지
echo $VITE_SUPABASE_URL    # zsh
```

⚠️ Supabase secret **값 자체는 다시 못 봅니다.** 메모장 따로 보관 필수.

---

<div class='page-break'></div>

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
