import { useReducer } from 'react'
import { GameState, Difficulty, DIFFICULTY_TIME } from '../types/game'
import { getCorrectAction, isCorrectUserAction } from '../utils/gameRules'

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
  }
}

/** 게임 상태 reducer - 모든 상태 전이를 순수하게 처리 */
function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'COMPUTER_PLAY': {
      // 컴퓨터 턴이 아니거나 게임이 종료된 경우 무시
      if (state.turn !== 'computer' || state.status !== 'playing') return state
      const correctAction = getCorrectAction(state.currentNumber)
      return {
        ...state,
        computerActionText: correctAction.text,
        userActionText: '',
        currentNumber: state.currentNumber + 1,
        turn: 'user',
      }
    }

    case 'USER_SHOUT': {
      // 사용자 턴이 아니거나 게임이 종료된 경우 무시 (연타 방지)
      if (state.turn !== 'user' || state.status !== 'playing') return state
      if (isCorrectUserAction(state.currentNumber, 'shout')) {
        const correctAction = getCorrectAction(state.currentNumber)
        return {
          ...state,
          userActionText: correctAction.text,
          currentNumber: state.currentNumber + 1,
          turn: 'computer',
        }
      }
      // 오답: 게임 종료
      return { ...state, status: 'gameover' }
    }

    case 'USER_CLAP': {
      // 사용자 턴이 아니거나 게임이 종료된 경우 무시 (연타 방지)
      if (state.turn !== 'user' || state.status !== 'playing') return state
      if (isCorrectUserAction(state.currentNumber, 'clap')) {
        const correctAction = getCorrectAction(state.currentNumber)
        return {
          ...state,
          userActionText: correctAction.text,
          currentNumber: state.currentNumber + 1,
          turn: 'computer',
        }
      }
      // 오답: 게임 종료
      return { ...state, status: 'gameover' }
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

  return {
    state,
    computerPlay: () => dispatch({ type: 'COMPUTER_PLAY' }),
    userShout: () => dispatch({ type: 'USER_SHOUT' }),
    userClap: () => dispatch({ type: 'USER_CLAP' }),
    timeout: () => dispatch({ type: 'TIMEOUT' }),
    setDifficulty: (difficulty: Difficulty) => dispatch({ type: 'SET_DIFFICULTY', difficulty }),
    reset: () => dispatch({ type: 'RESET' }),
  }
}
