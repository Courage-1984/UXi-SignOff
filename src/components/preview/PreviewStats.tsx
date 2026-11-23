import type { SignatureFormState } from '../../types/signature'

interface Props {
  html: string
  state?: SignatureFormState
}

export function PreviewStats({ html }: Props) {
  const bytes = new TextEncoder().encode(html).length
  const color =
    bytes > 10000 ? 'text-ctp-red' : bytes > 7500 ? 'text-ctp-yellow' : 'text-ctp-green'
  const warnings: string[] = []
  if (/localhost|127\.0\.0\.1/i.test(html)) warnings.push('Images may use localhost — copy from deployed HTTPS URL for real email.')
  const urls = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1])
  if (urls.some((u) => u && !u.startsWith('mailto:') && !u.startsWith('tel:') && !/^https?:\/\//i.test(u)))
    warnings.push('Some links may be missing https://')

  return (
    <div className="mb-2 rounded-lg border border-gray-200 bg-white p-2 text-xs text-gray-700">
      <p>
        HTML size: <span className={`font-medium ${color}`}>{bytes.toLocaleString()}</span> bytes
        {bytes > 10000 && ' — Gmail signature limit risk (10KB)'}
      </p>
      {warnings.map((w) => (
        <p key={w} className="mt-1 text-amber-700">
          {w}
        </p>
      ))}
    </div>
  )
}