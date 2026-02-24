import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import { COURSE_CREATION_SYSTEM_PROMPT } from '@/lib/ai/prompts'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { messages, courseId } = await req.json() as {
    messages: { role: 'user' | 'assistant'; content: string }[]
    courseId?: string
  }

  // Build system prompt — use course context if in a course chat
  let systemPrompt = COURSE_CREATION_SYSTEM_PROMPT

  if (courseId) {
    const { data: course } = await supabase
      .from('courses')
      .select('title, outline_json')
      .eq('id', courseId)
      .eq('user_id', user.id)
      .single()

    if (course) {
      const { COURSE_CHAT_SYSTEM_PROMPT } = await import('@/lib/ai/prompts')
      const outlineText = (course.outline_json as { order_index: number; title: string; description: string }[])
        .map((l) => `${l.order_index}. ${l.title} — ${l.description}`)
        .join('\n')
      systemPrompt = COURSE_CHAT_SYSTEM_PROMPT(course.title, outlineText)
    }
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.0-flash',
          systemInstruction: systemPrompt,
        })

        // Convert messages to Gemini format (role: user | model)
        const history = messages.slice(0, -1).map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }))

        const lastMessage = messages[messages.length - 1]
        const chat = model.startChat({ history })
        const result = await chat.sendMessageStream(lastMessage.content)

        for await (const chunk of result.stream) {
          const text = chunk.text()
          if (text) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            )
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (err) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`)
        )
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
