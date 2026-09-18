<template>
  <section class="account-panel">
    <header class="panel-header">
      <div>
        <p class="kicker">账户与数据共享</p>
        <h3>{{ status?.signedIn ? '账户已登录' : '登录后可共享同步密钥' }}</h3>
      </div>
      <span class="state-dot" :class="{ online: status?.signedIn }">
        {{ status?.signedIn ? '已登录' : '未登录' }}
      </span>
    </header>

    <div v-if="!status?.secureTransport" class="security-notice">
      当前服务地址未启用 HTTPS。为保护密码和密钥，登录与共享功能已锁定；本地加密保存仍可使用。
    </div>

    <form v-if="!status?.signedIn" class="account-form" @submit.prevent="submitAccount">
      <div class="mode-tabs" role="tablist" aria-label="账户操作">
        <button type="button" :class="{ active: mode === 'login' }" @click="mode = 'login'">登录</button>
        <button type="button" :class="{ active: mode === 'register' }" @click="mode = 'register'">注册</button>
      </div>
      <label>
        <span>邮箱</span>
        <input v-model.trim="email" type="email" autocomplete="email" placeholder="name@example.com" required />
      </label>
      <label>
        <span>密码</span>
        <input v-model="password" type="password" :autocomplete="mode === 'login' ? 'current-password' : 'new-password'" minlength="10" maxlength="128" placeholder="至少 10 位" required />
      </label>
      <button class="primary-action" type="submit" :disabled="busy || !status?.secureTransport">
        {{ busy ? '处理中…' : mode === 'login' ? '登录' : '创建账户' }}
      </button>
    </form>

    <div v-else class="signed-in-row">
      <div>
        <strong>同步账户</strong>
        <small>登录令牌已由系统安全存储加密保存</small>
      </div>
      <button type="button" :disabled="busy" @click="logout">退出登录</button>
    </div>

    <div class="divider"></div>

    <form class="key-form" @submit.prevent="saveKey">
      <label>
        <span>同步密钥</span>
        <input v-model.trim="apiKey" type="password" autocomplete="off" placeholder="hx_live_…" :required="!status?.localKey.configured" />
        <small>{{ status?.localKey.configured ? '本机已有加密密钥；留空可保留当前密钥' : '密钥只在保存或主动共享时使用' }}</small>
      </label>

      <label class="switch-row" :class="{ disabled: !status?.signedIn || !status?.secureTransport }">
        <span>
          <strong>共享给中央同步服务</strong>
          <small>仅在中央数据缺失时使用，并受每日上限保护</small>
        </span>
        <input v-model="shareEnabled" type="checkbox" :disabled="!status?.signedIn || !status?.secureTransport" />
      </label>

      <label v-if="shareEnabled" class="limit-row">
        <span>每日最多使用次数</span>
        <input v-model.number="dailyLimit" type="number" min="2" max="200" />
      </label>

      <div v-if="status?.sharedKey?.configured" class="share-summary">
        <span>密钥标识 {{ status.sharedKey.fingerprint }}</span>
        <span>今日已用 {{ status.sharedKey.creditsUsedToday || 0 }} / {{ status.sharedKey.dailyShareLimit }}</span>
      </div>

      <div class="key-actions">
        <button class="primary-action" type="submit" :disabled="busy || (!apiKey && !status?.localKey.configured)">
          {{ busy ? '保存中…' : '保存设置' }}
        </button>
        <button v-if="status?.localKey.configured" class="danger-action" type="button" :disabled="busy" @click="revokeKey">
          删除密钥
        </button>
      </div>
    </form>

    <p v-if="message" class="result-message" :class="message.type">{{ message.text }}</p>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { AccountStatus } from '../../shared/ipc-contract.ts'
import { electronAPI } from '../native/electron-api.ts'

const status = ref<AccountStatus | null>(null)
const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const apiKey = ref('')
const shareEnabled = ref(false)
const dailyLimit = ref(20)
const busy = ref(false)
const message = ref<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)

const errorLabels: Record<string, string> = {
  ACCOUNT_EXISTS: '该邮箱已经注册，请直接登录。',
  INVALID_CREDENTIALS: '邮箱或密码不正确。',
  INVALID_EMAIL: '请输入有效邮箱。',
  INVALID_PASSWORD: '密码需为 10–128 位。',
  INVALID_DEVELOPER_KEY: '密钥格式不正确，应以 hx_live_ 开头。',
  INVALID_DAILY_LIMIT: '每日使用次数应在 2–200 之间。',
  AUTHENTICATION_REQUIRED: '请先登录账户。',
  SECURE_CONNECTION_REQUIRED: '服务尚未启用 HTTPS，已阻止敏感数据传输。',
  SECURE_STORAGE_UNAVAILABLE: '当前系统安全存储不可用。',
  Failed_to_fetch: '无法连接账户服务，请稍后重试。',
}

function explain(error: unknown) {
  const code = error instanceof Error ? error.message : String(error)
  return errorLabels[code] || errorLabels[code.replaceAll(' ', '_')] || `操作失败：${code}`
}

function applyStatus(next: AccountStatus) {
  status.value = next
  shareEnabled.value = !!next.sharedKey?.shareEnabled
  dailyLimit.value = next.sharedKey?.dailyShareLimit || dailyLimit.value
}

async function run(action: () => Promise<AccountStatus>, success: string) {
  busy.value = true
  message.value = null
  try {
    applyStatus(await action())
    message.value = { type: 'success', text: success }
  } catch (error) {
    message.value = { type: 'error', text: explain(error) }
  } finally {
    busy.value = false
  }
}

async function loadStatus() {
  try {
    applyStatus(await electronAPI.account.getStatus())
  } catch (error) {
    message.value = { type: 'error', text: explain(error) }
  }
}

async function submitAccount() {
  await run(
    () => mode.value === 'login'
      ? electronAPI.account.login(email.value, password.value)
      : electronAPI.account.register(email.value, password.value),
    mode.value === 'login' ? '登录成功。' : '账户已创建并登录。',
  )
  password.value = ''
}

async function logout() {
  await run(() => electronAPI.account.logout(), '已退出登录，本地密钥仍然保留。')
}

async function saveKey() {
  if (apiKey.value) {
    await run(() => electronAPI.account.saveKey(apiKey.value, shareEnabled.value, dailyLimit.value), '密钥设置已保存。')
    apiKey.value = ''
    return
  }
  await run(() => electronAPI.account.updateSharing(shareEnabled.value, dailyLimit.value), '共享设置已更新。')
}

async function revokeKey() {
  await run(() => electronAPI.account.revokeKey(), '本地与服务器上的密钥已删除。')
  apiKey.value = ''
  shareEnabled.value = false
}

onMounted(loadStatus)
</script>

<style scoped>
.account-panel { padding: 16px; border: 1px solid rgba(226,195,132,.2); background: rgba(7,20,29,.78); }
.panel-header,.signed-in-row,.switch-row,.limit-row,.key-actions,.share-summary { display:flex; align-items:center; justify-content:space-between; gap:12px; }
.panel-header h3 { margin:3px 0 0; font-size:15px; color:#edf5fb; }
.kicker { margin:0; color:#caa86d; font-size:10px; letter-spacing:.14em; }
.state-dot { padding:4px 8px; border-radius:20px; background:#25313a; color:#93a4b2; font-size:10px; }
.state-dot.online { background:rgba(66,166,112,.16); color:#75d49d; }
.security-notice,.result-message { margin:12px 0 0; padding:9px 10px; border-left:2px solid #d19c55; background:rgba(209,156,85,.09); color:#d6b784; font-size:11px; line-height:1.5; }
.account-form,.key-form { display:grid; gap:11px; margin-top:14px; }
.mode-tabs { display:grid; grid-template-columns:1fr 1fr; padding:3px; background:#07131b; }
.mode-tabs button,.signed-in-row button,.danger-action { border:0; background:transparent; color:#80909d; padding:7px 10px; cursor:pointer; }
.mode-tabs button.active { background:#263541; color:#e6c58e; }
label > span { display:block; margin-bottom:5px; color:#aab8c2; font-size:11px; }
input[type=email],input[type=password],input[type=number] { box-sizing:border-box; width:100%; border:1px solid #31424f; background:#07131b; color:#edf5fb; padding:9px 10px; outline:none; }
input:focus { border-color:#c9a363; }
label small,.signed-in-row small,.switch-row small { display:block; margin-top:4px; color:#71818d; font-size:10px; line-height:1.4; }
.primary-action { border:1px solid #b98b4b; background:linear-gradient(180deg,#caa565,#9f7137); color:#07131b; font-weight:700; padding:9px 13px; cursor:pointer; }
button:disabled { opacity:.45; cursor:not-allowed; }
.signed-in-row { margin-top:14px; padding:10px; background:rgba(85,127,151,.08); }
.signed-in-row strong,.switch-row strong { color:#dbe6ee; font-size:12px; }
.divider { height:1px; margin:15px 0; background:rgba(226,195,132,.14); }
.switch-row { margin:0; cursor:pointer; }
.switch-row > span { margin:0; }
.switch-row.disabled { opacity:.55; }
.switch-row input { width:17px; height:17px; accent-color:#c69c58; }
.limit-row > span { margin:0; }
.limit-row input { width:82px; }
.share-summary { padding:8px 10px; background:#07131b; color:#8fa0ac; font-size:10px; }
.key-actions { justify-content:flex-start; }
.danger-action { color:#d98278; }
.result-message.success { border-color:#55b47c; color:#75d49d; background:rgba(66,166,112,.09); }
.result-message.error { border-color:#c65d55; color:#e69189; background:rgba(198,93,85,.09); }
</style>
