import type { CompileContext } from '../context'
import { inlineStyle, presentationTable } from '../utils/html'
import type { PrimaryFlow } from '../../types/signature'
import { horizontalDividerRow, verticalDividerCell } from './divider'
import { spacerCell } from './spacer'

function valignFromAlign(align: string): string {
  return align === 'middle' ? 'middle' : align === 'bottom' ? 'bottom' : 'top'
}

function composeRow(
  ctx: CompileContext,
  primary: string,
  secondary: string,
  flow: PrimaryFlow,
  extraPrefix = '',
): string {
  const { spacing, layout } = ctx.state
  const v = valignFromAlign(layout.blockAlign)
  const gap = spacerCell(spacing.columnGapPx)
  const vDivider = verticalDividerCell(ctx, spacing.divider)

  const isRow = flow === 'row' || flow === 'row-reverse'
  if (!isRow) {
    const top = flow === 'column' ? primary : secondary
    const bottom = flow === 'column' ? secondary : primary
    const hRule = horizontalDividerRow(ctx, spacing.divider)
    return `${presentationTable('width="100%"')}
      <tr><td valign="${v}">${extraPrefix}${top}</td></tr>
      ${hRule}
      <tr><td valign="${v}">${bottom}</td></tr>
    </table>`
  }

  const left = flow === 'row' ? primary : secondary
  const right = flow === 'row' ? secondary : primary
  return `${presentationTable('width="100%"')}<tr>
    <td valign="${v}" style="${inlineStyle({ 'vertical-align': v })}">${extraPrefix}${left}</td>
    ${gap}
    ${vDivider}
    <td valign="${v}" style="${inlineStyle({ 'vertical-align': v })}">${right}</td>
  </tr></table>`
}

export function wrapOuterSignature(ctx: CompileContext, inner: string): string {
  const pad = ctx.state.spacing.outerPaddingPx
  const padStyle = pad > 0 ? inlineStyle({ padding: `${pad}px` }) : ''
  return `${presentationTable('width="600" style="max-width:600px;width:100%;" role="presentation"')}<tr>
    <td style="${inlineStyle({ 'font-family': ctx.fontFamily, ...Object.fromEntries(padStyle ? [] : []) })}${padStyle ? ` ${padStyle}` : ''}">
      ${inner}
    </td>
  </tr></table>`
}

export function renderPrimaryLayout(
  ctx: CompileContext,
  logoSlot: string,
  bodySlot: string,
  options?: { accentSidebarBorder?: boolean; extraLeading?: string },
): string {
  const { layout, spacing } = ctx.state
  let body = bodySlot
  if (options?.accentSidebarBorder) {
    body = `<table cellpadding="0" cellspacing="0" border="0" role="presentation" width="100%"><tr><td style="${inlineStyle({
      'border-left': `4px solid ${ctx.palette.accent}`,
      'padding-left': '12px',
    })}">${body}</td></tr></table>`
  }
  const flow = layout.primaryFlow
  const inner = composeRow(ctx, logoSlot, body, flow, options?.extraLeading ?? '')
  if (spacing.divider.visible && spacing.divider.orientation === 'horizontal' && (flow === 'column' || flow === 'column-reverse')) {
    return inner
  }
  return inner
}