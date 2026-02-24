# Lernix

> Learn anything, deeply. — AI-powered personalized course generation.

## Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** + **shadcn/ui**
- **Supabase** (Auth + Postgres)
- **Anthropic Claude API** (streaming)
- **Vercel** hosting

## Quick start

```bash
# 1. Install
npm install

# 2. Set up environment
cp .env.example .env.local
# Fill in your Supabase + Anthropic keys

# 3. Run Supabase migration
# Paste supabase/migrations/001_initial_schema.sql into Supabase SQL editor

# 4. Dev server
npm run dev
```

## Deploy

See [DEPLOY.md](./DEPLOY.md) for full Vercel deployment instructions.

## Project structure

```
app/
  (auth)/         Login + magic link callback
  (app)/          Protected routes (dashboard, chat, course, settings)
  api/            Streaming AI endpoints
components/       UI components by feature
hooks/            useChat, useCourse, useCourseGeneration
lib/              Supabase clients, AI prompts, utils
types/            Shared TypeScript types
```
