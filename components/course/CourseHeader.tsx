import Link from 'next/link'
import { Course, Lesson } from '@/types'

interface CourseHeaderProps {
  course: Course
  currentLesson: Lesson
  completedCount: number
  totalLessons: number
}

export function CourseHeader({ course, currentLesson, completedCount, totalLessons }: CourseHeaderProps) {
  return (
    <header className="flex items-center justify-between h-[52px] border-b border-white/7 bg-[#0a0a0f]/95 backdrop-blur-xl px-0 pr-5 flex-shrink-0 sticky top-0 z-50">
      <div className="flex items-center h-full">
        {/* Logo area — same width as sidebar */}
        <div className="w-[272px] flex items-center gap-3 px-5 border-r border-white/7 h-full flex-shrink-0">
          <Link href="/" className="font-mono text-[14px] font-medium text-white flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <span className="text-[#6c63ff]">L&gt;</span>
            <span>lernix</span>
          </Link>
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 px-5 text-[13px] text-white/30">
          <Link href="/dashboard" className="hover:text-white/55 transition-colors">My courses</Link>
          <span className="text-white/15">/</span>
          <span className="text-white/50 max-w-[320px] truncate">{course.title}</span>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {/* Progress */}
        <span className="text-[12px] font-mono text-white/30 bg-white/4 border border-white/8 rounded-md px-2.5 py-1">
          <span className="text-[#a5a0ff]">{completedCount}</span> / {totalLessons}
        </span>

        {/* Ask a question */}
        <Link
          href={`/chat/${course.id}`}
          className="flex items-center gap-2 bg-[#6c63ff]/12 border border-[#6c63ff]/25 text-[#a5a0ff] hover:bg-[#6c63ff]/20 hover:border-[#6c63ff]/40 hover:shadow-[0_0_16px_rgba(108,99,255,0.15)] text-[13px] font-medium px-3.5 py-1.5 rounded-lg transition-all duration-200"
        >
          <span className="w-1.5 h-1.5 bg-[#6c63ff] rounded-full shadow-[0_0_6px_#6c63ff] animate-pulse" />
          Ask a question
        </Link>
      </div>
    </header>
  )
}
