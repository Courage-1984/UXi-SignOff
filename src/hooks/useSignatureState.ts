import { useCallback, useEffect, useRef, useState } from 'react'
import { getBrandById } from '../config/brands'
import { createDefaultState } from '../config/defaults'
import { applyShareableSlice, decodeShareHash } from '../lib/shareState'
import type { SignatureFormState, TemplateId } from '../types/signature'
import { loadPersistedState, savePersistedState } from '../lib/persistence'

const MAX_HISTORY = 50

export function useSignatureState() {
  const initialBrand = getBrandById(loadPersistedState()?.brandId ?? 'uxi-creative')
  const [state, setStateRaw] = useState<SignatureFormState>(() => {
    const saved = loadPersistedState()
    if (saved && getBrandById(saved.brandId)) return saved
    return createDefaultState(initialBrand!)
  })
  const history = useRef<SignatureFormState[]>([state])
  const index = useRef(0)

  const setState = useCallback((next: SignatureFormState | ((prev: SignatureFormState) => SignatureFormState)) => {
    setStateRaw((prev) => {
      const value = typeof next === 'function' ? next(prev) : next
      const trimmed = history.current.slice(0, index.current + 1)
      trimmed.push(value)
      if (trimmed.length > MAX_HISTORY) trimmed.shift()
      history.current = trimmed
      index.current = trimmed.length - 1
      return value
    })
  }, [])

  useEffect(() => {
    savePersistedState(state)
  }, [state])

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '')
    if (!hash.startsWith('tpl=')) return
    const decoded = decodeShareHash(hash.slice(4))
    if (!decoded) return
    setState((prev) => applyShareableSlice(prev, decoded))
  }, [setState])

  const setBrand = useCallback(
    (brandId: string) => {
      const brand = getBrandById(brandId)
      if (!brand) return
      setState(createDefaultState(brand))
    },
    [setState],
  )

  const resetToBrandDefaults = useCallback(
    (templateId?: TemplateId) => {
      const brand = getBrandById(state.brandId)
      if (brand) setState(createDefaultState(brand, templateId ?? state.templateId))
    },
    [setState, state.brandId, state.templateId],
  )

  const undo = useCallback(() => {
    if (index.current <= 0) return
    index.current -= 1
    setStateRaw(history.current[index.current]!)
  }, [])

  const redo = useCallback(() => {
    if (index.current >= history.current.length - 1) return
    index.current += 1
    setStateRaw(history.current[index.current]!)
  }, [])

  return { state, setState, setBrand, resetToBrandDefaults, undo, redo }
}