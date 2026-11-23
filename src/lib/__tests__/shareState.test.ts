import { describe, expect, it } from 'vitest'
import { createDefaultState } from '../../config/defaults'
import { brands } from '../../config/brands'
import { applyShareableSlice, decodeShareHash, encodeShareHash, toShareableSlice } from '../shareState'

describe('shareState', () => {
  it('round-trips share hash without personal fields bleed', () => {
    const brand = brands[0]!
    const state = createDefaultState(brand)
    state.identity.fullName = 'Secret User'
    state.identity.email = 'secret@example.com'
    const hash = encodeShareHash(toShareableSlice(state))
    const decoded = decodeShareHash(hash)
    expect(decoded?.brandId).toBe(brand.id)
    const applied = applyShareableSlice(state, decoded!)
    expect(applied.identity.fullName).toBe('Secret User')
    expect(applied.templateId).toBe(state.templateId)
  })
})