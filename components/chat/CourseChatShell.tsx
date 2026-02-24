'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChatMessage, TypingIndicator } from '@/components/chat/ChatMessage'
import { useChat } from '@/hooks/useChat'
import { Course, Lesson, UIMessage } from '@/types'
import { cn } from '@/lib/utils'

interface CourseChatShellProps {
  course: Course
  lessons: Lesson[]
  initialMessages: UIMessage[]
}

export function CourseChatShell({ course, lessons, initialMessages }: CourseChatShellProps) {
  const router = useRouter()
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [input, setInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [pendingAction, setPendingAction] = useState<CourseAction | null>(null)

  type CourseAction =
    | { type: 'add_lesson';    lesson: { order_index: number; title: string; description: string; content_md: string } }
    | { type: 'update_lesson'; lesson: { order_index: number; title: string; content_md: string } }

  const handleCourseAction = useCallback(async (action: CourseAction) => {
    setPendingAction(action)
    try {
      const res = await fetch('/api/course/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id, action }),
      })
      if (res.ok) {
        router.refresh()
      }
    } finally {
      setPendingAction(null)
    }
  }, [course.id, router])

  // Parse update_course action from AI response
  const detectCourseAction = useCallback((text: string) => {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/)
    if (!match) return
    try {
      const parsed = JSON.parse(match[1])
      if (parsed.action === 'update_course' && parsed.type && parsed.lesson) {
        handleCourseAction({ type: parsed.type, lesson: parsed.lesson })
      }
    } catch {}
  }, [handleCourseAction])

  const { messages, isStreaming, error, sendMessage } = useChat({
    courseId: course.id,
    initialMessages,
    onAssistantMessage: detectCourseAction,
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleSend() {
    const val = input.trim()
    if (!val || isStreaming) return
    sendMessage(val)
    setInput('')
    if (inputRef.current) inputRef.current.style.height = 'auto'
  }

  // Quick-fire prompts
  const quickPrompts = [
    'Give me practice exercises for this course',
    'What should I learn after this?',
    'Add a lesson on common pitfalls',
    'Explain the hardest concept simply',
  ]

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] overflow-hidden font-['Geist',sans-serif]">
      {/* Noise + orb */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40"
        style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`, backgroundSize:'200px' }} />
      <div className="pointer-events-none fixed top-0 right-0 w-[400px] h-[400px] rounded-full z-0"
        style={{ background:'radial-gradient(circle, rgba(108,99,255,0.07) 0%, transparent 70%)', filter:'blur(100px)' }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 h-14 border-b border-white/7 bg-[#0a0a0f]/90 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-mono text-[14px] font-medium text-white flex items-center gap-1.5 hover:opacity-70 transition-opacity">
            <span className="text-[#6c63ff]">L&gt;</span>
            <span>lernix</span>
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="text-[12px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/4"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 3v18"/>
            </svg>
            {sidebarOpen ? 'Hide' : 'Show'} outline
          </button>
        </div>

        <div className="flex items-center gap-2 min-w-0 flex-1 justify-center px-6">
          <span className="text-[13px] text-white/50 truncate max-w-[400px]">{course.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/course/${course.id}`}
            className="flex items-center gap-1.5 text-[12px] text-white/35 hover:text-white/60 border border-white/8 hover:border-white/15 px-3 py-1.5 rounded-lg transition-all"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Back to course
          </Link>
        </div>
      </header>

      {/* Body */}
      <div className="relative z-10 flex flex-1 overflow-hidden">

        {/* Course outline sidebar */}
        <aside className={cn(
          'flex-shrink-0 border-r border-white/7 bg-[#0d0d14] overflow-y-auto transition-all duration-300',
          sidebarOpen ? 'w-[260px]' : 'w-0 overflow-hidden border-r-0'
        )}>
          <div className="p-4 min-w-[260px]">
            {/* Back to course link */}
            <Link
              href={`/course/${course.id}`}
              className="flex items-center gap-2 text-[12px] text-[#6c63ff]/70 hover:text-[#6c63ff] mb-5 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Back to reader
            </Link>

            <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-white/20 mb-3 px-1">
              Course outline
            </div>

            <div className="flex flex-col gap-0.5">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="group flex items-start gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/4 transition-colors cursor-pointer"
                  onClick={() => {
                    const msg = `Tell me more about lesson ${lesson.order_index}: "${lesson.title}"`
                    setInput(msg)
                    inputRef.current?.focus()
                  }}
                >
                  <span className="font-mono text-[10px] text-[#6c63ff]/50 flex-shrink-0 mt-0.5 w-5">
                    {String(lesson.order_index).padStart(2,'0')}
                  </span>
                  <span className="text-[12.5px] text-white/45 group-hover:text-white/70 transition-colors leading-[1.4]">
                    {lesson.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="mt-6 pt-5 border-t border-white/6">
              <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-white/20 mb-3 px-1">
                Quick asks
              </div>
              <div className="flex flex-col gap-1">
                {quickPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setInput(p); inputRef.current?.focus() }}
                    className="text-left text-[12px] text-white/35 hover:text-white/65 hover:bg-white/4 px-2.5 py-2 rounded-lg transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-8 px-6">
            <div className="max-w-[680px] mx-auto flex flex-col gap-1.5">

              {/* Context banner */}
              <div className="flex items-center gap-3 bg-[#6c63ff]/8 border border-[#6c63ff]/15 rounded-xl px-4 py-3 mb-4 animate-in fade-in duration-500">
                <div className="w-6 h-6 bg-[#6c63ff]/20 rounded-md flex items-center justify-center flex-shrink-0 text-[11px]">✦</div>
                <p className="text-[12.5px] text-[#a5a0ff]/80 leading-relaxed">
                  I have full context of your <span className="text-[#a5a0ff] font-medium">{course.title}</span> course — {lessons.length} lessons. Ask me anything about it, request changes, or add new content.
                </p>
              </div>

              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center animate-in fade-in duration-500">
                  <p className="text-[15px] text-white/30 max-w-xs leading-relaxed">
                    Ask a question, request an example, or say "add a lesson on X"
                  </p>
                </div>
              )}

              {messages.map((msg, i) => {
                const isLast = i === messages.length - 1
                const isCurrentlyStreaming = isLast && isStreaming && msg.role === 'assistant'
                const displayContent = msg.role === 'assistant'
                  ? msg.content.replace(/```json[\s\S]*?```/g, '').trim()
                  : msg.content
                if (!displayContent && !isCurrentlyStreaming) return null
                return (
                  <ChatMessage
                    key={i}
                    message={{ ...msg, content: displayContent }}
                    isStreaming={isCurrentlyStreaming}
                  />
                )
              })}

              {isStreaming && messages[messages.length - 1]?.content === '' && <TypingIndicator />}

              {/* Pending action notice */}
              {pendingAction && (
                <div className="flex items-center gap-3 bg-[#6c63ff]/8 border border-[#6c63ff]/20 rounded-xl px-4 py-3 animate-in fade-in duration-300">
                  <div className="w-3 h-3 border-2 border-[#6c63ff]/30 border-t-[#6c63ff] rounded-full animate-spin flex-shrink-0" />
                  <span className="text-[12.5px] text-[#a5a0ff]/70">
                    {pendingAction.type === 'add_lesson'
                      ? `Adding lesson: "${pendingAction.lesson.title}"…`
                      : `Updating lesson: "${pendingAction.lesson.title}"…`}
                  </span>
                </div>
              )}

              {error && <p className="text-[13px] text-red-400/60 text-center">{error}</p>}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input */}
          <div className="flex-shrink-0 px-6 pb-6 pt-4 border-t border-white/7 bg-[#0a0a0f]/90 backdrop-blur-xl">
            <div className="max-w-[680px] mx-auto">
              <div className={cn(
                'flex items-end gap-2.5 bg-[#111118] border rounded-2xl px-4 py-1 transition-all duration-300',
                isStreaming
                  ? 'border-white/5 opacity-60'
                  : 'border-white/7 focus-within:border-[#6c63ff]/40 focus-within:shadow-[0_0_0_3px_rgba(108,99,255,0.08)]'
              )}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  disabled={isStreaming}
                  placeholder="Ask about this course, request examples, add a lesson…"
                  rows={1}
                  className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#f0eeff] placeholder:text-white/20 resize-none py-3 min-h-[46px] max-h-[160px] leading-relaxed disabled:cursor-not-allowed font-['Geist',sans-serif]"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isStreaming}
                  className="w-9 h-9 bg-[#6c63ff] rounded-xl flex items-center justify-center flex-shrink-0 mb-1 transition-all duration-200 hover:bg-[#7c75ff] hover:shadow-[0_0_16px_rgba(108,99,255,0.4)] hover:-translate-y-px disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
              <p className="text-[11px] text-white/15 mt-2 text-center">
                <kbd className="font-mono bg-white/5 border border-white/8 rounded px-1 py-px text-[10px]">Enter</kbd> send ·{' '}
                <kbd className="font-mono bg-white/5 border border-white/8 rounded px-1 py-px text-[10px]">Shift+Enter</kbd> new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
