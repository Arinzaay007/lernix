'use client'

import { useEffect, useRef } from 'react'
import { CourseHeader } from '@/components/course/CourseHeader'
import { CourseSidebar } from '@/components/course/CourseSidebar'
import { LessonContent } from '@/components/course/LessonContent'
import { useCourse } from '@/hooks/useCourse'
import { Course, Lesson } from '@/types'

interface Props {
  course: Course
  lessons: Lesson[]
  initialLessonId: string
}

export function CourseReaderShell({ course, lessons, initialLessonId }: Props) {
  const mainRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const {
    currentLesson,
    prevLesson,
    nextLesson,
    completedIds,
    selectLesson,
    markComplete,
    completedCount,
  } = useCourse({ courseId: course.id, lessons, initialLessonId })

  // Reading progress bar
  useEffect(() => {
    const main = mainRef.current
    const bar = progressBarRef.current
    if (!main || !bar) return

    function onScroll() {
      const { scrollTop, scrollHeight, clientHeight } = main!
      const pct = scrollHeight <= clientHeight
        ? 100
        : (scrollTop / (scrollHeight - clientHeight)) * 100
      bar!.style.width = `${pct}%`
    }

    main.addEventListener('scroll', onScroll, { passive: true })
    return () => main.removeEventListener('scroll', onScroll)
  }, [currentLesson.id])

  // Reset scroll and progress bar on lesson change
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0
    if (progressBarRef.current) progressBarRef.current.style.width = '0%'
  }, [currentLesson.id])

  function handleComplete() {
    markComplete(currentLesson.id)
    // Auto-advance after brief pause
    if (nextLesson) {
      setTimeout(() => selectLesson(nextLesson.id), 700)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Reading progress bar */}
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 h-[2px] z-[100] transition-[width] duration-100 shadow-[0_0_8px_rgba(108,99,255,0.5)]"
        style={{
          width: '0%',
          background: 'linear-gradient(90deg, #6c63ff, #a78bfa)',
        }}
      />

      {/* Header */}
      <CourseHeader
        course={course}
        currentLesson={currentLesson}
        completedCount={completedCount}
        totalLessons={lessons.length}
      />

      {/* Body: sidebar + main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[272px] flex-shrink-0 overflow-hidden">
          <CourseSidebar
            lessons={lessons}
            currentLessonId={currentLesson.id}
            completedIds={completedIds}
            onSelect={selectLesson}
          />
        </div>

        {/* Main reading area */}
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/8"
        >
          <LessonContent
            key={currentLesson.id}
            lesson={currentLesson}
            prevLesson={prevLesson}
            nextLesson={nextLesson}
            isCompleted={completedIds.has(currentLesson.id)}
            onComplete={handleComplete}
            onNavigate={selectLesson}
            courseId={course.id}
          />
        </main>
      </div>
    </div>
  )
}
