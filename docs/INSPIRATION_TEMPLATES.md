# Inspiration layout templates

Five **layout-only** templates approximate common high-design email signatures. They do not change your brand when selected; only layout, spacing, and default block toggles update.

For a close visual match to the bundled references, manually switch **Brand** to the matching `ref-*` showcase brand and fill identity fields.

Re-import reference PNGs after cloning:

```bash
npm run import:inspiration
```

## Template ↔ reference brand

| Template | Reference brand | Key assets (`public/assets/brands/...`) |
|----------|-----------------|----------------------------------------|
| `panel-split` | `ref-amc-panel` | `decorations/panel-left.png`, contact icon PNGs |
| `headshot-affiliate` | `ref-affiliate` | `affiliate-cta.png` banner, headshot URL |
| `logo-promo-stack` | `ref-promo-stack` | `logo-primary.png`, `event-promo.png` banner |
| `conference-hero` | `ref-conference-hero` | `decorations/conference-hero.png` |
| `partner-showcase` | `ref-partner-showcase` | `decorations/side-accent.png`, `partner-strip.png` |

## Builder checklist (per example)

### Panel split (AMC-style)

1. Template: **Panel split**
2. Brand: `ref-amc-panel`
3. Identity: name, title, mobile; website on right column footer
4. Logo: **Primary** on white column
5. Blocks: identity only (defaults)

### Headshot + affiliate

1. Template: **Headshot + affiliate**
2. Brand: `ref-affiliate`
3. Enable headshot; URL e.g. `/assets/qa/headshot-square.png` or your photo
4. Banner: **Affiliate CTA**
5. Social: icons, circle-filled (preset)

### Logo + promo stack

1. Template: **Logo + promo stack**
2. Brand: `ref-promo-stack`
3. Identity: accent-colored name, address as location
4. Banner: **Event promo**

### Conference hero

1. Template: **Conference hero**
2. Brand: `ref-conference-hero`
3. Hero uses `decorations.hero` when present (overrides banner block for hero slot)
4. Compact identity below hero

### Partner showcase

1. Template: **Partner showcase**
2. Brand: `ref-partner-showcase`
3. Side accent + partner strip from brand `decorations`
4. Optional social row

## Custom brands: `decorations` in `brands.json`

```json
"decorations": {
  "panelLeft": "panel-left.png",
  "hero": "conference-hero.png",
  "sideAccent": "side-accent.png",
  "partnerStrip": "partner-strip.png",
  "contactIcons": { "role": "icon-role.png", "phone": "icon-phone.png" }
}
```

Files live under `public/assets/brands/<brand-id>/decorations/`.

## Fidelity notes

| Visual | Implementation |
|--------|----------------|
| Curved panels, trophies, gradients | Flat PNG (`background` on `<td>` or `<img>`) |
| Prefix contacts `w:` / `e:` / `m:` | HTML in `headshot-affiliate` |
| Partner logo row | `partnerStrip` PNG (v1) |
| Name color / panel text | Template-driven identity variant |