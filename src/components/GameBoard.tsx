interface GameBoardProps {
  currentNumber: number
  isGameOver: boolean
  computerActionText: string
  userActionText: string
  isUserTurn: boolean
  timeLeft: number
}

export function GameBoard({
  currentNumber,
  isGameOver,
  computerActionText,
  userActionText,
  isUserTurn,
  timeLeft,
}: GameBoardProps) {
  // 현재 차례 표시 텍스트 결정
  const turnText = isGameOver ? '' : isUserTurn ? '내 차례' : '컴퓨터 차례'
  const turnClass = isUserTurn ? 'turn-user' : 'turn-computer'

  return (
    <div className="game-board">
      {/* 현재 차례 표시 */}
      {!isGameOver && (
        <div className={`turn-indicator ${turnClass}`}>{turnText}</div>
      )}

      {/* 현재 숫자 또는 게임 종료 텍스트 */}
      <div className="current-number">
        {isGameOver ? '게임 종료' : currentNumber}
      </div>

      {/* 게임 종료 시 최종 도달 숫자 표시 */}
      {isGameOver && (
        <div className="final-number">최종 도달 숫자: {currentNumber}</div>
      )}

      {/* 컴퓨터/사용자 행위 표시 */}
      <div className="action-display">
        <div className="computer-action">
          <span className="action-label">컴퓨터:</span>
          <span>{computerActionText}</span>
        </div>
        <div className="user-action">
          <span className="action-label">나:</span>
          <span>{userActionText}</span>
        </div>
      </div>

      {/* 사용자 턴일 때 타이머 표시 */}
      {isUserTurn && !isGameOver && (
        <div className="timer">남은 시간: {timeLeft}초</div>
      )}
    </div>
  )
}
