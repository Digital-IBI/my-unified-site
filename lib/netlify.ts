const API_BASE = 'https://api.netlify.com/api/v1'
export async function listBuilds(siteId: string, token: string, limit = 10) {
  const url = `${API_BASE}/sites/${siteId}/builds?per_page=${limit}`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`Netlify builds fetch failed: ${res.status}`)
  return res.json()
}
export async function triggerBuildByHook(buildHookUrl: string, cause?: string) {
  const res = await fetch(buildHookUrl, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ trigger_title: cause || 'Ops UI manual trigger' }) })
  if (!res.ok) throw new Error(`Build hook failed: ${res.status}`)
  return { ok: true }
}
