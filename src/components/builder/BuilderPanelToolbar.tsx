import { useBuilderSections } from '../../context/BuilderSectionsContext'
import { Tooltip } from '../ui/Tooltip'

export function BuilderPanelToolbar() {
  const { expandAll, collapseAll } = useBuilderSections()

  return (
    <div className="flex items-center justify-end gap-1 pb-1">
      <Tooltip content="Expand all builder sections">
        <button
          type="button"
          className="rounded-md border border-ctp-surface1 bg-ctp-base px-2 py-1 text-[11px] font-medium text-ctp-text"
          onClick={expandAll}
        >
          Expand all
        </button>
      </Tooltip>
      <Tooltip content="Collapse all builder sections">
        <button
          type="button"
          className="rounded-md border border-ctp-surface1 bg-ctp-base px-2 py-1 text-[11px] font-medium text-ctp-text"
          onClick={collapseAll}
        >
          Collapse all
        </button>
      </Tooltip>
    </div>
  )
}