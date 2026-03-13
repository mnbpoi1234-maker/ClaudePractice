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
  return (
    <div className="game-board">
      <div className="current-number">
        {isGameOver ? '게임 종료' : currentNumber}
      </div>
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
      {isUserTurn && !isGameOver && (
        <div className="timer">남은 시간: {timeLeft}초</div>
      )}
    </div>
  )
}
