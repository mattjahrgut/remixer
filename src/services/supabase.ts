import { createClient } from '@supabase/supabase-js'
import { SavedTweet } from '../types'

// Initialize Supabase client
// These will be set via environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Save a tweet to the database
 */
export const saveTweet = async (tweetText: string, originalContent?: string, title?: string): Promise<SavedTweet | null> => {
  try {
    const { data, error } = await supabase
      .from('tweets')
      .insert([
        {
          tweet_text: tweetText,
          original_content: originalContent,
          title: title,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error saving tweet:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error saving tweet:', error)
    return null
  }
}

/**
 * Get all saved tweets, ordered by most recent first
 */
export const getSavedTweets = async (): Promise<SavedTweet[]> => {
  try {
    const { data, error } = await supabase
      .from('tweets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tweets:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching tweets:', error)
    return []
  }
}

/**
 * Delete a tweet by ID
 */
export const deleteTweet = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tweets')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting tweet:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting tweet:', error)
    return false
  }
}

/**
 * Check if Supabase is properly configured
 */
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '')
}
