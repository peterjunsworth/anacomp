# Anacomp website

Static site served by Vercel with clean URLs (`/team` serves `team.html`).

## Editing

- **Page copy** lives in the HTML files.
- **Navigation, home-page stages, packages, pricing, page titles/descriptions, people (for structured data)** live in `build/content.mjs`.
- After any edit, run the build and commit the result:

```sh
node build/build.mjs
```

The build pre-renders the header, footer and home-page content into the HTML (so search engines and AI agents see it without JavaScript), writes each page's `<head>` (canonical, Open Graph, Twitter and JSON-LD structured data), versions CSS/JS for caching, and regenerates `robots.txt`, `sitemap.xml`, `llms.txt` and `llms-full.txt`. Content between `<!-- build:x -->` markers is overwritten; edit everything else freely.

The canonical domain is set in `build/content.mjs` (`SITE.origin`).
