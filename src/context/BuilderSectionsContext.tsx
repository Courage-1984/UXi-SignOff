import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

interface BuilderSectionsContextValue {
  isOpen: (sectionId: string) => boolean
  registerSection: (sectionId: string, defaultOpen: boolean) => void
  unregisterSection: (sectionId: string) => void
  setSectionOpen: (sectionId: string, open: boolean) => void
  expandAll: () => void
  collapseAll: () => void
}

const BuilderSectionsContext = createContext<BuilderSectionsContextValue | null>(null)

export function BuilderSectionsProvider({ children }: { children: ReactNode }) {
  const registryRef = useRef(new Map<string, { defaultOpen: boolean }>())
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({})

  const registerSection = useCallback(
    (sectionId: string, defaultOpen: boolean) => {
      if (!registryRef.current.has(sectionId)) {
        registryRef.current.set(sectionId, { defaultOpen })
        setOpenMap((prev) =>
          sectionId in prev ? prev : { ...prev, [sectionId]: defaultOpen },
        )
      }
    },
    [],
  )

  const unregisterSection = useCallback(
    (sectionId: string) => {
      if (registryRef.current.delete(sectionId)) {
        setOpenMap((prev) => {
          const next = { ...prev }
          delete next[sectionId]
          return next
        })
      }
    },
    [],
  )

  const setSectionOpen = useCallback((sectionId: string, open: boolean) => {
    setOpenMap((prev) => ({ ...prev, [sectionId]: open }))
  }, [])

  const expandAll = useCallback(() => {
    setOpenMap((prev) => {
      const next = { ...prev }
      for (const id of registryRef.current.keys()) next[id] = true
      return next
    })
  }, [])

  const collapseAll = useCallback(() => {
    setOpenMap((prev) => {
      const next = { ...prev }
      for (const id of registryRef.current.keys()) next[id] = false
      return next
    })
  }, [])

  const isOpen = useCallback(
    (sectionId: string) =>
      openMap[sectionId] ?? registryRef.current.get(sectionId)?.defaultOpen ?? false,
    [openMap],
  )

  const value = useMemo(
    () => ({
      isOpen,
      registerSection,
      unregisterSection,
      setSectionOpen,
      expandAll,
      collapseAll,
    }),
    [isOpen, registerSection, unregisterSection, setSectionOpen, expandAll, collapseAll],
  )

  return <BuilderSectionsContext.Provider value={value}>{children}</BuilderSectionsContext.Provider>
}

export function useBuilderSections() {
  const ctx = useContext(BuilderSectionsContext)
  if (!ctx) throw new Error('useBuilderSections must be used within BuilderSectionsProvider')
  return ctx
}

export function useBuilderSectionRegistration(sectionId: string, defaultOpen: boolean) {
  const { registerSection, unregisterSection, isOpen, setSectionOpen } = useBuilderSections()

  useLayoutEffect(() => {
    registerSection(sectionId, defaultOpen)
    return () => unregisterSection(sectionId)
  }, [sectionId, defaultOpen, registerSection, unregisterSection])

  const open = isOpen(sectionId)
  const toggle = useCallback(
    (next: boolean) => setSectionOpen(sectionId, next),
    [sectionId, setSectionOpen],
  )

  return { open, toggle }
}