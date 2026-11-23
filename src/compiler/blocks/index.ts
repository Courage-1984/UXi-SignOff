import type { BlockId } from '../../types/signature'
import type { CompileContext } from '../context'
import { spacerRow } from '../layout/spacer'
import { renderBannerBlock } from './banner'
import { renderCtaBlock } from './cta'
import { renderIdentityBlock } from './identity'
import { renderLegalBlock } from './legal'
import { renderSocialBlock } from './social'

const RENDERERS: Record<BlockId, (ctx: CompileContext) => string> = {
  identity: renderIdentityBlock,
  cta: renderCtaBlock,
  social: renderSocialBlock,
  banner: renderBannerBlock,
  legal: renderLegalBlock,
}

export function renderEnabledBlocks(ctx: CompileContext, skipIds: BlockId[] = []): string {
  const gap = ctx.state.spacing.blockGapPx
  const enabled = ctx.state.blocks.filter((b) => b.enabled && !skipIds.includes(b.id))
  return enabled
    .map((b, i) => {
      const html = RENDERERS[b.id](ctx)
      if (!html) return ''
      const lead = i > 0 ? spacerRow(gap) : ''
      return `${lead}${html}`
    })
    .filter(Boolean)
    .join('')
}