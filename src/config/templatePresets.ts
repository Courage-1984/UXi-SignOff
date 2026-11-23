import type { BlockId, LayoutSettings, SpacingSettings, TemplateId } from '../types/signature'

const baseSpacing = (overrides?: Partial<SpacingSettings>): SpacingSettings => ({
  outerPaddingPx: 0,
  columnGapPx: 16,
  blockGapPx: 8,
  density: 'normal',
  divider: {
    visible: true,
    thicknessPx: 3,
    style: 'solid',
    orientation: 'vertical',
  },
  ...overrides,
})

export type TemplatePreset = {
  layout: LayoutSettings
  spacing: SpacingSettings
  defaultBlocks?: Partial<Record<BlockId, boolean>>
  defaultHeadshot?: boolean
}

export const TEMPLATE_LAYOUT_PRESETS: Record<TemplateId, TemplatePreset> = {
  'classic-split': {
    layout: { primaryFlow: 'row', blockAlign: 'top' },
    spacing: baseSpacing({ divider: { visible: true, thicknessPx: 3, style: 'solid', orientation: 'vertical' } }),
  },
  'compact-stacked': {
    layout: { primaryFlow: 'column', blockAlign: 'top' },
    spacing: baseSpacing({
      divider: { visible: true, thicknessPx: 2, style: 'solid', orientation: 'horizontal' },
    }),
  },
  'executive-card': {
    layout: { primaryFlow: 'column', blockAlign: 'top' },
    spacing: baseSpacing({ blockGapPx: 10, divider: { visible: false, thicknessPx: 0, style: 'solid', orientation: 'horizontal' } }),
  },
  'modern-minimal': {
    layout: { primaryFlow: 'column', blockAlign: 'top' },
    spacing: baseSpacing({
      columnGapPx: 8,
      blockGapPx: 4,
      density: 'tight',
      divider: { visible: false, thicknessPx: 0, style: 'solid', orientation: 'horizontal' },
    }),
  },
  'accent-sidebar': {
    layout: { primaryFlow: 'row', blockAlign: 'top' },
    spacing: baseSpacing({
      divider: { visible: true, thicknessPx: 4, style: 'solid', orientation: 'vertical' },
    }),
  },
  'header-strip': {
    layout: { primaryFlow: 'column', blockAlign: 'top' },
    spacing: baseSpacing({
      blockGapPx: 12,
      divider: { visible: false, thicknessPx: 0, style: 'solid', orientation: 'horizontal' },
    }),
  },
  'dual-visual': {
    layout: { primaryFlow: 'row', blockAlign: 'middle' },
    spacing: baseSpacing({ columnGapPx: 12 }),
  },
  'panel-split': {
    layout: { primaryFlow: 'row', blockAlign: 'top' },
    spacing: baseSpacing({
      divider: { visible: false, thicknessPx: 0, style: 'solid', orientation: 'vertical' },
    }),
    defaultBlocks: { identity: true, cta: false, social: false, banner: false, legal: false },
  },
  'headshot-affiliate': {
    layout: { primaryFlow: 'row', blockAlign: 'top' },
    spacing: baseSpacing({
      blockGapPx: 10,
      divider: { visible: false, thicknessPx: 0, style: 'solid', orientation: 'horizontal' },
    }),
    defaultBlocks: { identity: true, cta: false, social: true, banner: true, legal: false },
    defaultHeadshot: true,
  },
  'logo-promo-stack': {
    layout: { primaryFlow: 'column', blockAlign: 'top' },
    spacing: baseSpacing({
      blockGapPx: 12,
      divider: { visible: false, thicknessPx: 0, style: 'solid', orientation: 'horizontal' },
    }),
    defaultBlocks: { identity: true, cta: false, social: false, banner: true, legal: true },
  },
  'conference-hero': {
    layout: { primaryFlow: 'column', blockAlign: 'top' },
    spacing: baseSpacing({
      blockGapPx: 8,
      density: 'tight',
      divider: { visible: false, thicknessPx: 0, style: 'solid', orientation: 'horizontal' },
    }),
    defaultBlocks: { identity: true, cta: false, social: false, banner: true, legal: true },
  },
  'partner-showcase': {
    layout: { primaryFlow: 'row', blockAlign: 'top' },
    spacing: baseSpacing({
      blockGapPx: 8,
      divider: { visible: false, thicknessPx: 0, style: 'solid', orientation: 'horizontal' },
    }),
    defaultBlocks: { identity: true, cta: false, social: true, banner: false, legal: false },
  },
}

const KNOWN_TEMPLATES = new Set<string>(Object.keys(TEMPLATE_LAYOUT_PRESETS))

export function isKnownTemplateId(id: string): id is TemplateId {
  return KNOWN_TEMPLATES.has(id)
}

export function getTemplatePreset(templateId: TemplateId) {
  return TEMPLATE_LAYOUT_PRESETS[templateId]
}

export function applyPresetBlocks(
  blocks: { id: BlockId; enabled: boolean }[],
  preset: TemplatePreset,
): { id: BlockId; enabled: boolean }[] {
  if (!preset.defaultBlocks) return blocks
  return blocks.map((b) => ({
    ...b,
    enabled: preset.defaultBlocks![b.id] ?? b.enabled,
  }))
}