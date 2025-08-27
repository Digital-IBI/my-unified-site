import { NextResponse } from 'next/server'
export async function GET() {
  try {
    const site = process.env.SITE_URL?.replace(/\/$/, '') || ''
    if (!site) return NextResponse.json({ error: 'Missing SITE_URL' }, { status: 500 })
    const res = await fetch(`${site}/sitemaps/manifest.json`, { cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ error: `manifest fetch failed: ${res.status}` }, { status: 500 })
    const manifest = await res.json()
    return NextResponse.json({ manifest })
  } catch (e:any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 })
  }
}
