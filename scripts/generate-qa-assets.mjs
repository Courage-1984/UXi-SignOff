import { mkdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateSync } from 'node:zlib'

const __dirname = dirname(fileURLToPath(import.meta.url))
const brandsRoot = join(__dirname, '..', 'public', 'assets', 'brands', 'qa-shapes')
const qaRoot = join(__dirname, '..', 'public', 'assets', 'qa')

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

await mkdir(brandsRoot, { recursive: true })
await mkdir(qaRoot, { recursive: true })

const qaFiles = [
  { path: join(brandsRoot, 'logo-wide.png'), w: 400, h: 80, rgb: [37, 99, 235] },
  { path: join(brandsRoot, 'logo-square.png'), w: 200, h: 200, rgb: [16, 185, 129] },
  { path: join(brandsRoot, 'logo-tall.png'), w: 120, h: 320, rgb: [124, 58, 237] },
  { path: join(brandsRoot, 'banner-wide.png'), w: 560, h: 80, rgb: [234, 88, 12] },
  { path: join(brandsRoot, 'banner-square.png'), w: 400, h: 400, rgb: [220, 38, 38] },
  { path: join(qaRoot, 'headshot-square.png'), w: 144, h: 144, rgb: [100, 116, 139] },
]

for (const f of qaFiles) {
  await writeFile(f.path, createPng(f.w, f.h, ...f.rgb))
}

console.log('QA shape assets written')