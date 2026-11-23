# Live HTTPS QA checklist

Run **after** deploy to `https://<owner>.github.io/UXi-SignOff/` — not from `localhost`.

For local battle-test results and journey coverage, see [E2E_REPORT.md](./E2E_REPORT.md).

## Pre-flight (browser)

- [ ] App loads without 404 on JS/CSS (paths under `/UXi-SignOff/`).
- [ ] Copy Signature → Raw HTML: every `img src` is `https://<owner>.github.io/UXi-SignOff/assets/brands/...`.

## Clipboard (on live site)

| Browser | Copy Signature | Copy Raw HTML | Notes |
|---------|----------------|---------------|-------|
| Chrome | | | |
| Safari (macOS) | | | |
| Firefox | | | |

## Email clients (send to yourself)

| Client | Images load | Logo size OK | CTAs work | Address/phone styling OK |
|--------|-------------|--------------|-----------|---------------------------|
| Outlook Desktop (Classic) | | | | |
| Outlook Web | | | | |
| Gmail Web | | | | |
| Apple Mail (macOS / iOS) | | | | |
| Gmail Android | | | | |

## Dark mode

- [ ] In-app preview **Dark** surround: logos readable.
- [ ] Gmail / Apple Mail dark inbox: logos readable (adjust `logoBacking` or PNG assets if not).

## Sign-off

- Tester:
- Date:
- Build / commit: