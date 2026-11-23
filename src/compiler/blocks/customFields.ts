import type { CompileContext } from '../context'
import { contactLinkStyle, plainTextSpan } from '../utils/autolink'
import { escapeHtml, inlineStyle, presentationTable } from '../utils/html'
import { normalizeHref, normalizeTelHref } from '../utils/urls'

export function renderCustomFieldRows(ctx: CompileContext): string {
  const fields = ctx.state.customFields.filter((f) => f.visible && f.value.trim())
  if (!fields.length) return ''

  const linkStyle = contactLinkStyle(ctx.palette, ctx.fontFamily)
  const rowPad =
    ctx.state.spacing.density === 'tight' ? '1px 0' : ctx.state.spacing.density === 'relaxed' ? '4px 0' : '2px 0'

  return fields
    .map((f) => {
      let inner: string
      switch (f.type) {
        case 'email':
          inner = `<a href="mailto:${escapeHtml(f.value)}" style="${linkStyle}"><span style="${linkStyle}">${escapeHtml(f.value)}</span></a>`
          break
        case 'phone': {
          const href = normalizeTelHref(f.value)
          inner = `<a href="${escapeHtml(href)}" style="${linkStyle}"><span style="${linkStyle}">${escapeHtml(f.value)}</span></a>`
          break
        }
        case 'url': {
          const href = normalizeHref(f.href || f.value)
          inner = `<a href="${escapeHtml(href)}" style="${linkStyle}"><span style="${linkStyle}">${escapeHtml(f.value)}</span></a>`
          break
        }
        default:
          inner = plainTextSpan(f.value, ctx.palette, ctx.fontFamily)
      }
      const label = f.label ? `${escapeHtml(f.label)}: ` : ''
      return `<tr><td style="${inlineStyle({
        'font-family': ctx.fontFamily,
        'font-size': '13px',
        'line-height': '20px',
        color: ctx.palette.textPrimary,
        padding: rowPad,
      })}">${label}${inner}</td></tr>`
    })
    .join('')
}

export function renderCustomFields(ctx: CompileContext): string {
  const rows = renderCustomFieldRows(ctx)
  if (!rows) return ''
  return `${presentationTable()}<tr><td>${presentationTable()}${rows}</table></td></tr></table>`
}