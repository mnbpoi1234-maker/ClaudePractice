import { useEffect, useRef } from 'react'

/**
 * 키보드 단축키 훅
 * @param key 감지할 키 (예: 'a', 'l')
 * @param callback 키 입력 시 호출할 콜백
 * @param enabled 단축키 활성 여부 (사용자 턴일 때만 true)
 */
export function useKeyboardShortcut(key: string, callback: () => void, enabled: boolean) {
  // 콜백을 ref로 관리하여 stale closure 방지
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!enabled) return

    const handler = (e: KeyboardEvent) => {
      if (e.key === key) {
        e.preventDefault()
        callbackRef.current()
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [key, enabled])
}
