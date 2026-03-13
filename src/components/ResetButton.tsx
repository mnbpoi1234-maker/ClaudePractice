interface ResetButtonProps {
  onReset: () => void
}

export function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <button onClick={onReset} className="btn">
      리셋
    </button>
  )
}
