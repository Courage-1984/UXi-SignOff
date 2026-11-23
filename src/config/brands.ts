import brandsJson from './brands.json'
import type { BrandConfig } from '../types/brand'

export const brands = brandsJson as BrandConfig[]

export function getBrandById(id: string): BrandConfig | undefined {
  return brands.find((b) => b.id === id)
}

export const DEFAULT_BRAND_ID = 'uxi-creative'