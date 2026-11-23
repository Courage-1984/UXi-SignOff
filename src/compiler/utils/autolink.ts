import type { BrandPalette } from '../../types/brand'
import { escapeHtml, inlineStyle } from './html'

export function contactLinkStyle(palette: BrandPalette, fontFamily: string): string {
  return inlineStyle({
    'font-family': fontFamily,
    color: palette.textPrimary,
    'text-decoration': 'none',
    'border-bottom': 'none',
  })
}

export function plainTextSpan(text: string, palette: BrandPalette, fontFamily: string): string {
  return `<span style="${inlineStyle({
    'font-family': fontFamily,
    color: palette.textMuted,
    'text-decoration': 'none !important',
  })}">${escapeHtml(text)}</span>`
}