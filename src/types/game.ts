/** 난이도 */
export type Difficulty = 'easy' | 'normal' | 'hard'

/** 현재 차례 */
export type Turn = 'computer' | 'user'

/** 게임 진행 상태 */
export type GameStatus = 'playing' | 'gameover'

/** 사용자 입력 행위 타입 */
export type ActionType = 'shout' | 'clap'

/** 게임 전체 상태 */
export interface GameState {
  currentNumber: number    // 현재 처리 중인 숫자
  turn: Turn               // 현재 차례
  status: GameStatus       // 게임 진행 상태
  difficulty: Difficulty   // 난이도
  computerActionText: string  // 컴퓨터가 수행한 행위 텍스트
  userActionText: string      // 사용자가 수행한 행위 텍스트
}

/** 난이도별 제한 시간 (초) */
export const DIFFICULTY_TIME: Record<Difficulty, number> = {
  easy: 5,
  normal: 3,
  hard: 1,
}
