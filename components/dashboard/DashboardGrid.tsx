'use client'

import { useEffect, useState } from 'react'
import { CourseCard } from '@/components/dashboard/CourseCard'
import { Course } from '@/types'

interface Props {
  courses: (Course & { lesson_count: number })[]
}

// Client wrapper that hydrates progress from localStorage after server render
export function DashboardGrid({ courses }: Props) {
  const [completedMap, setCompletedMap] = useState<Record<string, number>>({})

  useEffect(() => {
    const map: Record<string, number> = {}
    for (const course of courses) {
      const stored = localStorage.getItem(`lernix:progress:${course.id}`)
      if (stored) {
        try {
          const ids: string[] = JSON.parse(stored)
          map[course.id] = ids.length
        } catch {}
      }
    }
    setCompletedMap(map)
  }, [courses])

  if (courses.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-4">
      {courses.map((course, i) => (
        <CourseCard
          key={course.id}
          course={course}
          completedCount={completedMap[course.id] ?? 0}
          featured={i === 0}
          index={i}
        />
      ))}
    </div>
  )
}
