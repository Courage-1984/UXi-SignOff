import type { CompileContext } from '../context'
import { escapeHtml, inlineStyle, presentationTable } from '../utils/html'
import { spacerRow } from '../layout/spacer'

export function renderLegalBlock(ctx: CompileContext): string {
  const text = ctx.state.legal.text?.trim()
  if (!text) return ''

  const { fontSizePx, showDivider } = ctx.state.legal
  const divider = showDivider ? spacerRow(ctx.state.spacing.blockGapPx) : ''

  return `${presentationTable()}<tr><td>
    ${divider}
    <table cellpadding="0" cellspacing="0" border="0" role="presentation" width="100%"><tr><td style="${inlineStyle({
      padding: `${ctx.state.spacing.blockGapPx}px 0 0 0`,
      'font-family': ctx.fontFamily,
      'font-size': `${fontSizePx}px`,
      'line-height': `${fontSizePx + 4}px`,
      color: ctx.palette.textMuted,
    })}">${escapeHtml(text)}</td></tr></table>
  </td></tr></table>`
}