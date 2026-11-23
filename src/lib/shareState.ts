import type { ShareableTemplateSlice, SignatureFormState } from '../types/signature'

export function toShareableSlice(state: SignatureFormState): ShareableTemplateSlice {
  return {
    brandId: state.brandId,
    templateId: state.templateId,
    layout: state.layout,
    spacing: state.spacing,
    logoId: state.logoId,
    logoRender: state.logoRender,
    blocks: state.blocks,
    banner: { ...state.banner },
    social: {
      displayMode: state.social.displayMode,
      separator: state.social.separator,
      iconVariant: state.social.iconVariant,
      layout: state.social.layout,
    },
  }
}

export function encodeShareHash(slice: ShareableTemplateSlice): string {
  const json = JSON.stringify(slice)
  const b64 = btoa(unescape(encodeURIComponent(json)))
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeShareHash(hash: string): ShareableTemplateSlice | null {
  try {
    let b64 = hash.replace(/-/g, '+').replace(/_/g, '/')
    while (b64.length % 4) b64 += '='
    const json = decodeURIComponent(escape(atob(b64)))
    return JSON.parse(json) as ShareableTemplateSlice
  } catch {
    return null
  }
}

export function applyShareableSlice(state: SignatureFormState, slice: ShareableTemplateSlice): SignatureFormState {
  return {
    ...state,
    brandId: slice.brandId,
    templateId: slice.templateId,
    layout: { ...slice.layout },
    spacing: JSON.parse(JSON.stringify(slice.spacing)),
    logoId: slice.logoId,
    logoRender: { ...slice.logoRender },
    blocks: slice.blocks.map((b) => ({ ...b })),
    banner: { ...slice.banner },
    social: { ...state.social, ...slice.social },
  }
}