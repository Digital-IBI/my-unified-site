import { NextResponse } from 'next/server'
import { listBuilds } from '../../../../../lib/netlify'

export async function GET() {
  try {
    const siteId = process.env.NETLIFY_SITE_ID!
    const token = process.env.NETLIFY_PERSONAL_TOKEN!
    if (!siteId || !token) return NextResponse.json({ error: 'Missing NETLIFY_SITE_ID or token' }, { status: 500 })
    const data = await listBuilds(siteId, token, 15)
    return NextResponse.json({ builds: data })
  } catch (e:any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 })
  }
}
