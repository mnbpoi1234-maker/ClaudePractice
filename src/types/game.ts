export type Difficulty = 'easy' | 'normal' | 'hard'
export type Turn = 'computer' | 'user'
export type GameStatus = 'playing' | 'gameover'
export type ActionType = 'shout' | 'clap'

export interface GameState {
  currentNumber: number
  turn: Turn
  status: GameStatus
  difficulty: Difficulty
  computerActionText: string  // 컴퓨터가 수행한 행위 텍스트
  userActionText: string      // 사용자가 수행한 행위 텍스트 (현재 턴)
  timeLeft: number
}

export const DIFFICULTY_TIME: Record<Difficulty, number> = {
  easy: 5,
  normal: 3,
  hard: 1,
}
