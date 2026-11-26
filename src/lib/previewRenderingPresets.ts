import type { CSSProperties } from 'react'

export type PreviewRenderingPreset =
  | 'unchangedLight'
  | 'darkChromeUnchanged'
  | 'partialInvert'
  | 'fullInvert'

export interface PreviewPresetDefinition {
  id: PreviewRenderingPreset
  shortLabel: string
  description: string
  surroundClass: string
  messageShellClass: string
  headerRowClass: string
  headerLabelClass: string
  bodyTextClass: string
  signatureWrapperClass: string
  signatureInlineStyle?: CSSProperties
}

export const PREVIEW_RENDERING_PRESETS: PreviewPresetDefinition[] = [
  {
    id: 'unchangedLight',
    shortLabel: 'Light',
    description: 'Light reading pane — message colors unchanged (many web clients).',
    surroundClass: 'border-gray-200 bg-gray-100',
    messageShellClass: 'bg-white shadow-sm',
    headerRowClass: 'border-gray-100 text-gray-500',
    headerLabelClass: 'text-gray-700',
    bodyTextClass: 'text-gray-800',
    signatureWrapperClass: '',
  },
  {
    id: 'darkChromeUnchanged',
    shortLabel: 'Dark UI',
    description: 'Dark app chrome; message unchanged (e.g. Gmail on the web).',
    surroundClass: 'border-gray-700 bg-[#1a1a1a]',
    messageShellClass: 'bg-white shadow-sm',
    headerRowClass: 'border-gray-100 text-gray-500',
    headerLabelClass: 'text-gray-700',
    bodyTextClass: 'text-gray-800',
    signatureWrapperClass: '',
  },
  {
    id: 'partialInvert',
    shortLabel: 'Partial',
    description: 'Approx. partial inversion — light backgrounds darkened (Outlook web, Gmail Android).',
    surroundClass: 'border-gray-700 bg-[#1a1a1a]',
    messageShellClass: 'bg-[#2d2d2d] shadow-sm',
    headerRowClass: 'border-gray-600 text-gray-400',
    headerLabelClass: 'text-gray-300',
    bodyTextClass: 'text-gray-200',
    signatureWrapperClass: 'preview-partial-invert',
    signatureInlineStyle: { filter: 'brightness(0.85) contrast(1.05)' },
  },
  {
    id: 'fullInvert',
    shortLabel: 'Full',
    description: 'Approx. full color inversion (e.g. Gmail iOS, Outlook for Windows).',
    surroundClass: 'border-gray-700 bg-[#1a1a1a]',
    messageShellClass: 'bg-[#121212] shadow-sm',
    headerRowClass: 'border-gray-600 text-gray-400',
    headerLabelClass: 'text-gray-300',
    bodyTextClass: 'text-gray-200',
    signatureWrapperClass: 'preview-full-invert',
    signatureInlineStyle: { filter: 'invert(1) hue-rotate(180deg)' },
  },
]

export function getPreviewPreset(id: PreviewRenderingPreset): PreviewPresetDefinition {
  return PREVIEW_RENDERING_PRESETS.find((p) => p.id === id) ?? PREVIEW_RENDERING_PRESETS[0]
}