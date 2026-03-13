import { useEffect, useRef, useState } from 'react'

/**
 * 카운트다운 타이머 훅
 * @param isActive 타이머 활성 여부 (사용자 턴일 때만 true)
 * @param duration 제한 시간 (초)
 * @param onTimeout 시간 초과 시 호출할 콜백
 * @returns 남은 시간 (초)
 */
export function useTimer(isActive: boolean, duration: number, onTimeout: () => void): number {
  const [timeLeft, setTimeLeft] = useState(duration)
  // 콜백을 ref로 관리하여 stale closure 방지
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

    // 200ms 간격으로 체크하여 남은 시간 업데이트
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
