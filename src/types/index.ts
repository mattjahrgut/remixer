// Remix types for the application
export type RemixType = 'tweets'

// Remix type configuration
export interface RemixTypeConfig {
  id: RemixType
  label: string
  description: string
}

// Database types
export interface SavedTweet {
  id?: string
  tweet_text: string
  original_content?: string
  created_at?: string
}

// Note: API response types are now handled by the Anthropic SDK

// Component prop types
export interface InputSectionProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
}

export interface OutputSectionProps {
  output: string
  isLoading: boolean
  error: string
}

export interface RemixControlsProps {
  onRemix: (remixType: RemixType) => void
  onClear: () => void
  onCopy: () => void
  onDownload: () => void
  isLoading: boolean
  hasOutput: boolean
  disabled: boolean
}

