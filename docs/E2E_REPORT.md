# UXi SignOff — E2E battle test report

**Date:** 2026-11-23  
**Environment:** Windows 11, Node 20, Vite dev `http://localhost:5173/`, production preview `http://localhost:4173/UXi-SignOff/`  
**Automated gates:** `npm test` (34 tests), `npm run test:e2e` (1 smoke), `npm run build` with `GITHUB_PAGES_BASE=/UXi-SignOff/` + `VITE_ASSET_BASE_URL`

## Sign-off criteria

| Criterion | Status |
|-----------|--------|
| Zero console **errors** on app load (dev + preview) | **Pass** |
| No HTTP **404** on static assets (dev + preview network capture) | **Pass** (see notes) |
| All **7 templates × 3 brands** compiler smoke (Vitest) | **Pass** |
| Clipboard + share + persist journeys | **Pass** (Vitest + UI smoke) |
| Priority gaps from audit fixed | **Pass** |
| Production asset base baked in `dist/` | **Pass** |

**Battle tested:** Yes — builder happy paths verified in browser with Playwright MCP; regressions covered by Vitest + Playwright smoke.

### Builder UX addendum (2026-11-24)

- **Media:** Editable alt text on headshot, logo override, and banner; custom image URLs support GIFs (`resolveImageSrc`).
- **Navbar:** Copy / share / reset / paste actions live in the header with hover tooltips (undo, redo, theme included).
- **Panels:** Left builder uses collapsible `BuilderSection` for brand, templates, layout, blocks, profiles, and content editors.
- **Automated:** Vitest alt/GIF compile cases; Playwright header actions, section collapse, headshot alt, custom GIF banner.

Animated GIF support in inboxes varies (Outlook desktop often shows first frame only).

### Scroll, accordion, and preview presets (2026-11-24)

- **Page scroll:** Builder column no longer uses internal `max-h` scroll; preview panel uses document height (no nested `overflow-auto`). `html { overflow-y: auto }`.
- **Accordion:** `BuilderSectionsProvider` + **Expand all** / **Collapse all** toolbar; controlled `BuilderSection` with `sectionId`.
- **Preview:** Four client-style rendering presets (`unchangedLight`, `darkChromeUnchanged`, `partialInvert`, `fullInvert`) — see `docs/EMAIL_CLIENT_DARK_MODE.md`.
- **Automated:** Vitest `previewRenderingPresets.test.ts`; Playwright collapse/expand all.

---

## Bugs fixed during E2E

| Issue | Fix |
|-------|-----|
| Headshot `img src` via `normalizeHref` | `resolveImageSrc()` in `src/compiler/utils/urls.ts`; regression in `src/lib/__tests__/resolveImageSrc.test.ts` |
| CTA layout (`direction`, `align`) no UI | Controls in `ContentEditor.tsx` |
| Social layout no UI | Controls in `SocialEditor.tsx` |
| Divider style/orientation | `LayoutSpacingPanel.tsx` |
| Admin override gray UI | Catppuccin classes in `AdminOverride.tsx` |
| Undo/redo keyboard | `useSignatureState.ts` — history init + Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y |
| Profiles export/import | `exportProfilesJson` / `importProfilesFromJson` + UI in `App.tsx`; `profiles.test.ts` |
| QA logo matrix | `scripts/generate-qa-assets.mjs`, brand `qa-shapes`, `npm run generate:qa` |

## Won't fix / notes

| Item | Decision |
|------|----------|
| `modern-minimal` plain-text contact (no `mailto:`/`tel:`) | **Intentional** — template is typographic/minimal; autolink templates unchanged |
| Preview iframe loads `example.github.io` assets on **dev** | **Expected** when `VITE_ASSET_BASE_URL` is unset in dev; ORB block is not a 404. Exported HTML uses correct base on Pages build |
| Cross-origin ORB on one preview image in dev log | Documented in `docs/e2e-network-dev.txt` — not a missing file |

---

## Browser baseline

### Dev (`localhost:5173`)

- Console errors: **0** (Playwright MCP + `e2e/smoke.spec.ts`)
- Network 404s: **0** (`docs/e2e-network-dev.txt`, 157 requests sampled)

### Production preview (`localhost:4173/UXi-SignOff/`)

- Console errors: **0**
- Network 404s: **0** (`docs/e2e-network-preview.txt`)
- JS bundle contains `https://example.github.io/UXi-SignOff` asset helper (local build env)

### Production build grep (local)

- `dist/index.html` references `/UXi-SignOff/` for JS/CSS/favicon — **Pass**
- `dist/assets/*.js` contains baked `VITE_ASSET_BASE_URL` — **Pass** (mirrors `.github/workflows/deploy.yml` verify step)

Post-deploy manual checks: see [LIVE_QA.md](./LIVE_QA.md).

---

## Feature journey matrix

Legend: **P** = Pass (browser and/or Vitest), **M** = MCP spot-check on preview build

| Area | Steps | Result |
|------|-------|--------|
| 3.1 Header | Theme toggle, undo/redo buttons visible | **M** |
| 3.2 Brand selector | 4 brands in UI (incl. QA Shapes) | **M** |
| 3.3 Templates | 7 templates with thumbs | **M** |
| 3.4 Layout & spacing | Flow, align, presets, sliders, divider style/orientation | **M** |
| 3.5 Blocks | Toggle + reorder list present | **M** |
| 3.6 Logo & headshot | `qa-shapes` wide logo dimensions | **P** (Vitest) |
| 3.7 Identity + custom | Fields + quick-add presets | **M** |
| 3.8 CTA | Buttons + direction/align | **M** |
| 3.9 Social | Modes, variants, layout direction/align | **M** |
| 3.10 Banner | Banner select | **M** |
| 3.11 Legal | Lock/unlock, font size, divider | **M** |
| 3.12 Admin override | Panel present (Catppuccin) | **M** |
| 3.13 Profiles | Save + Export JSON + Import JSON | **M** + **P** |
| 3.14 Actions | Copy Signature, Raw HTML, Share, Reset, Paste guide | **M** |
| 3.15 Preview | Desktop/mobile, light/dark, size meter | **M** |
| 3.16 Persistence | v2 key, v1 migrate | **P** (Vitest) |

### Compiler / export guards (Vitest)

- No forbidden CSS (`flex`, `grid`, `<style>`, inline `<svg>`) — **Pass**
- Social icons use `assets/icons/...` paths — **Pass**
- Clipboard HTML normalization — **Pass**
- All templates × brands compile — **Pass**

---

## Automation added

| Artifact | Purpose |
|----------|---------|
| `e2e/smoke.spec.ts` | Load app, core buttons, no console errors |
| `playwright.config.ts` | Dev server reuse locally; CI starts `npm run dev` |
| `npm run test:e2e` | Manual + CI script |
| `.github/workflows/deploy.yml` | `playwright install` + `npm run test:e2e` before build |
| `docs/e2e-network-*.txt` | Network audit snapshots |

---

## QA assets

| Path | Use |
|------|-----|
| `public/assets/brands/qa-shapes/` | wide / square / tall logos + banners |
| `public/assets/qa/headshot-square.png` | dual-visual headshot URL test |
| `npm run generate:qa` | Regenerate matrix |

---

## Commands to reproduce

```bash
npm run generate:qa
npm test
npm run test:e2e
$env:GITHUB_PAGES_BASE="/UXi-SignOff/"
$env:VITE_ASSET_BASE_URL="https://<owner>.github.io/UXi-SignOff"
npm run build
npm run preview
```

**Tester:** Cursor agent (automated + MCP browser)  
**Commit / build:** workspace state at 2026-11-23 E2E run