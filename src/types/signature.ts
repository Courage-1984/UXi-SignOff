export type TemplateId =
  | 'classic-split'
  | 'compact-stacked'
  | 'executive-card'
  | 'modern-minimal'
  | 'accent-sidebar'
  | 'header-strip'
  | 'dual-visual'

export type BlockId = 'identity' | 'cta' | 'social' | 'banner' | 'legal'

export type PrimaryFlow = 'row' | 'row-reverse' | 'column' | 'column-reverse'
export type BlockAlign = 'top' | 'middle' | 'bottom'
export type AxisAlign = 'left' | 'center' | 'right'
export type BlockDirection = 'row' | 'column'
export type TextDensity = 'tight' | 'normal' | 'relaxed'
export type LogoBackingMode = 'none' | 'white-card' | 'rounded-box' | 'brand-default'
export type SocialDisplayMode = 'icons' | 'text' | 'icon-label'
export type SocialSeparator = 'pipe' | 'bullet' | 'slash'
export type SocialIconVariant = 'neutral' | 'circle-filled'
export type CustomFieldType = 'text' | 'url' | 'phone' | 'email'

export interface BlockConfig {
  id: BlockId
  enabled: boolean
}

export interface IdentityFields {
  fullName: string
  jobTitle: string
  department: string
  mobile: string
  email: string
  website: string
  address: string
  tagline: string
}

export interface CustomField {
  id: string
  label: string
  value: string
  type: CustomFieldType
  href?: string
  visible: boolean
}

export interface CtaFields {
  buttons: Array<{ label: string; url: string; enabled: boolean }>
  layout: CtaLayout
}

export interface CtaLayout {
  direction: BlockDirection
  align: AxisAlign
}

export interface SocialNetworkToggle {
  enabled: boolean
  url: string
}

export interface SocialFields {
  linkedin: SocialNetworkToggle
  facebook: SocialNetworkToggle
  instagram: SocialNetworkToggle
  whatsapp: SocialNetworkToggle
  x: SocialNetworkToggle
  youtube: SocialNetworkToggle
  tiktok: SocialNetworkToggle
  websiteGlobe: SocialNetworkToggle
  displayMode: SocialDisplayMode
  separator: SocialSeparator
  iconVariant: SocialIconVariant
  layout: SocialLayout
  /** @deprecated use displayMode */
  useIcons?: boolean
}

export interface SocialLayout {
  direction: BlockDirection
  align: AxisAlign
}

export interface BannerFields {
  bannerId: string
  url: string
  appendUtm: boolean
  utmCampaign: string
}

export interface LegalFields {
  text: string
  fontSizePx: number
  showDivider: boolean
  unlockedOverride: boolean
}

export interface LayoutSettings {
  primaryFlow: PrimaryFlow
  blockAlign: BlockAlign
}

export interface DividerSettings {
  visible: boolean
  thicknessPx: number
  style: 'solid' | 'dashed' | 'dotted'
  orientation: 'vertical' | 'horizontal'
}

export interface SpacingSettings {
  outerPaddingPx: number
  columnGapPx: number
  blockGapPx: number
  density: TextDensity
  divider: DividerSettings
}

export interface LogoRenderSettings {
  maxWidthPx: number
  maxHeightPx: number
  backingMode: LogoBackingMode
}

export interface HeadshotFields {
  enabled: boolean
  url: string
  sizePx: number
}

export interface PaletteOverride {
  enabled: boolean
  palette: Partial<import('./brand').BrandPalette>
}

export interface ShareableTemplateSlice {
  brandId: string
  templateId: TemplateId
  layout: LayoutSettings
  spacing: SpacingSettings
  logoId: string
  logoRender: LogoRenderSettings
  blocks: BlockConfig[]
  banner: Omit<BannerFields, never>
  social: Pick<SocialFields, 'displayMode' | 'separator' | 'iconVariant' | 'layout'>
}

export interface SignatureFormState {
  brandId: string
  templateId: TemplateId
  blocks: BlockConfig[]
  logoId: string
  layout: LayoutSettings
  spacing: SpacingSettings
  logoRender: LogoRenderSettings
  headshot: HeadshotFields
  identity: IdentityFields
  customFields: CustomField[]
  cta: CtaFields
  social: SocialFields
  banner: BannerFields
  legal: LegalFields
  paletteOverride: PaletteOverride
}

export interface CompileOptions {
  assetBaseUrl: string
}