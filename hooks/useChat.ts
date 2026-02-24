'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { UIMessage } from '@/types'

interface GenerationPayload {
  action: 'generate_course'
  title: string
  slug: string
  description: string
  lessons: { order_index: number; title: string; description: string }[]
}

interface UseChatOptions {
  courseId?: string
  initialMessages?: UIMessage[]
  onCourseGeneration?: (payload: GenerationPayload) => void
  onAssistantMessage?: (fullText: string) => void
}

export function useChat({
  courseId,
  initialMessages = [],
  onCourseGeneration,
  onAssistantMessage,
}: UseChatOptions = {}) {
  const [messages, setMessages] = useState<UIMessage[]>(initialMessages)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (initialMessages.length > 0 && messages.length === 0) {
      setMessages(initialMessages)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const extractCoursePayload = (text: string): GenerationPayload | null => {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/)
    if (!match) return null
    try {
      const parsed = JSON.parse(match[1])
      if (parsed.action === 'generate_course') return parsed as GenerationPayload
    } catch {}
    return null
  }

  const persistMessage = useCallback(async (role: 'user' | 'assistant', content: string) => {
    if (!courseId) return
    try {
      await fetch('/api/chat/persist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, role, content }),
      })
    } catch {}
  }, [courseId])

  const sendMessage = useCallback(async (content: string) => {
    if (isStreaming || !content.trim()) return

    setError(null)
    const userMessage: UIMessage = { role: 'user', content }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setIsStreaming(true)

    await persistMessage('user', content)

    setMessages([...newMessages, { role: 'assistant', content: '' }])

    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, courseId }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) throw new Error('Chat request failed')
      if (!res.body) throw new Error('No stream body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            if (parsed.text) {
              fullText += parsed.text
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = { role: 'assistant', content: fullText }
                return updated
              })
            }
          } catch {}
        }
      }

      const coursePayload = extractCoursePayload(fullText)
      if (coursePayload && onCourseGeneration) onCourseGeneration(coursePayload)
      if (onAssistantMessage) onAssistantMessage(fullText)
      await persistMessage('assistant', fullText)

    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError('Something went wrong. Please try again.')
        setMessages(prev => prev.slice(0, -1))
      }
    } finally {
      setIsStreaming(false)
    }
  }, [messages, isStreaming, courseId, persistMessage, onCourseGeneration, onAssistantMessage])

  const abort = useCallback(() => {
    abortRef.current?.abort()
    setIsStreaming(false)
  }, [])

  const reset = useCallback(() => {
    setMessages([])
    setError(null)
    setIsStreaming(false)
  }, [])

  return { messages, isStreaming, error, sendMessage, abort, reset }
}
