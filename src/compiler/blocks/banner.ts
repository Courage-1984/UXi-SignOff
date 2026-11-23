import { NO_BANNER_ID } from '../../config/defaults'
import type { CompileContext } from '../context'
import { escapeHtml, inlineStyle, presentationTable } from '../utils/html'
import { appendUtm, normalizeHref, resolveAssetUrl } from '../utils/urls'

export function renderBannerBlock(ctx: CompileContext): string {
  const { banner } = ctx.state
  const { brand } = ctx
  if (banner.bannerId === NO_BANNER_ID || !banner.bannerId) return ''

  const config = brand.banners.find((b) => b.id === banner.bannerId)
  if (!config) return ''

  let href = normalizeHref(banner.url || config.defaultUrl)
  if (banner.appendUtm && banner.utmCampaign) {
    href = appendUtm(href, banner.utmCampaign)
  }

  const src = resolveAssetUrl(ctx.assetBaseUrl, brand.id, config.file)
  const heightAttr = config.height ? ` height="${config.height}"` : ''

  const h = config.height ?? ''
  const imgStyle = inlineStyle({
    display: 'block',
    border: '0',
    outline: 'none',
    width: `${config.width}px`,
    'max-width': `${config.width}px`,
    ...(h ? { height: `${h}px`, 'max-height': `${h}px` } : {}),
    '-ms-interpolation-mode': 'bicubic',
  })

  return `${presentationTable()}<tr><td style="${inlineStyle({ padding: '12px 0 0 0' })}">
  <a href="${escapeHtml(href)}">
    <img src="${escapeHtml(src)}" width="${config.width}"${heightAttr} alt="${escapeHtml(config.alt)}" style="${imgStyle}" />
  </a>
</td></tr></table>`
}