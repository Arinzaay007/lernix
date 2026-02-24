import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import { LESSON_GENERATION_SYSTEM_PROMPT } from '@/lib/ai/prompts'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

interface LessonOutline {
  order_index: number
  title: string
  description: string
}

interface CoursePayload {
  title: string
  slug: string
  description: string
  lessons: LessonOutline[]
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { coursePayload } = await req.json() as { coursePayload: CoursePayload }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      function send(event: object) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
      }

      try {
        // 1. Create course record
        const { data: course, error: courseError } = await supabase
          .from('courses')
          .insert({
            user_id: user.id,
            title: coursePayload.title,
            slug: coursePayload.slug,
            description: coursePayload.description,
            outline_json: coursePayload.lessons,
          })
          .select()
          .single()

        if (courseError || !course) {
          send({ error: 'Failed to create course' })
          controller.close()
          return
        }

        send({ type: 'course_created', courseId: course.id, title: course.title })

        // 2. Generate each lesson sequentially, streaming progress
        for (const outline of coursePayload.lessons) {
          send({ type: 'lesson_start', order_index: outline.order_index, title: outline.title })

          // Generate lesson content
          const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: LESSON_GENERATION_SYSTEM_PROMPT,
          })

          const prevLessons = coursePayload.lessons
            .filter(l => l.order_index < outline.order_index)
            .map(l => l.title)
            .join(', ') || 'none (this is the first lesson)'

          const result = await model.generateContent(
            `Course: "${coursePayload.title}"
Lesson ${outline.order_index}: "${outline.title}"
Context: ${outline.description}

Previous lessons covered: ${prevLessons}

Write this lesson now.`
          )

          const contentMd = result.response.text()

          // Insert lesson
          const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .insert({
              course_id: course.id,
              order_index: outline.order_index,
              title: outline.title,
              content_md: contentMd,
              is_generated: true,
            })
            .select()
            .single()

          if (!lessonError && lesson) {
            send({
              type: 'lesson_done',
              order_index: outline.order_index,
              lessonId: lesson.id,
              title: outline.title,
            })
          }
        }

        send({ type: 'all_done', courseId: course.id, slug: course.slug })
        controller.close()
      } catch (err) {
        send({ error: 'Generation failed' })
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
