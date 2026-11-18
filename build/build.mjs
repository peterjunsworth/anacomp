#!/usr/bin/env node
/* Anacomp static build — no dependencies.
   Writes server-rendered HTML into the pages (between <!-- build:x --> markers) so search
   engines and AI agents see every word without running JavaScript, and generates
   robots.txt, sitemap.xml, llms.txt and llms-full.txt.

   Run after editing content or templates:   node build/build.mjs
   Then commit the changed files. Vercel serves the output as-is (no build step). */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE, NAV, STAGES, ORDER, PACKAGES, QUOTES, PRICING, PAGES, PEOPLE, ARTICLE_PATH } from "./content.mjs";
import { NEWS, NEWS_TAGS } from "./news.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = f => readFileSync(join(ROOT, f), "utf8");
const write = (f, s) => writeFileSync(join(ROOT, f), s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const abs = p => SITE.origin + (p === "/" ? "/" : p);
const byId = Object.fromEntries(STAGES.map(s => [s.id, s]));
const TODAY = new Date().toISOString().slice(0, 10);

/* Cache-busting: a short content hash per CSS/JS file */
const version = f => createHash("md5").update(read(f)).digest("hex").slice(0, 8);
const V = Object.fromEntries(["styles.css", "pages.css", "layout.js", "home.js", "pages.js"].map(f => [f, version(f)]));

/* ------------------------------------------------------------------ header / footer */
function header(page) {
  const cur = page.navCurrent || "page";
  const linkCls = id => (id === page.nav ? ` class="is-current" aria-current="${cur}"` : "");
  return `<header id="nav" class="nav" data-page="${page.nav}">
  <div class="wrap nav__inner">
    <a href="/" class="nav__logo" aria-label="Anacomp home">
      <img src="/assets/anacomp-logo-white.png" alt="Anacomp" class="logo-light" width="147" height="48">
      <img src="/assets/anacomp-logo-navy.png" alt="" aria-hidden="true" class="logo-dark" width="147" height="48">
    </a>
    <nav class="nav__main" aria-label="Main">
      <ul class="nav__links">
        <li class="has-mega">
          <button class="nav__trigger${page.nav === "home" ? " is-current" : ""}" aria-expanded="false" aria-controls="mega">
            Solutions <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3"/></svg>
          </button>
          <div class="mega" id="mega" hidden>
            <div class="wrap mega__inner">
              <div class="mega__intro">
                <p class="eyebrow">The Information Lifecycle</p>
                <p class="mega__title">One pipeline, from raw records to public release.</p>
                <p class="mega__text">Sold end to end or one stage at a time. Every stage feeds the next.</p>
                <a href="/#pipeline" class="mega__more">Explore the pipeline <span aria-hidden="true">→</span></a>
              </div>
              <ol class="mega__stages">${STAGES.map(s => `
                <li><a href="/#stage-${s.id}" class="mega__stage${s.id === "analyze" ? " mega__stage--analyze" : ""}">
                  <span class="mega__num">${s.num}</span>
                  <span><strong>${s.name}</strong> <small>${esc(s.blurb)}</small></span>
                </a></li>`).join("")}
              </ol>
              <div class="mega__side">
                <a href="/#packages" class="mega__card"><strong>Packages</strong> <small>Eight bundles, including Ask the Document</small></a>
                <a href="/#journey" class="mega__card"><strong>How a request flows</strong> <small>Six steps, one chain of custody</small></a>
                <a href="/#pilot" class="mega__card mega__card--accent"><strong>30-day pilot</strong> <small>Prove it on your own records</small></a>
              </div>
            </div>
          </div>
        </li>
        ${NAV.slice(0, 3).map(p => `<li><a href="${p.href}"${linkCls(p.id)}>${p.label}</a></li>`).join("\n        ")}
      </ul>
    </nav>
    <div class="nav__actions">
      <a href="/contact" class="nav__contact${page.nav === "contact" ? " is-current" : ""}"${page.nav === "contact" ? ' aria-current="page"' : ""}>Contact</a>
      <a href="/contact?topic=pilot" class="btn btn--accent btn--sm nav__cta">Book a pilot</a>
      <button class="nav__toggle" id="navToggle" aria-expanded="false" aria-controls="mobileMenu" aria-label="Menu"><span></span><span></span></button>
    </div>
  </div>
</header>
<nav class="mmenu" id="mobileMenu" aria-label="Mobile" hidden>
  <div class="mmenu__inner">
    <p class="mmenu__label">Solutions</p>
    <ul class="mmenu__stages">
      ${STAGES.map(s => `<li><a href="/#stage-${s.id}"><span>${s.num}</span> ${s.name}</a></li>`).join("\n      ")}
    </ul>
    <ul class="mmenu__pages">
      <li><a href="/"${linkCls("home")}>Home</a></li>
      ${NAV.map((p, i) => `<li style="--i:${i + 1}"><a href="${p.href}"${linkCls(p.id)}>${p.label}</a></li>`).join("\n      ")}
    </ul>
    <a href="/contact?topic=pilot" class="btn btn--accent btn--lg mmenu__cta">Book a 30-day pilot <span aria-hidden="true">→</span></a>
  </div>
</nav>`;
}

function footer() {
  return `<footer id="site-footer" class="footer">
  <div class="wrap">
    <div class="footer__top">
      <div class="footer__brand">
        <img src="/assets/anacomp-logo-white.png" alt="Anacomp" width="122" height="40">
        <p>One information lifecycle pipeline: from raw records to public release.</p>
        <a href="/contact?topic=pilot" class="btn btn--accent btn--sm">Book a pilot <span aria-hidden="true">→</span></a>
      </div>
      <nav class="footer__nav" aria-label="Footer">
        <div class="footer__col">
          <h2 class="footer__head">Solutions</h2>
          <ul>${STAGES.map(s => `<li><a href="/#stage-${s.id}">${s.name}</a></li>`).join("")}</ul>
        </div>
        <div class="footer__col">
          <h2 class="footer__head">Company</h2>
          <ul>
            <li><a href="/clients">Clients &amp; case studies</a></li>
            <li><a href="/clients#reviews">Reviews</a></li>
            <li><a href="/team">Leadership team</a></li>
            <li><a href="/news">News &amp; articles</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <h2 class="footer__head">Get in touch</h2>
          <ul>
            <li><a href="/contact">Contact us</a></li>
            <li><a href="/#pilot">30-day pilot</a></li>
            <li><a href="/#pricing">How we price</a></li>
          </ul>
        </div>
      </nav>
    </div>
    <p class="footer__copy">© ${new Date().getFullYear()} ${SITE.legalName}. Discover · Digitize · Redact · Remediate · Release · Analyze</p>
  </div>
</footer>`;
}

/* ------------------------------------------------------------------ home page content */
function stages() {
  const tabs = STAGES.map((s, i) => `
        <button class="stage-tab${s.id === "analyze" ? " stage-tab--analyze" : ""}" role="tab" id="tab-${s.id}"
          aria-controls="stage-${s.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-id="${s.id}">
          <span class="stage-tab__num">${s.num}</span>
          <span><span class="stage-tab__name">${s.name}</span> <span class="stage-tab__by">${esc(s.powered)}</span></span>
        </button>`).join("");
  const panels = STAGES.map((s, i) => `
        <div class="stage-panel" id="stage-${s.id}" role="tabpanel" aria-labelledby="tab-${s.id}" data-num="${s.num}"${i === 0 ? "" : " hidden"}>
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
            </div>${s.addon ? `
            <div class="stage-panel__addon">
              <p class="stage-panel__addon-name"><strong>${esc(s.addon.name)}</strong> <span>Powered by ${esc(s.addon.powered)}</span></p>
              <p>${esc(s.addon.text)}</p>
            </div>` : ""}
          </div>
        </div>`).join("");
  return `<div class="stages__tabs" role="tablist" aria-label="Pipeline stages" id="stageTabs">${tabs}
      </div>
      <div class="stage-panels">${panels}
      </div>`;
}

const matrixRows = () => PACKAGES.map(p => `
          <tr${p.featured ? ' class="featured"' : ""}>
            <th scope="row">${p.name}${p.featured ? " <small>Complete</small>" : ""}</th>
            ${ORDER.map((id, i) => {
              const on = p.stages.includes(id);
              return `<td><span class="dot${on ? " dot--on" : ""}" style="transition-delay:${(i * 0.06).toFixed(2)}s" role="img" aria-label="${byId[id].name}: ${on ? "included" : "not included"}"></span></td>`;
            }).join("\n            ")}
            <td><span class="dot dot--addon${p.addon ? " dot--on" : ""}" style="transition-delay:${(ORDER.length * 0.06).toFixed(2)}s" role="img" aria-label="Ask Chat: ${p.addon ? "included" : "not included"}"></span></td>
            <td>${esc(p.trigger)}</td>
          </tr>`).join("");

const quotes = () => QUOTES.map((q, i) => `
      <article class="quote reveal" style="--d:${(i % 3) * 0.08}s">
        <blockquote>${esc(q.q)}</blockquote>
        <dl class="quote__path">
          <div class="start"><dt>Start with</dt><dd>${q.start}</dd></div>
          <div><dt>Then expand</dt><dd>${q.then}</dd></div>
        </dl>
      </article>`).join("");

const pricing = () => PRICING.map((p, i) => `
      <article class="price reveal${p.full ? " price--full" : ""}${p.addon ? " price--addon" : ""}" style="--d:${(i % 3) * 0.08}s">
        <h3 class="price__stage">${p.stage}</h3>
        <p class="price__unit">${p.unit}</p>
        <p class="price__shape">${p.shape}</p>
        ${p.full ? '<span class="price__badge">Best value</span>' : ""}${p.addon ? '<span class="price__badge">Optional add-on</span>' : ""}
      </article>`).join("");

/* ------------------------------------------------------------------ structured data */
const ORG_ID = SITE.origin + "/#organization";
const SITE_ID = SITE.origin + "/#website";

function organization() {
  return {
    "@type": "Organization", "@id": ORG_ID,
    name: SITE.name, legalName: SITE.legalName, url: SITE.origin + "/",
    logo: { "@type": "ImageObject", url: abs(SITE.logo), width: 147, height: 48 },
    image: abs(SITE.ogImage),
    description: SITE.description,
    slogan: SITE.tagline,
    knowsAbout: SITE.knowsAbout,
    contactPoint: { "@type": "ContactPoint", contactType: "sales", url: abs("/contact"), availableLanguage: "English" },
    hasOfferCatalog: {
      "@type": "OfferCatalog", name: "Anacomp Information Lifecycle",
      itemListElement: [
        ...STAGES.map(s => ({ "@type": "Offer", itemOffered: { "@id": `${SITE.origin}/#service-${s.id}` } })),
        { "@type": "Offer", itemOffered: { "@id": `${SITE.origin}/#service-ask-the-document` } }
      ]
    }
  };
}

function services() {
  const list = STAGES.map(s => ({
    "@type": "Service", "@id": `${SITE.origin}/#service-${s.id}`,
    name: `${s.name}: ${s.service}`, serviceType: s.service,
    description: `${s.desc} ${s.receive.join(". ")}.`,
    provider: { "@id": ORG_ID },
    audience: { "@type": "Audience", audienceType: "Public agencies and government organizations" },
    url: abs(`/#stage-${s.id}`)
  }));
  const ad = STAGES.find(s => s.addon).addon;
  list.push({
    "@type": "Service", "@id": `${SITE.origin}/#service-ask-the-document`,
    name: `${ad.name} (powered by ${ad.powered})`, serviceType: "Conversational Q&A on accessible documents",
    description: ad.text, provider: { "@id": ORG_ID }, isRelatedTo: { "@id": `${SITE.origin}/#service-remediate` },
    url: abs("/#stage-remediate")
  });
  return list;
}

function breadcrumb(page) {
  if (!page.crumbs) return null;
  const items = [["Home", "/"], ...page.crumbs];
  return {
    "@type": "BreadcrumbList", "@id": abs(page.path) + "#breadcrumb",
    itemListElement: items.map(([name, p], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(p) }))
  };
}

function faq(html) {
  const qa = [...html.matchAll(/<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/g)];
  if (!qa.length) return null;
  const text = s => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return {
    "@type": "FAQPage", "@id": abs("/contact") + "#faq",
    mainEntity: qa.map(m => ({ "@type": "Question", name: text(m[1]), acceptedAnswer: { "@type": "Answer", text: text(m[2]) } }))
  };
}

function jsonld(page, html) {
  const url = abs(page.path);
  const graph = [organization(), {
    "@type": "WebSite", "@id": SITE_ID, url: SITE.origin + "/", name: SITE.name,
    description: SITE.description, publisher: { "@id": ORG_ID }, inLanguage: "en-US"
  }];
  const webpage = {
    "@type": page.type === "NewsArticle" ? "WebPage" : page.type, "@id": url + "#webpage", url,
    name: page.title, description: page.description, isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID }, inLanguage: "en-US",
    primaryImageOfPage: { "@type": "ImageObject", url: abs(ogOf(page).url) },
    dateModified: TODAY
  };
  const bc = breadcrumb(page);
  if (bc) { webpage.breadcrumb = { "@id": bc["@id"] }; graph.push(bc); }
  graph.push(webpage);

  if (page.path === "/") graph.push(...services());
  if (page.faq) { const f = faq(html); if (f) graph.push(f); }
  if (page.article) {
    graph.push({
      "@type": "NewsArticle", "@id": url + "#article", headline: page.article.headline,
      description: page.description, articleSection: page.article.section,
      datePublished: page.article.datePublished, dateModified: page.article.dateModified || page.article.datePublished,
      image: [abs(ogOf(page).url)], author: { "@id": ORG_ID }, publisher: { "@id": ORG_ID },
      mainEntityOfPage: { "@id": url + "#webpage" }, isPartOf: { "@id": SITE_ID }, inLanguage: "en-US"
    });
  }
  if (page.path === "/news") {
    webpage.hasPart = [ARTICLE_PATH, ...NEWS.map(n => `/news/${n.slug}`)].map(p => ({ "@id": abs(p) + "#article" }));
  }
  if (page.path === "/team") {
    const people = PEOPLE.map(p => ({
      "@type": "Person", "@id": `${SITE.origin}/team#${p.name.toLowerCase().replace(/[^a-z]+/g, "-")}`,
      name: p.name, jobTitle: p.jobTitle,
      ...(p.image ? { image: abs(p.image) } : {}),
      ...(p.sameAs ? { sameAs: [p.sameAs] } : {}),
      ...(p.board ? { memberOf: { "@id": ORG_ID } } : { worksFor: { "@id": ORG_ID } })
    }));
    graph.push(...people);
    webpage.mainEntity = { "@id": ORG_ID };
    graph[0].employee = people.filter((_, i) => !PEOPLE[i].board).map(p => ({ "@id": p["@id"] }));
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2).replace(/</g, "\\u003c");
}

/* ------------------------------------------------------------------ <head> */
function head(page, html) {
  const url = abs(page.path);
  const ogType = page.article ? "article" : "website";
  const og = ogOf(page);
  const img = abs(og.url);
  return `<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.description)}">
  ${page.noindex ? '<meta name="robots" content="noindex, follow">' : `<link rel="canonical" href="${url}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">`}
  <meta name="theme-color" content="${SITE.themeColor}">
  <meta name="author" content="${SITE.legalName}">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="alternate" type="text/plain" href="/llms.txt" title="Anacomp site summary for AI agents (llms.txt)">
  <meta property="og:site_name" content="${SITE.name}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:locale" content="${SITE.locale}">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(page.title)}">
  <meta property="og:description" content="${esc(page.description)}">
  <meta property="og:image" content="${img}">
  <meta property="og:image:width" content="${og.width}">
  <meta property="og:image:height" content="${og.height}">
  <meta property="og:image:alt" content="${esc(og.alt)}">${page.article ? `
  <meta property="article:published_time" content="${page.article.datePublished}">
  <meta property="article:section" content="${esc(page.article.section)}">` : ""}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(page.title)}">
  <meta name="twitter:description" content="${esc(page.description)}">
  <meta name="twitter:image" content="${img}">
  <meta name="twitter:image:alt" content="${esc(og.alt)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  ${page.css.map(c => `<link rel="stylesheet" href="/${c}?v=${V[c]}">`).join("\n  ")}
  <script>document.documentElement.classList.add("js")</script>
  <script src="/layout.js?v=${V["layout.js"]}" defer></script>
  ${page.js.map(j => `<script src="/${j}?v=${V[j]}" defer></script>`).join("\n  ")}
  <script type="application/ld+json">
${jsonld(page, html)}
  </script>`;
}

/* ------------------------------------------------------------------ region replacement */
function region(html, name, content, file) {
  const re = new RegExp(`(<!-- build:${name} -->)[\\s\\S]*?(<!-- /build:${name} -->)`);
  if (!re.test(html)) throw new Error(`${file}: missing <!-- build:${name} --> markers`);
  return html.replace(re, `$1\n${content}\n$2`);
}

/* ------------------------------------------------------------------ HTML → Markdown (for llms-full.txt) */
function removeElements(html, openTagTest) {
  // Removes whole elements whose opening tag matches, respecting nesting of the same tag name
  let out = "", i = 0;
  const open = /<([a-z0-9]+)\b[^>]*>/gi;
  for (;;) {
    open.lastIndex = i;
    let m;
    while ((m = open.exec(html)) && !openTagTest(m[0])) { /* keep scanning */ }
    if (!m) { out += html.slice(i); break; }
    out += html.slice(i, m.index);
    const tag = m[1].toLowerCase();
    if (/\/>$/.test(m[0]) || ["img", "br", "input", "meta", "link", "hr"].includes(tag)) { i = m.index + m[0].length; continue; }
    const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
    re.lastIndex = m.index + m[0].length;
    let depth = 1, t;
    while (depth && (t = re.exec(html))) depth += t[1] ? -1 : 1;
    i = t ? re.lastIndex : html.length;
  }
  return out;
}
const decode = s => s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

function toMarkdown(html) {
  let h = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/) || [, ""])[1];
  h = h.replace(/<!--[\s\S]*?-->/g, "").replace(/<script[\s\S]*?<\/script>/g, "").replace(/<svg[\s\S]*?<\/svg>/g, "");
  h = removeElements(h, t => /aria-hidden="true"|data-placeholder|class="(crumbs|chapters|share)[^"]*"|<button|<form/.test(t));
  h = h.replace(/<\/span>\s*<span/g, "</span>, <span")
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/g, "\n\n# $1\n\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, "\n\n## $1\n\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, "\n\n### $1\n\n")
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/g, "\n\n#### $1\n\n")
    .replace(/<li[^>]*>/g, "\n- ").replace(/<\/li>/g, "")
    .replace(/<blockquote[^>]*>/g, "\n\n> ").replace(/<\/blockquote>/g, "\n\n")
    .replace(/<dt[^>]*>([\s\S]*?)<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/g, "\n- $1: $2")
    .replace(/<tr[^>]*>/g, "\n|").replace(/<\/t[hd]>/g, " |")
    .replace(/<td[^>]*>\s*<span class="dot[^"]*"[^>]*aria-label="[^:"]+: (included|not included)"[^>]*><\/span>/g, (m, v) => (v === "included" ? " ✓" : " –"))
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (m, href, text) => {
      const t = text.replace(/<[^>]+>/g, "").trim();
      if (!t) return "";
      const u = href.startsWith("/") ? SITE.origin + href : href;
      return /^(mailto:|tel:|#)/.test(href) ? t : `[${t}](${u})`;
    })
    .replace(/<br\s*\/?>/g, " ")
    .replace(/<\/(p|div|section|article|header|figure|dl|ul|ol|table|tbody|thead)>/g, "\n\n")
    .replace(/<[^>]+>/g, "");
  return decode(h).split("\n").map(l => l.replace(/[ \t]+/g, " ").trim()).join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/* ------------------------------------------------------------------ news archive */
const fmtDate = d => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
const tagLabel = id => (NEWS_TAGS.find(t => t.id === id) || {}).label || id;

function ogOf(page) {
  return page.og || { url: SITE.ogImage, width: 1200, height: 630, alt: SITE.ogImageAlt };
}

const newsFilters = () => [`<button class="chip" data-filter="all" aria-pressed="true">All</button>`,
  ...NEWS_TAGS.filter(t => NEWS.some(n => n.tag === t.id)).map(t => `<button class="chip" data-filter="${t.id}" aria-pressed="false">${esc(t.label)}</button>`)]
  .map(b => "          " + b).join("\n");

const newsCards = () => NEWS.map((n, i) => `
        <a class="post reveal" href="/news/${n.slug}" data-tags="${n.tag}">
          ${newsCover(n, i)}
          <div class="post__body">
            <span class="tag" style="align-self:start">${esc(n.kind)}</span>
            <h3>${esc(n.title)}</h3>
            <p>${esc(n.excerpt)}</p>
            <div class="post-meta"><time datetime="${n.date}">${fmtDate(n.date)}</time><span>· ${n.minutes} min read</span></div>
          </div>
        </a>`).join("");

/* Branded card cover: navy + grid + orange glow, a motif per topic, and a short headline.
   Decorative (the card's visible title and text carry the meaning), so hidden from assistive tech. */
const MOTIFS = {
  cybersecurity: `<path d="M318 38 l46 16 v36 c0 30-20 52-46 64 c-26-12-46-34-46-64 v-36 z" fill="none" stroke="#F28C5A" stroke-width="2"/>
      <path d="M318 62 l26 9 v20 c0 17-11 30-26 37 c-15-7-26-20-26-37 v-20 z" fill="rgba(242,140,90,.14)" stroke="#B9C6D6" stroke-width="1.2"/>
      <circle cx="318" cy="92" r="6" fill="#F28C5A"/>`,
  partnerships: `<circle cx="296" cy="90" r="44" fill="none" stroke="#F28C5A" stroke-width="2"/>
      <circle cx="344" cy="90" r="44" fill="none" stroke="#B9C6D6" stroke-width="2"/>
      <circle cx="320" cy="90" r="6" fill="#F28C5A"/>`,
  company: `<g fill="none" stroke="#B9C6D6" stroke-width="1.2" opacity=".8"><path d="M276 60 L330 92 L372 54 M330 92 L318 146 M276 60 L262 118 L318 146"/></g>
      <circle cx="330" cy="92" r="9" fill="#F28C5A"/><circle cx="276" cy="60" r="6" fill="#1B3352" stroke="#B9C6D6" stroke-width="1.5"/>
      <circle cx="372" cy="54" r="6" fill="#1B3352" stroke="#B9C6D6" stroke-width="1.5"/><circle cx="262" cy="118" r="5" fill="#1B3352" stroke="#F28C5A" stroke-width="1.5"/>
      <circle cx="318" cy="146" r="6" fill="#1B3352" stroke="#B9C6D6" stroke-width="1.5"/>`
};
function newsCover(n, i) {
  const gx = [78, 88, 70, 92, 82][i % 5], gy = [8, 20, 4, 14, 24][i % 5];
  return `<div class="post-art post-art--brand" aria-hidden="true">
            <svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice" focusable="false">
              <defs>
                <radialGradient id="glow-${n.slug}" cx="${gx}%" cy="${gy}%" r="75%"><stop offset="0" stop-color="#E2622B" stop-opacity=".5"/><stop offset="1" stop-color="#0F2238" stop-opacity="0"/></radialGradient>
                <pattern id="grid-${n.slug}" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#B9C6D6" stroke-opacity=".08" stroke-width=".6"/></pattern>
              </defs>
              <rect width="400" height="210" fill="#0F2238"/><rect width="400" height="210" fill="url(#grid-${n.slug})"/><rect width="400" height="210" fill="url(#glow-${n.slug})"/>
              ${MOTIFS[n.tag] || MOTIFS.company}
            </svg>
            <div class="post-art__cover"><span class="post-art__kicker">Anacomp news · ${n.date.slice(0, 4)}</span><span class="post-art__title">${esc(n.cover || n.shortTitle || n.title)}</span></div>
          </div>`;
}

function newsPageFile(n) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<!-- build:head -->
<!-- /build:head -->
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<!-- build:header -->
<!-- /build:header -->

<!-- Generated from build/news.mjs by build/build.mjs: edit the article there, not here. -->
<main id="main">
  <section class="page-hero dark article-hero">
    <div class="hero__grid" aria-hidden="true"></div>
    <div class="hero__glow" aria-hidden="true"></div>
    <div class="wrap">
      <nav class="crumbs reveal" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/news">News</a><span aria-hidden="true">/</span><span aria-current="page">${esc(n.kind)}</span></nav>
      <h1 class="reveal" style="max-width:24ch">${esc(n.title)}</h1>
      <div class="post-meta reveal"><span class="tag">${esc(n.kind)}</span><time datetime="${n.date}">${fmtDate(n.date)}</time><span>· ${n.minutes} min read</span></div>
    </div>
  </section>

  <article class="article">
    <div class="article__body">
      <figure class="article__figure"><img src="${n.image}" alt="${esc(n.imageAlt)}" width="${n.width}" height="${n.height}"></figure>
      <p class="article__note">Press release from the Anacomp archive, originally published ${fmtDate(n.date)}. Titles and details reflect that date.</p>
${n.body.trim().split("\n").map(l => "      " + l.trim()).join("\n")}
      <p><a href="/news">Back to all news <span aria-hidden="true">→</span></a></p>
    </div>
    <aside class="article__aside">
      <div class="share">
        <p>Share</p>
        <button data-share="copy">Copy link</button>
        <button data-share="linkedin">LinkedIn<span class="visually-hidden"> (opens in a new window)</span></button>
        <button data-share="email">Email</button>
      </div>
    </aside>
  </article>

  <section class="section paper" style="padding-top:80px">
    <div class="wrap">
      <div class="cta-band reveal">
        <div>
          <h2>See the Information Lifecycle on your own records.</h2>
          <p>Thirty days, one repository, a sample set of pages and one request walked all the way through.</p>
        </div>
        <a href="/contact?topic=pilot" class="btn btn--accent btn--lg">Book a pilot <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>
</main>

<!-- build:footer -->
<!-- /build:footer -->
</body>
</html>
`;
}

/* Each news item becomes a page */
const NEWS_PAGES = NEWS.map(n => {
  write(`news/${n.slug}.html`, newsPageFile(n));
  const short = n.shortTitle || n.title;
  return {
    file: `news/${n.slug}.html`, path: `/news/${n.slug}`, short, nav: "news", navCurrent: "true",
    type: "NewsArticle", css: ["styles.css", "pages.css"], js: ["pages.js"],
    title: `${short} | Anacomp`, description: n.excerpt,
    crumbs: [["News", "/news"], [short, `/news/${n.slug}`]],
    article: { headline: n.title.length > 110 ? short : n.title, datePublished: n.date, section: tagLabel(n.tag) },
    og: { url: n.image, width: n.width, height: n.height, alt: n.imageAlt },
    llms: n.excerpt
  };
});
const ALL_PAGES = [...PAGES.slice(0, PAGES.findIndex(p => p.path === ARTICLE_PATH) + 1), ...NEWS_PAGES,
  ...PAGES.slice(PAGES.findIndex(p => p.path === ARTICLE_PATH) + 1)];

/* Old WordPress article addresses redirect permanently to their new homes */
const vercel = JSON.parse(read("vercel.json"));
const keep = (vercel.redirects || []).filter(r => !NEWS.some(n => r.source === n.oldPath || r.source === n.oldPath + "/"));
vercel.redirects = [...keep, ...NEWS.flatMap(n => [n.oldPath, n.oldPath + "/"].map(source => ({ source, destination: `/news/${n.slug}`, permanent: true })))];
write("vercel.json", JSON.stringify(vercel, null, 2) + "\n");

/* ------------------------------------------------------------------ run */
const built = {};
for (const page of ALL_PAGES) {
  if (!existsSync(join(ROOT, page.file))) throw new Error(`Missing ${page.file}`);
  let html = read(page.file);
  html = region(html, "header", header(page), page.file);
  html = region(html, "footer", footer(), page.file);
  if (page.path === "/news") {
    html = region(html, "news-filters", newsFilters(), page.file);
    html = region(html, "news", newsCards(), page.file);
  }
  if (page.path === "/") {
    html = region(html, "stages", stages(), page.file);
    html = region(html, "matrix", matrixRows(), page.file);
    html = region(html, "quotes", quotes(), page.file);
    html = region(html, "pricing", pricing(), page.file);
  }
  html = region(html, "head", "  " + head(page, html), page.file);
  write(page.file, html);
  built[page.path] = html;
  console.log("built", page.file);
}

/* robots.txt — everyone, including AI search and assistant crawlers, is welcome */
write("robots.txt", `# Anacomp — ${SITE.origin}
# All crawlers are welcome, including AI search and assistant agents.
User-agent: *
Allow: /
Disallow: /404

# Explicitly allowed AI crawlers
${["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot", "DuckAssistBot", "Meta-ExternalAgent", "CCBot"]
  .map(b => `User-agent: ${b}\nAllow: /`).join("\n\n")}

Sitemap: ${SITE.origin}/sitemap.xml
# AI-readable summary: ${SITE.origin}/llms.txt
`);

/* sitemap.xml */
const indexable = ALL_PAGES.filter(p => !p.noindex);
const isNewsItem = p => NEWS_PAGES.includes(p);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${indexable.map(p => `  <url>
    <loc>${abs(p.path)}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.path === "/" || p.path === "/news" ? "weekly" : "monthly"}</changefreq>
    <priority>${p.path === "/" ? "1.0" : p.article ? "0.7" : "0.8"}</priority>${p.path === "/team" ? PEOPLE.filter(x => x.image).map(x => `
    <image:image><image:loc>${abs(x.image)}</image:loc></image:image>`).join("") : ""}
  </url>`).join("\n")}
</urlset>
`);

/* llms.txt (https://llmstxt.org) and llms-full.txt */
const stageLines = STAGES.map(s => `- [${s.name}: ${s.service}](${abs(`/#stage-${s.id}`)}): ${s.desc} Powered by ${s.powered}.`).join("\n");
const ad = STAGES.find(s => s.addon).addon;
write("llms.txt", `# ${SITE.name}

> ${SITE.description}

Anacomp sells the Information Lifecycle end to end (one contract, one service level, one chain of custody) or one stage at a time. Every engagement can start with a 30-day pilot on the agency's own records.

## Services (the Information Lifecycle)

${stageLines}
- [${ad.name} (optional add-on, powered by ${ad.powered})](${abs("/#stage-remediate")}): ${ad.text}

## Pages

${indexable.filter(p => !isNewsItem(p)).map(p => `- [${p.short || p.title}](${abs(p.path)}): ${p.llms || p.description}`).join("\n")}

## News and press releases

${NEWS.map(n => `- [${n.title}](${abs(`/news/${n.slug}`)}) (${fmtDate(n.date)}): ${n.excerpt}`).join("\n")}

## Packages

${PACKAGES.map(p => `- ${p.name}: ${p.stages.map(id => byId[id].name).join(" + ")}${p.addon ? " + Ask the Document" : ""}. Typical trigger: ${p.trigger}.`).join("\n")}

## Pricing model

${PRICING.map(p => `- ${p.stage}: ${p.unit} (${p.shape})`).join("\n")}

Pricing is tailored to each engagement: ${abs("/contact?topic=pricing")}

## Optional

- [Full site text for AI agents](${SITE.origin}/llms-full.txt): every page rendered as Markdown
- [Sitemap](${SITE.origin}/sitemap.xml)
`);

write("llms-full.txt", `# ${SITE.name}: full site content

> ${SITE.description}

Generated ${TODAY} from ${SITE.origin}. Placeholder content awaiting client approval is omitted.

${indexable.map(p => `---

URL: ${abs(p.path)}
Title: ${p.title}
Description: ${p.description}

${toMarkdown(built[p.path])}`).join("\n\n")}
`);

console.log("wrote robots.txt, sitemap.xml, llms.txt, llms-full.txt");
