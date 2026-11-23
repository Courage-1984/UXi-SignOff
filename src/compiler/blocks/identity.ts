import type { CompileContext } from '../context'
import { renderCustomFieldRows } from './customFields'
import { contactLinkStyle, plainTextSpan } from '../utils/autolink'
import { escapeHtml, inlineStyle, presentationTable } from '../utils/html'
import { normalizeHref, normalizeTelHref, resolveDecorationUrl } from '../utils/urls'

function densityMetrics(ctx: CompileContext) {
  const rowPad =
    ctx.state.spacing.density === 'tight' ? '1px 0' : ctx.state.spacing.density === 'relaxed' ? '4px 0' : '2px 0'
  const lineHeight =
    ctx.state.spacing.density === 'tight' ? '18px' : ctx.state.spacing.density === 'relaxed' ? '22px' : '20px'
  return { rowPad, lineHeight }
}

function templateUsesPrefixLabels(templateId: string): boolean {
  return templateId === 'headshot-affiliate'
}

function templateIsPanel(templateId: string): boolean {
  return templateId === 'panel-split'
}

function contactLine(
  label: string,
  value: string,
  innerHtml: string,
  ctx: CompileContext,
  colors: { primary: string },
): string {
  if (!value.trim()) return ''
  const { rowPad, lineHeight } = densityMetrics(ctx)
  return `<tr><td style="${inlineStyle({
    'font-family': ctx.fontFamily,
    'font-size': '13px',
    'line-height': lineHeight,
    color: colors.primary,
    padding: rowPad,
  })}">${escapeHtml(label)}${label ? ': ' : ''}${innerHtml}</td></tr>`
}

function prefixedContactLine(
  prefix: string,
  innerHtml: string,
  ctx: CompileContext,
  colors: { primary: string; accent: string },
): string {
  const { rowPad, lineHeight } = densityMetrics(ctx)
  const prefixStyle = inlineStyle({ color: colors.accent, 'font-weight': 'bold' })
  const bodyStyle = inlineStyle({ color: colors.primary })
  return `<tr><td style="${inlineStyle({
    'font-family': ctx.fontFamily,
    'font-size': '13px',
    'line-height': lineHeight,
    padding: rowPad,
  })}"><span style="${prefixStyle}">${escapeHtml(prefix)}</span> <span style="${bodyStyle}">${innerHtml}</span></td></tr>`
}

function iconLabeledRow(ctx: CompileContext, iconFile: string | undefined, text: string, light: boolean): string {
  if (!text.trim()) return ''
  const { rowPad, lineHeight } = densityMetrics(ctx)
  const color = light ? '#ffffff' : ctx.palette.textPrimary
  let iconCell = ''
  if (iconFile) {
    const src = resolveDecorationUrl(ctx.assetBaseUrl, ctx.brand.id, iconFile)
    iconCell = `<img src="${escapeHtml(src)}" width="28" height="28" alt="" style="${inlineStyle({
      display: 'inline-block',
      border: '0',
      width: '28px',
      height: '28px',
      'vertical-align': 'middle',
      'margin-right': '8px',
    })}" />`
  }
  return `<tr><td style="${inlineStyle({
    'font-family': ctx.fontFamily,
    'font-size': '13px',
    'line-height': lineHeight,
    color,
    padding: rowPad,
  })}">${iconCell}${escapeHtml(text)}</td></tr>`
}

export function renderIdentityBlock(ctx: CompileContext): string {
  const { identity } = ctx.state
  const { palette, fontFamily } = ctx
  const templateId = ctx.state.templateId
  const panel = templateIsPanel(templateId)
  const prefixMode = templateUsesPrefixLabels(templateId)
  const promo = templateId === 'logo-promo-stack'
  const conference = templateId === 'conference-hero'

  const primary = panel ? '#ffffff' : palette.textPrimary
  const muted = panel ? '#e2e8f0' : palette.textMuted
  const nameSize = promo ? '18px' : conference ? '15px' : panel ? '20px' : '16px'
  const nameColor = promo ? palette.accent : primary

  const { rowPad, lineHeight } = densityMetrics(ctx)
  const baseText = inlineStyle({
    'font-family': fontFamily,
    'font-size': conference ? '12px' : '13px',
    'line-height': lineHeight,
    color: primary,
  })
  const mutedStyle = inlineStyle({
    'font-family': fontFamily,
    'font-size': '12px',
    'line-height': lineHeight,
    color: muted,
  })
  const linkStyle = contactLinkStyle(
    panel ? { ...palette, textPrimary: '#ffffff' } : palette,
    fontFamily,
  )
  const accentLink = contactLinkStyle(palette, fontFamily)

  const rows: string[] = []
  if (identity.fullName) {
    rows.push(
      `<tr><td style="${inlineStyle({
        'font-family': fontFamily,
        'font-size': nameSize,
        'line-height': '24px',
        'font-weight': 'bold',
        color: nameColor,
        padding: '0 0 4px 0',
      })}">${escapeHtml(identity.fullName)}</td></tr>`,
    )
  }
  if (identity.jobTitle) {
    if (panel && ctx.brand.decorations?.contactIcons?.role) {
      rows.push(iconLabeledRow(ctx, ctx.brand.decorations.contactIcons.role, identity.jobTitle, true))
    } else {
      rows.push(`<tr><td style="${baseText}">${escapeHtml(identity.jobTitle)}</td></tr>`)
    }
  }
  if (!promo && identity.department) {
    rows.push(`<tr><td style="${mutedStyle}">${escapeHtml(identity.department)}</td></tr>`)
  }
  if (!promo && identity.tagline) {
    rows.push(`<tr><td style="${mutedStyle}"><em>${escapeHtml(identity.tagline)}</em></td></tr>`)
  }

  if (promo && identity.address) {
    rows.push(
      contactLine('', identity.address, plainTextSpan(identity.address, { ...palette, textMuted: muted }, fontFamily), ctx, {
        primary,
      }),
    )
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
          color: muted,
          padding: rowPad,
        })}">${escapeHtml(parts.join(' | '))}</td></tr>`,
      )
    }
  } else if (prefixMode) {
    if (identity.website) {
      const href = normalizeHref(identity.website)
      const display = identity.website.replace(/^https?:\/\//, '')
      rows.push(
        prefixedContactLine(
          'w:',
          `<a href="${escapeHtml(href)}" style="${accentLink}"><span style="${accentLink}">${escapeHtml(display)}</span></a>`,
          ctx,
          { primary, accent: palette.accent },
        ),
      )
    }
    if (identity.email) {
      rows.push(
        prefixedContactLine(
          'e:',
          `<a href="mailto:${escapeHtml(identity.email)}" style="${accentLink}"><span style="${accentLink}">${escapeHtml(identity.email)}</span></a>`,
          ctx,
          { primary, accent: palette.accent },
        ),
      )
    }
    if (identity.mobile) {
      const href = normalizeTelHref(identity.mobile)
      rows.push(
        prefixedContactLine(
          'm:',
          `<a href="${escapeHtml(href)}" style="${accentLink}"><span style="${accentLink}">${escapeHtml(identity.mobile)}</span></a>`,
          ctx,
          { primary, accent: palette.accent },
        ),
      )
    }
  } else {
    if (identity.mobile) {
      const href = normalizeTelHref(identity.mobile)
      if (panel && ctx.brand.decorations?.contactIcons?.phone) {
        const link = `<a href="${escapeHtml(href)}" style="${linkStyle}"><span style="${linkStyle}">${escapeHtml(identity.mobile)}</span></a>`
        rows.push(
          `<tr><td style="${inlineStyle({
            'font-family': fontFamily,
            'font-size': '13px',
            'line-height': lineHeight,
            color: primary,
            padding: rowPad,
          })}">${renderDecorationImgInline(ctx, ctx.brand.decorations.contactIcons.phone)} ${link}</td></tr>`,
        )
      } else {
        rows.push(
          contactLine(
            panel ? '' : 'Mobile',
            identity.mobile,
            `<a href="${escapeHtml(href)}" style="${linkStyle}"><span style="${linkStyle}">${escapeHtml(identity.mobile)}</span></a>`,
            ctx,
            { primary },
          ),
        )
      }
    }
    if (identity.email) {
      rows.push(
        contactLine(
          panel ? '' : 'Email',
          identity.email,
          `<a href="mailto:${escapeHtml(identity.email)}" style="${linkStyle}"><span style="${linkStyle}">${escapeHtml(identity.email)}</span></a>`,
          ctx,
          { primary },
        ),
      )
    }
    if (identity.website && !panel) {
      const href = normalizeHref(identity.website)
      const display = identity.website.replace(/^https?:\/\//, '')
      rows.push(
        contactLine(
          'Web',
          display,
          `<a href="${escapeHtml(href)}" style="${linkStyle}"><span style="${linkStyle}">${escapeHtml(display)}</span></a>`,
          ctx,
          { primary },
        ),
      )
    }
    if (panel && identity.email) {
      rows.push(
        contactLine(
          '',
          identity.email,
          `<a href="mailto:${escapeHtml(identity.email)}" style="${linkStyle}"><span style="${linkStyle}">${escapeHtml(identity.email)}</span></a>`,
          ctx,
          { primary },
        ),
      )
    }
  }

  if (identity.address && !promo) {
    rows.push(contactLine('', identity.address, plainTextSpan(identity.address, { ...palette, textMuted: muted }, fontFamily), ctx, { primary }))
  }

  rows.push(renderCustomFieldRows(ctx))
  const filtered = rows.filter(Boolean).join('')
  if (!filtered) return ''

  return `${presentationTable()}<tr><td>${presentationTable()}${filtered}</table></td></tr></table>`
}

function renderDecorationImgInline(ctx: CompileContext, file: string): string {
  const src = resolveDecorationUrl(ctx.assetBaseUrl, ctx.brand.id, file)
  return `<img src="${escapeHtml(src)}" width="28" height="28" alt="" style="${inlineStyle({
    display: 'inline-block',
    border: '0',
    width: '28px',
    height: '28px',
    'vertical-align': 'middle',
    'margin-right': '8px',
  })}" />`
}