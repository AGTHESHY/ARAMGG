import { app, BrowserWindow } from 'electron'
import { spawn, type ChildProcess } from 'child_process'
import { createWriteStream } from 'fs'
import { access, cp, mkdir, readdir, readFile, rename, rm, stat, writeFile } from 'fs/promises'
import https from 'https'
import path from 'path'
import { createRequire } from 'module'
import logger from '../../modules/logger.ts'
import { GameProcessMonitor } from './game-process-monitor.ts'
import type { LocalModEntry } from '../../../shared/ipc-contract.ts'

const require = createRequire(import.meta.url)
const AdmZip = require('adm-zip') as new (file: string) => {
  extractAllTo(destination: string, overwrite: boolean): void
  getEntries(): { entryName: string; getData(): Buffer }[]
  test(): boolean
}

export type SkinRuntimePhase = 'unsupported' | 'missing-dependency' | 'idle' | 'downloading' | 'prepared' | 'applying' | 'active' | 'error'

export interface SkinRuntimeSelection {
  championId: number
  championName: string
  skinId: number
  skinName: string
  chromaId?: number
}

export interface SkinRuntimeState {
  supported: boolean
  phase: SkinRuntimePhase
  progress: number
  message: string
  selection: SkinRuntimeSelection | null
  dependencyDirectory: string
  timing?: { phase: string; ms: number }[]
}

const state: SkinRuntimeState = {
  supported: process.platform === 'win32',
  phase: process.platform === 'win32' ? 'idle' : 'unsupported',
  progress: 0,
  message: process.platform === 'win32' ? '本地替换运行器就绪' : '真实本地替换仅支持 Windows 10/11',
  selection: null,
  dependencyDirectory: '',
}

const timingLog: { phase: string; ms: number }[] = []

function recordTiming(phase: string, startedAt: number): void {
  const ms = Date.now() - startedAt
  timingLog.push({ phase, ms })
  if (timingLog.length > 20) timingLog.shift()
  logger.info(`[skin-runtime] ${phase} completed in ${ms}ms`)
}

let activeProcess: ChildProcess | null = null
let activePreparationProcess: ChildProcess | null = null
let operationGeneration = 0
let pendingApplyLeagueRoot = ''
let gameProcessMonitor: GameProcessMonitor | null = null

function runtimeRoot(): string {
  const userData = typeof app?.getPath === 'function'
    ? app.getPath('userData')
    : path.join(process.cwd(), '.aramgg-test-data')
  return path.join(userData, 'skin-runtime')
}

function toolsDirectory(): string {
  return path.join(runtimeRoot(), 'tools')
}

function getGameProcessMonitor(): GameProcessMonitor {
  gameProcessMonitor ||= new GameProcessMonitor(runtimeRoot())
  return gameProcessMonitor
}

function emitState(): void {
  state.dependencyDirectory = toolsDirectory()
  for (const window of BrowserWindow.getAllWindows()) {
    if (!window.isDestroyed()) window.webContents.send('skin-runtime-changed', getSkinRuntimeState())
  }
}

function setState(update: Partial<SkinRuntimeState>): void {
  Object.assign(state, update)
  emitState()
}

export function getSkinRuntimeState(): SkinRuntimeState {
  state.dependencyDirectory = toolsDirectory()
  state.timing = [...timingLog]
  return { ...state, selection: state.selection ? { ...state.selection } : null }
}

export async function refreshSkinRuntimeState(): Promise<SkinRuntimeState> {
  if (!state.supported || state.selection || state.phase === 'active') return getSkinRuntimeState()
  await ensurePublicTools()
  const missing = []
  for (const name of ['mod-tools.exe', 'cslol-dll.dll']) {
    if (!(await exists(path.join(toolsDirectory(), name)))) missing.push(name)
  }
  if (missing.length) setState({ phase: 'missing-dependency', message: `缺少运行依赖：${missing.join('、')}` })
  else setState({ phase: 'idle', message: '本地替换运行器就绪' })
  return getSkinRuntimeState()
}

async function exists(file: string): Promise<boolean> {
  return access(file).then(() => true).catch(() => false)
}

function packagedToolsDirectory(): string {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'skin-runtime')
    : path.join(app.getAppPath(), 'resources', 'skin-runtime')
}

async function ensurePublicTools(): Promise<void> {
  await mkdir(toolsDirectory(), { recursive: true })
  for (const name of ['mod-tools.exe', 'cslol-dll.dll']) {
    const source = path.join(packagedToolsDirectory(), name)
    const destination = path.join(toolsDirectory(), name)
    if (!(await exists(destination)) && await exists(source)) await cp(source, destination)
  }
}

async function ensureDependencies(): Promise<void> {
  await ensurePublicTools()
  const missing: string[] = []
  for (const name of ['mod-tools.exe', 'cslol-dll.dll']) {
    if (!(await exists(path.join(toolsDirectory(), name)))) missing.push(name)
  }
  if (missing.length) {
    setState({ phase: 'missing-dependency', message: `缺少运行依赖：${missing.join('、')}` })
    throw new Error(state.message)
  }
}

function skinArchivePath(selection: SkinRuntimeSelection): string {
  const skinsDir = path.join(runtimeRoot(), 'skins')
  if (selection.chromaId) {
    return path.join(skinsDir, String(selection.championId), String(selection.skinId), String(selection.chromaId), `${selection.chromaId}.fantome`)
  }
  return path.join(skinsDir, String(selection.championId), String(selection.skinId), `${selection.skinId}.fantome`)
}

function skinPreviewPath(selection: SkinRuntimeSelection): string {
  const skinsDir = path.join(runtimeRoot(), 'skins')
  if (selection.chromaId) {
    return path.join(skinsDir, String(selection.championId), String(selection.skinId), String(selection.chromaId), `${selection.chromaId}.png`)
  }
  return path.join(skinsDir, String(selection.championId), String(selection.skinId), `${selection.skinId}.png`)
}

function downloadUrl(selection: SkinRuntimeSelection): string {
  if (selection.chromaId) {
    return `https://raw.githubusercontent.com/Alban1911/LeagueSkins/main/skins/${selection.championId}/${selection.skinId}/${selection.chromaId}/${selection.chromaId}.fantome`
  }
  return `https://raw.githubusercontent.com/Alban1911/LeagueSkins/main/skins/${selection.championId}/${selection.skinId}/${selection.skinId}.fantome`
}

const SKIN_REPO_ZIP_URL = 'https://github.com/Alban1911/LeagueSkins/archive/refs/heads/main.zip'
const SKIN_REPO_API = 'https://api.github.com/repos/Alban1911/LeagueSkins'
const VERSION_FILE = '.skin_version'

async function getLocalSkinVersion(): Promise<string | null> {
  const versionFile = path.join(runtimeRoot(), 'skins', VERSION_FILE)
  try {
    return (await readFile(versionFile, 'utf-8')).trim()
  } catch {
    return null
  }
}

async function getRemoteSkinVersion(): Promise<string | null> {
  return new Promise((resolve) => {
    const req = https.get(`${SKIN_REPO_API}/commits/main`, {
      headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'ARAMGG' },
      timeout: 10000,
    }, (response) => {
      let data = ''
      response.on('data', chunk => { data += chunk })
      response.on('end', () => {
        try {
          const json = JSON.parse(data)
          resolve(json.sha || null)
        } catch { resolve(null) }
      })
    })
    req.on('error', () => resolve(null))
    req.on('timeout', () => { req.destroy(); resolve(null) })
  })
}

export async function hasSkinRepoChanged(): Promise<boolean> {
  const local = await getLocalSkinVersion()
  if (!local) return true
  const remote = await getRemoteSkinVersion()
  if (!remote) return false
  return local !== remote
}

async function downloadRepoZipWithRedirect(url: string, tempZip: string, onProgress?: (progress: number, message: string) => void, redirects = 0): Promise<void> {
  if (redirects > 5) throw new Error('皮肤仓库重定向次数过多')
  const received = await stat(tempZip).then(v => v.size).catch(() => 0)
  await new Promise<void>((resolve, reject) => {
    const request = https.get(url, {
      headers: received ? { Range: `bytes=${received}-` } : {},
      timeout: 300000,
    }, (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume()
        const redirectUrl = new URL(response.headers.location, url).toString()
        downloadRepoZipWithRedirect(redirectUrl, tempZip, onProgress, redirects + 1).then(resolve, reject)
        return
      }
      if (response.statusCode !== 200 && response.statusCode !== 206) {
        response.resume()
        reject(new Error(`下载皮肤仓库失败（HTTP ${response.statusCode}）`))
        return
      }
      const append = response.statusCode === 206 && received > 0
      const total = Number(response.headers['content-length'] || 0) + (append ? received : 0)
      let current = append ? received : 0
      const output = createWriteStream(tempZip, { flags: append ? 'a' : 'w' })
      response.on('data', chunk => {
        current += chunk.length
        if (total > 0) onProgress?.(Math.min(95, Math.round(current / total * 100)), `正在下载皮肤仓库… ${Math.round(current / total * 100)}%`)
      })
      response.pipe(output)
      output.on('finish', () => output.close(() => resolve()))
      output.on('error', reject)
    })
    request.on('error', reject)
    request.on('timeout', () => { request.destroy(); reject(new Error('下载皮肤仓库超时')) })
  })
}

export async function downloadSkinsRepo(onProgress?: (progress: number, message: string) => void): Promise<boolean> {
  if (!state.supported) return false
  const skinsDir = path.join(runtimeRoot(), 'skins')
  await mkdir(skinsDir, { recursive: true })

  const remoteSha = await getRemoteSkinVersion()
  const localSha = await getLocalSkinVersion()
  if (remoteSha && localSha === remoteSha) {
    onProgress?.(100, '皮肤仓库已是最新')
    return true
  }

  onProgress?.(0, '正在下载皮肤仓库…')
  const tempZip = path.join(runtimeRoot(), 'skins-repo.zip')
  await downloadRepoZipWithRedirect(SKIN_REPO_ZIP_URL, tempZip, onProgress)

  onProgress?.(95, '正在解压皮肤文件…')
  const zip = new AdmZip(tempZip)
  const entries = zip.getEntries()
  const skinsPrefix = 'LeagueSkins-main/skins/'
  const resourcesPrefix = 'LeagueSkins-main/resources/'

  for (const entry of entries) {
    if (entry.entryName.startsWith(skinsPrefix) && !entry.entryName.endsWith('/')) {
      const relativePath = entry.entryName.replace(skinsPrefix, '')
      const targetPath = path.join(skinsDir, relativePath)
      await mkdir(path.dirname(targetPath), { recursive: true })
      await writeFile(targetPath, entry.getData())
    } else if (entry.entryName.startsWith(resourcesPrefix) && !entry.entryName.endsWith('/')) {
      const relativePath = entry.entryName.replace(resourcesPrefix, '')
      const resourcesDir = path.join(runtimeRoot(), 'resources')
      const targetPath = path.join(resourcesDir, relativePath)
      await mkdir(path.dirname(targetPath), { recursive: true })
      await writeFile(targetPath, entry.getData())
    }
  }

  if (remoteSha) {
    const versionFile = path.join(skinsDir, VERSION_FILE)
    await writeFile(versionFile, remoteSha, 'utf-8')
  }

  await rm(tempZip, { force: true })
  onProgress?.(100, '皮肤仓库下载完成')
  return true
}

async function downloadWithResume(url: string, destination: string, generation: number, redirects = 0): Promise<void> {
  if (redirects > 5) throw new Error('皮肤资源重定向次数过多')
  await mkdir(path.dirname(destination), { recursive: true })
  const partial = `${destination}.part`
  const received = await stat(partial).then(value => value.size).catch(() => 0)
  await new Promise<void>((resolve, reject) => {
    const request = https.get(url, { headers: received ? { Range: `bytes=${received}-` } : {} }, response => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume()
        downloadWithResume(new URL(response.headers.location, url).toString(), destination, generation, redirects + 1).then(resolve, reject)
        return
      }
      if (![200, 206].includes(response.statusCode || 0)) {
        response.resume()
        reject(new Error(response.statusCode === 404 ? '该皮肤暂时没有可用的本地资源' : `下载失败（HTTP ${response.statusCode}）`))
        return
      }
      const append = response.statusCode === 206 && received > 0
      const total = Number(response.headers['content-length'] || 0) + (append ? received : 0)
      let current = append ? received : 0
      const output = createWriteStream(partial, { flags: append ? 'a' : 'w' })
      response.on('data', chunk => {
        current += chunk.length
        if (generation === operationGeneration && total > 0) setState({ progress: Math.min(99, Math.round(current / total * 100)) })
      })
      response.pipe(output)
      output.on('finish', () => output.close(() => resolve()))
      output.on('error', reject)
    })
    request.on('error', reject)
  })
  if (await exists(destination)) return
  await rename(partial, destination)
}

export async function prepareSkin(selection: SkinRuntimeSelection): Promise<SkinRuntimeState> {
  if (!state.supported) return getSkinRuntimeState()
  const startedAt = Date.now()
  const normalized: SkinRuntimeSelection = {
    championId: Number(selection.championId), skinId: Number(selection.skinId),
    championName: String(selection.championName || ''), skinName: String(selection.skinName || ''),
    chromaId: selection.chromaId ? Number(selection.chromaId) : undefined,
  }
  if (!Number.isInteger(normalized.championId) || !Number.isInteger(normalized.skinId)) throw new Error('无效的英雄或皮肤编号')
  const generation = ++operationGeneration
  if (activePreparationProcess && !activePreparationProcess.killed) activePreparationProcess.kill()
  if (activeProcess && !activeProcess.killed) activeProcess.kill()
  activePreparationProcess = null
  activeProcess = null
  await gameProcessMonitor?.stop('skin selection changed')
  state.selection = normalized
  try {
    await ensureDependencies()
    const archive = skinArchivePath(normalized)
    if (!(await exists(archive))) {
      setState({ phase: 'downloading', progress: 0, selection: normalized, message: `正在下载 ${normalized.skinName}…` })
      const dlStart = Date.now()
      await downloadWithResume(downloadUrl(normalized), archive, generation)
      recordTiming('download', dlStart)
    }
    if (generation !== operationGeneration) return getSkinRuntimeState()
    setState({ phase: 'prepared', progress: 100, selection: normalized, message: `${normalized.skinName} 已准备，将在游戏开始时应用` })
    recordTiming('prepare-total', startedAt)
    if (pendingApplyLeagueRoot) void applyPreparedSkin(pendingApplyLeagueRoot)
  } catch (error) {
    if (generation === operationGeneration) {
      const errMsg = error instanceof Error ? error.message : String(error)
      logger.error('[skin-runtime] prepare failed', { error: errMsg, durationMs: Date.now() - startedAt })
      setState({ phase: state.phase === 'missing-dependency' ? 'missing-dependency' : 'error', progress: 0, message: errMsg })
    }
  }
  return getSkinRuntimeState()
}

function run(command: string, args: string[], timeoutMs: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
    activePreparationProcess = child
    let output = ''
    const timer = setTimeout(() => { child.kill(); reject(new Error('生成皮肤覆盖层超时')) }, timeoutMs)
    child.stdout?.on('data', chunk => { output += chunk.toString() })
    child.stderr?.on('data', chunk => { output += chunk.toString() })
    child.once('error', error => { clearTimeout(timer); reject(error) })
    child.once('exit', code => {
      clearTimeout(timer)
      if (activePreparationProcess === child) activePreparationProcess = null
      if (code === 0) resolve()
      else reject(new Error(`本地替换工具执行失败（${code ?? 'unknown'}）：${output.slice(-500)}`))
    })
  })
}

export async function applyPreparedSkin(leagueRoot: string): Promise<SkinRuntimeState> {
  if (!state.supported || !state.selection) return getSkinRuntimeState()
  const startedAt = Date.now()
  pendingApplyLeagueRoot = leagueRoot
  if (state.phase === 'downloading') return getSkinRuntimeState()
  if (!['prepared', 'error'].includes(state.phase)) return getSkinRuntimeState()
  const generation = operationGeneration
  const processMonitor = getGameProcessMonitor()
  try {
    await ensureDependencies()
    const gameDirectory = path.basename(leagueRoot).toLowerCase() === 'game' ? leagueRoot : path.join(leagueRoot, 'Game')
    if (!(await exists(path.join(gameDirectory, 'League of Legends.exe')))) throw new Error('未找到游戏目录，请先在设置中选择 League of Legends 安装目录')
    const archive = skinArchivePath(state.selection)
    await processMonitor.start()
    const mods = path.join(runtimeRoot(), 'mods')
    const overlay = path.join(runtimeRoot(), 'overlay')
    await rm(mods, { recursive: true, force: true }); await rm(overlay, { recursive: true, force: true })
    const modName = `skin-${state.selection.championId}-${state.selection.skinId}`
    const modDirectory = path.join(mods, modName)
    await mkdir(modDirectory, { recursive: true })
    const extractStart = Date.now()
    new AdmZip(archive).extractAllTo(modDirectory, true)
    recordTiming('extract', extractStart)
    setState({ phase: 'applying', message: `正在生成 ${state.selection.skinName} 的本地覆盖层…` })
    const tool = path.join(toolsDirectory(), 'mod-tools.exe')
    const mkStart = Date.now()
    await run(tool, ['mkoverlay', mods, overlay, `--game:${gameDirectory}`, `--mods:${modName}`, '--noTFT', '--ignoreConflict'], 120_000)
    recordTiming('mkoverlay', mkStart)
    if (generation !== operationGeneration) {
      await processMonitor.stop('skin selection changed during overlay preparation')
      return getSkinRuntimeState()
    }
    const runStart = Date.now()
    activeProcess = await new Promise<ChildProcess>((resolve, reject) => {
      const child = spawn(tool, ['runoverlay', overlay, path.join(overlay, 'cslol-config.json'), `--game:${gameDirectory}`, '--opts:configless'], { windowsHide: true, detached: false, stdio: 'ignore' })
      child.once('spawn', () => resolve(child))
      child.once('error', reject)
    })
    recordTiming('runoverlay-spawn', runStart)
    await processMonitor.markOverlayStarted()
    activeProcess.once('exit', code => {
      activeProcess = null
      if (generation === operationGeneration && state.phase === 'active') setState({ phase: code === 0 ? 'prepared' : 'error', message: code === 0 ? '本局本地替换已结束' : `本地覆盖层意外退出（${code}）` })
    })
    setState({ phase: 'active', message: `${state.selection.skinName} 的本地替换正在运行` })
    recordTiming('apply-total', startedAt)
    pendingApplyLeagueRoot = ''
  } catch (error) {
    await processMonitor.stop('skin apply failed')
    const errMsg = error instanceof Error ? error.message : String(error)
    logger.error('[skin-runtime] apply failed', { error: errMsg, durationMs: Date.now() - startedAt })
    if (generation === operationGeneration) setState({ phase: 'error', message: errMsg })
  }
  return getSkinRuntimeState()
}

export async function clearPreparedSkin(): Promise<SkinRuntimeState> {
  operationGeneration += 1
  pendingApplyLeagueRoot = ''
  if (activeProcess && !activeProcess.killed) activeProcess.kill()
  if (activePreparationProcess && !activePreparationProcess.killed) activePreparationProcess.kill()
  await getGameProcessMonitor().stop('local skin cancelled')
  activeProcess = null
  activePreparationProcess = null
  state.selection = null
  setState({ phase: state.supported ? 'idle' : 'unsupported', progress: 0, message: state.supported ? '已取消本地皮肤' : state.message })
  return getSkinRuntimeState()
}

export async function stopSkinOverlay(): Promise<SkinRuntimeState> {
  pendingApplyLeagueRoot = ''
  if (activeProcess && !activeProcess.killed) activeProcess.kill()
  if (activePreparationProcess && !activePreparationProcess.killed) activePreparationProcess.kill()
  await getGameProcessMonitor().stop('game ended')
  activeProcess = null
  activePreparationProcess = null
  if (state.selection) {
    setState({ phase: 'prepared', message: `${state.selection.skinName} 已缓存，可在下一局继续使用` })
  }
  return getSkinRuntimeState()
}

function skinsRoot(): string {
  return path.join(runtimeRoot(), 'skins')
}

function parseModFilename(filename: string): { championId: number | null; skinId: number | null } {
  const base = filename.replace(/\.(zip|fantome)$/i, '')
  const match = /^(\d+)_(\d+)$/.exec(base)
  if (match) {
    return { championId: Number(match[1]), skinId: Number(match[2]) }
  }
  const skinMatch = /^(\d+)$/.exec(base)
  if (skinMatch) {
    const skinId = Number(skinMatch[1])
    const championId = Math.floor(skinId / 1000)
    return championId > 0 ? { championId, skinId } : { championId: null, skinId }
  }
  return { championId: null, skinId: null }
}

export async function scanLocalMods(): Promise<LocalModEntry[]> {
  const root = skinsRoot()
  const result: LocalModEntry[] = []
  const disabledDir = path.join(root, '.disabled')

  try {
    await access(root)
  } catch {
    return result
  }

  const scanDir = async (dir: string, disabled: boolean): Promise<void> => {
    let entries: string[]
    try {
      entries = await readdir(dir)
    } catch {
      return
    }

    for (const entry of entries) {
      if (entry.startsWith('.')) continue
      const fullPath = path.join(dir, entry)
      const fileStat = await stat(fullPath).catch(() => null)
      if (!fileStat || !fileStat.isFile()) continue

      const ext = path.extname(entry).toLowerCase()
      if (ext !== '.zip' && ext !== '.fantome') continue

      const { championId, skinId } = parseModFilename(entry)
      let status: LocalModEntry['status'] = disabled ? 'disabled' : 'unknown'

      if (!disabled) {
        try {
          const zip = new AdmZip(fullPath)
          if (zip.test()) {
            status = 'ready'
          } else {
            status = 'corrupt'
          }
        } catch {
          status = 'corrupt'
        }
      }

      result.push({
        filename: entry,
        size: fileStat.size,
        championId,
        skinId,
        enabled: !disabled,
        status,
      })
    }
  }

  await scanDir(root, false)
  await scanDir(disabledDir, true)

  result.sort((a, b) => {
    if (a.championId && b.championId) return a.championId - b.championId
    if (a.championId) return -1
    if (b.championId) return 1
    return a.filename.localeCompare(b.filename)
  })

  return result
}

export async function toggleLocalMod(filename: string, enabled: boolean): Promise<boolean> {
  const root = skinsRoot()
  const disabledDir = path.join(root, '.disabled')
  const srcPath = enabled
    ? path.join(disabledDir, filename)
    : path.join(root, filename)
  const destPath = enabled
    ? path.join(root, filename)
    : path.join(disabledDir, filename)

  if (!(await exists(srcPath))) return false

  if (enabled) {
    await mkdir(disabledDir, { recursive: true })
  }

  if (await exists(destPath)) {
    await rm(destPath, { force: true })
  }

  await mkdir(path.dirname(destPath), { recursive: true })
  await rename(srcPath, destPath)
  return true
}

export async function deleteLocalMod(filename: string): Promise<boolean> {
  const root = skinsRoot()
  const disabledDir = path.join(root, '.disabled')

  const enabledPath = path.join(root, filename)
  const disabledPath = path.join(disabledDir, filename)

  if (await exists(enabledPath)) {
    await rm(enabledPath, { force: true })
    return true
  }
  if (await exists(disabledPath)) {
    await rm(disabledPath, { force: true })
    return true
  }
  return false
}
