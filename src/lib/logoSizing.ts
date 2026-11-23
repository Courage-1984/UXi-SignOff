export function computeDisplayDimensions(
  naturalWidth: number,
  naturalHeight: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  if (naturalWidth <= 0 || naturalHeight <= 0) {
    return { width: maxWidth, height: maxHeight }
  }
  const ratio = naturalHeight / naturalWidth
  let width = Math.min(maxWidth, naturalWidth)
  let height = Math.round(width * ratio)
  if (height > maxHeight) {
    height = maxHeight
    width = Math.round(height / ratio)
  }
  return { width: Math.max(1, width), height: Math.max(1, height) }
}