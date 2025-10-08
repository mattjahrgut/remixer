# Deployment Guide - TweetCraft

## Quick Deployment to Vercel (Approach A)

### Prerequisites
- ✅ GitHub repo (already set up!)
- ✅ Supabase database (already set up!)
- ✅ Anthropic API key

### Step 1: Enable RLS in Supabase

1. Go to your Supabase dashboard
2. Click **SQL Editor**
3. Click **New Query**
4. Paste the contents of `enable-rls-policies.sql`
5. Click **Run**

This enables Row Level Security while allowing public access (safe for demo).

### Step 2: Set Usage Limit in Anthropic

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Click **Settings** → **Billing**
3. Set a **monthly spending limit** (e.g., $10-20)
4. This prevents surprise bills if someone abuses your demo

### Step 3: Deploy to Vercel

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Sign up for Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Sign Up"
   - Choose "Continue with GitHub"
   - Authorize Vercel

3. **Import your project:**
   - Click "Add New" → "Project"
   - Find `remixer` in your repo list
   - Click "Import"

4. **Configure the project:**
   - **Framework Preset:** Vite (should auto-detect)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `dist` (auto-filled)

5. **Add Environment Variables:**
   Click "Environment Variables" and add these:
   
   | Name | Value |
   |------|-------|
   | `VITE_ANTHROPIC_API_KEY` | Your Anthropic API key |
   | `VITE_SUPABASE_URL` | Your Supabase project URL |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
   | `VITE_USE_MOCK_API` | `false` |

6. **Click "Deploy"**
   - Vercel will build and deploy your app
   - Takes ~2-3 minutes
   - You'll get a URL like `remixer-xxx.vercel.app`

7. **Test it!**
   - Visit your new URL
   - Generate some tweets
   - Save them to verify database works

### Step 4: Share with Friends

Your app is now live! Share the URL with your friends.

**⚠️ Important Notes:**
- Monitor your Anthropic usage at console.anthropic.com
- The API key is technically exposed in browser (this is the trade-off for simplicity)
- For production use, you'll want to implement Approach B (backend API)

### Automatic Updates

Going forward, any time you push to GitHub:
```bash
git add .
git commit -m "New features"
git push origin main
```

Vercel will automatically rebuild and redeploy! 🚀

---

## Next Steps: Approach B (Secure Backend)

Once the quick deployment is working, we'll upgrade to a secure backend that:
- Hides your API key completely
- Adds rate limiting
- Provides better control
- Is production-ready

See `BACKEND_UPGRADE.md` for the secure implementation guide (coming soon).
