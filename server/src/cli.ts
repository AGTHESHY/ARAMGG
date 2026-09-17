import { demoSnapshot } from './demo.js'
import { createRuntime } from './runtime.js'
import { localeSchema, versionSchema } from './schema.js'

const [command, locale, version] = process.argv.slice(2)
if (command !== 'seed-demo' && command !== 'rollback') throw new Error('Usage: cli.js seed-demo | rollback <locale> <version>')
const { catalog, snapshots } = await createRuntime()
try {
  if (command === 'seed-demo') {
    for (const language of localeSchema.options) {
      const result = await snapshots.publish(demoSnapshot(language))
      console.log(JSON.stringify({ locale: language, created: result.created, dataVersion: result.record.dataVersion, source: 'demo' }))
    }
  } else {
    await snapshots.rollback(localeSchema.parse(locale), versionSchema.parse(version))
    console.log(JSON.stringify({ locale, dataVersion: version, activated: true }))
  }
} finally { await catalog.close() }
