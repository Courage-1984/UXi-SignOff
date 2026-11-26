import { CUSTOM_BANNER_ID, NO_BANNER_ID } from '../../config/constants'
import type { CompileContext } from '../context'
import { escapeHtml, inlineStyle, presentationTable } from '../utils/html'
import { appendUtm, normalizeHref, resolveAssetUrl, resolveImageSrc } from '../utils/urls'

export function renderBannerBlock(ctx: CompileContext): string {
  const { banner } = ctx.state
  const { brand } = ctx
  if (banner.bannerId === NO_BANNER_ID || !banner.bannerId) return ''

  const isCustom = banner.bannerId === CUSTOM_BANNER_ID
  const config = isCustom ? null : brand.banners.find((b) => b.id === banner.bannerId)
  if (!isCustom && !config) return ''
  if (isCustom && !banner.customImageUrl.trim()) return ''

  let href = normalizeHref(banner.url || config?.defaultUrl || brand.defaults.website)
  if (banner.appendUtm && banner.utmCampaign) {
    href = appendUtm(href, banner.utmCampaign)
  }

  let src: string
  let width: number
  let heightAttr = ''
  let imgStyle: string
  const alt = banner.imageAlt.trim() || config?.alt || 'Campaign banner'

  if (isCustom) {
    src = resolveImageSrc(ctx.assetBaseUrl, banner.customImageUrl)
    if (!src) return ''
    width = banner.customWidthPx > 0 ? banner.customWidthPx : 560
    imgStyle = inlineStyle({
      display: 'block',
      border: '0',
      outline: 'none',
      width: `${width}px`,
      'max-width': `${width}px`,
      '-ms-interpolation-mode': 'bicubic',
    })
  } else {
    const brandBanner = config!
    src = resolveAssetUrl(ctx.assetBaseUrl, brand.id, brandBanner.file)
    width = brandBanner.width
    const h = brandBanner.height ?? ''
    heightAttr = brandBanner.height ? ` height="${brandBanner.height}"` : ''
    imgStyle = inlineStyle({
      display: 'block',
      border: '0',
      outline: 'none',
      width: `${brandBanner.width}px`,
      'max-width': `${brandBanner.width}px`,
      ...(h ? { height: `${h}px`, 'max-height': `${h}px` } : {}),
      '-ms-interpolation-mode': 'bicubic',
    })
  }

  return `${presentationTable()}<tr><td style="${inlineStyle({ padding: '12px 0 0 0' })}">
  <a href="${escapeHtml(href)}">
    <img src="${escapeHtml(src)}" width="${width}"${heightAttr} alt="${escapeHtml(alt)}" style="${imgStyle}" />
  </a>
</td></tr></table>`
}