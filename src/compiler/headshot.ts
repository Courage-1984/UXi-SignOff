import type { CompileContext } from './context'
import { escapeHtml, inlineStyle, presentationTable } from './utils/html'
import { resolveImageSrc } from './utils/urls'

export function renderHeadshot(ctx: CompileContext): string {
  const { headshot, identity } = ctx.state
  if (!headshot.enabled || !headshot.url.trim()) return ''

  const size = headshot.sizePx
  const src = resolveImageSrc(ctx.assetBaseUrl, headshot.url)
  if (!src) return ''

  const alt = headshot.alt.trim() || identity.fullName.trim() || 'Photo'

  const imgStyle = inlineStyle({
    display: 'block',
    border: '0',
    outline: 'none',
    width: `${size}px`,
    height: `${size}px`,
    'max-width': `${size}px`,
    'border-radius': '50%',
    '-ms-interpolation-mode': 'bicubic',
  })
  return `${presentationTable()}<tr><td style="${inlineStyle({ padding: '0 8px 0 0' })}">
    <img src="${escapeHtml(src)}" width="${size}" height="${size}" alt="${escapeHtml(alt)}" style="${imgStyle}" />
  </td></tr></table>`
}