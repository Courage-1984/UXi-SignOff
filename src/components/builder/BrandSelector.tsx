import { brands } from '../../config/brands'

interface BrandSelectorProps {
  brandId: string
  onChange: (id: string) => void
}

export function BrandSelector({ brandId, onChange }: BrandSelectorProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-ctp-subtext0">Brand</span>
      <select
        value={brandId}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-ctp-surface1 bg-ctp-base px-3 py-2 text-sm text-ctp-text shadow-sm focus:border-ctp-accent focus:outline-none focus:ring-1 focus:ring-ctp-accent"
      >
        {brands.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
    </label>
  )
}