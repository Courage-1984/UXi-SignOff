import { getBrandById } from './brands'
import { NO_BANNER_ID } from './constants'
import type { BrandConfig } from '../types/brand'
import type { SignatureFormState, TemplateId } from '../types/signature'
import {
  blocksFromPreset,
  defaultCtaLayoutForPreset,
  defaultSocialPresentationForPreset,
  getTemplatePreset,
} from './templatePresets'

export function applyStructuralPreset(
  state: SignatureFormState,
  brand: BrandConfig,
  templateId: TemplateId,
): SignatureFormState {
  const preset = getTemplatePreset(templateId)
  const blocks = blocksFromPreset(preset)
  const bannerBlockOn = preset.blocks.banner

  let banner = { ...state.banner }
  if (preset.banner === 'first' && bannerBlockOn && brand.banners[0]) {
    const first = brand.banners[0]!
    banner = {
      ...banner,
      bannerId: first.id,
      url: first.defaultUrl,
      appendUtm: true,
      utmCampaign: brand.id,
    }
  } else if (!bannerBlockOn || preset.banner === 'off') {
    banner = {
      ...banner,
      bannerId: NO_BANNER_ID,
      url: '',
      utmCampaign: brand.id,
    }
  }

  const socialPresentation = defaultSocialPresentationForPreset(preset)
  const ctaLayout = defaultCtaLayoutForPreset(preset)
  const headshotEnabled = preset.headshot?.enabled ?? false
  const headshotSize = preset.headshot?.sizePx ?? state.headshot.sizePx

  const buttons = state.cta.buttons.map((btn, i) => {
    if (i === 1 && preset.cta?.enableSecondButton === false) return { ...btn, enabled: false }
    if (i === 1 && preset.cta?.enableSecondButton === true) return { ...btn, enabled: true }
    return btn
  })

  const legal = { ...state.legal }
  if (preset.legal?.fontSizePx !== undefined) legal.fontSizePx = preset.legal.fontSizePx
  if (preset.legal?.showDivider !== undefined) legal.showDivider = preset.legal.showDivider

  const logoConfig = brand.logos.find((l) => l.id === state.logoId) ?? brand.logos[0]
  const logoRender = {
    ...state.logoRender,
    maxWidthPx: preset.logoRender?.maxWidthPx ?? logoConfig?.width ?? state.logoRender.maxWidthPx,
    ...(preset.logoRender?.maxHeightPx !== undefined ? { maxHeightPx: preset.logoRender.maxHeightPx } : {}),
    ...(preset.logoRender?.backingMode !== undefined ? { backingMode: preset.logoRender.backingMode } : {}),
  }

  return {
    ...state,
    templateId,
    layout: { ...preset.layout },
    spacing: JSON.parse(JSON.stringify(preset.spacing)),
    blocks,
    headshot: {
      ...state.headshot,
      enabled: headshotEnabled,
      sizePx: headshotSize,
    },
    banner,
    social: {
      ...state.social,
      ...socialPresentation,
      layout: { ...socialPresentation.layout },
    },
    cta: {
      buttons,
      layout: { ...ctaLayout },
    },
    legal,
    logoRender,
  }
}

export function applyTemplateToState(state: SignatureFormState, templateId: TemplateId): SignatureFormState {
  const brand = getBrandById(state.brandId)
  if (!brand) return { ...state, templateId }
  return applyStructuralPreset(state, brand, templateId)
}