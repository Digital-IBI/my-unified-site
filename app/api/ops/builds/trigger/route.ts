import { NextResponse } from 'next/server'
import { triggerBuildByHook } from '@/lib/netlify'

export async function POST(req: Request) {
  try {
    const hook = process.env.BUILD_HOOK_URL!
    if (!hook) return NextResponse.json({ error: 'Missing BUILD_HOOK_URL' }, { status: 500 })
    const body = await req.json().catch(() => ({}))
    await triggerBuildByHook(hook, body?.reason || 'Ops UI manual trigger')
    return NextResponse.json({ ok: true })
  } catch (e:any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 })
  }
}
