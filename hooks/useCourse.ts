'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Lesson } from '@/types'

interface UseCourseOptions {
  courseId: string
  lessons: Lesson[]
  initialLessonId: string
}

export function useCourse({ courseId, lessons, initialLessonId }: UseCourseOptions) {
  const [currentLessonId, setCurrentLessonId] = useState(initialLessonId)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const supabase = createClient()

  const currentLesson = lessons.find(l => l.id === currentLessonId) ?? lessons[0]
  const currentIndex = lessons.findIndex(l => l.id === currentLessonId)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  // Load completion state from localStorage (lightweight — no extra DB table needed)
  useEffect(() => {
    const stored = localStorage.getItem(`lernix:progress:${courseId}`)
    if (stored) {
      try {
        const ids: string[] = JSON.parse(stored)
        setCompletedIds(new Set(ids))
      } catch {}
    }
  }, [courseId])

  const selectLesson = useCallback((lessonId: string) => {
    setCurrentLessonId(lessonId)
    // Update URL without full navigation
    window.history.replaceState(null, '', `/course/${courseId}/${lessonId}`)
  }, [courseId])

  const markComplete = useCallback((lessonId: string) => {
    setCompletedIds(prev => {
      const next = new Set(prev)
      next.add(lessonId)
      // Persist
      localStorage.setItem(`lernix:progress:${courseId}`, JSON.stringify([...next]))
      return next
    })
  }, [courseId])

  return {
    currentLesson,
    prevLesson,
    nextLesson,
    completedIds,
    selectLesson,
    markComplete,
    completedCount: completedIds.size,
  }
}
