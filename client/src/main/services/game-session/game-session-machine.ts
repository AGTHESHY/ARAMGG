export type GameSessionStage =
  | 'disconnected'
  | 'client-ready'
  | 'champ-select'
  | 'game-loading'
  | 'in-progress'
  | 'post-game'

export type GameSessionEntryEffect =
  | 'RESET_IDLE_SERVICES'
  | 'ENTER_CHAMP_SELECT'
  | 'ENTER_GAME_START'
  | 'ENTER_IN_PROGRESS'
  | 'ENTER_WAITING_FOR_STATS'
  | 'ENTER_PRE_END_OF_GAME'
  | 'ENTER_END_OF_GAME'

export interface GameSessionState {
  phase: string | null
  stage: GameSessionStage
  sessionSequence: number
  transitionSequence: number
  lastSource: string | null
  updatedAt: number
}

export interface GameflowPhaseEvent {
  type: 'GAMEFLOW_PHASE_CHANGED'
  phase: string | null | undefined
  source: string
  at?: number
}

export interface GameSessionTransition {
  changed: boolean
  previous: GameSessionState
  current: GameSessionState
  entryEffect: GameSessionEntryEffect | null
}

export function getGameSessionStage(phase: string | null): GameSessionStage {
  switch (phase) {
    case null:
      return 'disconnected'
    case 'ChampSelect':
      return 'champ-select'
    case 'GameStart':
      return 'game-loading'
    case 'InProgress':
      return 'in-progress'
    case 'WaitingForStats':
    case 'PreEndOfGame':
    case 'EndOfGame':
      return 'post-game'
    default:
      return 'client-ready'
  }
}

export function getGameSessionEntryEffect(phase: string): GameSessionEntryEffect | null {
  switch (phase) {
    case 'Lobby':
    case 'Matchmaking':
    case 'ReadyCheck':
      return 'RESET_IDLE_SERVICES'
    case 'ChampSelect':
      return 'ENTER_CHAMP_SELECT'
    case 'GameStart':
      return 'ENTER_GAME_START'
    case 'InProgress':
      return 'ENTER_IN_PROGRESS'
    case 'WaitingForStats':
      return 'ENTER_WAITING_FOR_STATS'
    case 'PreEndOfGame':
      return 'ENTER_PRE_END_OF_GAME'
    case 'EndOfGame':
      return 'ENTER_END_OF_GAME'
    default:
      return null
  }
}

export function createInitialGameSessionState(at = Date.now()): GameSessionState {
  return {
    phase: null,
    stage: 'disconnected',
    sessionSequence: 0,
    transitionSequence: 0,
    lastSource: null,
    updatedAt: at,
  }
}

export function reduceGameSession(
  state: GameSessionState,
  event: GameflowPhaseEvent,
): GameSessionTransition {
  const phase = typeof event.phase === 'string' && event.phase.trim()
    ? event.phase.trim()
    : null

  if (!phase || phase === state.phase) {
    return {
      changed: false,
      previous: state,
      current: state,
      entryEffect: null,
    }
  }

  const stage = getGameSessionStage(phase)
  const beginsSession =
    (stage === 'champ-select' && state.stage !== 'champ-select') ||
    (stage === 'in-progress' && state.sessionSequence === 0)
  const current: GameSessionState = {
    phase,
    stage,
    sessionSequence: state.sessionSequence + (beginsSession ? 1 : 0),
    transitionSequence: state.transitionSequence + 1,
    lastSource: event.source,
    updatedAt: event.at ?? Date.now(),
  }

  return {
    changed: true,
    previous: state,
    current,
    entryEffect: getGameSessionEntryEffect(phase),
  }
}

export class GameSessionCoordinator {
  private state: GameSessionState

  constructor(initialState = createInitialGameSessionState()) {
    this.state = initialState
  }

  getState(): Readonly<GameSessionState> {
    return this.state
  }

  transition(phase: string | null | undefined, source: string, at?: number): GameSessionTransition {
    const transition = reduceGameSession(this.state, {
      type: 'GAMEFLOW_PHASE_CHANGED',
      phase,
      source,
      at,
    })
    this.state = transition.current
    return transition
  }

  reset(at = Date.now()): GameSessionState {
    this.state = createInitialGameSessionState(at)
    return this.state
  }
}
