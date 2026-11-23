import { describe, expect, it } from 'vitest'
import { brands } from '../../config/brands'
import { createDefaultState } from '../../config/defaults'
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

  it('legal font size and divider', () => {
    const { state, brand } = sampleState('uxi-creative', 'classic-split')
    state.legal.fontSizePx = 11
    state.legal.showDivider = true
    const { html } = compileSignatureHtml(state, brand, { assetBaseUrl: ASSET_BASE })
    expect(html).toMatch(/font-size:\s*11px/)
  })
})