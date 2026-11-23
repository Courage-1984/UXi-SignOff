import { mkdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateSync } from 'node:zlib'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..', 'public', 'assets', 'brands')

function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
  }
  return ~c >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type)
  const crcBuf = Buffer.alloc(4)
  const crc = crc32(Buffer.concat([typeBuf, data]))
  crcBuf.writeUInt32BE(crc, 0)
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

function createPng(width, height, r, g, b) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  const rowSize = 1 + width * 3
  const raw = Buffer.alloc(rowSize * height)
  for (let y = 0; y < height; y++) {
    const off = y * rowSize
    raw[off] = 0
    for (let x = 0; x < width; x++) {
      const px = off + 1 + x * 3
      raw[px] = r
      raw[px + 1] = g
      raw[px + 2] = b
    }
  }
  const idat = deflateSync(raw)
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const brands = [
  {
    id: 'uxi-creative',
    files: [
      { name: 'logo-primary.png', w: 280, h: 96, rgb: [233, 69, 96] },
      { name: 'logo-alt.png', w: 240, h: 80, rgb: [26, 26, 46] },
      { name: 'banner-campaign-a.png', w: 560, h: 100, rgb: [233, 69, 96] },
      { name: 'banner-campaign-b.png', w: 560, h: 100, rgb: [26, 26, 46] },
    ],
  },
  {
    id: 'partner-alpha',
    files: [
      { name: 'logo-primary.png', w: 300, h: 88, rgb: [15, 76, 129] },
      { name: 'banner-campaign-a.png', w: 560, h: 90, rgb: [46, 196, 182] },
    ],
  },
  {
    id: 'partner-beta',
    files: [
      { name: 'logo-primary.png', w: 260, h: 84, rgb: [239, 131, 84] },
      { name: 'banner-campaign-a.png', w: 560, h: 95, rgb: [45, 49, 66] },
    ],
  },
]

for (const brand of brands) {
  const dir = join(root, brand.id)
  await mkdir(dir, { recursive: true })
  for (const f of brand.files) {
    const buf = createPng(f.w, f.h, ...f.rgb)
    await writeFile(join(dir, f.name), buf)
  }
}

const sharedDir = join(__dirname, '..', 'public', 'assets', 'brands', 'shared')
await mkdir(sharedDir, { recursive: true })
for (const key of ['linkedin', 'facebook', 'instagram', 'whatsapp', 'x', 'youtube']) {
  const buf = createPng(40, 40, 80, 80, 80)
  await writeFile(join(sharedDir, `icon-${key}.png`), buf)
}

console.log('Placeholder PNGs written to public/assets/brands/')