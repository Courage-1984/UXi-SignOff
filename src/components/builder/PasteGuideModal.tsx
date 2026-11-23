import { useState } from 'react'
import { X } from 'lucide-react'

interface PasteGuideModalProps {
  open: boolean
  onClose: () => void
}

const TABS = ['Gmail', 'Outlook New/Web', 'Outlook Classic', 'Apple Mail', 'Mobile'] as const

const STEPS: Record<(typeof TABS)[number], string[]> = {
  Gmail: ['Settings → See all settings → General → Signature.', 'Create or edit a signature.', 'Click Copy Signature in UXi SignOff, then paste (Ctrl+V).', 'Save changes.'],
  'Outlook New/Web': ['Settings → Mail → Compose and reply → Email signature.', 'Paste with Copy Signature (recommended).', 'Save and send a test email.'],
  'Outlook Classic': ['File → Options → Mail → Signatures.', 'Paste rich signature into the editor.', 'Verify images load from HTTPS URLs.'],
  'Apple Mail': ['Prefer Copy Raw HTML for Preferences → Signatures, or paste rich from Outlook Web first.', 'Uncheck “Always match my default message font” if formatting breaks.'],
  Mobile: ['Copy on desktop, email the signature to your phone, or use Gmail app signature settings.', 'Keep logos under size limits for mobile clients.'],
}

export function PasteGuideModal({ open, onClose }: PasteGuideModalProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Gmail')
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ctp-overlay p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-ctp-surface0 bg-ctp-mantle p-6 shadow-xl">
        <div className="mb-4 flex justify-between gap-4">
          <h2 className="text-lg font-semibold text-ctp-text">How to paste your signature</h2>
          <button type="button" onClick={onClose} className="rounded p-1 text-ctp-subtext0" aria-label="Close"><X size={20} /></button>
        </div>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-ctp-green/40 bg-ctp-base p-3 text-sm">
            <h3 className="font-semibold text-ctp-text">Copy Signature (95% of users)</h3>
            <p className="mt-1 text-ctp-subtext0">Copies rendered HTML for Gmail, Outlook Web, New Outlook, and Classic Outlook desktop (Ctrl+V / Cmd+V).</p>
          </div>
          <div className="rounded-lg border border-ctp-yellow/40 bg-ctp-base p-3 text-sm">
            <h3 className="font-semibold text-ctp-text">Copy Raw HTML (IT / CRM)</h3>
            <p className="mt-1 text-ctp-subtext0">Source code for Apple Mail .mailsignature, Thunderbird HTML mode, HubSpot/Zoho, or M365 rules — do not paste raw into Gmail.</p>
          </div>
        </div>
        <div className="mb-3 flex flex-wrap gap-1">
          {TABS.map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className={`rounded px-2 py-1 text-xs ${tab === t ? 'bg-ctp-accent text-white' : 'bg-ctp-surface0 text-ctp-text'}`}>{t}</button>
          ))}
        </div>
        <ol className="list-inside list-decimal space-y-1 text-sm text-ctp-subtext1">{STEPS[tab].map((s) => <li key={s}>{s}</li>)}</ol>
      </div>
    </div>
  )
}