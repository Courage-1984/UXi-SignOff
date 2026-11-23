import type { CompileContext } from '../context'
import { escapeHtml, inlineStyle, presentationTable } from '../utils/html'
import { normalizeHref } from '../utils/urls'
import { spacerCell } from '../layout/spacer'

function renderButton(label: string, url: string, ctx: CompileContext): string {
  const href = normalizeHref(url)
  const linkStyle = inlineStyle({
    'font-family': ctx.fontFamily,
    'font-size': '13px',
    color: ctx.palette.buttonText,
    'text-decoration': 'none',
    display: 'inline-block',
  })
  return `<td bgcolor="${ctx.palette.buttonBg}" style="${inlineStyle({
    'background-color': ctx.palette.buttonBg,
    padding: '10px 16px',
  })}"><a href="${escapeHtml(href)}" style="${linkStyle}"><span style="${linkStyle}">${escapeHtml(label)}</span></a></td>`
}

function alignAttr(align: string): string {
  return align === 'center' ? 'center' : align === 'right' ? 'right' : 'left'
}

export function renderCtaBlock(ctx: CompileContext): string {
  const buttons = ctx.state.cta.buttons.filter((b) => b.enabled && b.label && b.url)
  if (!buttons.length) return ''

  const { direction, align } = ctx.state.cta.layout
  const padTop = ctx.state.spacing.blockGapPx

  if (direction === 'column') {
    const rows = buttons.map((b) => `<tr>${renderButton(b.label, b.url, ctx)}</tr>`).join('')
    return `${presentationTable()}<tr><td style="${inlineStyle({ padding: `${padTop}px 0 0 0` })}">
      ${presentationTable('align="' + alignAttr(align) + '"')}${rows}</table>
    </td></tr></table>`
  }

  const cells = buttons.map((b, i) => `${i > 0 ? spacerCell(8) : ''}${renderButton(b.label, b.url, ctx)}`).join('')
  return `${presentationTable()}<tr><td align="${alignAttr(align)}" style="${inlineStyle({ padding: `${padTop}px 0 0 0` })}">
    ${presentationTable('align="' + alignAttr(align) + '"')}<tr>${cells}</tr></table>
  </td></tr></table>`
}