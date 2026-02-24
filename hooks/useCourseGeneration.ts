'use client'

import { useState, useCallback } from 'react'

interface LessonOutline {
  order_index: number
  title: string
  description: string
}

interface GenerationPayload {
  title: string
  slug: string
  description: string
  lessons: LessonOutline[]
}

type LessonStatus = 'pending' | 'writing' | 'done'

interface LessonProgress {
  order_index: number
  title: string
  status: LessonStatus
  lessonId?: string
}

interface GenerationState {
  status: 'idle' | 'generating' | 'done' | 'error'
  courseId?: string
  courseTitle?: string
  lessons: LessonProgress[]
  error?: string
}

export function useCourseGeneration() {
  const [state, setState] = useState<GenerationState>({
    status: 'idle',
    lessons: [],
  })

  const generate = useCallback(async (payload: GenerationPayload) => {
    setState({
      status: 'generating',
      courseTitle: payload.title,
      lessons: payload.lessons.map(l => ({
        order_index: l.order_index,
        title: l.title,
        status: 'pending',
      })),
    })

    try {
      const res = await fetch('/api/course/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coursePayload: payload }),
      })

      if (!res.ok) throw new Error('Generation failed')
      if (!res.body) throw new Error('No stream')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))

        for (const line of lines) {
          try {
            const event = JSON.parse(line.slice(6))

            if (event.type === 'course_created') {
              setState(prev => ({ ...prev, courseId: event.courseId, courseTitle: event.title }))
            }

            if (event.type === 'lesson_start') {
              setState(prev => ({
                ...prev,
                lessons: prev.lessons.map(l =>
                  l.order_index === event.order_index ? { ...l, status: 'writing' } : l
                ),
              }))
            }

            if (event.type === 'lesson_done') {
              setState(prev => ({
                ...prev,
                lessons: prev.lessons.map(l =>
                  l.order_index === event.order_index
                    ? { ...l, status: 'done', lessonId: event.lessonId }
                    : l
                ),
              }))
            }

            if (event.type === 'all_done') {
              setState(prev => ({ ...prev, status: 'done', courseId: event.courseId }))
            }

            if (event.error) {
              setState(prev => ({ ...prev, status: 'error', error: event.error }))
            }
          } catch {}
        }
      }
    } catch (err) {
      setState(prev => ({ ...prev, status: 'error', error: 'Generation failed' }))
    }
  }, [])

  const reset = useCallback(() => {
    setState({ status: 'idle', lessons: [] })
  }, [])

  return { state, generate, reset }
}
