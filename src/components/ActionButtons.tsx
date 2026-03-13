interface ActionButtonsProps {
  onShout: () => void
  onClap: () => void
  disabled: boolean
}

export function ActionButtons({ onShout, onClap, disabled }: ActionButtonsProps) {
  return (
    <div className="action-buttons">
      <button onClick={onShout} disabled={disabled} className="btn">
        숫자외치기(A)
      </button>
      <button onClick={onClap} disabled={disabled} className="btn">
        박수(L)
      </button>
    </div>
  )
}
