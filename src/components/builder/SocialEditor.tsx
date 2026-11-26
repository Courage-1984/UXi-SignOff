import type { SignatureFormState } from '../../types/signature'
import { SOCIAL_ICON_VARIANTS } from '../../config/socialIconVariants'
import { BuilderSection } from './BuilderSection'

const inputClass =
  'w-full rounded-md border border-ctp-surface1 bg-ctp-mantle px-3 py-2 text-sm text-ctp-text'

const NETWORKS = ['linkedin', 'facebook', 'instagram', 'whatsapp', 'x', 'youtube', 'tiktok'] as const

interface Props {
  state: SignatureFormState
  onChange: (state: SignatureFormState) => void
}

export function SocialEditor({ state, onChange }: Props) {
  const { social } = state
  return (
    <BuilderSection sectionId="social" title="Social links">
      <div className="space-y-2">
        <FieldSelect
          label="Display mode"
          value={social.displayMode}
          options={[
            ['icons', 'Icons only'],
            ['text', 'Text links'],
            ['icon-label', 'Icon + label'],
          ]}
          onChange={(displayMode) => onChange({ ...state, social: { ...social, displayMode: displayMode as typeof social.displayMode } })}
        />
        <FieldSelect
          label="Icon style"
          value={social.iconVariant}
          options={SOCIAL_ICON_VARIANTS.map((v) => [v.id, v.label] as [string, string])}
          onChange={(iconVariant) => onChange({ ...state, social: { ...social, iconVariant: iconVariant as typeof social.iconVariant } })}
        />
        <div className="grid gap-2 sm:grid-cols-2">
          <FieldSelect
            label="Direction"
            value={social.layout.direction}
            options={[
              ['row', 'Row'],
              ['column', 'Column'],
            ]}
            onChange={(v) =>
              onChange({ ...state, social: { ...social, layout: { ...social.layout, direction: v as 'row' | 'column' } } })
            }
          />
          <FieldSelect
            label="Align"
            value={social.layout.align}
            options={[
              ['left', 'Left'],
              ['center', 'Center'],
              ['right', 'Right'],
            ]}
            onChange={(v) =>
              onChange({ ...state, social: { ...social, layout: { ...social.layout, align: v as 'left' | 'center' | 'right' } } })
            }
          />
        </div>
        <FieldSelect
          label="Separator (text mode)"
          value={social.separator}
          options={[
            ['pipe', '|'],
            ['bullet', '•'],
            ['slash', '/'],
          ]}
          onChange={(separator) => onChange({ ...state, social: { ...social, separator: separator as typeof social.separator } })}
        />
        {NETWORKS.map((key) => (
          <SocialRow
            key={key}
            label={key}
            enabled={social[key].enabled}
            url={social[key].url}
            onEnabled={(en) => onChange({ ...state, social: { ...social, [key]: { ...social[key], enabled: en } } })}
            onUrl={(url) => onChange({ ...state, social: { ...social, [key]: { ...social[key], url } } })}
          />
        ))}
        <SocialRow
          label="Website (globe)"
          enabled={social.websiteGlobe.enabled}
          url={social.websiteGlobe.url}
          onEnabled={(en) => onChange({ ...state, social: { ...social, websiteGlobe: { ...social.websiteGlobe, enabled: en } } })}
          onUrl={(url) => onChange({ ...state, social: { ...social, websiteGlobe: { ...social.websiteGlobe, url } } })}
        />
      </div>
    </BuilderSection>
  )
}

function FieldSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: [string, string][]
  onChange: (v: string) => void
}) {
  return (
    <label className="block text-xs text-ctp-subtext0">
      {label}
      <select className={`${inputClass} mt-1`} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  )
}

function SocialRow({
  label,
  enabled,
  url,
  onEnabled,
  onUrl,
}: {
  label: string
  enabled: boolean
  url: string
  onEnabled: (v: boolean) => void
  onUrl: (v: string) => void
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-[auto_1fr] sm:items-center">
      <label className="flex items-center gap-2 text-sm capitalize text-ctp-text">
        <input type="checkbox" checked={enabled} onChange={(e) => onEnabled(e.target.checked)} />
        {label}
      </label>
      <input className={inputClass} disabled={!enabled} value={url} placeholder="https://" onChange={(e) => onUrl(e.target.value)} />
    </div>
  )
}