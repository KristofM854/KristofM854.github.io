import { useState, useRef, useCallback, useEffect } from 'react'

export default function useTimer(initialTime, onExpire) {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)
  const onExpireRef = useRef(onExpire)

  onExpireRef.current = onExpire

  const stop = useCallback(() => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    stop()
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          stop()
          onExpireRef.current?.()
          return 0
        }
        return Math.max(0, prev - 0.1)
      })
    }, 100)
  }, [stop])

  const reset = useCallback(
    (newTime) => {
      stop()
      setTimeLeft(newTime ?? initialTime)
    },
    [stop, initialTime]
  )

  const restart = useCallback(
    (newTime) => {
      reset(newTime)
      // Use setTimeout to let state settle before starting
      setTimeout(() => start(), 0)
    },
    [reset, start]
  )

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return { timeLeft, isRunning, start, stop, reset, restart }
}
