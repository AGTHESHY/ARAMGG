import Fastify from 'fastify'
import { ZodError } from 'zod'
import { localeSchema, type Locale } from './schema.js'
import { Snapshots } from './snapshots.js'
import { AccountError, type AccountService } from './accounts.js'

export function buildApp(snapshots: Snapshots, logging = false, accounts?: AccountService) {
  const app = Fastify({
    logger: logging ? { redact: ['req.headers.authorization', 'req.headers["x-api-key"]', 'req.headers.cookie'], level: 'info' } : false,
    disableRequestLogging: true,
  })
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AccountError) return reply.code(error.statusCode).send({ error: error.code })
    if (error instanceof ZodError) return reply.code(400).send({ error: 'Invalid request' })
    request.log.error({ requestId: request.id }, 'Request failed')
    return reply.code(500).send({ error: 'Internal server error' })
  })
  if (accounts) {
    app.post<{ Body: { email?: unknown; password?: unknown } }>('/api/account/v1/register', async (request, reply) =>
      reply.code(201).send(await accounts.register(request.body?.email, request.body?.password)))
    app.post<{ Body: { email?: unknown; password?: unknown } }>('/api/account/v1/login', async request =>
      accounts.login(request.body?.email, request.body?.password))
    app.get('/api/account/v1/shared-key', async request =>
      accounts.keyStatus(await accounts.authenticate(request.headers.authorization)))
    app.put<{ Body: { apiKey?: unknown; shareEnabled?: unknown; dailyShareLimit?: unknown } }>('/api/account/v1/shared-key', async request => {
      const userId = await accounts.authenticate(request.headers.authorization)
      return accounts.setSharedKey(userId, request.body?.apiKey, request.body?.shareEnabled, request.body?.dailyShareLimit)
    })
    app.delete('/api/account/v1/shared-key', async (request, reply) => {
      await accounts.revokeKey(await accounts.authenticate(request.headers.authorization))
      return reply.code(204).send()
    })
  }
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
