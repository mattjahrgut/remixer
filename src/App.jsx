import { useState } from 'react'
import Header from './components/Header'
import InputSection from './components/InputSection'
import OutputSection from './components/OutputSection'
import RemixControls from './components/RemixControls'
import { remixContent, mockRemixContent } from './services/api'

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRemix = async (remixType) => {
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
      console.log('API Key exists?', !!import.meta.env.VITE_CLAUDE_API_KEY)
      
      const result = useMock 
        ? await mockRemixContent(inputText, remixType)
        : await remixContent(inputText, remixType)
      
      setOutputText(result)
    } catch (err) {
      // Log the full error for debugging
      console.error('Full error:', err)
      setError(err.message || 'Failed to remix content')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setInputText('')
    setOutputText('')
    setError('')
  }

  const handleCopy = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText)
      // You could add a toast notification here
      console.log('Content copied to clipboard!')
    }
  }

  const handleDownload = () => {
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
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <InputSection 
              value={inputText}
              onChange={setInputText}
              placeholder="Paste your content here..."
            />
            
            <RemixControls 
              onRemix={handleRemix}
              onClear={handleClear}
              onCopy={handleCopy}
              onDownload={handleDownload}
              isLoading={isLoading}
              hasOutput={!!outputText}
              disabled={!inputText.trim()}
            />
          </div>

          {/* Output Section */}
          <div>
            <OutputSection 
              output={outputText}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
