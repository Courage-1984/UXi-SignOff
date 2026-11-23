import { presentationTable } from '../utils/html'

export function spacerRow(heightPx: number): string {
  if (heightPx <= 0) return ''
  return `${presentationTable('width="100%"')}<tr><td height="${heightPx}" style="font-size:0;line-height:0;height:${heightPx}px;">&nbsp;</td></tr></table>`
}

export function spacerCell(widthPx: number): string {
  if (widthPx <= 0) return ''
  return `<td width="${widthPx}" style="width:${widthPx}px;font-size:0;line-height:0;">&nbsp;</td>`
}