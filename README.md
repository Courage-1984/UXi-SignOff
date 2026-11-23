# UXi SignOff

Zero-backend static web app for building **email-client-safe HTML signatures** across multiple brands.

**v2 highlights:** 7 table layouts, email-safe flow/spacing controls, Catppuccin Latte/Mocha builder theme (separate from inbox preview), raster social icons under `public/assets/icons/`, custom contact fields, shareable template URLs, saved profiles, undo/redo, and HTML size meter in preview.

**Social icons (root cause fixed):** v1 icons lived under `brands/shared/` as identical gray squares, used `&nbsp;` concatenation, and a single `useIcons` flag. v2 uses `public/assets/icons/{variant}/{network}.png`, table-cell layout, and Icons / Text / Icon+label modes. Built with Vite, React, and TypeScript. Designed for [GitHub Pages](https://pages.github.com/).

## Local development

```bash
npm install
npm run dev
```

Optional environment (copy [`.env.example`](.env.example) to `.env.local`):

| Variable | Purpose |
|----------|---------|
| `VITE_ASSET_BASE_URL` | Absolute HTTPS origin used in copied signature image URLs |
| `GITHUB_PAGES_BASE` | Vite `base` path (e.g. `/UXi-SignOff/` for project Pages) |

## Build & test

```bash
npm run build
npm run preview
npm test
```

**Local build matching GitHub Pages (project site):**

```bash
set GITHUB_PAGES_BASE=/UXi-SignOff/
set VITE_ASSET_BASE_URL=https://YOUR_USER.github.io/UXi-SignOff
npm run build
npm run preview
```

On macOS/Linux use `export GITHUB_PAGES_BASE=/UXi-SignOff/` (and the same for `VITE_ASSET_BASE_URL`). Production CI sets both automatically in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Regenerate placeholder brand PNGs:

```bash
npm run generate:assets
```

## GitHub Pages deployment

1. Enable **GitHub Pages** → Source: **GitHub Actions**.
2. Push to `main`. The workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs tests, builds, and deploys `dist/`.

Set `VITE_ASSET_BASE_URL` in the workflow to match your live Pages URL so pasted signatures load logos and banners correctly.

After deploy, follow the [live HTTPS QA checklist](docs/LIVE_QA.md) (clipboard + Outlook/Gmail/Apple paste tests from the production URL).

## Adding or updating a brand (Marketing / ops)

No code deploy tools required beyond your usual git workflow.

1. **Assets** — Add a folder under `public/assets/brands/<brand-id>/` with **PNG or JPG** files only (no SVG). Typical files: `logo-primary.png`, `banner-campaign-a.png`.
2. **Config** — Add or edit an entry in [`src/config/brands.json`](src/config/brands.json):
   - `id`, `name`, `palette` colours, `fontFamily` (web-safe stack)
   - `logos[]` — `file`, `width`, `height`, `alt` (width/height are required for Outlook)
   - `logoBacking` — optional white card behind logos for dark-mode inboxes (`enabled`, `color`, `padding`); use light-backed PNGs if a transparent mark still vanishes
   - `banners[]` — `file`, `width`, optional `height`, `defaultUrl`, `alt`
   - `defaults` — website, address, tagline, social URLs, CTA buttons
   - `legalDisclaimer` — `text`, `locked` (if `true`, staff cannot edit in the UI)
3. **Swap a campaign banner** — Replace the PNG in the brand folder (keep the same filename) or update `file` / `defaultUrl` in JSON.
4. Open a PR, merge to `main`, wait for the deploy workflow.

## Architecture notes

- **Builder UI** uses Tailwind and modern layout (flex/grid).
- **Exported HTML** is compiled by `compileSignatureHtml()` — tables, inline CSS only, absolute image URLs, no `<style>` blocks.

## Pasting signatures

Use **Copy Signature** in the app, or **Copy Raw HTML** for Apple Mail. See the in-app **Paste guide** for Outlook, Gmail, and Apple Mail steps.