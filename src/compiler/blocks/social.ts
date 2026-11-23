import {
  ICON_DISPLAY_PX,
  SOCIAL_LABELS,
  iconFileName,
  type SocialNetworkId,
} from '../../config/socialIcons'
import type { CompileContext } from '../context'
import { contactLinkStyle } from '../utils/autolink'
import { escapeHtml, inlineStyle, presentationTable } from '../utils/html'
import { normalizeHref, resolveIconAssetUrl } from '../utils/urls'
import { spacerCell } from '../layout/spacer'

type NetworkKey = 'linkedin' | 'facebook' | 'instagram' | 'whatsapp' | 'x' | 'youtube' | 'tiktok' | 'websiteGlobe'

const NETWORK_KEYS: NetworkKey[] = [
  'linkedin',
  'facebook',
  'instagram',
  'whatsapp',
  'x',
  'youtube',
  'tiktok',
  'websiteGlobe',
]

function networkId(key: NetworkKey): SocialNetworkId {
  return key === 'websiteGlobe' ? 'website' : key
}

function getEntries(ctx: CompileContext) {
  const { social, identity } = ctx.state
  return NETWORK_KEYS.filter((key) => {
    const item = social[key]
    if (!item.enabled) return false
    if (key === 'websiteGlobe') return Boolean(item.url || identity.website)
    return Boolean(item.url)
  }).map((key) => {
    const url = key === 'websiteGlobe' ? social.websiteGlobe.url || identity.website : social[key].url
    return { key, id: networkId(key), url, label: SOCIAL_LABELS[networkId(key)] }
  })
}

function separatorChar(sep: string): string {
  if (sep === 'bullet') return ' • '
  if (sep === 'slash') return ' / '
  return ' | '
}

function alignAttr(align: string): string {
  return align === 'center' ? 'center' : align === 'right' ? 'right' : 'left'
}

function iconImg(ctx: CompileContext, network: SocialNetworkId, alt: string): string {
  const variant = ctx.state.social.iconVariant
  const src = resolveIconAssetUrl(ctx.assetBaseUrl, variant, iconFileName(network))
  const px = ICON_DISPLAY_PX
  return `<img src="${escapeHtml(src)}" width="${px}" height="${px}" alt="${escapeHtml(alt)}" style="${inlineStyle({
    display: 'block',
    border: '0',
    outline: 'none',
    width: `${px}px`,
    height: `${px}px`,
    'max-width': `${px}px`,
    'vertical-align': 'middle',
    '-ms-interpolation-mode': 'bicubic',
  })}" />`
}

export function renderSocialBlock(ctx: CompileContext): string {
  const entries = getEntries(ctx)
  if (!entries.length) return ''

  const { displayMode, layout } = ctx.state.social
  const linkStyle = contactLinkStyle(ctx.palette, ctx.fontFamily)
  const padTop = ctx.state.spacing.blockGapPx

  if (displayMode === 'text') {
    const sep = separatorChar(ctx.state.social.separator)
    const links = entries
      .map((e, i) => {
        const href = normalizeHref(e.url)
        const bit = `<a href="${escapeHtml(href)}" style="${linkStyle}"><span style="${linkStyle}">${e.label}</span></a>`
        return i < entries.length - 1 ? `${bit}${sep}` : bit
      })
      .join('')
    return `${presentationTable()}<tr><td align="${alignAttr(layout.align)}" style="${inlineStyle({
      padding: `${padTop}px 0 0 0`,
      'font-family': ctx.fontFamily,
      'font-size': '12px',
    })}">${links}</td></tr></table>`
  }

  if (layout.direction === 'column') {
    const rows = entries
      .map((e) => {
        const href = normalizeHref(e.url)
        const inner =
          displayMode === 'icons'
            ? iconImg(ctx, e.id, e.label)
            : `${iconImg(ctx, e.id, e.label)}&nbsp;<span style="${inlineStyle({ 'font-family': ctx.fontFamily, 'font-size': '12px', color: ctx.palette.textPrimary, 'vertical-align': 'middle' })}">${e.label}</span>`
        return `<tr><td style="${inlineStyle({ padding: '2px 0' })}"><a href="${escapeHtml(href)}" style="${linkStyle}">${inner}</a></td></tr>`
      })
      .join('')
    return `${presentationTable('align="' + alignAttr(layout.align) + '"')}<tr><td style="${inlineStyle({ padding: `${padTop}px 0 0 0` })}">
      ${presentationTable()}${rows}</table></td></tr></table>`
  }

  const cells = entries
    .map((e, i) => {
      const href = normalizeHref(e.url)
      const gap = i > 0 ? spacerCell(6) : ''
      const inner =
        displayMode === 'icons'
          ? iconImg(ctx, e.id, e.label)
          : `<table cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
              <td valign="middle" style="vertical-align:middle;">${iconImg(ctx, e.id, e.label)}</td>
              <td valign="middle" style="vertical-align:middle;padding-left:4px;font-family:${ctx.fontFamily};font-size:12px;color:${ctx.palette.textPrimary};">${e.label}</td>
            </tr></table>`
      return `${gap}<td valign="middle" style="vertical-align:middle;"><a href="${escapeHtml(href)}" style="${linkStyle}">${inner}</a></td>`
    })
    .join('')

  return `${presentationTable()}<tr><td align="${alignAttr(layout.align)}" style="${inlineStyle({ padding: `${padTop}px 0 0 0` })}">
    ${presentationTable('align="' + alignAttr(layout.align) + '"')}<tr>${cells}</tr></table>
  </td></tr></table>`
}