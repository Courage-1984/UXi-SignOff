import { useCallback, useLayoutEffect, useRef, useState, type FocusEvent } from 'react'

const GAP = 6
const VIEWPORT_PAD = 8

export type TooltipCoords = { top: number; left: number; visible: boolean }

export function useFloatingTooltip(content: string) {
  const anchorRef = useRef<HTMLSpanElement>(null)
  const bubbleRef = useRef<HTMLSpanElement>(null)
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<TooltipCoords>({ top: 0, left: 0, visible: false })

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current
    const bubble = bubbleRef.current
    if (!anchor || !bubble) return

    const rect = anchor.getBoundingClientRect()
    const bubbleRect = bubble.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight

    let top = rect.top - bubbleRect.height - GAP
    if (top < VIEWPORT_PAD) {
      top = rect.bottom + GAP
    }
    if (top + bubbleRect.height > vh - VIEWPORT_PAD) {
      top = Math.max(VIEWPORT_PAD, Math.min(rect.top - bubbleRect.height - GAP, vh - bubbleRect.height - VIEWPORT_PAD))
    }

    let left = rect.left + rect.width / 2 - bubbleRect.width / 2
    left = Math.max(VIEWPORT_PAD, Math.min(left, vw - bubbleRect.width - VIEWPORT_PAD))

    setCoords({ top, left, visible: true })
  }, [])

  useLayoutEffect(() => {
    if (!open) {
      setCoords((c) => ({ ...c, visible: false }))
      return
    }
    updatePosition()
    const onScroll = () => updatePosition()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [open, content, updatePosition])

  const show = useCallback(() => setOpen(true), [])
  const hide = useCallback(() => setOpen(false), [])

  const anchorHandlers = {
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocusCapture: show,
    onBlurCapture: (e: FocusEvent<HTMLSpanElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) hide()
    },
  }

  return { anchorRef, bubbleRef, open, coords, anchorHandlers, updatePosition }
}