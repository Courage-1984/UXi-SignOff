import { useMemo, useState } from 'react'
import { BookOpen, Copy, FileCode2, Moon, Redo2, RotateCcw, Share2, Sun, Undo2 } from 'lucide-react'
import { getBrandById } from './config/brands'
import { compileSignatureHtml, getDefaultAssetBaseUrl } from './compiler/compileSignature'
import { useBuilderTheme } from './hooks/useBuilderTheme'
import { useSignatureState } from './hooks/useSignatureState'
import { copyRawHtml, copyRichHtml } from './lib/clipboard'
import {
  saveProfile,
  listProfiles,
  loadProfile,
  deleteProfile,
  exportProfilesJson,
  importProfilesFromJson,
} from './lib/profiles'
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
import { Tooltip, TooltipButton } from './components/ui/Tooltip'
import { BuilderSection } from './components/builder/BuilderSection'
import { BuilderPanelToolbar } from './components/builder/BuilderPanelToolbar'
import { BuilderSectionsProvider } from './context/BuilderSectionsContext'
import type { PreviewRenderingPreset } from './lib/previewRenderingPresets'

function App() {
  const { state, setState, setBrand, resetToBrandDefaults, undo, redo } = useSignatureState()
  const brand = getBrandById(state.brandId)!
  const { theme, toggle: toggleTheme } = useBuilderTheme()
  const [toast, setToast] = useState<string | null>(null)
  const [guideOpen, setGuideOpen] = useState(false)
  const [widthMode, setWidthMode] = useState<'desktop' | 'mobile'>('desktop')
  const [renderingPreset, setRenderingPreset] = useState<PreviewRenderingPreset>('unchangedLight')

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
      <header className="flex flex-wrap items-center gap-1 border-b border-ctp-surface0 bg-ctp-mantle px-3 py-2 lg:flex-nowrap">
        <div className="min-w-0 flex-1 shrink">
          <h1 className="text-lg font-semibold tracking-tight">UXi SignOff</h1>
          <p className="hidden text-xs text-ctp-subtext0 md:block">Multi-brand email signature builder</p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Tooltip content="Undo last change">
            <button type="button" onClick={undo} aria-label="Undo last change" className="rounded-md border border-ctp-surface1 p-1.5">
              <Undo2 size={14} />
            </button>
          </Tooltip>
          <Tooltip content="Redo">
            <button type="button" onClick={redo} aria-label="Redo" className="rounded-md border border-ctp-surface1 p-1.5">
              <Redo2 size={14} />
            </button>
          </Tooltip>
          <Tooltip content={theme === 'latte' ? 'Switch to dark theme' : 'Switch to light theme'}>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-md border border-ctp-surface1 p-1.5"
            >
              {theme === 'latte' ? <Moon size={14} /> : <Sun size={14} />}
            </button>
          </Tooltip>
        </div>
        <div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-0.5 lg:ml-1 lg:w-auto lg:flex-nowrap xl:border-l xl:border-ctp-surface0 xl:pl-2">
          <TooltipButton
            content="Copy rich HTML signature for pasting into email clients"
            primary
            onClick={async () => {
              const result = await copyRichHtml(compiled.html, compiled.plainText)
              if (result === 'rich') showToast('Rich signature copied — paste into your email client.')
              else if (result === 'plain') showToast('Copied plain text only — try Chrome or Copy Raw HTML.')
              else showToast('Copy failed.')
            }}
          >
            <Copy size={14} />
            <span className="hidden xl:inline">Copy</span>
          </TooltipButton>
          <TooltipButton
            content="Copy table HTML source for developers"
            onClick={async () => {
              showToast((await copyRawHtml(compiled.html)) ? 'HTML source copied.' : 'Copy failed.')
            }}
          >
            <FileCode2 size={14} />
            <span className="hidden xl:inline">HTML</span>
          </TooltipButton>
          <TooltipButton content="Copy shareable link (layout only, no personal data)" onClick={copyShareLink}>
            <Share2 size={14} />
            <span className="hidden xl:inline">Share</span>
          </TooltipButton>
          <TooltipButton
            content="Reset all fields to current brand defaults"
            onClick={() => {
              if (window.confirm('Reset all fields to this brand’s defaults?')) resetToBrandDefaults()
            }}
          >
            <RotateCcw size={14} />
            <span className="hidden xl:inline">Reset</span>
          </TooltipButton>
          <TooltipButton content="How to paste signatures in Outlook, Gmail, and more" onClick={() => setGuideOpen(true)}>
            <BookOpen size={14} />
            <span className="hidden xl:inline">Guide</span>
          </TooltipButton>
        </div>
      </header>

      <main className="grid gap-3 p-3 lg:grid-cols-2 lg:gap-4 lg:p-4">
        <section className="space-y-2 rounded-xl border border-ctp-surface0 bg-ctp-mantle p-2 shadow-sm lg:p-3">
          <BuilderSectionsProvider>
          <BuilderPanelToolbar />
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
          </BuilderSectionsProvider>
        </section>

        <section className="self-start lg:sticky lg:top-2">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-ctp-subtext0">Live preview</h2>
          <PreviewStats html={compiled.html} state={state} />
          <PreviewPanel
            html={compiled.html}
            widthMode={widthMode}
            renderingPreset={renderingPreset}
            onWidthModeChange={setWidthMode}
            onRenderingPresetChange={setRenderingPreset}
          />
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
    <BuilderSection sectionId="profiles" title="Saved profiles">
      <div className="text-sm">
      <div className="flex gap-2">
        <input className="flex-1 rounded border border-ctp-surface1 bg-ctp-base px-2 py-1" value={name} placeholder="Profile name" onChange={(e) => setName(e.target.value)} />
        <button type="button" className="rounded bg-ctp-accent px-2 py-1 text-white" onClick={() => { if (name.trim()) { saveProfile(name, state); showToast('Profile saved'); setName('') } }}>Save</button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-ctp-surface1 px-2 py-1 text-xs"
          onClick={() => {
            const blob = new Blob([exportProfilesJson()], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const anchor = document.createElement('a')
            anchor.href = url
            anchor.download = 'uxi-signoff-profiles.json'
            anchor.click()
            URL.revokeObjectURL(url)
            showToast('Profiles JSON downloaded')
          }}
        >
          Export JSON
        </button>
        <label className="cursor-pointer rounded border border-ctp-surface1 px-2 py-1 text-xs">
          Import JSON
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const reader = new FileReader()
              reader.onload = () => {
                const ok = importProfilesFromJson(String(reader.result))
                showToast(ok ? 'Profiles imported' : 'Import failed')
              }
              reader.readAsText(file)
            }}
          />
        </label>
      </div>
      <ul className="mt-2 space-y-1">
        {profiles.map((p) => (
          <li key={p.id} className="flex gap-2">
            <button type="button" className="text-ctp-accent" onClick={() => { const s = loadProfile(p.id); if (s) onLoad(s) }}>{p.name}</button>
            <button type="button" className="text-xs text-ctp-red" onClick={() => deleteProfile(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
      </div>
    </BuilderSection>
  )
}

export default App