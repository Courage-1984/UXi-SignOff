import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { describe, expect, it } from 'vitest'
import { SOCIAL_ICON_CATALOG, iconFileName } from '../../config/socialIcons'

const publicRoot = join(process.cwd(), 'public')

describe('social icon assets', () => {
  it('every catalogued icon exists on disk', () => {
    for (const { variant, network } of SOCIAL_ICON_CATALOG) {
      const rel = join('assets', 'icons', variant, iconFileName(network))
      expect(existsSync(join(publicRoot, rel)), rel).toBe(true)
    }
  })

  it('icons are distinct recognizable PNGs, not flat placeholders', () => {
    const linkedin = readFileSync(join(publicRoot, 'assets/icons/brand/linkedin.png'))
    const xIcon = readFileSync(join(publicRoot, 'assets/icons/brand/x.png'))
    const linkedinMono = readFileSync(join(publicRoot, 'assets/icons/monochrome/linkedin.png'))
    expect(linkedin.byteLength).toBeGreaterThan(400)
    expect(xIcon.byteLength).toBeGreaterThan(400)
    expect(linkedin.equals(xIcon)).toBe(false)
    expect(linkedinMono.equals(linkedin)).toBe(false)
  })
})