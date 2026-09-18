<template>
  <section class="account-panel">
    <header class="panel-header">
      <div>
        <p class="kicker">{{ t('account.title') }}</p>
        <h3>{{ status?.signedIn ? t('account.signedIn') : t('account.signInHint') }}</h3>
      </div>
      <span class="state-dot" :class="{ online: status?.signedIn }">
        {{ status?.signedIn ? t('account.online') : t('account.offline') }}
      </span>
    </header>

    <div v-if="!status?.secureTransport" class="security-notice">
      {{ t('account.httpsRequired') }}
    </div>

    <form v-if="!status?.signedIn" class="account-form" @submit.prevent="submitAccount">
      <div class="mode-tabs" role="tablist" aria-label="账户操作">
        <button type="button" :class="{ active: mode === 'login' }" @click="mode = 'login'">{{ t('account.login') }}</button>
        <button type="button" :class="{ active: mode === 'register' }" @click="mode = 'register'">{{ t('account.register') }}</button>
      </div>
      <label>
        <span>{{ t('account.email') }}</span>
        <input v-model.trim="email" type="email" autocomplete="email" placeholder="name@example.com" required />
      </label>
      <label>
        <span>{{ t('account.password') }}</span>
        <input v-model="password" type="password" :autocomplete="mode === 'login' ? 'current-password' : 'new-password'" minlength="10" maxlength="128" placeholder="至少 10 位" required />
      </label>
      <button class="primary-action" type="submit" :disabled="busy || !status?.secureTransport">
        {{ busy ? t('account.processing') : mode === 'login' ? t('account.login') : t('account.create') }}
      </button>
    </form>

    <div v-else class="signed-in-row">
      <div>
        <strong>{{ t('account.syncAccount') }}</strong>
        <small>{{ t('account.sessionEncrypted') }}</small>
      </div>
      <button type="button" :disabled="busy" @click="logout">{{ t('account.logout') }}</button>
    </div>

    <div class="divider"></div>

    <form class="key-form" @submit.prevent="saveKey">
      <label>
        <span class="sync-key-label">
          {{ t('account.syncKey') }}
          <a class="api-link" :href="DATA_API_URL" @click.prevent="openDataApi">（开放API）</a>
        </span>
        <input v-model.trim="apiKey" type="password" autocomplete="off" placeholder="hx_live_…" :required="!status?.localKey.configured" />
        <small>{{ status?.localKey.configured ? t('account.keySaved') : t('account.keyPrivacy') }}</small>
      </label>

      <label class="switch-row" :class="{ disabled: !status?.signedIn || !status?.secureTransport }">
        <span>
          <strong>{{ t('account.shareTitle') }}</strong>
          <small>{{ t('account.shareDescription') }}</small>
        </span>
        <input v-model="shareEnabled" type="checkbox" :disabled="!status?.signedIn || !status?.secureTransport" />
      </label>

      <label v-if="shareEnabled" class="limit-row">
        <span>{{ t('account.dailyLimit') }}</span>
        <input v-model.number="dailyLimit" type="number" min="2" max="200" />
      </label>

      <div v-if="status?.sharedKey?.configured" class="share-summary">
        <span>{{ t('account.fingerprint', { value: status.sharedKey.fingerprint }) }}</span>
        <span>{{ t('account.usedToday', { used: status.sharedKey.creditsUsedToday || 0, limit: status.sharedKey.dailyShareLimit }) }}</span>
      </div>

      <div class="key-actions">
        <button class="primary-action" type="submit" :disabled="busy || (!apiKey && !status?.localKey.configured)">
          {{ busy ? t('account.saving') : t('account.save') }}
        </button>
        <button v-if="status?.localKey.configured" class="danger-action" type="button" :disabled="busy" @click="revokeKey">
          {{ t('account.deleteKey') }}
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const DATA_API_URL = 'https://data.dtodo.cn'

const openDataApi = async () => {
  try {
    await electronAPI.shell.openExternal(DATA_API_URL)
  } catch (error) {
    console.warn('Failed to open data API:', error)
  }
}

const status = ref<AccountStatus | null>(null)
const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const apiKey = ref('')
const shareEnabled = ref(false)
const dailyLimit = ref(20)
const busy = ref(false)
const message = ref<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)

function explain(error: unknown) {
  const code = error instanceof Error ? error.message : String(error)
  const errorKey = `account.errors.${code.replaceAll(' ', '_')}`
  const translated = t(errorKey)
  return translated === errorKey ? t('account.errors.unknown', { error: code }) : translated
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
    mode.value === 'login' ? t('account.loginSuccess') : t('account.registerSuccess'),
  )
  password.value = ''
}

async function logout() {
  await run(() => electronAPI.account.logout(), t('account.logoutSuccess'))
}

async function saveKey() {
  if (apiKey.value) {
    await run(() => electronAPI.account.saveKey(apiKey.value, shareEnabled.value, dailyLimit.value), t('account.keySaveSuccess'))
    apiKey.value = ''
    return
  }
  await run(() => electronAPI.account.updateSharing(shareEnabled.value, dailyLimit.value), t('account.shareUpdateSuccess'))
}

async function revokeKey() {
  await run(() => electronAPI.account.revokeKey(), t('account.keyDeleteSuccess'))
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

.sync-key-label { display:flex; align-items:center; gap:6px; }
.api-link { color:#9be8dc; font-size:11px; cursor:pointer; transition:color 120ms ease; }
.api-link:hover { color:#b9f2e8; }
</style>
