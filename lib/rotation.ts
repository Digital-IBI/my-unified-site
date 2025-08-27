import seedrandom from "seedrandom"
import crypto from "crypto"
import type { ContentBlock } from "./types"

function seedFrom(pageKey: string) {
  const sha = process.env.BUILD_SHA || "dev"
  return crypto.createHash("sha256").update(`${pageKey}:${sha}`).digest("hex").slice(0, 16)
}

export function weightedPick(pool: ContentBlock[], pageKey: string, n: number, allowedTypes?: string[]): ContentBlock[] {
  const items = allowedTypes?.length ? pool.filter(b => allowedTypes.includes(b.type)) : pool
  const rng = seedrandom(seedFrom(pageKey))
  const arr = items.map(it => ({ it, r: Math.pow(rng(), 1 / Math.max(1, it.weight || 1)) }))
  arr.sort((a,b) => b.r - a.r)
  return arr.slice(0, n).map(x => x.it)
}
