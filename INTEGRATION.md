# Lernix — Complete Integration Guide

Everything you need to go from `npx create-next-app` to a running app.

---

## 1. Create the project

```bash
npx create-next-app@latest lernix \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd lernix
```

---

## 2. Install all dependencies

```bash
# Core
npm install @supabase/supabase-js @supabase/ssr
npm install @anthropic-ai/sdk
npm install react-markdown remark-gfm
npm install clsx tailwind-merge
npm install lucide-react

# shadcn/ui
npx shadcn@latest init
# → Default style, Slate base color, CSS variables: yes

npx shadcn@latest add button input card dialog textarea badge scroll-area separator skeleton
```

---

## 3. Environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4. Supabase — run the migration

Paste this into your Supabase SQL editor (Dashboard → SQL Editor → New query):

```sql
create extension if not exists "uuid-ossp";

create table courses (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  title        text not null,
  slug         text not null,
  description  text,
  outline_json jsonb default '[]',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create table lessons (
  id           uuid primary key default uuid_generate_v4(),
  course_id    uuid references courses(id) on delete cascade not null,
  order_index  integer not null,
  title        text not null,
  content_md   text default '',
  is_generated boolean default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create table chat_messages (
  id        uuid primary key default uuid_generate_v4(),
  course_id uuid references courses(id) on delete cascade,
  user_id   uuid references auth.users(id) on delete cascade not null,
  role      text check (role in ('user', 'assistant')) not null,
  content   text not null,
  created_at timestamptz default now()
);

alter table courses       enable row level security;
alter table lessons       enable row level security;
alter table chat_messages enable row level security;

create policy "Users own their courses"
  on courses for all using (auth.uid() = user_id);

create policy "Users access their course lessons"
  on lessons for all using (
    exists (select 1 from courses where courses.id = lessons.course_id and courses.user_id = auth.uid())
  );

create policy "Users access their chat messages"
  on chat_messages for all using (auth.uid() = user_id);

create index on courses (user_id);
create index on lessons (course_id, order_index);
create index on chat_messages (course_id, created_at);
```

Also enable **Email (Magic Link)** auth in:
Supabase Dashboard → Authentication → Providers → Email → enable "Magic Link"

---

## 5. Complete file tree

Place every file exactly as shown:

```
lernix/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx                ← Login page (magic link)
│   │   └── callback/
│   │       └── route.ts                ← Auth callback handler
│   ├── (app)/
│   │   ├── layout.tsx                  ← Protected layout (auth check)
│   │   ├── dashboard/
│   │   │   └── page.tsx                ← Dashboard page
│   │   ├── chat/
│   │   │   └── page.tsx                ← Chat / course creation page
│   │   └── course/
│   │       └── [courseId]/
│   │           ├── page.tsx            ← Course reader (RSC)
│   │           └── CourseReaderShell.tsx ← Client reader shell
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts                ← Streaming chat endpoint
│   │   └── course/
│   │       └── generate/
│   │           └── route.ts            ← Course generation endpoint
│   ├── auth/
│   │   └── signout/
│   │       └── route.ts                ← Sign out handler
│   ├── layout.tsx                      ← Root layout (fonts + metadata)
│   ├── page.tsx                        ← Homepage
│   └── globals.css                     ← Global styles + design tokens
│
├── components/
│   ├── home/
│   │   └── HeroInput.tsx               ← Animated hero input
│   ├── chat/
│   │   ├── ChatMessage.tsx             ← Message bubbles + typing indicator
│   │   └── GenerationProgress.tsx      ← Live lesson generation card
│   ├── course/
│   │   ├── CourseSidebar.tsx           ← Lesson nav sidebar
│   │   ├── LessonContent.tsx           ← Markdown lesson renderer
│   │   └── CourseHeader.tsx            ← Course reader header
│   └── dashboard/
│       ├── CourseCard.tsx              ← Course card with progress ring
│       └── DashboardGrid.tsx           ← Client grid (localStorage hydration)
│
├── hooks/
│   ├── useChat.ts                      ← Streaming chat + trigger detection
│   ├── useCourseGeneration.ts          ← Generation progress state
│   └── useCourse.ts                    ← Lesson selection + completion
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   ← Browser Supabase client
│   │   └── server.ts                   ← Server Supabase client
│   ├── ai/
│   │   └── prompts.ts                  ← All AI system prompts
│   └── utils.ts                        ← cn() helper
│
├── types/
│   └── index.ts                        ← Course, Lesson, ChatMessage types
│
├── middleware.ts                        ← Route protection
├── tailwind.config.ts                  ← Design tokens + animations
├── next.config.ts                      ← Next.js config
└── .env.local                          ← Your secrets
```

---

## 6. One fix needed in dashboard/page.tsx

Update the grid section to use `DashboardGrid` for localStorage hydration:

```tsx
// At top of dashboard/page.tsx — add this import:
import { DashboardGrid } from '@/components/dashboard/DashboardGrid'

// Replace the grid rendering block with:
{enriched.length === 0 ? (
  <EmptyState />
) : (
  <DashboardGrid courses={enriched} />
)}
```

---

## 7. Wiring the chat page correctly

The chat page at `app/(app)/chat/page.tsx` must be wrapped in `Suspense`
because it reads `useSearchParams()`:

```tsx
// app/(app)/chat/page.tsx — final version:
import { Suspense } from 'react'
import ChatPage from './ChatPage'  // rename your component to ChatPage.tsx

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <ChatPage />
    </Suspense>
  )
}
```

---

## 8. prompts.ts — make sure this exists

Create `lib/ai/prompts.ts` with the three prompts from Step 1:
- `COURSE_CREATION_SYSTEM_PROMPT`
- `LESSON_GENERATION_SYSTEM_PROMPT`
- `COURSE_CHAT_SYSTEM_PROMPT`

(Full content delivered in the initial setup step.)

---

## 9. Run it

```bash
npm run dev
# → http://localhost:3000
```

**Happy path to test:**
1. `/` → type a learning goal → press Enter
2. `/chat` → answer 1-2 clarifying questions
3. AI outputs `generate_course` JSON → generation card appears
4. Lessons stream in one by one
5. "Open your course" → reader UI
6. Click lessons, mark complete, reading progress bar tracks scroll
7. "Ask a question" → back to chat with course context
8. `/dashboard` → see your course card with progress ring

---

## 10. Deploy to Vercel

```bash
npx vercel
# Set all env vars in Vercel dashboard → Settings → Environment Variables
# Update NEXT_PUBLIC_APP_URL to your production URL
# Update Supabase Auth → URL Configuration → add your Vercel domain
```

---

## Known gotchas

| Issue | Fix |
|-------|-----|
| Magic link redirects to localhost in prod | Set Site URL in Supabase Auth settings to your Vercel URL |
| `useSearchParams` causes build error | Wrap chat page in `<Suspense>` (see step 7) |
| Fonts not loading | Ensure `--font-display`, `--font-body`, `--font-mono` CSS vars are set in root layout |
| Supabase RLS blocking queries | Make sure you're using the server client (cookies) in API routes, not the browser client |
| Streaming stops mid-generation | Vercel hobby plan has 10s function timeout — upgrade to Pro or use edge runtime (already set) |
