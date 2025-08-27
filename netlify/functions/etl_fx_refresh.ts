// Netlify Scheduled Function: fetch FX/history JSON, diff via Blobs, trigger build on change.
import type { Config, Context } from "@netlify/functions";
import crypto from "crypto";

const BLOB_NAMESPACE = "etl-snapshots";
const SNAPSHOT_KEY = "fx_bundle_latest";

type FxBundle = {
  latest: any; history_30d: any; history_1y: any; history_2y: any; history_5y: any;
  meta: { retrieved_at: string; source: string };
};

function hashObject(obj: unknown) {
  const s = JSON.stringify(obj);
  return crypto.createHash("sha256").update(s).digest("hex");
}
async function fetchJSON<T>(url?: string): Promise<T> {
  if (!url) throw new Error("Missing endpoint URL");
  const res = await fetch(url, { headers: { "accept": "application/json" } });
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);
  return res.json() as Promise<T>;
}
async function triggerBuild(buildHookUrl?: string, cause?: string) {
  if (!buildHookUrl) throw new Error("Missing BUILD_HOOK_URL");
  await fetch(buildHookUrl, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ trigger_title: cause ?? "ETL refresh" }) });
}

export const config: Config = { schedule: "0 20 * * *" }; // 20:00 UTC ≈ 01:30 IST

export default async function handler(_event: Request, context: Context) {
  const { BUILD_HOOK_URL, FX_ENDPOINT_LATEST, FX_ENDPOINT_HISTORY_30D, FX_ENDPOINT_HISTORY_1Y, FX_ENDPOINT_HISTORY_2Y, FX_ENDPOINT_HISTORY_5Y } = process.env;
  const blobs = (context as any).cloudflare?.env?.NETLIFY_BLOBS ?? (globalThis as any).NETLIFY_BLOBS;
  if (!blobs) return new Response("Netlify Blobs binding missing.", { status: 500 });

  try {
    const [latest, h30, h1, h2, h5] = await Promise.all([
      fetchJSON(FX_ENDPOINT_LATEST), fetchJSON(FX_ENDPOINT_HISTORY_30D),
      fetchJSON(FX_ENDPOINT_HISTORY_1Y), fetchJSON(FX_ENDPOINT_HISTORY_2Y), fetchJSON(FX_ENDPOINT_HISTORY_5Y)
    ]);

    const bundle: FxBundle = { latest, history_30d: h30, history_1y: h1, history_2y: h2, history_5y: h5, meta: { retrieved_at: new Date().toISOString(), source: "FX Provider" } };
    const newHash = hashObject(bundle);

    const ns = blobs.namespace(BLOB_NAMESPACE);
    const prev = await ns.get(SNAPSHOT_KEY, { type: "json" }).catch(() => null) as { hash: string; bundle: FxBundle } | null;
    const changed = !prev || prev.hash !== newHash;

    if (changed) {
      await ns.put(SNAPSHOT_KEY, JSON.stringify({ hash: newHash, bundle }), { contentType: "application/json" });
      await triggerBuild(BUILD_HOOK_URL, "FX data changed");
      return new Response(JSON.stringify({ changed: true, hash: newHash }), { headers: { "content-type": "application/json" } });
    }
    return new Response(JSON.stringify({ changed: false, hash: prev?.hash }), { headers: { "content-type": "application/json" } });
  } catch (err: any) {
    return new Response(`ETL error: ${err.message || String(err)}`, { status: 500 });
  }
}
