# Supabase Database Setup Guide

This guide will help you set up Supabase to save your generated tweets.

## What is Supabase?

Supabase is a simple, free online database service (like Firebase). It's perfect for beginners because:
- Free tier is very generous
- No backend server code needed
- Easy to set up and use
- Web-based dashboard to view your data

## Step-by-Step Setup

### 1. Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign up"
3. Sign up with GitHub, Google, or email

### 2. Create a New Project

1. Once logged in, click "New Project"
2. Fill in the details:
   - **Name**: TweetCraft (or any name you like)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the region closest to you
   - **Pricing Plan**: Select "Free" (no credit card required)
3. Click "Create new project"
4. Wait 1-2 minutes for your project to be set up

### 3. Create the Tweets Table

1. In your project dashboard, click on the **"Table Editor"** icon in the left sidebar (looks like a table grid)
2. Click "Create a new table"
3. Fill in the table details:
   - **Name**: `tweets`
   - **Description**: Saved generated tweets
   - Enable **"Enable Row Level Security (RLS)"** - UNCHECK this box for simplicity (or see security section below)
4. Add the following columns (click "+ Add column" for each):

   | Column Name | Type | Default Value | Primary | Required |
   |-------------|------|---------------|---------|----------|
   | id | uuid | gen_random_uuid() | Yes ✓ | Yes ✓ |
   | created_at | timestamptz | now() | No | Yes ✓ |
   | tweet_text | text | (none) | No | Yes ✓ |
   | original_content | text | (none) | No | No |

5. Click "Save" to create the table

**Visual Guide for Columns:**
- **id**: This is auto-generated, keep all defaults
- **created_at**: Keep the default value as `now()` - this timestamps each tweet
- **tweet_text**: This stores the actual tweet content
- **original_content**: This optionally stores what content the tweet was generated from

### 4. Get Your API Keys

1. Click on the **"Settings"** icon (gear icon) in the left sidebar
2. Click on **"API"** in the settings menu
3. You'll see two important values:
   - **Project URL**: Something like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`
4. Keep this page open or copy these values somewhere safe

### 5. Add Keys to Your Project

1. In your code editor, create a file called `.env.local` in your project root (same folder as `package.json`)
2. Add these two lines (replace with your actual values):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: 
- Replace `https://your-project-id.supabase.co` with YOUR actual Project URL
- Replace `your-anon-key-here` with YOUR actual anon public key
- Make sure there are NO spaces around the `=` sign
- Make sure the file is named `.env.local` (with the dot at the start)

### 6. Restart Your Development Server

1. Stop your development server if it's running (press `Ctrl+C` in the terminal)
2. Start it again: `npm run dev`
3. The app should now connect to your Supabase database!

## Verify It's Working

1. Generate some tweets in your app
2. Click the "💾 Save" button on a tweet
3. The tweet should appear in the right sidebar under "Saved Tweets"
4. You can also verify in Supabase:
   - Go to your Supabase dashboard
   - Click "Table Editor"
   - Click on the "tweets" table
   - You should see your saved tweets there!

## Optional: Security Setup (Row Level Security)

If you want to add basic security to prevent others from accessing your data:

1. In Supabase, go to **Authentication** → **Policies**
2. Select your `tweets` table
3. Enable RLS (Row Level Security)
4. Add policies for:
   - **INSERT**: Allow all (for saving tweets)
   - **SELECT**: Allow all (for viewing tweets)
   - **DELETE**: Allow all (for deleting tweets)

For production apps, you'd want to add authentication and restrict access to only logged-in users, but for personal use, the simple setup above is fine.

## Troubleshooting

### "Database not configured" warning appears

- Make sure your `.env.local` file exists in the project root
- Make sure both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly
- Make sure you restarted your dev server after creating the `.env.local` file

### Can't save tweets / No error but tweets don't save

- Check the browser console (F12) for errors
- Make sure Row Level Security is DISABLED on your tweets table, or that you've added appropriate policies
- Verify the table structure matches exactly (column names are case-sensitive)

### "Failed to fetch" or network errors

- Make sure your Project URL is correct
- Make sure you have an internet connection
- Check if the Supabase project is still active (free tier projects pause after inactivity)

## Cost

The free tier includes:
- 500 MB database space
- 50,000 monthly active users
- 2 GB file storage
- 5 GB bandwidth

This is MORE than enough for personal use and thousands of tweets!

## What's Next?

Once your database is set up, you can:
- Save any generated tweet by clicking the 💾 button
- View all saved tweets in the right sidebar
- Delete saved tweets by clicking the 🗑️ icon
- Copy saved tweets to clipboard
- Tweet them directly to X/Twitter

Your tweets are now safely stored in the cloud and will persist even if you close your browser!
