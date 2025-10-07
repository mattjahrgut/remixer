import Anthropic from '@anthropic-ai/sdk'
import { RemixType } from '../types'

const TWEET_PROMPT = "Create 5 tweets from the following text. Each tweet should be under 280 characters and maintain the tone of the original text. Format each tweet with a number (1., 2., etc.) on a new line:"

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

5. Summary tweet: ${contentPreview.slice(0, 80)}... The last tweet that ties everything together while staying under the character limit.`
}
