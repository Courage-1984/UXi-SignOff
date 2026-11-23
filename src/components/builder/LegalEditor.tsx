import type { BrandConfig } from '../../types/brand'
import type { SignatureFormState } from '../../types/signature'

const inputClass =
  'w-full rounded-md border border-ctp-surface1 bg-ctp-mantle px-3 py-2 text-sm text-ctp-text'

interface Props {
  brand: BrandConfig
  state: SignatureFormState
  onChange: (state: SignatureFormState) => void
}

export function LegalEditor({ brand, state, onChange }: Props) {
  const locked = brand.legalDisclaimer.locked && !state.legal.unlockedOverride
  const setLegal = (patch: Partial<SignatureFormState['legal']>) =>
    onChange({ ...state, legal: { ...state.legal, ...patch } })

  return (
    <details className="rounded-lg border border-ctp-surface0 bg-ctp-base" open>
      <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-ctp-text">Legal disclaimer</summary>
      <div className="space-y-2 border-t border-ctp-surface0 px-3 py-3">
        {brand.legalDisclaimer.locked && (
          <p className="text-xs text-ctp-yellow">Brand standard legal text. Unlock to edit locally.</p>
        )}
        {brand.legalDisclaimer.locked && (
          <label className="flex items-center gap-2 text-sm text-ctp-text">
            <input type="checkbox" checked={state.legal.unlockedOverride} onChange={(e) => setLegal({ unlockedOverride: e.target.checked })} />
            Unlock to edit
          </label>
        )}
        <textarea
          className={`${inputClass} min-h-[80px]`}
          disabled={locked}
          value={state.legal.text}
          onChange={(e) => setLegal({ text: e.target.value })}
        />
        <button
          type="button"
          className="text-xs text-ctp-accent"
          onClick={() => setLegal({ text: brand.legalDisclaimer.text })}
        >
          Reset disclaimer to brand default
        </button>
        <label className="block text-xs text-ctp-subtext0">
          Font size
          <select
            className={`${inputClass} mt-1`}
            value={state.legal.fontSizePx}
            onChange={(e) => setLegal({ fontSizePx: Number(e.target.value) })}
          >
            {[10, 11, 12].map((n) => (
              <option key={n} value={n}>
                {n}px
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-ctp-text">
          <input type="checkbox" checked={state.legal.showDivider} onChange={(e) => setLegal({ showDivider: e.target.checked })} />
          Top divider line
        </label>
      </div>
    </details>
  )
}