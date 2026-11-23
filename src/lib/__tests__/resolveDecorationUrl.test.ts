import { describe, expect, it } from 'vitest'
import { resolveDecorationUrl } from '../../compiler/utils/urls'

describe('resolveDecorationUrl', () => {
  it('builds decorations path under brand', () => {
    expect(resolveDecorationUrl('https://example.io/app', 'ref-amc-panel', 'panel-left.png')).toBe(
      'https://example.io/app/assets/brands/ref-amc-panel/decorations/panel-left.png',
    )
  })
})