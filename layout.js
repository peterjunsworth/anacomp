/* Anacomp — shared layout: header, mega-menu, mobile menu, footer, reveal.
   Include right after <header id="nav" data-page="..."></header> so the
   header renders before first paint. Edit navigation in ONE place: here. */
(() => {
  "use strict";
  // Content that animates in (.reveal) is only hidden when JS is running, so it never stays invisible
  document.documentElement.classList.add("js");

  const PAGES = [
    { id: "clients", label: "Clients", href: "clients.html" },
    { id: "team", label: "Team", href: "team.html" },
    { id: "news", label: "News", href: "news.html" },
    { id: "contact", label: "Contact", href: "contact.html" }
  ];

  const STAGES = [
    { id: "discover", num: "01", name: "Discover", blurb: "Know what you hold before you move it" },
    { id: "digitize", num: "02", name: "Digitize", blurb: "Bring paper into the digital flow" },
    { id: "redact", num: "03", name: "Redact", blurb: "Remove what must not be released" },
    { id: "remediate", num: "04", name: "Remediate", blurb: "Turn any document into accessible data" },
    { id: "release", num: "05", name: "Release", blurb: "Give the public a verified front door" },
    { id: "analyze", num: "∞", name: "Analyze", blurb: "Ask your records program anything" }
  ];

  const nav = document.getElementById("nav");
  const page = nav.dataset.page || "";
  const home = "index.html";

  const currentVal = nav.dataset.current || "page";
  const linkCls = id => (id === page ? ` class="is-current" aria-current="${currentVal}"` : "");

  /* ---------------- Header ---------------- */
  nav.className = "nav";
  nav.innerHTML = `
  <div class="wrap nav__inner">
    <a href="${home}" class="nav__logo" aria-label="Anacomp home">
      <img src="assets/anacomp-logo-white.png" alt="Anacomp" class="logo-light" width="147" height="48">
      <img src="assets/anacomp-logo-navy.png" alt="" aria-hidden="true" class="logo-dark" width="147" height="48">
    </a>
    <nav class="nav__main" aria-label="Main">
      <ul class="nav__links">
        <li class="has-mega">
          <button class="nav__trigger${page === "home" ? " is-current" : ""}" aria-expanded="false" aria-controls="mega">
            Solutions <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3"/></svg>
          </button>
        <div class="mega" id="mega" hidden>
          <div class="wrap mega__inner">
            <div class="mega__intro">
              <p class="eyebrow">The Information Lifecycle</p>
              <p class="mega__title">One pipeline, from raw records to public release.</p>
              <p class="mega__text">Sold end to end or one stage at a time. Every stage feeds the next.</p>
              <a href="${home}#pipeline" class="mega__more">Explore the pipeline <span aria-hidden="true">→</span></a>
            </div>
            <ol class="mega__stages">
              ${STAGES.map(s => `
              <li><a href="${home}#stage-${s.id}" class="mega__stage${s.id === "analyze" ? " mega__stage--analyze" : ""}">
                <span class="mega__num">${s.num}</span>
                <span><strong>${s.name}</strong> <small>${s.blurb}</small></span>
              </a></li>`).join("")}
            </ol>
            <div class="mega__side">
              <a href="${home}#packages" class="mega__card"><strong>Packages</strong> <small>Eight bundles, including Ask the Document</small></a>
              <a href="${home}#journey" class="mega__card"><strong>How a request flows</strong> <small>Six steps, one chain of custody</small></a>
              <a href="${home}#pilot" class="mega__card mega__card--accent"><strong>30-day pilot</strong> <small>Prove it on your own records</small></a>
            </div>
          </div>
        </div>
        </li>
        ${PAGES.slice(0, 3).map(p => `<li><a href="${p.href}"${linkCls(p.id)}>${p.label}</a></li>`).join("")}
      </ul>
    </nav>
    <div class="nav__actions">
      <a href="contact.html" class="nav__contact${page === "contact" ? " is-current" : ""}"${page === "contact" ? ' aria-current="page"' : ""}>Contact</a>
      <a href="contact.html?topic=pilot" class="btn btn--accent btn--sm nav__cta">Book a pilot</a>
      <button class="nav__toggle" id="navToggle" aria-expanded="false" aria-controls="mobileMenu" aria-label="Menu"><span></span><span></span></button>
    </div>
  </div>`;

  /* ---------------- Mobile menu (full screen) ---------------- */
  const mobile = document.createElement("nav");
  mobile.setAttribute("aria-label", "Mobile");
  mobile.className = "mmenu";
  mobile.id = "mobileMenu";
  mobile.hidden = true;
  mobile.innerHTML = `
    <div class="mmenu__inner">
      <p class="mmenu__label">Solutions</p>
      <ul class="mmenu__stages">
        ${STAGES.map(s => `<li><a href="${home}#stage-${s.id}"><span>${s.num}</span> ${s.name}</a></li>`).join("")}
      </ul>
      <ul class="mmenu__pages">
        <li><a href="${home}"${linkCls("home")}>Home</a></li>
        ${PAGES.map((p, i) => `<li style="--i:${i + 1}"><a href="${p.href}"${linkCls(p.id)}>${p.label}</a></li>`).join("")}
      </ul>
      <a href="contact.html?topic=pilot" class="btn btn--accent btn--lg mmenu__cta">Book a 30-day pilot <span aria-hidden="true">→</span></a>
    </div>`;
  nav.after(mobile);

  /* ---------------- Footer ---------------- */
  function renderFooter() {
    const f = document.getElementById("site-footer");
    if (!f) return;
    f.className = "footer";
    f.innerHTML = `
    <div class="wrap">
      <div class="footer__top">
        <div class="footer__brand">
          <img src="assets/anacomp-logo-white.png" alt="Anacomp" width="122" height="40">
          <p>One information lifecycle pipeline: from raw records to public release.</p>
          <a href="contact.html?topic=pilot" class="btn btn--accent btn--sm">Book a pilot <span aria-hidden="true">→</span></a>
        </div>
        <nav class="footer__nav" aria-label="Footer">
        <div class="footer__col">
          <h2 class="footer__head">Solutions</h2>
          <ul>${STAGES.map(s => `<li><a href="${home}#stage-${s.id}">${s.name}</a></li>`).join("")}</ul>
        </div>
        <div class="footer__col">
          <h2 class="footer__head">Company</h2>
          <ul>
            <li><a href="clients.html">Clients &amp; case studies</a></li>
            <li><a href="clients.html#reviews">Reviews</a></li>
            <li><a href="team.html">Leadership team</a></li>
            <li><a href="news.html">News &amp; articles</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <h2 class="footer__head">Get in touch</h2>
          <ul>
            <li><a href="contact.html">Contact us</a></li>
            <li><a href="${home}#pilot">30-day pilot</a></li>
            <li><a href="${home}#pricing">How we price</a></li>
          </ul>
        </div>
        </nav>
      </div>
      <p class="footer__copy">© ${new Date().getFullYear()} Anacomp. Discover · Digitize · Redact · Remediate · Release · Analyze</p>
    </div>`;
  }

  /* ---------------- Behaviour ---------------- */
  function init() {
    renderFooter();

    const trigger = nav.querySelector(".nav__trigger");
    const mega = document.getElementById("mega");
    const li = trigger.parentElement;
    let closeTimer, openedAt = 0;

    const setMega = (open, viaHover = false) => {
      clearTimeout(closeTimer);
      trigger.setAttribute("aria-expanded", open);
      nav.classList.toggle("mega-open", open);
      if (open) {
        // Only a hover-open arms the click guard below; keyboard/click toggles are never swallowed
        if (mega.hidden && viaHover) openedAt = Date.now();
        mega.hidden = false; requestAnimationFrame(() => mega.classList.add("open"));
      } else { mega.classList.remove("open"); closeTimer = setTimeout(() => { mega.hidden = true; }, 250); }
    };
    const hoverable = window.matchMedia("(hover: hover)").matches;
    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      // A hover just opened it: the click that follows shouldn't immediately close it
      if (isOpen && Date.now() - openedAt < 600) return;
      setMega(!isOpen);
    });
    if (hoverable) {
      li.addEventListener("mouseenter", () => setMega(true, true));
      mega.addEventListener("mouseenter", () => clearTimeout(closeTimer));
      [li, mega].forEach(el => el.addEventListener("mouseleave", e => {
        if (!li.contains(e.relatedTarget) && !mega.contains(e.relatedTarget)) {
          closeTimer = setTimeout(() => setMega(false), 180);
        }
      }));
    }
    // Close the panel when keyboard focus moves out of it, so it can't cover what's focused next
    li.addEventListener("focusout", e => {
      if (e.relatedTarget && !li.contains(e.relatedTarget) && trigger.getAttribute("aria-expanded") === "true") setMega(false);
    });
    document.addEventListener("keydown", e => {
      if (e.key !== "Escape") return;
      if (trigger.getAttribute("aria-expanded") === "true") { setMega(false); trigger.focus(); }
      if (!mobile.hidden) { setMobile(false); toggle.focus(); }
    });
    document.addEventListener("click", e => {
      if (!nav.contains(e.target) && trigger.getAttribute("aria-expanded") === "true") setMega(false);
    });
    mega.addEventListener("click", e => { if (e.target.closest("a")) setMega(false); });

    // Mobile
    const toggle = document.getElementById("navToggle");
    const setMobile = open => {
      toggle.setAttribute("aria-expanded", open);
      document.documentElement.classList.toggle("menu-open", open);
      // While the full-screen menu is open, the page behind it can't be reached by Tab or screen reader
      document.querySelectorAll("main, #site-footer, .chapters, .chapter-pill").forEach(el => { el.inert = open; });
      if (open) {
        mobile.hidden = false;
        requestAnimationFrame(() => { mobile.classList.add("open"); const first = mobile.querySelector("a"); if (first) first.focus(); });
      } else { mobile.classList.remove("open"); setTimeout(() => { mobile.hidden = true; }, 300); }
    };
    toggle.addEventListener("click", () => {
      const opening = toggle.getAttribute("aria-expanded") !== "true";
      setMobile(opening);
      if (!opening) toggle.focus();
    });
    mobile.addEventListener("click", e => { if (e.target.closest("a")) setMobile(false); });

    // Scroll state: transparent over dark heroes, frosted over light content
    const darkSections = [...document.querySelectorAll(".dark")];
    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle("scrolled", y > 40);
      const overDark = y > 40 && darkSections.some(s => {
        const r = s.getBoundingClientRect();
        return r.top <= 40 && r.bottom >= 40;
      });
      nav.classList.toggle("on-dark", overDark);
    };
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(() => { onScroll(); ticking = false; }); ticking = true; }
    }, { passive: true });
    onScroll();

    // Reveal on scroll (shared)
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    window.observeReveal = root => (root || document).querySelectorAll(".reveal:not(.in), .week:not(.in)").forEach(el => io.observe(el));
    window.observeReveal();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
