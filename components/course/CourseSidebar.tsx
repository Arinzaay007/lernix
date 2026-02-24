'use client'

import { cn } from '@/lib/utils'
import { Lesson } from '@/types'

interface CourseSidebarProps {
  lessons: Lesson[]
  currentLessonId: string
  completedIds: Set<string>
  onSelect: (lessonId: string) => void
}

export function CourseSidebar({ lessons, currentLessonId, completedIds, onSelect }: CourseSidebarProps) {
  return (
    <aside className="bg-[#0d0d14] border-r border-white/7 overflow-y-auto h-full pb-10">
      <div className="px-5 pt-4 pb-2.5 text-[10px] font-semibold tracking-[0.08em] uppercase text-white/25">
        Course lessons
      </div>

      <div className="flex flex-col">
        {lessons.map((lesson) => {
          const isActive = lesson.id === currentLessonId
          const isDone = completedIds.has(lesson.id)

          return (
            <button
              key={lesson.id}
              onClick={() => onSelect(lesson.id)}
              className={cn(
                'flex items-start gap-2.5 px-5 py-2.5 text-left border-l-2 transition-all duration-150 w-full',
                isActive
                  ? 'bg-[#6c63ff]/12 border-l-[#6c63ff]'
                  : 'border-l-transparent hover:bg-white/3'
              )}
            >
              {/* Status circle */}
              <div className={cn(
                'w-[18px] h-[18px] rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] transition-all',
                isDone
                  ? 'bg-[#6c63ff] border-[#6c63ff] text-white'
                  : isActive
                  ? 'border-[#6c63ff] shadow-[0_0_8px_rgba(108,99,255,0.4)]'
                  : 'border-white/20'
              )}>
                {isDone && '✓'}
              </div>

              <div className="min-w-0 flex-1">
                <span className="block font-mono text-[10px] text-white/25 mb-0.5">
                  Lesson {String(lesson.order_index).padStart(2, '0')}
                </span>
                <span className={cn(
                  'block text-[13px] leading-[1.4] transition-colors',
                  isActive ? 'text-white font-medium' : isDone ? 'text-white/50' : 'text-white/55 group-hover:text-white/80'
                )}>
                  {lesson.title}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
