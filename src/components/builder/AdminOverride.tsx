import type { BrandPalette } from '../../types/brand'
import type { PaletteOverride } from '../../types/signature'

const FIELDS: { key: keyof BrandPalette; label: string }[] = [
  { key: 'primary', label: 'Primary' },
  { key: 'accent', label: 'Accent' },
  { key: 'divider', label: 'Divider' },
  { key: 'textPrimary', label: 'Text' },
  { key: 'textMuted', label: 'Muted text' },
  { key: 'buttonBg', label: 'Button background' },
  { key: 'buttonText', label: 'Button text' },
]

interface AdminOverrideProps {
  value: PaletteOverride
  defaults: BrandPalette
  onChange: (value: PaletteOverride) => void
}

export function AdminOverride({ value, defaults, onChange }: AdminOverrideProps) {
  return (
    <details className="rounded-lg border border-dashed border-gray-300 bg-gray-50">
      <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-gray-700">
        Brand admin override (testing)
      </summary>
      <div className="space-y-3 border-t border-gray-200 px-3 py-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={value.enabled}
            onChange={(e) => onChange({ ...value, enabled: e.target.checked })}
          />
          Apply custom palette in preview &amp; export
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          {FIELDS.map(({ key, label }) => (
            <label key={key} className="block text-xs">
              <span className="text-gray-500">{label}</span>
              <input
                type="color"
                className="mt-1 h-9 w-full cursor-pointer rounded border border-gray-300"
                value={value.palette[key] ?? defaults[key]}
                disabled={!value.enabled}
                onChange={(e) =>
                  onChange({
                    ...value,
                    palette: { ...value.palette, [key]: e.target.value },
                  })
                }
              />
            </label>
          ))}
        </div>
      </div>
    </details>
  )
}