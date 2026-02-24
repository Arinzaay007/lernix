'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ChatMessage, TypingIndicator } from '@/components/chat/ChatMessage'
import { GenerationProgress } from '@/components/chat/GenerationProgress'
import { useChat } from '@/hooks/useChat'
import { useCourseGeneration } from '@/hooks/useCourseGeneration'
import { cn } from '@/lib/utils'

export default function ChatPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [input, setInput] = useState('')
  const [showGeneration, setShowGeneration] = useState(false)
  const hasSentInitial = useRef(false)

  const { state: genState, generate } = useCourseGeneration()

  const { messages, isStreaming, error, sendMessage } = useChat({
    onCourseGeneration: useCallback((payload) => {
      setShowGeneration(true)
      generate(payload)
    }, [generate]),
  })

  useEffect(() => {
    const q = searchParams.get('q')
    if (q && !hasSentInitial.current) {
      hasSentInitial.current = true
      const decoded = decodeURIComponent(q)
      setTimeout(() => {
        sendMessage(decoded)
      }, 400)
    }
  }, [searchParams, sendMessage])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, showGeneration, genState.lessons])

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
    if (!val || isStreaming || genState.status === 'generating') return
    sendMessage(val)
    setInput('')
    if (inputRef.current) inputRef.current.style.height = 'auto'
  }

  const isEmpty = messages.length === 0
  const isGenerating = genState.status === 'generating'
  const inputDisabled = isStreaming || isGenerating

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] font-['Geist',sans-serif] overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40"
        style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`, backgroundSize:'200px' }} />

      <header className="relative z-10 flex items-center justify-between px-6 h-14 border-b border-white/7 bg-[#0a0a0f]/80 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-[13px] text-white/35 hover:text-white/60 transition-colors px-2 py-1.5 rounded-lg hover:bg-white/4">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Home
          </button>
          <div className="w-px h-5 bg-white/8" />
          <a href="/" className="font-mono text-[15px] font-medium text-white flex items-center gap-1.5">
            <span className="text-[#6c63ff]">L&gt;</span><span>lernix</span>
          </a>
        </div>
        <span className={cn(
          'text-[11px] font-mono px-2.5 py-1 rounded-md border transition-colors',
          isGenerating ? 'bg-[#6c63ff]/15 border-[#6c63ff]/30 text-[#a5a0ff]'
          : genState.status === 'done' ? 'bg-green-500/10 border-green-500/20 text-green-400/80'
          : 'bg-white/4 border-white/8 text-white/30'
        )}>
          {isGenerating ? 'generating' : genState.status === 'done' ? 'done' : 'clarifying'}
        </span>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto py-8 px-6 scroll-smooth">
        <div className="max-w-[700px] mx-auto flex flex-col gap-1.5">
          {isEmpty && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center animate-in fade-in duration-500">
              <div className="w-14 h-14 rounded-2xl bg-[#6c63ff]/12 border border-[#6c63ff]/20 flex items-center justify-center text-2xl">✦</div>
              <h2 className="font-['Instrument_Serif',serif] text-[28px] font-normal text-[#f0eeff]">
                What do you want to <em className="italic text-[#9d97ff]">learn?</em>
              </h2>
              <p className="text-[15px] text-white/45 max-w-sm leading-relaxed">
                Describe a topic, skill, or concept. I&apos;ll ask a couple of questions, then generate your full course.
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
            return <ChatMessage key={i} message={{ ...msg, content: displayContent }} isStreaming={isCurrentlyStreaming} />
          })}

          {isStreaming && messages[messages.length - 1]?.content === '' && <TypingIndicator />}

          {showGeneration && genState.lessons.length > 0 && (
            <div className="mt-2">
              <GenerationProgress
                courseTitle={genState.courseTitle || 'Your course'}
                courseId={genState.courseId}
                lessons={genState.lessons}
                status={genState.status === 'idle' ? 'generating' : genState.status as 'generating' | 'done' | 'error'}
              />
            </div>
          )}

          {error && <p className="text-[13px] text-red-400/70 text-center py-2">{error}</p>}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="relative z-10 flex-shrink-0 px-6 pb-6 pt-4 bg-[#0a0a0f]/90 backdrop-blur-xl border-t border-white/7">
        <div className="max-w-[700px] mx-auto">
          <div className={cn(
            'flex items-end gap-2.5 bg-[#111118] border rounded-2xl px-4 py-1 transition-all duration-300',
            inputDisabled ? 'border-white/5 opacity-60'
            : 'border-white/7 focus-within:border-[#6c63ff]/40 focus-within:shadow-[0_0_0_3px_rgba(108,99,255,0.08)]'
          )}>
            <textarea ref={inputRef} value={input} onChange={handleInput} onKeyDown={handleKeyDown}
              disabled={inputDisabled}
              placeholder={isGenerating ? 'Generating your course…' : genState.status === 'done' ? 'Ask a question about your course…' : 'Describe what you want to learn…'}
              rows={1}
              className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#f0eeff] placeholder:text-white/25 resize-none py-3 min-h-[46px] max-h-[160px] leading-relaxed disabled:cursor-not-allowed font-['Geist',sans-serif]"
            />
            <button onClick={handleSend} disabled={!input.trim() || inputDisabled}
              className="w-9 h-9 bg-[#6c63ff] rounded-xl flex items-center justify-center flex-shrink-0 mb-1 transition-all duration-200 hover:bg-[#7c75ff] hover:shadow-[0_0_16px_rgba(108,99,255,0.4)] hover:-translate-y-px disabled:opacity-35 disabled:cursor-not-allowed disabled:transform-none">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
          <p className="text-[11px] text-white/20 mt-2 text-center">
            <kbd className="font-mono bg-white/5 border border-white/8 rounded px-1 py-px text-[10px]">Enter</kbd> send ·{' '}
            <kbd className="font-mono bg-white/5 border border-white/8 rounded px-1 py-px text-[10px]">Shift+Enter</kbd> new line
          </p>
        </div>
      </div>
    </div>
  )
}
