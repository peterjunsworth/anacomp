/* Anacomp — shared layout: header, mega-menu, mobile menu, footer, reveal.
   Include right after <header id="nav" data-page="..."></header> so the
   header renders before first paint. Edit navigation in ONE place: here. */
/* Anacomp — shared behaviour: mega-menu, mobile menu, header state, reveal-on-scroll.
   The header, mobile menu and footer markup are pre-rendered into every page by
   build/build.mjs (edit navigation in build/content.mjs, then run the build). */
(() => {
  "use strict";
  // Content that animates in (.reveal) is only hidden when JS is running, so it never stays invisible
  document.documentElement.classList.add("js");

  const nav = document.getElementById("nav");
  const mobile = document.getElementById("mobileMenu");
  if (!nav || !mobile) return;

  /* ---------------- Behaviour ---------------- */
  function init() {

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
