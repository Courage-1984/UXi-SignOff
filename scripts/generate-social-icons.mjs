/**
 * Brand glyphs from Simple Icons (CC0) + LinkedIn path (removed from upstream SI).
 * Output: 48px PNG under public/assets/icons/
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'
import * as SimpleIcons from 'simple-icons'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..', 'public', 'assets', 'icons')
const SIZE = 48
const INNER = 40
const SCALE = INNER / 24
const OFFSET = (SIZE - INNER) / 2

/** @type {Record<string, { hex: string, path: string }>} */
const ICONS = {
  linkedin: {
    hex: '0A66C2',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  facebook: pick(SimpleIcons.siFacebook),
  instagram: pick(SimpleIcons.siInstagram),
  whatsapp: pick(SimpleIcons.siWhatsapp),
  x: pick(SimpleIcons.siX),
  youtube: pick(SimpleIcons.siYoutube),
  tiktok: pick(SimpleIcons.siTiktok),
  website: pick(SimpleIcons.siWikipedia),
}

/** @param {import('simple-icons').SimpleIcon | undefined} icon */
function pick(icon) {
  if (!icon) throw new Error('Missing Simple Icon export')
  return { hex: icon.hex, path: icon.path }
}

function svgMarkup(path, hex, variant) {
  const brand = `#${hex}`
  if (variant === 'circle-filled') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <circle cx="24" cy="24" r="22" fill="${brand}"/>
  <g transform="translate(${OFFSET},${OFFSET}) scale(${SCALE})">
    <path d="${path}" fill="#ffffff"/>
  </g>
</svg>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <g transform="translate(${OFFSET},${OFFSET}) scale(${SCALE})">
    <path d="${path}" fill="${brand}"/>
  </g>
</svg>`
}

function toPng(svg) {
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: SIZE } })
  return resvg.render().asPng()
}

for (const variant of ['neutral', 'circle-filled']) {
  const dir = join(root, variant)
  await mkdir(dir, { recursive: true })
  for (const [name, icon] of Object.entries(ICONS)) {
    const svg = svgMarkup(icon.path, icon.hex, variant)
    await writeFile(join(dir, `${name}.png`), toPng(svg))
  }
}

console.log('Official brand PNGs written to public/assets/icons/')