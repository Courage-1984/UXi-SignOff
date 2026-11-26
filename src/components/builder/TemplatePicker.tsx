import { applyTemplateToState } from '../../config/defaults'
import type { SignatureFormState, TemplateId } from '../../types/signature'
import { BuilderSection } from './BuilderSection'

type TemplateCard = { id: TemplateId; label: string; hint: string; thumb: string; inspiration?: boolean }

const CORE_TEMPLATES: TemplateCard[] = [
  { id: 'classic-split', label: 'Classic Split', hint: 'Logo left, details right', thumb: '/template-thumbs/classic-split.png' },
  { id: 'compact-stacked', label: 'Compact Stacked', hint: 'Logo top, mobile-friendly', thumb: '/template-thumbs/compact-stacked.png' },
  { id: 'executive-card', label: 'Executive Card', hint: 'CTA row + banner', thumb: '/template-thumbs/executive-card.png' },
  { id: 'modern-minimal', label: 'Modern Minimal', hint: 'Typographic, compact', thumb: '/template-thumbs/modern-minimal.png' },
  { id: 'accent-sidebar', label: 'Accent Sidebar', hint: 'Bold left accent strip', thumb: '/template-thumbs/accent-sidebar.png' },
  { id: 'header-strip', label: 'Header Strip', hint: 'Brand top band', thumb: '/template-thumbs/header-strip.png' },
  { id: 'dual-visual', label: 'Dual Visual', hint: 'Headshot + brand', thumb: '/template-thumbs/dual-visual.png' },
]

const INSPIRATION_TEMPLATES: TemplateCard[] = [
  {
    id: 'panel-split',
    label: 'Panel split',
    hint: 'Branded panel + logo column. Optional decoration PNGs per brand.',
    thumb: '/template-thumbs/panel-split.png',
    inspiration: true,
  },
  {
    id: 'headshot-affiliate',
    label: 'Headshot + affiliate',
    hint: 'Photo, prefixed contacts, social, promo banner.',
    thumb: '/template-thumbs/headshot-affiliate.png',
    inspiration: true,
  },
  {
    id: 'logo-promo-stack',
    label: 'Logo + promo stack',
    hint: 'Logo beside identity; event banner below.',
    thumb: '/template-thumbs/logo-promo-stack.png',
    inspiration: true,
  },
  {
    id: 'conference-hero',
    label: 'Conference hero',
    hint: 'Full-width hero image with contacts underneath.',
    thumb: '/template-thumbs/conference-hero.png',
    inspiration: true,
  },
  {
    id: 'partner-showcase',
    label: 'Partner showcase',
    hint: 'Side art, identity, partner strip footer PNG.',
    thumb: '/template-thumbs/partner-showcase.png',
    inspiration: true,
  },
]

interface TemplatePickerProps {
  state: SignatureFormState
  onChange: (state: SignatureFormState) => void
}

function thumbUrl(thumb: string) {
  return `${import.meta.env.BASE_URL}${thumb.replace(/^\//, '')}`
}

function TemplateGrid({
  legend,
  templates,
  state,
  onPick,
}: {
  legend: string
  templates: TemplateCard[]
  state: SignatureFormState
  onPick: (id: TemplateId) => void
}) {
  return (
    <fieldset className="mt-4">
      <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-ctp-subtext0">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
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
              onChange={() => onPick(t.id)}
              className="sr-only"
            />
            <div
              className="h-14 bg-ctp-mantle"
              style={{ backgroundImage: `url(${thumbUrl(t.thumb)})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
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

export function TemplatePicker({ state, onChange }: TemplatePickerProps) {
  const pick = (id: TemplateId) => onChange(applyTemplateToState(state, id))
  return (
    <BuilderSection sectionId="templates" title="Templates" defaultOpen>
      <TemplateGrid legend="Layout templates" templates={CORE_TEMPLATES} state={state} onPick={pick} />
      <TemplateGrid legend="Inspiration layouts" templates={INSPIRATION_TEMPLATES} state={state} onPick={pick} />
      <p className="mt-2 text-xs text-ctp-subtext0">
        Inspiration layouts keep your current brand. For close matches to the bundled examples, switch to reference brands{' '}
        <em>ref-amc-panel</em>, <em>ref-affiliate</em>, etc. — see{' '}
        <code className="text-ctp-text">docs/INSPIRATION_TEMPLATES.md</code>.
      </p>
    </BuilderSection>
  )
}