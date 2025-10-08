import Anthropic from '@anthropic-ai/sdk'
import type { VercelRequest, VercelResponse } from '@vercel/node'

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT = 10 // requests per hour
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const userLimit = rateLimitMap.get(ip)

  if (!userLimit || now > userLimit.resetTime) {
    // New window
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return { allowed: true, remaining: RATE_LIMIT - 1 }
  }

  if (userLimit.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  userLimit.count++
  return { allowed: true, remaining: RATE_LIMIT - userLimit.count }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Get IP for rate limiting
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown'
  
  // Check rate limit
  const rateLimit = checkRateLimit(ip)
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString())
  
  if (!rateLimit.allowed) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded. Please try again in an hour.',
      retryAfter: 3600 
    })
  }

  try {
    // Check if API key exists
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not found in environment')
      return res.status(500).json({ error: 'API configuration error' })
    }

    const { content } = req.body

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Content is required' })
    }

    if (content.length > 10000) {
      return res.status(400).json({ error: 'Content too long (max 10,000 characters)' })
    }

    console.log('Generating tweets for content length:', content.length)

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    })

    const TWEET_PROMPT = "Create exactly 6 tweets from the following text. CRITICAL: Each tweet MUST be under 280 characters (aim for 270 to be safe). Count carefully before including each tweet. Maintain the tone of the original text. Format each tweet with a number (1., 2., 3., 4., 5., 6.) on a new line. Do not include any additional text or incomplete tweets:"

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: [{ 
        role: "user", 
        content: `${TWEET_PROMPT}\n\n${content}`
      }],
    })

    const textContent = message.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content received from Claude')
    }

    console.log('Successfully generated tweets')

    return res.status(200).json({ 
      tweets: textContent.text,
      remaining: rateLimit.remaining
    })

  } catch (error: any) {
    console.error('API Error:', error)
    
    if (error instanceof Anthropic.APIError) {
      if (error.status === 401) {
        return res.status(500).json({ error: 'API configuration error' })
      } else if (error.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' })
      }
    }
    
    return res.status(500).json({ error: 'Failed to generate tweets' })
  }
}