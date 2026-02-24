# Lernix — Vercel Deployment Guide

Follow these steps in order. Takes about 10 minutes.

---

## Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial Lernix build"

# Create repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/lernix.git
git branch -M main
git push -u origin main
```

---

## Step 2 — Deploy to Vercel

```bash
npm i -g vercel
vercel
# → Link to existing project? No
# → Project name: lernix
# → Root directory: ./
# → Override settings? No
```

Or go to vercel.com/new, import the GitHub repo, click Deploy.

---

## Step 3 — Environment variables

Vercel dashboard → Settings → Environment Variables. Add all five:

NEXT_PUBLIC_SUPABASE_URL       = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY  = eyJ...
SUPABASE_SERVICE_ROLE_KEY      = eyJ...
ANTHROPIC_API_KEY              = sk-ant-...
NEXT_PUBLIC_APP_URL            = https://your-app.vercel.app

Then redeploy: vercel --prod

---

## Step 4 — Supabase auth config

Dashboard → Authentication → URL Configuration
- Site URL: https://your-app.vercel.app
- Redirect URLs: https://your-app.vercel.app/auth/callback

---

## Step 5 — Verify

- / homepage loads
- /login → send magic link → lands on /dashboard
- Create a course → streaming works
- /dashboard → card appears
- /course/[id] → reader works

---

## Troubleshooting

Magic link goes to localhost   → Update Supabase Site URL + Redirect URLs
Streaming cuts off after 10s   → API routes already use edge runtime (fixed)
useSearchParams build error    → chat/page.tsx must wrap ChatPageInner in Suspense
Build fails on env vars        → Confirm all 5 vars set in Vercel, redeploy
404 on /auth/callback          → Confirm app/(auth)/callback/route.ts is deployed

---

## Production checklist

[ ] All 5 env vars in Vercel
[ ] Supabase Site URL = production domain
[ ] Supabase Redirect URL includes /auth/callback
[ ] Magic link sign-in works end to end
[ ] Course creation + streaming works
[ ] Course reader + completion works
[ ] /chat/[courseId] context-aware chat works
[ ] /settings page works
[ ] 404 page shows for bad routes
