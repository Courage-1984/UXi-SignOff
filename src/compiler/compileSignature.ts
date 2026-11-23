import type { BrandConfig } from '../types/brand'
import type { CompileOptions, SignatureFormState } from '../types/signature'
import { createContext } from './context'
import { renderTemplate } from './templates/renderTemplate'

function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/td>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function compileSignatureHtml(
  state: SignatureFormState,
  brand: BrandConfig,
  options: CompileOptions,
): { html: string; plainText: string } {
  const ctx = createContext(state, brand, options.assetBaseUrl)
  const html = renderTemplate(ctx, state.templateId)
  const plainText = htmlToPlainText(html)
  return { html, plainText }
}

export { getDefaultAssetBaseUrl } from '../lib/assetBaseUrl'