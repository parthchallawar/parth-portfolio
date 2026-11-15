# Parth Challawar — Portfolio

Personal portfolio built with Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4,
Motion, GSAP + ScrollTrigger, Lenis, React Three Fiber and cmdk. Design direction: **"Verified Signal"**
(see `IMPLEMENTATION_PLAN.md`).

## Run locally

Requires Node 20+ (built with Node 22) and npm.

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint       # ESLint
npm run build      # production build (type-checks + lints)
npm start          # serve the production build
```

## Editing content

All copy lives in typed data files under **`src/content/`** — components contain no résumé text.

| File | What it holds |
|---|---|
| `profile.ts` | Name, headline (`*word*` renders in serif italic), rotating roles, summary (`*phrase*` = highlighted key phrase), email, social links, hero proof points, stat counters (each with a source label), About timeline |
| `experience.ts` | Roles: dates, stack, metric chips, bullets, and the skill ids used (drives "production" evidence) |
| `projects.ts` | Project cards and case studies: impact line, metrics, problem / approach / results, skill ids, which animated visual to show, and optional `repo`, `demo`, `image` links. **Buttons render only when a link exists.** |
| `skills.ts` | Skill list and categories. Evidence levels are *derived*: a skill used in an experience entry is "production", in a project is "shipped", otherwise "foundation". |
| `credentials.ts` | Certifications / papers (`url` optional — "Verify ↗" shows only when set) and education |
| `writing.ts` | Papers and engineering notes. `draft: true` shows a Draft badge, sets `noindex` and keeps the page out of the sitemap. |
| `site.ts` | Section numbering, nav labels and section headings |

Tech-radar values and constellation edges are computed from these files at build time, so they update
automatically.

## Environment variables

Copy `.env.example` to `.env.local` (and set the same values in Vercel):

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL for metadata, OG image, sitemap and robots. Defaults to `http://localhost:3000`. |
| `RESEND_API_KEY` | Optional | If set, `/api/contact` emails messages via Resend's REST API. If not, the form opens a prefilled `mailto:`. |
| `CONTACT_TO_EMAIL` | Optional | Recipient for contact messages (defaults to the email in `profile.ts`). |
| `CONTACT_FROM_EMAIL` | Optional | Sender address verified in Resend (defaults to `Portfolio <onboarding@resend.dev>`). |

## Adding a profile photo

Put a square image at **`public/profile.jpg`** and rebuild. The hero checks for the file at build time and
shows it inside the ring; until then a "PC" monogram is shown.

The résumé download is `public/resume.pdf` — replace that file to update it (note: the current PDF
includes a phone number; swap it if that should stay private).

## Deploying to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, **Add New → Project** and import the repository. The framework (Next.js) is detected
   automatically; keep the default build settings.
3. Under **Settings → Environment Variables** add `NEXT_PUBLIC_SITE_URL` (your production URL) and,
   optionally, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.
4. Deploy. Add a custom domain under **Settings → Domains** if wanted, then update
   `NEXT_PUBLIC_SITE_URL` and redeploy.

The GitHub contribution grid is fetched server-side and revalidated every 24 hours; if the API is
unreachable the section shows a link to the profile instead of an empty grid.

## Project structure

```
src/
  app/           routes: home, projects/[slug], writing, writing/[slug], api/contact, OG image, sitemap, robots
  components/
    providers/   theme, Motion config, Lenis + ScrollTrigger (SmoothScroll)
    layout/      Nav, Footer, Loader, CommandMenu (⌘K / Ctrl+K), CustomCursor, ScrollProgress, BackToTop, ThemeToggle
    primitives/  Section, Reveal, SplitText, Magnetic, TiltCard, Counter, GlassCard, Button, Badge
    three/       CanvasGate, HeroField, SkillConstellation (+ static SVG fallback)
    sections/    one component per home section
    visuals/     animated SVG project visuals (SMIL, paused off-screen, frozen under reduced motion)
    charts/      TechRadar, ContributionGrid
  content/       all copy (see above)
  hooks/  lib/
```

## Accessibility & motion

- `prefers-reduced-motion`: Lenis, loader, tilt, magnetic and parallax are off; reveals are instant; WebGL
  canvases are replaced by static fallbacks; project visuals freeze on an explanatory frame.
- Skip link, visible accent focus rings, focus trapped in the command menu and mobile menu, labelled icon
  buttons, `aria-hidden` canvases.
