# seo-kit

Zero-dependency programmatic-SEO static site generator. Built for the money-1
**distribution** bet: spin up small, fast-to-publish tools/content sites that
capture cheap organic (SEO) traffic, deployed free on GitHub Pages.

## Use
1. Edit `data/site.json` — set `siteName`, `baseUrl`, and one `pages[]` entry per
   long-tail term you want to rank for (each becomes its own indexable HTML page
   with title, meta description, canonical URL, OpenGraph, and JSON-LD).
2. `node src/build.mjs` → outputs `dist/` (HTML + `sitemap.xml` + `robots.txt`).
3. Push to `main`. GitHub Actions (`.github/workflows/deploy.yml`) builds and
   deploys to GitHub Pages. No build dependencies, no spend.

## Per-niche reuse
Swapping niches = replacing `data/site.json` (and tweaking the inline template in
`src/build.mjs` if the layout needs to change). The generator is intentionally
tiny so a new niche goes from picked → live indexed URL in well under an hour.

## Not theater
Pages must be genuinely useful — thin/duplicate programmatic pages get deindexed.
The generator is the rail; the content per niche is what earns traffic.
