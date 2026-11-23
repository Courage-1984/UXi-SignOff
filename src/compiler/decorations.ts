import type { CompileContext } from './context'
import { escapeHtml, inlineStyle, presentationTable } from './utils/html'
import { normalizeHref, resolveDecorationUrl } from './utils/urls'

export function renderDecorationImg(
  ctx: CompileContext,
  file: string | undefined,
  opts: { width: number; height?: number; alt?: string; href?: string; block?: boolean },
): string {
  if (!file) return ''
  const src = resolveDecorationUrl(ctx.assetBaseUrl, ctx.brand.id, file)
  const h = opts.height
  const imgStyle = inlineStyle({
    display: opts.block === false ? 'inline' : 'block',
    border: '0',
    outline: 'none',
    width: `${opts.width}px`,
    'max-width': `${opts.width}px`,
    ...(h ? { height: `${h}px`, 'max-height': `${h}px` } : {}),
    '-ms-interpolation-mode': 'bicubic',
  })
  const heightAttr = h ? ` height="${h}"` : ''
  const img = `<img src="${escapeHtml(src)}" width="${opts.width}"${heightAttr} alt="${escapeHtml(opts.alt ?? '')}" style="${imgStyle}" />`
  if (opts.href) {
    const href = normalizeHref(opts.href)
    return `<a href="${escapeHtml(href)}">${img}</a>`
  }
  return img
}

export function renderPartnerStrip(ctx: CompileContext): string {
  const file = ctx.brand.decorations?.partnerStrip
  if (!file) return ''
  const img = renderDecorationImg(ctx, file, { width: 600, height: 72, alt: 'Partners' })
  if (!img) return ''
  return `${presentationTable('width="100%"')}<tr><td style="${inlineStyle({ padding: '8px 0 0 0' })}">${img}</td></tr></table>`
}