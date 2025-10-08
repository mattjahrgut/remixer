-- Enable Row Level Security and create public access policies
-- This keeps RLS enabled but allows all users to interact with tweets
-- Good for demo/personal use without authentication

-- Enable RLS on the tweets table
ALTER TABLE tweets ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read all tweets
CREATE POLICY "Enable read access for all users" 
ON tweets FOR SELECT 
USING (true);

-- Allow anyone to insert tweets
CREATE POLICY "Enable insert access for all users" 
ON tweets FOR INSERT 
WITH CHECK (true);

-- Allow anyone to delete tweets
CREATE POLICY "Enable delete access for all users" 
ON tweets FOR DELETE 
USING (true);

-- Verify policies are created
-- You can check in Supabase: Authentication → Policies → tweets table
