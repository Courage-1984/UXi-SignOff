import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { useFloatingTooltip } from '../../hooks/useFloatingTooltip'

interface TooltipProps {
  content: string
  children: ReactNode
}

const bubbleClass =
  'pointer-events-none fixed z-[9999] w-max max-w-[min(16rem,90vw)] rounded-md bg-ctp-crust px-1.5 py-0.5 text-center text-[11px] leading-snug text-ctp-text shadow-lg ring-1 ring-ctp-surface1'

export function Tooltip({ content, children }: TooltipProps) {
  const { anchorRef, bubbleRef, open, coords, anchorHandlers } = useFloatingTooltip(content)

  return (
    <>
      <span ref={anchorRef} className="relative inline-flex" {...anchorHandlers}>
        {children}
      </span>
      {open &&
        createPortal(
          <span
            ref={bubbleRef}
            role="tooltip"
            className={bubbleClass}
            style={{
              top: coords.visible ? coords.top : -9999,
              left: coords.visible ? coords.left : -9999,
              visibility: coords.visible ? 'visible' : 'hidden',
            }}
          >
            {content}
          </span>,
          document.body,
        )}
    </>
  )
}

export function TooltipButton({
  content,
  children,
  onClick,
  className,
  primary,
}: {
  content: string
  children: ReactNode
  onClick?: () => void
  className?: string
  primary?: boolean
}) {
  return (
    <Tooltip content={content}>
      <button
        type="button"
        onClick={onClick}
        aria-label={content}
        className={
          className ??
          `inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium ${
            primary ? 'bg-ctp-accent text-white' : 'border border-ctp-surface1 bg-ctp-base text-ctp-text'
          }`
        }
      >
        {children}
      </button>
    </Tooltip>
  )
}