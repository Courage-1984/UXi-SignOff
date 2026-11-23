import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateSync } from 'node:zlib'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const publicRoot = join(root, 'public')
const srcDir =
  process.env.INSPIRATION_SRC ??
  join(homedir(), '.cursor', 'projects', 'c-Users-Dieter-Roelofse-PC-Github-UXi-SignOff', 'assets')

const SOURCES = {
  amc: 'image-ba42deed-04a8-4fcd-a753-712bdf98a52f.png',
  affiliate: 'image-d9cb6d4b-28b3-42d8-81f7-367200b75b78.png',
  promo: 'image-39815832-d0bb-4050-879b-d835c8806b4f.png',
  conference: 'image-0687f791-fd35-402a-b7df-0cb0181c4235.png',
  partner: 'image-c16c63b1-e673-4ac4-ac69-7d1466f63a45.png',
}

function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  }
  return ~c >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([len, typeBuf, data, crcBuf])
}
function createPng(width, height, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  const rs = 1 + width * 3
  const raw = Buffer.alloc(rs * height)
  for (let y = 0; y < height; y++) {
    const o = y * rs
    raw[o] = 0
    for (let x = 0; x < width; x++) {
      const p = o + 1 + x * 3
      raw[p] = r
      raw[p + 1] = g
      raw[p + 2] = b
    }
  }
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}

async function cp(src, dest) {
  await mkdir(dirname(dest), { recursive: true })
  await copyFile(src, dest)
}

async function iconCircle(dest) {
  const buf = createPng(28, 28, 250, 204, 21)
  await mkdir(dirname(dest), { recursive: true })
  await writeFile(dest, buf)
}

const BRAND_FILES = [
  {
    id: 'ref-amc-panel',
    src: SOURCES.amc,
    copies: [
      ['decorations/panel-left.png'],
      ['logo-primary.png'],
    ],
    thumb: 'panel-split.png',
  },
  {
    id: 'ref-affiliate',
    src: SOURCES.affiliate,
    copies: [['affiliate-cta.png']],
    thumb: 'headshot-affiliate.png',
  },
  {
    id: 'ref-promo-stack',
    src: SOURCES.promo,
    copies: [['event-promo.png'], ['logo-primary.png']],
    thumb: 'logo-promo-stack.png',
  },
  {
    id: 'ref-conference-hero',
    src: SOURCES.conference,
    copies: [['decorations/conference-hero.png']],
    thumb: 'conference-hero.png',
  },
  {
    id: 'ref-partner-showcase',
    src: SOURCES.partner,
    copies: [
      ['decorations/side-accent.png'],
      ['decorations/partner-strip.png'],
      ['logo-primary.png'],
    ],
    thumb: 'partner-showcase.png',
  },
]

for (const spec of BRAND_FILES) {
  const src = join(srcDir, spec.src)
  const brandDir = join(publicRoot, 'assets', 'brands', spec.id)
  for (const [rel] of spec.copies) {
    await cp(src, join(brandDir, rel))
  }
  if (spec.id === 'ref-amc-panel') {
    await iconCircle(join(brandDir, 'decorations/icon-role.png'))
    await iconCircle(join(brandDir, 'decorations/icon-phone.png'))
  }
  await cp(src, join(publicRoot, 'template-thumbs', spec.thumb))
}

console.log('Inspiration assets imported from', srcDir)