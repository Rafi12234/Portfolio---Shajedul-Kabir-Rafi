# Optional validation

```bash
python -m unittest discover -s tests -v
# Type check (requires system TypeScript compiler):
tsc --noEmit --lib es2022,dom --target es2022 --module esnext src/scripts/scroll-budget.ts
# Optional isolated browser smoke (requires Playwright and Chromium):
tsc --module esnext --target es2022 --lib es2022,dom --outDir tests/build-ts src/scripts/scroll-budget.ts
python tests/smoke_browser.py
```

`npm ci && npm run build` should be run inside the **complete original repository after applying the update**, not inside this update package.
