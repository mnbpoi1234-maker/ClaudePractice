import { Difficulty } from '../types/game'

interface DifficultyButtonsProps {
  current: Difficulty
  onChange: (difficulty: Difficulty) => void
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: '쉬움',
  normal: '보통',
  hard: '어려움',
}

const DIFFICULTIES: Difficulty[] = ['easy', 'normal', 'hard']

export function DifficultyButtons({ current, onChange }: DifficultyButtonsProps) {
  return (
    <div className="difficulty-buttons">
      {DIFFICULTIES.map(d => (
        <button
          key={d}
          onClick={() => onChange(d)}
          className={`btn ${current === d ? 'btn-active' : ''}`}
        >
          {DIFFICULTY_LABELS[d]}
        </button>
      ))}
    </div>
  )
}
