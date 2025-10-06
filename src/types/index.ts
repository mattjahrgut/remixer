// Remix types for the application
export type RemixType = 
  | 'summarize'
  | 'expand' 
  | 'simplify'
  | 'creative'
  | 'formal'
  | 'casual'

// Remix type configuration
export interface RemixTypeConfig {
  id: RemixType
  label: string
  description: string
}

// API response types
export interface ClaudeApiResponse {
  content: Array<{
    text: string
  }>
  id: string
  model: string
  role: string
  stop_reason: string
  stop_sequence: string | null
  type: string
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

// API error response
export interface ApiErrorResponse {
  error: {
    message: string
    type: string
  }
}

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

// Environment variables
export interface ImportMetaEnv {
  readonly VITE_CLAUDE_API_KEY: string
  readonly VITE_CLAUDE_API_URL: string
  readonly VITE_USE_MOCK_API: string
}

export interface ImportMeta {
  readonly env: ImportMetaEnv
}
