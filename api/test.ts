import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Simple test endpoint
  return res.status(200).json({ 
    message: 'Backend API is working!',
    timestamp: new Date().toISOString(),
    method: req.method 
  })
}
