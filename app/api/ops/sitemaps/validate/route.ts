import { NextResponse } from 'next/server'
import { DOMParser as XmldomParser } from '@xmldom/xmldom'

export async function POST(req: Request) {
  try {
    const site = process.env.SITE_URL?.replace(/\/$/, '') || ''
    if (!site) return NextResponse.json({ error: 'Missing SITE_URL' }, { status: 500 })
    const body = await req.json().catch(() => ({}))
    const files: string[] = body?.files || []

    const issues: Array<{ file: string; problem: string }> = []
    const parser = new XmldomParser()

    for (const file of files) {
      const url = file.startsWith('http') ? file : `${site}${file}`
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) { issues.push({ file, problem: `HTTP ${res.status}` }); continue }
      const xml = await res.text()
      const doc = parser.parseFromString(xml, 'text/xml')
      const urlset = doc.getElementsByTagName('urlset')
      const index = doc.getElementsByTagName('sitemapindex')
      if (!urlset.length && !index.length) issues.push({ file, problem: 'Not a valid sitemap or index' })
    }

    return NextResponse.json({ ok: true, issues })
  } catch (e:any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 })
  }
}
