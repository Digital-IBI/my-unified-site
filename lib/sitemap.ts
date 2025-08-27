import fs from "fs"
import path from "path"

type Entry = { loc: string; lastmod?: string }

// Write sitemap to file (existing functions)
export function writeUrlset(filePath: string, urls: Entry[]) {
  const xml = generateUrlsetXml(urls)
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, xml)
}

export function writeIndex(filePath: string, sitemaps: Entry[]) {
  const xml = generateIndexXml(sitemaps)
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, xml)
}

// Generate XML strings (new functions for API routes)
export function generateUrlsetXml(urls: Entry[]): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls.map(u => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`),
    '</urlset>'
  ].join("\n")
}

export function generateIndexXml(sitemaps: Entry[]): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemaps.map(s => `  <sitemap><loc>${s.loc}</loc>${s.lastmod ? `<lastmod>${s.lastmod}</lastmod>` : ""}</sitemap>`),
    '</sitemapindex>'
  ].join("\n")
}
