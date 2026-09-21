/**
 * LCU Token 加载器
 * 优先从运行中的 League Client 进程启动参数提取 LCU 认证信息。
 */

import logger from '../../modules/logger.ts'
import store from '../../modules/app-store.ts'
import { discoverLcuAuthFromManualDirectory } from './manual-directory-auth.ts'
import { discoverLcuAuthFromProcess } from './process-auth-discovery.ts'
import { parseLcuAuthFromLockfile } from './process-auth-discovery.ts'
import { TokenLoadResult } from './types.ts'
import { readFile, readdir, stat } from 'fs/promises'
import path from 'path'

const MANUAL_LEAGUE_PATH_KEY = 'lolPath'
let manualFallbackSuccessLogged = false
let commonPathFallbackSuccessLogged = false
let lastDiscoveredLeagueDirectory: string | null = null

/**
 * Returns the installation root used by the most recent successful automatic
 * LCU discovery. This is intentionally runtime-only: automatic discovery must
 * not overwrite a directory the user explicitly configured.
 */
export function getLastDiscoveredLeagueDirectory(): string | null {
  return lastDiscoveredLeagueDirectory
}

async function isLeagueInstallation(directory: string): Promise<boolean> {
  try {
    return (await stat(path.join(directory, 'Game', 'League of Legends.exe'))).isFile()
  } catch {
    return false
  }
}

/** Locate a usable League installation even when LCU itself was discovered
 * from process arguments.  Process-based auth does not carry its install root
 * on WeGame, so it must not be the only source for the skin runtime path. */
export async function discoverInstalledLeagueDirectory(): Promise<string | null> {
  const configured = getManualLeaguePath()
  if (configured && await isLeagueInstallation(configured)) return configured
  if (lastDiscoveredLeagueDirectory && await isLeagueInstallation(lastDiscoveredLeagueDirectory)) {
    return lastDiscoveredLeagueDirectory
  }

  for (const libraryRoot of COMMON_LEAGUE_LIBRARY_ROOTS) {
    let entries
    try {
      entries = await readdir(libraryRoot, { withFileTypes: true })
    } catch {
      continue
    }
    for (const entry of entries) {
      if (!entry.isDirectory() || !LEAGUE_DIRECTORY_NAME.test(entry.name)) continue
      const directory = path.join(libraryRoot, entry.name)
      if (await isLeagueInstallation(directory)) {
        lastDiscoveredLeagueDirectory = directory
        logger.info('[skin-runtime] discovered League installation directory', { directory })
        return directory
      }
    }
  }
  return null
}

function getManualLeaguePath(explicitDirPath?: string | null): string | null {
  const explicitPath = String(explicitDirPath || '').trim()
  if (explicitPath) {
    return explicitPath
  }

  try {
    const configuredPath = store.get(MANUAL_LEAGUE_PATH_KEY)
    return typeof configuredPath === 'string' && configuredPath.trim()
      ? configuredPath.trim()
      : null
  } catch (error) {
    const err = error as Error
    logger.debug('[getLcuToken] 读取手动 LCU 目录配置失败:', err.message)
    return null
  }
}

/**
 * 常见的 League of Legends 安装路径（参考 Rose 项目）。
 * 当进程命令行提取失败且未配置手动路径时，在这些位置查找 lockfile。
 */
const COMMON_LOCKFILE_PATHS: string[] = [
  'C:\\Riot Games\\League of Legends\\lockfile',
  'C:\\Program Files\\Riot Games\\League of Legends\\lockfile',
  'C:\\Program Files (x86)\\Riot Games\\League of Legends\\lockfile',
  'D:\\Riot Games\\League of Legends\\lockfile',
  'D:\\Program Files\\Riot Games\\League of Legends\\lockfile',
  'E:\\Riot Games\\League of Legends\\lockfile',
  'E:\\Program Files\\Riot Games\\League of Legends\\lockfile',
  'F:\\Riot Games\\League of Legends\\lockfile',
  'G:\\Riot Games\\League of Legends\\lockfile',
]

/**
 * Tencent/WeGame installs commonly put the client under a versioned child
 * directory (for example `E:\\Game\\WeGame\\英雄联盟(26)`).  Those paths cannot be
 * represented safely by a static list.  We only inspect immediate children of
 * known game-library roots and reuse the normal manual-directory discovery,
 * which falls back to the readable LeagueClientUx log when the live lockfile
 * is exclusively locked by the client.
 */
const COMMON_LEAGUE_LIBRARY_ROOTS = [
  'C:\\Game\\WeGame',
  'D:\\Game\\WeGame',
  'E:\\Game\\WeGame',
  'F:\\Game\\WeGame',
  'G:\\Game\\WeGame',
  'C:\\WeGameApps',
  'D:\\WeGameApps',
  'E:\\WeGameApps',
  'F:\\WeGameApps',
  'G:\\WeGameApps',
]

const LEAGUE_DIRECTORY_NAME = /^(?:League of Legends|LeagueOfLegends|英雄联盟)(?:\s*\([^)]*\))?$/i

async function discoverLcuAuthFromCommonLeagueDirectories(): Promise<TokenLoadResult> {
  for (const libraryRoot of COMMON_LEAGUE_LIBRARY_ROOTS) {
    let entries
    try {
      entries = await readdir(libraryRoot, { withFileTypes: true })
    } catch {
      continue
    }

    for (const entry of entries) {
      if (!entry.isDirectory() || !LEAGUE_DIRECTORY_NAME.test(entry.name)) continue
      const leagueDirectory = path.join(libraryRoot, entry.name)
      const result = await discoverLcuAuthFromManualDirectory(leagueDirectory)
      if (result[0] && result[1]) {
        lastDiscoveredLeagueDirectory = leagueDirectory
        logger.info('[getLcuToken] 已通过 WeGame/常见游戏库目录发现 LCU 凭据', {
          leagueDirectory,
          port: result[1],
        })
        return result
      }
    }
  }

  return [null, null, null]
}

/**
 * 从常见安装路径中查找 lockfile 并提取 LCU 凭据。
 * 这是进程命令行提取失败时的最后兜底方案。
 */
async function discoverLcuAuthFromCommonLockfilePaths(): Promise<TokenLoadResult> {
  for (const lockfilePath of COMMON_LOCKFILE_PATHS) {
    try {
      const fileStat = await stat(lockfilePath)
      if (!fileStat.isFile()) continue

      const content = await readFile(lockfilePath, 'utf8')
      const result = parseLcuAuthFromLockfile(content)
      if (result[0] && result[1]) {
        if (!commonPathFallbackSuccessLogged) {
          commonPathFallbackSuccessLogged = true
          logger.info('[getLcuToken] 已通过常见安装路径 lockfile 兜底发现 LCU 凭据', {
            lockfilePath,
            port: result[1],
          })
        } else {
          logger.debug('[getLcuToken] 已通过常见安装路径 lockfile 兜底发现 LCU 凭据')
        }
        return result
      }
    } catch {
      // 文件不存在或无法读取，继续尝试下一个路径
    }
  }

  return [null, null, null]
}

/**
 * 从 LeagueClientUx/LeagueClient 进程参数中提取 LCU Token。
 * 如果 Windows 不暴露进程命令行，则从进程路径旁的 lockfile 或 LeagueClientUx 日志兜底读取。
 * 最后兜底：从常见安装路径查找 lockfile（参考 Rose 项目）。
 */
export async function getLcuToken(
    dirPath?: string | null,
    forceRefresh: boolean = false
): Promise<TokenLoadResult> {
  try {
    // 1. 优先从进程命令行提取
    const processResult = await discoverLcuAuthFromProcess(forceRefresh)
    if (processResult[0] && processResult[1]) {
      return processResult
    }

    // 2. 尝试从配置的手动目录提取（lockfile + 日志）
    const manualLeaguePath = getManualLeaguePath(dirPath)
    if (manualLeaguePath) {
      const manualResult = await discoverLcuAuthFromManualDirectory(manualLeaguePath)
      if (manualResult[0] && manualResult[1]) {
        lastDiscoveredLeagueDirectory = manualLeaguePath
        if (!manualFallbackSuccessLogged) {
          manualFallbackSuccessLogged = true
          logger.info('[getLcuToken] 已通过手动目录兜底发现 LCU 凭据')
        } else {
          logger.debug('[getLcuToken] 已通过手动目录兜底发现 LCU 凭据')
        }
        return manualResult
      }

      logger.debug('[getLcuToken] 手动目录兜底未发现 LCU 凭据')
    }

    // 3. 尝试 WeGame 等版本化游戏库目录。该路径下的 lockfile 可能被
    //    LeagueClient 独占锁定，因此 discoverLcuAuthFromManualDirectory 会继续
    //    从同目录的 LeagueClientUx 日志读取临时认证信息。
    const commonDirectoryResult = await discoverLcuAuthFromCommonLeagueDirectories()
    if (commonDirectoryResult[0] && commonDirectoryResult[1]) {
      return commonDirectoryResult
    }

    // 4. 最后兜底：从常见安装路径查找 lockfile（参考 Rose 项目）
    const commonResult = await discoverLcuAuthFromCommonLockfilePaths()
    if (commonResult[0] && commonResult[1]) {
      return commonResult
    }

    logger.debug('[getLcuToken] 所有 LCU 凭据发现策略均失败')
    return [null, null, null]
  } catch (err) {
    const error = err as Error
    logger.error('[getLcuToken] LCU 进程发现失败:', error.message)
    logger.debug('  Stack:', error.stack)
    return [null, null, null]
  }
}

export default {
  getLcuToken,
}
