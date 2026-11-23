export function resolveAssetUrl(
  assetBaseUrl: string,
  brandId: string,
  file: string,
): string {
  const base = assetBaseUrl.replace(/\/$/, '')
  return `${base}/assets/brands/${brandId}/${file}`
}

export function resolveIconAssetUrl(
  assetBaseUrl: string,
  variant: string,
  fileName: string,
): string {
  const base = assetBaseUrl.replace(/\/$/, '')
  return `${base}/assets/icons/${variant}/${fileName}`
}

export function normalizeTelHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '')
  return digits ? `tel:${digits}` : ''
}

export function normalizeDisplayUrl(url: string): string {
  return url.replace(/^https?:\/\//i, '').replace(/\/$/, '')
}

/** Absolute src for signature images (headshots, etc.) — not for page links. */
export function resolveImageSrc(assetBaseUrl: string, url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  const base = assetBaseUrl.replace(/\/$/, '')
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return `${base}${path}`
}

export function appendUtm(url: string, campaign: string): string {
  if (!url || !campaign) return url
  try {
    const parsed = new URL(url)
    parsed.searchParams.set('utm_source', 'email_signature')
    parsed.searchParams.set('utm_medium', 'email')
    parsed.searchParams.set('utm_campaign', campaign)
    return parsed.toString()
  } catch {
    const sep = url.includes('?') ? '&' : '?'
    return `${url}${sep}utm_source=email_signature&utm_medium=email&utm_campaign=${encodeURIComponent(campaign)}`
  }
}

export function normalizeHref(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}