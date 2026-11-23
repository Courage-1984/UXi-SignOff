import type { BrandConfig } from '../../types/brand'
import type { SignatureFormState } from '../../types/signature'

interface Props {
  brand: BrandConfig
  state: SignatureFormState
  onChange: (state: SignatureFormState) => void
}

export function LogoControls({ brand, state, onChange }: Props) {
  const logo = brand.logos.find((l) => l.id === state.logoId) ?? brand.logos[0]
  return (
    <details className="rounded-lg border border-ctp-surface0 bg-ctp-base">
      <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-ctp-text">Logo &amp; headshot</summary>
      <div className="space-y-2 border-t border-ctp-surface0 px-3 py-3">
        <label className="block text-xs text-ctp-subtext0">
          Logo asset
          <select
            className="mt-1 w-full rounded-md border border-ctp-surface1 bg-ctp-mantle px-2 py-1 text-sm"
            value={state.logoId}
            onChange={(e) => onChange({ ...state, logoId: e.target.value })}
          >
            {brand.logos.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs text-ctp-subtext0">
          Max width: {state.logoRender.maxWidthPx}px
          <input
            type="range"
            min={60}
            max={240}
            value={state.logoRender.maxWidthPx}
            onChange={(e) =>
              onChange({
                ...state,
                logoRender: { ...state.logoRender, maxWidthPx: Number(e.target.value) },
              })
            }
            className="w-full"
          />
        </label>
        <label className="block text-xs text-ctp-subtext0">
          Dark mode backing
          <select
            className="mt-1 w-full rounded-md border border-ctp-surface1 bg-ctp-mantle px-2 py-1 text-sm"
            value={state.logoRender.backingMode}
            onChange={(e) =>
              onChange({
                ...state,
                logoRender: {
                  ...state.logoRender,
                  backingMode: e.target.value as SignatureFormState['logoRender']['backingMode'],
                },
              })
            }
          >
            <option value="brand-default">Brand default</option>
            <option value="none">None</option>
            <option value="white-card">White card</option>
            <option value="rounded-box">Rounded box</option>
          </select>
        </label>
        {state.templateId === 'dual-visual' && (
          <>
            <label className="flex items-center gap-2 text-sm text-ctp-text">
              <input
                type="checkbox"
                checked={state.headshot.enabled}
                onChange={(e) => onChange({ ...state, headshot: { ...state.headshot, enabled: e.target.checked } })}
              />
              Show headshot
            </label>
            <input
              className="w-full rounded-md border border-ctp-surface1 bg-ctp-mantle px-2 py-1 text-sm"
              placeholder="/assets/qa/headshot-square.png"
              value={state.headshot.url}
              onChange={(e) => onChange({ ...state, headshot: { ...state.headshot, url: e.target.value } })}
            />
            <p className="mt-1 text-xs text-ctp-subtext0">Use path under /assets/… (resolved to HTTPS in copied HTML).</p>
          </>
        )}
        {logo && (
          <p className="text-xs text-ctp-subtext0">
            Natural: {logo.naturalWidth}×{logo.naturalHeight}px — display capped by slider.
          </p>
        )}
      </div>
    </details>
  )
}