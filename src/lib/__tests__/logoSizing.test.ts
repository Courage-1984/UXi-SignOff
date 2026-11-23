import { describe, expect, it } from 'vitest'
import { computeDisplayDimensions } from '../logoSizing'

describe('computeDisplayDimensions', () => {
  it('caps wide logos by max width', () => {
    expect(computeDisplayDimensions(560, 120, 140, 80)).toEqual({ width: 140, height: 30 })
  })
  it('caps tall crests by max height', () => {
    const d = computeDisplayDimensions(80, 400, 140, 80)
    expect(d.height).toBeLessThanOrEqual(80)
  })
  it('preserves square aspect', () => {
    expect(computeDisplayDimensions(200, 200, 100, 100)).toEqual({ width: 100, height: 100 })
  })
})