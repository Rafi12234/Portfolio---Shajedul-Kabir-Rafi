# Strict Section-by-Section Implementation V2

**Owner rejected whole-site generation. Never generate the complete portfolio in one pass.**

## 0 — Art direction
- [x] Owner selects October 2026 luxurious black/burgundy/cream editorial reference.
- [x] Owner dismisses entire coding/programming/terminal/VS Code/source-control theme.
- [x] Updated design/motion/section specification.
- [ ] Owner supplies approved high-quality Rafi portrait or approves type-only alternative.
- [ ] Compare two **original** poster-like hero composition designs (not pixel clones).
- [ ] Select font weights and verify licenses, crop, mobile breakpoints.
- [ ] Confirm exact hero heading, copy, career status and contact.

## 1 — Header + hero only
Art direct header/hero, define static responsive structure, typography tokens, burgundy backing, real portrait masks, CTAs and reveal timeline. Implement only these components. Test no-animation still screenshot FIRST, then polished GSAP/CSS choreography. Validate 320/360/390/768/1024/1440/1920, touch, keyboard, reduced motion, no JS. Present preview to owner; revise; **wait for explicit approval**. Lock approved section before other work.

## 2–10 — Individual chapters
Sequentially: What I Build → Selected Work → Inside Work → Approach & Toolkit → Experience → Research → Leadership → About & Recognition → Contact.

For EACH: confirm factual content/assets and rights; propose original desktop/mobile composition; define motion storyboard; implement ONLY chapter; browser screenshot check; accessibility and motion QA; owner approval; commit small reviewed change; proceed. No multi-section batching.

## Later
Dedicated work/research/about pages and case studies only when homepage visual grammar is stable. Validate production static build, truthful research statuses, font/image rights, performance and links before launch.

## Architecture
Astro static, TypeScript, CSS, selective interactive islands, GSAP ScrollTrigger for necessary motion; optional Lenis after real testing. No custom backend, DB, auth, fake counters or proprietary disclosures.

## Developer first task
Study docs/REFERENCE_ANALYSIS.md, docs/BRIEF.md, docs/DESIGN.md, docs/MOTION.md, docs/SECTION_BLUEPRINTS.md; propose TWO hero options then build ONE approved header+hero. **Do not generate other sections.**