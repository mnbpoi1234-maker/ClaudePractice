import type { Difficulty } from '../types/game'

interface DifficultyButtonsProps {
  current: Difficulty
  onChange: (difficulty: Difficulty) => void
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: '쉬움',
  normal: '보통',
  hard: '어려움',
}

const DIFFICULTY_ARIA_LABELS: Record<Difficulty, string> = {
  easy: '쉬움 난이도 (제한 시간 5초)',
  normal: '보통 난이도 (제한 시간 3초)',
  hard: '어려움 난이도 (제한 시간 1초)',
}

const DIFFICULTIES: Difficulty[] = ['easy', 'normal', 'hard']

export function DifficultyButtons({ current, onChange }: DifficultyButtonsProps) {
  return (
    <div className="difficulty-buttons" role="group" aria-label="난이도 선택">
      {DIFFICULTIES.map(d => (
        <button
          key={d}
          onClick={() => onChange(d)}
          className={`btn ${current === d ? 'btn-active' : ''}`}
          aria-label={DIFFICULTY_ARIA_LABELS[d]}
          aria-pressed={current === d}
        >
          {DIFFICULTY_LABELS[d]}
        </button>
      ))}
    </div>
  )
}
