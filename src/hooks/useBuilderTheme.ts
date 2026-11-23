import { useEffect, useState } from 'react'

export type BuilderTheme = 'latte' | 'mocha'

const KEY = 'uxi-signoff-builder-theme'

function systemDefault(): BuilderTheme {
  if (typeof window === 'undefined') return 'latte'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'mocha' : 'latte'
}

export function useBuilderTheme() {
  const [theme, setTheme] = useState<BuilderTheme>(() => {
    const saved = localStorage.getItem(KEY) as BuilderTheme | null
    return saved === 'mocha' || saved === 'latte' ? saved : systemDefault()
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-builder-theme', theme)
    localStorage.setItem(KEY, theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'latte' ? 'mocha' : 'latte'))

  return { theme, setTheme, toggle }
}