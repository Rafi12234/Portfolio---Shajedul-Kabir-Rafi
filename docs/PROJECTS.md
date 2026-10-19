# Project Audit, Editorial Selection & Case-Study Plan

**Snapshot:** 2026-10-19. **Sources:** CV (supplied images); GitHub repository listing, descriptions and selectively reviewed repository README files at https://github.com/Rafi12234; user-supplied client/production context. A README is documentation written by project maintainers, not independent proof that a deployment is live or a stated outcome has been measured.

## Selection philosophy

**Do not create 60 near-identical project cards.** Project curation should communicate 3 abilities: deliver functioning operational software; reason about intelligent systems; lead end-to-end implementations. Use 4–6 homepage projects and 3 deep case studies. Everything else belongs in an optional compact archive.

### Launch shortlist (proposed, not final public attribution)

| Priority | Project | Why this earns space | Evidence boundary / follow-up |
|---|---|---|---|
| A1 | Dhaka Ladies Club booking system | Operational workflow, real business constraints, admin/customer state | Repo README; confirm precise individual role, public client rights, real vs sandbox payment |
| A1 | GoliTransit | Routing/OSM/ML systems thinking and hackathon win | CV + detailed repo README; distinguish synthetic traffic/model claims |
| A1 | AUST Robotics Club mobile app | Independently built cross-platform product with real users as target | CV sole-developer assertion + Flutter README; verify app distribution and approved screens |
| A2 | Sicko Soul client website | Frontend visual craft, commercial-facing delivery | User says client work + repo docs; obtain screenshot/logo/brand permission, deployment confirmation |
| A2 | Make My Event office management | Systems engineering across many operational modules | README features; confirm Rafi contribution, status, confidentiality |
| A2 | Research-led project / EventLens AI | ML experimentation breadth, local semantic retrieval | GitHub project README; verify implementation and demo |
| B | Elite Convention Hall booking | Companion venue domain; a good paired comparison, but risks redundancy | Repo README appears partly cloned from DLC, verify differences and exact status |
| B | CareerPath | AI-augmented career development and modular API/UI | CV and repo stack conflict; verify architecture and contribution |
| B | AUSTRC management/official website | Team platform leadership and product ownership | Separate repos and team responsibilities; avoid double-counting same deliverable |

**Recommended homepage sequence:** show one operational system, one intelligent system and one sole-developer product first; follow with visual client work and a second business system. Link the rest from “Full archive.” The order can change with image quality and permission.

## Evidence labels

- **CV:** directly present in supplied résumé.
- **User:** expressly described in conversation.
- **Repo README:** project repository documents implementation, not external validation.
- **Repo metadata:** public repository existence/URL, not deployment confirmation.
- **Approval required:** contribution detail, commercial association, imagery or launch URL remains unconfirmed.

## Primary case study 01 — Dhaka Ladies Club Booking Management System

**Repo:** https://github.com/Rafi12234/Dhaka-Ladies-Club-Website

**Documented system:** React/Vite customer-facing frontend; Laravel/PHP API; MySQL; calendar availability, shift bookings, temporary booking holds, customer accounts, admin approval/rejection, manual/offline bookings, status history. Repo lists a DataPulse subdomain as homepage; do not state that it is currently serving real users without confirmation.

**Narrative angle:** *What makes a booking a transaction, not merely a form?* Map the lifecycle: slot appears available → a hold is attempted → expiry/payment state → pending approval → confirmed/rejected; expose the complexities of concurrency, operational rules and human workflows. The repository describes dummy payment options, so do not claim real payment processing or gateway reconciliation without proof.

**Potential artifact:** clickable **Booking Lifecycle** demonstrator with **synthetic records only**. On each state show authoritative actor, transition guard and failure/edge case. **Not** a live booking form.

**Needed from Rafi:** scope of individual work vs team work, actual production status, approved screenshots, client permission, toughest engineering decision, why holds were designed as they are, any real performance/usage evidence with rights to share.

## Primary case study 02 — GoliTransit

**Repo:** https://github.com/Rafi12234/Aust_hackathon_26

**CV-reported outcome:** Champion, AUST CSE Carnival 7.0 Hackathon (Apr 2026), team contribution/leadership.

**Repo-documented stack and mechanics:** React/Vite/Leaflet frontend, FastAPI/Python backend, OSMnx/NetworkX routing graph, mode-specific constraints, anomaly reweighting, asynchronous traffic-risk ML integration, caching/fallbacks. Repo describes a development graph of 2,741 nodes / 6,169 edges; such figures may depend on dataset/config and should not be advertised as a universal benchmark. README identifies traffic dummy data and modeled predictions. **Never describe dummy traffic labels as measured city-wide traffic feeds.**

**Narrative angle:** *What changes when an urban routing engine must explain anomalies and multiple transport modes?* Present actual decisions and limitations, including fallback behavior when ML processing is unavailable.

**Potential artifact:** **Routing Under Pressure**: locally simulated graph with 2–3 meaningful toggles (mode, blocked edge, congestion sample). Label all distances/ETAs/model outputs as illustrative unless exported from a tested build/dataset.

**Needed:** confirm team roster/your work split; use approved route map screenshots; exact deployment status; evaluation methodology, model type and test evidence; permission to reference event logos/certificates.

## Primary case study 03 — AUSTRC Official Mobile App

**Repo:** https://github.com/Rafi12234/AUST-Robotics-Club-Mobile-Application

**CV claim:** Sole developer covering requirements, Figma UX, Flutter implementation, APIs and app-store deployment. Repo confirms Flutter/Dart project with events, notifications, membership and club-related features, but **store URLs, current supported platforms and install numbers have not been verified**.

**Narrative angle:** *One developer, full product lifecycle.* Show real device compositions, information architecture, user journeys, implementation/maintenance decisions and team stakeholder collaboration.

**Needed:** public app-store links, permitted screenshots, shipping timeline, actual integrations, whether backend was implemented by Rafi or integrated from another team, download and engagement metrics only if substantiated.

## Secondary case study — Sicko Soul

**Repo:** https://github.com/Rafi12234/Sicko-Soul-Website

**Repo documented:** Next.js 15, React 19, TypeScript, Tailwind, GSAP, Lenis, OGL, Zustand, custom editorial streetwear layout/motion. Repository homepage string references `www.sickosoul.shop`, but **live URL was not independently tested**. User identifies this as client work.

**Value:** proves capability to deliver visually crafted frontend engineering beyond admin dashboards. A case study should explore performance decisions, responsive behavior and real user journeys. **Do not reuse the same brand's aesthetic for Rafi's portfolio.** Client brand assets are not automatically free to redistribute.

**Needed:** client approval, evidence of ownership, live URL confirmation, screenshots, whether built solo/with collaborators, measurable outcome (optional).

## Secondary case study — Make My Event Office Management

**Repo:** https://github.com/Rafi12234/Make-My-Event-Office-Management-System

**Repo documented:** complex internal system for clients, meetings, calls, attendance, accounts/expenses, vendors, calendars, admin and PDF proposal generation. README describes interconnected shared authentication, database and workflows. Descriptions are codebase scope—not necessarily proof that every module is in active client production.

**Value:** real business-domain modeling, authorization boundaries and modular systems design.

**Needed:** personal ownership, deployment/publicity clearance, data privacy safeguards, permission to show sanitized interface or architecture.

## Secondary case study — Elite Convention Hall booking

**Repo:** https://github.com/Rafi12234/Elite-Convention-Hall-Management-System

**Repo documented:** Laravel/MySQL + React booking and admin system, calendar and booking hold patterns. Some README paths, database names and storage keys still say Dhaka Ladies Club. **Treat reuse, relationship and distinct client features as unresolved**. Never frame it as an independently different architecture unless confirmed.

**Potential editorial treatment:** one **Venue Operations** collection grouping both installations/products, with a side-by-side explanation of reusable logic vs venue-specific requirements, if permitted.

## Secondary case study — CareerPath

**Repo:** https://github.com/Rafi12234/CareerPath-Ultimate-Solution-for-Youth-Career-Development

**CV description:** AI-powered cloud career platform using React, Node.js and REST APIs; JWT role support and job recommendations.

**Repository README description:** frontend React/Vite, backend **PHP Laravel 10**, MySQL 8; lists Rafi as “Lead Frontend & Backend Developer” in a named team. **Do not print Node.js as its verified backend without checking current branch/architecture.**

**Potential narrative:** personalization and skill-gap workflow, accountable use of AI recommendations, modular career tools.

## Other relevant GitHub project candidates

| Repository | Link | Available signal | Editorial classification |
|---|---|---|---|
| AUSTRC Website | https://github.com/Rafi12234/AustRC-Website | CV claims top contributor; README includes Figma source | Team website; clarify exact implementation |
| AUSTRC Management System | https://github.com/Rafi12234/AUST-Robotics-Club-Management-System | README: React + Express + PostgreSQL, event/admin/shared modules | Club operations and architecture |
| Custom CV Standardizer | https://github.com/Rafi12234/Custom-CV-Standardizer-for-DataPulse-Global | README: Python/Tkinter, Gemini PDF analysis, ReportLab PDF generation | Work automation; verify approved employer disclosure |
| SafePath BD | https://github.com/Rafi12234/SafePath-BD | README: ASP.NET Core MVC, OSRM, incident-aware route ranking, synthetic traffic data | Intelligent mobility research/prototype |
| EventLens AI | https://github.com/Rafi12234/EventLens-AI | README: OpenCLIP + LanceDB for local text-image retrieval | Local-first applied ML |
| NutriTrack | https://github.com/Rafi12234/NutriTrack | Flutter/Dart repository | Secondary mobile work; assess quality/content |
| StratifyAI | https://github.com/Rafi12234/StratifyAI | Repo exists | Inspect before stating scope |
| HerCue | https://github.com/Rafi12234/HerCue | Repo description: personal companion | Secondary product; inspect features first |
| Student Management System | https://github.com/Rafi12234/Student-Management-System-for-AUSTians | Repo exists | Archive unless deeper evidence available |
| Smart Inventory Demand Prediction | https://github.com/Rafi12234/Smart-Inventory-Demand-Prediction-Management-System | Repo exists | Archive/candidate pending audit |
| RAG Personalized Chat Bot | https://github.com/Rafi12234/RAG-Based-Personalized-Chat-Bot | Repo exists | Experiments archive; evidence pending |
| AI Deepfake Detection | https://github.com/Rafi12234/AI-ASSISTED-DEEPFAKE-IMAGE-AND-VIDEO-DETECTION-SYSTEM | Repo exists | ML experiments; verify methodology |
| Robomania 2.0 | https://github.com/Rafi12234/Robomania-2.0-Main-_WebApp | Repo exists | Engineering/club archive |

**Repository presence is not equivalent to sole authorship, completion, client approval or deployment.** Do not bulk-import GitHub metadata as a public accomplishment inventory.

## Case-study template

1. **The question:** one meaningful problem statement, clear audience.
2. **My involvement:** title, individual ownership, team composition, permitted client context.
3. **Constraints:** time, scale, data, device/performance, correctness or organizational constraints (facts only).
4. **System map:** approved, redacted actual architecture; illustrative diagrams must be labeled.
5. **Engineering decisions:** 2–3 precise tradeoffs, rejected alternatives, failure conditions.
6. **A closer look:** interaction or artifact tied to a real feature.
7. **Outcome:** shipped/current/prototype statuses, verified non-sensitive evidence. No made-up percent improvements.
8. **What I'd change:** candid reflection, lessons and next steps.
9. **Links:** GitHub, live demo, docs only if appropriate and verified.

## Publishing gates

- [ ] Rafi confirms public vs confidential projects and team contributions.
- [ ] All live links verified by opening; internal/admin URLs never linked casually.
- [ ] Brand and client identity permission captured.
- [ ] Screenshots sanitized (credentials, customer data, private maps/logs, internal URLs).
- [ ] Any traffic/model numbers labeled correctly.
- [ ] Three case studies have actual personal decisions and evidence, not README paraphrases.
- [ ] Unverified repo projects stay in quiet archive instead of making homepage bloated.
