import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Course } from '@/types'

interface CourseCardProps {
  course: Course & { lesson_count: number }
  completedCount: number
  featured?: boolean
  index: number
}

function ProgressRing({
  completed,
  total,
  size = 'md',
}: {
  completed: number
  total: number
  size?: 'sm' | 'md'
}) {
  const r = size === 'md' ? 30 : 20
  const cx = size === 'md' ? 36 : 24
  const circ = 2 * Math.PI * r
  const pct = total > 0 ? completed / total : 0
  const offset = circ - pct * circ
  const displayPct = Math.round(pct * 100)

  return (
    <div
      className={cn(
        'relative flex-shrink-0 flex items-center justify-center',
        size === 'md' ? 'w-[72px] h-[72px]' : 'w-12 h-12'
      )}
    >
      <svg
        className="-rotate-90 absolute"
        width={cx * 2}
        height={cx * 2}
        viewBox={`0 0 ${cx * 2} ${cx * 2}`}
      >
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={size === 'md' ? 3 : 3.5}
        />
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke="#6c63ff"
          strokeWidth={size === 'md' ? 3 : 3.5}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ filter: 'drop-shadow(0 0 4px rgba(108,99,255,0.4))' }}
        />
      </svg>
      <span
        className={cn(
          'relative z-10 font-mono font-medium text-[#a5a0ff]',
          size === 'md' ? 'text-[12px]' : 'text-[10px]'
        )}
      >
        {displayPct}%
      </span>
    </div>
  )
}

export function CourseCard({ course, completedCount, featured = false, index }: CourseCardProps) {
  const total = course.lesson_count
  const allDone = completedCount === total && total > 0
  const inProgress = completedCount > 0 && !allDone
  const notStarted = completedCount === 0

  const ctaLabel = inProgress ? 'Continue' : allDone ? 'Review' : 'Start'

  return (
    <div
      className={cn(
        'group relative bg-[#0f0f18] border border-white/7 rounded-[18px] overflow-hidden',
        'transition-all duration-200 hover:border-white/13 hover:bg-[#131320] hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)]',
        'opacity-0 animate-in fade-in slide-in-from-bottom-3',
        featured ? 'col-span-2' : ''
      )}
      style={{ animationDelay: `${0.1 + index * 0.07}s`, animationFillMode: 'forwards', animationDuration: '0.5s' }}
    >
      {/* Hover shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6c63ff]/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[18px]" />

      <div className={cn('relative flex gap-8 p-7', featured ? 'items-center' : 'flex-col')}>
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Tags */}
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {course.outline_json?.[0] && (
              <span className="text-[10px] font-mono text-[#a5a0ff] bg-[#6c63ff]/12 border border-[#6c63ff]/20 rounded-full px-2.5 py-0.5">
                {total} lessons
              </span>
            )}
            {inProgress && (
              <span className="text-[10px] font-mono text-yellow-400/80 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-2.5 py-0.5">
                In progress
              </span>
            )}
            {allDone && (
              <span className="text-[10px] font-mono text-green-400/80 bg-green-400/10 border border-green-400/20 rounded-full px-2.5 py-0.5">
                Complete ✓
              </span>
            )}
          </div>

          {/* Title */}
          <h2
            className={cn(
              'font-[\'Instrument_Serif\',serif] font-normal text-[#f0eeff] leading-[1.2] mb-2',
              featured ? 'text-[26px]' : 'text-[20px]'
            )}
          >
            {course.title}
          </h2>

          {/* Description */}
          {course.description && (
            <p className="text-[13px] text-white/45 leading-relaxed mb-5 line-clamp-2">
              {course.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-[12px] font-mono text-white/25">
              <span>{total} lessons</span>
              <span>{new Date(course.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>

            {/* Actions — reveal on hover */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Link
                href={`/chat/${course.id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-[12px] px-3 py-1.5 rounded-lg border border-white/8 text-white/45 hover:text-white/80 hover:border-white/20 transition-all"
              >
                Ask AI
              </Link>
              <Link
                href={`/course/${course.id}`}
                className="text-[12px] px-3 py-1.5 rounded-lg bg-[#6c63ff] text-white hover:bg-[#7c75ff] transition-all"
              >
                {ctaLabel} →
              </Link>
            </div>
          </div>
        </div>

        {/* Progress ring */}
        <ProgressRing completed={completedCount} total={total} size={featured ? 'md' : 'sm'} />
      </div>
    </div>
  )
}
