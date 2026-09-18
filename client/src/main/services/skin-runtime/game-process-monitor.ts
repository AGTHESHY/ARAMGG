import { spawn, type ChildProcess } from 'child_process'
import { mkdir, rm, writeFile } from 'fs/promises'
import path from 'path'
import logger from '../../modules/logger.ts'

const GAME_PROCESS_NAME = 'League of Legends'
const MONITOR_TIMEOUT_MS = 90_000
const AUTO_RESUME_TIMEOUT_MS = 45_000

function encodePowerShell(script: string): string {
  return Buffer.from(script, 'utf16le').toString('base64')
}

function quotePowerShell(value: string): string {
  return `'${value.replace(/'/g, "''")}'`
}

function nativeProcessType(): string {
  return String.raw`
using System;
using System.Runtime.InteropServices;
public static class AramggNativeProcess {
  [DllImport("kernel32.dll", SetLastError=true)] public static extern IntPtr OpenProcess(uint access, bool inherit, int processId);
  [DllImport("kernel32.dll", SetLastError=true)] public static extern bool CloseHandle(IntPtr handle);
  [DllImport("ntdll.dll")] public static extern int NtSuspendProcess(IntPtr handle);
  [DllImport("ntdll.dll")] public static extern int NtResumeProcess(IntPtr handle);
}`
}

export function buildMonitorScript(cancelFile: string): string {
  const pollDeadline = Math.ceil(MONITOR_TIMEOUT_MS / 1000)
  const autoResumeSeconds = Math.ceil(AUTO_RESUME_TIMEOUT_MS / 1000)
  return `$ErrorActionPreference='Stop'
Add-Type -TypeDefinition @'
${nativeProcessType()}
'@
$cancelFile=${quotePowerShell(cancelFile)}
$deadline=[DateTime]::UtcNow.AddSeconds(${pollDeadline})
while ([DateTime]::UtcNow -lt $deadline) {
  if (Test-Path -LiteralPath $cancelFile) { exit 0 }
  $game=Get-Process -Name ${quotePowerShell(GAME_PROCESS_NAME)} -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($null -ne $game) {
    $handle=[AramggNativeProcess]::OpenProcess(0x0800,$false,$game.Id)
    if ($handle -eq [IntPtr]::Zero) { throw "OpenProcess failed: $([Runtime.InteropServices.Marshal]::GetLastWin32Error())" }
    try {
      $result=[AramggNativeProcess]::NtSuspendProcess($handle)
      if ($result -ne 0) { throw "NtSuspendProcess failed: $result" }
      [Console]::Out.WriteLine("SUSPENDED:$($game.Id)")
      [Console]::Out.Flush()
      Start-Sleep -Seconds ${autoResumeSeconds}
      [void][AramggNativeProcess]::NtResumeProcess($handle)
      [Console]::Out.WriteLine("AUTO_RESUMED:$($game.Id)")
      [Console]::Out.Flush()
    } finally {
      [void][AramggNativeProcess]::CloseHandle($handle)
    }
    exit 0
  }
  Start-Sleep -Milliseconds 20
}
exit 0`
}

export function buildResumeScript(processId: number): string {
  return `$ErrorActionPreference='Stop'
Add-Type -TypeDefinition @'
${nativeProcessType()}
'@
$handle=[AramggNativeProcess]::OpenProcess(0x0800,$false,${processId})
if ($handle -eq [IntPtr]::Zero) { exit 0 }
try {
  $result=[AramggNativeProcess]::NtResumeProcess($handle)
  if ($result -ne 0) { throw "NtResumeProcess failed: $result" }
} finally {
  [void][AramggNativeProcess]::CloseHandle($handle)
}`
}

function runPowerShell(script: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn('powershell.exe', [
      '-NoLogo', '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass',
      '-EncodedCommand', encodePowerShell(script),
    ], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] })
    let errorOutput = ''
    child.stderr?.on('data', chunk => { errorOutput += chunk.toString() })
    child.once('error', reject)
    child.once('exit', code => code === 0 ? resolve() : reject(new Error(errorOutput.trim() || `PowerShell exited with ${code}`)))
  })
}

function waitForProcessExit(child: ChildProcess, timeoutMs: number): Promise<boolean> {
  if (child.exitCode !== null) return Promise.resolve(true)
  return new Promise(resolve => {
    const timer = setTimeout(() => resolve(false), timeoutMs)
    child.once('exit', () => {
      clearTimeout(timer)
      resolve(true)
    })
  })
}

/** Rose-compatible game process gate: freeze League while mkoverlay is running,
 * then resume immediately after runoverlay has started. The PowerShell helper
 * keeps its own 45-second auto-resume guard in case Electron crashes. */
export class GameProcessMonitor {
  private monitorProcess: ChildProcess | null = null
  private suspendedProcessId: number | null = null
  private overlayStarted = false
  private outputBuffer = ''
  private resumePromise: Promise<void> | null = null

  constructor(private readonly dataDirectory: string) {}

  private get cancelFile(): string {
    return path.join(this.dataDirectory, 'monitor.cancel')
  }

  async start(): Promise<void> {
    if (process.platform !== 'win32') return
    await this.stop('restart monitor')
    await mkdir(this.dataDirectory, { recursive: true })
    await rm(this.cancelFile, { force: true })
    this.overlayStarted = false
    this.outputBuffer = ''
    const child = spawn('powershell.exe', [
      '-NoLogo', '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass',
      '-EncodedCommand', encodePowerShell(buildMonitorScript(this.cancelFile)),
    ], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
    this.monitorProcess = child
    child.stdout?.on('data', chunk => this.handleOutput(chunk.toString()))
    child.stderr?.on('data', chunk => logger.warn('[skin-runtime] game monitor:', chunk.toString().trim()))
    child.once('error', error => logger.warn('[skin-runtime] failed to start game monitor', error))
    child.once('exit', () => {
      if (this.monitorProcess === child) this.monitorProcess = null
    })
  }

  private handleOutput(chunk: string): void {
    this.outputBuffer += chunk
    const lines = this.outputBuffer.split(/\r?\n/)
    this.outputBuffer = lines.pop() || ''
    for (const line of lines) {
      const suspended = /^SUSPENDED:(\d+)$/.exec(line.trim())
      if (suspended) {
        this.suspendedProcessId = Number(suspended[1])
        logger.info('[skin-runtime] League process suspended for overlay preparation', { processId: this.suspendedProcessId })
        if (this.overlayStarted) void this.resume('runoverlay already started')
      }
      if (/^AUTO_RESUMED:\d+$/.test(line.trim())) {
        logger.warn('[skin-runtime] League process reached the monitor auto-resume timeout')
        this.suspendedProcessId = null
      }
    }
  }

  async markOverlayStarted(): Promise<void> {
    if (process.platform !== 'win32') return
    this.overlayStarted = true
    await writeFile(this.cancelFile, 'runoverlay-started', 'utf8').catch(() => {})
    await this.resume('runoverlay started')
  }

  async stop(reason = 'monitor stopped'): Promise<void> {
    if (process.platform !== 'win32') return
    this.overlayStarted = true
    await mkdir(this.dataDirectory, { recursive: true }).catch(() => {})
    await writeFile(this.cancelFile, reason, 'utf8').catch(() => {})
    // Give the helper one polling turn to either observe cancellation or report
    // a process that it suspended in the same instant.
    await new Promise(resolve => setTimeout(resolve, 75))
    await this.resume(reason)
    const child = this.monitorProcess
    if (child && !(await waitForProcessExit(child, 1_000)) && !this.suspendedProcessId) {
      child.kill()
    }
  }

  private async resume(reason: string): Promise<void> {
    if (this.resumePromise) return this.resumePromise
    const processId = this.suspendedProcessId
    if (!processId || process.platform !== 'win32') return
    this.resumePromise = (async () => {
      let lastError: unknown = null
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          await runPowerShell(buildResumeScript(processId))
          logger.info('[skin-runtime] League process resumed', { processId, reason, attempt })
          this.suspendedProcessId = null
          this.monitorProcess?.kill()
          return
        } catch (error) {
          lastError = error
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
      logger.error('[skin-runtime] failed to resume League process', { processId, reason, error: String(lastError) })
    })().finally(() => { this.resumePromise = null })
    return this.resumePromise
  }
}
