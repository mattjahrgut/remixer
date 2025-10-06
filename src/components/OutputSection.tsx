import { FileText, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { OutputSectionProps } from '../types'

export default function OutputSection({ output, isLoading, error }: OutputSectionProps): JSX.Element {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-gray-500" />
          <h2 className="font-semibold text-gray-900">Remixed Output</h2>
          {output && !isLoading && !error && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
        </div>
      </div>
      
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-2" />
              <p className="text-gray-600">Remixing content...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-start space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-700 font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        ) : (
          <textarea
            value={output}
            readOnly
            className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none bg-gray-50 text-gray-900"
            placeholder="Your remixed content will appear here..."
          />
        )}
      </div>
    </div>
  )
}
