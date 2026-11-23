import type { CompileContext } from '../context'
import { renderCustomFieldRows } from './customFields'
import { contactLinkStyle, plainTextSpan } from '../utils/autolink'
import { escapeHtml, inlineStyle, presentationTable } from '../utils/html'
import { normalizeHref, normalizeTelHref } from '../utils/urls'

function densityMetrics(ctx: CompileContext) {
  const rowPad =
    ctx.state.spacing.density === 'tight' ? '1px 0' : ctx.state.spacing.density === 'relaxed' ? '4px 0' : '2px 0'
  const lineHeight =
    ctx.state.spacing.density === 'tight' ? '18px' : ctx.state.spacing.density === 'relaxed' ? '22px' : '20px'
  return { rowPad, lineHeight }
}

function contactLine(
  label: string,
  value: string,
  innerHtml: string,
  ctx: CompileContext,
): string {
  if (!value.trim()) return ''
  const { rowPad, lineHeight } = densityMetrics(ctx)
  return `<tr><td style="${inlineStyle({
    'font-family': ctx.fontFamily,
    'font-size': '13px',
    'line-height': lineHeight,
    color: ctx.palette.textPrimary,
    padding: rowPad,
  })}">${escapeHtml(label)}${label ? ': ' : ''}${innerHtml}</td></tr>`
}

export function renderIdentityBlock(ctx: CompileContext): string {
  const { identity } = ctx.state
  const { palette, fontFamily } = ctx
  const { rowPad, lineHeight } = densityMetrics(ctx)
  const baseText = inlineStyle({
    'font-family': fontFamily,
    'font-size': '13px',
    'line-height': lineHeight,
    color: palette.textPrimary,
  })
  const muted = inlineStyle({
    'font-family': fontFamily,
    'font-size': '12px',
    'line-height': lineHeight,
    color: palette.textMuted,
  })
  const linkStyle = contactLinkStyle(palette, fontFamily)

  const rows: string[] = []
  if (identity.fullName) {
    rows.push(
      `<tr><td style="${inlineStyle({
        'font-family': fontFamily,
        'font-size': '16px',
        'line-height': '22px',
        'font-weight': 'bold',
        color: palette.textPrimary,
        padding: '0 0 4px 0',
      })}">${escapeHtml(identity.fullName)}</td></tr>`,
    )
  }
  if (identity.jobTitle) {
    rows.push(`<tr><td style="${baseText}">${escapeHtml(identity.jobTitle)}</td></tr>`)
  }
  if (identity.department) {
    rows.push(`<tr><td style="${muted}">${escapeHtml(identity.department)}</td></tr>`)
  }
  if (identity.tagline) {
    rows.push(`<tr><td style="${muted}"><em>${escapeHtml(identity.tagline)}</em></td></tr>`)
  }

  if (ctx.state.templateId === 'modern-minimal') {
    const parts: string[] = []
    if (identity.mobile) parts.push(identity.mobile)
    if (identity.email) parts.push(identity.email)
    if (identity.website) parts.push(identity.website.replace(/^https?:\/\//, ''))
    if (parts.length) {
      rows.push(
        `<tr><td style="${inlineStyle({
          'font-family': fontFamily,
          'font-size': '12px',
          'line-height': lineHeight,
          color: palette.textMuted,
          padding: rowPad,
        })}">${escapeHtml(parts.join(' | '))}</td></tr>`,
      )
    }
  } else {
    if (identity.mobile) {
      const href = normalizeTelHref(identity.mobile)
      rows.push(
        contactLine(
          'Mobile',
          identity.mobile,
          `<a href="${escapeHtml(href)}" style="${linkStyle}"><span style="${linkStyle}">${escapeHtml(identity.mobile)}</span></a>`,
          ctx,
        ),
      )
    }
    if (identity.email) {
      rows.push(
        contactLine(
          'Email',
          identity.email,
          `<a href="mailto:${escapeHtml(identity.email)}" style="${linkStyle}"><span style="${linkStyle}">${escapeHtml(identity.email)}</span></a>`,
          ctx,
        ),
      )
    }
    if (identity.website) {
      const href = normalizeHref(identity.website)
      const display = identity.website.replace(/^https?:\/\//, '')
      rows.push(
        contactLine(
          'Web',
          display,
          `<a href="${escapeHtml(href)}" style="${linkStyle}"><span style="${linkStyle}">${escapeHtml(display)}</span></a>`,
          ctx,
        ),
      )
    }
  }

  if (identity.address) {
    rows.push(
      contactLine('', identity.address, plainTextSpan(identity.address, palette, fontFamily), ctx),
    )
  }

  rows.push(renderCustomFieldRows(ctx))
  const filtered = rows.filter(Boolean).join('')
  if (!filtered) return ''

  return `${presentationTable()}<tr><td>${presentationTable()}${filtered}</table></td></tr></table>`
}