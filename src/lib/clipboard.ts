export type CopyRichResult = 'rich' | 'plain' | 'failed'

export async function copyRichHtml(html: string, plainText: string): Promise<CopyRichResult> {
  if (navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
    try {
      const item = new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([plainText], { type: 'text/plain' }),
      })
      await navigator.clipboard.write([item])
      return 'rich'
    } catch {
      // fall through
    }
  }

  const execOk = copyHtmlWithExecCommand(html)
  if (execOk) return 'rich'

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(plainText)
      return 'plain'
    } catch {
      return 'failed'
    }
  }

  return 'failed'
}

function copyHtmlWithExecCommand(html: string): boolean {
  const host = document.createElement('div')
  host.contentEditable = 'true'
  host.style.position = 'fixed'
  host.style.left = '-9999px'
  host.innerHTML = html
  document.body.appendChild(host)

  const selection = window.getSelection()
  if (!selection) {
    document.body.removeChild(host)
    return false
  }

  const range = document.createRange()
  range.selectNodeContents(host)
  selection.removeAllRanges()
  selection.addRange(range)

  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }

  selection.removeAllRanges()
  document.body.removeChild(host)
  return ok
}

export async function copyRawHtml(html: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(html)
      return true
    } catch {
      // fall through
    }
  }

  return copyTextWithExecCommand(html)
}

function copyTextWithExecCommand(text: string): boolean {
  const area = document.createElement('textarea')
  area.value = text
  area.style.position = 'fixed'
  area.style.left = '-9999px'
  document.body.appendChild(area)
  area.focus()
  area.select()

  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }

  document.body.removeChild(area)
  return ok
}