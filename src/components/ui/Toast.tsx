interface ToastProps {
  message: string | null
  onClear: () => void
}

export function Toast({ message, onClear }: ToastProps) {
  if (!message) return null
  return (
    <div
      className="fixed bottom-6 right-6 z-50 max-w-sm rounded-lg border border-gray-200 bg-gray-900 px-4 py-3 text-sm text-white shadow-lg"
      role="status"
      onAnimationEnd={onClear}
    >
      {message}
    </div>
  )
}