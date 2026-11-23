export interface BrandPalette {
  primary: string
  accent: string
  divider: string
  textPrimary: string
  textMuted: string
  buttonBg: string
  buttonText: string
}

export interface BrandLogo {
  id: string
  label: string
  file: string
  width: number
  height: number
  naturalWidth: number
  naturalHeight: number
  alt: string
}

export interface BrandBanner {
  id: string
  label: string
  file: string
  width: number
  height?: number
  defaultUrl: string
  alt: string
}

export interface BrandDefaults {
  website: string
  address: string
  tagline: string
  social: {
    linkedin?: string
    facebook?: string
    instagram?: string
    whatsapp?: string
    x?: string
    youtube?: string
  }
  ctas: Array<{ label: string; url: string }>
}

export interface BrandLegalDisclaimer {
  text: string
  locked: boolean
}

export interface BrandLogoBacking {
  enabled: boolean
  color: string
  padding?: string
}

export interface BrandConfig {
  id: string
  name: string
  palette: BrandPalette
  fontFamily: string
  logos: BrandLogo[]
  banners: BrandBanner[]
  defaults: BrandDefaults
  legalDisclaimer: BrandLegalDisclaimer
  logoBacking?: BrandLogoBacking
}