import { z } from 'zod'

export const localeSchema = z.enum(['zh-CN', 'en-US', 'zh-TW'])
export type Locale = z.infer<typeof localeSchema>
export const versionSchema = z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,79}$/)
export const filePathSchema = z.string().regex(/^(augments|champions|items)\.json$|^champion-shards\/(index|[a-zA-Z0-9_-]+)\.json$/)
const statsSchema = z.object({
  games: z.number().int().nonnegative(),
  wins: z.number().int().nonnegative(),
  winRate: z.number().min(0).max(1),
}).passthrough().refine(s => s.wins <= s.games, 'Wins exceed games')
const championSchema = z.object({ id: z.number().int().positive(), name: z.string().min(1), stats: statsSchema }).passthrough()
const detailSchema = z.object({
  champion: z.object({ id: z.number().int().positive() }).passthrough(),
  builds: z.array(z.object({ stats: statsSchema }).passthrough()),
  augments: z.array(z.object({ id: z.number().int().positive() }).passthrough()),
}).passthrough()

export const snapshotSchema = z.object({
  dataVersion: versionSchema,
  locale: localeSchema,
  gamePatch: z.string().min(1),
  source: z.enum(['demo', 'aramgg']),
  files: z.record(filePathSchema, z.unknown()),
})
export type SnapshotInput = z.infer<typeof snapshotSchema>

// This is the initial client-facing contract. The upstream adapter must explicitly
// map its payload into it instead of silently accepting an incomplete snapshot.
export function validateSnapshot(raw: unknown): SnapshotInput {
  const input = snapshotSchema.parse(raw)
  const champions = z.object({ champions: z.array(championSchema).min(1) }).parse(input.files['champions.json']).champions
  const augments = z.object({ augments: z.array(z.object({ id: z.number().int().positive(), name: z.string().min(1) }).passthrough()).min(1) }).parse(input.files['augments.json']).augments
  z.object({ items: z.array(z.object({ id: z.number().int().positive(), name: z.string().min(1) }).passthrough()).min(1) }).parse(input.files['items.json'])
  const index = z.object({ shards: z.array(z.object({ path: filePathSchema, championIds: z.array(z.number().int().positive()).min(1) })).min(1) }).parse(input.files['champion-shards/index.json'])
  const expected = new Set(champions.map(c => c.id))
  if (expected.size !== champions.length) throw new Error('Duplicate champion ID')
  const augmentIds = new Set(augments.map(a => a.id))
  const covered = new Set<number>()
  const paths = new Set(['augments.json', 'champions.json', 'items.json', 'champion-shards/index.json'])
  for (const entry of index.shards) {
    if (!entry.path.startsWith('champion-shards/') || paths.has(entry.path)) throw new Error('Invalid or duplicate shard path')
    paths.add(entry.path)
    const shard = z.object({ champions: z.record(z.string(), detailSchema) }).parse(input.files[entry.path])
    if (Object.keys(shard.champions).length !== entry.championIds.length) throw new Error('Shard index mismatch')
    for (const id of entry.championIds) {
      const detail = shard.champions[String(id)]
      if (!expected.has(id) || covered.has(id) || detail?.champion.id !== id) throw new Error('Champion coverage mismatch')
      if (detail.augments.some(a => !augmentIds.has(a.id))) throw new Error('Unknown augment reference')
      covered.add(id)
    }
  }
  if (covered.size !== expected.size || Object.keys(input.files).some(p => !paths.has(p))) throw new Error('Incomplete or unindexed snapshot')
  return input
}
