import { useCallback, useEffect, useRef, useState } from 'react'

const MAX = 50

export function useHistoryState<T>(initial: T) {
  const [state, setStateRaw] = useState(initial)
  const stack = useRef<T[]>([initial])
  const index = useRef(0)

  const setState = useCallback((next: T | ((prev: T) => T)) => {
    setStateRaw((prev) => {
      const value = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
      const trimmed = stack.current.slice(0, index.current + 1)
      trimmed.push(value)
      if (trimmed.length > MAX) trimmed.shift()
      stack.current = trimmed
      index.current = trimmed.length - 1
      return value
    })
  }, [])

  const undo = useCallback(() => {
    if (index.current <= 0) return
    index.current -= 1
    setStateRaw(stack.current[index.current]!)
  }, [])

  const redo = useCallback(() => {
    if (index.current >= stack.current.length - 1) return
    index.current += 1
    setStateRaw(stack.current[index.current]!)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])

  return { state, setState, undo, redo, canUndo: index.current > 0, canRedo: index.current < stack.current.length - 1 }
}