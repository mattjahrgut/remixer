import { useState } from 'react'
import { remixContent, mockRemixContent } from './services/api'
import { RemixType } from './types'

function App(): JSX.Element {
  const [inputText, setInputText] = useState<string>('')
  const [outputText, setOutputText] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [selectedRemixType, setSelectedRemixType] = useState<RemixType>('summarize')

  const handleRemix = async (): Promise<void> => {
    if (!inputText.trim()) {
      setError('Please enter some text to remix')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      // Use mock API if in development mode
      const useMock = import.meta.env.VITE_USE_MOCK_API === 'true'
      
      // Add debug logging
      console.log('Using mock API?', useMock)
      console.log('API Key exists?', !!import.meta.env.VITE_ANTHROPIC_API_KEY)
      
      const result = useMock 
        ? await mockRemixContent(inputText, selectedRemixType)
        : await remixContent(inputText, selectedRemixType)
      
      setOutputText(result)
    } catch (err) {
      // Log the full error for debugging
      console.error('Full error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to remix content'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = (): void => {
    setInputText('')
    setOutputText('')
    setError('')
  }

  const handleCopy = (): void => {
    if (outputText) {
      navigator.clipboard.writeText(outputText)
      console.log('Content copied to clipboard!')
    }
  }

  const handleDownload = (): void => {
    if (outputText) {
      const blob = new Blob([outputText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'remixed-content.txt'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">Remixer</h1>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Content Remixing Tool
            </span>
          </div>
          <p className="text-gray-600 mt-2">
            Transform your content with AI-powered remixing
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-4 py-3 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h2 className="font-semibold text-gray-900">Input Content</h2>
                  </div>
                  <span className="text-sm text-gray-500">
                    {inputText.length} characters
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your content here..."
                  className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
                />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remix Type
                </label>
                <select 
                  value={selectedRemixType}
                  onChange={(e) => setSelectedRemixType(e.target.value as RemixType)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="summarize">Summarize - Create a concise summary</option>
                  <option value="expand">Expand - Add more detail and context</option>
                  <option value="simplify">Simplify - Make it easier to understand</option>
                  <option value="creative">Creative Rewrite - Add creative flair</option>
                  <option value="formal">Formal Tone - Make it more professional</option>
                  <option value="casual">Casual Tone - Make it more conversational</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleRemix}
                  disabled={!inputText.trim() || isLoading}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {isLoading ? 'Remixing...' : 'Remix Content'}
                </button>
                
                <button 
                  onClick={handleClear}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Clear
                </button>
              </div>

              {outputText && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Copy
                  </button>
                  
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Download
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Output Section */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-4 py-3 border-b bg-gray-50">
                <div className="flex items-center space-x-2">
                  <h2 className="font-semibold text-gray-900">Remixed Output</h2>
                </div>
              </div>
              
              <div className="p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-2 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
                      <p className="text-gray-600">Remixing content...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-start space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0">⚠️</div>
                    <div>
                      <p className="text-red-700 font-medium">Error</p>
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={outputText}
                    readOnly
                    className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none bg-gray-50 text-gray-900"
                    placeholder="Your remixed content will appear here..."
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App