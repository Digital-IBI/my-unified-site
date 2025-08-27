'use client'
import { useEffect, useMemo, useState } from 'react'
import { Play, RefreshCw, CheckCircle2, ShieldAlert, ExternalLink, FileSearch } from 'lucide-react'

type Build = { id: string; state: string; commit_ref?: string; commit_id?: string; deploy_time?: number; created_at?: string; context?: string; branch?: string }
type ManifestEntry = { url: string; lastmod?: string; locale?: string; category?: string; count?: number }

export default function OpsDashboard() {
  const [builds, setBuilds] = useState<Build[] | null>(null)
  const [manifest, setManifest] = useState<{ entries: ManifestEntry[] } | null>(null)
  const [busy, setBusy] = useState(false)
  const [validateBusy, setValidateBusy] = useState(false)
  const [issues, setIssues] = useState<{ file: string; problem: string }[] | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const load = async () => {
    setMessage(null)
    const [b, m] = await Promise.all([
      fetch('/api/ops/builds/list').then(r => r.json()).catch(() => ({ builds: [] })),
      fetch('/api/ops/sitemaps/list').then(r => r.json()).catch(() => ({ manifest: { entries: [] } }))
    ])
    setBuilds(b.builds || [])
    setManifest(m.manifest || { entries: [] })
  }
  useEffect(() => { load() }, [])

  const triggerBuild = async () => {
    setBusy(true); setMessage(null)
    const r = await fetch('/api/ops/builds/trigger', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ reason: 'Manual trigger from /ops' }) })
    const d = await r.json(); setBusy(false)
    if (d?.error) setMessage(`Build trigger failed: ${d.error}`); else setMessage('✅ Build triggered')
  }

  const validateSitemaps = async () => {
    if (!manifest?.entries?.length) { setIssues([{ file: 'manifest', problem: 'No sitemap entries present' }]); return }
    setValidateBusy(true); setIssues(null); setMessage(null)
    const files = manifest.entries.map(e => e.url)
    const r = await fetch('/api/ops/sitemaps/validate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ files }) })
    const d = await r.json(); setValidateBusy(false)
    if (d?.error) setMessage(`Validation error: ${d.error}`); else { setIssues(d.issues || []); if (!d.issues?.length) setMessage('✅ Sitemaps look good') }
  }

  const lastBuild = useMemo(() => builds?.[0], [builds])
  const sitemapCounts = useMemo(() => {
    const total = manifest?.entries?.length || 0
    const byLocale = new Map<string, number>()
    const byCategory = new Map<string, number>()
    manifest?.entries?.forEach(e => {
      if (e.locale) byLocale.set(e.locale, (byLocale.get(e.locale) || 0) + 1)
      if (e.category) byCategory.set(e.category, (byCategory.get(e.category) || 0) + 1)
    })
    return { total, byLocale: Array.from(byLocale), byCategory: Array.from(byCategory) }
  }, [manifest])

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Ops Dashboard</h1>
        <div className="flex gap-2">
          <button 
            onClick={load} 
            disabled={busy || validateBusy}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className="mr-2 h-4 w-4 inline" /> Refresh
          </button>
          <button 
            onClick={triggerBuild} 
            disabled={busy}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/90 disabled:opacity-50"
          >
            <Play className="mr-2 h-4 w-4 inline" /> Trigger Build
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-green-800">{message}</span>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Last Build</h2>
          {!lastBuild ? (
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded ${lastBuild.state === 'ready' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {lastBuild.state}
                </span>
                <span className="text-sm text-gray-500">{lastBuild.branch ? `branch: ${lastBuild.branch}` : ''}</span>
              </div>
              <div className="text-sm">Commit: <span className="font-mono">{lastBuild.commit_ref || lastBuild.commit_id || '—'}</span></div>
              <div className="text-sm">Duration: {formatSeconds((lastBuild.deploy_time || 0) / 1000)}</div>
              <div className="text-sm text-gray-500">Created: {lastBuild.created_at ? new Date(lastBuild.created_at).toLocaleString() : '—'}</div>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Sitemaps Summary</h2>
          {!manifest ? (
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm">Total files: <strong>{sitemapCounts.total}</strong></div>
              <hr className="my-3" />
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-500">By Locale</div>
                <div className="flex flex-wrap gap-2">
                  {sitemapCounts.byLocale.length ? sitemapCounts.byLocale.map(([loc, n]) => (
                    <span key={loc} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">{loc}: {n}</span>
                  )) : <span className="text-sm text-gray-500">—</span>}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-500">By Category</div>
                <div className="flex flex-wrap gap-2">
                  {sitemapCounts.byCategory.length ? sitemapCounts.byCategory.map(([cat, n]) => (
                    <span key={cat} className="px-2 py-1 text-xs border border-gray-300 text-gray-700 rounded">{cat}: {n}</span>
                  )) : <span className="text-sm text-gray-500">—</span>}
                </div>
              </div>
              <div className="pt-2">
                <button 
                  onClick={validateSitemaps} 
                  disabled={validateBusy}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  <FileSearch className="mr-2 h-4 w-4 inline" /> {validateBusy ? 'Validating…' : 'Validate Sitemaps'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {!!issues?.length && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center mb-2">
            <ShieldAlert className="h-4 w-4 text-red-600 mr-2" />
            <span className="font-semibold text-red-800">Validation Issues</span>
          </div>
          <ul className="text-xs text-red-700 list-disc pl-4">
            {issues.map((it, idx) => (
              <li key={idx}><span className="font-mono">{it.file}</span>: {it.problem}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}

function formatSeconds(s?: number) {
  if (!s || s <= 0) return '—'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60).toString().padStart(2, '0')
  return m ? `${m}m ${sec}s` : `${sec}s`
}
