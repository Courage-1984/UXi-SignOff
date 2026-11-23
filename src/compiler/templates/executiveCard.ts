import { renderBannerBlock } from '../blocks/banner'
import { renderEnabledBlocks } from '../blocks'
import type { CompileContext } from '../context'
import { renderLogo } from '../logo'
import { inlineStyle, presentationTable } from '../utils/html'

function blocksOnly(ctx: CompileContext, ids: import('../../types/signature').BlockId[]): CompileContext {
  return {
    ...ctx,
    state: {
      ...ctx.state,
      blocks: ctx.state.blocks.filter((b) => ids.includes(b.id) && b.enabled),
    },
  }
}

export function renderExecutiveCard(ctx: CompileContext): string {
  const logo = renderLogo(ctx)
  const identityOnly = renderEnabledBlocks(blocksOnly(ctx, ['identity']))
  const actionRow = renderEnabledBlocks(blocksOnly(ctx, ['cta', 'social']))
  const bannerOnly = ctx.state.blocks.some((b) => b.id === 'banner' && b.enabled)
    ? renderBannerBlock(ctx)
    : ''
  const legalOnly = renderEnabledBlocks(blocksOnly(ctx, ['legal']))

  return `${presentationTable('width="600" style="max-width:600px;width:100%;"')}<tr>
  <td style="${inlineStyle({ 'font-family': ctx.fontFamily })}">
    ${presentationTable('width="100%"')}<tr>
      <td>${logo}</td>
    </tr>
    <tr><td style="${inlineStyle({ padding: '8px 0' })}">${identityOnly}</td></tr>
  ${actionRow ? `<tr><td>${actionRow}</td></tr>` : ''}
  ${bannerOnly ? `<tr><td>${bannerOnly}</td></tr>` : ''}
  ${legalOnly ? `<tr><td>${legalOnly}</td></tr>` : ''}
    </table>
  </td>
</tr></table>`
}