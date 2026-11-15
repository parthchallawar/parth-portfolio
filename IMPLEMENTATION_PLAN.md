# Parth Challawar — Portfolio: Implementation Plan

Planned by Fable 5.2. Built by Opus. This file is the single source of truth for the build.

## 1. What this site has to do

A recruiter gives it 30 seconds. In that time it must say three things, in this order:

1. **Founding engineer with a product in production** — Tastify: 3 restaurants live, 500+ orders.
2. **Builds backends that stay correct under concurrency** — RLS tenant isolation, Redis distributed locks, job queues.
3. **Builds AI that can be trusted** — RAG with verified citations, hallucination checks, human-in-the-loop.

Every design and animation decision serves those three. Anything that is only decoration gets cut.

## 2. Design direction — "Verified Signal"

Not the default purple-gradient-on-black AI portfolio. The identity comes from Parth's actual work: systems where
every order, lock and citation is *checked*.

- **Motif:** telemetry. Thin hairlines, monospace readouts (`p99 < 20ms`, `orders: 500+`), small "verified" tick
  marks, a status dot that pulses. Section labels are numbered like log lines: `01 / ABOUT`.
- **Colour (dark, default):** ink `#08090B` background, `#0F1114` raised surface, `#1B1E24` hairline,
  text `#EDEEF0`, muted `#8A8F98`. **One accent:** signal lime `#C6F432`, used sparingly (CTAs, active states,
  verified ticks, the cursor). Secondary glow only: ice `#7DD3FC` at low opacity in gradients.
- **Colour (light):** paper `#F6F5F1`, surface `#FFFFFF`, hairline `#E2E0DA`, text `#111214`,
  accent darkened to `#4D7C0F` so it passes AA contrast on paper.
- **Type:** *Instrument Serif* (italic, for the emphasised word in each headline) + *Geist Sans* (everything
  else) + *Geist Mono* (labels, metrics, badges). All via `next/font`. Headline scale uses `clamp()`,
  hero up to ~9rem, tracking tight (-0.04em).
- **Surfaces:** glass is used on exactly three things — nav pill, command menu, project cards
  (`backdrop-blur`, 1px gradient border, faint inner highlight). Not on everything.
- **Motion character:** fast and precise. Ease `cubic-bezier(0.16, 1, 0.3, 1)`, durations 0.5–0.9s,
  stagger 40–70ms. Nothing bounces.

All colours are CSS variables in `globals.css` (`--bg`, `--surface`, `--line`, `--fg`, `--muted`, `--accent`,
`--glow`), mapped into Tailwind v4 via `@theme inline`. Components never hardcode hex.

## 3. Stack and who owns what

| Library | Version | Owns | Must not do |
|---|---|---|---|
| Next.js (App Router) | 15.x | routing, metadata, fonts, images, route handlers | — |
| React / TypeScript | 19 / 5.x strict | — | no `any` |
| Tailwind CSS | 4.x | all styling, tokens | no CSS-in-JS |
| `motion` (Framer Motion) | 12.x | enter/exit, hover, layout, `AnimatePresence`, counters | scroll-scrubbed timelines |
| GSAP + ScrollTrigger | 3.x | scroll-scrubbed and pinned sequences, split-text reveals | simple hover/enter |
| Lenis | 1.x | smooth scroll; drives ScrollTrigger via `gsap.ticker` | — |
| three / R3F / drei | r17x / 9.x | hero particle field, skill constellation | anything else |
| cmdk | 1.x | command menu | — |
| next-themes | 0.4.x | dark/light | — |
| lucide-react | latest | icons | — |

One rule prevents the usual jank: **Lenis is the only scroll source, GSAP is the only thing that reads scroll
position, Motion never touches scroll-scrub.** Wire once in `SmoothScroll.tsx`:
`lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0)`.

Scaffold: `npx create-next-app@15 . --ts --tailwind --app --src-dir --eslint --no-turbopack --import-alias "@/*"`
then `npm i motion gsap lenis three @react-three/fiber @react-three/drei cmdk next-themes lucide-react clsx tailwind-merge`
and `npm i -D @types/three`.

## 4. Folder structure

```
src/
  app/
    layout.tsx            fonts, metadata, providers, JSON-LD
    page.tsx              composes home sections
    template.tsx          page-transition wrapper
    globals.css           tokens, base, utilities
    projects/[slug]/page.tsx   case study (generateStaticParams)
    writing/page.tsx           research + notes index
    writing/[slug]/page.tsx
    api/contact/route.ts
    opengraph-image.tsx   generated OG image
    sitemap.ts  robots.ts  not-found.tsx
  components/
    providers/   ThemeProvider, SmoothScroll, MotionConfig
    layout/      Nav, Footer, ScrollProgress, BackToTop, Loader, CommandMenu, CustomCursor, ThemeToggle
    primitives/  Section, SectionLabel, Reveal, SplitText, Magnetic, TiltCard, Counter, Badge, Button, GlassCard
    three/       HeroField, SkillConstellation, CanvasGate
    sections/    Hero, About, Skills, Experience, Projects, GitHubActivity, Credentials, Education, Writing, Contact
    charts/      TechRadar, ContributionGrid
  content/       profile.ts, experience.ts, projects.ts, skills.ts, credentials.ts, writing.ts
  hooks/         useReducedMotion, useMediaQuery, useMousePosition, useInViewOnce
  lib/           cn.ts, github.ts, seo.ts
public/          resume.pdf, profile.jpg (optional), favicon
```

**All copy lives in `src/content/*.ts` as typed data.** Components contain no resume text. Updating the
portfolio later means editing data files only.

## 5. Content (extracted from the resume — do not invent beyond this)

**Identity**
- Name: Parth Challawar (full: Parth Ravindra Challawar). Pune, India.
- Headline: `Founding engineer building *concurrency-safe* backends and AI you can *verify*.`
- Role line (rotating): Founding Software Engineer @ Tastify · Backend & Distributed Systems · RAG & Agentic AI
- Email: parthchallawar04@gmail.com. **Do not print the phone number on the site.**
- Links: linkedin.com/in/parth-challawar-b10107331 · github.com/parthchallawar · leetcode.com/u/parthc31

**Summary (rewritten):** Final-year B.Tech CSE (AI & ML) student at VIT Pune and founding engineer at Tastify,
a restaurant-ordering SaaS live with three partners. I build backends that stay correct under concurrent load
and AI systems that show their sources — RAG pipelines with verified citations, hallucination checks and
human-in-the-loop review. 300+ LeetCode problems, two published research papers, at home in Linux and Docker.

**Stats (animated counters, each with its source label):**
`9.04` CGPA · `300+` LeetCode solved · `500+` orders processed · `3` restaurants live · `2` research papers ·
`99%` print delivery < 2s

**Experience — Tastify, Founding Software Engineer, May 2026 – Present, Pune**
Multi-tenant restaurant ordering SaaS. Next.js, TypeScript, Supabase (PostgreSQL), Vercel, Cloudflare.
- Shipped a multi-tenant ordering SaaS now live with 3 restaurant partners and 500+ orders processed.
- Designed the real-time ordering flow (table sessions, carts, kitchen orders, billing) on PostgreSQL
  Row-Level Security for tenant isolation; concurrency-safe session handling eliminated duplicate and stale
  orders across 200+ concurrent sessions.
- Built a Node.js print bridge from a PostgreSQL job queue to thermal printers for KOT and bill printing;
  auto-retries deliver 99% of tickets in under 2 seconds.

**Projects**
1. **Wanderlust — Distributed Vacation Rental Platform.** Node.js, REST, Redis, MongoDB, Cassandra, Socket.IO,
   BullMQ, Docker. Redis distributed locking eliminates double-booking across load-balanced instances;
   designed for 10k+ concurrent users at sub-20ms latency (cache-aside, rate limiting, Redis Pub/Sub chat,
   async notifications, append-only Cassandra message store).
   Repo: none linked yet (not `Psedo-AirBnb`; Parth to supply the correct URL).
2. **Legal AI Judge — Online Dispute Resolution.** LangGraph, Gemini, RAG, Prisma, SQLite. Agentic graph with
   routing, mediation, evidence-check, judge and bias-audit nodes plus a judge/co-judge review loop; HITL
   mediation on LangGraph checkpoints that survives server restarts; Corrective RAG with Gemini embeddings,
   PDF/image evidence, verified citations.
   Repo: `github.com/parthchallawar/Legal-AI-Judge-Despute-resolver-`.
3. **ContractAI — Contract Analysis Platform.** Hybrid RAG, BM25, MiniLM, Reciprocal Rank Fusion, Prisma.
   Role-based analysis for Investor / Legal / PM / Partner; hallucination checks verify every quoted clause
   and monetary figure against source; streaming chatbot with memory, clickable citations, LLM-provider
   fallback. Published as a research paper.
   Repo: `github.com/parthchallawar/contract_AI`.
4. **Tastify** also appears as a featured project card (links to its experience entry; no public repo).

`Project` type has optional `repo`, `demo`, `image`. **Buttons render only when the field exists** — no dead
"Live demo" links. No screenshots exist yet, so each card gets a generated visual instead (see §6.5).

**Skills (categories from resume)**
- Languages: Java, C, C++, Python, JavaScript, TypeScript, SQL
- Core CS: Data Structures, Algorithms, OOP, DBMS, Operating Systems
- Backend & Data: Node.js, Express.js, REST APIs, PostgreSQL, Supabase, MySQL, MongoDB, Redis, Cassandra
- Frontend: React.js, Next.js
- Cloud & DevOps: Vercel, Cloudflare, Linux, Docker, Git, GitHub
- AI/ML: Generative AI, RAG, Agentic Workflows (LangGraph), Prompt Engineering, LLM Integration

**No invented percentages.** Each skill carries an evidence level derived from the resume:
`production` (used at Tastify) · `shipped` (used in a project) · `foundation` (coursework / DSA).
The "progress indicator" is a 3-segment meter showing that level, and the tooltip names where it was used.
This is more credible to an engineer reading it than "Java 85%".

**Credentials**
- AWS Educate Cloud Certification — Amazon Web Services *(no verify URL yet; field optional)*
- 300+ LeetCode problems (arrays, graphs, trees, DP, greedy) → links to LeetCode profile
- Paper: *Sewer Pipeline Defect Detection with Temporal Event Consolidation* (Computer Vision)
- Paper: *ContractAI* (Hybrid RAG)

**Education:** Vishwakarma Institute of Technology, Pune — B.Tech CSE (AI & ML), expected May 2027, CGPA 9.04/10.

**Writing section:** Parth has no blog posts, and inventing posts would be fabrication. The section is
"Research & Notes": the two papers as entries (title, field, one-line abstract from resume facts, optional
`url`), plus three short engineering notes written **only from resume facts**, each flagged `draft: true` in
data so Parth can review before publishing:
"Stopping double-bookings with Redis locks", "Pausing an AI workflow for a human", "Making a RAG system prove
its quotes". 150–250 words each, no claims beyond the resume.

## 6. Sections

Home is one scrolling page; nav anchors scroll via Lenis. Section order below.

**6.1 Hero** — full viewport. R3F particle field behind (≈4k points desktop / 1.2k mobile, slow drift, bends
away from the pointer, lime-tinted near the cursor). Top-left mono status: `● available for 2027 roles`.
Headline reveals line-by-line with GSAP SplitText-style masked lines; serif-italic words land last. Rotating
role line. CTAs: **View work** (magnetic, accent) and **Download résumé** (ghost). Right side: portrait slot —
`public/profile.jpg` if present, otherwise a glowing "PC" monogram in a ring with a rotating conic-gradient
border and orbiting ticks. Bottom: a marquee strip of the six stats in mono. Scroll cue.

**6.2 About** — two columns. Left: summary, with key phrases highlighting as they scroll into the centre of
the viewport (GSAP scrub on word opacity). Right: six stat tiles with `Counter` (counts once in view, respects
reduced motion). Below: a horizontal 4-stop interactive timeline — 2023 joined VIT · papers published ·
May 2026 founded Tastify's engineering · May 2027 graduating — click/hover a stop to swap the detail panel
(`layoutId` underline). *Only the two dated facts on the resume have dates; the others show no year.*

**6.3 Skills** — tabbed by category (Motion `layoutId` pill). Skill cards with the 3-segment evidence meter
and hover tooltip. Beside it, the **constellation**: R3F scene, one node per skill, clustered by category,
edges between skills that co-occur in a project; hovering a card highlights its node and edges, and vice
versa. Below 768px the constellation is replaced by a static SVG. Then the **Tech radar** (SVG, six axes =
categories, value = share of projects/experience using that category, computed from `content/`, drawn with a
path-length animation).

**6.4 Experience** — vertical timeline; the line draws with scroll (GSAP scrub on `scaleY`). Tastify card:
role, dates, stack badges, three metric chips (`3 restaurants`, `500+ orders`, `99% < 2s`). Expand
(`AnimatePresence`, height auto) reveals the three bullets plus a small animated diagram of the order →
queue → printer flow (inline SVG, dashes travelling along the path).

**6.5 Projects** — the showpiece. Four large `TiltCard`s (pointer-driven `rotateX/Y` ≤ 8°, moving specular
glare, inner layers at different `translateZ` for parallax). Because there are no screenshots, each card has
a **purpose-built animated SVG visual** that explains the project:
- Wanderlust — two requests race for one booking slot; a lock closes; one passes, one is turned away.
- Legal AI Judge — the LangGraph node graph with a token moving through it, pausing at the human node.
- ContractAI — a document with clauses; quoted lines get a verified tick one by one.
- Tastify — table → cart → kitchen ticket flowing, with a tenant boundary around it.
Each card: title, one-line impact, tech badges, GitHub button, "Case study →" to `/projects/[slug]`.
Case-study page: problem → approach → architecture visual → results (all from resume facts) → next project.

**6.6 GitHub activity** — `ContributionGrid` from `https://github-contributions-api.jogruber.de/v4/parthchallawar?y=last`,
fetched server-side with `next: { revalidate: 86400 }`. Cells fade in column-by-column. If the fetch fails the
section renders a compact fallback linking to the profile — never a broken grid. LeetCode is shown as a
static `300+` tile linking to the profile (no reliable public API).

**6.7 Credentials** — cards with a badge glyph, issuer, and a "Verify ↗" link only where a URL exists.
Papers get a "Paper" badge. Hover: border sweep.

**6.8 Education** — single elegant card: institution, degree, a CGPA ring (SVG arc animating to 9.04/10),
expected graduation.

**6.9 Research & Notes** — three latest entries as rows; hover reveals an arrow and shifts the title.
Links to `/writing`.

**6.10 Contact** — large headline ("Let's build something that *holds up*."), form (name, email, message)
with floating labels, inline validation, honeypot field. Submits to `/api/contact`:
if `RESEND_API_KEY` is set it emails via Resend's REST API (plain `fetch`, no SDK); if not, it returns
`{ fallback: "mailto" }` and the client opens a prefilled `mailto:`. Success: the button morphs into a drawn
checkmark. Social links as magnetic icon buttons. Copy-email button with "copied" feedback.

## 7. Global features

- **Loader** — ≤ 1.2s: mono counter 0→100 with the "PC" mark, then a curtain wipe. Runs once per session
  (`sessionStorage`), skipped under reduced motion.
- **Nav** — floating glass pill, hides on scroll down / shows on scroll up, active section indicator
  (IntersectionObserver), `⌘K` hint, theme toggle. Mobile: full-screen menu with staggered links.
- **Command menu** (`cmdk`, ⌘K / Ctrl+K) — jump to section, open project, toggle theme, copy email,
  download résumé, open GitHub / LinkedIn / LeetCode.
- **Custom cursor** — small dot + trailing ring (spring), grows over interactive elements, shows a label
  over project cards ("View"). Enabled only when `(hover: hover) and (pointer: fine)`; native cursor stays
  otherwise.
- **Scroll progress** — 2px accent bar at top (`scaleX` from Lenis progress).
- **Back to top** — appears after 1 viewport; circular progress ring around the arrow; magnetic.
- **Theme toggle** — next-themes, `class` strategy, default dark, circular reveal via View Transitions API
  where supported.
- **Page transitions** — `template.tsx` fade/slide-up on route enter (kept simple and robust on App Router;
  no exit-animation hacks).
- **Background** — fixed layer: two very slow drifting radial gradients + faint noise texture (inline SVG
  filter). Pure CSS, no JS.
- **Download résumé** — `public/resume.pdf`, in hero, nav menu, command menu and footer.

## 8. Reusable primitives (build these first)

`Reveal` (fade+rise on view, stagger children) · `SplitText` (masked line/word reveal, own implementation —
GSAP's SplitText plugin not required) · `Magnetic` (pointer attraction with spring return) · `TiltCard` ·
`Counter` · `GlassCard` · `Button` (variants: accent, ghost, icon) · `Badge` · `Section` + `SectionLabel`.
Every primitive takes `className`, respects `useReducedMotion`, and is a client component only if it must be.

## 9. Performance, accessibility, SEO — acceptance criteria

- `npm run build` passes with zero type and lint errors.
- Sections are server components; only interactive leaves are `"use client"`.
- R3F canvases load through `next/dynamic` (`ssr: false`) behind `CanvasGate`: mounts only when in view,
  `frameloop` paused when off-screen or tab hidden, DPR capped at 1.5, skipped entirely under reduced motion
  or on low-end devices (`hardwareConcurrency ≤ 4`) in favour of a CSS gradient.
- Animate only `transform` and `opacity`. No layout shift: CLS < 0.05. Target Lighthouse ≥ 90 performance on
  desktop, ≥ 95 accessibility, 100 SEO.
- `prefers-reduced-motion`: Lenis off, loader skipped, parallax/tilt/magnetic off, reveals become instant.
- Full keyboard path: skip-to-content link, visible focus rings (accent), focus trapped in command menu and
  mobile nav, `aria-expanded` on expandables, canvases `aria-hidden`, all icon buttons labelled.
- Colour contrast AA in both themes.
- Responsive at 360, 768, 1024, 1440, 1920. No horizontal scroll at any width.
- SEO: `metadata` with title template, description, canonical, Open Graph + Twitter, generated OG image,
  `sitemap.ts`, `robots.ts`, JSON-LD `Person` schema (name, jobTitle, alumniOf, sameAs). Site URL from
  `NEXT_PUBLIC_SITE_URL`.

## 10. Build order

1. Scaffold, install, fonts, tokens, `cn`, theme provider. Verify dev server boots.
2. `content/*.ts` with all types and data from §5.
3. Primitives (§8) + `SmoothScroll`.
4. Layout shell: background, Nav, Footer, ScrollProgress, BackToTop, ThemeToggle, CustomCursor.
5. Hero (static first, then particle field).
6. About → Experience → Projects (cards + SVG visuals) → Skills (cards, radar, then constellation).
7. GitHub activity, Credentials, Education, Writing, Contact + API route.
8. `/projects/[slug]`, `/writing`, `/writing/[slug]`, `not-found`.
9. Loader, CommandMenu, page transitions.
10. SEO files, reduced-motion pass, responsive pass, light-theme pass.
11. `npm run build`, fix everything, write `README.md` (run, edit content, env vars, deploy).

## 11. Deployment

Vercel: push to GitHub → import repo → framework auto-detected → set `NEXT_PUBLIC_SITE_URL` and optionally
`RESEND_API_KEY` + `CONTACT_TO_EMAIL` → deploy. Add a custom domain afterwards if wanted.

## 12. Needs Parth's input (site works without these)

- A profile photo → `public/profile.jpg` (monogram shown until then).
- The correct Wanderlust repo URL; live demo URLs if any exist.
- AWS Educate verification link; links to the two papers.
- Project screenshots (the SVG visuals stand in, and arguably read better).
- Review the three draft notes before treating them as published.
- The downloadable résumé PDF includes the phone number — swap the file if that should stay private.
