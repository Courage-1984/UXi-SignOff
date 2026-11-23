import type { SignatureFormState, SpacingSettings, TextDensity } from '../../types/signature'

const inputClass =
  'w-full rounded-md border border-ctp-surface1 bg-ctp-mantle px-3 py-2 text-sm text-ctp-text'

interface Props {
  state: SignatureFormState
  onChange: (state: SignatureFormState) => void
}

export function LayoutSpacingPanel({ state, onChange }: Props) {
  const setSpacing = (partial: Partial<SpacingSettings>) =>
    onChange({ ...state, spacing: { ...state.spacing, ...partial, divider: { ...state.spacing.divider, ...partial.divider } } })

  const preset = (density: TextDensity, blockGap: number) =>
    onChange({
      ...state,
      spacing: { ...state.spacing, density, blockGapPx: blockGap },
    })

  return (
    <section className="space-y-3 rounded-lg border border-ctp-surface0 bg-ctp-base p-3">
      <h2 className="text-xs font-medium uppercase tracking-wide text-ctp-subtext0">Layout &amp; spacing</h2>
      <label className="block text-xs text-ctp-subtext0">
        Flow direction
        <select
          className={`${inputClass} mt-1`}
          value={state.layout.primaryFlow}
          onChange={(e) =>
            onChange({ ...state, layout: { ...state.layout, primaryFlow: e.target.value as SignatureFormState['layout']['primaryFlow'] } })
          }
        >
          <option value="row">Row — logo left</option>
          <option value="row-reverse">Row reverse — logo right</option>
          <option value="column">Column — logo top</option>
          <option value="column-reverse">Column reverse — logo bottom</option>
        </select>
      </label>
      <label className="block text-xs text-ctp-subtext0">
        Vertical align
        <select
          className={`${inputClass} mt-1`}
          value={state.layout.blockAlign}
          onChange={(e) =>
            onChange({ ...state, layout: { ...state.layout, blockAlign: e.target.value as SignatureFormState['layout']['blockAlign'] } })
          }
        >
          <option value="top">Top</option>
          <option value="middle">Middle</option>
          <option value="bottom">Bottom</option>
        </select>
      </label>
      <DensityPresets preset={preset} />
      <Slider label="Outer padding (px)" value={state.spacing.outerPaddingPx} max={24} onChange={(v) => setSpacing({ outerPaddingPx: v })} />
      <Slider label="Column gap (px)" value={state.spacing.columnGapPx} max={32} onChange={(v) => setSpacing({ columnGapPx: v })} />
      <Slider label="Block gap (px)" value={state.spacing.blockGapPx} max={24} onChange={(v) => setSpacing({ blockGapPx: v })} />
      <label className="flex items-center gap-2 text-sm text-ctp-text">
        <input
          type="checkbox"
          checked={state.spacing.divider.visible}
          onChange={(e) => setSpacing({ divider: { ...state.spacing.divider, visible: e.target.checked } })}
        />
        Show divider
      </label>
      <Slider label="Divider thickness" value={state.spacing.divider.thicknessPx} max={4} onChange={(v) => setSpacing({ divider: { ...state.spacing.divider, thicknessPx: v } })} />
      <label className="block text-xs text-ctp-subtext0">
        Divider style
        <select
          className={`${inputClass} mt-1`}
          value={state.spacing.divider.style}
          onChange={(e) =>
            setSpacing({
              divider: { ...state.spacing.divider, style: e.target.value as SpacingSettings['divider']['style'] },
            })
          }
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
      </label>
      <label className="block text-xs text-ctp-subtext0">
        Divider orientation
        <select
          className={`${inputClass} mt-1`}
          value={state.spacing.divider.orientation}
          onChange={(e) =>
            setSpacing({
              divider: {
                ...state.spacing.divider,
                orientation: e.target.value as SpacingSettings['divider']['orientation'],
              },
            })
          }
        >
          <option value="vertical">Vertical</option>
          <option value="horizontal">Horizontal</option>
        </select>
      </label>
    </section>
  )
}

function Slider({ label, value, max, onChange }: { label: string; value: number; max: number; onChange: (v: number) => void }) {
  return (
    <label className="block text-xs text-ctp-subtext0">
      {label}: {value}
      <input type="range" min={0} max={max} value={value} className="mt-1 w-full" onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  )
}

function DensityPresets({ preset }: { preset: (d: TextDensity, g: number) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {[
        { id: 'compact' as const, d: 'tight' as TextDensity, g: 4 },
        { id: 'balanced' as const, d: 'normal' as TextDensity, g: 8 },
        { id: 'airy' as const, d: 'relaxed' as TextDensity, g: 12 },
      ].map((p) => (
        <button
          key={p.id}
          type="button"
          className="rounded-md border border-ctp-surface1 bg-ctp-mantle px-2 py-1 text-xs capitalize text-ctp-text"
          onClick={() => preset(p.d, p.g)}
        >
          {p.id}
        </button>
      ))}
    </div>
  )
}