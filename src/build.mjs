#!/usr/bin/env node
// seo-kit: zero-dependency programmatic-SEO static generator.
// Reads data/site.json, emits dist/*.html + sitemap.xml + robots.txt.
// Per niche: replace data/site.json (and tweak the template below). No framework.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const dist = resolve(root, "dist");

const site = JSON.parse(readFileSync(resolve(root, "data/site.json"), "utf8"));
const base = site.baseUrl.replace(/\/$/, "");

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const urlFor = (slug) => (slug === "index" ? `${base}/` : `${base}/${slug}.html`);

function render(page) {
  const desc = page.intro || site.description || "";
  const canonical = urlFor(page.slug);
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: desc,
    url: canonical,
    isPartOf: { "@type": "WebSite", name: site.siteName, url: `${base}/` },
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}">
<meta name="theme-color" content="${esc(site.themeColor || "#000")}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:type" content="website">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<style>
:root{--c:${esc(site.themeColor || "#0b5cff")}}
*{box-sizing:border-box}body{font:16px/1.6 system-ui,sans-serif;margin:0;color:#111;background:#fff}
header,main,footer{max-width:760px;margin:0 auto;padding:1rem 1.25rem}
header{border-bottom:1px solid #eee}a{color:var(--c)}h1{margin:.2em 0}
nav a{margin-right:1rem;font-size:.95rem}footer{color:#777;font-size:.85rem;border-top:1px solid #eee;margin-top:2rem}
</style>
</head>
<body>
<header>
<strong>${esc(site.siteName)}</strong>
<nav>${site.pages.map((p) => `<a href="${esc(urlFor(p.slug))}">${esc(p.h1)}</a>`).join("")}</nav>
</header>
<main>
<h1>${esc(page.h1)}</h1>
<p>${esc(page.intro || "")}</p>
${page.body || ""}
</main>
<footer>${esc(site.tagline || "")} · ${esc(site.siteName)}</footer>
</body>
</html>`;
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

let written = 0;
for (const page of site.pages) {
  const file = page.slug === "index" ? "index.html" : `${page.slug}.html`;
  writeFileSync(resolve(dist, file), render(page));
  written++;
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${site.pages.map((p) => `  <url><loc>${esc(urlFor(p.slug))}</loc></url>`).join("\n")}
</urlset>
`;
writeFileSync(resolve(dist, "sitemap.xml"), sitemap);
writeFileSync(resolve(dist, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
// GitHub Pages: skip Jekyll processing.
writeFileSync(resolve(dist, ".nojekyll"), "");

console.log(`seo-kit: built ${written} page(s) + sitemap.xml + robots.txt → dist/`);
