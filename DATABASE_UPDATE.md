# Database Update - Adding Title Column

Since you've already created your `tweets` table in Supabase, you need to add the new `title` column.

## Quick Update (1 minute)

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Paste this SQL:

```sql
ALTER TABLE tweets ADD COLUMN IF NOT EXISTS title TEXT;
```

5. Click **Run** (or press `Cmd+Enter`)
6. Done! ✅

## Verify It Worked

1. Click **Table Editor** in the left sidebar
2. Click on your `tweets` table
3. You should now see a `title` column in the table structure

That's it! Your database is now updated and ready to store tweet titles.
