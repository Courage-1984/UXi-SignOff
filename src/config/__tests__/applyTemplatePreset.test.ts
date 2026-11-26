import { describe, expect, it } from 'vitest'
import { brands } from '../brands'
import { applyTemplateToState } from '../applyTemplatePreset'
import { createDefaultState, NO_BANNER_ID } from '../defaults'

describe('applyTemplateToState', () => {
  it('preserves identity when switching templates', () => {
    const brand = brands.find((b) => b.id === 'uxi-creative')!
    let state = createDefaultState(brand, 'classic-split')
    state.identity.fullName = 'Taylor Test'
    state = applyTemplateToState(state, 'headshot-affiliate')
    state = applyTemplateToState(state, 'classic-split')
    expect(state.identity.fullName).toBe('Taylor Test')
  })

  it('resets from headshot-affiliate to classic-split', () => {
    const brand = brands.find((b) => b.id === 'uxi-creative')!
    let state = createDefaultState(brand, 'headshot-affiliate')
    state = applyTemplateToState(state, 'classic-split')
    expect(state.headshot.enabled).toBe(false)
    expect(state.banner.bannerId).toBe(NO_BANNER_ID)
    expect(state.blocks.find((b) => b.id === 'cta')?.enabled).toBe(true)
    expect(state.blocks.find((b) => b.id === 'banner')?.enabled).toBe(false)
    expect(state.social.displayMode).toBe('text')
    expect(state.social.iconVariant).toBe('neutral')
    expect(state.spacing.divider.visible).toBe(true)
  })

  it('logo-promo-stack to panel-split resets blocks and legal', () => {
    const brand = brands.find((b) => b.id === 'ref-promo-stack')!
    let state = createDefaultState(brand, 'logo-promo-stack')
    state = applyTemplateToState(state, 'panel-split')
    expect(state.blocks.find((b) => b.id === 'banner')?.enabled).toBe(false)
    expect(state.blocks.find((b) => b.id === 'legal')?.enabled).toBe(false)
    expect(state.banner.bannerId).toBe(NO_BANNER_ID)
    expect(state.spacing.divider.visible).toBe(false)
  })

  it('dual-visual enables headshot', () => {
    const brand = brands.find((b) => b.id === 'uxi-creative')!
    let state = createDefaultState(brand, 'classic-split')
    state = applyTemplateToState(state, 'dual-visual')
    expect(state.headshot.enabled).toBe(true)
  })

  it('conference-hero sets first banner when brand has banners', () => {
    const brand = brands.find((b) => b.id === 'ref-promo-stack')!
    const state = applyTemplateToState(createDefaultState(brand, 'classic-split'), 'conference-hero')
    expect(state.blocks.find((b) => b.id === 'banner')?.enabled).toBe(true)
    expect(state.banner.bannerId).toBe(brand.banners[0]!.id)
    expect(state.banner.url).toBe(brand.banners[0]!.defaultUrl)
  })
})