# Email client dark mode (preview reference)

This document summarizes how major mail clients treat HTML **signatures** in dark mode. It guides the **Live preview** rendering presets in UXi SignOff. Those presets are **approximations** for QA only — copied signature HTML is never modified.

**Builder theme** (Catppuccin latte/mocha in the navbar) changes the **builder UI** only. It does not simulate what recipients see.

## Sources

- [Mailchimp – Design emails for dark mode](https://mailchimp.com/help/design-emails-dark-mode/)
- [Fairsig – Email signature dark mode](https://fairsig.com/email-signature-dark-mode)
- [Lettr – Email rendering across clients](https://docs.lettr.com/knowledge-base/fundamentals/email-rendering-clients)

## Rendering schemes (industry summary)

| Scheme | What clients tend to do | Example clients (varies by version) |
|--------|-------------------------|-------------------------------------|
| No visual change | Dark app UI; message keeps authored colors | Gmail (web/desktop), some AOL/Yahoo |
| Partial inversion | Light backgrounds darkened; text contrast adjusted | Gmail (Android), Outlook.com, Outlook mobile |
| Full inversion | Broad color inversion including dark-on-light designs | Gmail (iOS), Outlook for Windows (classic), some Windows Mail |

Apple Mail often keeps authored colors in the message body, but system “dark backgrounds for messages” and `prefers-color-scheme` can affect presentation; Apple Mail is one of the few clients that may honor `@media (prefers-color-scheme)` in supported `<style>` blocks (not used in our exported table signatures by default).

## UXi SignOff preview presets

| Preset | Maps to | Implementation note |
|--------|---------|---------------------|
| **Light** (`unchangedLight`) | Light reading pane, unchanged signature | White message card on gray surround |
| **Dark UI** (`darkChromeUnchanged`) | Dark chrome, unchanged message | Gmail web–style: dark surround, white message body |
| **Partial** (`partialInvert`) | Partial inversion (approximate) | Dark message shell + mild brightness/contrast on signature wrapper |
| **Full** (`fullInvert`) | Full inversion (approximate) | CSS `invert` + `hue-rotate` on signature; `img` counter-filter to preserve logos |

Clients differ by OS, app version, and user settings (“Turn on the lights”, never invert, etc.). **Always test** a real send to your targets.

## Design tips (signatures)

- Avoid pure `#000` / `#fff` where possible; slight off-neutrals reduce harsh auto-inversion.
- Logos: transparent PNGs with dark text can disappear on dark backgrounds — flatten onto a light tile, use a light outline/glow, or use a mid-tone logo.
- Do not put required text inside images; inversion will not touch raster text.
- Exported HTML from this builder uses inline, email-safe styling — dark-mode-specific CSS in signatures is limited and not a substitute for inbox testing.

## Related

- Live preview disclaimer in [`PreviewPanel.tsx`](../src/components/preview/PreviewPanel.tsx)
- Preset definitions in [`previewRenderingPresets.ts`](../src/lib/previewRenderingPresets.ts)