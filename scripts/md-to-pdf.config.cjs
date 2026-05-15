module.exports = {
  stylesheet: ["scripts/manual-style.css"],
  pdf_options: {
    format: "A4",
    margin: { top: "18mm", bottom: "18mm", left: "14mm", right: "14mm" },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: "<div></div>",
    footerTemplate:
      '<div style="font-size:8pt;color:#64748b;width:100%;text-align:center;padding:4mm 0;">' +
      '○○아파트 옵션 신청 시스템 매뉴얼 — <span class="pageNumber"></span> / <span class="totalPages"></span></div>',
  },
  launch_options: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  marked_options: {
    gfm: true,
    breaks: false,
  },
  body_class: ["manual-pdf"],
};
