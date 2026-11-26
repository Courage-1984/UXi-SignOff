import type { MouseEvent, ReactNode } from 'react'
import { useBuilderSectionRegistration } from '../../context/BuilderSectionsContext'

interface BuilderSectionProps {
  sectionId: string
  title: string
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}

export function BuilderSection({
  sectionId,
  title,
  children,
  defaultOpen = false,
  className = '',
}: BuilderSectionProps) {
  const { open, toggle } = useBuilderSectionRegistration(sectionId, defaultOpen)

  const onSummaryClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    toggle(!open)
  }

  return (
    <details
      className={`rounded-lg border border-ctp-surface0 bg-ctp-base open:shadow-sm ${className}`}
      open={open}
    >
      <summary
        className="cursor-pointer list-none px-2 py-1.5 text-xs font-medium text-ctp-text [&::-webkit-details-marker]:hidden"
        onClick={onSummaryClick}
      >
        {title}
      </summary>
      <div className="border-t border-ctp-surface0 px-2 py-2">{children}</div>
    </details>
  )
}