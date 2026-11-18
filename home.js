/* Anacomp — Information Lifecycle site */
(() => {
  "use strict";

  /* ---------------- Content (from the offering deck) ---------------- */
  const STAGES = [
    {
      id: "discover", num: "01", name: "Discover", kicker: "Stage 1 · Discover",
      title: "Know what you hold before you move it",
      desc: "Congruity360 runs a shallow scan across file systems and cloud file repositories and returns the facts a records owner needs first.",
      receive: ["File counts, sizes and types by location", "Duplicates identified for de-duplication", "A sized scope for any redaction or remediation that follows"],
      powered: "Congruity360",
      alone: "You’re planning a cloud migration, a storage clean-up or an AI rollout and need an inventory first.",
      leads: ["redact", "remediate"],
      leadsWhy: "Redact for sensitive files; Remediate for public-facing ones."
    },
    {
      id: "digitize", num: "02", name: "Digitize", kicker: "Stage 2 · Digitize",
      title: "Bring paper into the digital flow",
      desc: "Anacomp scanning services ingest paper documents and deliver indexed images that every later stage can work on.",
      receive: ["Paper scanned and indexed to your scheme", "Digital files delivered to your repository or straight into the pipeline", "One digital starting point for redaction, accessibility and release"],
      powered: "Anacomp scanning services",
      alone: "You have a paper backlog, a file-room closure or an electronic-records mandate to meet.",
      leads: ["remediate", "redact"],
      leadsWhy: "Remediate, so scans become accessible data; Redact before anything is released."
    },
    {
      id: "redact", num: "03", name: "Redact", kicker: "Stage 3 · Redact",
      title: "Remove what must not be released",
      desc: "Anacomp redaction services remove PII and sensitive information from unstructured data, run as workflows on Hyperscience.",
      receive: ["PII and sensitive content removed to your rules", "Redacted copies ready to release or share", "One process for scanned paper and born-digital files"],
      powered: "Hyperscience workflows, operated by Anacomp",
      alone: "You face a records-request backlog, a litigation production or a data-sharing agreement.",
      leads: ["release", "remediate"],
      leadsWhy: "Release through the portal; Remediate so the redacted copy is also accessible."
    },
    {
      id: "remediate", num: "04", name: "Remediate", kicker: "Stage 4 · Remediate",
      title: "Turn any document into accessible data",
      desc: "ADA takes PDFs, Excel, PowerPoint, Word and image files, transcribes them, saves the content as data and republishes it in accessible form.",
      receive: ["Accessible HTML for the web", "Accessibly tagged documents for download", "Content captured as data, ready for search and reuse"],
      powered: "Anacomp ADA",
      alone: "You have an accessibility audit, complaint or mandate and a library of untagged documents.",
      leads: ["release", "digitize"],
      leadsWhy: "Release, to deliver accessible copies; Digitize, for paper still outside the library.",
      addon: {
        name: "Ask the Document",
        powered: "Botcopy",
        text: "Put an accessible assistant beside the HTML that ADA produces, on your own site or portal. Residents ask questions in plain language and get answers drawn from the document, in 190+ languages, with ID.me sign-in where needed."
      }
    },
    {
      id: "release", num: "05", name: "Release", kicker: "Stage 5 · Release",
      title: "Give the public a verified front door",
      desc: "The Anacomp portal lets members of the public, authenticated through ID.me, request documents that pass through the other stages before release.",
      receive: ["Identity-verified document requests from the public", "Agency tools for requests, processing and client management", "A release step that can route through Digitize, Redact and Remediate first"],
      powered: "Anacomp portal with ID.me sign-in",
      alone: "You need a request portal now and already have your own redaction or accessibility process.",
      leads: ["digitize", "redact", "remediate"],
      leadsWhy: "Every other stage: each request the portal takes in is work for them."
    },
    {
      id: "analyze", num: "∞", name: "Analyze", kicker: "Across every stage · Analyze",
      title: "Ask your records program anything",
      desc: "Insignal builds a data warehouse from what the other stages produce and lets staff ask questions in plain English, then turn the answers into dashboards and alerts.",
      receive: ["Estate dashboards from Discover scans: growth, duplicates, risk", "Operations dashboards: request volumes, turnaround, backlog", "Questions answered in plain English, in the browser or in Teams and Slack"],
      powered: "Insignal, self-hosted in your own cloud",
      alone: "Leaders need to report on records work, or want answers from data that ADA has extracted.",
      leads: ["discover", "release"],
      leadsWhy: "Discover, to feed it the estate; Release, to measure every request."
    }
  ];
  const byId = Object.fromEntries(STAGES.map(s => [s.id, s]));
  const ORDER = ["discover", "digitize", "redact", "remediate", "release", "analyze"];

  const PACKAGES = [
    { name: "Estate Assessment", stages: ["discover"], trigger: "Pre-migration or storage clean-up" },
    { name: "Records Insight", stages: ["discover", "analyze"], trigger: "Leaders need ongoing estate reporting" },
    { name: "Safe Share", stages: ["discover", "redact"], trigger: "Removing PII before sharing or AI use" },
    { name: "Paper to Accessible", stages: ["digitize", "remediate"], trigger: "File-room closure with an accessibility duty" },
    { name: "Request Response", stages: ["redact", "release", "analyze"], trigger: "A records-request backlog to clear and report on" },
    { name: "Accessible Release", stages: ["remediate", "release"], trigger: "Requests delivered in accessible form" },
    { name: "Accessible Answers", stages: ["remediate", "release"], addon: true, trigger: "Residents need answers from long documents, not just access" },
    { name: "Full Lifecycle", stages: ORDER, trigger: "One vendor from paper intake to public release", featured: true }
  ];

  const QUOTES = [
    { q: "We’re moving to the cloud and don’t know what we have.", start: "Discover", then: "Redact, Remediate" },
    { q: "We have to close the file room.", start: "Digitize", then: "Remediate, Release" },
    { q: "We can’t keep up with records requests.", start: "Redact + Release", then: "Discover, Digitize" },
    { q: "We were told our documents aren’t accessible.", start: "Remediate", then: "Digitize, Release" },
    { q: "People need a secure way to ask for their records.", start: "Release", then: "Redact, Remediate" },
    { q: "We can’t tell leadership where our backlog stands.", start: "Analyze", then: "Discover, Release" }
  ];

  const PRICING = [
    { stage: "Discover", unit: "Per terabyte scanned", shape: "Fixed-fee assessment" },
    { stage: "Digitize", unit: "Per image, by document type", shape: "Backlog project or day-forward service" },
    { stage: "Redact", unit: "Per page, by review depth", shape: "Backlog project or per-request service" },
    { stage: "Remediate", unit: "Per page, by complexity", shape: "Backlog project, then subscription" },
    { stage: "Release", unit: "Annual fee plus request tiers", shape: "Subscription per agency" },
    { stage: "Analyze", unit: "Per seat, self-hosted licence", shape: "Annual subscription" },
    { stage: "Ask the Document", unit: "Annual fee per site, plus conversation tiers", shape: "Add-on subscription to Remediate", addon: true },
    { stage: "Full pipeline", unit: "Annual fee plus page volume", shape: "Multi-year managed service", full: true }
  ];

  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------------- Pipeline tabs ---------------- */
  const tabsEl = $("#stageTabs");
  const panelEl = $("#stagePanel");

  tabsEl.innerHTML = STAGES.map(s => `
    <button class="stage-tab${s.id === "analyze" ? " stage-tab--analyze" : ""}" role="tab" id="tab-${s.id}"
      aria-controls="stagePanel" aria-selected="false" tabindex="-1" data-id="${s.id}">
      <span class="stage-tab__num">${s.num}</span>
      <span><span class="stage-tab__name">${s.name}</span><span class="stage-tab__by">${esc(s.powered)}</span></span>
    </button>`).join("");
  const tabs = [...tabsEl.querySelectorAll(".stage-tab")];

  function selectStage(id, focus = false) {
    const s = byId[id];
    tabs.forEach(t => {
      const on = t.dataset.id === id;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
      if (on && window.matchMedia("(max-width: 1080px)").matches) {
        t.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
      }
    });
    panelEl.setAttribute("aria-labelledby", `tab-${id}`);
    panelEl.dataset.num = s.num;
    panelEl.innerHTML = `
      <div class="stage-panel__inner">
        <p class="stage-panel__kicker">${s.kicker}</p>
        <h3>${esc(s.title)}</h3>
        <p class="stage-panel__desc">${esc(s.desc)}</p>
        <div class="stage-panel__cols">
          <div>
            <p class="stage-panel__label">What you receive</p>
            <ul class="receive">${s.receive.map(r => `<li>${esc(r)}</li>`).join("")}</ul>
          </div>
          <div class="facts">
            <div class="fact fact--powered"><p class="stage-panel__label">Powered by</p><p>${esc(s.powered)}</p></div>
            <div class="fact"><p class="stage-panel__label">Stands alone when</p><p>${esc(s.alone)}</p></div>
            <div class="fact"><p class="stage-panel__label">Leads to</p>
              <div class="leads">${s.leads.map(l => `<button class="lead-chip" data-go="${l}">${byId[l].name}</button>`).join("")}</div>
              <p class="leads__why">${esc(s.leadsWhy)}</p>
            </div>
          </div>
        </div>
        ${s.addon ? `
        <div class="stage-panel__addon">
          <p class="stage-panel__label">Optional add-on</p>
          <p class="stage-panel__addon-name"><strong>${esc(s.addon.name)}</strong> <span>Powered by ${esc(s.addon.powered)}</span></p>
          <p>${esc(s.addon.text)}</p>
        </div>` : ""}
      </div>`;
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
  panelEl.addEventListener("click", e => {
    const c = e.target.closest(".lead-chip");
    if (!c) return;
    selectStage(c.dataset.go, true);
    if (window.matchMedia("(max-width: 1080px)").matches) {
      tabsEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
  selectStage("discover");

  /* ---------------- Packages matrix ---------------- */
  $("#matrixBody").innerHTML = PACKAGES.map(p => `
    <tr${p.featured ? ' class="featured"' : ""}>
      <th scope="row">${p.name}${p.featured ? " <small>Complete</small>" : ""}</th>
      ${ORDER.map((id, i) => {
        const on = p.stages.includes(id);
        return `<td><span class="dot${on ? " dot--on" : ""}" style="transition-delay:${(i * 0.06).toFixed(2)}s"
          role="img" aria-label="${byId[id].name}: ${on ? "included" : "not included"}"></span></td>`;
      }).join("")}
      <td><span class="dot dot--addon${p.addon ? " dot--on" : ""}" style="transition-delay:${(ORDER.length * 0.06).toFixed(2)}s"
        role="img" aria-label="Ask the Document add-on: ${p.addon ? "included" : "not included"}"></span></td>
      <td>${p.trigger}</td>
    </tr>`).join("");

  /* ---------------- Quotes ---------------- */
  $("#quotes").innerHTML = QUOTES.map((q, i) => `
    <article class="quote reveal" style="--d:${(i % 3) * 0.08}s">
      <blockquote>${esc(q.q)}</blockquote>
      <dl class="quote__path">
        <div class="start"><dt>Start with</dt><dd>${q.start}</dd></div>
        <div><dt>Then expand</dt><dd>${q.then}</dd></div>
      </dl>
    </article>`).join("");

  /* ---------------- Pricing ---------------- */
  $("#pricingGrid").innerHTML = PRICING.map((p, i) => `
    <article class="price reveal${p.full ? " price--full" : ""}${p.addon ? " price--addon" : ""}" style="--d:${(i % 3) * 0.08}s">
      <p class="price__stage">${p.stage}</p>
      <p class="price__unit">${p.unit}</p>
      <p class="price__shape">${p.shape}</p>
    </article>`).join("");

  /* ---------------- Deep links: #stage-redact etc. ---------------- */
  function openStageFromHash() {
    const m = location.hash.match(/^#stage-(\w+)/);
    if (!m || !byId[m[1]]) return;
    selectStage(m[1]);
    const target = $("#pipeline .stages");
    requestAnimationFrame(() => window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 110, behavior: "smooth" }));
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
      <li><a href="#${c.id}" data-id="${c.id}"><span class="chapters__dot"></span><span class="chapters__label"><em>${c.num}</em>${c.label}</span></a></li>`).join("")}
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
