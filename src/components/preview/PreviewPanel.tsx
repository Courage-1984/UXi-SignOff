import type { ReactNode } from 'react'

interface PreviewPanelProps {
  html: string
  widthMode: 'desktop' | 'mobile'
  darkSurround: boolean
  onWidthModeChange: (mode: 'desktop' | 'mobile') => void
  onDarkSurroundChange: (dark: boolean) => void
}

export function PreviewPanel({
  html,
  widthMode,
  darkSurround,
  onWidthModeChange,
  onDarkSurroundChange,
}: PreviewPanelProps) {
  const previewWidth = widthMode === 'desktop' ? 640 : 360

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex flex-wrap gap-2">
        <ToggleGroup
          label="Preview width"
          options={[
            { id: 'desktop', label: 'Desktop' },
            { id: 'mobile', label: 'Mobile' },
          ]}
          value={widthMode}
          onChange={(v) => onWidthModeChange(v as 'desktop' | 'mobile')}
        />
        <ToggleGroup
          label="Background"
          options={[
            { id: 'light', label: 'Light' },
            { id: 'dark', label: 'Dark' },
          ]}
          value={darkSurround ? 'dark' : 'light'}
          onChange={(v) => onDarkSurroundChange(v === 'dark')}
        />
      </div>

      <div
        className={`flex-1 overflow-auto rounded-xl border p-4 transition-colors ${
          darkSurround ? 'border-gray-700 bg-[#1a1a1a]' : 'border-gray-200 bg-gray-100'
        }`}
      >
        <div
          className="mx-auto rounded-lg bg-white shadow-sm"
          style={{ width: previewWidth, maxWidth: '100%' }}
        >
          <div className="border-b border-gray-100 px-4 py-3 text-xs text-gray-500">
            <p>
              <span className="font-medium text-gray-700">From:</span> you@company.com
            </p>
            <p>
              <span className="font-medium text-gray-700">Subject:</span> Quick follow-up
            </p>
          </div>
          <div className="px-4 py-3 text-sm text-gray-800">
            <p className="mb-4">Hi there — thanks for your time today. Looking forward to next steps.</p>
            <div dangerouslySetInnerHTML={{ __html: html }} />
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
          className={`rounded-md px-2.5 py-1 text-xs font-medium ${
            value === o.id ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 ring-1 ring-gray-200'
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
      <span className="text-xs text-gray-500">{legend}</span>
      <div className="flex gap-1">{children}</div>
    </fieldset>
  )
}