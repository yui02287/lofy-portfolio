// Generates every page of the site from shared templates.
// Run:  node build.js
//
// Site map
//   index.html        首頁（About me + 兩個作品分類入口）
//   tech.html         資訊作品總頁
//   design.html       設計作品總頁（含 Behance 嵌入）
//   oright.html       資訊作品：歐萊德 AI 實習成果（由簡報改排）
//   uiux / vis / lamp / others / liuchongxi.html   設計作品（Figma 逐 Frame 匯出的圖）
const fs = require("fs");
const path = require("path");

const FONTS =
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?family=Anybody:wght@400;500;600&family=Inter:wght@400;500;700&family=Noto+Sans+TC:wght@400;500;700&display=swap" rel="stylesheet">';

const MAIL_SVG =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" fill="currentColor"/></svg>';
const PHONE_SVG =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z" fill="currentColor"/></svg>';

/* ------------------------------------------------------------------ */
/* Shared chrome                                                      */
/* ------------------------------------------------------------------ */

const header = (active) => `
<header class="site-header">
  <div class="container">
    <a class="brand" href="index.html" aria-label="IT's LOFY DESIGN 首頁">
      <span class="logo">IT<span class="tick">’</span>s LOFY DESIGN</span>
    </a>
    <nav class="site-nav" aria-label="主選單">
      <a href="index.html#about"${active === "about" ? ' class="is-active"' : ""}>ABOUT ME</a>
      <a href="tech.html"${active === "tech" ? ' class="is-active"' : ""}>資訊作品</a>
      <a href="design.html"${active === "design" ? ' class="is-active"' : ""}>設計作品</a>
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
      <li class="footer-head"><a href="tech.html">資訊作品</a></li>
      <li><a href="oright.html#w1">LINE OA 客服機器人</a></li>
      <li><a href="oright.html#w2">社群小編 AI Agent</a></li>
      <li><a href="oright.html#w3">考核 × 教育訓練機器人</a></li>
      <li><a href="oright.html#w4">新聞與競品快訊蒐集</a></li>
      <li><a href="tech.html">更多作品</a></li>
    </ul>
    <ul class="footer-col">
      <li class="footer-head"><a href="design.html">設計作品</a></li>
      <li><a href="vis.html">水牛安養中心 VIS 設計</a></li>
      <li><a href="lamp.html">仿生燈具設計</a></li>
      <li><a href="liuchongxi.html">六重溪部落 文創行銷</a></li>
      <li><a href="uiux.html">行動雲科 UX 改良提案</a></li>
      <li><a href="others.html">其他作品</a></li>
    </ul>
    <a class="footer-about" href="index.html#about"><img src="assets/icon-about.svg" alt="">ABOUT ME</a>
  </div>
</footer>`;

const SKILL_LABEL = {
  product: "產品設計 Product Design",
  service: "服務設計 Service Design",
  uiux: "UIUX設計 Ui Ux Design",
  visual: "視覺傳達 Visual Communication",
  brand: "品牌設計 Brand Design",
  plan: "企劃流程 Product Plan",
};

const skillsRow = (keys) =>
  `<section class="skills" aria-label="專長領域">${keys
    .map((k) => `<div class="skill skill--${k}" role="img" aria-label="${SKILL_LABEL[k]}"></div>`)
    .join("")}</section>`;

const shell = ({ title, body, active = "", description }) => `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description || "吳品潔 LOFY 的作品集：資訊作品（AI 應用、網站開發）與設計作品（品牌識別、產品設計、UI/UX）。"}">
${FONTS}
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="page">
${header(active)}
${body}
${footer}
</div>
<script>
// Scale the 1440px design to the viewport width on desktop so it fills the window.
(function () {
  var page = document.querySelector(".page");
  function fit() {
    var w = document.documentElement.clientWidth;
    page.style.zoom = w >= 1200 ? (w / 1440) : "";
  }
  fit();
  var t; window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(fit, 80); });
})();
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
/* Cards                                                              */
/* ------------------------------------------------------------------ */

const card = ({ href, title, sub, tags, cover, coverClass = "" }) => `
      <a class="card" href="${href}">
        <div class="card-cover ${coverClass}">${cover}</div>
        <h3>${title}</h3>
        <p class="sub">${sub}</p>
        <div class="card-tags">${tags.map((t) => `<span>${t}</span>`).join("")}</div>
        <div class="card-bar"></div>
      </a>`;

const mosaic = (imgs) =>
  `<div class="mosaic">${imgs.map((s) => `<img src="${s}" alt="">`).join("")}</div>`;

const DESIGN_CARDS = [
  {
    href: "vis.html",
    title: "水牛安養中心 - 視覺規劃改造計劃",
    sub: "企業品牌識別",
    tags: ["品牌識別", "在地文化"],
    cover: '<img class="bleed" src="assets/card-buffalo.png" alt="水牛安養中心 視覺規劃改造計劃">',
  },
  {
    href: "lamp.html",
    title: "化蛇 - 仿生燈具設計",
    sub: "產品設計成果報告",
    tags: ["產品", "仿生", "AI輔助設計", "造型表現"],
    cover:
      '<img class="lamp-bg" src="assets/card-lamp.png" alt="化蛇 仿生燈具">' +
      '<img class="lamp-title" src="assets/card-lamp-title.png" alt="化蛇">' +
      '<span class="lamp-sub">蛇型仿生露營燈</span>',
  },
  {
    href: "liuchongxi.html",
    title: "六重溪部落 - 文創行銷計畫",
    sub: "部落視覺規劃",
    tags: ["品牌識別", "在地文化"],
    cover: '<img src="assets/card-liuchongxi.png" alt="六重溪部落 Tribe of Liuchong Creek">',
  },
  {
    href: "uiux.html",
    title: "行動雲科 UX 改良提案",
    sub: "使用者體驗與介面改良",
    tags: ["APP", "UI/UX", "服務設計"],
    cover: '<img class="bleed" src="assets/card-uiux.png" alt="行動雲科 UX 改良提案 Creative Interface Design">',
  },
  {
    href: "others.html",
    title: "其他作品",
    sub: "平面設計 | 3D建模作品",
    tags: ["視覺傳達", "粉專經營", "工業設計", "模型展示"],
    cover:
      '<img src="assets/card-others.png" alt="其他作品">' +
      '<div class="view-more"><img src="assets/view-more.svg" alt="VIEW MORE"></div>',
  },
];

/* ------------------------------------------------------------------ */
/* Home                                                               */
/* ------------------------------------------------------------------ */

const homeBody = `
<section class="banner banner--home" aria-label="主視覺">
  <img src="assets/banner-home.png" alt="IT's LOFY DESIGN — 產品設計 | 視覺傳達 | 品牌設計 | 企劃流程" width="1440" height="669">
</section>

${skillsRow(["product", "visual", "brand", "plan"])}

<section class="about" id="about">
  <div class="about-intro">
    <div class="about-photo"><img src="assets/photo.png" alt="吳品潔 LOFY 個人照"></div>
    <div class="about-text">
      <div class="about-name">
        <span class="big">LOFY</span>
        <span class="zh"><b>吳品潔</b><i>PIN-CHIEH</i></span>
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
      <div class="band-row edu"><span class="lbl">國立雲林科技大學 資訊管理系</span><span class="meta">2021/9 - 2027/1</span></div>
      <div class="band-row edu"><span class="lbl">創意設計系（輔系）</span><span class="meta">GPA 3.76｜系排 7 / 72</span></div>

      <div class="band-block">
        <div class="band-title"><h3>實習經歷</h3><span>Professional Experience</span></div>
        <div class="band-job">
          <div class="band-row"><span class="lbl">歐萊德國際股份有限公司</span><span class="meta">品牌 AI 創新小組實習生 2026</span></div>
          <p>擔任 AI 小組組長，統籌官網重構並完成十項 AI 應用實作。</p>
        </div>
        <div class="band-job">
          <div class="band-row"><span class="lbl">創點子媒體行銷有限公司</span><span class="meta">社群經營及視覺設計實習助理 2025</span></div>
          <p>負責社群內容與視覺設計，兩個月內 IG 瀏覽數提升 328%。</p>
        </div>
        <div class="band-job">
          <div class="band-row"><span class="lbl">大樹國際文化企業股份有限公司</span><span class="meta">前端開發實習生 2023</span></div>
          <p>協助無 IT 部門的教育機構數位轉型，系統響應時間由 300ms 降至 100ms。</p>
        </div>
      </div>
    </div>

    <div class="band-col">
      <div class="band-title"><h3>語言能力</h3><span>Languages</span></div>
      <div class="band-row"><span class="lbl">中文</span><span class="meta">聽 / 說 / 讀 / 寫 精通</span></div>
      <div class="band-row"><span class="lbl">英文</span><span class="meta">TOEIC 720｜可閱讀專業文件與商務往來</span></div>

      <div class="band-block">
        <div class="band-title"><h3>關鍵技能</h3><span>Key Skills</span></div>
        <div class="skill-lists">
          <div>
            <h4>設計軟體</h4>
            <ul><li>Figma、Canva</li><li>Illustrator、Photoshop</li><li>InDesign、Premiere</li></ul>
          </div>
          <div>
            <h4>3D建模</h4>
            <ul><li>Blender</li><li>SketchUp</li><li>AutoCad(2D、3D)</li></ul>
          </div>
          <div>
            <h4>AI / 前端</h4>
            <ul><li>RAG、AI Agent</li><li>NotebookLM、Cursor</li><li>HTML、CSS、Vue.js</li></ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="portfolio" id="portfolio">
  <h2 class="portfolio-title"><span class="spark">✦</span>作品集 | PORTFOLIO</h2>
  <p class="portfolio-lead">作品分成兩類：以 AI 與網站開發為主的<b>資訊作品</b>，以及品牌、產品與介面的<b>設計作品</b>。</p>
  <div class="card-grid">
${card({
  href: "tech.html",
  title: "資訊作品 | INFORMATION",
  sub: "AI 應用開發 | 網站建置 | 系統規劃",
  tags: ["AI Agent", "LINE Bot", "官網重構", "資料庫"],
  coverClass: "is-mosaic",
  cover: mosaic([
    "assets/pages/oright/portal-projects.jpg",
    "assets/pages/oright/social-1.jpg",
    "assets/pages/oright/trainer-3.jpg",
    "assets/pages/oright/website.jpg",
  ]),
})}
${card({
  href: "design.html",
  title: "設計作品 | DESIGN",
  sub: "品牌識別 | 產品設計 | UI/UX | 視覺傳達",
  tags: ["品牌識別", "產品設計", "UI/UX", "視覺傳達"],
  coverClass: "is-mosaic",
  cover: mosaic([
    "assets/card-buffalo.png",
    "assets/card-lamp.png",
    "assets/card-liuchongxi.png",
    "assets/card-uiux.png",
  ]),
})}
  </div>
</section>`;

/* ------------------------------------------------------------------ */
/* Index pages                                                        */
/* ------------------------------------------------------------------ */

const indexHero = ({ eyebrow, title, lead }) => `
<section class="index-hero">
  <p class="eyebrow">${eyebrow}</p>
  <h1>${title}</h1>
  <p class="lead">${lead}</p>
</section>`;

const designBody = `
${indexHero({
  eyebrow: "DESIGN WORKS",
  title: "設計作品",
  lead: "品牌識別、產品造型、UI/UX 與視覺傳達。從田野調查到落地製作，用設計把想法變成看得見的東西。",
})}

${skillsRow(["visual", "brand", "product", "uiux"])}

<section class="behance" aria-label="Behance 作品集">
  <div class="behance-text">
    <p class="eyebrow">BEHANCE</p>
    <h2>PORTFOLIO 2025</h2>
    <p>網頁設計、平面設計與品牌設計的精選整理，完整版收錄在 Behance。</p>
    <a class="btn" href="https://www.behance.net/gallery/237745763/PORTFOLIO-2025" target="_blank" rel="noopener">前往 Behance 觀看 →</a>
  </div>
  <div class="behance-embed">
    <iframe src="https://www.behance.net/embed/project/237745763?ilo0=1" height="316" width="404" allowfullscreen loading="lazy" frameborder="0" allow="clipboard-write" referrerpolicy="strict-origin-when-cross-origin" title="Behance — PORTFOLIO 2025"></iframe>
  </div>
</section>

<section class="portfolio" id="portfolio">
  <h2 class="portfolio-title"><span class="spark">✦</span>專案 | PROJECTS</h2>
  <div class="card-grid">
${DESIGN_CARDS.map(card).join("\n")}
  </div>
</section>`;

// 資訊作品：目前只有歐萊德實習一個專案，底下再列出十項實作供直接跳轉
const ORIGHT_WORKS = [
  { id: "w1", n: "一", title: "LINE OA 客服機器人", img: "line-4", blurb: "RAG 檢索知識庫，下班時間也能由 AI 回覆客戶。" },
  { id: "w2", n: "二", title: "社群小編 AI Agent", img: "social-1", blurb: "串接 LINE 與 Meta 數據，自動讀成效、生成貼文。" },
  { id: "w3", n: "三", title: "考核 × 教育訓練機器人", img: "trainer-3", blurb: "考核機制、出題系統與後台管理一體的訓練平台。" },
  { id: "w4", n: "四", title: "新聞與競品快訊蒐集", img: "intel-1", blurb: "AI 排程蒐集競品動態，一鍵複製至群組。" },
  { id: "w5", n: "五", title: "圖片浮水印編輯器", img: "watermark-1", blurb: "一鍵生成品牌浮水印照片，提升製圖效率。" },
  { id: "w6", n: "六", title: "官網校稿平台", img: "proof-1", blurb: "文案審核流程平台化，減少 70% 來回溝通。" },
  { id: "w7", n: "七", title: "舊官網頁面更新", img: "oldsite-1", blurb: "AI 複製官網風格撰寫 HTML，縮短上架時間。" },
  { id: "w8", n: "八", title: "文宣編輯器", img: "dm-1", blurb: "業務自行生成客製化文宣，降低設計門檻。" },
  { id: "w9", n: "九", title: "產品短片製作", img: "video-1", blurb: "市場分析到影片生成的 AI 全流程。" },
  { id: "w10", n: "十", title: "DPP 產品數位護照", img: "dpp-3", blurb: "建立適合前端串接的產品資料庫，揭露永續資訊。" },
];

const techBody = `
${indexHero({
  eyebrow: "INFORMATION WORKS",
  title: "資訊作品",
  lead: "以 AI 應用開發、網站建置與系統規劃為主。重點不只是做得出來，而是做出能被長期使用與維護的工具。以下為在歐萊德實習期間完成的十項實作，完整成果與心得見 <a class=\"text-link\" href=\"oright.html\">歐萊德 AI 實習成果 →</a>",
})}

<section class="portfolio" id="portfolio">
  <div class="mini-grid">
${ORIGHT_WORKS.map(
  (w) => `    <a class="mini-card" href="oright.html#${w.id}">
      <img src="assets/pages/oright/${w.img}.jpg" alt="" loading="lazy">
      <div class="mini-body">
        <h4>${w.title}</h4>
        <p>${w.blurb}</p>
      </div>
    </a>`
).join("\n")}
  </div>
</section>`;

/* ------------------------------------------------------------------ */
/* 資訊作品：歐萊德 AI 實習成果（內容來自實習成果簡報）              */
/* ------------------------------------------------------------------ */

const shot = (name, cls = "") => `<img class="${cls}" src="assets/pages/oright/${name}.jpg" alt="" loading="lazy">`;

/* --- Justified image rows -----------------------------------------------
   Every image keeps its own aspect ratio (never cropped), every image in a
   row renders at the same height, and each row fills the content width
   exactly. Widths are computed here from the real JPEG dimensions and
   emitted as grid `fr` units, so the rows also scale down proportionally.  */

const jpegSize = (file) => {
  const b = fs.readFileSync(file);
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const marker = b[i + 1];
    if (marker >= 0xc0 && marker <= 0xc3) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error("no SOF marker in " + file);
};

const SIZE = {};
const sizeOf = (name) => {
  if (!SIZE[name]) SIZE[name] = jpegSize(path.join(__dirname, "assets", "pages", "oright", name + ".jpg"));
  return SIZE[name];
};
const aspectOf = (name) => { const { w, h } = sizeOf(name); return w / h; };

// Split into rows of nearly equal length (so no image is ever left alone in a
// row) and deal the images so the rows end up with similar total widths —
// wide and tall shots get mixed together instead of clumping.
const dealRows = (names, count) => {
  if (count < 2) return [names];
  const base = Math.floor(names.length / count);
  const extra = names.length % count;
  const rows = Array.from({ length: count }, (_, r) => ({ cap: base + (r < extra ? 1 : 0), sum: 0, items: [] }));
  for (const n of [...names].sort((a, b) => aspectOf(b) - aspectOf(a))) {
    const row = rows.filter((r) => r.items.length < r.cap).sort((a, b) => a.sum - b.sum)[0];
    row.items.push(n);
    row.sum += aspectOf(n);
  }
  return rows.map((r) => r.items);
};

// width = usable content width, minHeight/maxHeight = how tall a row may render
const gallery = (names, { width = 1200, minHeight = 280, maxHeight = 460, gap = 16 } = {}) => {
  const height = (r) => (width - (r.length - 1) * gap) / r.reduce((s, n) => s + aspectOf(n), 0);

  // Use as few rows as possible — ideally one — without any row getting so
  // short that the screenshots become unreadable.
  let rows = [names];
  for (let count = 1; count <= names.length; count++) {
    rows = dealRows(names, count);
    if (rows.every((r) => height(r) >= minHeight)) break;
  }

  return `<div class="gallery">${rows
    .map((r) => {
      const h = height(r);
      // a row that would be taller than maxHeight is narrowed instead of stretched
      const cap = h > maxHeight ? ` --rw: ${Math.round(r.reduce((s, n) => s + aspectOf(n), 0) * maxHeight + (r.length - 1) * gap)}px;` : "";
      const cols = r.map((n) => aspectOf(n).toFixed(4) + "fr").join(" ");
      return `<div class="gal-row" style="--cols: ${cols};${cap}">${r
        .map((n) => { const { w, h } = sizeOf(n); return `<img src="assets/pages/oright/${n}.jpg" width="${w}" height="${h}" alt="" loading="lazy">`; })
        .join("")}</div>`;
    })
    .join("")}</div>`;
};
const check = (items) => `<ul class="check">${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
const secHead = (title, en) => `<div class="sec-head"><h2>${title}</h2>${en ? `<span>${en}</span>` : ""}<i></i></div>`;

const RES = { width: 570, minHeight: 240, maxHeight: 360 };

const work = ({ id, n, title, desc, checks, shots, layout = "" }) => `
  <article class="work ${layout}" id="${id}">
    <div class="work-text">
      <h3><span class="work-n">${n}</span>${title}</h3>
      <p>${desc}</p>
      ${checks ? check(checks) : ""}
    </div>
    <div class="shots">${shots}</div>
  </article>`;

const orightBody = `
<section class="pbanner" aria-label="歐萊德 AI 實習成果">
  <div class="pbanner-text">
    <p class="eyebrow">O’RIGHT × AI INNOVATION TEAM</p>
    <h1>歐萊德 AI 實習成果</h1>
    <p class="pbanner-sub">品牌溝通中心 品牌 AI 創新小組 ｜ 實習生 ｜ 2026/01 –</p>
    <div class="card-tags"><span>LINE 客服機器人</span><span>社群小編 AI Agent</span><span>教育訓練機器人</span><span>官網重構</span><span>文宣編輯器</span></div>
  </div>
  <div class="pbanner-art">
    ${shot("social-4", "art-1")}
    ${shot("portal-projects", "art-2")}
    ${shot("trainer-3", "art-3")}
  </div>
</section>

<main class="project-body">

  ${secHead("基本資料", "PROFILE")}
  <dl class="info-list">
    <div><dt>任職單位</dt><dd>品牌溝通中心 品牌 AI 創新小組</dd></div>
    <div><dt>職稱</dt><dd>實習生</dd></div>
    <div><dt>姓名</dt><dd>吳品潔</dd></div>
    <div><dt>到職日期</dt><dd>2026/01/26</dd></div>
    <div><dt>直屬主管</dt><dd>蔡怡穎 總經理</dd></div>
  </dl>

  ${secHead("工作成效", "RESULTS")}
  <div class="result-grid">
    <article class="result">
      <div class="result-imgs">${gallery(["portal-projects","portal-weekly"], RES)}</div>
      <h3>一、AI 小組組長</h3>
      <p>作為 AI 小組組長，帶領新人熟悉環境，並主動開發平台，<span class="hl">管理並監督組內專案</span>。</p>
    </article>
    <article class="result">
      <div class="result-imgs">${gallery(["award-envelope","award-notice"], RES)}</div>
      <h3>二、AI 競賽</h3>
      <p>小組參與 <span class="hl">AI 應用實踐發表會</span> 獲得 <span class="hl">特別獎</span>，並以個人名義再獲 <span class="hl">嘉獎</span>。</p>
    </article>
    <article class="result">
      <div class="result-imgs">${gallery(["website"], RES)}</div>
      <h3>三、官網重構統籌</h3>
      <p>作為 PM 主導官網全面重構，整合 AI 工具完成資訊架構、版面規劃、內容整理與 <span class="hl">GEO 優化</span>，將品牌綠皮書與既有官網資訊化繁為簡。透過 <span class="hl">AI 視覺化</span> 呈現網站架構，有效提升跨部門溝通與審核效率。</p>
    </article>
    <article class="result">
      <div class="result-imgs">${gallery(["talk"], RES)}</div>
      <h3>四、AI 分享會講者</h3>
      <p>主動發起 AI 分享會，<span class="hl">分享跨部門 AI 導入實作</span>。活動吸引近百位同仁參與，董事長、總經理及多位主管皆親自出席。</p>
    </article>
  </div>

  ${secHead("AI 應用實作", "AI PROJECTS")}
${work({
  id: "w1", n: "一", title: "LINE OA 客服機器人",
  desc: '規劃並製作 LINE AI 客服，使用 <span class="hl">RAG 檢索技術</span> 從知識庫取用資料並回覆給客戶，真人客服即使下班也能以 AI 進行回覆。',
  checks: ["圖片、語音辨識", "多語言回覆", "提問建議、回覆品質", "批量訊息接收"],
  shots: gallery(["line-1","line-3","line-4","line-6","line-2","line-5"]),
})}
${work({
  id: "w2", n: "二", title: "社群小編 AI Agent",
  desc: '整合 AI Agent、LINE 與 Meta System User Token，讓代理人自動讀取 <span class="hl">貼文成效</span> 與 <span class="hl">廣告花費</span>，並依據數據 <span class="hl">快速生成合適的社群內容</span>。',
  checks: ["貼文推薦", "貼文成效檢視", "廣告成效檢視"],
  shots: gallery(["social-1","social-2","social-3","social-4"]),
})}
${work({
  id: "w3", n: "三", title: "考核 × 教育訓練機器人",
  desc: '設計教育訓練機器人平台，具備 <span class="hl">完整的考核機制、出題系統</span> 與 <span class="hl">後台管理功能</span>。管理者可直接於後台對話窗匯入資料，由 AI 協助修訂並更新至知識庫。目前此平台亦作為 <span class="hl">業務人員指定考核平台</span>。',
  shots: gallery(["trainer-1","trainer-2","trainer-3"]),
})}
${work({
  id: "w4", n: "四", title: "新聞與競品快訊蒐集",
  desc: '建立 <span class="hl">AI 排程</span> 尋找競品快訊，並加入 <span class="hl">公司部門資料</span> 和 <span class="hl">公司的營運方向</span>，讓 AI 生成參考建議。每日只需點開網站就能一鍵複製至群組。',
  shots: gallery(["intel-1","intel-2"]),
})}
${work({
  id: "w5", n: "五", title: "圖片浮水印編輯器",
  desc: '一鍵生成具品牌浮水印的照片，<span class="hl">大幅增加製圖效率</span>。',
  shots: gallery(["watermark-1","watermark-2"]),
})}
${work({
  id: "w6", n: "六", title: "官網校稿平台",
  desc: '將分散於 LINE 群組的文案審核流程整合至平台，<span class="hl">審核進度透明可追蹤</span>，行動版介面友善，方便主管查看，<span class="hl">減少至少 70% 來回溝通時間</span>。',
  shots: gallery(["proof-1"]),
})}
${work({
  id: "w7", n: "七", title: "舊官網頁面更新",
  desc: '運用 AI <span class="hl">複製原官網設計風格並撰寫 HTML</span>，資通部門僅需簡單語法轉換即可上架，大幅縮短更新所需時間與人力。',
  shots: gallery(["oldsite-1"]),
})}
${work({
  id: "w8", n: "八", title: "文宣編輯器",
  desc: '運用 AI 開發文宣編輯器並部署至 GitHub，業務人員僅需幾個步驟即可 <span class="hl">自行生成客製化文宣</span>，有效降低設計門檻與製作成本。',
  shots: gallery(["dm-1"]),
})}
${work({
  id: "w9", n: "九", title: "產品短片製作",
  desc: '完整執行 <span class="hl">市場分析、腳本生成、圖片生成到影片生成</span> 的全流程，運用 AI 工具產出產品社群短影片，協助品牌內容於社群平台擴散。',
  shots: gallery(["video-1","video-2"]),
})}
${work({
  id: "w10", n: "十", title: "DPP 產品數位護照",
  desc: '運用 AI 依照欄位需求整理各項產品資料，建立 <span class="hl">適合前端串接</span> 與 <span class="hl">資料填寫</span> 的產品資料庫。透過完整揭露產品成分、認證與相關資訊，<span class="hl">提升永續資訊透明度</span>，同時符合歐洲市場對產品資訊揭露的要求。',
  shots: gallery(["dpp-1","dpp-2","dpp-3"]),
})}

  ${secHead("實習心得", "REFLECTION")}
  <div class="reflect">
    <article>
      <h3>任職期間印象深刻的事情及收穫</h3>
      <p>剛好在公司 AI 初期導入階段加入，讓我有機會從零參與許多嘗試。實習期間，我參與 <span class="hl">AI 讀書會、分享會</span> 與 <span class="hl">公司競賽並獲獎</span>，也多次與不同部門主管交流成果，累積跨部門合作經驗。</p>
      <p>這段經歷讓我體會到，AI 工具不只要做得出來，更要能被 <span class="hl">長期使用與維護</span>。清楚的規格、後台設計與持續優化，都能避免 AI 產出「看似可用、實際難維運」的成果。我認為，一個工具只要有人願意持續使用，就是成功。而 AI 專案能否真正落地，除了技術能力，也高度仰賴權限、資料、跨部門協作，以及 API 與工具資源的支持。</p>
    </article>
    <article>
      <h3>自我期許及未來職涯規劃</h3>
      <p>我希望自己成為一位 <span class="hl">具備多元能力</span> 的通才，讓想法不只停留在想像，而是有能力真正實現。目前已累積 <span class="hl">資訊</span> 與 <span class="hl">設計</span> 相關能力，接下來希望持續往 <span class="hl">永續領域</span> 深耕，讓未來的設計與專業，都能為環境與社會帶來更好的影響。</p>
      <p>未來也會持續考取 <span class="hl">永續相關證照</span>，逐步建立更完整的專業基礎，並以進入 <span class="hl">永續相關研究所</span> 為目標，希望未來的研究與實務成果，都能成為推動世界變得更好的一份力量。</p>
    </article>
  </div>

  ${secHead("實習照片紀錄", "MOMENTS")}
  <p class="photos-lead">實習期間參與特賣會、春酒、董事長吃冰企劃等活動，也作為 AI 講師，為同事分享好用 AI 工具。</p>
  ${gallery(["photo-group","photo-dog","talk","photo-selfie","photo-meal"], { minHeight: 260, maxHeight: 340 })}

</main>`;

/* ------------------------------------------------------------------ */
/* 設計作品頁（Figma 逐 Frame 匯出的圖）                               */
/* ------------------------------------------------------------------ */

// Each section = a Figma frame exported as JPG @2x into assets/pages/<slug>/.
// `full` = frame spans the whole 1440px width (no side inset).
const PROJECTS = [
  {
    slug: "uiux",
    title: "行動雲科 UX 改良提案",
    subtitle: "使用者體驗與介面改良",
    skills: ["product", "uiux", "visual"],
    sections: [
      { file: "01-frame39.jpg", frame: "Frame 39（專案背景與目標）" },
      { file: "02-frame41.jpg", frame: "Frame 41（事前調查）" },
      { file: "03-frame42.jpg", frame: "Frame 42（功能改良選擇）" },
      { file: "04-frame40.jpg", frame: "Frame 40（緊急求助改良）", full: true },
      { file: "05-frame43.jpg", frame: "Frame 43（成績查詢改良）" },
      { file: "06-frame44.jpg", frame: "Frame 44（測試結果）" },
      { file: "07-frame54.jpg", frame: "Frame 54（Thank for Watching）", full: true },
    ],
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
  <img src="assets/pages/${p.slug}/banner.jpg" data-frame="Banner（${p.title}）" alt="${p.title} — ${p.subtitle}" width="1440" height="556">
</section>

${skillsRow(p.skills)}

<main class="project-sections">
${p.sections
  .map(
    (s) =>
      `  <img class="section-img${s.full ? "" : " inset"}" src="assets/pages/${p.slug}/${s.file}" data-frame="${s.frame}" alt="" loading="lazy">\n  <div class="section-gap"></div>`
  )
  .join("\n")}
</main>
<nav class="back-nav"><a href="design.html">← 回設計作品總頁</a></nav>`;

/* ------------------------------------------------------------------ */

const out = (name, html) => {
  fs.writeFileSync(path.join(__dirname, name), html);
  console.log("wrote", name);
};

out("index.html", shell({ title: "IT's LOFY DESIGN — 吳品潔作品集", body: homeBody, active: "about" }));
out("design.html", shell({ title: "設計作品 — IT's LOFY DESIGN", body: designBody, active: "design" }));
out("tech.html", shell({ title: "資訊作品 — IT's LOFY DESIGN", body: techBody, active: "tech" }));
out("oright.html", shell({ title: "歐萊德 AI 實習成果 — IT's LOFY DESIGN", body: orightBody + '\n<nav class="back-nav"><a href="tech.html">← 回資訊作品總頁</a></nav>', active: "tech" }));
for (const p of PROJECTS) {
  fs.mkdirSync(path.join(__dirname, "assets", "pages", p.slug), { recursive: true });
  out(`${p.slug}.html`, shell({ title: `${p.title} — IT's LOFY DESIGN`, body: projectBody(p), active: "design" }));
}
