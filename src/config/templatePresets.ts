import type {
  BlockConfig,
  BlockId,
  CtaLayout,
  LayoutSettings,
  LogoRenderSettings,
  SpacingSettings,
  SocialFields,
  TemplateId,
} from '../types/signature'
import type { LegalFields } from '../types/signature'

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

export const BLOCK_ORDER: BlockId[] = ['identity', 'cta', 'social', 'banner', 'legal']

const STANDARD_BLOCKS: Record<BlockId, boolean> = {
  identity: true,
  cta: true,
  social: true,
  banner: false,
  legal: true,
}

const DEFAULT_SOCIAL_PRESENTATION: Pick<SocialFields, 'displayMode' | 'iconVariant' | 'separator' | 'layout'> = {
  displayMode: 'icons',
  iconVariant: 'neutral',
  separator: 'pipe',
  layout: { direction: 'row', align: 'left' },
}

const DEFAULT_CTA_LAYOUT: CtaLayout = { direction: 'row', align: 'left' }

export type TemplatePreset = {
  layout: LayoutSettings
  spacing: SpacingSettings
  blocks: Record<BlockId, boolean>
  headshot?: { enabled: boolean; sizePx?: number }
  banner?: 'off' | 'first'
  social?: Partial<Pick<SocialFields, 'displayMode' | 'iconVariant' | 'separator' | 'layout'>>
  cta?: Partial<CtaLayout> & { enableSecondButton?: boolean }
  legal?: Partial<Pick<LegalFields, 'fontSizePx' | 'showDivider'>>
  logoRender?: Partial<LogoRenderSettings>
}

export const TEMPLATE_LAYOUT_PRESETS: Record<TemplateId, TemplatePreset> = {
  'classic-split': {
    layout: { primaryFlow: 'row', blockAlign: 'top' },
    spacing: baseSpacing({ divider: { visible: true, thicknessPx: 3, style: 'solid', orientation: 'vertical' } }),
    blocks: { ...STANDARD_BLOCKS },
    headshot: { enabled: false },
    banner: 'off',
  },
  'compact-stacked': {
    layout: { primaryFlow: 'column', blockAlign: 'top' },
    spacing: baseSpacing({
      divider: { visible: true, thicknessPx: 2, style: 'solid', orientation: 'horizontal' },
    }),
    blocks: { ...STANDARD_BLOCKS },
    headshot: { enabled: false },
    banner: 'off',
  },
  'executive-card': {
    layout: { primaryFlow: 'column', blockAlign: 'top' },
    spacing: baseSpacing({
      blockGapPx: 10,
      divider: { visible: false, thicknessPx: 0, style: 'solid', orientation: 'horizontal' },
    }),
    blocks: { ...STANDARD_BLOCKS },
    headshot: { enabled: false },
    banner: 'off',
    cta: { direction: 'row', align: 'left' },
  },
  'modern-minimal': {
    layout: { primaryFlow: 'column', blockAlign: 'top' },
    spacing: baseSpacing({
      columnGapPx: 8,
      blockGapPx: 4,
      density: 'tight',
      divider: { visible: false, thicknessPx: 0, style: 'solid', orientation: 'horizontal' },
    }),
    blocks: { ...STANDARD_BLOCKS },
    headshot: { enabled: false },
    banner: 'off',
    legal: { fontSizePx: 10, showDivider: false },
  },
  'accent-sidebar': {
    layout: { primaryFlow: 'row', blockAlign: 'top' },
    spacing: baseSpacing({
      divider: { visible: true, thicknessPx: 4, style: 'solid', orientation: 'vertical' },
    }),
    blocks: { ...STANDARD_BLOCKS },
    headshot: { enabled: false },
    banner: 'off',
  },
  'header-strip': {
    layout: { primaryFlow: 'column', blockAlign: 'top' },
    spacing: baseSpacing({
      blockGapPx: 12,
      divider: { visible: false, thicknessPx: 0, style: 'solid', orientation: 'horizontal' },
    }),
    blocks: { ...STANDARD_BLOCKS },
    headshot: { enabled: false },
    banner: 'off',
  },
  'dual-visual': {
    layout: { primaryFlow: 'row', blockAlign: 'middle' },
    spacing: baseSpacing({ columnGapPx: 12, divider: { visible: false, thicknessPx: 0, style: 'solid', orientation: 'vertical' } }),
    blocks: { ...STANDARD_BLOCKS },
    headshot: { enabled: true, sizePx: 72 },
    banner: 'off',
  },
  'panel-split': {
    layout: { primaryFlow: 'row', blockAlign: 'top' },
    spacing: baseSpacing({
      divider: { visible: false, thicknessPx: 0, style: 'solid', orientation: 'vertical' },
    }),
    blocks: { identity: true, cta: false, social: false, banner: false, legal: false },
    headshot: { enabled: false },
    banner: 'off',
  },
  'headshot-affiliate': {
    layout: { primaryFlow: 'row', blockAlign: 'top' },
    spacing: baseSpacing({
      blockGapPx: 10,
      divider: { visible: false, thicknessPx: 0, style: 'solid', orientation: 'horizontal' },
    }),
    blocks: { identity: true, cta: false, social: true, banner: true, legal: false },
    headshot: { enabled: true, sizePx: 72 },
    banner: 'first',
    social: { displayMode: 'icons', iconVariant: 'circle-filled', layout: { direction: 'row', align: 'left' } },
  },
  'logo-promo-stack': {
    layout: { primaryFlow: 'column', blockAlign: 'top' },
    spacing: baseSpacing({
      blockGapPx: 12,
      divider: { visible: false, thicknessPx: 0, style: 'solid', orientation: 'horizontal' },
    }),
    blocks: { identity: true, cta: false, social: false, banner: true, legal: true },
    headshot: { enabled: false },
    banner: 'first',
    legal: { fontSizePx: 10, showDivider: false },
  },
  'conference-hero': {
    layout: { primaryFlow: 'column', blockAlign: 'top' },
    spacing: baseSpacing({
      blockGapPx: 8,
      density: 'tight',
      divider: { visible: false, thicknessPx: 0, style: 'solid', orientation: 'horizontal' },
    }),
    blocks: { identity: true, cta: false, social: false, banner: true, legal: true },
    headshot: { enabled: false },
    banner: 'first',
    legal: { fontSizePx: 10, showDivider: false },
  },
  'partner-showcase': {
    layout: { primaryFlow: 'row', blockAlign: 'top' },
    spacing: baseSpacing({
      blockGapPx: 8,
      divider: { visible: false, thicknessPx: 0, style: 'solid', orientation: 'horizontal' },
    }),
    blocks: { identity: true, cta: false, social: true, banner: false, legal: false },
    headshot: { enabled: false },
    banner: 'off',
    social: { displayMode: 'icons', iconVariant: 'neutral', layout: { direction: 'row', align: 'left' } },
    logoRender: { maxWidthPx: 100 },
  },
}

const KNOWN_TEMPLATES = new Set<string>(Object.keys(TEMPLATE_LAYOUT_PRESETS))

export function isKnownTemplateId(id: string): id is TemplateId {
  return KNOWN_TEMPLATES.has(id)
}

export function getTemplatePreset(templateId: TemplateId): TemplatePreset {
  return TEMPLATE_LAYOUT_PRESETS[templateId]
}

export function blocksFromPreset(preset: TemplatePreset): BlockConfig[] {
  return BLOCK_ORDER.map((id) => ({ id, enabled: preset.blocks[id] }))
}

export function defaultSocialPresentationForPreset(preset: TemplatePreset) {
  return { ...DEFAULT_SOCIAL_PRESENTATION, ...preset.social }
}

export function defaultCtaLayoutForPreset(preset: TemplatePreset): CtaLayout {
  return { ...DEFAULT_CTA_LAYOUT, ...preset.cta }
}