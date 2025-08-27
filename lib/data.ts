type Series = [string, number][]
export type FxBundle = {
  latest?: any; history_30d?: any; history_1y?: any; history_2y?: any; history_5y?: any; meta?: any
}
export async function loadFxBundle(): Promise<{ hash: string; bundle: FxBundle }> {
  const site = (process.env.SITE_URL || '').replace(/\/$/, '')
  const res = await fetch(`${site}/api/fx-snapshot`, { cache: "no-store" }).catch(() => null)
  if (!res || !res.ok) throw new Error("No ETL snapshot endpoint; deploy netlify function fx_snapshot.ts or set SITE_URL")
  return res.json()
}
export function seriesFor(pair: string, bundle: FxBundle, range: "30d"|"1y"|"2y"|"5y"): Series {
  const key = range === "30d" ? "history_30d" : `history_${range}`
  const obj = (bundle as any)[key]
  if (obj?.pair === pair && Array.isArray(obj.series)) return obj.series as Series
  return []
}
