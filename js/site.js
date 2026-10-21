// STRATA — site behaviour: header state, scroll progress, layer-by-layer reveals,
// back-to-top, soft page transitions. Everything degrades to a static page
// without JS, and motion is skipped when the visitor prefers reduced motion.
(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Section images that have not been exported from Figma yet fall back to a labelled placeholder. */
  function missing(img) {
    var box = document.createElement("div");
    box.className = "section-missing";
    box.innerHTML = "此區塊圖片尚未匯出<br>請在 Figma 匯出畫框 <b>" + img.dataset.frame + "</b>（JPG 2x），存成 <b>" + img.getAttribute("src") + "</b>";
    img.replaceWith(box);
  }
  document.querySelectorAll("img[data-frame]").forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) missing(img);
    else img.addEventListener("error", function () { missing(img); });
  });

  /* Header: tint once scrolled, tuck away while reading down, return on scroll up. */
  var header = document.querySelector(".site-header");
  var bar = document.createElement("span");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  if (header) header.appendChild(bar);

  var top = document.createElement("button");
  top.type = "button";
  top.className = "to-top";
  top.setAttribute("aria-label", "回到頂端");
  top.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });
  document.body.appendChild(top);

  var lastY = window.scrollY, ticking = false;
  function onScroll() {
    var y = window.scrollY;
    var max = doc.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    if (header) {
      header.classList.toggle("is-scrolled", y > 8);
      if (y > 240 && y > lastY + 4) header.classList.add("is-tucked");
      else if (y < lastY - 4 || y <= 240) header.classList.remove("is-tucked");
    }
    top.classList.toggle("is-on", y > window.innerHeight * 0.9);
    lastY = y;
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
  // keyboard users tabbing into the header always get it back
  if (header) header.addEventListener("focusin", function () { header.classList.remove("is-tucked"); });

  /* Layer-by-layer reveal: siblings come in one after another. */
  var GROUPS = [
    ".index-hero > *",
    ".skills .skill", ".about-photo", ".about-text", ".band-col",
    ".portfolio-title", ".portfolio-lead", ".card-grid > .card",
    ".behance", ".mini-grid > .mini-card",
    ".sec-head", ".info-list > div", ".result", ".work-text", ".shots .gal-row",
    ".result-imgs .gal-row", ".reflect article", ".photos-lead", ".project-body > .gallery .gal-row",
    ".section-img", ".section-missing", ".back-nav"
  ];
  var targets = [];
  GROUPS.forEach(function (sel) {
    var seen = new Map();
    document.querySelectorAll(sel).forEach(function (el) {
      if (el.classList.contains("rv")) return;
      var p = el.parentElement, i = seen.get(p) || 0;
      seen.set(p, i + 1);
      el.style.setProperty("--i", Math.min(i, 5));
      el.classList.add("rv");
      targets.push(el);
    });
  });

  // Hold the reveals until the web fonts are in, so nothing animates in a fallback face.
  function start() {
    if (reduce || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });
      targets.forEach(function (el) { io.observe(el); });
    }
    doc.classList.remove("fonts-wait");
    doc.classList.add("is-ready");
  }
  var started = false;
  function go() { if (!started) { started = true; start(); } }
  if (document.fonts && document.fonts.ready) {
    void document.body.offsetHeight; // lay out once so the page's fonts start loading
    document.fonts.ready.then(go);
    setTimeout(go, 1500); // never wait longer than this on a slow connection
  } else go();

  /* Soft fade between pages of this site. */
  if (!reduce) {
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target && a.target !== "_self") return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
      var norm = function (p) { return p.replace(/\/$/, "/index.html"); };
      if (norm(url.pathname) === norm(location.pathname)) return; // same-page anchors scroll natively
      e.preventDefault();
      doc.classList.add("is-leaving");
      setTimeout(function () { location.href = a.href; }, 220);
    });
    window.addEventListener("pageshow", function (e) { if (e.persisted) doc.classList.remove("is-leaving"); });
  }
})();
