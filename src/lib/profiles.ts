import type { SignatureFormState } from '../types/signature'

const KEY = 'uxi-signoff-profiles'

export interface SavedProfile {
  id: string
  name: string
  state: SignatureFormState
  updatedAt: string
}

export function listProfiles(): SavedProfile[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as SavedProfile[]
  } catch {
    return []
  }
}

export function saveProfile(name: string, state: SignatureFormState): SavedProfile {
  const profiles = listProfiles()
  const entry: SavedProfile = {
    id: crypto.randomUUID(),
    name,
    state: JSON.parse(JSON.stringify(state)),
    updatedAt: new Date().toISOString(),
  }
  profiles.push(entry)
  localStorage.setItem(KEY, JSON.stringify(profiles))
  return entry
}

export function deleteProfile(id: string): void {
  localStorage.setItem(KEY, JSON.stringify(listProfiles().filter((p) => p.id !== id)))
}

export function loadProfile(id: string): SignatureFormState | null {
  return listProfiles().find((p) => p.id === id)?.state ?? null
}