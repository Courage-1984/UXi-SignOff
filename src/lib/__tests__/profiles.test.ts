import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createDefaultState } from '../../config/defaults'
import { brands } from '../../config/brands'
import { exportProfilesJson, importProfilesFromJson, listProfiles, saveProfile } from '../profiles'

describe('profiles import/export', () => {
  beforeEach(() => {
    const store: Record<string, string> = {}
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => {
        store[k] = v
      },
      removeItem: (k: string) => {
        delete store[k]
      },
    })
    vi.stubGlobal('crypto', { randomUUID: () => 'test-uuid' })
  })

  it('exports and imports profile JSON', () => {
    saveProfile('Test', createDefaultState(brands[0]!))
    const json = exportProfilesJson()
    expect(json).toContain('Test')
    expect(importProfilesFromJson(json)).toBe(true)
    expect(listProfiles().length).toBeGreaterThanOrEqual(1)
  })
})