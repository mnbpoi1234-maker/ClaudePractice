import { useEffect } from 'react'
import './App.css'
import { useGameLogic } from './hooks/useGameLogic'
import { useTimer } from './hooks/useTimer'
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut'
import { GameBoard } from './components/GameBoard'
import { ActionButtons } from './components/ActionButtons'
import { DifficultyButtons } from './components/DifficultyButtons'
import { ResetButton } from './components/ResetButton'
import { DIFFICULTY_TIME } from './types/game'

function App() {
  const { state, computerPlay, userShout, userClap, timeout, setDifficulty, reset } = useGameLogic()
  const isUserTurn = state.turn === 'user' && state.status === 'playing'
  const isComputerTurn = state.turn === 'computer' && state.status === 'playing'

  // 타이머: 사용자 턴 카운트다운, 남은 시간 반환
  const timeLeft = useTimer(isUserTurn, DIFFICULTY_TIME[state.difficulty], timeout)

  // 컴퓨터 턴 자동 진행 (~1초 후)
  useEffect(() => {
    if (!isComputerTurn) return
    const id = setTimeout(() => {
      computerPlay()
    }, 1000)
    return () => clearTimeout(id)
  }, [isComputerTurn, state.currentNumber])

  // 키보드 단축키
  useKeyboardShortcut('a', userShout, isUserTurn)
  useKeyboardShortcut('l', userClap, isUserTurn)

  return (
    <div className="app">
      {/* 우측 상단: 난이도 + 리셋 */}
      <div className="settings">
        <DifficultyButtons current={state.difficulty} onChange={setDifficulty} />
        <ResetButton onReset={reset} />
      </div>

      {/* 중앙: 게임 보드 + 액션 버튼 */}
      <div className="center-area">
        <GameBoard
          currentNumber={state.currentNumber}
          isGameOver={state.status === 'gameover'}
          computerActionText={state.computerActionText}
          userActionText={state.userActionText}
          isUserTurn={isUserTurn}
          timeLeft={timeLeft}
        />
        <ActionButtons
          onShout={userShout}
          onClap={userClap}
          disabled={!isUserTurn}
        />
      </div>
    </div>
  )
}

export default App
