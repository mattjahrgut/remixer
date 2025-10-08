import { useState, useEffect } from 'react'
import { remixContent, mockRemixContent, generateTitle, mockGenerateTitle } from './services/api'
import { getSavedTweets, saveTweet, deleteTweet, isSupabaseConfigured } from './services/supabase'
import { SavedTweet } from './types'
import SavedTweets from './components/SavedTweets'

function App(): JSX.Element {
  const [inputText, setInputText] = useState<string>('')
  const [outputText, setOutputText] = useState<string>('')
  const [contentTitle, setContentTitle] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [savedTweets, setSavedTweets] = useState<SavedTweet[]>([])
  const [isSavedTweetsLoading, setIsSavedTweetsLoading] = useState<boolean>(true)
  const [dbConfigured, setDbConfigured] = useState<boolean>(false)

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
      
      // Generate tweets and title in parallel for better performance
      const [result, title] = await Promise.all([
        useMock 
          ? mockRemixContent(inputText, 'tweets')
          : remixContent(inputText, 'tweets'),
        useMock
          ? mockGenerateTitle(inputText)
          : generateTitle(inputText)
      ])
      
      setOutputText(result)
      setContentTitle(title)
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
    setContentTitle('')
    setError('')
  }

  const handleCopy = (): void => {
    if (outputText) {
      navigator.clipboard.writeText(outputText)
      console.log('Content copied to clipboard!')
    }
  }

  const handleCopyTweet = (tweet: string): void => {
    navigator.clipboard.writeText(tweet)
    console.log('Tweet copied to clipboard!')
  }

  const handleTweetNow = (tweet: string): void => {
    // Open Twitter/X with the tweet pre-filled
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`
    window.open(tweetUrl, '_blank')
  }

  // Load saved tweets on mount
  useEffect(() => {
    const checkConfigAndLoadTweets = async () => {
      const configured = isSupabaseConfigured()
      setDbConfigured(configured)
      
      if (configured) {
        const tweets = await getSavedTweets()
        setSavedTweets(tweets)
      }
      setIsSavedTweetsLoading(false)
    }
    
    checkConfigAndLoadTweets()
  }, [])

  // Save a tweet to the database
  const handleSaveTweet = async (tweet: string): Promise<void> => {
    if (!dbConfigured) {
      console.warn('Database not configured')
      return
    }

    const saved = await saveTweet(tweet, inputText, contentTitle)
    if (saved) {
      // Add to the beginning of the list
      setSavedTweets(prev => [saved, ...prev])
      console.log('Tweet saved!')
    }
  }

  // Delete a saved tweet
  const handleDeleteTweet = async (id: string): Promise<void> => {
    const success = await deleteTweet(id)
    if (success) {
      setSavedTweets(prev => prev.filter(tweet => tweet.id !== id))
      console.log('Tweet deleted!')
    }
  }

  // Parse tweets from output text
  const parseTweets = (): string[] => {
    if (!outputText) return []
    
    // Split by numbered format (1., 2., etc.) and clean up
    const lines = outputText.split('\n')
    const tweets: string[] = []
    
    for (const line of lines) {
      // Match lines that start with a number followed by a period
      const match = line.match(/^\d+\.\s*(.+)/)
      if (match) {
        let tweet = match[1].trim()
        
        // Enforce 280 character limit - truncate if needed
        if (tweet.length > 280) {
          tweet = tweet.substring(0, 277) + '...'
          console.warn(`Tweet exceeded 280 characters and was truncated: ${tweet.length} chars`)
        }
        
        tweets.push(tweet)
      }
    }
    
    // Ensure we only return the first 6 tweets to prevent incomplete ones
    return tweets.slice(0, 6)
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
    <div className="min-h-screen bg-black text-white">
      <header className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🐦</span>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white">TweetCraft</h1>
              <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                AI Tweet Generator
              </span>
            </div>
          </div>
          <p className="text-gray-400 mt-3 text-lg font-medium text-center">
            Transform any content into engaging tweets with the power of AI
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Input Section */}
              <div className="space-y-6">
            <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <h2 className="font-bold text-white text-lg">Your Content</h2>
                  </div>
                  <span className="text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-full border border-gray-600">
                    {inputText.length} characters
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your content here to transform it into engaging tweets..."
                  className="w-full h-64 p-4 border-2 border-gray-700 rounded-xl resize-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-black text-white placeholder-gray-500"
                />
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-700 p-6 space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Transform Your Content</h3>
                <p className="text-sm text-gray-400">Convert any text into 6 engaging tweets</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleRemix}
                  disabled={!inputText.trim() || isLoading}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                    isLoading 
                      ? 'bg-blue-600 animate-pulse scale-95' 
                      : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                  } disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {isLoading ? '✨ Crafting Tweets...' : '🚀 Generate Tweets'}
                </button>
                
                <button 
                  onClick={handleClear}
                  className="px-4 py-3 bg-gray-700 border-2 border-gray-600 text-gray-300 rounded-xl font-medium hover:bg-gray-600 hover:border-gray-500 transition-all duration-200"
                >
                  Clear
                </button>
              </div>

                </div>
              </div>

              {/* Output Section */}
              <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <h2 className="font-bold text-white text-lg">
                    ✨ Tweet Magic
                    {contentTitle && (
                      <span className="ml-3 text-sm font-normal text-blue-400">
                        "{contentTitle}"
                      </span>
                    )}
                  </h2>
                </div>
                <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full border border-gray-600">
                  AI-Powered
                </span>
              </div>
            </div>
            
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-80">
                      <div className="text-center space-y-4">
                        <div className="relative">
                          <div className="h-12 w-12 animate-spin text-blue-500 mx-auto border-4 border-gray-600 border-t-blue-500 rounded-full"></div>
                          <div className="absolute inset-0 h-12 w-12 animate-ping text-blue-400 mx-auto border-4 border-blue-400 rounded-full opacity-75"></div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-gray-300 font-semibold">✨ Crafting Your Tweets</p>
                          <p className="text-gray-400 text-sm">AI is working its magic...</p>
                        </div>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="flex items-start space-x-3 p-6 bg-red-900/20 border-2 border-red-700 rounded-xl">
                      <div className="h-6 w-6 text-red-400 mt-0.5 flex-shrink-0">⚠️</div>
                      <div>
                        <p className="text-red-300 font-semibold">Oops! Something went wrong</p>
                        <p className="text-red-400 text-sm mt-1">{error}</p>
                      </div>
                    </div>
                  ) : outputText ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {parseTweets().map((tweet, index) => (
                          <div 
                            key={index}
                            className="bg-black border-2 border-gray-700 rounded-xl p-4 hover:border-gray-600 hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-blue-400 bg-blue-900/30 px-2 py-1 rounded-full">
                                    Tweet {index + 1}
                                  </span>
                                  <span className={`text-xs ${tweet.length > 280 ? 'text-red-400 font-bold' : tweet.length > 260 ? 'text-yellow-400' : 'text-gray-400'}`}>
                                    {tweet.length}/280
                                  </span>
                                </div>
                              </div>
                              <p className="text-white leading-relaxed whitespace-pre-wrap text-sm">
                                {tweet}
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleTweetNow(tweet)}
                                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm text-sm"
                                  title="Tweet this on X"
                                >
                                  🐦 Tweet
                                </button>
                                <button
                                  onClick={() => handleCopyTweet(tweet)}
                                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm text-sm"
                                  title="Copy this tweet"
                                >
                                  📋 Copy
                                </button>
                                {dbConfigured && (
                                  <button
                                    onClick={() => handleSaveTweet(tweet)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm text-sm"
                                    title="Save this tweet"
                                  >
                                    💾
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-3 mt-6 pt-4 border-t-2 border-gray-700">
                        <button
                          onClick={handleCopy}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                        >
                          📋 Copy All Tweets
                        </button>
                        
                        <button
                          onClick={handleDownload}
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                        >
                          💾 Download
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-80 text-gray-400">
                      <p>Your amazing tweets will appear here...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Saved Tweets Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 h-[calc(100vh-6rem)]">
              <SavedTweets 
                tweets={savedTweets}
                onDelete={handleDeleteTweet}
                onCopy={handleCopyTweet}
                onTweet={handleTweetNow}
                isLoading={isSavedTweetsLoading}
              />
              {!dbConfigured && !isSavedTweetsLoading && (
                <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-700 rounded-xl">
                  <p className="text-yellow-300 text-sm">
                    ⚠️ Database not configured. Add Supabase credentials to enable saving tweets.
                  </p>
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