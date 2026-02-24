'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface LessonProgress {
  order_index: number
  title: string
  status: 'pending' | 'writing' | 'done'
  lessonId?: string
}

interface GenerationProgressProps {
  courseTitle: string
  courseId?: string
  lessons: LessonProgress[]
  status: 'generating' | 'done' | 'error'
}

export function GenerationProgress({ courseTitle, courseId, lessons, status }: GenerationProgressProps) {
  const router = useRouter()
  const doneCount = lessons.filter(l => l.status === 'done').length
  const total = lessons.length

  return (
    <div className="rounded-2xl border border-[#6c63ff]/25 bg-gradient-to-br from-[#6c63ff]/8 to-[#a78bfa]/5 p-5 my-2 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className={cn(
          'w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5',
          status === 'done'
            ? 'bg-[#6c63ff] border-[#6c63ff] flex items-center justify-center'
            : 'border-[#6c63ff]/30 border-t-[#6c63ff] animate-spin'
        )}>
          {status === 'done' && <span className="text-white text-[10px]">✓</span>}
        </div>
        <div>
          <p className="text-[14px] font-medium text-[#a5a0ff] leading-tight">{courseTitle}</p>
          <p className="text-[12px] text-white/35 mt-0.5">
            {status === 'done'
              ? `${total} lessons ready`
              : `Writing lesson ${doneCount + 1} of ${total}…`}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] bg-white/5 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#6c63ff] to-[#a78bfa] rounded-full transition-all duration-500"
          style={{ width: `${total > 0 ? (doneCount / total) * 100 : 0}%` }}
        />
      </div>

      {/* Lesson list */}
      <div className="flex flex-col gap-1.5">
        {lessons.map(lesson => (
          <div
            key={lesson.order_index}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-[10px] border text-[13px] transition-all duration-300',
              lesson.status === 'done'
                ? 'bg-white/4 border-white/6 text-white/70'
                : lesson.status === 'writing'
                ? 'bg-[#6c63ff]/10 border-[#6c63ff]/20 text-white/80'
                : 'bg-transparent border-transparent text-white/30'
            )}
          >
            {/* Status icon */}
            <div className={cn(
              'w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] border',
              lesson.status === 'done'
                ? 'bg-[#6c63ff] border-[#6c63ff] text-white'
                : lesson.status === 'writing'
                ? 'border-[#6c63ff]/40 border-t-[#6c63ff] animate-spin'
                : 'border-white/15'
            )}>
              {lesson.status === 'done' && '✓'}
            </div>

            <span className="font-mono text-[11px] text-[#6c63ff]/60 flex-shrink-0">
              {String(lesson.order_index).padStart(2, '0')}
            </span>

            <span className="truncate">{lesson.title}</span>

            {lesson.status === 'writing' && (
              <span className="ml-auto text-[11px] text-[#6c63ff]/60 flex-shrink-0 animate-pulse">
                writing…
              </span>
            )}
          </div>
        ))}
      </div>

      {/* CTA when done */}
      {status === 'done' && courseId && (
        <button
          onClick={() => router.push(`/course/${courseId}`)}
          className="mt-4 w-full bg-[#6c63ff] hover:bg-[#7c75ff] text-white font-medium text-[14px] py-2.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] hover:-translate-y-px"
        >
          Open your course →
        </button>
      )}

      {status === 'error' && (
        <p className="mt-4 text-[13px] text-red-400/80 text-center">
          Something went wrong generating your course. Please try again.
        </p>
      )}
    </div>
  )
}
