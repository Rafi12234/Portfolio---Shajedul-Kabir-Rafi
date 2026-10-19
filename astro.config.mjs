import { defineConfig } from 'astro/config';

// Fully prerendered static page; no SSR or API routes.
export default defineConfig({ output: 'static' });
