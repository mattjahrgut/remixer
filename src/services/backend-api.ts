import { RemixType } from '../types'

/**
 * Backend API service - calls our secure serverless functions
 * API key is never exposed to the browser
 */

const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3002/api'

interface GenerateTweetsResponse {
  tweets: string
  remaining?: number
}

interface ErrorResponse {
  error: string
}

/**
 * Generate tweets using the backend API
 */
export const remixContent = async (content: string, _remixType: RemixType): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE}/generate-tweets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })

    if (!response.ok) {
      const error: ErrorResponse = await response.json()
      throw new Error(error.error || 'Failed to generate tweets')
    }

    const data: GenerateTweetsResponse = await response.json()
    
    // Log remaining requests for user awareness
    if (data.remaining !== undefined) {
      console.log(`Rate limit: ${data.remaining} requests remaining this hour`)
    }
    
    return data.tweets
  } catch (error) {
    console.error('Backend API Error:', error)
    
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error('Failed to generate tweets. Please try again.')
  }
}

/**
 * Generate title - for now, return a simple title
 * We'll add a proper title endpoint later
 */
export const generateTitle = async (content: string): Promise<string> => {
  // Simple title generation for now
  const words = content.split(' ').slice(0, 3).join(' ')
  return words.length > 30 ? words.slice(0, 30) + '...' : words
}

/**
 * Mock functions for development (when backend is not available)
 */
export const mockRemixContent = async (content: string, _remixType: RemixType): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const contentPreview = content.slice(0, 100)
  
  return `1. ${contentPreview}... This is the first tweet that captures the essence of your content in under 280 characters! 🚀

2. Building on the main theme: ${contentPreview.slice(0, 50)}... Here's another perspective on your original text.

3. Key insight from your content: ${contentPreview.slice(0, 60)}... A third tweet that maintains the original tone and message.

4. Final thoughts: ${contentPreview.slice(0, 70)}... This tweet wraps up the key points in a concise format.

5. Summary tweet: ${contentPreview.slice(0, 80)}... The fifth tweet that ties everything together while staying under the character limit.

6. Bonus insight: ${contentPreview.slice(0, 90)}... A sixth tweet that adds extra value and completes your tweet thread.`
}

export const mockGenerateTitle = async (content: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const words = content.split(' ').slice(0, 3).join(' ')
  return words.length > 30 ? words.slice(0, 30) + '...' : words
}