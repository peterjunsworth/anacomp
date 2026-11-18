# Anacomp website: working rules

Static marketing site for Anacomp (public-sector records: Discover, Digitize, Redact, Remediate, Release, Analyze). Hosted on Vercel with clean URLs; canonical domain is `https://www.anacomp.com`. **Every change must keep the site SEO-friendly, readable by AI agents (LLMs), and WCAG 2.2 AA accessible.** The company sells Section 508/ADA remediation, so accessibility regressions are unacceptable.

## How the site is built

- Run `node build/build.mjs` after **any** content, template, CSS or JS change, then commit the generated output. Vercel has no build step; it serves the committed files.
- `build/content.mjs` holds the nav, home-page stages, packages, quotes and pricing. It also holds the page list (title, description, breadcrumbs, JSON-LD type) and the people.
- `build/news.mjs` holds news articles. The build generates `news/<slug>.html`, the cards and filters on `/news`, and redirects from old WordPress URLs (written into `vercel.json`).
- The build overwrites everything between `<!-- build:x -->` and `<!-- /build:x -->` markers: `<head>`, header, footer and home-page sections. Never hand-edit inside markers; edit the source module instead.
- JS (`layout.js`, `home.js`, `pages.js`) only adds behaviour to pre-rendered HTML. Never render content with JS.
- CSS and JS get content-hash `?v=` stamps automatically. Don't add version numbers by hand.
- Links are root-absolute and clean: `/team`, `/contact?topic=pilot`, `/assets/...`. Never use `.html` in links.
- **Icons:** `assets/favicon.svg` is the master. The PNG/ICO sizes are rendered from it: `/favicon.ico` (16/32/48), `/apple-touch-icon.png` (180), and `assets/icons/icon-{48,192,512}.png` plus `icon-maskable-512.png`. The build writes `site.webmanifest`.
- **Image URLs** in share tags, structured data and the sitemap use `SITE.assetOrigin` (currently `https://anacomp.vercel.app`), because www.anacomp.com still serves the old WordPress site. After the domain switch, remove `assetOrigin` so images use `SITE.origin`.
- **Social:** the official profiles live in `SITE.social` in `build/content.mjs`. They feed the footer icons, `Organization.sameAs` and `twitter:site`. Article share buttons come from `shareBlock()` in the build, with their behaviour in `pages.js`.

## Adding a page

1. Create the HTML with `<!-- build:head -->`, `<!-- build:header -->` and `<!-- build:footer -->` markers. Copy an existing page as the template.
2. Add an entry to `PAGES` in `build/content.mjs` with:
   - `file`, `path`
   - `short`, `title` (≤60 chars, ends `| Anacomp`)
   - `description` (70–160 chars)
   - `crumbs`, `type` (schema.org page type), `css`, `js`
   - `llms` (one-line summary for llms.txt)
3. Run the build. The page then appears in `sitemap.xml`, `llms.txt` and `llms-full.txt` automatically.
4. If the page replaces an old URL, add a permanent redirect in `vercel.json`.

## SEO rules

- One `<h1>` per page. Headings go in order with no skipped levels; use h2 for sections inside article bodies.
- Titles must be unique, ≤60 visible characters, with keywords first. Descriptions must be unique and 70–160 characters.
- Every indexable page gets a canonical URL, Open Graph/Twitter tags and JSON-LD. The build does all three; pass a per-page `og` image when the page has its own image.
- Keep structured data truthful and in sync with visible content: Organization, Services, Person (team), NewsArticle (news), FAQPage (contact). Don't add facts to JSON-LD that aren't on the page.
- Every `<img>` needs `width`/`height` attributes. Lazy-load images below the fold. Store images in `/assets/...` as optimized JPEG/PNG (≤1200px wide unless needed).
- Use descriptive link text. Never use "click here" or a bare "read more"; arrows go in `<span aria-hidden="true">→</span>`.
- Never ship broken internal links. Old addresses get permanent (308) redirects in `vercel.json`.
- `noindex` only for utility pages (404).

## AI agent (LLM) rules

- All meaningful text must be in the HTML source. Agents don't run JavaScript.
- `llms.txt` and `llms-full.txt` are generated; update content sources, not those files.
- `robots.txt` deliberately allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot and others). Don't block them.
- Mark placeholder content with `data-placeholder`. The build leaves it out of `llms-full.txt`. Replace placeholders with real content before launch.
- Write plainly: facts, services, audiences and outcomes stated in text, not only in images or decorative graphics.

## Accessibility rules (WCAG 2.2 AA)

- **Contrast.** Text must be at least 4.5:1, or 3:1 for large text and UI boundaries.
  - White text on orange must use `var(--orange-ink)` (#C2501C). `--orange` (#E2622B) is for decoration only.
  - Body text on light backgrounds uses `--navy` or `--slate`. Never use `--stone`/`--stone-2` for text.
- **Keyboard.** Everything works by keyboard, with a visible `:focus-visible` outline on every interactive element. Elements styled with `all: unset` need their own focus style.
- **Focus.** Focus must never be hidden under the sticky header or sub-nav (`scroll-padding-top` handles this). The mobile menu and mega-menu manage focus; keep that behaviour.
- **Images.** Informative images get meaningful alt text; images containing text get that text in their alt. Decorative images get `alt=""`. Icons and SVG decoration get `aria-hidden="true"`.
- **ARIA.** Use real elements (`button`, `a`, `nav`, lists, tables with `scope`/caption) before ARIA. Keep ARIA state (`aria-expanded`, `aria-selected`, `aria-pressed`, `aria-current`) in sync in JS. Never put `aria-label` on a plain `div`/`span` without a role.
- **Forms.**
  - Every field needs a visible label, an `autocomplete` value, and error text tied to the field with `aria-describedby`.
  - On submit, focus the first invalid field.
  - Announce results through the existing `role="status"` region.
- **Motion.** Nothing animates for more than 5 seconds without a pause control. Respect `prefers-reduced-motion`.
- **Touch targets.** At least 24×24 CSS px.
- **Content.** Content must reflow at 320px width and survive 200% text zoom.

## Before committing, verify

1. Run `node build/build.mjs` and check it completes. A second run must change nothing.
2. Deploy a preview with `vercel deploy --yes` (not `--prod` unless the user asks).
3. Run axe-core (WCAG 2a/2aa/21a/21aa/22aa tags) on every changed page at 100% zoom. Expect 0 violations.
4. Check titles and descriptions for length and uniqueness, exactly one h1, and no heading skips. Confirm new pages are in `sitemap.xml` and `llms.txt`.
5. Do a keyboard pass on anything interactive you touched.

## Content and privacy

- Don't publish personal contact details: no individual phone numbers or personal emails. Route enquiries to `/contact`.
- Team bios and photos come from the people's own LinkedIn profiles. Write descriptions in your own words; never copy profile text verbatim.
- Production deploys (`vercel deploy --prod`) and pushes to `main` happen only when the user asks.
