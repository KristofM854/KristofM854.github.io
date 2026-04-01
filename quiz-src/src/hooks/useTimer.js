import { useState, useRef, useCallback, useEffect } from 'react'

/**
 * Timestamp-based timer. Derives timeLeft from expiresAt - now
 * instead of decrementing a float with setInterval.
 */
export default function useTimer(initialDuration, onExpire) {
  const [timeLeft, setTimeLeft] = useState(initialDuration)
  const [isRunning, setIsRunning] = useState(false)
  const expiresAtRef = useRef(null)
  const rafRef = useRef(null)
  const onExpireRef = useRef(onExpire)
  const expiredRef = useRef(false)

  onExpireRef.current = onExpire

  const tick = useCallback(() => {
    if (!expiresAtRef.current) return
    const remaining = Math.max(0, (expiresAtRef.current - Date.now()) / 1000)
    setTimeLeft(remaining)

    if (remaining <= 0 && !expiredRef.current) {
      expiredRef.current = true
      setIsRunning(false)
      onExpireRef.current?.()
      return
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const stop = useCallback(() => {
    setIsRunning(false)
    expiresAtRef.current = null
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const start = useCallback((duration) => {
    stop()
    const dur = duration ?? initialDuration
    expiredRef.current = false
    expiresAtRef.current = Date.now() + dur * 1000
    setTimeLeft(dur)
    setIsRunning(true)
    rafRef.current = requestAnimationFrame(tick)
  }, [stop, tick, initialDuration])

  const reset = useCallback((newTime) => {
    stop()
    setTimeLeft(newTime ?? initialDuration)
    expiredRef.current = false
  }, [stop, initialDuration])

  const restart = useCallback((newTime) => {
    start(newTime ?? initialDuration)
  }, [start, initialDuration])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { timeLeft, isRunning, start, stop, reset, restart }
}
