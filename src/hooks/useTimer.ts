import { useEffect, useRef, useState } from 'react'

// 카운트다운 타이머 훅. 남은 시간(초)을 반환하며 0이 되면 onTimeout 호출
export function useTimer(isActive: boolean, duration: number, onTimeout: () => void): number {
  const [timeLeft, setTimeLeft] = useState(duration)
  const onTimeoutRef = useRef(onTimeout)
  onTimeoutRef.current = onTimeout

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration)
      return
    }

    setTimeLeft(duration)
    const start = Date.now()
    const end = start + duration * 1000

    const interval = setInterval(() => {
      const remaining = Math.ceil((end - Date.now()) / 1000)
      if (remaining <= 0) {
        clearInterval(interval)
        setTimeLeft(0)
        onTimeoutRef.current()
      } else {
        setTimeLeft(remaining)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [isActive, duration])

  return timeLeft
}
