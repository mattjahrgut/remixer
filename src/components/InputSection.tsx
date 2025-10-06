import { FileText } from 'lucide-react'
import { InputSectionProps } from '../types'

export default function InputSection({ value, onChange, placeholder }: InputSectionProps): JSX.Element {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Input Content</h2>
          </div>
          <span className="text-sm text-gray-500">
            {value.length} characters
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
        />
      </div>
    </div>
  )
}
