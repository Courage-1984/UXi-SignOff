import type { BrandConfig } from '../../types/brand'
import { CUSTOM_BANNER_ID, NO_BANNER_ID } from '../../config/defaults'
import type { SignatureFormState } from '../../types/signature'
import { BuilderSection } from './BuilderSection'

interface ContentEditorProps {
  brand: BrandConfig
  state: SignatureFormState
  onChange: (state: SignatureFormState) => void
}

const inputClass =
  'w-full rounded-md border border-ctp-surface1 bg-ctp-mantle px-3 py-2 text-sm text-ctp-text'

export function ContentEditor({ brand, state, onChange }: ContentEditorProps) {
  const setIdentity = (field: keyof SignatureFormState['identity'], value: string) => {
    onChange({ ...state, identity: { ...state.identity, [field]: value } })
  }

  const patchCta = (buttons: SignatureFormState['cta']['buttons']) =>
    onChange({ ...state, cta: { ...state.cta, buttons } })

  const bannerActive = state.banner.bannerId !== NO_BANNER_ID

  return (
    <div className="space-y-4">
      <BuilderSection sectionId="identity" title="Identity & contact" defaultOpen>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Full name" value={state.identity.fullName} onChange={(v) => setIdentity('fullName', v)} />
          <Field label="Job title" value={state.identity.jobTitle} onChange={(v) => setIdentity('jobTitle', v)} />
          <Field label="Department" value={state.identity.department} onChange={(v) => setIdentity('department', v)} />
          <Field label="Mobile" value={state.identity.mobile} onChange={(v) => setIdentity('mobile', v)} />
          <Field label="Email" value={state.identity.email} onChange={(v) => setIdentity('email', v)} />
          <Field label="Website" value={state.identity.website} onChange={(v) => setIdentity('website', v)} />
          <Field label="Address" value={state.identity.address} onChange={(v) => setIdentity('address', v)} />
          <Field label="Tagline" value={state.identity.tagline} onChange={(v) => setIdentity('tagline', v)} />
        </div>
      </BuilderSection>

      <BuilderSection sectionId="cta" title="CTA buttons">
        <div className="mb-3 grid gap-2 sm:grid-cols-2">
          <label className="text-xs text-ctp-subtext0">
            Direction
            <select
              className={`${inputClass} mt-1`}
              value={state.cta.layout.direction}
              onChange={(e) =>
                onChange({
                  ...state,
                  cta: { ...state.cta, layout: { ...state.cta.layout, direction: e.target.value as 'row' | 'column' } },
                })
              }
            >
              <option value="row">Row</option>
              <option value="column">Column</option>
            </select>
          </label>
          <label className="text-xs text-ctp-subtext0">
            Align
            <select
              className={`${inputClass} mt-1`}
              value={state.cta.layout.align}
              onChange={(e) =>
                onChange({
                  ...state,
                  cta: { ...state.cta, layout: { ...state.cta.layout, align: e.target.value as 'left' | 'center' | 'right' } },
                })
              }
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>
        </div>
        {state.cta.buttons.map((btn, i) => (
          <div key={i} className="mb-3 rounded-lg border border-ctp-surface0 bg-ctp-mantle p-3">
            <label className="mb-2 flex items-center gap-2 text-sm text-ctp-text">
              <input
                type="checkbox"
                checked={btn.enabled}
                onChange={(e) => {
                  const buttons = [...state.cta.buttons]
                  buttons[i] = { ...btn, enabled: e.target.checked }
                  patchCta(buttons)
                }}
              />
              Enable button {i + 1}
            </label>
            <Field label="Label" value={btn.label} onChange={(v) => { const buttons = [...state.cta.buttons]; buttons[i] = { ...btn, label: v }; patchCta(buttons) }} />
            <Field label="URL" value={btn.url} onChange={(v) => { const buttons = [...state.cta.buttons]; buttons[i] = { ...btn, url: v }; patchCta(buttons) }} />
          </div>
        ))}
      </BuilderSection>

      <BuilderSection sectionId="banner" title="Campaign banner">
        <label className="block">
          <span className="mb-1 block text-xs text-ctp-subtext0">Banner</span>
          <select
            className={inputClass}
            value={state.banner.bannerId}
            onChange={(e) => {
              const id = e.target.value
              const banner = brand.banners.find((b) => b.id === id)
              onChange({
                ...state,
                banner: {
                  ...state.banner,
                  bannerId: id,
                  url: id === NO_BANNER_ID ? '' : banner?.defaultUrl ?? state.banner.url,
                  imageAlt: banner?.alt ?? state.banner.imageAlt,
                },
              })
            }}
          >
            <option value={NO_BANNER_ID}>No banner</option>
            <option value={CUSTOM_BANNER_ID}>Custom image URL</option>
            {brand.banners.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </label>
        {bannerActive && (
          <>
            <Field
              label="Image alt text"
              value={state.banner.imageAlt}
              onChange={(v) => onChange({ ...state, banner: { ...state.banner, imageAlt: v } })}
            />
            {state.banner.bannerId === CUSTOM_BANNER_ID && (
              <>
                <Field
                  label="Image URL (PNG, GIF, …)"
                  value={state.banner.customImageUrl}
                  onChange={(v) => onChange({ ...state, banner: { ...state.banner, customImageUrl: v } })}
                />
                <label className="mt-2 block text-xs text-ctp-subtext0">
                  Display width: {state.banner.customWidthPx}px
                  <input
                    type="range"
                    min={200}
                    max={600}
                    value={state.banner.customWidthPx}
                    onChange={(e) =>
                      onChange({
                        ...state,
                        banner: { ...state.banner, customWidthPx: Number(e.target.value) },
                      })
                    }
                    className="w-full"
                  />
                </label>
              </>
            )}
            <Field label="Destination URL" value={state.banner.url} onChange={(v) => onChange({ ...state, banner: { ...state.banner, url: v } })} />
            <label className="mt-2 flex items-center gap-2 text-sm text-ctp-text">
              <input
                type="checkbox"
                checked={state.banner.appendUtm}
                onChange={(e) => onChange({ ...state, banner: { ...state.banner, appendUtm: e.target.checked } })}
              />
              Append UTM parameters
            </label>
          </>
        )}
      </BuilderSection>
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-ctp-subtext0">{label}</span>
      <input className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}