# Artifacts, Screenshots & Permissions

> **V2 ASSET OVERRIDE:** Real, approved Rafi portrait is strongly preferred for giant cream masthead over burgundy disc; use beautiful typography-only fallback until obtained. All project imagery must be authentic and rights-cleared. No generated lookalike of reference portrait, no developer-stock tech photos. Rights-cleared Big Shoulders Display/Instrument Serif/Instrument Sans font candidates.

**Policy:** Actual software evidence is more distinctive than stock artwork. All imagery must support specific content, be rights-cleared and avoid disclosing client/private data.

## Needed assets by chapter

| Chapter | Preferred artifact | Possible fallback |
|---|---|---|
| Hero | One original author portrait (optional) or bespoke typographic composition | Type-only identity with source-control index rail |
| Dhaka Ladies Club | Sanitized booking states/calendar, approval flow screenshots | Author-designed schematic using fictional venue and sample dates |
| GoliTransit | Route screenshots, anonymized graph/ML flow and hackathon award proof | Original schematic labeled conceptual; no fake map prediction |
| AUSTRC mobile | High-resolution approved device screens, app icon, store listing if public | Captured app UI with private membership data removed |
| Sicko Soul | Approved storefront screenshots, typography and responsive examples | Text-only case study until client grants image rights |
| Make My Event | Clean module topology, anonymized operations flow | Diagram abstracted from public README, labeled illustrative |
| Research | Official paper title/abstract/DOI or event program; optional approved figure | Typeset research ledger; never generic medical imagery implying study results |
| Recognition | Real competition announcement/certificate | Plain-text claim supported by CV, modest scale |
| About / leadership | Approved club/event photos, university emblem permission | Editorial timeline; original vector shapes |

## Technical asset standards

- AVIF/WebP for photography and screenshots where quality allows; provide fallbacks for any browser constraints; retain lossless assets when text readability requires them.
- Crop/resize intentionally by viewport; use responsive `srcset`, fixed intrinsic dimensions, captions where context matters and descriptive alt text.
- Self-host approved fonts; check license and language coverage; use no downloaded paid font without rights.
- Prefer CSS/SVG/vector for grids, timelines and diagrams; do not use raster fake-code screenshots as substantive technical evidence.
- Avoid fullscreen video preloader, unnecessary autoplay loops and WebGL imagery with no fallback.
- Use fictional names, demo date/time and labels for interactive booking examples; disclose that they are synthetic and cannot book.
- For graph/network examples use bounded, well-documented example nodes; label illustrative simulated numbers.

## Privacy/security review before commit

- [ ] Remove customer names, emails, phones, booking references, account balances and transaction identifiers.
- [ ] Remove internal endpoints, privileged routes, bearer tokens, API keys, database credentials and stack traces containing paths.
- [ ] Remove sensitive research datasets/patient images and metadata without usage permission, especially medical images.
- [ ] Strip EXIF/geolocation from personal photography if not needed.
- [ ] Obtain explicit client/organization permission before revealing source design, logo, internal dashboard screenshot or commercial metrics.
- [ ] For each image record rights holder, permission, source, purpose, and permitted distribution.
- [ ] Verify photos aren't generated stock impersonations or misattributed works.
- [ ] If employer confidentiality rules conflict with website display, publish a generic, clearly abstracted schematic.

## Suggested asset registry fields

`id`, `path`, `source`, `owner`, `licenseOrPermission`, `creditRequired`, `approvalDate`, `projectId`, `isSynthetic`, `containsPersonalData`, `altText`, `aspectRatio`, `approvedForPublicSite`.

If `approvedForPublicSite` is not true, no public component should load the asset.

## No automatic import from GitHub

A public repository being visible does not imply that every screenshot, customer logo or third-party image in it is free to reuse. Do not bulk-copy images. Reuse only Rafi-owned or permission-cleared material and independently verify outside licenses.
