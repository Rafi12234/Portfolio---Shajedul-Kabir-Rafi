# Portfolio Cloudinary migration

All 42 existing website image references are mapped to 41 uploaded Cloudinary assets at cloud `wujcxa24`. The one omitted upload, `rafi-portrait.webp`, is delivered by transforming the uploaded PNG into WebP for the existing Hero `<source type="image/webp">`.

The migration updates static and dynamic image paths, Project modal images, Research, Experience, Achievements, Client Projects, the Hero, brand artwork and CSS backgrounds. It retains original image files in `public/assets/` and the local CV PDF so rollback remains possible. The frontend contains **no API keys or secrets**.

Cloudinary formats and quality use `f_auto,q_auto:good`; responsive images use `c_limit,w_...` to avoid upscaling.

Validate with:

```sh
npm install
npm run build
npm run dev
```

Inspect the Hero, all project covers and popup, research cards, changing company backgrounds, award proof lightboxes, Client Projects popup and footer monogram, and confirm Cloudinary responses in the browser Network panel. Review mobile breakpoints. Vercel will redeploy after a push to `main`, if connected.

This commit was prepared with static source checks, but the full production Astro build and Cloudinary endpoint HTTP status were not executed here. Roll back if necessary using `git revert <commit-hash>` then push.
