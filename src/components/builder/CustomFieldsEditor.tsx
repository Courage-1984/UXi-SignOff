import type { ReactNode } from 'react'
import { CUSTOM_FIELD_PRESETS, createPresetField } from '../../config/customFieldPresets'
import type { CustomField, SignatureFormState } from '../../types/signature'
import { BuilderSection } from './BuilderSection'

const inputClass =
  'w-full rounded-md border border-ctp-surface1 bg-ctp-mantle px-3 py-2 text-sm text-ctp-text'

interface Props {
  state: SignatureFormState
  onChange: (state: SignatureFormState) => void
}

export function CustomFieldsEditor({ state, onChange }: Props) {
  const fields = state.customFields

  const update = (id: string, patch: Partial<CustomField>) => {
    onChange({
      ...state,
      customFields: fields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    })
  }

  const remove = (id: string) => onChange({ ...state, customFields: fields.filter((f) => f.id !== id) })

  const move = (id: string, dir: -1 | 1) => {
    const idx = fields.findIndex((f) => f.id === id)
    const next = idx + dir
    if (next < 0 || next >= fields.length) return
    const copy = [...fields]
    ;[copy[idx], copy[next]] = [copy[next]!, copy[idx]!]
    onChange({ ...state, customFields: copy })
  }

  return (
    <BuilderSection sectionId="custom-fields" title="Custom fields">
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1">
          {CUSTOM_FIELD_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              className="rounded border border-ctp-surface1 px-2 py-1 text-xs text-ctp-text"
              onClick={() => onChange({ ...state, customFields: [...fields, createPresetField(p)] })}
            >
              + {p.label}
            </button>
          ))}
        </div>
        {fields.map((f) => (
          <div key={f.id} className="rounded border border-ctp-surface0 p-2">
            <FieldRow>
              <button type="button" className="text-xs" onClick={() => move(f.id, -1)}>
                ↑
              </button>
              <button type="button" className="text-xs" onClick={() => move(f.id, 1)}>
                ↓
              </button>
              <label className="flex items-center gap-1 text-xs text-ctp-text">
                <input type="checkbox" checked={f.visible} onChange={(e) => update(f.id, { visible: e.target.checked })} />
                Show
              </label>
              <button type="button" className="ml-auto text-xs text-ctp-red" onClick={() => remove(f.id)}>
                Remove
              </button>
            </FieldRow>
            <input className={`${inputClass} mt-1`} placeholder="Label" value={f.label} onChange={(e) => update(f.id, { label: e.target.value })} />
            <input className={`${inputClass} mt-1`} placeholder="Value" value={f.value} onChange={(e) => update(f.id, { value: e.target.value })} />
            <select className={`${inputClass} mt-1`} value={f.type} onChange={(e) => update(f.id, { type: e.target.value as CustomField['type'] })}>
              <option value="text">Text</option>
              <option value="url">URL</option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
            </select>
            {f.type === 'url' && (
              <input className={`${inputClass} mt-1`} placeholder="Custom href" value={f.href ?? ''} onChange={(e) => update(f.id, { href: e.target.value })} />
            )}
          </div>
        ))}
      </div>
    </BuilderSection>
  )
}

function FieldRow({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-2">{children}</div>
}