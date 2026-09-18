import { describe, expect, it } from 'vitest'
import {
  buildMonitorScript,
  buildResumeScript,
} from '../../src/main/services/skin-runtime/game-process-monitor.ts'

describe('skin runtime game process monitor', () => {
  it('watches League, suspends it and keeps an independent auto-resume guard', () => {
    const script = buildMonitorScript("C:\\ARAMGG user's data\\monitor.cancel")

    expect(script).toContain("Get-Process -Name 'League of Legends'")
    expect(script).toContain('NtSuspendProcess')
    expect(script).toContain('NtResumeProcess')
    expect(script).toContain('Start-Sleep -Seconds 45')
    expect(script).toContain("$cancelFile='C:\\ARAMGG user''s data\\monitor.cancel'")
    expect(script.indexOf('NtSuspendProcess')).toBeLessThan(script.indexOf('SUSPENDED:'))
    expect(script.indexOf('SUSPENDED:')).toBeLessThan(script.lastIndexOf('NtResumeProcess'))
  })

  it('resumes only the process id recorded by the monitor', () => {
    const script = buildResumeScript(4242)

    expect(script).toContain('OpenProcess(0x0800,$false,4242)')
    expect(script).toContain('NtResumeProcess($handle)')
    expect(script).not.toContain('Get-Process')
  })
})
