import { describe, expect, it } from 'vitest'
import { resolveAssetBaseUrl } from '../assetBaseUrl'

describe('resolveAssetBaseUrl', () => {
  it('prefers VITE_ASSET_BASE_URL', () => {
    expect(
      resolveAssetBaseUrl({
        viteAssetBaseUrl: 'https://user.github.io/UXi-SignOff/',
        origin: 'http://localhost:5173',
        basePath: '/',
      }),
    ).toBe('https://user.github.io/UXi-SignOff')
  })

  it('combines origin with BASE_URL subpath when env unset', () => {
    expect(
      resolveAssetBaseUrl({
        origin: 'https://user.github.io',
        basePath: '/UXi-SignOff/',
      }),
    ).toBe('https://user.github.io/UXi-SignOff')
  })

  it('uses origin only when base path is root', () => {
    expect(
      resolveAssetBaseUrl({
        origin: 'http://localhost:5173',
        basePath: '/',
      }),
    ).toBe('http://localhost:5173')
  })

  it('falls back in node-like context', () => {
    expect(resolveAssetBaseUrl({})).toBe('https://courage-1984.github.io/UXi-SignOff')
  })
})