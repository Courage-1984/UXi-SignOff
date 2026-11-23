import { describe, expect, it } from 'vitest'
import { resolveImageSrc } from '../../compiler/utils/urls'

describe('resolveImageSrc', () => {
  const base = 'https://example.github.io/UXi-SignOff'

  it('passes through absolute https URLs', () => {
    expect(resolveImageSrc(base, 'https://cdn.example.com/photo.png')).toBe('https://cdn.example.com/photo.png')
  })

  it('resolves site-relative paths against asset base', () => {
    expect(resolveImageSrc(base, '/assets/qa/headshot-square.png')).toBe(
      'https://example.github.io/UXi-SignOff/assets/qa/headshot-square.png',
    )
  })
})