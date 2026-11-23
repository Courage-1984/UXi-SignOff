import { renderEnabledBlocks } from '../blocks'
import { renderBannerBlock } from '../blocks/banner'
import type { CompileContext } from '../context'
import { renderHeadshot } from '../headshot'
import { renderLogo } from '../logo'
import { renderPrimaryLayout, wrapOuterSignature } from '../layout/flowTable'
import { inlineStyle, presentationTable } from '../utils/html'
import type { TemplateId } from '../../types/signature'
import {
  renderConferenceHero,
  renderHeadshotAffiliate,
  renderLogoPromoStack,
  renderPanelSplit,
  renderPartnerShowcase,
} from './inspirationTemplates'

function blocksOnly(ctx: CompileContext, ids: Array<'identity' | 'cta' | 'social' | 'banner' | 'legal'>) {
  return {
    ...ctx,
    state: {
      ...ctx.state,
      blocks: ctx.state.blocks.filter((b) => ids.includes(b.id as never) && b.enabled),
    },
  }
}

function renderLogoSlot(ctx: CompileContext): string {
  const head = renderHeadshot(ctx)
  const logo = renderLogo(ctx)
  if ((ctx.state.templateId === 'dual-visual' || ctx.state.templateId === 'headshot-affiliate') && head) {
    return `${presentationTable()}<tr><td valign="middle" style="vertical-align:middle;">${head}</td><td valign="middle" style="vertical-align:middle;">${logo}</td></tr></table>`
  }
  return head + logo
}

function renderHeaderStripBand(ctx: CompileContext): string {
  const { identity } = ctx.state
  const logo = renderLogo(ctx)
  const title = [identity.fullName, identity.jobTitle].filter(Boolean).join(' — ')
  return `${presentationTable('width="100%"')}<tr>
    <td bgcolor="${ctx.palette.primary}" style="${inlineStyle({
      'background-color': ctx.palette.primary,
      padding: '12px',
      color: '#ffffff',
    })}">
      <table cellpadding="0" cellspacing="0" border="0" role="presentation" width="100%"><tr>
        <td valign="middle" style="${inlineStyle({ 'font-family': ctx.fontFamily, 'font-size': '14px', color: '#ffffff', 'font-weight': 'bold' })}">${title}</td>
        <td align="right" valign="middle">${logo}</td>
      </tr></table>
    </td>
  </tr></table>`
}

export function renderTemplate(ctx: CompileContext, templateId: TemplateId): string {
  if (templateId === 'panel-split') return renderPanelSplit(ctx)
  if (templateId === 'headshot-affiliate') return renderHeadshotAffiliate(ctx)
  if (templateId === 'logo-promo-stack') return renderLogoPromoStack(ctx)
  if (templateId === 'conference-hero') return renderConferenceHero(ctx)
  if (templateId === 'partner-showcase') return renderPartnerShowcase(ctx)

  const body = renderEnabledBlocks(ctx)

  if (templateId === 'executive-card') {
    const identityOnly = renderEnabledBlocks(blocksOnly(ctx, ['identity']))
    const actionRow = renderEnabledBlocks(blocksOnly(ctx, ['cta', 'social']))
    const bannerOnly = ctx.state.blocks.some((b) => b.id === 'banner' && b.enabled) ? renderBannerBlock(ctx) : ''
    const legalOnly = renderEnabledBlocks(blocksOnly(ctx, ['legal']))
  const logo = renderLogo(ctx)
    const inner = `${presentationTable('width="100%"')}<tr><td>${logo}</td></tr>
      <tr><td>${identityOnly}</td></tr>
      ${actionRow ? `<tr><td>${actionRow}</td></tr>` : ''}
      ${bannerOnly ? `<tr><td>${bannerOnly}</td></tr>` : ''}
      ${legalOnly ? `<tr><td>${legalOnly}</td></tr>` : ''}
    </table>`
    return wrapOuterSignature(ctx, inner)
  }

  if (templateId === 'header-strip') {
    const band = renderHeaderStripBand(ctx)
    const rest = renderEnabledBlocks({ ...ctx, state: { ...ctx.state, blocks: ctx.state.blocks.filter((b) => b.id !== 'identity') } })
    const inner = `${band}${rest}`
    return wrapOuterSignature(ctx, inner)
  }

  if (templateId === 'modern-minimal') {
    const logo = renderLogo(ctx)
    const minimalBody = renderEnabledBlocks(ctx)
    const inner = renderPrimaryLayout(ctx, logo, minimalBody)
    return wrapOuterSignature(ctx, inner)
  }

  const logoSlot = renderLogoSlot(ctx)
  const accent = templateId === 'accent-sidebar'
  const inner = renderPrimaryLayout(ctx, logoSlot, body, { accentSidebarBorder: accent })
  return wrapOuterSignature(ctx, inner)
}