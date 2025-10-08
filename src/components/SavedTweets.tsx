import { SavedTweet } from '../types'

interface SavedTweetsProps {
  tweets: SavedTweet[]
  onDelete: (id: string) => void
  onCopy: (text: string) => void
  onTweet: (text: string) => void
  isLoading: boolean
}

function SavedTweets({ tweets, onDelete, onCopy, onTweet, isLoading }: SavedTweetsProps): JSX.Element {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown date'
    
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-700 h-full flex flex-col">
      <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h2 className="font-bold text-white text-lg">💾 Saved Tweets</h2>
          </div>
          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full border border-gray-600">
            {tweets.length} {tweets.length === 1 ? 'tweet' : 'tweets'}
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="h-8 w-8 animate-spin text-blue-500 mx-auto border-4 border-gray-600 border-t-blue-500 rounded-full"></div>
              <p className="text-gray-400 text-sm">Loading tweets...</p>
            </div>
          </div>
        ) : tweets.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-center p-6">
            <div className="space-y-2">
              <div className="text-4xl mb-3">🐦</div>
              <p className="text-sm">No saved tweets yet.</p>
              <p className="text-xs text-gray-500">Generate and save tweets to see them here!</p>
            </div>
          </div>
        ) : (
          tweets.map((tweet) => (
            <div 
              key={tweet.id}
              className="bg-black border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all duration-200"
            >
              <div className="space-y-3">
                {tweet.title && (
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-800">
                    <span className="text-xs font-semibold text-blue-400 bg-blue-900/30 px-2 py-1 rounded-full">
                      {tweet.title}
                    </span>
                  </div>
                )}
                
                <div className="flex items-start justify-between gap-2">
                  <p className="text-white text-sm leading-relaxed flex-1 whitespace-pre-wrap">
                    {tweet.tweet_text}
                  </p>
                  <button
                    onClick={() => tweet.id && onDelete(tweet.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1"
                    title="Delete tweet"
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {formatDate(tweet.created_at)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {tweet.tweet_text.length} chars
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onTweet(tweet.tweet_text)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                    title="Tweet this"
                  >
                    🐦 Tweet
                  </button>
                  <button
                    onClick={() => onCopy(tweet.tweet_text)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                    title="Copy tweet"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SavedTweets
