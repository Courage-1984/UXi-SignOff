import type { BrandConfig } from '../types/brand'
import type { BlockConfig, SignatureFormState, TemplateId } from '../types/signature'
import { applyStructuralPreset } from './applyTemplatePreset'
import { NO_BANNER_ID, DEFAULT_TEMPLATE } from './constants'
import { getTemplatePreset } from './templatePresets'

export { NO_BANNER_ID, CUSTOM_BANNER_ID } from './constants'
export { applyTemplateToState } from './applyTemplatePreset'

export const DEFAULT_BLOCKS: BlockConfig[] = [
  { id: 'identity', enabled: true },
  { id: 'cta', enabled: true },
  { id: 'social', enabled: true },
  { id: 'banner', enabled: false },
  { id: 'legal', enabled: true },
]

export { DEFAULT_TEMPLATE }

function defaultSocialFields(brand: BrandConfig) {
  const social = brand.defaults.social
  return {
    linkedin: { enabled: Boolean(social.linkedin), url: social.linkedin ?? '' },
    facebook: { enabled: Boolean(social.facebook), url: social.facebook ?? '' },
    instagram: { enabled: Boolean(social.instagram), url: social.instagram ?? '' },
    whatsapp: { enabled: Boolean(social.whatsapp), url: social.whatsapp ?? '' },
    x: { enabled: Boolean(social.x), url: social.x ?? '' },
    youtube: { enabled: Boolean(social.youtube), url: social.youtube ?? '' },
    tiktok: { enabled: false, url: '' },
    websiteGlobe: { enabled: true, url: brand.defaults.website },
    displayMode: 'text' as const,
    separator: 'pipe' as const,
    iconVariant: 'neutral' as const,
    layout: { direction: 'row' as const, align: 'left' as const },
  }
}

export function createDefaultState(brand: BrandConfig, templateId: TemplateId = DEFAULT_TEMPLATE): SignatureFormState {
  const ctas = brand.defaults.ctas
  const logo = brand.logos[0]
  const base: SignatureFormState = {
    brandId: brand.id,
    templateId,
    blocks: DEFAULT_BLOCKS.map((b) => ({ ...b })),
    logoId: logo?.id ?? 'primary',
    layout: getTemplatePreset(templateId).layout,
    spacing: JSON.parse(JSON.stringify(getTemplatePreset(templateId).spacing)),
    logoRender: {
      maxWidthPx: logo?.width ?? 140,
      maxHeightPx: 80,
      backingMode: 'brand-default',
      altOverride: '',
      customImageUrl: '',
    },
    headshot: { enabled: false, url: '', sizePx: 72, alt: '' },
    identity: {
      fullName: '',
      jobTitle: '',
      department: brand.name,
      mobile: '',
      email: '',
      website: brand.defaults.website,
      address: brand.defaults.address,
      tagline: brand.defaults.tagline,
    },
    customFields: [],
    cta: {
      buttons: [
        {
          label: ctas[0]?.label ?? 'Learn More',
          url: ctas[0]?.url ?? brand.defaults.website,
          enabled: true,
        },
        {
          label: ctas[1]?.label ?? 'Visit Website',
          url: ctas[1]?.url ?? brand.defaults.website,
          enabled: Boolean(ctas[1]),
        },
      ],
      layout: { direction: 'row', align: 'left' },
    },
    social: defaultSocialFields(brand),
    banner: {
      bannerId: NO_BANNER_ID,
      url: '',
      appendUtm: true,
      utmCampaign: brand.id,
      imageAlt: '',
      customImageUrl: '',
      customWidthPx: 560,
    },
    legal: {
      text: brand.legalDisclaimer.text,
      fontSizePx: 10,
      showDivider: false,
      unlockedOverride: false,
    },
    paletteOverride: { enabled: false, palette: {} },
  }

  return applyStructuralPreset(base, brand, templateId)
}