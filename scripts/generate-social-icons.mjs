import { mkdir, writeFile, stat } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateSync } from 'node:zlib'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..', 'public', 'assets', 'icons')
const SIZE = 48

function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = (c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1)
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

function encodePngRgba(size, grid) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  const rowSize = 1 + size * 4
  const raw = Buffer.alloc(rowSize * size)
  for (let y = 0; y < size; y++) {
    const off = y * rowSize
    raw[off] = 0
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = grid[y][x]
      const px = off + 1 + x * 4
      raw[px] = r
      raw[px + 1] = g
      raw[px + 2] = b
      raw[px + 3] = a
    }
  }
  return Buffer.concat([signature, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}

function emptyGrid(size) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => [0, 0, 0, 0]))
}

function blend(grid, x, y, rgb, alpha = 255) {
  if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return
  grid[y][x] = [...rgb, alpha]
}

function fillRect(grid, x0, y0, w, h, rgb) {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) blend(grid, x, y, rgb)
}

function fillCircle(grid, cx, cy, rad, rgb) {
  for (let y = 0; y < SIZE; y++)
    for (let x = 0; x < SIZE; x++) if (Math.hypot(x - cx, y - cy) <= rad) blend(grid, x, y, rgb)
}

function strokeLine(grid, x0, y0, x1, y1, thick, rgb) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1) * 2
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = Math.round(x0 + (x1 - x0) * t)
    const y = Math.round(y0 + (y1 - y0) * t)
    for (let dy = -thick; dy <= thick; dy++)
      for (let dx = -thick; dx <= thick; dx++) blend(grid, x + dx, y + dy, rgb)
  }
}

function strokeRect(grid, x, y, w, h, t, rgb) {
  fillRect(grid, x, y, w, t, rgb)
  fillRect(grid, x, y + h - t, w, t, rgb)
  fillRect(grid, x, y, t, h, rgb)
  fillRect(grid, x + w - t, y, t, h, rgb)
}

const INK = [60, 65, 81]
const CIRCLE_BG = [99, 102, 241]
const WHITE = [255, 255, 255]

/** @type {Record<string, (g: number[][][], c: number[]) => void>} */
const drawers = {
  linkedin(g, c) {
    fillRect(g, 10, 10, 28, 28, c)
    fillRect(g, 14, 20, 5, 14, WHITE)
    fillRect(g, 21, 24, 5, 10, WHITE)
    fillCircle(g, 16, 16, 3, WHITE)
    fillRect(g, 28, 16, 5, 18, WHITE)
    fillCircle(g, 31, 13, 2.5, WHITE)
  },
  facebook(g, c) {
    fillCircle(g, 24, 24, 17, c)
    fillRect(g, 26, 16, 4, 18, WHITE)
    fillRect(g, 20, 22, 16, 4, WHITE)
  },
  instagram(g, c) {
    strokeRect(g, 11, 11, 26, 26, 3, c)
    fillCircle(g, 24, 24, 6, c)
    fillCircle(g, 33, 15, 2.5, c)
  },
  whatsapp(g, c) {
    fillCircle(g, 24, 25, 16, c)
    strokeLine(g, 18, 30, 22, 34, 2, WHITE)
    strokeLine(g, 22, 34, 28, 28, 2, WHITE)
  },
  x(g, c) {
    strokeLine(g, 14, 14, 34, 34, 3, c)
    strokeLine(g, 34, 14, 14, 34, 3, c)
  },
  youtube(g, c) {
    fillRect(g, 9, 15, 30, 18, c)
    strokeLine(g, 21, 19, 31, 24, 2, WHITE)
    strokeLine(g, 21, 29, 31, 24, 2, WHITE)
    strokeLine(g, 21, 19, 21, 29, 2, WHITE)
  },
  tiktok(g, c) {
    fillCircle(g, 22, 28, 9, c)
    fillRect(g, 27, 12, 4, 20, c)
    fillRect(g, 29, 12, 7, 3, c)
  },
  website(g, c) {
    fillCircle(g, 24, 24, 15, c)
    for (let y = 0; y < SIZE; y++)
      for (let x = 0; x < SIZE; x++)
        if (Math.hypot(x - 24, y - 24) > 12) blend(g, x, y, [0, 0, 0], 0)
    strokeLine(g, 9, 24, 39, 24, 1, c)
    fillRect(g, 22, 11, 4, 26, c)
    strokeLine(g, 14, 17, 34, 17, 1, c)
    strokeLine(g, 14, 31, 34, 31, 1, c)
  },
}

const networks = Object.keys(drawers)

for (const variant of ['neutral', 'circle-filled']) {
  const dir = join(root, variant)
  await mkdir(dir, { recursive: true })
  for (const network of networks) {
    const grid = emptyGrid(SIZE)
    const color = variant === 'neutral' ? INK : WHITE
    const knock = variant === 'neutral' ? null : CIRCLE_BG
    if (knock) fillCircle(grid, 24, 24, 22, knock)
    const draw = drawers[network]
    if (variant === 'neutral') {
      draw(grid, color)
    } else {
      draw(grid, WHITE)
      for (let y = 0; y < SIZE; y++)
        for (let x = 0; x < SIZE; x++) if (Math.hypot(x - 24, y - 24) > 22) grid[y][x] = [0, 0, 0, 0]
    }
    await writeFile(join(dir, `${network}.png`), encodePngRgba(SIZE, grid))
  }
}

for (const variant of ['neutral', 'circle-filled']) {
  const sizes = await Promise.all(
    networks.map(async (n) => (await stat(join(root, variant, `${n}.png`))).size),
  )
  if (new Set(sizes).size < 4) throw new Error(`Icon PNGs in ${variant} look identical — generation failed`)
}

console.log('Social icons written to public/assets/icons/')