import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CourseCard } from '@/components/dashboard/CourseCard'
import { Course } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch courses with lesson counts
  const { data: courses } = await supabase
    .from('courses')
    .select(`
      *,
      lessons(count)
    `)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const enriched = (courses ?? []).map(c => ({
    ...c,
    lesson_count: c.lessons?.[0]?.count ?? 0,
  }))

  // Load per-course completion from a helper (client will do this via localStorage, but we can show 0 server-side)
  const completedMap: Record<string, number> = {}

  const totalLessonsCompleted = Object.values(completedMap).reduce((a, b) => a + b, 0)
  const totalLessons = enriched.reduce((a, c) => a + c.lesson_count, 0)
  const avgCompletion = enriched.length > 0
    ? Math.round((Object.values(completedMap).reduce((a, b) => a + b, 0) / Math.max(totalLessons, 1)) * 100)
    : 0

  return (
    <div className="min-h-screen bg-[#0a0a0f] font-['Geist',sans-serif]">
      {/* Noise */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
        }}
      />
      <div className="pointer-events-none fixed top-0 right-0 w-[500px] h-[500px] rounded-full z-0"
        style={{ background: 'radial-gradient(circle, rgba(108,99,255,0.07) 0%, transparent 70%)', filter: 'blur(120px)' }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-10 h-14 border-b border-white/7 bg-[#0a0a0f]/90 backdrop-blur-xl sticky top-0">
        <Link href="/" className="font-mono text-[15px] font-medium text-white flex items-center gap-1.5 hover:opacity-80 transition-opacity">
          <span className="text-[#6c63ff]">L&gt;</span>
          <span>lernix</span>
        </Link>
        <div className="flex items-center gap-3">
          <form action="/auth/signout" method="post">
            <button className="text-[13px] text-white/30 hover:text-white/60 transition-colors bg-transparent border-none cursor-pointer font-['Geist',sans-serif]">
              Sign out
            </button>
          </form>
          <Link
            href="/chat"
            className="flex items-center gap-2 bg-[#6c63ff] hover:bg-[#7c75ff] text-white text-[13px] font-medium px-4 py-2 rounded-[9px] transition-all hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] hover:-translate-y-px"
          >
            + New course
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-10 py-14">

        {/* Header */}
        <div className="flex items-end justify-between mb-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h1 className="font-['Instrument_Serif',serif] text-[36px] font-normal text-[#f0eeff]">
            Your <em className="italic text-[#9d97ff]">courses</em>
          </h1>
          <span className="font-mono text-[13px] text-white/25">
            {enriched.length} course{enriched.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Stats row */}
        {enriched.length > 0 && (
          <div className="flex gap-4 mb-12 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-75">
            {[
              { num: enriched.length, label: 'Courses created' },
              { num: totalLessons, label: 'Total lessons' },
              { num: `${avgCompletion}%`, label: 'Avg. completion' },
            ].map(({ num, label }) => (
              <div key={label} className="bg-[#0f0f18] border border-white/7 rounded-2xl px-5 py-4 min-w-[140px]">
                <div className="font-['Instrument_Serif',serif] text-[32px] font-normal leading-none mb-1 italic text-[#a5a0ff]">
                  {num}
                </div>
                <div className="text-[12px] text-white/30">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Section label */}
        {enriched.length > 0 && (
          <div className="flex items-center gap-3 mb-5 animate-in fade-in duration-500 delay-100">
            <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-white/20">All courses</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>
        )}

        {/* Grid */}
        {enriched.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {enriched.map((course, i) => (
              <CourseCard
                key={course.id}
                course={course as Course & { lesson_count: number }}
                completedCount={completedMap[course.id] ?? 0}
                featured={i === 0}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center border border-dashed border-white/8 rounded-[20px] animate-in fade-in duration-500 delay-150">
      <div className="w-16 h-16 bg-[#6c63ff]/12 border border-[#6c63ff]/20 rounded-[20px] flex items-center justify-center text-[28px]">
        ✦
      </div>
      <h2 className="font-['Instrument_Serif',serif] text-[26px] font-normal text-[#f0eeff]">
        Nothing here <em className="italic text-[#9d97ff]">yet</em>
      </h2>
      <p className="text-[15px] text-white/40 max-w-sm leading-relaxed">
        Start by describing what you want to learn. Lernix will build a full personalized course in under a minute.
      </p>
      <Link
        href="/chat"
        className="inline-flex items-center gap-2 bg-[#6c63ff] hover:bg-[#7c75ff] text-white text-[14px] font-medium px-6 py-3 rounded-xl transition-all hover:shadow-[0_0_24px_rgba(108,99,255,0.4)] hover:-translate-y-px mt-2"
      >
        Start your first course →
      </Link>
    </div>
  )
}
