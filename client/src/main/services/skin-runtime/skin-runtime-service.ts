import { app, BrowserWindow } from 'electron'
import { spawn, type ChildProcess } from 'child_process'
import { createWriteStream } from 'fs'
import { access, cp, mkdir, readFile, rename, rm, stat } from 'fs/promises'
import https from 'https'
import path from 'path'
import { createRequire } from 'module'
import logger from '../../modules/logger.ts'

const require = createRequire(import.meta.url)
const AdmZip = require('adm-zip') as new (file: string) => { extractAllTo(destination: string, overwrite: boolean): void }

export type SkinRuntimePhase = 'unsupported' | 'missing-dependency' | 'idle' | 'downloading' | 'prepared' | 'applying' | 'active' | 'error'

export interface SkinRuntimeSelection {
  championId: number
  championName: string
  skinId: number
  skinName: string
}

export interface SkinRuntimeState {
  supported: boolean
  phase: SkinRuntimePhase
  progress: number
  message: string
  selection: SkinRuntimeSelection | null
  dependencyDirectory: string
}

const state: SkinRuntimeState = {
  supported: process.platform === 'win32',
  phase: process.platform === 'win32' ? 'idle' : 'unsupported',
  progress: 0,
  message: process.platform === 'win32' ? '本地替换运行器就绪' : '真实本地替换仅支持 Windows 10/11',
  selection: null,
  dependencyDirectory: '',
}

let activeProcess: ChildProcess | null = null
let operationGeneration = 0
let pendingApplyLeagueRoot = ''

function runtimeRoot(): string {
  const userData = typeof app?.getPath === 'function'
    ? app.getPath('userData')
    : path.join(process.cwd(), '.aramgg-test-data')
  return path.join(userData, 'skin-runtime')
}

function toolsDirectory(): string {
  return path.join(runtimeRoot(), 'tools')
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
  const source = path.join(packagedToolsDirectory(), 'mod-tools.exe')
  const destination = path.join(toolsDirectory(), 'mod-tools.exe')
  if (!(await exists(destination)) && await exists(source)) await cp(source, destination)
}

export async function installSkinRuntimeDll(source: string): Promise<SkinRuntimeState> {
  if (!state.supported) return getSkinRuntimeState()
  if (!source || path.basename(source).toLowerCase() !== 'cslol-dll.dll') throw new Error('请选择名为 cslol-dll.dll 的文件')
  await ensurePublicTools()
  await cp(source, path.join(toolsDirectory(), 'cslol-dll.dll'))
  setState({ phase: 'idle', message: '运行依赖已导入，可以准备本地皮肤' })
  return getSkinRuntimeState()
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
  return path.join(runtimeRoot(), 'skins', String(selection.championId), String(selection.skinId), `${selection.skinId}.fantome`)
}

function downloadUrl(selection: SkinRuntimeSelection): string {
  return `https://raw.githubusercontent.com/Alban1911/LeagueSkins/main/skins/${selection.championId}/${selection.skinId}/${selection.skinId}.fantome`
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
  const normalized = {
    championId: Number(selection.championId), skinId: Number(selection.skinId),
    championName: String(selection.championName || ''), skinName: String(selection.skinName || ''),
  }
  if (!Number.isInteger(normalized.championId) || !Number.isInteger(normalized.skinId)) throw new Error('无效的英雄或皮肤编号')
  const generation = ++operationGeneration
  state.selection = normalized
  try {
    await ensureDependencies()
    const archive = skinArchivePath(normalized)
    if (!(await exists(archive))) {
      setState({ phase: 'downloading', progress: 0, selection: normalized, message: `正在下载 ${normalized.skinName}…` })
      await downloadWithResume(downloadUrl(normalized), archive, generation)
    }
    if (generation !== operationGeneration) return getSkinRuntimeState()
    setState({ phase: 'prepared', progress: 100, selection: normalized, message: `${normalized.skinName} 已准备，将在游戏开始时应用` })
    if (pendingApplyLeagueRoot) void applyPreparedSkin(pendingApplyLeagueRoot)
  } catch (error) {
    if (generation === operationGeneration) setState({ phase: state.phase === 'missing-dependency' ? 'missing-dependency' : 'error', progress: 0, message: error instanceof Error ? error.message : String(error) })
  }
  return getSkinRuntimeState()
}

function run(command: string, args: string[], timeoutMs: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
    let output = ''
    const timer = setTimeout(() => { child.kill(); reject(new Error('生成皮肤覆盖层超时')) }, timeoutMs)
    child.stdout?.on('data', chunk => { output += chunk.toString() })
    child.stderr?.on('data', chunk => { output += chunk.toString() })
    child.once('error', error => { clearTimeout(timer); reject(error) })
    child.once('exit', code => {
      clearTimeout(timer)
      if (code === 0) resolve()
      else reject(new Error(`本地替换工具执行失败（${code ?? 'unknown'}）：${output.slice(-500)}`))
    })
  })
}

export async function applyPreparedSkin(leagueRoot: string): Promise<SkinRuntimeState> {
  if (!state.supported || !state.selection) return getSkinRuntimeState()
  pendingApplyLeagueRoot = leagueRoot
  if (state.phase === 'downloading') return getSkinRuntimeState()
  if (!['prepared', 'error'].includes(state.phase)) return getSkinRuntimeState()
  const generation = operationGeneration
  try {
    await ensureDependencies()
    const gameDirectory = path.basename(leagueRoot).toLowerCase() === 'game' ? leagueRoot : path.join(leagueRoot, 'Game')
    if (!(await exists(path.join(gameDirectory, 'League of Legends.exe')))) throw new Error('未找到游戏目录，请先在设置中选择 League of Legends 安装目录')
    const archive = skinArchivePath(state.selection)
    const mods = path.join(runtimeRoot(), 'mods')
    const overlay = path.join(runtimeRoot(), 'overlay')
    await rm(mods, { recursive: true, force: true }); await rm(overlay, { recursive: true, force: true })
    const modName = `skin-${state.selection.championId}-${state.selection.skinId}`
    const modDirectory = path.join(mods, modName)
    await mkdir(modDirectory, { recursive: true })
    new AdmZip(archive).extractAllTo(modDirectory, true)
    setState({ phase: 'applying', message: `正在生成 ${state.selection.skinName} 的本地覆盖层…` })
    const tool = path.join(toolsDirectory(), 'mod-tools.exe')
    await run(tool, ['mkoverlay', mods, overlay, `--game:${gameDirectory}`, `--mods:${modName}`, '--noTFT', '--ignoreConflict'], 120_000)
    if (generation !== operationGeneration) return getSkinRuntimeState()
    activeProcess = spawn(tool, ['runoverlay', overlay, path.join(overlay, 'cslol-config.json'), `--game:${gameDirectory}`, '--opts:configless'], { windowsHide: true, detached: false, stdio: 'ignore' })
    activeProcess.once('exit', code => {
      activeProcess = null
      if (generation === operationGeneration && state.phase === 'active') setState({ phase: code === 0 ? 'prepared' : 'error', message: code === 0 ? '本局本地替换已结束' : `本地覆盖层意外退出（${code}）` })
    })
    setState({ phase: 'active', message: `${state.selection.skinName} 的本地替换正在运行` })
    pendingApplyLeagueRoot = ''
  } catch (error) {
    logger.warn('[skin-runtime] apply failed', error)
    if (generation === operationGeneration) setState({ phase: 'error', message: error instanceof Error ? error.message : String(error) })
  }
  return getSkinRuntimeState()
}

export async function clearPreparedSkin(): Promise<SkinRuntimeState> {
  operationGeneration += 1
  pendingApplyLeagueRoot = ''
  if (activeProcess && !activeProcess.killed) activeProcess.kill()
  activeProcess = null
  state.selection = null
  setState({ phase: state.supported ? 'idle' : 'unsupported', progress: 0, message: state.supported ? '已取消本地皮肤' : state.message })
  return getSkinRuntimeState()
}

export async function stopSkinOverlay(): Promise<SkinRuntimeState> {
  pendingApplyLeagueRoot = ''
  if (activeProcess && !activeProcess.killed) activeProcess.kill()
  activeProcess = null
  if (state.selection) {
    setState({ phase: 'prepared', message: `${state.selection.skinName} 已缓存，可在下一局继续使用` })
  }
  return getSkinRuntimeState()
}

export async function scanLocalSkins(): Promise<Array<{ championId: number; skinId: number; bytes: number }>> {
  const root = path.join(runtimeRoot(), 'skins')
  const result: Array<{ championId: number; skinId: number; bytes: number }> = []
  const index = path.join(root, '.index.json')
  try {
    const cached = JSON.parse(await readFile(index, 'utf8'))
    if (Array.isArray(cached)) return cached
  } catch { /* rebuild below */ }
  return result
}
