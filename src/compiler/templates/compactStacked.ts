import { renderEnabledBlocks } from '../blocks'
import type { CompileContext } from '../context'
import { renderLogo } from '../logo'
import { inlineStyle, presentationTable } from '../utils/html'

export function renderCompactStacked(ctx: CompileContext): string {
  const logo = renderLogo(ctx)
  const body = renderEnabledBlocks(ctx)
  const rule = inlineStyle({
    'border-top': `2px solid ${ctx.palette.divider}`,
    padding: '12px 0 0 0',
  })

  return `${presentationTable('width="600" style="max-width:600px;width:100%;"')}<tr>
  <td style="${inlineStyle({ 'font-family': ctx.fontFamily })}">
    ${logo}
    <table cellpadding="0" cellspacing="0" border="0" role="presentation" width="100%"><tr><td style="${rule}">${body}</td></tr></table>
  </td>
</tr></table>`
}