# Static Architecture & File Structure

## Architecture decision

**Default:** Astro + TypeScript + selectively hydrated React islands. Avoid Next.js full-app hydration or SSR infrastructure for a brochure/case-study site unless an unforeseen requirement justifies it. Astro can prerender routes to HTML with zero custom backend.

## Proposed repository structure (after scaffold)

```text
portfolio/
├── README.md
├── AGENTS.md
├── docs/                    # This specification pack
├── public/
│   ├── favicon.svg
│   ├── og/default.png
│   ├── resume.pdf          # Only after updated CV approval
│   └── media/               # Approved public assets only
├── src/
│   ├── assets/              # Astro-optimized images
│   ├── components/
│   │   ├── layout/          # SiteHeader, Footer, ChapterRail, Breadcrumbs
│   │   ├── ui/              # Link, Button, InlineCode, StatusLabel, Divider
│   │   ├── sections/        # Hero, WorkIndex, ResearchPreview, Roles, Contact
│   │   └── interactive/     # CommandIndex, BookingLifecycle, RouteExplorer, DiffViewer
│   ├── content/
│   │   ├── work/            # Curated case-study Markdown/MDX source
│   │   └── notes/           # Optional engineering notes later
│   ├── content.config.ts    # Zod schemas / content collections
│   ├── data/
│   │   ├── profile.ts
│   │   ├── experience.ts
│   │   ├── leadership.ts
│   │   ├── awards.ts
│   │   ├── research.ts
│   │   └── navigation.ts
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── WorkLayout.astro
│   ├── lib/
│   │   ├── motion/           # animation utilities, GSAP registration/cleanup
│   │   ├── command/          # immutable command registry
│   │   └── utils/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── research.astro
│   │   ├── work/index.astro
│   │   ├── work/[slug].astro
│   │   └── 404.astro
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── global.css
│   │   ├── typography.css
│   │   └── motion.css
│   └── tests/                # Unit/a11y smoke tests if adopted
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── .gitignore
```

Create folders **as needed**, not all upfront. Docs are complete specifications; build should begin with scaffold and a working, accessible hero.

## Data boundaries

- **Static content:** profile, roles, education, research metadata, projects, award records, navigation. Validate via TypeScript/Zod (Astro content collections for projects).
- **Client-only state:** currently selected chapter, active simulation branch, command palette open/closed, reduced-motion capability. No persistence unless genuinely needed.
- **External links:** normal `<a>` navigation to GitHub, published demos or permitted research publications. Never fetch private Drive documents at runtime.
- **API secrets:** none in the static website. Any research demos use locally packaged fixtures or screenshots and must be labeled illustrations.

## Suggested case-study schema

```ts
// Illustrative schema sketch; not a generated application file.
type CaseStudy = {
  slug: string;
  title: string;
  category: 'client' | 'professional' | 'academic' | 'club' | 'experiment';
  projectStatus: 'live' | 'completed' | 'prototype' | 'in-development' | 'unknown';
  visibility: 'public' | 'permission-needed' | 'private';
  summary: string;
  problem: string;
  ownership: string; // Exact personal contribution and collaborators
  technologies: string[]; // Only confirmed stack
  decisions: { constraint: string; choice: string; tradeoff: string }[];
  evidence: { type: string; href?: string; caption?: string }[];
  screenshots: { src: string; alt: string; permissionApproved: boolean }[];
  publishedAt?: string;
  verifiedAt?: string;
};
```

## Hydration decisions

| Component | Rendering |
|---|---|
| Header, hero, headings, work summaries, timelines | Astro HTML + CSS |
| Chapter rail | Prefer CSS/IntersectionObserver; no React unless necessary |
| Command palette | React `client:idle` or `client:load` if shortcut responsiveness demands |
| Booking Lifecycle | React `client:visible` |
| Route Explorer | React `client:visible` |
| Architecture / Diff Viewer | React only if interactive; static SVG for baseline |
| Motion sequences | Selective GSAP in lifecycle-aware modules; lazy initialize |

## Routing and deployment

- `output: 'static'`; all `/work/[slug]` routes must be generated during build.
- Choose GitHub Pages, Cloudflare Pages, Netlify, or Vercel *static output*; avoid server mode.
- Configure canonical production URL before generating canonical tags, `sitemap.xml`, and `robots.txt`.
- No route relies on a dynamic server rewrite unless hosting setup explicitly supports it.
- If work examples reference an actual backend project, that backend lives in its **separate repository**; the portfolio remains static.

## Dependency policy

Use one animation engine when justified. Avoid mixing Framer Motion, GSAP, Lenis and other scroll libraries without a clear scope map. Avoid shipping a syntax-highlighting engine to every visitor if only 1–2 static code examples need highlighted markup; preprocess at build. Don't ship a heavyweight map SDK for a small illustrative route graph.
