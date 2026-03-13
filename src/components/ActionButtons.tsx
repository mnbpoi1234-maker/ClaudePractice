interface ActionButtonsProps {
  onShout: () => void
  onClap: () => void
  disabled: boolean
}

export function ActionButtons({ onShout, onClap, disabled }: ActionButtonsProps) {
  return (
    <div className="action-buttons" role="group" aria-label="게임 입력">
      <button
        onClick={onShout}
        disabled={disabled}
        className="btn"
        aria-label="숫자외치기 (단축키: A)"
      >
        숫자외치기(A)
      </button>
      <button
        onClick={onClap}
        disabled={disabled}
        className="btn"
        aria-label="박수치기 (단축키: L)"
      >
        박수(L)
      </button>
    </div>
  )
}
