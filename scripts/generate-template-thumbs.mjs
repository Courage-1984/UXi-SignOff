import { mkdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateSync } from 'node:zlib'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dir = join(__dirname, '..', 'public', 'template-thumbs')

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
function png(w, h, rgb) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  const rs = 1 + w * 3
  const raw = Buffer.alloc(rs * h)
  for (let y = 0; y < h; y++) {
    const o = y * rs
    raw[o] = 0
    for (let x = 0; x < w; x++) {
      const p = o + 1 + x * 3
      raw[p] = rgb[0]
      raw[p + 1] = rgb[1]
      raw[p + 2] = rgb[2]
    }
  }
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}

const thumbs = [
  ['classic-split', [233, 69, 96]],
  ['compact-stacked', [46, 196, 182]],
  ['executive-card', [15, 76, 129]],
  ['modern-minimal', [45, 49, 66]],
  ['accent-sidebar', [239, 131, 84]],
  ['header-strip', [136, 57, 239]],
  ['dual-visual', [99, 102, 241]],
]
await mkdir(dir, { recursive: true })
for (const [name, rgb] of thumbs) {
  await writeFile(join(dir, `${name}.png`), png(160, 56, rgb))
}
console.log('Template thumbs written')