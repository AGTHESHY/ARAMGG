import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import pg from 'pg'
import { z } from 'zod'

const emailSchema = z.string().email().max(254).transform(value => value.trim().toLowerCase())
const passwordSchema = z.string().min(10).max(128)
const apiKeySchema = z.string().regex(/^hx_live_[a-zA-Z0-9]+$/).max(200)
const contributionLimitSchema = z.number().int().min(2).max(200)

export interface SharedKeyCandidate {
  id: string
  key: string
  dailyLimit: number
  usedToday: number
}

export class AccountService {
  private pool: pg.Pool
  constructor(databaseUrl: string, private masterKey: Buffer) {
    if (masterKey.length !== 32) throw new Error('KEY_ENCRYPTION_KEY must decode to 32 bytes')
    this.pool = new pg.Pool({ connectionString: databaseUrl, max: 5, connectionTimeoutMillis: 5000 })
  }
  async initialize() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash BYTEA NOT NULL,
        password_salt BYTEA NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS user_sessions (
        token_hash BYTEA PRIMARY KEY, user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS shared_api_keys (
        id UUID PRIMARY KEY, user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        ciphertext BYTEA NOT NULL, nonce BYTEA NOT NULL, auth_tag BYTEA NOT NULL,
        fingerprint TEXT NOT NULL, share_enabled BOOLEAN NOT NULL DEFAULT false,
        daily_share_limit INTEGER NOT NULL CHECK (daily_share_limit BETWEEN 2 AND 200),
        credits_used_today INTEGER NOT NULL DEFAULT 0,
        usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
        last_used_at TIMESTAMPTZ, status TEXT NOT NULL DEFAULT 'active',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS shared_api_keys_pool_idx
        ON shared_api_keys (share_enabled, status, last_used_at) WHERE share_enabled = true;
    `)
  }
  private async passwordHash(password: string, salt: Buffer) {
    return new Promise<Buffer>((resolve, reject) => {
      scryptCallback(password, salt, 32, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (error, derivedKey) => {
        if (error) reject(error)
        else resolve(Buffer.from(derivedKey))
      })
    })
  }
  private tokenHash(token: string) { return createHash('sha256').update(token).digest() }
  private async session(userId: string) {
    const token = randomBytes(32).toString('base64url')
    await this.pool.query('INSERT INTO user_sessions(token_hash, user_id, expires_at) VALUES($1,$2,now() + interval \'30 days\')', [this.tokenHash(token), userId])
    return token
  }
  async register(rawEmail: unknown, rawPassword: unknown) {
    const email = emailSchema.parse(rawEmail)
    const password = passwordSchema.parse(rawPassword)
    const salt = randomBytes(16)
    const hash = await this.passwordHash(password, salt)
    const id = randomUUID()
    try { await this.pool.query('INSERT INTO users(id,email,password_hash,password_salt) VALUES($1,$2,$3,$4)', [id, email, hash, salt]) }
    catch (error) {
      if ((error as { code?: string }).code === '23505') throw new AccountError('ACCOUNT_EXISTS', 409)
      throw error
    }
    return { token: await this.session(id), expiresInDays: 30 }
  }
  async login(rawEmail: unknown, rawPassword: unknown) {
    const email = emailSchema.parse(rawEmail)
    const password = passwordSchema.parse(rawPassword)
    const result = await this.pool.query('SELECT id,password_hash,password_salt FROM users WHERE email=$1', [email])
    const row = result.rows[0]
    const expected = row?.password_hash ? Buffer.from(row.password_hash) : randomBytes(32)
    const actual = await this.passwordHash(password, row?.password_salt ? Buffer.from(row.password_salt) : randomBytes(16))
    if (!row || expected.length !== actual.length || !timingSafeEqual(expected, actual)) throw new AccountError('INVALID_CREDENTIALS', 401)
    return { token: await this.session(row.id), expiresInDays: 30 }
  }
  async authenticate(authorization: unknown) {
    const match = /^Bearer ([A-Za-z0-9_-]{40,})$/.exec(String(authorization ?? ''))
    if (!match) throw new AccountError('AUTHENTICATION_REQUIRED', 401)
    const result = await this.pool.query('SELECT user_id FROM user_sessions WHERE token_hash=$1 AND expires_at > now()', [this.tokenHash(match[1]!)])
    if (!result.rows[0]) throw new AccountError('INVALID_SESSION', 401)
    return String(result.rows[0].user_id)
  }
  private encrypt(value: string) {
    const nonce = randomBytes(12)
    const cipher = createCipheriv('aes-256-gcm', this.masterKey, nonce)
    const ciphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
    return { ciphertext, nonce, authTag: cipher.getAuthTag() }
  }
  private decrypt(row: { ciphertext: Buffer; nonce: Buffer; auth_tag: Buffer }) {
    const decipher = createDecipheriv('aes-256-gcm', this.masterKey, row.nonce)
    decipher.setAuthTag(row.auth_tag)
    return Buffer.concat([decipher.update(row.ciphertext), decipher.final()]).toString('utf8')
  }
  async setSharedKey(userId: string, rawKey: unknown, rawEnabled: unknown, rawLimit: unknown) {
    const key = apiKeySchema.parse(rawKey)
    const enabled = z.boolean().parse(rawEnabled)
    const dailyLimit = contributionLimitSchema.parse(rawLimit)
    const encrypted = this.encrypt(key)
    const fingerprint = createHmac('sha256', this.masterKey).update(key).digest('hex').slice(0, 16)
    await this.pool.query(`INSERT INTO shared_api_keys(id,user_id,ciphertext,nonce,auth_tag,fingerprint,share_enabled,daily_share_limit)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT(user_id) DO UPDATE SET ciphertext=$3,nonce=$4,auth_tag=$5,fingerprint=$6,share_enabled=$7,daily_share_limit=$8,status='active',credits_used_today=0,usage_date=CURRENT_DATE,updated_at=now()`,
    [randomUUID(), userId, encrypted.ciphertext, encrypted.nonce, encrypted.authTag, fingerprint, enabled, dailyLimit])
    return { configured: true, shareEnabled: enabled, dailyShareLimit: dailyLimit, fingerprint }
  }
  async keyStatus(userId: string) {
    const result = await this.pool.query('SELECT fingerprint,share_enabled,daily_share_limit,credits_used_today,usage_date,last_used_at,status FROM shared_api_keys WHERE user_id=$1', [userId])
    const row = result.rows[0]
    if (!row) return { configured: false, shareEnabled: false }
    const usageDate = row.usage_date instanceof Date
      ? row.usage_date.toISOString().slice(0, 10)
      : String(row.usage_date).slice(0, 10)
    const used = usageDate === new Date().toISOString().slice(0, 10) ? Number(row.credits_used_today) : 0
    return { configured: true, shareEnabled: row.share_enabled, dailyShareLimit: row.daily_share_limit, creditsUsedToday: used, fingerprint: row.fingerprint, lastUsedAt: row.last_used_at, status: row.status }
  }
  async revokeKey(userId: string) { await this.pool.query('DELETE FROM shared_api_keys WHERE user_id=$1', [userId]) }
  async candidates(): Promise<SharedKeyCandidate[]> {
    await this.pool.query('UPDATE shared_api_keys SET credits_used_today=0,usage_date=CURRENT_DATE WHERE usage_date<>CURRENT_DATE')
    const result = await this.pool.query(`SELECT id,ciphertext,nonce,auth_tag,daily_share_limit,credits_used_today FROM shared_api_keys
      WHERE share_enabled=true AND status='active' AND credits_used_today<daily_share_limit ORDER BY last_used_at NULLS FIRST, updated_at`)
    return result.rows.map(row => ({ id: row.id, key: this.decrypt(row), dailyLimit: row.daily_share_limit, usedToday: row.credits_used_today }))
  }
  async recordUsage(id: string, credits: number) {
    if (credits <= 0) return
    await this.pool.query('UPDATE shared_api_keys SET credits_used_today=credits_used_today+$2,last_used_at=now(),updated_at=now() WHERE id=$1', [id, credits])
  }
  async close() { await this.pool.end() }
}

export class AccountError extends Error {
  constructor(readonly code: string, readonly statusCode: number) { super(code) }
}
