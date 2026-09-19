// Generates index.html + the five project pages from shared templates.
// Run:  node build.js
const fs = require("fs");
const path = require("path");

const FONTS =
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?family=Anybody:wght@400;500;600&family=Inter:wght@400;500;700&family=Noto+Sans+TC:wght@400;500;700&display=swap" rel="stylesheet">';

const MAIL_SVG =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" fill="#fff"/></svg>';
const PHONE_SVG =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z" fill="#fff"/></svg>';

const header = (active) => `
<header class="site-header">
  <div class="container">
    <a class="brand" href="index.html" aria-label="IT's LOFY DESIGN 首頁">
      <span class="logo">IT<span class="tick">’</span>s LOFY DESIGN</span>
    </a>
    <nav class="site-nav" aria-label="主選單">
      <a href="index.html#about">ABOUT ME</a>
      <a href="index.html#portfolio">設計作品集</a>
    </nav>
  </div>
</header>`;

const footer = `
<footer class="site-footer">
  <div class="container">
    <div class="footer-logo">IT<span class="tick">’</span>s LOFY DESIGN</div>
    <ul class="footer-col footer-contact">
      <li>${MAIL_SVG}<a href="mailto:wu620826@gmail.com">wu620826@gmail.com</a></li>
      <li>${PHONE_SVG}<a href="tel:0909463438">0909-463-438</a></li>
    </ul>
    <ul class="footer-col">
      <li><a href="liuchongxi.html">六重溪部落VIS設計</a></li>
      <li><a href="vis.html">水牛安養中心 VIS 設計</a></li>
    </ul>
    <ul class="footer-col">
      <li><a href="lamp.html">仿生燈具設計</a></li>
      <li><a href="others.html">其他作品</a></li>
    </ul>
    <a class="footer-about" href="index.html#about"><img src="assets/icon-about.svg" alt="">ABOUT ME</a>
  </div>
</footer>`;

const skillsRow = (keys) =>
  `<section class="skills" aria-label="專長領域">${keys
    .map((k) => `<div class="skill skill--${k}" role="img" aria-label="${SKILL_LABEL[k]}"></div>`)
    .join("")}</section>`;

const SKILL_LABEL = {
  product: "產品設計 Product Design",
  service: "服務設計 Service Design",
  uiux: "UIUX設計 Ui Ux Design",
  visual: "視覺傳達 Visual Communication",
  brand: "品牌設計 Brand Design",
  plan: "企劃流程 Product Plan",
};

const shell = ({ title, body, extraHead = "" }) => `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="吳品潔 LOFY 的設計作品集：產品設計、視覺傳達、品牌設計、企劃流程。">
${FONTS}
<link rel="stylesheet" href="css/style.css">
${extraHead}
</head>
<body>
<div class="page">
${header()}
${body}
${footer}
</div>
<script>
// Section images that have not been exported from Figma yet fall back to a labelled placeholder.
document.querySelectorAll("img[data-frame]").forEach(function (img) {
  img.addEventListener("error", function () {
    var box = document.createElement("div");
    box.className = "section-missing";
    box.innerHTML = "此區塊圖片尚未匯出<br>請在 Figma 匯出畫框 <b>" + img.dataset.frame + "</b>（JPG 2x），存成 <b>" + img.getAttribute("src") + "</b>";
    img.replaceWith(box);
  });
});
</script>
</body>
</html>
`;

/* ------------------------------------------------------------------ */
/* Home                                                               */
/* ------------------------------------------------------------------ */

const card = ({ href, title, sub, tags, cover }) => `
      <a class="card" href="${href}">
        <div class="card-cover">${cover}</div>
        <h3>${title}</h3>
        <p class="sub">${sub}</p>
        <div class="card-tags">${tags.map((t) => `<span>${t}</span>`).join("")}</div>
        <div class="card-bar"></div>
      </a>`;

const homeBody = `
<section class="banner" aria-label="主視覺">
  <img src="assets/banner-home.png" alt="IT's LOFY DESIGN — 產品設計 | 視覺傳達 | 品牌設計 | 企劃流程" width="1440" height="669">
</section>

${skillsRow(["product", "visual", "brand", "plan"])}

<section class="about" id="about">
  <div class="about-intro">
    <div class="about-photo"><img src="assets/photo.png" alt="吳品潔 LOFY 個人照"></div>
    <div class="about-text">
      <div class="about-name">
        <span class="big">LOFY</span>
        <span class="sep">|</span>
        <span class="zh">吳品潔<span class="en">PIN-CHIEH</span></span>
      </div>
      <div class="about-desc">
        <p>嗨，我是來自雲科大的雙主修學生，主修資訊管理，副修創意設計。</p>
        <p>我擅長整合需求、視覺設計與數位工具應用，喜歡用設計解決問題，創造貼近人心的體驗。</p>
        <p>目前持續累積相關實作經驗，期望未來成為能串連品牌與客戶的設計人才。</p>
      </div>
    </div>
  </div>

  <div class="about-band">
    <div class="band-col">
      <div class="band-title"><h3>學歷</h3><span>Education</span></div>
      <div class="band-row edu"><span class="lbl">國立雲林科技大學 資訊管理系</span><span class="meta">2021/9 -</span></div>
      <div class="band-row edu"><span class="lbl">國立雲林科技大學 創意設計系(雙主修)</span><span class="meta">2022/9 -</span></div>

      <div class="band-block">
        <div class="band-title"><h3>實習經歷</h3><span>Professional Experience</span></div>
        <div class="band-row"><span class="lbl">大樹國際文化企業股份有限公司</span><span class="meta">前端開發實習生 2023</span></div>
        <ul class="band-bullets">
          <li>協助一間沒有 IT 部門的連鎖教育機構進行數位轉型。</li>
          <li>專注於前端介面開發，負責頁面設計、互動流程優化與資料呈現。</li>
          <li>協助團隊打造客製化的內部管理系統。</li>
        </ul>
      </div>
    </div>

    <div class="band-col">
      <div class="band-title"><h3>語言能力</h3><span>Languages</span></div>
      <div class="band-row"><span class="lbl">英文</span><span class="meta">TOEIC 720</span></div>
      <div class="band-row"><span class="lbl">日文</span><span class="meta">基礎會話</span></div>

      <div class="band-block">
        <div class="band-title"><h3>關鍵技能</h3><span>Key Skills</span></div>
        <div class="skill-lists">
          <div>
            <h4>常用軟體</h4>
            <ul><li>Figma</li><li>illustrator</li><li>photoshop</li></ul>
          </div>
          <div>
            <h4>3D建模</h4>
            <ul><li>Blender</li><li>Sketchup</li><li>AutoCad(2D、3D)</li></ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="portfolio" id="portfolio">
  <h2 class="portfolio-title"><img src="assets/sakura.png" alt="">作品集 | PORTFOLIO</h2>
  <div class="card-grid">
${card({
  href: "vis.html",
  title: "水牛安養中心 - 視覺規劃改造計劃",
  sub: "企業品牌識別",
  tags: ["品牌識別", "在地文化"],
  cover: '<img class="bleed" src="assets/card-buffalo.png" alt="水牛安養中心 視覺規劃改造計劃">',
})}
${card({
  href: "lamp.html",
  title: "化蛇 - 仿生燈具設計",
  sub: "產品設計成果報告",
  tags: ["產品", "仿生", "AI輔助設計", "造型表現"],
  cover:
    '<img class="lamp-bg" src="assets/card-lamp.png" alt="化蛇 仿生燈具">' +
    '<img class="lamp-title" src="assets/card-lamp-title.png" alt="化蛇">' +
    '<span class="lamp-sub">蛇型仿生露營燈</span>',
})}
${card({
  href: "liuchongxi.html",
  title: "六重溪部落 - 文創行銷計畫",
  sub: "部落視覺規劃",
  tags: ["品牌識別", "在地文化"],
  cover: '<img src="assets/card-liuchongxi.png" alt="六重溪部落 Tribe of Liuchong Creek">',
})}
${card({
  href: "others.html",
  title: "其他作品",
  sub: "平面設計 | 3D建模作品",
  tags: ["視覺傳達", "粉專經營", "工業設計", "模型展示"],
  cover:
    '<img src="assets/card-others.png" alt="其他作品">' +
    '<div class="view-more"><img src="assets/view-more.svg" alt="VIEW MORE"></div>',
})}
${card({
  href: "uiux.html",
  title: "行動雲科 UX 改良提案",
  sub: "使用者體驗與介面改良",
  tags: ["APP", "UI/UX", "服務設計"],
  cover: '<img class="bleed" src="assets/card-uiux.png" alt="行動雲科 UX 改良提案 Creative Interface Design">',
})}
  </div>
</section>`;

/* ------------------------------------------------------------------ */
/* Project pages                                                      */
/* ------------------------------------------------------------------ */

// Each section = a Figma frame exported as JPG @2x into assets/pages/<slug>/.
// `full` = frame spans the whole 1440px width (no side inset).
const PROJECTS = [
  {
    slug: "uiux",
    title: "行動雲科 UX 改良提案",
    subtitle: "使用者體驗與介面改良",
    skills: ["product", "uiux", "visual"],
    bannerExt: "jpg",
    sections: [
      { file: "01-frame39.jpg", frame: "Frame 39（專案背景與目標）" },
      { file: "02-frame41.jpg", frame: "Frame 41（事前調查）" },
      { file: "03-frame42.jpg", frame: "Frame 42（功能改良選擇）" },
      { file: "04-frame40.jpg", frame: "Frame 40（緊急求助改良）" },
      { file: "05-frame43.jpg", frame: "Frame 43（成績查詢改良）" },
      { file: "06-frame44.jpg", frame: "Frame 44（測試結果）" },
    ],
    tail: `
<section class="thanks" aria-label="Thank for Watching">
  <div class="thanks-text"><span>Thank for</span><br><span>Watching！</span></div>
  <img class="thanks-img" src="assets/pages/uiux/07-thanks.png" data-frame="1 4987979（Thank for Watching 手機圖）" alt="">
</section>`,
  },
  {
    slug: "vis",
    title: "水牛安養中心 VIS 設計",
    subtitle: "企業品牌識別改造企劃",
    skills: ["visual", "brand"],
    sections: [
      { file: "01-frame47.jpg", frame: "Frame 47" },
      { file: "02-frame46.jpg", frame: "Frame 46" },
      { file: "03-frame38.jpg", frame: "Frame 38" },
      { file: "04-frame39.jpg", frame: "Frame 39" },
      { file: "05-frame44.jpg", frame: "Frame 44" },
      { file: "06-frame45.jpg", frame: "Frame 45" },
      { file: "07-frame40.jpg", frame: "Frame 40" },
      { file: "08-frame43.jpg", frame: "Frame 43" },
      { file: "09-frame42.jpg", frame: "Frame 42" },
      { file: "10-frame41.jpg", frame: "Frame 41（服務中心 | 園區規劃）" },
    ],
  },
  {
    slug: "lamp",
    title: "化蛇 - 仿生燈具設計",
    subtitle: "產品設計成果報告",
    skills: ["visual", "product"],
    sections: [
      { file: "01-frame47.jpg", frame: "Frame 47", full: true },
      { file: "02-frame39.jpg", frame: "Frame 39" },
      { file: "03-frame46.jpg", frame: "Frame 46" },
      { file: "04-frame38.jpg", frame: "Frame 38", full: true },
      { file: "05-frame49.jpg", frame: "Frame 49" },
      { file: "06-frame48.jpg", frame: "Frame 48" },
      { file: "07-frame50.jpg", frame: "Frame 50" },
      { file: "08-frame51.jpg", frame: "Frame 51", full: true },
    ],
  },
  {
    slug: "others",
    title: "其他作品",
    subtitle: "平面設計 | 3D建模作品",
    skills: ["visual", "brand", "plan"],
    sections: [
      { file: "01-frame39.jpg", frame: "Frame 39" },
      { file: "02-frame46.jpg", frame: "Frame 46" },
      { file: "03-post2.jpg", frame: "貼文2 1", full: true },
      { file: "04-frame47.jpg", frame: "Frame 47" },
      { file: "05-frame48.jpg", frame: "Frame 48" },
    ],
  },
  {
    slug: "liuchongxi",
    title: "六重溪部落-文創行銷計畫",
    subtitle: "部落視覺規劃",
    skills: ["visual", "brand"],
    sections: [
      { file: "01-frame43.jpg", frame: "Frame 43" },
      { file: "02-frame38.jpg", frame: "Frame 38" },
      { file: "03-frame39.jpg", frame: "Frame 39" },
      { file: "04-frame40.jpg", frame: "Frame 40" },
      { file: "05-frame41.jpg", frame: "Frame 41" },
      { file: "06-frame42.jpg", frame: "Frame 42" },
    ],
  },
];

const projectBody = (p) => `
<section class="banner" aria-label="${p.title}">
  <img src="assets/pages/${p.slug}/banner.${p.bannerExt || "jpg"}" data-frame="Banner（${p.title}）" alt="${p.title} — ${p.subtitle}" width="1440" height="556">
</section>

${skillsRow(p.skills)}

<main class="project-sections">
${p.sections
  .map(
    (s) =>
      `  <img class="section-img${s.full ? "" : " inset"}" src="assets/pages/${p.slug}/${s.file}" data-frame="${s.frame}" alt="" loading="lazy">\n  <div class="section-gap"></div>`
  )
  .join("\n")}
${p.tail || ""}
</main>`;

/* ------------------------------------------------------------------ */

const out = (name, html) => {
  fs.writeFileSync(path.join(__dirname, name), html);
  console.log("wrote", name);
};

out("index.html", shell({ title: "IT's LOFY DESIGN — 吳品潔設計作品集", body: homeBody }));
for (const p of PROJECTS) {
  fs.mkdirSync(path.join(__dirname, "assets", "pages", p.slug), { recursive: true });
  out(`${p.slug}.html`, shell({ title: `${p.title} — IT's LOFY DESIGN`, body: projectBody(p) }));
}
