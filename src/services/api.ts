import Anthropic from '@anthropic-ai/sdk'
import { RemixType } from '../types'

const TWEET_PROMPT = "Create exactly 6 tweets from the following text. CRITICAL: Each tweet MUST be under 280 characters (aim for 270 to be safe). Count carefully before including each tweet. Maintain the tone of the original text. Format each tweet with a number (1., 2., 3., 4., 5., 6.) on a new line. Do not include any additional text or incomplete tweets:"

const TITLE_PROMPT = "Create a catchy, short title (maximum 5 words) for the following content. Respond with ONLY the title, no quotes, no explanation:"

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true, // Required for browser environments
})

export const remixContent = async (content: string, _remixType: RemixType): Promise<string> => {
  try {
    const prompt = `${TWEET_PROMPT}\n\n${content}`
    
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5", // Using the latest Claude Sonnet model
      max_tokens: 1024,
      messages: [{ 
        role: "user", 
        content: prompt 
      }],
    })

    // Extract text content from the response
    const textContent = message.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content received from Claude')
    }

    return textContent.text
  } catch (error) {
    console.error('Anthropic API Error:', error)
    
    if (error instanceof Anthropic.APIError) {
      if (error.status === 401) {
        throw new Error('Invalid API key. Please check your Anthropic API key.')
      } else if (error.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.')
      } else {
        throw new Error(error.message || 'API Error occurred')
      }
    } else {
      throw new Error('Failed to remix content. Please try again.')
    }
  }
}

// Generate a short title for the content
export const generateTitle = async (content: string): Promise<string> => {
  try {
    const prompt = `${TITLE_PROMPT}\n\n${content}`
    
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 50,
      messages: [{ 
        role: "user", 
        content: prompt 
      }],
    })

    const textContent = message.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content received from Claude')
    }

    return textContent.text.trim()
  } catch (error) {
    console.error('Error generating title:', error)
    // Return a default title on error
    return 'Untitled Content'
  }
}

// Mock function for title generation
export const mockGenerateTitle = async (content: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const words = content.split(' ').slice(0, 3).join(' ')
  return words.length > 30 ? words.slice(0, 30) + '...' : words
}

// Mock function for development/testing
export const mockRemixContent = async (content: string, _remixType: RemixType): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Generate mock tweets based on the input content
  const contentPreview = content.slice(0, 100)
  
  return `1. ${contentPreview}... This is the first tweet that captures the essence of your content in under 280 characters! 🚀

2. Building on the main theme: ${contentPreview.slice(0, 50)}... Here's another perspective on your original text.

3. Key insight from your content: ${contentPreview.slice(0, 60)}... A third tweet that maintains the original tone and message.

4. Final thoughts: ${contentPreview.slice(0, 70)}... This tweet wraps up the key points in a concise format.

5. Summary tweet: ${contentPreview.slice(0, 80)}... The fifth tweet that ties everything together while staying under the character limit.

6. Bonus insight: ${contentPreview.slice(0, 90)}... A sixth tweet that adds extra value and completes your tweet thread.`
}
