import { useState } from 'react'
import { Sparkles, Trash2, Copy, Download } from 'lucide-react'
import { RemixControlsProps, RemixType, RemixTypeConfig } from '../types'

const REMIX_TYPES: RemixTypeConfig[] = [
  { id: 'summarize', label: 'Summarize', description: 'Create a concise summary' },
  { id: 'expand', label: 'Expand', description: 'Add more detail and context' },
  { id: 'simplify', label: 'Simplify', description: 'Make it easier to understand' },
  { id: 'creative', label: 'Creative Rewrite', description: 'Add creative flair' },
  { id: 'formal', label: 'Formal Tone', description: 'Make it more professional' },
  { id: 'casual', label: 'Casual Tone', description: 'Make it more conversational' }
]

export default function RemixControls({ 
  onRemix, 
  onClear, 
  onCopy, 
  onDownload, 
  isLoading, 
  hasOutput,
  disabled 
}: RemixControlsProps): JSX.Element {
  const [selectedType, setSelectedType] = useState<RemixType>('summarize')

  const handleRemix = (): void => {
    onRemix(selectedType)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Remix Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as RemixType)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        >
          {REMIX_TYPES.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label} - {type.description}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleRemix}
          disabled={disabled || isLoading}
          className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Sparkles className="h-4 w-4" />
          <span>{isLoading ? 'Remixing...' : 'Remix Content'}</span>
        </button>
        
        <button
          onClick={onClear}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear</span>
        </button>
      </div>

      {hasOutput && (
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Copy className="h-4 w-4" />
            <span>Copy</span>
          </button>
          
          <button
            onClick={onDownload}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      )}
    </div>
  )
}
