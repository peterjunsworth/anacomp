/* Anacomp — Information Lifecycle site */
(() => {
  "use strict";

  /* Stage tabs/panels, packages, quotes and pricing are pre-rendered into index.html
     by build/build.mjs (content lives in build/content.mjs). This file only adds behaviour. */
  const $ = (s, el = document) => el.querySelector(s);
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollBehavior = () => (reduceMotion() ? "auto" : "smooth");

  /* ---------------- Pipeline tabs ---------------- */
  const tabsEl = $("#stageTabs");
  const panelsEl = $(".stage-panels");
  const panels = [...document.querySelectorAll(".stage-panel")];
  const isStage = id => panels.some(p => p.id === `stage-${id}`);

  const tabs = [...tabsEl.querySelectorAll(".stage-tab")];
  // Tabs stack vertically on wide screens and scroll horizontally on narrow ones
  const orientMq = window.matchMedia("(max-width: 1080px)");
  const setOrientation = () => tabsEl.setAttribute("aria-orientation", orientMq.matches ? "horizontal" : "vertical");
  setOrientation();
  orientMq.addEventListener("change", setOrientation);

  function selectStage(id, focus = false) {
    tabs.forEach(t => {
      const on = t.dataset.id === id;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
      if (on && window.matchMedia("(max-width: 1080px)").matches) {
        t.scrollIntoView({ block: "nearest", inline: "center", behavior: scrollBehavior() });
      }
    });
    panels.forEach(p => { p.hidden = p.id !== `stage-${id}`; });
  }

  tabsEl.addEventListener("click", e => {
    const t = e.target.closest(".stage-tab");
    if (t) selectStage(t.dataset.id);
  });
  tabsEl.addEventListener("keydown", e => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let n = null;
    if (["ArrowDown", "ArrowRight"].includes(e.key)) n = (i + 1) % tabs.length;
    if (["ArrowUp", "ArrowLeft"].includes(e.key)) n = (i - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = tabs.length - 1;
    if (n !== null) { e.preventDefault(); selectStage(tabs[n].dataset.id, true); }
  });
  panelsEl.addEventListener("click", e => {
    const c = e.target.closest(".lead-chip");
    if (!c) return;
    selectStage(c.dataset.go, true);
    if (window.matchMedia("(max-width: 1080px)").matches) {
      tabsEl.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    }
  });

  /* ---------------- Deep links: #stage-redact etc. ---------------- */
  function openStageFromHash() {
    const m = location.hash.match(/^#stage-(\w+)/);
    if (!m || !isStage(m[1])) return;
    // Move focus to the stage's tab so keyboard users land where the link pointed
    selectStage(m[1], true);
    const target = $("#pipeline .stages");
    requestAnimationFrame(() => window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 110, behavior: scrollBehavior() }));
  }
  window.addEventListener("hashchange", openStageFromHash);
  openStageFromHash();

  /* ---------------- Chapter rail (section navigation) ---------------- */
  const CHAPTERS = [
    ["top", "Intro"], ["challenge", "The problem"], ["pipeline", "The pipeline"], ["journey", "A request, end to end"],
    ["buy", "Ways to buy"], ["packages", "Packages"], ["start", "Where to start"], ["pricing", "Pricing"],
    ["why", "Why Anacomp"], ["pilot", "30-day pilot"]
  ].map(([id, label], i) => ({ id, label, num: String(i + 1).padStart(2, "0"), el: document.getElementById(id) }));

  const rail = document.createElement("nav");
  rail.className = "chapters";
  rail.setAttribute("aria-label", "Sections on this page");
  rail.innerHTML = `
    <div class="chapters__track" aria-hidden="true"><div class="chapters__fill"></div></div>
    <ol>${CHAPTERS.map(c => `
      <li><a href="#${c.id}" data-id="${c.id}"><span class="chapters__dot"></span><span class="chapters__label"><em>${c.num}</em> ${c.label}</span></a></li>`).join("")}
    </ol>`;
  document.body.appendChild(rail);

  // Mobile: a pill showing the current chapter that opens a sheet
  const pill = document.createElement("div");
  pill.className = "chapter-pill";
  pill.innerHTML = `
    <button class="chapter-pill__btn" aria-expanded="false" aria-controls="chapterSheet">
      <span class="chapter-pill__ring"><svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15"/><circle cx="18" cy="18" r="15" class="chapter-pill__prog"/></svg><b>01</b></span>
      <span class="chapter-pill__text">Intro</span>
      <svg class="chapter-pill__chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 7.5l3-3 3 3"/></svg>
    </button>
    <ol class="chapter-pill__sheet" id="chapterSheet" hidden>${CHAPTERS.map(c => `<li><a href="#${c.id}" data-id="${c.id}"><em>${c.num}</em>${c.label}</a></li>`).join("")}</ol>`;
  document.body.appendChild(pill);
  const pillBtn = pill.querySelector(".chapter-pill__btn");
  const sheet = pill.querySelector(".chapter-pill__sheet");
  const setSheet = open => { pillBtn.setAttribute("aria-expanded", open); sheet.hidden = !open; pill.classList.toggle("open", open); };
  pillBtn.addEventListener("click", () => setSheet(sheet.hidden));
  sheet.addEventListener("click", e => { if (e.target.closest("a")) setSheet(false); });
  document.addEventListener("click", e => { if (!pill.contains(e.target)) setSheet(false); });
  // Keyboard: Escape closes the sheet (focus back on the button); tabbing out of it closes it too
  pill.addEventListener("keydown", e => {
    if (e.key === "Escape" && !sheet.hidden) { setSheet(false); pillBtn.focus(); }
  });
  pill.addEventListener("focusout", e => { if (e.relatedTarget && !pill.contains(e.relatedTarget)) setSheet(false); });
  // WCAG 1.4.13: chapter labels that pop up on hover/focus can be dismissed with Escape
  document.addEventListener("keydown", e => { if (e.key === "Escape") rail.classList.add("labels-dismissed"); });
  rail.addEventListener("mouseleave", () => rail.classList.remove("labels-dismissed"));
  rail.addEventListener("focusout", e => { if (!rail.contains(e.relatedTarget)) rail.classList.remove("labels-dismissed"); });

  const railLinks = [...rail.querySelectorAll("a"), ...sheet.querySelectorAll("a")];
  const railFill = rail.querySelector(".chapters__fill");
  const pillNum = pill.querySelector("b");
  const pillText = pill.querySelector(".chapter-pill__text");
  const pillProg = pill.querySelector(".chapter-pill__prog");
  let currentId = null;

  function updateChapters() {
    const vh = window.innerHeight;
    let idx = 0;
    CHAPTERS.forEach((c, i) => { if (c.el && c.el.getBoundingClientRect().top < vh * 0.45) idx = i; });
    const doc = document.documentElement;
    const progress = Math.min(1, window.scrollY / Math.max(1, doc.scrollHeight - vh));
    railFill.style.height = (idx / (CHAPTERS.length - 1)) * 100 + "%";
    pillProg.style.strokeDashoffset = 94.25 * (1 - progress);
    const c = CHAPTERS[idx];
    if (c.id !== currentId) {
      currentId = c.id;
      railLinks.forEach(a => a.classList.toggle("is-active", a.dataset.id === c.id));
      pillNum.textContent = c.num;
      pillText.textContent = c.label;
      rail.classList.toggle("on-dark", !!c.el && c.el.classList.contains("dark"));
    }
    // reveal rail/pill after leaving the hero
    const show = window.scrollY > vh * 0.5;
    rail.classList.toggle("show", show);
    pill.classList.toggle("show", show);
  }

  /* ---------------- Journey timeline fill ---------------- */
  const timeline = $("#timeline");
  const fill = $("#timelineFill");
  const steps = [...document.querySelectorAll(".step")];
  function updateTimeline() {
    const r = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.6)));
    fill.style.width = (p * 100) + "%";
    steps.forEach((s, i) => s.classList.toggle("lit", p > 0 && p >= (i / (steps.length - 1)) * 0.98));
  }

  const onScroll = () => { updateTimeline(); updateChapters(); };
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(() => { onScroll(); ticking = false; }); ticking = true; }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
