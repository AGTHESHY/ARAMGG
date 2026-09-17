import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import test from 'node:test'
import pg from 'pg'
import { AccountError, AccountService } from '../src/accounts.js'

test('账户密钥默认不共享，并以密文进入受控密钥池', { skip: !process.env.TEST_DATABASE_URL }, async t => {
  const admin = new pg.Pool({ connectionString: process.env.TEST_DATABASE_URL! })
  const schema = `test_${randomUUID().replaceAll('-', '')}`
  await admin.query(`CREATE SCHEMA ${schema}`)
  const url = new URL(process.env.TEST_DATABASE_URL!)
  url.searchParams.set('options', `-c search_path=${schema}`)
  const accounts = new AccountService(url.toString(), Buffer.alloc(32, 7))
  t.after(async () => {
    await accounts.close()
    await admin.query(`DROP SCHEMA ${schema} CASCADE`)
    await admin.end()
  })
  await accounts.initialize()

  const email = `tester-${randomUUID()}@example.test`
  const password = 'a-long-test-password'
  const apiKey = 'hx_live_abcdef1234567890'
  const registration = await accounts.register(email, password)
  const userId = await accounts.authenticate(`Bearer ${registration.token}`)
  const initial = await accounts.setSharedKey(userId, apiKey, false, 10)
  assert.equal(initial.shareEnabled, false)
  assert.deepEqual(await accounts.candidates(), [])

  await accounts.setSharedKey(userId, apiKey, true, 10)
  const [candidate] = await accounts.candidates()
  assert.equal(candidate?.key, apiKey)
  await accounts.recordUsage(candidate!.id, 4)
  assert.equal((await accounts.keyStatus(userId)).creditsUsedToday, 4)
  const stored = await admin.query(`SELECT encode(ciphertext, 'escape') AS ciphertext FROM ${schema}.shared_api_keys`)
  assert.notEqual(stored.rows[0].ciphertext, apiKey)

  const login = await accounts.login(email, password)
  assert.equal(await accounts.authenticate(`Bearer ${login.token}`), userId)
  await assert.rejects(accounts.login(email, 'wrong-password-value'), (error: unknown) =>
    error instanceof AccountError && error.code === 'INVALID_CREDENTIALS')
  await accounts.revokeKey(userId)
  assert.equal((await accounts.keyStatus(userId)).configured, false)
})
