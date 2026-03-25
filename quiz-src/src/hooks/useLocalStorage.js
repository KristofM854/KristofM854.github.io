import { useState, useCallback, useRef } from 'react'

export default function useLocalStorage(key, initialValue) {
  // Use ref to always have latest value for functional updates
  const stateRef = useRef(null)

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      const parsed = item ? JSON.parse(item) : initialValue
      stateRef.current = parsed
      return parsed
    } catch {
      stateRef.current = initialValue
      return initialValue
    }
  })

  const setValue = useCallback(
    (value) => {
      try {
        // Support functional updates using the ref for latest value
        const valueToStore = typeof value === 'function' ? value(stateRef.current) : value
        stateRef.current = valueToStore
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error('useLocalStorage error:', error)
      }
    },
    [key]
  )

  const removeValue = useCallback(() => {
    try {
      stateRef.current = initialValue
      setStoredValue(initialValue)
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error('useLocalStorage remove error:', error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}
