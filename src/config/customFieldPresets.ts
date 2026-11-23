import type { CustomField } from '../types/signature'

let counter = 0
function id() {
  counter += 1
  return `cf-${Date.now()}-${counter}`
}

export const CUSTOM_FIELD_PRESETS: Array<Omit<CustomField, 'id'>> = [
  { label: 'Pronouns', value: '', type: 'text', visible: true },
  { label: 'Landline', value: '', type: 'phone', visible: true },
  { label: 'WhatsApp', value: '', type: 'phone', visible: true },
  { label: 'Campus', value: '', type: 'text', visible: true },
  { label: 'Qualifications', value: '', type: 'text', visible: true },
  { label: 'Book', value: 'Book a 15-min call', type: 'url', href: '', visible: true },
]

export function createPresetField(preset: Omit<CustomField, 'id'>): CustomField {
  return { ...preset, id: id() }
}