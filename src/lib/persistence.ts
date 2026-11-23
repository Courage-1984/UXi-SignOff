import { createDefaultState, NO_BANNER_ID } from '../config/defaults'
import { getBrandById } from '../config/brands'
import { getTemplatePreset } from '../config/templatePresets'
import type { SignatureFormState, TemplateId } from '../types/signature'

const STORAGE_KEY = 'uxi-signoff-v2'
const LEGACY_KEY = 'uxi-signoff-v1'

function migrateV1(raw: Record<string, unknown>): SignatureFormState | null {
  const brandId = (raw.brandId as string) ?? 'uxi-creative'
  const brand = getBrandById(brandId)
  if (!brand) return null
  const base = createDefaultState(brand, (raw.templateId as TemplateId) ?? 'classic-split')
  const social = (raw.social as Record<string, unknown>) ?? {}
  return {
    ...base,
    ...(raw as Partial<SignatureFormState>),
    layout: base.layout,
    spacing: base.spacing,
    logoRender: base.logoRender,
    headshot: base.headshot,
    customFields: (raw.customFields as SignatureFormState['customFields']) ?? [],
    cta: {
      buttons: (raw.cta as SignatureFormState['cta'])?.buttons ?? base.cta.buttons,
      layout: (raw.cta as SignatureFormState['cta'])?.layout ?? base.cta.layout,
    },
    social: {
      ...base.social,
      linkedin: (social.linkedin as SignatureFormState['social']['linkedin']) ?? base.social.linkedin,
      facebook: (social.facebook as SignatureFormState['social']['facebook']) ?? base.social.facebook,
      instagram: (social.instagram as SignatureFormState['social']['instagram']) ?? base.social.instagram,
      whatsapp: (social.whatsapp as SignatureFormState['social']['whatsapp']) ?? base.social.whatsapp,
      x: (social.x as SignatureFormState['social']['x']) ?? base.social.x,
      youtube: (social.youtube as SignatureFormState['social']['youtube']) ?? base.social.youtube,
      displayMode: social.useIcons ? 'icons' : base.social.displayMode,
    },
    legal: {
      text: (raw.legal as SignatureFormState['legal'])?.text ?? base.legal.text,
      fontSizePx: 10,
      showDivider: false,
      unlockedOverride: false,
    },
    banner: (raw.banner as SignatureFormState['banner']) ?? {
      bannerId: NO_BANNER_ID,
      url: '',
      appendUtm: true,
      utmCampaign: brandId,
    },
  }
}

function hydratePartial(saved: Partial<SignatureFormState>, brandId: string): SignatureFormState {
  const brand = getBrandById(brandId)
  if (!brand) throw new Error('unknown brand')
  const templateId = (saved.templateId as TemplateId) ?? 'classic-split'
  const base = createDefaultState(brand, templateId)
  const preset = getTemplatePreset(templateId)
  return {
    ...base,
    ...saved,
    layout: { ...preset.layout, ...saved.layout },
    spacing: { ...base.spacing, ...saved.spacing, divider: { ...base.spacing.divider, ...saved.spacing?.divider } },
    social: { ...base.social, ...saved.social, layout: { ...base.social.layout, ...saved.social?.layout } },
    cta: { ...base.cta, ...saved.cta, layout: { ...base.cta.layout, ...saved.cta?.layout } },
    legal: { ...base.legal, ...saved.legal },
    logoRender: { ...base.logoRender, ...saved.logoRender },
    headshot: { ...base.headshot, ...saved.headshot },
    customFields: saved.customFields ?? [],
    blocks: saved.blocks ?? base.blocks,
  }
}

export function loadPersistedState(): SignatureFormState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SignatureFormState>
      if (parsed.brandId) return hydratePartial(parsed, parsed.brandId)
    }
    const legacy = localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      const migrated = migrateV1(JSON.parse(legacy) as Record<string, unknown>)
      if (migrated) {
        savePersistedState(migrated)
        return migrated
      }
    }
    return null
  } catch {
    return null
  }
}

export function savePersistedState(state: SignatureFormState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage full or private mode
  }
}

export function clearPersistedState(): void {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(LEGACY_KEY)
}