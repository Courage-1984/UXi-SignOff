import type { SocialIconVariant } from '../types/signature'

export const SOCIAL_ICON_VARIANTS: { id: SocialIconVariant; label: string }[] = [
  { id: 'brand', label: 'Brand colors' },
  { id: 'monochrome', label: 'Grey (B&W)' },
]

export function normalizeSocialIconVariant(value: unknown): SocialIconVariant {
  if (value === 'brand' || value === 'monochrome') return value
  if (value === 'circle-filled') return 'brand'
  if (value === 'neutral') return 'monochrome'
  return 'brand'
}