import axios, { AxiosError } from 'axios'
import { RemixType, ClaudeApiResponse, ApiErrorResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_CLAUDE_API_URL || 'https://api.anthropic.com/v1'

const REMIX_PROMPTS: Record<RemixType, string> = {
  summarize: "Please summarize the following content in a concise and clear way, highlighting the key points:",
  expand: "Please expand the following content with more detail, examples, and context while maintaining the original meaning:",
  simplify: "Please simplify the following content to make it easier to understand for a general audience, using simpler language:",
  creative: "Please rewrite the following content with a creative and engaging style, adding personality and flair:",
  formal: "Please rewrite the following content in a more formal and professional tone, suitable for business or academic contexts:",
  casual: "Please rewrite the following content in a casual and conversational tone, as if speaking to a friend:"
}

export const remixContent = async (content: string, remixType: RemixType): Promise<string> => {
  try {
    const prompt = `${REMIX_PROMPTS[remixType]}\n\n${content}`
    
    const response = await axios.post<ClaudeApiResponse>(`${API_BASE_URL}/messages`, {
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    })

    return response.data.content[0].text
  } catch (error) {
    console.error('API Error:', error)
    
    const axiosError = error as AxiosError<ApiErrorResponse>
    
    if (axiosError.response?.status === 401) {
      throw new Error('Invalid API key. Please check your Claude API key.')
    } else if (axiosError.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.')
    } else if (axiosError.response?.data?.error) {
      throw new Error(axiosError.response.data.error.message || 'API Error occurred')
    } else {
      throw new Error('Failed to remix content. Please try again.')
    }
  }
}

// Mock function for development/testing
export const mockRemixContent = async (content: string, remixType: RemixType): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const mockResponses: Record<RemixType, string> = {
    summarize: `Here's a summary of your content:\n\nKey points:\n• ${content.slice(0, 50)}...\n• Main theme: Content transformation\n• Purpose: Information processing\n\nThis summary captures the essential information in a concise format.`,
    
    expand: `Here's an expanded version of your content with more detail:\n\nOriginal: ${content}\n\nExpanded with context:\n• Background information that provides additional context\n• Examples that illustrate the main points\n• Related concepts that enhance understanding\n• Detailed explanations that clarify complex ideas\n\nThis expanded version offers comprehensive information while maintaining clarity.`,
    
    simplify: `Here's a simplified version:\n\nSimple version: ${content.replace(/complex/g, 'simple').replace(/difficult/g, 'easy').replace(/complicated/g, 'straightforward')}\n\nKey points in simple terms:\n• Easy-to-understand language\n• Clear explanations\n• No jargon or technical terms\n• Straightforward structure\n\nThis version makes the content accessible to everyone.`,
    
    creative: `🌟 Here's a creatively rewritten version:\n\n"${content}" ✨\n\nTransformed with creative flair:\n• Engaging storytelling elements\n• Vivid descriptions and imagery\n• Dynamic language that captivates\n• Personality and character that shines through\n\nThis creative version brings your content to life! 🎨`,
    
    formal: `Respected content as follows:\n\nProfessional Analysis:\n${content}\n\nFormal presentation includes:\n• Appropriate business terminology\n• Structured professional format\n• Respectful and authoritative tone\n• Clear, concise communication\n\nThis formal version maintains professional standards and credibility.`,
    
    casual: `Hey! Here's your content in a more casual way:\n\n"${content}" 😊\n\nCasual breakdown:\n• Friendly, conversational tone\n• Like chatting with a friend\n• Relaxed and approachable\n• Easy-going style\n\nPretty cool, right? This version feels natural and relatable! 👍`
  }
  
  return mockResponses[remixType] || mockResponses.summarize
}
