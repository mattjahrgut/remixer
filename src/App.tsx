import { useState } from 'react'
import { remixContent, mockRemixContent } from './services/api'

function App(): JSX.Element {
  const [inputText, setInputText] = useState<string>('')
  const [outputText, setOutputText] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

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
        ? await mockRemixContent(inputText, 'tweets')
        : await remixContent(inputText, 'tweets')
      
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <header className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 shadow-xl border-b-4 border-orange-300">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white drop-shadow-lg">TweetCraft</h1>
              <span className="text-sm text-orange-100 bg-white/20 px-3 py-1 rounded-full border border-white/30 backdrop-blur-sm">
                AI Tweet Generator
              </span>
            </div>
          </div>
          <p className="text-orange-100 mt-3 text-lg font-medium drop-shadow-md text-center">
            Transform any content into engaging tweets with the power of AI
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-orange-100 to-amber-100 border-b border-orange-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <h2 className="font-bold text-orange-900 text-lg">Your Content</h2>
                  </div>
                  <span className="text-sm text-orange-700 bg-white px-3 py-1 rounded-full border border-orange-200">
                    {inputText.length} characters
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your content here to transform it into engaging tweets..."
                  className="w-full h-64 p-4 border-2 border-orange-200 rounded-xl resize-none focus:ring-4 focus:ring-orange-300 focus:border-orange-400 outline-none transition-all duration-200 bg-white/50"
                />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-lg border border-orange-100 p-6 space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">Transform Your Content</h3>
                <p className="text-sm text-orange-700">Convert any text into 5 engaging tweets</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleRemix}
                  disabled={!inputText.trim() || isLoading}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                    isLoading 
                      ? 'bg-gradient-to-r from-orange-400 to-amber-500 animate-pulse scale-95' 
                      : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                  } disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {isLoading ? '✨ Crafting Tweets...' : '🚀 Generate Tweets'}
                </button>
                
                <button 
                  onClick={handleClear}
                  className="px-4 py-3 bg-white border-2 border-orange-200 text-orange-700 rounded-xl font-medium hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
                >
                  Clear
                </button>
              </div>

            </div>
          </div>

          {/* Output Section */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl shadow-lg border border-teal-100 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-teal-100 to-cyan-100 border-b border-teal-200">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse"></div>
                <h2 className="font-bold text-teal-900 text-lg">✨ Tweet Magic</h2>
                <span className="text-xs text-teal-700 bg-white px-2 py-1 rounded-full border border-teal-200">
                  AI-Powered
                </span>
              </div>
            </div>
            
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-80">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <div className="h-12 w-12 animate-spin text-teal-500 mx-auto border-4 border-teal-200 border-t-teal-500 rounded-full"></div>
                      <div className="absolute inset-0 h-12 w-12 animate-ping text-teal-300 mx-auto border-4 border-teal-300 rounded-full opacity-75"></div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-teal-700 font-semibold">✨ Crafting Your Tweets</p>
                      <p className="text-teal-600 text-sm">AI is working its magic...</p>
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-start space-x-3 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
                  <div className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0">⚠️</div>
                  <div>
                    <p className="text-red-700 font-semibold">Oops! Something went wrong</p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                </div>
              ) : (
                <textarea
                  value={outputText}
                  readOnly
                  className="w-full h-80 p-4 border-2 border-teal-200 rounded-xl resize-none bg-white/70 text-gray-900 font-mono text-sm leading-relaxed"
                  placeholder="Your amazing tweets will appear here..."
                />
              )}
              
              {outputText && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleCopy}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                  >
                    📋 Copy Tweets
                  </button>
                  
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                  >
                    💾 Download
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App