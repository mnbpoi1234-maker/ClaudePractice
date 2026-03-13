import { useReducer, useCallback } from 'react'
import type { GameState, Difficulty } from '../types/game'
import { countClaps, getCorrectAction } from '../utils/gameRules'

type Action =
  | { type: 'COMPUTER_PLAY' }
  | { type: 'USER_SHOUT' }
  | { type: 'USER_CLAP' }
  | { type: 'TIMEOUT' }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'SET_PLAYER_COUNT'; count: number }
  | { type: 'RESET' }

/** 플레이어 수와 난이도로 초기 게임 상태를 생성 */
function createInitialState(difficulty: Difficulty, playerCount: number): GameState {
  return {
    currentNumber: 1,
    currentPlayerIndex: 1,  // 컴퓨터가 먼저 시작
    playerCount,
    pendingPlayerCount: playerCount,
    status: 'playing',
    difficulty,
    actionTexts: ['', '', '', ''],
    remainingClaps: 0,
  }
}

/** 다음 플레이어 인덱스 계산 */
function nextPlayerIndex(current: number, playerCount: number): number {
  return (current + 1) % playerCount
}

/** 행위 텍스트 배열의 특정 인덱스 값을 업데이트 */
function updateActionTexts(
  texts: [string, string, string, string],
  index: number,
  text: string
): [string, string, string, string] {
  const next = [...texts] as [string, string, string, string]
  next[index] = text
  return next
}

/** 게임 상태 reducer - 모든 상태 전이를 순수하게 처리 */
function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'COMPUTER_PLAY': {
      // 컴퓨터 턴이 아니거나 게임이 종료된 경우 무시
      if (state.currentPlayerIndex === 0 || state.status !== 'playing') return state
      const correctAction = getCorrectAction(state.currentNumber)
      const nextNumber = state.currentNumber + 1
      const next = nextPlayerIndex(state.currentPlayerIndex, state.playerCount)
      return {
        ...state,
        actionTexts: updateActionTexts(state.actionTexts, state.currentPlayerIndex, correctAction.text),
        currentNumber: nextNumber,
        currentPlayerIndex: next,
        // 다음이 사용자 차례이면 박수 횟수 계산, 컴퓨터 차례이면 0
        remainingClaps: next === 0 ? countClaps(nextNumber) : 0,
      }
    }

    case 'USER_SHOUT': {
      // 사용자 턴이 아니거나 게임이 종료된 경우 무시 (연타 방지)
      if (state.currentPlayerIndex !== 0 || state.status !== 'playing') return state
      // 박수가 남아있는데 숫자를 외침 → 오답
      if (state.remainingClaps > 0) return { ...state, status: 'gameover' }
      const correctAction = getCorrectAction(state.currentNumber)
      const nextNumber = state.currentNumber + 1
      const next = nextPlayerIndex(0, state.playerCount)
      return {
        ...state,
        actionTexts: updateActionTexts(state.actionTexts, 0, correctAction.text),
        currentNumber: nextNumber,
        currentPlayerIndex: next,
        remainingClaps: next === 0 ? countClaps(nextNumber) : 0,
      }
    }

    case 'USER_CLAP': {
      // 사용자 턴이 아니거나 게임이 종료된 경우 무시 (연타 방지)
      if (state.currentPlayerIndex !== 0 || state.status !== 'playing') return state
      // 박수가 필요없는 숫자에서 박수 → 오답
      if (state.remainingClaps === 0) return { ...state, status: 'gameover' }
      // 박수가 아직 남아있음 → 한 번 차감, 진행 중 텍스트 갱신
      if (state.remainingClaps > 1) {
        const clapsSoFar = countClaps(state.currentNumber) - state.remainingClaps + 1
        return {
          ...state,
          remainingClaps: state.remainingClaps - 1,
          actionTexts: updateActionTexts(state.actionTexts, 0, '/박수/'.repeat(clapsSoFar)),
        }
      }
      // 마지막 박수 → 정답, 다음 숫자로
      const correctAction = getCorrectAction(state.currentNumber)
      const nextNumber = state.currentNumber + 1
      const next = nextPlayerIndex(0, state.playerCount)
      return {
        ...state,
        actionTexts: updateActionTexts(state.actionTexts, 0, correctAction.text),
        currentNumber: nextNumber,
        currentPlayerIndex: next,
        remainingClaps: next === 0 ? countClaps(nextNumber) : 0,
      }
    }

    case 'TIMEOUT': {
      // 사용자 턴이 아니거나 게임이 종료된 경우 무시
      if (state.currentPlayerIndex !== 0 || state.status !== 'playing') return state
      return { ...state, status: 'gameover' }
    }

    case 'SET_DIFFICULTY': {
      // 난이도 변경 시 pendingPlayerCount를 유지하며 게임 리셋
      return createInitialState(action.difficulty, state.pendingPlayerCount)
    }

    case 'SET_PLAYER_COUNT': {
      // 플레이어 수 변경 - 다음 게임(리셋) 시 적용
      return { ...state, pendingPlayerCount: action.count }
    }

    case 'RESET': {
      // pendingPlayerCount를 적용하여 현재 난이도로 게임 리셋
      return createInitialState(state.difficulty, state.pendingPlayerCount)
    }

    default:
      return state
  }
}

/** 게임 전체 상태 관리 훅 */
export function useGameLogic() {
  const [state, dispatch] = useReducer(gameReducer, createInitialState('normal', 2))

  // dispatch는 안정적이므로 useCallback으로 메모이제이션하여 deps 문제 방지
  const computerPlay = useCallback(() => dispatch({ type: 'COMPUTER_PLAY' }), [])
  const userShout = useCallback(() => dispatch({ type: 'USER_SHOUT' }), [])
  const userClap = useCallback(() => dispatch({ type: 'USER_CLAP' }), [])
  const timeout = useCallback(() => dispatch({ type: 'TIMEOUT' }), [])
  const setDifficulty = useCallback((difficulty: Difficulty) => dispatch({ type: 'SET_DIFFICULTY', difficulty }), [])
  const setPlayerCount = useCallback((count: number) => dispatch({ type: 'SET_PLAYER_COUNT', count }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  return { state, computerPlay, userShout, userClap, timeout, setDifficulty, setPlayerCount, reset }
}
