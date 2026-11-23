import { useMemo, useState, type ReactNode } from 'react'
import { BookOpen, Copy, FileCode2, Moon, Redo2, RotateCcw, Share2, Sun, Undo2 } from 'lucide-react'
import { getBrandById } from './config/brands'
import { compileSignatureHtml, getDefaultAssetBaseUrl } from './compiler/compileSignature'
import { useBuilderTheme } from './hooks/useBuilderTheme'
import { useSignatureState } from './hooks/useSignatureState'
import { copyRawHtml, copyRichHtml } from './lib/clipboard'
import { saveProfile, listProfiles, loadProfile, deleteProfile } from './lib/profiles'
import { encodeShareHash, toShareableSlice } from './lib/shareState'
import type { SignatureFormState } from './types/signature'
import { AdminOverride } from './components/builder/AdminOverride'
import { BlockList } from './components/builder/BlockList'
import { BrandSelector } from './components/builder/BrandSelector'
import { ContentEditor } from './components/builder/ContentEditor'
import { CustomFieldsEditor } from './components/builder/CustomFieldsEditor'
import { LayoutSpacingPanel } from './components/builder/LayoutSpacingPanel'
import { LegalEditor } from './components/builder/LegalEditor'
import { LogoControls } from './components/builder/LogoControls'
import { PasteGuideModal } from './components/builder/PasteGuideModal'
import { SocialEditor } from './components/builder/SocialEditor'
import { TemplatePicker } from './components/builder/TemplatePicker'
import { PreviewPanel } from './components/preview/PreviewPanel'
import { PreviewStats } from './components/preview/PreviewStats'
import { Toast } from './components/ui/Toast'

function App() {
  const { state, setState, setBrand, resetToBrandDefaults, undo, redo } = useSignatureState()
  const brand = getBrandById(state.brandId)!
  const { theme, toggle: toggleTheme } = useBuilderTheme()
  const [toast, setToast] = useState<string | null>(null)
  const [guideOpen, setGuideOpen] = useState(false)
  const [widthMode, setWidthMode] = useState<'desktop' | 'mobile'>('desktop')
  const [darkSurround, setDarkSurround] = useState(false)

  const compiled = useMemo(() => {
    return compileSignatureHtml(state, brand, { assetBaseUrl: getDefaultAssetBaseUrl() })
  }, [state, brand])

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 3500)
  }

  const onBrandChange = (id: string) => {
    if (id === state.brandId) return
    if (window.confirm('Switching brand resets fields to that brand’s defaults. Continue?')) setBrand(id)
  }

  const copyShareLink = () => {
    const hash = encodeShareHash(toShareableSlice(state))
    const url = `${window.location.origin}${window.location.pathname}#tpl=${hash}`
    void navigator.clipboard.writeText(url)
    showToast('Shareable template link copied (personal fields excluded).')
  }

  return (
    <div className="min-h-screen bg-ctp-base text-ctp-text">
      <header className="flex flex-wrap items-center gap-3 border-b border-ctp-surface0 bg-ctp-mantle px-4 py-4 sm:px-6">
        <div className="flex-1">
          <h1 className="text-xl font-semibold tracking-tight">UXi SignOff</h1>
          <p className="text-sm text-ctp-subtext0">Multi-brand email signature builder</p>
        </div>
        <button type="button" onClick={undo} className="rounded-lg border border-ctp-surface1 p-2" aria-label="Undo"><Undo2 size={16} /></button>
        <button type="button" onClick={redo} className="rounded-lg border border-ctp-surface1 p-2" aria-label="Redo"><Redo2 size={16} /></button>
        <button type="button" onClick={toggleTheme} className="rounded-lg border border-ctp-surface1 p-2" aria-label="Toggle theme">
          {theme === 'latte' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </header>

      <main className="grid gap-6 p-4 lg:grid-cols-2 lg:p-6">
        <section className="space-y-5 rounded-xl border border-ctp-surface0 bg-ctp-mantle p-4 shadow-sm lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
          <BrandSelector brandId={state.brandId} onChange={onBrandChange} />
          <TemplatePicker state={state} onChange={setState} />
          <LayoutSpacingPanel state={state} onChange={setState} />
          <BlockList blocks={state.blocks} onChange={(blocks) => setState({ ...state, blocks })} />
          <LogoControls brand={brand} state={state} onChange={setState} />
          <ContentEditor brand={brand} state={state} onChange={setState} />
          <CustomFieldsEditor state={state} onChange={setState} />
          <SocialEditor state={state} onChange={setState} />
          <LegalEditor brand={brand} state={state} onChange={setState} />
          <AdminOverride value={state.paletteOverride} defaults={brand.palette} onChange={(paletteOverride) => setState({ ...state, paletteOverride })} />
          <ProfilesBar state={state} onLoad={setState} showToast={showToast} />

          <div className="flex flex-wrap gap-2 border-t border-ctp-surface0 pt-4">
            <ActionButton icon={<Copy size={16} />} label="Copy Signature" primary onClick={async () => {
              const result = await copyRichHtml(compiled.html, compiled.plainText)
              if (result === 'rich') showToast('Rich signature copied — paste into your email client.')
              else if (result === 'plain') showToast('Copied plain text only — try Chrome or Copy Raw HTML.')
              else showToast('Copy failed.')
            }} />
            <ActionButton icon={<FileCode2 size={16} />} label="Copy Raw HTML" onClick={async () => {
              showToast((await copyRawHtml(compiled.html)) ? 'HTML source copied.' : 'Copy failed.')
            }} />
            <ActionButton icon={<Share2 size={16} />} label="Share template link" onClick={copyShareLink} />
            <ActionButton icon={<RotateCcw size={16} />} label="Reset to Brand Defaults" onClick={() => {
              if (window.confirm('Reset all fields to this brand’s defaults?')) resetToBrandDefaults()
            }} />
            <ActionButton icon={<BookOpen size={16} />} label="Paste guide" onClick={() => setGuideOpen(true)} />
          </div>
        </section>

        <section className="lg:sticky lg:top-4 lg:self-start">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-ctp-subtext0">Live preview</h2>
          <PreviewStats html={compiled.html} state={state} />
          <PreviewPanel html={compiled.html} widthMode={widthMode} darkSurround={darkSurround} onWidthModeChange={setWidthMode} onDarkSurroundChange={setDarkSurround} />
        </section>
      </main>

      <PasteGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
      <Toast message={toast} onClear={() => setToast(null)} />
    </div>
  )
}

function ProfilesBar({ state, onLoad, showToast }: { state: SignatureFormState; onLoad: (s: SignatureFormState) => void; showToast: (m: string) => void }) {
  const [name, setName] = useState('')
  const profiles = listProfiles()
  return (
    <div className="rounded-lg border border-dashed border-ctp-surface1 p-3 text-sm">
      <p className="mb-2 font-medium">Saved profiles</p>
      <div className="flex gap-2">
        <input className="flex-1 rounded border border-ctp-surface1 bg-ctp-base px-2 py-1" value={name} placeholder="Profile name" onChange={(e) => setName(e.target.value)} />
        <button type="button" className="rounded bg-ctp-accent px-2 py-1 text-white" onClick={() => { if (name.trim()) { saveProfile(name, state); showToast('Profile saved'); setName('') } }}>Save</button>
      </div>
      <ul className="mt-2 space-y-1">{profiles.map((p) => (
        <li key={p.id} className="flex gap-2"><button type="button" className="text-ctp-accent" onClick={() => { const s = loadProfile(p.id); if (s) onLoad(s) }}>{p.name}</button>
          <button type="button" className="text-xs text-ctp-red" onClick={() => deleteProfile(p.id)}>Delete</button></li>
      ))}</ul>
    </div>
  )
}

function ActionButton({ icon, label, onClick, primary }: { icon: ReactNode; label: string; onClick: () => void; primary?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${primary ? 'bg-ctp-accent text-white' : 'border border-ctp-surface1 bg-ctp-base'}`}>
      {icon}{label}
    </button>
  )
}

export default App