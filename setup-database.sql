-- Create the tweets table for TweetCraft
CREATE TABLE IF NOT EXISTS tweets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  tweet_text TEXT NOT NULL,
  original_content TEXT,
  title TEXT
);

-- Create an index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS tweets_created_at_idx ON tweets(created_at DESC);

-- Optional: Enable Row Level Security (RLS)
-- ALTER TABLE tweets ENABLE ROW LEVEL SECURITY;

-- Optional: Create policies for public access (only if RLS is enabled)
-- CREATE POLICY "Enable read access for all users" ON tweets FOR SELECT USING (true);
-- CREATE POLICY "Enable insert access for all users" ON tweets FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Enable delete access for all users" ON tweets FOR DELETE USING (true);
