import { renderEnabledBlocks } from '../blocks'
import type { CompileContext } from '../context'
import { renderLogo } from '../logo'
import { inlineStyle, presentationTable } from '../utils/html'

export function renderClassicSplit(ctx: CompileContext): string {
  const logo = renderLogo(ctx)
  const body = renderEnabledBlocks(ctx)
  const divider = inlineStyle({
    'border-left': `3px solid ${ctx.palette.divider}`,
    'padding-left': '16px',
  })

  return `${presentationTable('width="600" style="max-width:600px;width:100%;"')}<tr>
  <td style="${inlineStyle({ 'font-family': ctx.fontFamily, padding: '0' })}">
    ${presentationTable('width="100%"')}<tr>
      <td width="160" valign="top" style="${inlineStyle({ 'vertical-align': 'top', padding: '0 16px 0 0' })}">${logo}</td>
      <td valign="top" style="${divider}">${body}</td>
    </tr></table>
  </td>
</tr></table>`
}