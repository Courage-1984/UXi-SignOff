import { existsSync } from 'fs'
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
})