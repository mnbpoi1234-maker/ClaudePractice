const COUNTS = [2, 3, 4] as const

interface PlayerCountSelectorProps {
  value: number
  onChange: (count: number) => void
}

export function PlayerCountSelector({ value, onChange }: PlayerCountSelectorProps) {
  return (
    <div className="player-count-buttons" role="group" aria-label="플레이어 수 선택">
      {COUNTS.map(c => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`btn ${value === c ? 'btn-active' : ''}`}
          aria-label={`${c}인 플레이`}
          aria-pressed={value === c}
        >
          {c}인
        </button>
      ))}
    </div>
  )
}
