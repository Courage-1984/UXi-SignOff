export interface AssetBaseUrlInput {
  viteAssetBaseUrl?: string
  origin?: string
  basePath?: string
  nodeFallback?: string
}

/**
 * Resolves the HTTPS origin + subpath used in copied signature image URLs.
 */
export function resolveAssetBaseUrl(input: AssetBaseUrlInput): string {
  const fromEnv = input.viteAssetBaseUrl?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')

  if (input.origin) {
    const path = (input.basePath ?? '/').replace(/\/$/, '')
    if (path && path !== '/') {
      return `${input.origin.replace(/\/$/, '')}${path}`
    }
    return input.origin.replace(/\/$/, '')
  }

  return (input.nodeFallback ?? 'https://courage-1984.github.io/UXi-SignOff').replace(/\/$/, '')
}

export function getDefaultAssetBaseUrl(): string {
  return resolveAssetBaseUrl({
    viteAssetBaseUrl: import.meta.env.VITE_ASSET_BASE_URL as string | undefined,
    origin: typeof window !== 'undefined' ? window.location.origin : undefined,
    basePath: import.meta.env.BASE_URL as string | undefined,
    nodeFallback: 'https://courage-1984.github.io/UXi-SignOff',
  })
}