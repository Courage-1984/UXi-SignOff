import type { ReactNode } from 'react'
import type { BrandConfig } from '../../types/brand'
import { NO_BANNER_ID } from '../../config/defaults'
import type { SignatureFormState } from '../../types/signature'

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

  return (
    <div className="space-y-4">
      <Accordion title="Identity & contact">
        <FieldGrid>
          <Field label="Full name" value={state.identity.fullName} onChange={(v) => setIdentity('fullName', v)} />
          <Field label="Job title" value={state.identity.jobTitle} onChange={(v) => setIdentity('jobTitle', v)} />
          <Field label="Department" value={state.identity.department} onChange={(v) => setIdentity('department', v)} />
          <Field label="Mobile" value={state.identity.mobile} onChange={(v) => setIdentity('mobile', v)} />
          <Field label="Email" value={state.identity.email} onChange={(v) => setIdentity('email', v)} />
          <Field label="Website" value={state.identity.website} onChange={(v) => setIdentity('website', v)} />
          <Field label="Address" value={state.identity.address} onChange={(v) => setIdentity('address', v)} />
          <Field label="Tagline" value={state.identity.tagline} onChange={(v) => setIdentity('tagline', v)} />
        </FieldGrid>
      </Accordion>

      <Accordion title="CTA buttons">
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
      </Accordion>

      <Accordion title="Campaign banner">
        <label className="block">
          <span className="mb-1 block text-xs text-ctp-subtext0">Banner</span>
          <select className={inputClass} value={state.banner.bannerId} onChange={(e) => {
            const id = e.target.value
            const banner = brand.banners.find((b) => b.id === id)
            onChange({
              ...state,
              banner: { ...state.banner, bannerId: id, url: id === NO_BANNER_ID ? '' : banner?.defaultUrl ?? state.banner.url },
            })
          }}>
            <option value={NO_BANNER_ID}>No banner</option>
            {brand.banners.map((b) => (
              <option key={b.id} value={b.id}>{b.label}</option>
            ))}
          </select>
        </label>
        {state.banner.bannerId !== NO_BANNER_ID && (
          <>
            <Field label="Destination URL" value={state.banner.url} onChange={(v) => onChange({ ...state, banner: { ...state.banner, url: v } })} />
            <label className="mt-2 flex items-center gap-2 text-sm text-ctp-text">
              <input type="checkbox" checked={state.banner.appendUtm} onChange={(e) => onChange({ ...state, banner: { ...state.banner, appendUtm: e.target.checked } })} />
              Append UTM parameters
            </label>
          </>
        )}
      </Accordion>
    </div>
  )
}

function Accordion({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="rounded-lg border border-ctp-surface0 bg-ctp-base open:shadow-sm" open>
      <summary className="cursor-pointer list-none px-3 py-2 text-sm font-medium text-ctp-text [&::-webkit-details-marker]:hidden">{title}</summary>
      <div className="border-t border-ctp-surface0 px-3 py-3">{children}</div>
    </details>
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

function FieldGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>
}