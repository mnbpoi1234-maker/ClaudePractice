interface ResetButtonProps {
  onReset: () => void
}

export function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <button onClick={onReset} className="btn" aria-label="게임 다시 시작">
      리셋
    </button>
  )
}
