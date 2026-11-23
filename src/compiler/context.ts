import type { BrandConfig, BrandPalette } from '../types/brand'
import type { SignatureFormState } from '../types/signature'

export interface CompileContext {
  brand: BrandConfig
  state: SignatureFormState
  palette: BrandPalette
  fontFamily: string
  assetBaseUrl: string
}

export function resolvePalette(state: SignatureFormState, brand: BrandConfig): BrandPalette {
  if (state.paletteOverride.enabled && state.paletteOverride.palette) {
    return { ...brand.palette, ...state.paletteOverride.palette }
  }
  return brand.palette
}

export function createContext(
  state: SignatureFormState,
  brand: BrandConfig,
  assetBaseUrl: string,
): CompileContext {
  return {
    brand,
    state,
    palette: resolvePalette(state, brand),
    fontFamily: brand.fontFamily,
    assetBaseUrl,
  }
}