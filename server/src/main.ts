import { buildApp } from './app.js'
import { createRuntime } from './runtime.js'

const { catalog, accounts, snapshots } = await createRuntime()
const app = buildApp(snapshots, true, accounts)
app.addHook('onClose', async () => { await accounts?.close(); await catalog.close() })
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.once(signal, () => { void app.close() })
try { await app.listen({ host: process.env.HOST ?? '127.0.0.1', port: Number(process.env.PORT ?? 8788) }) }
catch { await app.close(); process.exitCode = 1 }
