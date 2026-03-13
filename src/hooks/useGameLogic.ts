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

function createInitialState(difficulty: Difficulty): GameState {
  return {
    currentNumber: 1,
    turn: 'computer',
    status: 'playing',
    difficulty,
    computerActionText: '',
    userActionText: '',
    timeLeft: DIFFICULTY_TIME[difficulty],
  }
}

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'COMPUTER_PLAY': {
      if (state.turn !== 'computer' || state.status !== 'playing') return state
      const correctAction = getCorrectAction(state.currentNumber)
      return {
        ...state,
        computerActionText: correctAction.text,
        userActionText: '',
        currentNumber: state.currentNumber + 1,
        turn: 'user',
        timeLeft: DIFFICULTY_TIME[state.difficulty],
      }
    }

    case 'USER_SHOUT': {
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
      return { ...state, status: 'gameover' }
    }

    case 'USER_CLAP': {
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
      return { ...state, status: 'gameover' }
    }

    case 'TIMEOUT': {
      if (state.turn !== 'user' || state.status !== 'playing') return state
      return { ...state, status: 'gameover' }
    }

    case 'SET_DIFFICULTY': {
      return createInitialState(action.difficulty)
    }

    case 'RESET': {
      return createInitialState(state.difficulty)
    }

    default:
      return state
  }
}

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
