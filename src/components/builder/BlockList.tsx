import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { BuilderSection } from './BuilderSection'
import { GripVertical } from 'lucide-react'
import type { BlockConfig, BlockId } from '../../types/signature'

const LABELS: Record<BlockId, string> = {
  identity: 'Identity & contact',
  cta: 'CTA buttons',
  social: 'Social links',
  banner: 'Campaign banner',
  legal: 'Legal disclaimer',
}

interface BlockListProps {
  blocks: BlockConfig[]
  onChange: (blocks: BlockConfig[]) => void
}

function SortableRow({
  block,
  onToggle,
}: {
  block: BlockConfig
  onToggle: (id: BlockId, enabled: boolean) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-2"
    >
      <button
        type="button"
        className="cursor-grab touch-none rounded p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
        aria-label={`Reorder ${LABELS[block.id]}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical size={18} />
      </button>
      <span className="flex-1 text-sm text-gray-800">{LABELS[block.id]}</span>
      <label className="flex items-center gap-1 text-xs text-gray-600">
        <input
          type="checkbox"
          checked={block.enabled}
          onChange={(e) => onToggle(block.id, e.target.checked)}
          disabled={block.id === 'identity'}
        />
        Show
      </label>
    </li>
  )
}

export function BlockList({ blocks, onChange }: BlockListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = blocks.findIndex((b) => b.id === active.id)
    const newIndex = blocks.findIndex((b) => b.id === over.id)
    onChange(arrayMove(blocks, oldIndex, newIndex))
  }

  const onToggle = (id: BlockId, enabled: boolean) => {
    onChange(blocks.map((b) => (b.id === id ? { ...b, enabled } : b)))
  }

  return (
    <BuilderSection sectionId="blocks" title="Signature blocks">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-2">
            {blocks.map((block) => (
              <SortableRow key={block.id} block={block} onToggle={onToggle} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </BuilderSection>
  )
}