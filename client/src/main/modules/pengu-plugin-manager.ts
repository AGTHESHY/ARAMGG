import { app, ipcMain, shell } from 'electron'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { spawn } from 'node:child_process'
import { logger } from './logger'

const PLUGIN_DIR_NAME = 'sona'
const OLD_PLUGIN_DIR_NAMES = ['aramgg-stats', 'sona-aramgg']
const PLUGIN_ENTRY = 'index.js'

// ==================== 路径解析 ====================

/** 程序自带的 Pengu Loader 安装包路径 */
function getBundledPenguLoaderPath(): string {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'pengu-loader')
    : path.join(__dirname, '..', '..', 'resources', 'pengu-loader')
}

/** 程序自带的 sona-aramgg 插件目录路径 */
function getBundledPluginDir(): string {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'plugin', PLUGIN_DIR_NAME)
    : path.join(__dirname, '..', 'plugin', PLUGIN_DIR_NAME)
}

/** 检查是否已自带 Pengu Loader */
function isPenguLoaderBundled(): boolean {
  try {
    return fs.existsSync(getBundledPenguLoaderPath())
  } catch {
    return false
  }
}

/** 查找已安装的 Pengu Loader 路径 */
async function findPenguLoaderPath(): Promise<string | null> {
  const candidates = [
    path.join(app.getPath('appData'), 'Pengu Loader'),
    path.join(app.getPath('home'), 'Pengu Loader'),
    'C:\\Program Files\\Pengu Loader',
    'C:\\Program Files (x86)\\Pengu Loader',
    'D:\\Pengu Loader',
    'D:\\Program Files\\Pengu Loader',
  ]

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        const pluginsDir = path.join(candidate, 'plugins')
        if (fs.existsSync(pluginsDir) || fs.existsSync(path.join(candidate, 'core.dll'))) {
          return candidate
        }
      }
    } catch {
      // ignore
    }
  }

  try {
    const regResult = spawn('reg', [
      'query', 'HKCU\\Software\\PenguLoader', '/ve',
    ], { stdio: ['ignore', 'pipe', 'ignore'] })
    let regOutput = ''
    regResult.stdout?.on('data', (data: Buffer) => { regOutput += data.toString() })
    const regPromise = new Promise<string | null>((resolve) => {
      regResult.on('close', (code) => {
        if (code === 0 && regOutput.trim()) {
          const match = regOutput.match(/REG_SZ\s+(.+)/)
          if (match?.[1]?.trim()) {
            resolve(match[1].trim())
          }
        }
        resolve(null)
      })
      regResult.on('error', () => resolve(null))
    })
    const regPath = await regPromise
    if (regPath && fs.existsSync(regPath)) return regPath
  } catch {
    // ignore registry errors
  }

  return null
}

// ==================== Pengu Loader 安装 ====================

/**
 * 从程序自带目录安装 Pengu Loader。
 * 将 bundled 目录中的所有文件复制到目标安装路径。
 */
async function installBundledPenguLoader(): Promise<string> {
  const bundledPath = getBundledPenguLoaderPath()
  if (!fs.existsSync(bundledPath)) {
    throw new Error('程序未附带 Pengu Loader 文件')
  }

  // 安装到 %APPDATA%\Pengu Loader
  const targetPath = path.join(app.getPath('appData'), 'Pengu Loader')

  // 如果已存在先移除旧文件
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true })
  }

  // 只复制 core.dll 和 version，不需要 Pengu Loader.exe（管理功能由 ARAMGG 直接实现）
  fs.mkdirSync(targetPath, { recursive: true })
  const coreSrc = path.join(bundledPath, 'core.dll')
  const coreDest = path.join(targetPath, 'core.dll')
  if (fs.existsSync(coreSrc)) {
    fs.copyFileSync(coreSrc, coreDest)
  } else {
    throw new Error('core.dll 未找到')
  }
  const versionSrc = path.join(bundledPath, 'version')
  if (fs.existsSync(versionSrc)) {
    fs.copyFileSync(versionSrc, path.join(targetPath, 'version'))
  }

  // 确保 plugins 目录存在
  const pluginsDir = path.join(targetPath, 'plugins')
  fs.mkdirSync(pluginsDir, { recursive: true })

  logger.info('[PenguPlugin] Pengu Loader core installed to:', targetPath)
  return targetPath
}

function copyDirRecursive(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

// ==================== 状态查询 ====================

export async function getPenguPluginStatus() {
  try {
    const penguPath = await findPenguLoaderPath()
    const penguInstalled = penguPath !== null
    const penguBundled = isPenguLoaderBundled()
    const pluginsDir = penguPath ? path.join(penguPath, 'plugins') : null
    const pluginPath = pluginsDir ? path.join(pluginsDir, PLUGIN_DIR_NAME, PLUGIN_ENTRY) : null
    const pluginInstalled = pluginPath ? fs.existsSync(pluginPath) : false
    const oldPluginInstalled = pluginsDir
      ? OLD_PLUGIN_DIR_NAMES.some(oldName => fs.existsSync(path.join(pluginsDir, oldName, PLUGIN_ENTRY)))
      : false

    return {
      success: true,
      data: {
        penguInstalled,
        penguBundled,
        pluginInstalled,
        oldPluginInstalled,
        pluginPath: pluginPath ?? undefined,
        penguPath: penguPath ?? undefined,
      },
    }
  } catch (error) {
    logger.error('[PenguPlugin] Failed to get status:', error)
    return { success: false, error: '检查 Pengu Loader 状态失败' }
  }
}

// ==================== 插件安装/卸载 ====================

export async function installPenguPlugin() {
  try {
    // 确保 Pengu Loader 已安装（自动从程序自带目录安装）
    let penguPath = await findPenguLoaderPath()
    if (!penguPath) {
      if (!isPenguLoaderBundled()) {
        return { success: false, error: 'Pengu Loader 未安装，且程序未附带 Pengu Loader 文件' }
      }
      penguPath = await installBundledPenguLoader()
    }

    const pluginsDir = path.join(penguPath, 'plugins')
    const targetDir = path.join(pluginsDir, PLUGIN_DIR_NAME)
    const sourceDir = getBundledPluginDir()

    if (!fs.existsSync(path.join(sourceDir, PLUGIN_ENTRY))) {
      return { success: false, error: '插件源文件不存在' }
    }

    // 清理旧安装
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true })
    }

    // 清理旧版插件目录名
    for (const oldName of OLD_PLUGIN_DIR_NAMES) {
      const oldDir = path.join(pluginsDir, oldName)
      if (fs.existsSync(oldDir)) {
        fs.rmSync(oldDir, { recursive: true, force: true })
        logger.info('[PenguPlugin] Cleaned up old plugin dir:', oldDir)
      }
    }

    // 复制整个插件目录（包含 index.js + package.json）
    copyDirRecursive(sourceDir, targetDir)

    logger.info('[PenguPlugin] Plugin installed to:', targetDir)
    return { success: true, data: { pluginPath: path.join(targetDir, PLUGIN_ENTRY), penguPath } }
  } catch (error) {
    logger.error('[PenguPlugin] Install failed:', error)
    return { success: false, error: `安装失败: ${error instanceof Error ? error.message : String(error)}` }
  }
}

export async function uninstallPenguPlugin() {
  try {
    const penguPath = await findPenguLoaderPath()
    if (!penguPath) {
      return { success: false, error: '未找到 Pengu Loader' }
    }

    const targetDir = path.join(penguPath, 'plugins', PLUGIN_DIR_NAME)
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true })
      logger.info('[PenguPlugin] Plugin uninstalled from:', targetDir)
    }

    return { success: true }
  } catch (error) {
    logger.error('[PenguPlugin] Uninstall failed:', error)
    return { success: false, error: `卸载插件失败: ${error instanceof Error ? error.message : String(error)}` }
  }
}

export async function openPluginsFolder() {
  try {
    const penguPath = await findPenguLoaderPath()
    if (!penguPath) {
      return { success: false, error: '未找到 Pengu Loader' }
    }
    const pluginsDir = path.join(penguPath, 'plugins')
    fs.mkdirSync(pluginsDir, { recursive: true })
    void shell.openPath(pluginsDir)
    return { success: true }
  } catch (error) {
    logger.error('[PenguPlugin] Open folder failed:', error)
    return { success: false, error: '打开插件目录失败' }
  }
}

export async function writePenguPluginSettings(settings: Record<string, unknown>) {
  try {
    let penguPath = await findPenguLoaderPath()
    if (!penguPath) {
      if (!isPenguLoaderBundled()) {
        return { success: false, error: 'Pengu Loader 未安装，且程序未附带' }
      }
      penguPath = await installBundledPenguLoader()
    }
    const pluginDir = path.join(penguPath, 'plugins', PLUGIN_DIR_NAME)
    fs.mkdirSync(pluginDir, { recursive: true })
    const settingsFile = path.join(pluginDir, 'settings.json')
    fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8')
    logger.info('[PenguPlugin] Settings written:', settingsFile)
    return { success: true }
  } catch (error) {
    logger.error('[PenguPlugin] Write settings failed:', error)
    return { success: false, error: '写入插件设置失败' }
  }
}

// ==================== IFEO 注入开关（直接注册表操作） ====================

// IFEO 注册表路径
const IFEO_PATH = 'SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options'
const IFEO_TARGET = 'LeagueClientUx.exe'
const DLL_ENTRY = '#6000'

/** 获取 core.dll 路径 */
function getCoreDllPath(penguPath: string): string {
  return path.join(penguPath, 'core.dll')
}

/** 构造 IFEO Debugger 值：rundll32 "path\to\core.dll", #6000 */
function buildDebuggerValue(coreDllPath: string): string {
  return `rundll32 "${coreDllPath}", ${DLL_ENTRY}`
}

/** 从 Debugger 值中提取 core.dll 路径 */
function extractCorePath(debuggerValue: string): string | null {
  const start = debuggerValue.indexOf('"')
  if (start === -1) return null
  const end = debuggerValue.indexOf('"', start + 1)
  if (end === -1) return null
  return debuggerValue.slice(start + 1, end)
}

/** 规范化路径用于比较 */
function normalizePath(p: string): string {
  return p.toLowerCase().replace(/\//g, '\\')
}

/** 执行 reg query 读取 IFEO Debugger 值 */
function regQueryDebugger(): Promise<string | null> {
  return new Promise((resolve) => {
    const keyPath = `${IFEO_PATH}\\${IFEO_TARGET}`
    const child = spawn('reg', ['query', keyPath, '/v', 'Debugger'], {
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let stdout = ''
    let stderr = ''
    child.stdout?.on('data', (data: Buffer) => { stdout += data.toString() })
    child.stderr?.on('data', (data: Buffer) => { stderr += data.toString() })
    child.on('close', (code) => {
      if (code !== 0) {
        resolve(null)
        return
      }
      const match = stdout.match(/Debugger\s+REG_SZ\s+(.+)/)
      resolve(match ? match[1].trim() : null)
    })
    child.on('error', () => resolve(null))
  })
}

/**
 * 通过 PowerShell 提权执行脚本（使用 Base64 编码避免引号问题）
 * 返回提权进程的退出码
 */
function runElevatedPsScript(script: string): Promise<number> {
  return new Promise((resolve) => {
    const encoded = Buffer.from(script, 'utf16le').toString('base64')
    const wrapper = `$p = Start-Process powershell -ArgumentList '-NoProfile','-EncodedCommand','${encoded}' -Verb RunAs -Wait -PassThru; if ($p) { $p.ExitCode } else { 0 }`
    const child = spawn('powershell', ['-NoProfile', '-Command', wrapper], {
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let stdout = ''
    child.stdout?.on('data', (data: Buffer) => { stdout += data.toString() })
    child.on('close', (code) => {
      const trimmed = stdout.trim()
      resolve(trimmed ? parseInt(trimmed) || 0 : (code ?? 0))
    })
    child.on('error', () => resolve(1))
  })
}

/** 检查 IFEO 注入状态 */
export async function getPenguInjectionStatus() {
  try {
    const penguPath = await findPenguLoaderPath()
    if (!penguPath) {
      return { success: true, data: { active: false, installed: false } }
    }

    const debuggerValue = await regQueryDebugger()
    if (!debuggerValue) {
      return { success: true, data: { active: false, installed: true } }
    }

    const registeredPath = extractCorePath(debuggerValue)
    const expectedPath = getCoreDllPath(penguPath)
    const active = !!(registeredPath && normalizePath(registeredPath) === normalizePath(expectedPath))

    return {
      success: true,
      data: {
        active,
        installed: true,
        detail: active ? 'IFEO active' : `IFEO points to different core: ${registeredPath}`,
      },
    }
  } catch (error) {
    logger.error('[PenguPlugin] Failed to check injection status:', error)
    return { success: false, error: '检查注入状态失败' }
  }
}

/** 启用 IFEO 注入（写入注册表，需要管理员权限） */
export async function enablePenguInjection() {
  try {
    let penguPath = await findPenguLoaderPath()
    if (!penguPath) {
      if (!isPenguLoaderBundled()) {
        return { success: false, error: 'Pengu Loader 未安装，且程序未附带' }
      }
      penguPath = await installBundledPenguLoader()
    }

    const coreDll = getCoreDllPath(penguPath)
    if (!fs.existsSync(coreDll)) {
      return { success: false, error: 'core.dll 未找到，请重新安装 Pengu Loader' }
    }

    const debuggerValue = buildDebuggerValue(coreDll)
    const keyPath = `HKLM:\\${IFEO_PATH}\\${IFEO_TARGET}`

    const psScript = [
      `$key = '${keyPath}'`,
      `if (-not (Test-Path $key)) { New-Item -Path $key -Force | Out-Null }`,
      `Set-ItemProperty -Path $key -Name 'Debugger' -Value '${debuggerValue.replace(/'/g, "''")}' -Type String`,
      `exit 0`,
    ].join('\n')

    const code = await runElevatedPsScript(psScript)

    if (code === 0) {
      logger.info('[PenguPlugin] IFEO injection enabled, core:', coreDll)
      return { success: true, data: { detail: 'IFEO injection enabled' } }
    }
    logger.error('[PenguPlugin] IFEO enable failed, code:', code)
    return { success: false, error: '写入注册表失败，可能用户取消了 UAC 提权' }
  } catch (error) {
    logger.error('[PenguPlugin] Failed to enable injection:', error)
    return { success: false, error: '启用注入失败' }
  }
}

/** 禁用 IFEO 注入（删除注册表值，需要管理员权限） */
export async function disablePenguInjection() {
  try {
    const penguPath = await findPenguLoaderPath()
    if (!penguPath) {
      return { success: false, error: 'Pengu Loader 未安装' }
    }

    const keyPath = `HKLM:\\${IFEO_PATH}\\${IFEO_TARGET}`

    const psScript = [
      `$key = '${keyPath}'`,
      `if (Test-Path $key) { Remove-ItemProperty -Path $key -Name 'Debugger' -ErrorAction SilentlyContinue }`,
      `exit 0`,
    ].join('\n')

    const code = await runElevatedPsScript(psScript)

    if (code === 0) {
      logger.info('[PenguPlugin] IFEO injection disabled')
      return { success: true, data: { detail: 'IFEO injection disabled' } }
    }
    logger.error('[PenguPlugin] IFEO disable failed, code:', code)
    return { success: false, error: '删除注册表值失败，可能用户取消了 UAC 提权' }
  } catch (error) {
    logger.error('[PenguPlugin] Failed to disable injection:', error)
    return { success: false, error: '禁用注入失败' }
  }
}

// ==================== INI 配置读写 ====================

interface PenguConfig {
  app: {
    language?: string
    plugins_dir?: string
    league_dir?: string
    disabled_plugins?: string
    activation_mode?: number
  }
  client: {
    use_hotkeys?: boolean
    optimized_client?: boolean
    silent_mode?: boolean
    super_potato?: boolean
    insecure_mode?: boolean
    use_devtools?: boolean
    use_riotclient?: boolean
    use_proxy?: boolean
  }
}

function getPenguConfigPath(penguPath: string): string {
  return path.join(penguPath, 'config')
}

function parseIni(text: string): PenguConfig {
  const config: PenguConfig = { app: {}, client: {} }
  let currentSection: keyof PenguConfig | null = null

  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith(';')) continue

    const sectionMatch = trimmed.match(/^\[(.+)\]$/)
    if (sectionMatch) {
      const sec = sectionMatch[1].toLowerCase()
      if (sec === 'app' || sec === 'client') {
        currentSection = sec
      } else {
        currentSection = null
      }
      continue
    }

    if (!currentSection) continue
    const kvMatch = trimmed.match(/^([^=]+)=(.*)$/)
    if (!kvMatch) continue

    const key = kvMatch[1].trim() as keyof PenguConfig['app'] | keyof PenguConfig['client']
    const rawValue = kvMatch[2].trim()
    const def = (defaultConfig[currentSection] as Record<string, any>)[key]
    const value = parseIniValue(rawValue, def)
    ;(config[currentSection] as Record<string, any>)[key] = value
  }

  return config
}

const defaultConfig: PenguConfig = {
  app: {
    language: 'en',
    plugins_dir: '',
    league_dir: '',
    disabled_plugins: '',
    activation_mode: 0,
  },
  client: {
    use_hotkeys: true,
    optimized_client: true,
    silent_mode: false,
    super_potato: false,
    insecure_mode: false,
    use_devtools: false,
    use_riotclient: false,
    use_proxy: false,
  },
}

function parseIniValue(val: string, def?: any): any {
  if (val != null) {
    if (typeof def === 'boolean') {
      return val.trim().toLowerCase() === '1' || val.trim().toLowerCase() === 'true'
    } else if (typeof def === 'number') {
      const num = parseInt(val.trim())
      if (!isNaN(num)) return num
    } else {
      return val
    }
  }
  return def
}

function serializeIni(config: PenguConfig): string {
  const sections: string[] = []
  for (const section of ['app', 'client'] as const) {
    sections.push(`[${section}]`)
    const entries = config[section] as Record<string, any>
    for (const key in entries) {
      const val = entries[key]
      if (typeof val === 'boolean') {
        sections.push(`${key}=${val ? '1' : '0'}`)
      } else if (typeof val === 'number') {
        sections.push(`${key}=${val}`)
      } else if (val != null && val !== '') {
        sections.push(`${key}=${val}`)
      }
    }
    sections.push('')
  }
  return sections.join('\n').trim() + '\n'
}

function readPenguConfig(penguPath: string): PenguConfig {
  const configPath = getPenguConfigPath(penguPath)
  if (!fs.existsSync(configPath)) {
    return { app: { ...defaultConfig.app }, client: { ...defaultConfig.client } }
  }
  const text = fs.readFileSync(configPath, 'utf-8')
  return parseIni(text)
}

function writePenguConfig(penguPath: string, config: PenguConfig): void {
  const configPath = getPenguConfigPath(penguPath)
  const text = serializeIni(config)
  fs.writeFileSync(configPath, text, 'utf-8')
}

// ==================== 插件扫描与元数据 ====================

interface ScannedPlugin {
  name: string
  description?: string
  author?: string
  link?: string
  path: string
  entryPath: string
  hash: number
  enabled: boolean
  builtin: boolean
}

function hashString(s: string): number {
  let hash = 0
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0
  }
  return hash
}

function parseJsdocTag(jsdoc: string, tag: string): string {
  const regex = new RegExp(`@${tag}\\s+(.+)`)
  const match = regex.exec(jsdoc)
  return match ? match[1].trim() : ''
}

function parsePluginEntry(entryPath: string): Partial<ScannedPlugin> {
  const info: Partial<ScannedPlugin> = {}
  try {
    if (fs.existsSync(entryPath)) {
      const content = fs.readFileSync(entryPath, 'utf-8')
      const desc = parseJsdocTag(content, 'description')
      const author = parseJsdocTag(content, 'author')
      const link = parseJsdocTag(content, 'link')
      if (desc) info.description = desc
      if (author) info.author = author.includes('#') ? author : '@' + author
      if (link.startsWith('https://')) info.link = link
    }
  } catch { }
  return info
}

function isAllowedName(name: string): boolean {
  return !name.startsWith('_') && !name.startsWith('.')
}

function scanPlugins(pluginsDir: string, config: PenguConfig): ScannedPlugin[] {
  const plugins: ScannedPlugin[] = []
  if (!fs.existsSync(pluginsDir)) return plugins

  const disabledSet = new Set<number>()
  const rawSet = config.app.disabled_plugins || ''
  for (const h of rawSet.split(',')) {
    const num = parseInt(h.trim(), 16)
    if (num) disabledSet.add(num)
  }

  const dir = pluginsDir.replace(/\\/g, '/')

  function pushPlugin(name: string, entryPath: string) {
    const url = entryPath.replace(/\\/g, '/')
    const shortPath = url.replace(dir + '/', '')
    const hash = hashString(shortPath.toLowerCase())
    const meta = parsePluginEntry(entryPath)
    plugins.push({
      name,
      path: shortPath,
      entryPath,
      hash,
      enabled: !disabledSet.has(hash),
      builtin: name === PLUGIN_DIR_NAME,
      ...meta,
    })
  }

  for (const entry of fs.readdirSync(pluginsDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name.startsWith('@')) {
        const authorDir = path.join(pluginsDir, entry.name)
        for (const sub of fs.readdirSync(authorDir, { withFileTypes: true })) {
          if (sub.isDirectory() && isAllowedName(sub.name)) {
            const entryJs = path.join(authorDir, sub.name, 'index.js')
            if (fs.existsSync(entryJs)) {
              pushPlugin(`${entry.name}/${sub.name}`, entryJs)
            }
          }
        }
      } else if (isAllowedName(entry.name)) {
        const entryJs = path.join(pluginsDir, entry.name, 'index.js')
        if (fs.existsSync(entryJs)) {
          pushPlugin(entry.name, entryJs)
        }
      }
    } else if (isAllowedName(entry.name) && entry.name.endsWith('.js')) {
      const name = entry.name.substring(0, entry.name.length - 3)
      pushPlugin(name, path.join(pluginsDir, entry.name))
    }
  }

  return plugins
}

// ==================== 插件启用/禁用 ====================

async function togglePluginEnabled(penguPath: string, pluginHash: number): Promise<boolean> {
  const config = readPenguConfig(penguPath)
  const disabledSet = new Set<number>()
  const rawSet = config.app.disabled_plugins || ''
  for (const h of rawSet.split(',')) {
    const num = parseInt(h.trim(), 16)
    if (num) disabledSet.add(num)
  }

  if (disabledSet.has(pluginHash)) {
    disabledSet.delete(pluginHash)
  } else {
    disabledSet.add(pluginHash)
  }

  config.app.disabled_plugins = [...disabledSet].map(x => x.toString(16)).join(',')
  writePenguConfig(penguPath, config)
  return !disabledSet.has(pluginHash)
}

// ==================== League 客户端路径 ====================

async function findLeaguePath(): Promise<string | null> {
  const jsonPath = 'C:\\ProgramData\\Riot Games\\RiotClientInstalls.json'
  try {
    if (!fs.existsSync(jsonPath)) return null
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as {
      associated_client?: Record<string, string>
      rc_default?: string
      rc_live?: string
    }

    let rcPath = ''
    if (data.rc_live) rcPath = path.dirname(data.rc_live)
    else if (data.rc_default) rcPath = path.dirname(data.rc_default)

    const candidates = [
      path.join(rcPath, '..', 'League of Legends'),
      path.join(rcPath, '..', 'League of Legends (PBE)'),
    ]

    if (data.associated_client && typeof data.associated_client === 'object') {
      for (const k of Object.keys(data.associated_client)) {
        if (/\(pbe\)/i.test(k)) {
          candidates.push(path.join(k.replace(/[\\\/]$/, '')))
        } else {
          candidates.unshift(path.join(k.replace(/[\\\/]$/, '')))
        }
      }
    }

    for (const candidate of candidates) {
      if (fs.existsSync(path.join(candidate, 'LeagueClientUx.exe'))) {
        return candidate
      }
    }
  } catch { }

  return null
}

// ==================== 导出 API ====================

export async function getPlugins() {
  try {
    const penguPath = await findPenguLoaderPath()
    if (!penguPath) {
      return { success: false, error: 'Pengu Loader 未安装' }
    }

    let pluginsDir = path.join(penguPath, 'plugins')
    const config = readPenguConfig(penguPath)
    const customDir = config.app.plugins_dir
    if (customDir && !customDir.startsWith('.')) {
      pluginsDir = customDir
    }

    const plugins = scanPlugins(pluginsDir, config)
    return { success: true, data: plugins }
  } catch (error) {
    logger.error('[PenguPlugin] Failed to scan plugins:', error)
    return { success: false, error: '扫描插件失败' }
  }
}

export async function togglePlugin(pluginHash: number) {
  try {
    const penguPath = await findPenguLoaderPath()
    if (!penguPath) {
      return { success: false, error: 'Pengu Loader 未安装' }
    }

    const enabled = await togglePluginEnabled(penguPath, pluginHash)
    logger.info(`[PenguPlugin] Plugin ${pluginHash.toString(16)} ${enabled ? 'enabled' : 'disabled'}`)
    return { success: true, data: { enabled } }
  } catch (error) {
    logger.error('[PenguPlugin] Toggle plugin failed:', error)
    return { success: false, error: '切换插件状态失败' }
  }
}

export async function getPenguConfig_() {
  try {
    const penguPath = await findPenguLoaderPath()
    if (!penguPath) {
      return { success: false, error: 'Pengu Loader 未安装' }
    }

    const config = readPenguConfig(penguPath)
    return { success: true, data: config }
  } catch (error) {
    logger.error('[PenguPlugin] Failed to read config:', error)
    return { success: false, error: '读取配置失败' }
  }
}

export async function setPenguConfigValue(section: string, key: string, value: any) {
  try {
    const penguPath = await findPenguLoaderPath()
    if (!penguPath) {
      return { success: false, error: 'Pengu Loader 未安装' }
    }

    const config = readPenguConfig(penguPath)
    if (section === 'app' || section === 'client') {
      ;(config[section] as Record<string, any>)[key] = value
      writePenguConfig(penguPath, config)
      logger.info(`[PenguPlugin] Config updated: [${section}] ${key} = ${value}`)
      return { success: true }
    }
    return { success: false, error: '无效的配置节' }
  } catch (error) {
    logger.error('[PenguPlugin] Failed to update config:', error)
    return { success: false, error: '更新配置失败' }
  }
}

export async function autoDetectLeaguePath() {
  try {
    const leaguePath = await findLeaguePath()
    if (leaguePath) {
      const penguPath = await findPenguLoaderPath()
      if (penguPath) {
        const config = readPenguConfig(penguPath)
        config.app.league_dir = leaguePath
        writePenguConfig(penguPath, config)
      }
      return { success: true, data: { leaguePath } }
    }
    return { success: false, error: '未找到英雄联盟客户端' }
  } catch (error) {
    logger.error('[PenguPlugin] Auto detect league path failed:', error)
    return { success: false, error: '自动检测失败' }
  }
}

// ==================== 重启英雄联盟客户端 ====================

/** 查找 LeagueClientUx.exe 路径 */
async function findLeagueClientExe(): Promise<string | null> {
  const leaguePath = await findLeaguePath()
  if (leaguePath) {
    const exe = path.join(leaguePath, 'LeagueClientUx.exe')
    if (fs.existsSync(exe)) return exe
  }
  const penguPath = await findPenguLoaderPath()
  if (penguPath) {
    const config = readPenguConfig(penguPath)
    if (config.app.league_dir) {
      const exe = path.join(config.app.league_dir, 'LeagueClientUx.exe')
      if (fs.existsSync(exe)) return exe
    }
  }
  return null
}

/** 终止英雄联盟客户端进程 */
function killLeagueProcesses(): Promise<void> {
  return new Promise((resolve) => {
    const child = spawn('taskkill', ['/F', '/IM', 'LeagueClientUx.exe', '/T'], {
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    child.on('close', () => resolve())
    child.on('error', () => resolve())
  })
}

/** 启动英雄联盟客户端 */
function launchLeagueClient(exePath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn('cmd', ['/c', 'start', '""', exePath], {
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: true,
      shell: true,
    })
    child.on('close', (code) => resolve(code === 0))
    child.on('error', () => resolve(false))
  })
}

/** 重启英雄联盟客户端 */
export async function restartLeagueClient() {
  try {
    const exePath = await findLeagueClientExe()
    if (!exePath) {
      return { success: false, error: '未找到英雄联盟客户端路径' }
    }

    logger.info('[PenguPlugin] Killing League client processes...')
    await killLeagueProcesses()

    await new Promise(r => setTimeout(r, 2000))

    logger.info('[PenguPlugin] Launching League client:', exePath)
    const launched = await launchLeagueClient(exePath)

    if (launched) {
      logger.info('[PenguPlugin] League client restarted')
      return { success: true, data: { exePath } }
    }
    return { success: false, error: '启动客户端失败' }
  } catch (error) {
    logger.error('[PenguPlugin] Failed to restart client:', error)
    return { success: false, error: '重启客户端失败' }
  }
}

export function registerPenguPluginIpcHandlers() {
  ipcMain.handle('pengu-plugin-get-status', () => getPenguPluginStatus())
  ipcMain.handle('pengu-plugin-install', () => installPenguPlugin())
  ipcMain.handle('pengu-plugin-uninstall', () => uninstallPenguPlugin())
  ipcMain.handle('pengu-plugin-open-folder', () => openPluginsFolder())
  ipcMain.handle('pengu-plugin-write-settings', (_event, settings) => writePenguPluginSettings(settings))
  ipcMain.handle('pengu-plugin-get-injection', () => getPenguInjectionStatus())
  ipcMain.handle('pengu-plugin-enable-injection', () => enablePenguInjection())
  ipcMain.handle('pengu-plugin-disable-injection', () => disablePenguInjection())
  ipcMain.handle('pengu-plugin-get-plugins', () => getPlugins())
  ipcMain.handle('pengu-plugin-toggle', (_event, hash: number) => togglePlugin(hash))
  ipcMain.handle('pengu-plugin-get-config', () => getPenguConfig_())
  ipcMain.handle('pengu-plugin-set-config', (_event, section: string, key: string, value: any) => setPenguConfigValue(section, key, value))
  ipcMain.handle('pengu-plugin-detect-league', () => autoDetectLeaguePath())
  ipcMain.handle('pengu-plugin-restart-client', () => restartLeagueClient())
}
