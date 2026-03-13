import { useEffect, useRef } from 'react'

export function useKeyboardShortcut(key: string, callback: () => void, enabled: boolean) {
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
