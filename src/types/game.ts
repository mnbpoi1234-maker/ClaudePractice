/** 난이도 */
export type Difficulty = 'easy' | 'normal' | 'hard'

/** 게임 진행 상태 */
export type GameStatus = 'playing' | 'gameover'

/** 사용자 입력 행위 타입 */
export type ActionType = 'shout' | 'clap'

/** 플레이어별 표시 색상 (인덱스 0=사용자, 1~3=컴퓨터) */
export const PLAYER_COLORS = ['#1565c0', '#c62828', '#2e7d32', '#e65100'] as const

/** 플레이어별 이름 (인덱스 0=사용자, 1~3=컴퓨터) */
export const PLAYER_NAMES = ['나', '컴퓨터 1', '컴퓨터 2', '컴퓨터 3'] as const

/** 게임 전체 상태 */
export interface GameState {
  currentNumber: number                          // 현재 처리 중인 숫자
  currentPlayerIndex: number                     // 현재 차례 (0=사용자, 1+=컴퓨터)
  playerCount: number                            // 현재 게임의 총 플레이어 수 (2~4)
  pendingPlayerCount: number                     // 다음 게임에 적용될 플레이어 수
  status: GameStatus                             // 게임 진행 상태
  difficulty: Difficulty                         // 난이도
  actionTexts: [string, string, string, string]  // 플레이어별 마지막 행위 텍스트
  remainingClaps: number                         // 현재 숫자에서 남은 박수 횟수
}

/** 난이도별 제한 시간 (초) */
export const DIFFICULTY_TIME: Record<Difficulty, number> = {
  easy: 5,
  normal: 3,
  hard: 1,
}
