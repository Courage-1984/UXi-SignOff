import type { ReactNode } from 'react'
import {
  PREVIEW_RENDERING_PRESETS,
  getPreviewPreset,
  type PreviewRenderingPreset,
} from '../../lib/previewRenderingPresets'

interface PreviewPanelProps {
  html: string
  widthMode: 'desktop' | 'mobile'
  renderingPreset: PreviewRenderingPreset
  onWidthModeChange: (mode: 'desktop' | 'mobile') => void
  onRenderingPresetChange: (preset: PreviewRenderingPreset) => void
}

export function PreviewPanel({
  html,
  widthMode,
  renderingPreset,
  onWidthModeChange,
  onRenderingPresetChange,
}: PreviewPanelProps) {
  const previewWidth = widthMode === 'desktop' ? 640 : 360
  const preset = getPreviewPreset(renderingPreset)

  return (
    <div className="flex max-w-full flex-col">
      <div className="mb-2 flex flex-wrap gap-2">
        <ToggleGroup
          label="Width"
          options={[
            { id: 'desktop', label: 'Desktop' },
            { id: 'mobile', label: 'Mobile' },
          ]}
          value={widthMode}
          onChange={(v) => onWidthModeChange(v as 'desktop' | 'mobile')}
        />
        <ToggleGroup
          label="Rendering"
          options={PREVIEW_RENDERING_PRESETS.map((p) => ({ id: p.id, label: p.shortLabel }))}
          value={renderingPreset}
          onChange={(v) => onRenderingPresetChange(v as PreviewRenderingPreset)}
        />
      </div>
      <p className="mb-2 text-[10px] leading-snug text-ctp-subtext0">
        Approximate client dark behavior — exported HTML is unchanged. Test in real inboxes. See{' '}
        <span className="text-ctp-accent">docs/EMAIL_CLIENT_DARK_MODE.md</span>.
      </p>
      <p className="mb-2 text-[10px] text-ctp-subtext1">{preset.description}</p>

      <div className={`rounded-xl border p-4 transition-colors ${preset.surroundClass}`}>
        <div
          className={`mx-auto rounded-lg ${preset.messageShellClass}`}
          style={{ width: previewWidth, maxWidth: '100%' }}
        >
          <div className={`border-b px-4 py-3 text-xs ${preset.headerRowClass}`}>
            <p>
              <span className={`font-medium ${preset.headerLabelClass}`}>From:</span> you@company.com
            </p>
            <p>
              <span className={`font-medium ${preset.headerLabelClass}`}>Subject:</span> Quick follow-up
            </p>
          </div>
          <div className={`px-4 py-3 text-sm ${preset.bodyTextClass}`}>
            <p className="mb-4">Hi there — thanks for your time today. Looking forward to next steps.</p>
            <div
              className={preset.signatureWrapperClass}
              style={preset.signatureInlineStyle}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function ToggleGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { id: string; label: string }[]
  value: string
  onChange: (id: string) => void
}) {
  return (
    <InlineFieldset legend={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-md px-2 py-1 text-[11px] font-medium ${
            value === o.id
              ? 'bg-indigo-600 text-white'
              : 'bg-ctp-base text-ctp-text ring-1 ring-ctp-surface1'
          }`}
        >
          {o.label}
        </button>
      ))}
    </InlineFieldset>
  )
}

function InlineFieldset({
  legend,
  children,
}: {
  legend: string
  children: ReactNode
}) {
  return (
    <fieldset className="flex items-center gap-2">
      <span className="text-[11px] text-ctp-subtext0">{legend}</span>
      <div className="flex flex-wrap gap-1">{children}</div>
    </fieldset>
  )
}