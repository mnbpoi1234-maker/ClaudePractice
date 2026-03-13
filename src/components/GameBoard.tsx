import { PLAYER_COLORS, PLAYER_NAMES } from '../types/game'

interface GameBoardProps {
  currentNumber: number
  isGameOver: boolean
  actionTexts: [string, string, string, string]
  playerCount: number
  currentPlayerIndex: number
  isUserTurn: boolean
  timeLeft: number
}

export function GameBoard({
  currentNumber,
  isGameOver,
  actionTexts,
  playerCount,
  currentPlayerIndex,
  isUserTurn,
  timeLeft,
}: GameBoardProps) {
  const currentColor = PLAYER_COLORS[currentPlayerIndex]
  const currentName = PLAYER_NAMES[currentPlayerIndex]

  return (
    <div className="game-board">
      {/* 스크린리더용 게임 상태 안내 (aria-live) */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {isGameOver
          ? `게임 종료. 최종 도달 숫자: ${currentNumber}`
          : `현재 숫자 ${currentNumber}. ${isUserTurn ? '당신의 차례입니다.' : `${currentName} 차례입니다.`}`
        }
      </div>

      {/* 현재 차례 표시 */}
      {!isGameOver && (
        <div
          className="turn-indicator"
          style={{ backgroundColor: `${currentColor}18`, color: currentColor }}
          aria-hidden="true"
        >
          {currentName} 차례
        </div>
      )}

      {/* 현재 숫자 또는 게임 종료 텍스트 */}
      <div className="current-number" aria-label={isGameOver ? '게임 종료' : `현재 숫자 ${currentNumber}`}>
        {isGameOver ? '게임 종료' : currentNumber}
      </div>

      {/* 게임 종료 시 최종 도달 숫자 표시 */}
      {isGameOver && (
        <div className="final-number">최종 도달 숫자: {currentNumber}</div>
      )}

      {/* 플레이어별 행위 표시 */}
      <div className="action-display" aria-label="행위 기록">
        {Array.from({ length: playerCount }, (_, i) => (
          <div key={i} className="player-action">
            <span className="action-label" style={{ color: PLAYER_COLORS[i] }}>
              {PLAYER_NAMES[i]}:
            </span>
            <span>{actionTexts[i]}</span>
          </div>
        ))}
      </div>

      {/* 사용자 턴일 때 타이머 표시 */}
      {isUserTurn && !isGameOver && (
        <div className="timer" role="timer" aria-label={`남은 시간 ${timeLeft}초`}>
          남은 시간: {timeLeft}초
        </div>
      )}
    </div>
  )
}
