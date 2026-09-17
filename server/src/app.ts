import Fastify from 'fastify'
import { ZodError } from 'zod'
import { localeSchema, type Locale } from './schema.js'
import { Snapshots } from './snapshots.js'

export function buildApp(snapshots: Snapshots, logging = false) {
  const app = Fastify({
    logger: logging ? { redact: ['req.headers.authorization', 'req.headers["x-api-key"]', 'req.headers.cookie'], level: 'info' } : false,
    disableRequestLogging: true,
  })
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) return reply.code(400).send({ error: 'Invalid request' })
    request.log.error({ requestId: request.id }, 'Request failed')
    return reply.code(500).send({ error: 'Internal server error' })
  })
  app.get('/health/live', async () => ({ status: 'ok' }))
  app.get('/health/ready', async (_request, reply) => {
    try {
      await snapshots.catalog.ready()
      const current = await snapshots.catalog.current('zh-CN')
      return { status: 'ok', dataReady: !!current, dataVersion: current?.dataVersion ?? null, source: current?.source ?? null }
    } catch { return reply.code(503).send({ status: 'unavailable' }) }
  })
  app.get<{ Querystring: { locale?: string } }>('/api/client/v1/sync/status', async (request, reply) => {
    const locale = localeSchema.parse(request.query.locale ?? 'zh-CN')
    reply.header('Cache-Control', 'no-store')
    return await snapshots.syncStatus(locale) ?? reply.code(404).send({ error: 'No sync job', locale })
  })
  for (const route of ['/api/client/v1/config', '/api/client/v1/:locale/config']) {
    app.get<{ Params: { locale?: string }; Querystring: { locale?: string } }>(route, async (request, reply) => {
      const locale = localeSchema.parse(request.params.locale ?? request.query.locale ?? 'zh-CN')
      reply.header('Cache-Control', 'no-store')
      const record = await snapshots.catalog.current(locale)
      if (!record) return reply.code(503).send({ error: 'Snapshot not ready', locale })
      return {
        ...record,
        manifest: `/api/client/v1/data/${record.dataVersion}/${locale}/manifest.json`,
        client: { autoUpdateEnabled: false },
        notice: record.source === 'demo' ? '演示数据，仅用于开发联调，不可用于游戏推荐。' : undefined,
      }
    })
  }
  const serve = async (locale: Locale, version: string, resource: string, ifNoneMatch: string | undefined, reply: import('fastify').FastifyReply) => {
    const file = await snapshots.read(locale, version, resource)
    if (!file) return reply.code(404).send({ error: 'Snapshot file not found' })
    reply.header('Cache-Control', 'public, max-age=31536000, immutable').header('ETag', file.etag)
    if (ifNoneMatch === file.etag) return reply.code(304).send()
    return reply.type('application/json; charset=utf-8').send(file.body)
  }
  app.get<{ Params: { version: string; '*': string } }>('/api/client/v1/data/:version/*', async (request, reply) => {
    const resource = request.params['*']
    const [first, ...remaining] = resource.split('/')
    const locale = localeSchema.safeParse(first)
    return serve(locale.success ? locale.data : 'zh-CN', request.params.version, locale.success ? remaining.join('/') : resource, request.headers['if-none-match'], reply)
  })
  return app
}
