import { useReducer, useCallback } from 'react'
import type { GameState, Difficulty } from '../types/game'
import { countClaps, getCorrectAction, isCorrectUserAction } from '../utils/gameRules'

type Action =
  | { type: 'COMPUTER_PLAY' }
  | { type: 'USER_SHOUT' }
  | { type: 'USER_CLAP' }
  | { type: 'TIMEOUT' }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'RESET' }

/** 난이도를 받아 초기 게임 상태를 생성 */
function createInitialState(difficulty: Difficulty): GameState {
  return {
    currentNumber: 1,
    turn: 'computer',
    status: 'playing',
    difficulty,
    computerActionText: '',
    userActionText: '',
    remainingClaps: 0,
  }
}

/** 게임 상태 reducer - 모든 상태 전이를 순수하게 처리 */
function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'COMPUTER_PLAY': {
      // 컴퓨터 턴이 아니거나 게임이 종료된 경우 무시
      if (state.turn !== 'computer' || state.status !== 'playing') return state
      const correctAction = getCorrectAction(state.currentNumber)
      const nextNumber = state.currentNumber + 1
      return {
        ...state,
        computerActionText: correctAction.text,
        userActionText: '',
        currentNumber: nextNumber,
        turn: 'user',
        remainingClaps: countClaps(nextNumber),
      }
    }

    case 'USER_SHOUT': {
      // 사용자 턴이 아니거나 게임이 종료된 경우 무시 (연타 방지)
      if (state.turn !== 'user' || state.status !== 'playing') return state
      // 박수가 남아있는데 숫자를 외침 → 오답
      if (state.remainingClaps > 0) return { ...state, status: 'gameover' }
      const correctAction = getCorrectAction(state.currentNumber)
      return {
        ...state,
        userActionText: correctAction.text,
        currentNumber: state.currentNumber + 1,
        turn: 'computer',
        remainingClaps: 0,
      }
    }

    case 'USER_CLAP': {
      // 사용자 턴이 아니거나 게임이 종료된 경우 무시 (연타 방지)
      if (state.turn !== 'user' || state.status !== 'playing') return state
      // 박수가 필요없는 숫자에서 박수 → 오답
      if (state.remainingClaps === 0) return { ...state, status: 'gameover' }
      // 박수가 아직 남아있음 → 한 번 차감, 진행 중 텍스트 갱신
      if (state.remainingClaps > 1) {
        const clapsSoFar = countClaps(state.currentNumber) - state.remainingClaps + 1
        return {
          ...state,
          remainingClaps: state.remainingClaps - 1,
          userActionText: '/박수/'.repeat(clapsSoFar),
        }
      }
      // 마지막 박수 → 정답, 다음 숫자로
      const correctAction = getCorrectAction(state.currentNumber)
      return {
        ...state,
        userActionText: correctAction.text,
        currentNumber: state.currentNumber + 1,
        turn: 'computer',
        remainingClaps: 0,
      }
    }

    case 'TIMEOUT': {
      // 사용자 턴이 아니거나 게임이 종료된 경우 무시
      if (state.turn !== 'user' || state.status !== 'playing') return state
      return { ...state, status: 'gameover' }
    }

    case 'SET_DIFFICULTY': {
      // 난이도 변경 시 게임 리셋
      return createInitialState(action.difficulty)
    }

    case 'RESET': {
      // 현재 난이도를 유지하며 게임 리셋
      return createInitialState(state.difficulty)
    }

    default:
      return state
  }
}

/** 게임 전체 상태 관리 훅 */
export function useGameLogic() {
  const [state, dispatch] = useReducer(gameReducer, createInitialState('normal'))

  // dispatch는 안정적이므로 useCallback으로 메모이제이션하여 deps 문제 방지
  const computerPlay = useCallback(() => dispatch({ type: 'COMPUTER_PLAY' }), [])
  const userShout = useCallback(() => dispatch({ type: 'USER_SHOUT' }), [])
  const userClap = useCallback(() => dispatch({ type: 'USER_CLAP' }), [])
  const timeout = useCallback(() => dispatch({ type: 'TIMEOUT' }), [])
  const setDifficulty = useCallback((difficulty: Difficulty) => dispatch({ type: 'SET_DIFFICULTY', difficulty }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  return { state, computerPlay, userShout, userClap, timeout, setDifficulty, reset }
}
