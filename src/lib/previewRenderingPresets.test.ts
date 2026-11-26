import { describe, expect, it } from 'vitest'
import { getPreviewPreset, PREVIEW_RENDERING_PRESETS } from './previewRenderingPresets'

describe('previewRenderingPresets', () => {
  it('defines four presets', () => {
    expect(PREVIEW_RENDERING_PRESETS).toHaveLength(4)
  })

  it('fullInvert applies invert filter and img class', () => {
    const p = getPreviewPreset('fullInvert')
    expect(p.signatureWrapperClass).toBe('preview-full-invert')
    expect(p.signatureInlineStyle?.filter).toContain('invert')
  })

  it('darkChromeUnchanged leaves signature filter empty', () => {
    const p = getPreviewPreset('darkChromeUnchanged')
    expect(p.signatureWrapperClass).toBe('')
    expect(p.signatureInlineStyle).toBeUndefined()
  })

  it('falls back to unchangedLight for unknown id', () => {
    expect(getPreviewPreset('unknown' as 'unchangedLight').id).toBe('unchangedLight')
  })
})