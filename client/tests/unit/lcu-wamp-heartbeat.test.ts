import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LcuWampSocket } from '../../src/main/services/lcu/lcu-wamp-socket.ts'

function createConnectedSocket(overrides: Record<string, unknown> = {}) {
  const onClose = vi.fn()
  const onError = vi.fn()
  const onActivity = vi.fn()
  const instance = new LcuWampSocket({
    token: 'token',
    port: '2999',
    onGameflowPhase: vi.fn(),
    onClose,
    onError,
    onActivity,
    heartbeatIntervalMs: 1_000,
    pongTimeoutMs: 1_000,
    ...overrides,
  }) as any

  instance.connected = true
  instance.socket = {
    destroyed: false,
    write: vi.fn(),
    destroy: vi.fn(function (this: { destroyed: boolean }) {
      this.destroyed = true
    }),
  }
  instance.startHeartbeat()
  return { instance, onClose, onError, onActivity }
}

describe('LCU WAMP heartbeat', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('keeps the connection healthy only after receiving the matching pong', async () => {
    const { instance, onClose, onActivity } = createConnectedSocket()
    await vi.advanceTimersByTimeAsync(1_000)
    const ping = instance.pendingPing
    expect(ping).not.toBeNull()

    instance.handleFrame({ opcode: 0xa, payload: Buffer.from(ping!.payload) })
    expect(instance.pendingPing).toBeNull()
    expect(onActivity).toHaveBeenCalledWith(expect.objectContaining({ kind: 'pong' }))

    await vi.advanceTimersByTimeAsync(1_000)
    expect(instance.pendingPing).not.toBeNull()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('closes and reports a connection whose pong probe times out', async () => {
    const { instance, onClose, onError } = createConnectedSocket()
    await vi.advanceTimersByTimeAsync(2_000)

    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'LCU WebSocket pong timeout' }))
    expect(onClose).toHaveBeenCalledWith('pong-timeout')
    expect(instance.socket).toBeNull()
  })

  it('records inbound text and ping frames as transport activity', () => {
    const { instance, onActivity } = createConnectedSocket()
    instance.handleFrame({ opcode: 0x1, payload: Buffer.from('[]') })
    instance.handleFrame({ opcode: 0x9, payload: Buffer.from('server-ping') })

    expect(onActivity.mock.calls.map(([activity]) => activity.kind)).toEqual(['text', 'ping'])
  })

  it('isolates a socket error by closing that connection', () => {
    const { instance, onClose, onError } = createConnectedSocket()
    const failure = new Error('socket failed')
    instance.notifyError(failure)
    instance.closeWithReason('socket-error')

    expect(onError).toHaveBeenCalledWith(failure)
    expect(onClose).toHaveBeenCalledWith('socket-error')
  })
})
