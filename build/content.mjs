/* Anacomp site content — the single source for navigation, home-page data,
   page metadata and structured data. Edit here, then run:  node build/build.mjs  */

export const SITE = {
  origin: "https://www.anacomp.com",
  /* Where images (share cards, logo, team photos) are fetched from. Social platforms and
     search engines need a URL that actually serves the file. Until www.anacomp.com points
     at this Vercel project, images load from the production Vercel URL. After the domain
     switch, delete this line (or set it to the origin). */
  assetOrigin: "https://anacomp.vercel.app",
  name: "Anacomp",
  legalName: "Anacomp, Inc.",
  tagline: "From raw records to public release",
  description:
    "Anacomp runs one information lifecycle pipeline for public agencies: records discovery, document scanning and digitization, PII redaction, Section 508 and ADA accessibility remediation, and an identity-verified public records portal, with Insignal analytics across every stage.",
  logo: "/assets/anacomp-logo-navy.png",
  ogImage: "/assets/og/anacomp-og.png",
  ogImageAlt: "Anacomp Information Lifecycle: from raw records to public release",
  themeColor: "#0F2238",
  twitter: "@AnacompInc",
  /* Official profiles (from the previous anacomp.com footer): footer icons + Organization.sameAs */
  social: [
    { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/company/anacomp" },
    { id: "x", label: "X (Twitter)", url: "https://twitter.com/AnacompInc" },
    { id: "facebook", label: "Facebook", url: "https://www.facebook.com/AnacompInc/" },
    { id: "youtube", label: "YouTube", url: "https://www.youtube.com/channel/UCqIiRb7JMq2vzk-8JLFneQA" }
  ],
  locale: "en_US",
  knowsAbout: [
    "Records management", "Data discovery", "Document scanning and digitization", "Intelligent document processing",
    "PII redaction", "FOIA and public records requests", "Section 508 accessibility", "ADA Title II compliance",
    "Accessible HTML remediation", "Records analytics"
  ]
};

/* Top-level navigation (clean URLs; Vercel serves /team from team.html) */
export const NAV = [
  { id: "clients", label: "Clients", href: "/clients" },
  { id: "team", label: "Team", href: "/team" },
  { id: "news", label: "News", href: "/news" },
  { id: "contact", label: "Contact", href: "/contact" }
];

export const STAGES = [
  {
    id: "discover", num: "01", name: "Discover", kicker: "Stage 1 · Discover",
    blurb: "Know what you hold before you move it",
    service: "Records and data discovery",
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
    blurb: "Bring paper into the digital flow",
    service: "Document scanning and digitization",
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
    blurb: "Remove what must not be released",
    service: "PII and sensitive-data redaction",
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
    blurb: "Turn any document into accessible data",
    service: "Section 508 and ADA document accessibility remediation",
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
      text: "Put an accessible assistant beside the HTML that ADA produces, on your own site or portal. Residents ask questions in plain language and get answers drawn from the document whenever needed."
    }
  },
  {
    id: "release", num: "05", name: "Release", kicker: "Stage 5 · Release",
    blurb: "Give the public a verified front door",
    service: "Public records request portal",
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
    blurb: "Ask your records program anything",
    service: "Records program analytics",
    title: "Ask your records program anything",
    desc: "Insignal builds a data warehouse from what the other stages produce and lets staff ask questions in plain English, then turn the answers into dashboards and alerts.",
    receive: ["Estate dashboards from Discover scans: growth, duplicates, risk", "Operations dashboards: request volumes, turnaround, backlog", "Questions answered in plain English, in the browser or in Teams and Slack"],
    powered: "Insignal, self-hosted in your own cloud",
    alone: "Leaders need to report on records work, or want answers from data that ADA has extracted.",
    leads: ["discover", "release"],
    leadsWhy: "Discover, to feed it the estate; Release, to measure every request."
  }
];
export const ORDER = STAGES.map(s => s.id);

export const PACKAGES = [
  { name: "Estate Assessment", stages: ["discover"], trigger: "Pre-migration or storage clean-up" },
  { name: "Records Insight", stages: ["discover", "analyze"], trigger: "Leaders need ongoing estate reporting" },
  { name: "Safe Share", stages: ["discover", "redact"], trigger: "Removing PII before sharing or AI use" },
  { name: "Paper to Accessible", stages: ["digitize", "remediate"], trigger: "File-room closure with an accessibility duty" },
  { name: "Request Response", stages: ["redact", "release", "analyze"], trigger: "A records-request backlog to clear and report on" },
  { name: "Accessible Release", stages: ["remediate", "release"], trigger: "Requests delivered in accessible form" },
  { name: "Accessible Answers", stages: ["remediate", "release"], addon: true, trigger: "Residents need answers from long documents, not just access" },
  { name: "Full Lifecycle", stages: ORDER, addon: true, trigger: "One vendor from paper intake to public release", featured: true }
];

export const QUOTES = [
  { q: "We’re moving to the cloud and don’t know what we have.", start: "Discover", then: "Redact, Remediate" },
  { q: "We have to close the file room.", start: "Digitize", then: "Remediate, Release" },
  { q: "We can’t keep up with records requests.", start: "Redact + Release", then: "Discover, Digitize" },
  { q: "We were told our documents aren’t accessible.", start: "Remediate", then: "Digitize, Release" },
  { q: "People need a secure way to ask for their records.", start: "Release", then: "Redact, Remediate" },
  { q: "We can’t tell leadership where our backlog stands.", start: "Analyze", then: "Discover, Release" }
];

export const PRICING = [
  { stage: "Discover", unit: "Per terabyte scanned", shape: "Fixed-fee assessment" },
  { stage: "Digitize", unit: "Per image, by document type", shape: "Backlog project or day-forward service" },
  { stage: "Redact", unit: "Per page, by review depth", shape: "Backlog project or per-request service" },
  { stage: "Remediate", unit: "Per page, by complexity", shape: "Backlog project, then subscription" },
  { stage: "Release", unit: "Annual fee plus request tiers", shape: "Subscription per agency" },
  { stage: "Analyze", unit: "Per seat, self-hosted licence", shape: "Annual subscription" },
  { stage: "Ask the Document", unit: "Annual fee per site, plus conversation tiers", shape: "Add-on subscription to Remediate", addon: true },
  { stage: "Full pipeline", unit: "Annual fee plus page volume", shape: "Multi-year managed service", full: true }
];

/* Every page the build touches. `path` is the public (clean) URL. */
export const ARTICLE_PATH = "/news/introducing-the-anacomp-information-lifecycle";
export const PAGES = [
  {
    file: "index.html", path: "/", short: "Home: the Information Lifecycle", nav: "home", type: "WebPage", css: ["styles.css"], js: ["home.js"],
    title: "Anacomp | Records Digitization, Redaction & 508 Remediation",
    description: "Records discovery, scanning, PII redaction, Section 508 remediation and an ID.me-verified records portal for public agencies, end to end or one stage at a time.",
    llms: "The Information Lifecycle: six stages, packages, pricing model, how a records request flows, and the 30-day pilot."
  },
  {
    file: "clients.html", path: "/clients", short: "Clients & case studies", nav: "clients", type: "CollectionPage", css: ["styles.css", "pages.css"], js: ["pages.js"],
    title: "Clients, Agencies & Case Studies | Anacomp",
    description: "Over 120 federal agencies, the U.S. military and Fortune 500 companies trust Anacomp. See the agencies served, case studies and credentials.",
    crumbs: [["Clients", "/clients"]],
    llms: "Track record: 58 named federal agencies of 120+ served, six past-performance case studies (Navy service treatment records, misfile correction, personnel, retirement and immigration records, Air Force data discovery) and security credentials."
  },
  {
    file: "team.html", path: "/team", short: "Leadership team & board", nav: "team", type: "AboutPage", css: ["styles.css", "pages.css"], js: ["pages.js"],
    title: "Leadership Team & Board of Directors | Anacomp",
    description: "Meet Anacomp’s leadership team and board of directors, the people accountable for every stage of the information lifecycle, from discovery to public release.",
    crumbs: [["Team", "/team"]],
    llms: "Leadership team, board of directors and what the team stands for."
  },
  {
    file: "news.html", path: "/news", short: "News & articles", nav: "news", type: "CollectionPage", css: ["styles.css", "pages.css"], js: ["pages.js"],
    title: "News on Records, Redaction & Accessibility | Anacomp",
    description: "Anacomp announcements and practical guidance on records management, PII redaction, Section 508 and ADA Title II accessibility, and public records requests.",
    crumbs: [["News", "/news"]],
    llms: "Company announcements and articles."
  },
  {
    file: "news/introducing-the-anacomp-information-lifecycle.html", path: ARTICLE_PATH, short: "Introducing the Anacomp Information Lifecycle", nav: "news", navCurrent: "true",
    type: "NewsArticle", css: ["styles.css", "pages.css"], js: ["pages.js"],
    title: "Introducing the Anacomp Information Lifecycle | Anacomp News",
    description: "Anacomp unites records discovery, digitization, redaction, accessibility remediation and public release in one pipeline for public agencies.",
    crumbs: [["News", "/news"], ["Introducing the Anacomp Information Lifecycle", ARTICLE_PATH]],
    article: { headline: "Introducing the Anacomp Information Lifecycle", datePublished: "2026-11-13", section: "Announcement" },
    llms: "Launch announcement explaining the five stages, Insignal analytics, ways to buy and the 30-day pilot."
  },
  {
    file: "contact.html", path: "/contact", short: "Contact & FAQ", nav: "contact", type: "ContactPage", css: ["styles.css", "pages.css"], js: ["pages.js"],
    title: "Contact Anacomp | Book a 30-Day Records Pilot",
    description: "Book a 30-day pilot on your own records, request pricing, or talk to Anacomp about your records program. A real person replies within one business day.",
    crumbs: [["Contact", "/contact"]],
    faq: true,
    llms: "Contact form, what happens next, and answers to common questions about buying, the pilot, pricing, custody and technology."
  },
  {
    file: "404.html", path: "/404", nav: "", type: "WebPage", css: ["styles.css", "pages.css"], js: [], noindex: true,
    title: "Page not found | Anacomp",
    description: "The page you were looking for isn’t here."
  }
];

/* People, for Person structured data (the team page HTML is the visible source) */
export const PEOPLE = [
  { name: "Tyler Dulmage", jobTitle: "Chief Executive Officer", image: "/assets/team/tyler-dulmage.jpg", sameAs: "https://www.linkedin.com/in/tylerdulmage/" },
  { name: "Tom Cunningham", jobTitle: "President", image: "/assets/team/tom-cunningham.jpg", sameAs: "https://www.linkedin.com/in/tom-cunningham-7874608/" },
  { name: "Peter Unsworth", jobTitle: "Chief Technology Officer", image: "/assets/team/peter-unsworth.jpg", sameAs: "https://www.linkedin.com/in/peterunsworth/" },
  { name: "Marie Hickey", jobTitle: "Senior Vice President, Corporate Development & Alliances", image: "/assets/team/marie-hickey.jpg", sameAs: "https://www.linkedin.com/in/marie-hickey-b200652/" },
  { name: "Brian O’Donnell", jobTitle: "VP Sales", image: "/assets/team/brian-odonnell.jpg", sameAs: "https://www.linkedin.com/in/brian-o-donnell-6853506/" },
  { name: "Lisa Basler", jobTitle: "Director – Human Resources", image: "/assets/team/lisa-basler.jpg", sameAs: "https://www.linkedin.com/in/lisa-basler-phr-shrm-cp-20802538/" },
  { name: "Gina Kenney", jobTitle: "Director – Professional Services", image: "/assets/team/gina-kenney.jpg", sameAs: "https://www.linkedin.com/in/gina-kenney-7561671/" },
  { name: "Alan B. Howe", jobTitle: "Chairman of the Board", image: "/assets/team/alan-howe.jpg", sameAs: "https://www.linkedin.com/in/alanhowe/", board: true },
  { name: "Jon Marcus", jobTitle: "Board Member", board: true }
];
