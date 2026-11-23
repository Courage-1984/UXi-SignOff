import { renderEnabledBlocks } from '../blocks'
import { renderBannerBlock } from '../blocks/banner'
import { renderIdentityBlock } from '../blocks/identity'
import { renderSocialBlock } from '../blocks/social'
import type { CompileContext } from '../context'
import { renderDecorationImg, renderPartnerStrip } from '../decorations'
import { renderHeadshot } from '../headshot'
import { renderLogo } from '../logo'
import { wrapOuterSignature } from '../layout/flowTable'
import { escapeHtml, inlineStyle, presentationTable } from '../utils/html'
import { normalizeDisplayUrl, normalizeHref, resolveDecorationUrl } from '../utils/urls'

function blocksOnly(ctx: CompileContext, ids: Array<'identity' | 'cta' | 'social' | 'banner' | 'legal'>) {
  return {
    ...ctx,
    state: {
      ...ctx.state,
      blocks: ctx.state.blocks.filter((b) => ids.includes(b.id as never) && b.enabled),
    },
  }
}

function skipIdentity(ctx: CompileContext): CompileContext {
  return {
    ...ctx,
    state: {
      ...ctx.state,
      blocks: ctx.state.blocks.filter((b) => b.id !== 'identity'),
    },
  }
}

function renderPanelWebsiteFooter(ctx: CompileContext): string {
  const website = ctx.state.identity.website
  if (!website.trim()) return ''
  const href = normalizeHref(website)
  const display = normalizeDisplayUrl(website)
  const style = inlineStyle({
    'font-family': ctx.fontFamily,
    'font-size': '12px',
    color: ctx.palette.primary,
    'text-decoration': 'none',
  })
  return `<tr><td align="center" style="${inlineStyle({ padding: '12px 0 0 0' })}">
    <a href="${escapeHtml(href)}" style="${style}"><span style="${style}">${escapeHtml(display)}</span></a>
  </td></tr>`
}

export function renderPanelSplit(ctx: CompileContext): string {
  const identity = renderIdentityBlock(ctx)
  const logo = renderLogo(ctx)
  const panelFile = ctx.brand.decorations?.panelLeft
  const panelUrl = panelFile ? resolveDecorationUrl(ctx.assetBaseUrl, ctx.brand.id, panelFile) : ''
  const panelBg = panelUrl
    ? ` background="${escapeHtml(panelUrl)}"`
    : ''
  const legal = renderEnabledBlocks(blocksOnly(ctx, ['legal']))

  const inner = `${presentationTable('width="100%"')}<tr>
    <td width="58%" valign="top"${panelBg} bgcolor="${ctx.palette.primary}" style="${inlineStyle({
      'background-color': ctx.palette.primary,
      padding: '16px 20px',
      'vertical-align': 'top',
    })}">${identity}</td>
    <td width="42%" valign="middle" bgcolor="#ffffff" style="${inlineStyle({
      'background-color': '#ffffff',
      padding: '16px',
      'vertical-align': 'middle',
    })}">${presentationTable('width="100%"')}<tr><td align="center">${logo}</td></tr>${renderPanelWebsiteFooter(ctx)}</table></td>
  </tr></table>${legal}`

  return wrapOuterSignature(ctx, inner)
}

export function renderHeadshotAffiliate(ctx: CompileContext): string {
  const head = renderHeadshot(ctx)
  const identity = renderIdentityBlock(ctx)
  const social = ctx.state.blocks.some((b) => b.id === 'social' && b.enabled) ? renderSocialBlock(ctx) : ''
  const banner = ctx.state.blocks.some((b) => b.id === 'banner' && b.enabled) ? renderBannerBlock(ctx) : ''
  const legal = renderEnabledBlocks(blocksOnly(ctx, ['legal']))
  const cardPad = inlineStyle({ padding: '12px', 'border-top': '3px solid ' + ctx.palette.accent })

  const profileRow = head
    ? `${presentationTable('width="100%"')}<tr>
        <td width="88" valign="top" style="vertical-align:top;">${head}</td>
        <td valign="top" style="vertical-align:top;padding-left:12px;">${identity}</td>
      </tr></table>`
    : identity

  const inner = `${presentationTable('width="100%"')}<tr><td style="${cardPad}">
    ${profileRow}
    ${social}
    ${banner}
    ${legal}
  </td></tr></table>`

  return wrapOuterSignature(ctx, inner)
}

export function renderLogoPromoStack(ctx: CompileContext): string {
  const logo = renderLogo(ctx)
  const identity = renderIdentityBlock(ctx)
  const rest = renderEnabledBlocks(skipIdentity(ctx))
  const inner = `${presentationTable('width="100%"')}<tr>
    <td width="120" valign="top" style="${inlineStyle({ 'vertical-align': 'top', padding: '0 12px 0 0' })}">${logo}</td>
    <td valign="top" style="${inlineStyle({ 'vertical-align': 'top' })}">${identity}</td>
  </tr>
  <tr><td colspan="2">${rest}</td></tr></table>`
  return wrapOuterSignature(ctx, inner)
}

export function renderConferenceHero(ctx: CompileContext): string {
  const heroFile = ctx.brand.decorations?.hero
  let hero = ''
  if (heroFile) {
    const heroImg = renderDecorationImg(ctx, heroFile, { width: 600, height: 180, alt: 'Conference', block: true })
    hero = `${presentationTable('width="100%"')}<tr><td>${heroImg}</td></tr></table>`
  } else if (ctx.state.blocks.some((b) => b.id === 'banner' && b.enabled)) {
    hero = renderBannerBlock(ctx)
  }

  const identity = renderIdentityBlock(ctx)
  const base = skipIdentity(ctx)
  const rest = renderEnabledBlocks({
    ...base,
    state: {
      ...base.state,
      blocks: base.state.blocks.filter((b) => b.id !== 'banner' || !hero),
    },
  })

  const inner = `${hero}${identity}${rest}`
  return wrapOuterSignature(ctx, inner)
}

export function renderPartnerShowcase(ctx: CompileContext): string {
  const sideFile = ctx.brand.decorations?.sideAccent
  const sideImg = sideFile ? renderDecorationImg(ctx, sideFile, { width: 140, height: 140, alt: '' }) : ''
  const logo = renderLogo(ctx)
  const identity = renderIdentityBlock(ctx)
  const rest = renderEnabledBlocks(skipIdentity(ctx))
  const strip = renderPartnerStrip(ctx)

  const center = `${logo}${identity}`
  const top = sideImg
    ? `${presentationTable('width="100%"')}<tr>
        <td width="140" valign="top">${sideImg}</td>
        <td valign="top" style="${inlineStyle({ padding: '0 0 0 12px' })}">${center}</td>
      </tr></table>`
    : `${presentationTable('width="100%"')}<tr><td>${center}</td></tr></table>`

  const inner = `${top}${rest}${strip}`
  return wrapOuterSignature(ctx, inner)
}