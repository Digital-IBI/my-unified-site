import fs from 'fs'
import path from 'path'

const publicDir = path.join(process.cwd(), 'public')
const sitemapsDir = path.join(publicDir, 'sitemaps')
const manifestPath = path.join(sitemapsDir, 'manifest.json')

if (!fs.existsSync(sitemapsDir)) fs.mkdirSync(sitemapsDir, { recursive: true })

if (!fs.existsSync(manifestPath)) {
  const site = (process.env.SITE_URL || 'https://www.example.com').replace(/\/$/, '')
  const manifest = { entries: [{ url: `${site}/sitemaps/example.en.xml`, locale: "en", category: "example", count: 1, lastmod: new Date().toISOString() }] }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  const exampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${site}/</loc><lastmod>${new Date().toISOString()}</lastmod></url>
</urlset>`
  fs.writeFileSync(path.join(sitemapsDir, 'example.en.xml'), exampleXml)
  console.log('Wrote placeholder sitemaps manifest & example file.')
} else {
  console.log('Sitemaps manifest already exists, leaving as-is.')
}
