import { applyTemplateToState } from '../../config/defaults'
import type { SignatureFormState, TemplateId } from '../../types/signature'

const TEMPLATES: { id: TemplateId; label: string; hint: string; thumb: string }[] = [
  { id: 'classic-split', label: 'Classic Split', hint: 'Logo left, details right', thumb: '/template-thumbs/classic-split.png' },
  { id: 'compact-stacked', label: 'Compact Stacked', hint: 'Logo top, mobile-friendly', thumb: '/template-thumbs/compact-stacked.png' },
  { id: 'executive-card', label: 'Executive Card', hint: 'CTA row + banner', thumb: '/template-thumbs/executive-card.png' },
  { id: 'modern-minimal', label: 'Modern Minimal', hint: 'Typographic, compact', thumb: '/template-thumbs/modern-minimal.png' },
  { id: 'accent-sidebar', label: 'Accent Sidebar', hint: 'Bold left accent strip', thumb: '/template-thumbs/accent-sidebar.png' },
  { id: 'header-strip', label: 'Header Strip', hint: 'Brand top band', thumb: '/template-thumbs/header-strip.png' },
  { id: 'dual-visual', label: 'Dual Visual', hint: 'Headshot + brand', thumb: '/template-thumbs/dual-visual.png' },
]

interface TemplatePickerProps {
  state: SignatureFormState
  onChange: (state: SignatureFormState) => void
}

export function TemplatePicker({ state, onChange }: TemplatePickerProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-ctp-subtext0">Layout template</legend>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <label
            key={t.id}
            className={`cursor-pointer overflow-hidden rounded-lg border text-left text-sm transition-colors ${
              state.templateId === t.id
                ? 'border-ctp-accent bg-ctp-surface0 ring-1 ring-ctp-accent'
                : 'border-ctp-surface0 hover:border-ctp-surface1'
            }`}
          >
            <input
              type="radio"
              name="template"
              value={t.id}
              checked={state.templateId === t.id}
              onChange={() => onChange(applyTemplateToState(state, t.id))}
              className="sr-only"
            />
            <div className="h-14 bg-ctp-mantle" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}${t.thumb.replace(/^\//, '')})`, backgroundSize: 'cover' }} />
            <div className="p-2">
              <span className="block font-medium text-ctp-text">{t.label}</span>
              <span className="mt-0.5 block text-xs text-ctp-subtext0">{t.hint}</span>
            </div>
          </label>
        ))}
      </div>
    </fieldset>
  )
}