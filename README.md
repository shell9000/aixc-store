# AIXC.Store - Multi-Vendor Marketplace

AI Services & Computing Marketplace built with Next.js + Supabase

## Quick Start

### 1. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your URL and anon key
3. Run the following SQL in Supabase SQL Editor:

```sql
-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all users (for marketplace)
CREATE POLICY "Users can view profiles" ON public.users
  FOR SELECT USING (true);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);
```

### 2. Configure Environment

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Locally

```bash
npm run dev
```

Visit http://localhost:3000

### 4. Deploy to Vercel

```bash
npx vercel
```

## Features

- ✅ User Registration / Login
- ✅ User Dashboard
- ✅ Marketplace Homepage
- 🏪 Vendor System (coming soon)
- 🛒 Product Listings (coming soon)
- 💳 Stripe Payments (coming soon)

## Project Structure

```
app/
├── page.tsx          # Homepage (marketplace)
├── login/page.tsx    # Login page
├── register/page.tsx # Registration page
├── dashboard/       # User dashboard
└── globals.css      # Global styles

lib/
└── supabase.ts      # Supabase client
```

## Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel / Cloudflare Pages

---

*Built with OpenClaw 🤖*
