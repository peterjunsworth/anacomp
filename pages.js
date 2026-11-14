/* Anacomp — behaviour for inner pages (Clients, Team, News, Article, Contact) */
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Sticky sub-nav: highlight the section in view ---------- */
  const subLinks = $$(".subnav a[href^='#']");
  if (subLinks.length) {
    const targets = subLinks.map(a => $(a.getAttribute("href"))).filter(Boolean);
    const update = () => {
      let idx = 0;
      targets.forEach((t, i) => { if (t.getBoundingClientRect().top < 200) idx = i; });
      subLinks.forEach((a, i) => a.classList.toggle("is-active", i === idx));
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- Filter chips (case studies, news) ---------- */
  $$("[data-filter-group]").forEach(group => {
    const items = $$(group.dataset.filterGroup);
    group.addEventListener("click", e => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      $$(".chip", group).forEach(c => c.setAttribute("aria-pressed", c === chip));
      const f = chip.dataset.filter;
      items.forEach(it => { it.hidden = f !== "all" && !(it.dataset.tags || "").split(" ").includes(f); });
    });
  });

  /* ---------- Generated cover art for posts (brand shapes, deterministic) ---------- */
  const COLORS = ["#E2622B", "#F28C5A", "#B9C6D6", "#A63F16", "#35506F", "#F7F5F0"];
  function rand(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  $$(".post-art[data-art]").forEach((el, i) => {
    const seed = [...el.dataset.art].reduce((a, c) => a * 31 + c.charCodeAt(0), 7);
    const r = rand(seed);
    const style = el.dataset.artStyle ? +el.dataset.artStyle : (i + 1) % 3;
    let shapes = "";
    if (style === 0) { // pipeline nodes
      const n = 5, y = 50 + r() * 20;
      shapes += `<line x1="8" y1="${y}" x2="92" y2="${y}" stroke="#F28C5A" stroke-width="0.8"/>`;
      for (let i = 0; i < n; i++) {
        const x = 12 + i * 19;
        shapes += `<circle cx="${x}" cy="${y}" r="${4 + r() * 3}" fill="#1B3352" stroke="${COLORS[i % 3]}" stroke-width="0.8"/>`;
      }
      shapes += `<path d="M12 ${y + 22} H88" stroke="#B9C6D6" stroke-width="0.6" stroke-dasharray="1 2"/>`;
    } else if (style === 1) { // stacked documents
      for (let i = 0; i < 4; i++) {
        const x = 26 + i * 9, y = 18 + i * 7;
        shapes += `<rect x="${x}" y="${y}" width="34" height="44" rx="2" fill="${i === 3 ? "#F7F5F0" : "#1B3352"}" stroke="#B9C6D6" stroke-width="0.4"/>`;
      }
      for (let j = 0; j < 5; j++) shapes += `<rect x="58" y="${48 + j * 5}" width="${10 + r() * 16}" height="2" rx="1" fill="${j === 2 ? "#E2622B" : "#B9C6D6"}"/>`;
    } else { // orbit / analytics
      shapes += `<circle cx="50" cy="56" r="26" fill="none" stroke="#B9C6D6" stroke-width="0.4" stroke-dasharray="1 2"/>`;
      shapes += `<circle cx="50" cy="56" r="14" fill="none" stroke="#F28C5A" stroke-width="0.6"/>`;
      for (let i = 0; i < 6; i++) {
        const a = r() * Math.PI * 2, rr = i % 2 ? 26 : 14;
        shapes += `<circle cx="${50 + Math.cos(a) * rr}" cy="${56 + Math.sin(a) * rr}" r="${1.5 + r() * 2}" fill="${COLORS[i % 4]}"/>`;
      }
      shapes += `<circle cx="50" cy="56" r="4" fill="#E2622B"/>`;
    }
    el.insertAdjacentHTML("afterbegin", `
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs><radialGradient id="g${seed}" cx="${70 + r() * 30}%" cy="${r() * 30}%" r="70%"><stop offset="0" stop-color="#E2622B" stop-opacity=".55"/><stop offset="1" stop-color="#0F2238" stop-opacity="0"/></radialGradient>
        <pattern id="p${seed}" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M8 0H0V8" fill="none" stroke="#B9C6D6" stroke-opacity=".08" stroke-width=".3"/></pattern></defs>
        <rect width="100" height="100" fill="#0F2238"/><rect width="100" height="100" fill="url(#p${seed})"/><rect width="100" height="100" fill="url(#g${seed})"/>
        ${shapes}
      </svg>`);
  });

  /* ---------- Contact form ----------
     TODO: no form backend yet. On submit we validate, then open the visitor's
     email app with the message pre-filled to CONTACT_EMAIL. Swap this for a
     real endpoint (CRM, form service or API route) when one is available. */
  const CONTACT_EMAIL = "info@anacomp.com"; // TODO: replace with the real inbox
  const form = $("#contactForm");
  if (form) {
    const params = new URLSearchParams(location.search);
    const topic = params.get("topic");
    if (topic === "review") {
      form.querySelector("#t-general").checked = true;
      form.querySelector("#f-msg").value = "I'd like to share a review of working with Anacomp:\n\n";
    } else if (topic) { const r = form.querySelector(`input[name="topic"][value="${CSS.escape(topic)}"]`); if (r) r.checked = true; }

    const setErr = (field, msg) => {
      const wrap = field.closest(".field");
      wrap.classList.toggle("invalid", !!msg);
      const err = wrap.querySelector(".field__err");
      if (err) err.textContent = msg || "";
      field.setAttribute("aria-invalid", msg ? "true" : "false");
    };
    form.addEventListener("submit", e => {
      e.preventDefault();
      let first = null;
      $$("[required]", form).forEach(f => {
        let msg = "";
        if (!f.value.trim()) msg = "Please fill this in.";
        else if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) msg = "Please enter a valid email address.";
        setErr(f, msg);
        if (msg && !first) first = f;
      });
      if (first) { first.focus(); return; }

      const d = new FormData(form);
      const stages = d.getAll("stages").join(", ") || "Not sure yet";
      const topicLabel = form.querySelector('input[name="topic"]:checked')?.dataset.label || "General enquiry";
      const body = [
        `Name: ${d.get("name")}`, `Organization: ${d.get("org")}`, `Role: ${d.get("role") || "-"}`,
        `Email: ${d.get("email")}`, `Phone: ${d.get("phone") || "-"}`, `Stages of interest: ${stages}`, "", d.get("message")
      ].join("\n");
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(topicLabel + " — " + d.get("org"))}&body=${encodeURIComponent(body)}`;
      form.innerHTML = `
        <div class="form-success" role="status">
          <div class="tick" aria-hidden="true">✓</div>
          <h2>Your message is ready to send</h2>
          <p>We’ve opened your email app with everything pre-filled. Hit send and our team will reply within one business day.</p>
          <p style="margin-top:14px">Email app didn’t open? Write to <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</p>
        </div>`;
    });
    form.addEventListener("input", e => { if (e.target.closest(".field.invalid")) setErr(e.target, ""); });
  }

  /* ---------- Newsletter (mailto until a list provider is connected) ---------- */
  const nl = $("#newsletterForm");
  if (nl) nl.addEventListener("submit", e => {
    e.preventDefault();
    const email = nl.querySelector("input").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { nl.querySelector("input").focus(); return; }
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Subscribe me to Anacomp updates")}&body=${encodeURIComponent("Please add " + email + " to the Anacomp updates list.")}`;
    nl.innerHTML = `<p role="status"><strong>Almost there.</strong> Send the email that just opened to confirm your subscription.</p>`;
  });

  /* ---------- Article share ---------- */
  $$("[data-share]").forEach(b => b.addEventListener("click", async () => {
    const url = location.href;
    if (b.dataset.share === "copy") {
      try { await navigator.clipboard.writeText(url); b.textContent = "Link copied ✓"; } catch { b.textContent = url; }
    } else if (b.dataset.share === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "noopener");
    } else if (b.dataset.share === "email") {
      location.href = `mailto:?subject=${encodeURIComponent(document.title)}&body=${encodeURIComponent(url)}`;
    }
  }));
})();
