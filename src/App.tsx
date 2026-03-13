import { useEffect, useState } from 'react'
import './App.css'
import { useGameLogic } from './hooks/useGameLogic'
import { useTimer } from './hooks/useTimer'
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut'
import { GameBoard } from './components/GameBoard'
import { ActionButtons } from './components/ActionButtons'
import { DifficultyButtons } from './components/DifficultyButtons'
import { ResetButton } from './components/ResetButton'
import { DIFFICULTY_TIME } from './types/game'
import { getBestScore, saveBestScore } from './utils/bestScore'
import { playClapSound, playGameOverSound } from './utils/sound'

function App() {
  const { state, computerPlay, userShout, userClap, timeout, setDifficulty, reset } = useGameLogic()
  const isUserTurn = state.turn === 'user' && state.status === 'playing'
  const isComputerTurn = state.turn === 'computer' && state.status === 'playing'
  const isGameOver = state.status === 'gameover'

  // 최고 기록 상태 (localStorage 초기값)
  const [bestScore, setBestScore] = useState<number>(() => getBestScore())

  // 타이머: 사용자 턴 카운트다운, 남은 시간 반환
  const timeLeft = useTimer(isUserTurn, DIFFICULTY_TIME[state.difficulty], timeout)

  // 컴퓨터 턴 자동 진행 (~1초 후)
  useEffect(() => {
    if (!isComputerTurn) return
    const id = setTimeout(() => {
      computerPlay()
    }, 1000)
    return () => clearTimeout(id)
  }, [isComputerTurn, state.currentNumber, computerPlay])

  // 게임 종료 시 최고 기록 저장 + 효과음
  useEffect(() => {
    if (!isGameOver) return
    playGameOverSound()
    saveBestScore(state.currentNumber)
    setBestScore(getBestScore())
  }, [isGameOver, state.currentNumber])

  // 사용자 박수: 박수가 필요한 숫자일 때만 효과음 재생
  const handleClap = () => {
    if (state.remainingClaps > 0) {
      playClapSound()
    }
    userClap()
  }

  // 키보드 단축키
  useKeyboardShortcut('a', userShout, isUserTurn)
  useKeyboardShortcut('l', handleClap, isUserTurn)

  return (
    <div className="app">
      {/* 좌측 상단: 최고 기록 */}
      <div className="best-score" aria-label={`최고 기록 ${bestScore}`}>
        최고 기록: {bestScore}
      </div>

      {/* 우측 상단: 난이도 + 리셋 */}
      <div className="settings">
        <DifficultyButtons current={state.difficulty} onChange={setDifficulty} />
        <ResetButton onReset={reset} />
      </div>

      {/* 중앙: 게임 보드 + 액션 버튼 */}
      <div className="center-area">
        <GameBoard
          currentNumber={state.currentNumber}
          isGameOver={isGameOver}
          computerActionText={state.computerActionText}
          userActionText={state.userActionText}
          isUserTurn={isUserTurn}
          timeLeft={timeLeft}
        />
        <ActionButtons
          onShout={userShout}
          onClap={handleClap}
          disabled={!isUserTurn}
        />
      </div>
    </div>
  )
}

export default App
