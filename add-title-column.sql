-- Add title column to existing tweets table
-- Run this in Supabase SQL Editor if you already created the tweets table

ALTER TABLE tweets ADD COLUMN IF NOT EXISTS title TEXT;
