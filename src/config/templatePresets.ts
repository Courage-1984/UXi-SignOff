import type { LayoutSettings, SpacingSettings, TemplateId } from '../types/signature'

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

export const TEMPLATE_LAYOUT_PRESETS: Record<TemplateId, { layout: LayoutSettings; spacing: SpacingSettings }> = {
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
}

export function getTemplatePreset(templateId: TemplateId) {
  return TEMPLATE_LAYOUT_PRESETS[templateId]
}