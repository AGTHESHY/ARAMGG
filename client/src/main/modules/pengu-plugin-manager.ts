import { app, ipcMain, shell } from 'electron'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { spawn } from 'node:child_process'
import { logger } from './logger'

const PLUGIN_DIR_NAME = 'aramgg-stats'
const PLUGIN_ENTRY = 'index.js'

// ==================== 路径解析 ====================

/** 程序自带的 Pengu Loader 安装包路径 */
function getBundledPenguLoaderPath(): string {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'pengu-loader')
    : path.join(__dirname, '..', '..', 'resources', 'pengu-loader')
}

/** 程序自带的 aramgg-stats 插件目录路径 */
function getBundledPluginDir(): string {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'plugin', PLUGIN_DIR_NAME)
    : path.join(__dirname, '..', '..', 'plugin', PLUGIN_DIR_NAME)
}

/** 程序自带的 aramgg-stats 插件入口文件路径 */
function getBundledPluginPath(): string {
  return path.join(getBundledPluginDir(), PLUGIN_ENTRY)
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
        if (fs.existsSync(pluginsDir) || fs.existsSync(path.join(candidate, 'Pengu Loader.exe')) || fs.existsSync(path.join(candidate, 'PenguLoader.exe'))) {
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

  // 递归复制
  copyDirRecursive(bundledPath, targetPath)

  // 确保 plugins 目录存在
  const pluginsDir = path.join(targetPath, 'plugins')
  fs.mkdirSync(pluginsDir, { recursive: true })

  logger.info('[PenguPlugin] Pengu Loader installed to:', targetPath)
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

/**
 * 确保 Pengu Loader 已安装。如果未安装且程序自带，则自动安装。
 * 返回 Pengu Loader 的安装路径。
 */
async function ensurePenguLoader(): Promise<string> {
  // 先检查是否已安装
  const existing = await findPenguLoaderPath()
  if (existing) return existing

  // 未安装，尝试从程序自带目录安装
  if (!isPenguLoaderBundled()) {
    throw new Error('Pengu Loader 未安装，且程序未附带 Pengu Loader 文件')
  }

  return installBundledPenguLoader()
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

    return {
      success: true,
      data: {
        penguInstalled,
        penguBundled,
        pluginInstalled,
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

export function registerPenguPluginIpcHandlers() {
  ipcMain.handle('pengu-plugin-get-status', () => getPenguPluginStatus())
  ipcMain.handle('pengu-plugin-install', () => installPenguPlugin())
  ipcMain.handle('pengu-plugin-uninstall', () => uninstallPenguPlugin())
  ipcMain.handle('pengu-plugin-open-folder', () => openPluginsFolder())
  ipcMain.handle('pengu-plugin-write-settings', (_event, settings) => writePenguPluginSettings(settings))
}
