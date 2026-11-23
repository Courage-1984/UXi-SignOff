import type { LogoBackingMode } from '../types/signature'
import { computeDisplayDimensions } from '../lib/logoSizing'
import type { CompileContext } from './context'
import { escapeHtml, inlineStyle, presentationTable } from './utils/html'
import { resolveAssetUrl } from './utils/urls'

function resolveBacking(ctx: CompileContext, mode: LogoBackingMode) {
  const brandDefault = ctx.brand.logoBacking ?? { enabled: true, color: '#ffffff', padding: '4px' }
  if (mode === 'none') return { enabled: false, color: '#ffffff', padding: '0' }
  if (mode === 'white-card') return { enabled: true, color: '#ffffff', padding: '6px' }
  if (mode === 'rounded-box')
    return { enabled: true, color: '#ffffff', padding: '8px', rounded: true }
  return { ...brandDefault, rounded: false }
}

export function renderLogo(ctx: CompileContext): string {
  const logo = ctx.brand.logos.find((l) => l.id === ctx.state.logoId) ?? ctx.brand.logos[0]
  if (!logo) return ''

  const naturalW = logo.naturalWidth ?? logo.width * 2
  const naturalH = logo.naturalHeight ?? logo.height * 2
  const dims = computeDisplayDimensions(
    naturalW,
    naturalH,
    ctx.state.logoRender.maxWidthPx,
    ctx.state.logoRender.maxHeightPx,
  )

  const backing = resolveBacking(ctx, ctx.state.logoRender.backingMode)
  const src = resolveAssetUrl(ctx.assetBaseUrl, ctx.brand.id, logo.file)
  const imgStyle = inlineStyle({
    display: 'block',
    border: '0',
    outline: 'none',
    width: `${dims.width}px`,
    height: `${dims.height}px`,
    'max-width': `${dims.width}px`,
    '-ms-interpolation-mode': 'bicubic',
  })

  const img = `<img src="${escapeHtml(src)}" width="${dims.width}" height="${dims.height}" alt="${escapeHtml(logo.alt)}" style="${imgStyle}" />`

  const rounded = 'rounded' in backing && backing.rounded
  const cellStyle = backing.enabled
    ? inlineStyle({
        'background-color': backing.color,
        padding: backing.padding ?? '4px',
        ...(rounded ? { 'border-radius': '8px' } : {}),
      })
    : inlineStyle({ padding: '0' })

  const bgcolor = backing.enabled ? ` bgcolor="${escapeHtml(backing.color)}"` : ''

  return `${presentationTable()}<tr><td${bgcolor} style="${cellStyle}">${img}</td></tr></table>`
}