import type { SocialIconVariant } from '../types/signature'

export const SOCIAL_NETWORKS = [
  'linkedin',
  'facebook',
  'instagram',
  'whatsapp',
  'x',
  'youtube',
  'tiktok',
  'website',
] as const

export type SocialNetworkId = (typeof SOCIAL_NETWORKS)[number]

export const SOCIAL_LABELS: Record<SocialNetworkId, string> = {
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
  x: 'X',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  website: 'Website',
}

export const ICON_DISPLAY_PX = 22
export const ICON_SOURCE_PX = 48

export function iconFileName(network: SocialNetworkId): string {
  return `${network}.png`
}

export function iconVariantPaths(variant: SocialIconVariant): string {
  return `assets/icons/${variant}`
}

export const SOCIAL_ICON_CATALOG: Array<{ variant: SocialIconVariant; network: SocialNetworkId }> =
  SOCIAL_NETWORKS.flatMap((network) =>
    (['neutral', 'circle-filled'] as SocialIconVariant[]).map((variant) => ({ variant, network })),
  )