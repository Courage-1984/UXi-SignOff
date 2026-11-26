import { describe, expect, it } from 'vitest'
import { brands } from '../../config/brands'
import { createDefaultState, CUSTOM_BANNER_ID } from '../../config/defaults'
import type { PrimaryFlow, TemplateId } from '../../types/signature'
import { compileSignatureHtml } from '../compileSignature'

const ASSET_BASE = 'https://example.github.io/UXi-SignOff'
const FORBIDDEN = [
  /<style/i,
  /display:\s*flex/i,
  /flex-direction/i,
  /display:\s*grid/i,
  /\bgap:/i,
  /position:\s*absolute/i,
  /z-index/i,
  /var\(--/i,
  /<link/i,
  /<svg/i,
]

const TEMPLATES: TemplateId[] = [
  'classic-split',
  'compact-stacked',
  'executive-card',
  'modern-minimal',
  'accent-sidebar',
  'header-strip',
  'dual-visual',
  'panel-split',
  'headshot-affiliate',
  'logo-promo-stack',
  'conference-hero',
  'partner-showcase',
]

const FLOWS: PrimaryFlow[] = ['row', 'row-reverse', 'column', 'column-reverse']

function sampleState(brandId: string, templateId: TemplateId) {
  const brand = brands.find((b) => b.id === brandId)!
  const state = createDefaultState(brand, templateId)
  state.identity = {
    fullName: 'Jane Doe',
    jobTitle: 'Account Director',
    department: brand.name,
    mobile: '+27 82 555 1234',
    email: 'jane@example.com',
    website: brand.defaults.website,
    address: brand.defaults.address,
    tagline: brand.defaults.tagline,
  }
  state.blocks = state.blocks.map((b) => ({ ...b, enabled: true }))
  state.banner.bannerId = brand.banners[0]?.id ?? 'none'
  state.banner.url = brand.banners[0]?.defaultUrl ?? ''
  state.social.displayMode = 'icons'
  return { state, brand }
}

describe('compileSignatureHtml', () => {
  for (const brandId of ['uxi-creative', 'partner-alpha']) {
    for (const templateId of TEMPLATES) {
      it(`email-safe ${brandId} / ${templateId}`, () => {
        const { state, brand } = sampleState(brandId, templateId)
        const { html } = compileSignatureHtml(state, brand, { assetBaseUrl: ASSET_BASE })
        for (const pattern of FORBIDDEN) expect(html).not.toMatch(pattern)
        expect(html).toMatch(/role="presentation"/)
        expect(html).toMatch(/width="600"/)
        for (const tag of html.matchAll(/<img\b[^>]*>/gi)) {
          expect(tag[0]).toMatch(/\bwidth="/i)
          expect(tag[0].match(/\bsrc="([^"]+)"/i)?.[1]).toMatch(/^https:\/\//)
        }
      })
    }
  }

  for (const flow of FLOWS) {
    it(`layout flow ${flow} compiles`, () => {
      const { state, brand } = sampleState('uxi-creative', 'classic-split')
      state.layout.primaryFlow = flow
      const { html } = compileSignatureHtml(state, brand, { assetBaseUrl: ASSET_BASE })
      expect(html).toContain('logo-primary.png')
      expect(html).toContain('Jane Doe')
    })
  }

  it('renders custom field url', () => {
    const { state, brand } = sampleState('uxi-creative', 'classic-split')
    state.customFields = [{ id: '1', label: 'Book', value: 'Schedule', type: 'url', href: 'https://cal.example.com', visible: true }]
    const { html } = compileSignatureHtml(state, brand, { assetBaseUrl: ASSET_BASE })
    expect(html).toContain('https://cal.example.com')
  })

  it('qa-shapes wide logo respects display width', () => {
    const { state, brand } = sampleState('qa-shapes', 'classic-split')
    state.logoId = 'wide'
    const { html } = compileSignatureHtml(state, brand, { assetBaseUrl: ASSET_BASE })
    expect(html).toContain('logo-wide.png')
    expect(html).toMatch(/width="160"/)
    expect(html).toMatch(/width:\s*160px/)
  })

  it('headshot resolves local asset path', () => {
    const { state, brand } = sampleState('uxi-creative', 'dual-visual')
    state.headshot = { enabled: true, url: '/assets/qa/headshot-square.png', sizePx: 72, alt: 'Jane headshot' }
    const { html } = compileSignatureHtml(state, brand, { assetBaseUrl: ASSET_BASE })
    expect(html).toContain(`${ASSET_BASE}/assets/qa/headshot-square.png`)
    expect(html).toContain('alt="Jane headshot"')
  })

  it('custom banner gif and alt', () => {
    const { state, brand } = sampleState('uxi-creative', 'executive-card')
    state.blocks = state.blocks.map((b) => (b.id === 'banner' ? { ...b, enabled: true } : b))
    state.banner = {
      ...state.banner,
      bannerId: CUSTOM_BANNER_ID,
      customImageUrl: '/assets/qa/promo.gif',
      customWidthPx: 400,
      imageAlt: 'Animated promo',
      url: 'https://example.com',
    }
    const { html } = compileSignatureHtml(state, brand, { assetBaseUrl: ASSET_BASE })
    expect(html).toContain('promo.gif')
    expect(html).toContain('alt="Animated promo"')
  })

  it('logo alt override', () => {
    const { state, brand } = sampleState('uxi-creative', 'classic-split')
    state.logoRender = { ...state.logoRender, altOverride: 'Company wordmark' }
    const { html } = compileSignatureHtml(state, brand, { assetBaseUrl: ASSET_BASE })
    expect(html).toContain('alt="Company wordmark"')
  })

  it('legal font size and divider', () => {
    const { state, brand } = sampleState('uxi-creative', 'classic-split')
    state.legal.fontSizePx = 11
    state.legal.showDivider = true
    const { html } = compileSignatureHtml(state, brand, { assetBaseUrl: ASSET_BASE })
    expect(html).toMatch(/font-size:\s*11px/)
  })

  it('panel-split uses panel background when decoration present', () => {
    const { state, brand } = sampleState('ref-amc-panel', 'panel-split')
    const { html } = compileSignatureHtml(state, brand, { assetBaseUrl: ASSET_BASE })
    expect(html).toContain('decorations/panel-left.png')
    expect(html).toContain('bgcolor="#15803d"')
  })

  it('headshot-affiliate uses prefix labels', () => {
    const { state, brand } = sampleState('ref-affiliate', 'headshot-affiliate')
    const { html } = compileSignatureHtml(state, brand, { assetBaseUrl: ASSET_BASE })
    expect(html).toContain('w:')
    expect(html).toContain('e:')
    expect(html).toContain('affiliate-cta.png')
  })

  it('logo-promo-stack renders accent name and banner', () => {
    const { state, brand } = sampleState('ref-promo-stack', 'logo-promo-stack')
    const { html } = compileSignatureHtml(state, brand, { assetBaseUrl: ASSET_BASE })
    expect(html).toContain('event-promo.png')
    expect(html).toMatch(/#c2185b/i)
  })

  it('conference-hero renders hero decoration', () => {
    const { state, brand } = sampleState('ref-conference-hero', 'conference-hero')
    const { html } = compileSignatureHtml(state, brand, { assetBaseUrl: ASSET_BASE })
    expect(html).toContain('decorations/conference-hero.png')
  })

  it('partner-showcase renders partner strip', () => {
    const { state, brand } = sampleState('ref-partner-showcase', 'partner-showcase')
    const { html } = compileSignatureHtml(state, brand, { assetBaseUrl: ASSET_BASE })
    expect(html).toContain('decorations/partner-strip.png')
    expect(html).toContain('decorations/side-accent.png')
  })
})