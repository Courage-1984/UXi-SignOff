import type { CompileContext } from '../context'
import { inlineStyle } from '../utils/html'
import type { DividerSettings } from '../../types/signature'

export function verticalDividerCell(ctx: CompileContext, settings: DividerSettings, heightHint = '100%'): string {
  if (!settings.visible || settings.orientation !== 'vertical') return ''
  return `<td width="${settings.thicknessPx}" style="${inlineStyle({
    width: `${settings.thicknessPx}px`,
    'border-left': `${settings.thicknessPx}px ${settings.style} ${ctx.palette.divider}`,
    'font-size': '0',
    'line-height': '0',
    height: heightHint,
  })}">&nbsp;</td>`
}

export function horizontalDividerRow(ctx: CompileContext, settings: DividerSettings): string {
  if (!settings.visible || settings.orientation !== 'horizontal') return ''
  return `<tr><td colspan="99" style="${inlineStyle({
    'border-top': `${settings.thicknessPx}px ${settings.style} ${ctx.palette.divider}`,
    'font-size': '0',
    'line-height': '0',
    height: `${settings.thicknessPx}px`,
  })}">&nbsp;</td></tr>`
}