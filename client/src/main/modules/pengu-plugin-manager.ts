import { app, ipcMain, shell } from 'electron'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { spawn } from 'node:child_process'
import { logger } from './logger'

const PLUGIN_DIR_NAME = 'aramgg-stats'
const PLUGIN_ENTRY = 'index.js'

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
        if (fs.existsSync(pluginsDir) || fs.existsSync(path.join(candidate, 'PenguLoader.exe'))) {
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

function getBundledPluginPath(): string {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'plugin', PLUGIN_DIR_NAME, PLUGIN_ENTRY)
    : path.join(__dirname, '..', '..', 'plugin', PLUGIN_DIR_NAME, PLUGIN_ENTRY)
}

export async function getPenguPluginStatus() {
  try {
    const penguPath = await findPenguLoaderPath()
    const penguInstalled = penguPath !== null
    const pluginsDir = penguPath ? path.join(penguPath, 'plugins') : null
    const pluginPath = pluginsDir ? path.join(pluginsDir, PLUGIN_DIR_NAME, PLUGIN_ENTRY) : null
    const pluginInstalled = pluginPath ? fs.existsSync(pluginPath) : false

    return {
      success: true,
      data: {
        penguInstalled,
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

export async function installPenguPlugin() {
  try {
    const penguPath = await findPenguLoaderPath()
    if (!penguPath) {
      return { success: false, error: '未找到 Pengu Loader，请先安装 Pengu Loader' }
    }

    const pluginsDir = path.join(penguPath, 'plugins')
    const targetDir = path.join(pluginsDir, PLUGIN_DIR_NAME)
    const targetFile = path.join(targetDir, PLUGIN_ENTRY)
    const sourceFile = getBundledPluginPath()

    if (!fs.existsSync(sourceFile)) {
      return { success: false, error: '插件源文件不存在' }
    }

    fs.mkdirSync(targetDir, { recursive: true })
    fs.copyFileSync(sourceFile, targetFile)

    logger.info('[PenguPlugin] Plugin installed to:', targetFile)
    return { success: true, data: { pluginPath: targetFile } }
  } catch (error) {
    logger.error('[PenguPlugin] Install failed:', error)
    return { success: false, error: `安装插件失败: ${error instanceof Error ? error.message : String(error)}` }
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
    const penguPath = await findPenguLoaderPath()
    if (!penguPath) {
      return { success: false, error: '未找到 Pengu Loader' }
    }
    const pluginDir = path.join(penguPath, 'plugins', PLUGIN_DIR_NAME)
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
