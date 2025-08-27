// Expose latest ETL snapshot to the build/UI.
import type { Config, Context } from "@netlify/functions";
export const config: Config = { path: "/api/fx-snapshot" };
export default async (_req: Request, context: Context) => {
  const blobs = (context as any).cloudflare?.env?.NETLIFY_BLOBS ?? (globalThis as any).NETLIFY_BLOBS;
  const ns = blobs.namespace("etl-snapshots");
  const snapshot = await ns.get("fx_bundle_latest", { type: "text" }).catch(() => null);
  if (!snapshot) return new Response("Not found", { status: 404 });
  return new Response(snapshot, { headers: { "content-type": "application/json", "cache-control": "no-store" } });
}
