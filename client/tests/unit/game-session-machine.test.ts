import { describe, expect, it } from 'vitest'
import {
  GameSessionCoordinator,
  createInitialGameSessionState,
  reduceGameSession,
} from '../../src/main/services/game-session/game-session-machine.ts'

describe('game session machine', () => {
  it('maps a full game into stable lifecycle stages', () => {
    const coordinator = new GameSessionCoordinator(createInitialGameSessionState(0))

    const champSelect = coordinator.transition('ChampSelect', 'websocket', 10)
    expect(champSelect.changed).toBe(true)
    expect(champSelect.current.stage).toBe('champ-select')
    expect(champSelect.current.sessionSequence).toBe(1)
    expect(champSelect.entryEffect).toBe('ENTER_CHAMP_SELECT')

    expect(coordinator.transition('GameStart', 'websocket', 20).current.stage).toBe('game-loading')
    expect(coordinator.transition('InProgress', 'poll', 30).current.stage).toBe('in-progress')
    expect(coordinator.transition('WaitingForStats', 'websocket', 40).current.stage).toBe('post-game')
    expect(coordinator.transition('EndOfGame', 'websocket', 50).entryEffect).toBe('ENTER_END_OF_GAME')
  })

  it('ignores duplicate and empty phase events', () => {
    const coordinator = new GameSessionCoordinator(createInitialGameSessionState(0))
    coordinator.transition('InProgress', 'initial', 10)

    const duplicate = coordinator.transition('InProgress', 'poll', 20)
    expect(duplicate.changed).toBe(false)
    expect(duplicate.current.transitionSequence).toBe(1)
    expect(duplicate.current.lastSource).toBe('initial')

    const empty = coordinator.transition(null, 'poll', 30)
    expect(empty.changed).toBe(false)
  })

  it('starts a new sequence when champ select begins after a completed game', () => {
    const coordinator = new GameSessionCoordinator(createInitialGameSessionState(0))
    coordinator.transition('ChampSelect', 'websocket', 10)
    coordinator.transition('InProgress', 'websocket', 20)
    coordinator.transition('EndOfGame', 'websocket', 30)

    const nextGame = coordinator.transition('ChampSelect', 'websocket', 40)
    expect(nextGame.current.sessionSequence).toBe(2)
    expect(nextGame.current.transitionSequence).toBe(4)
  })

  it('keeps unknown client phases observable without inventing side effects', () => {
    const state = createInitialGameSessionState(0)
    const transition = reduceGameSession(state, {
      type: 'GAMEFLOW_PHASE_CHANGED',
      phase: 'Reconnect',
      source: 'poll',
      at: 10,
    })

    expect(transition.changed).toBe(true)
    expect(transition.current.stage).toBe('client-ready')
    expect(transition.entryEffect).toBeNull()
  })
})
