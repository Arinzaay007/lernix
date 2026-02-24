'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const EXAMPLES = [
  'SQL for backend developers',
  'TypeScript generics, deep dive',
  'How DNS actually works',
  'CSS Grid & Flexbox mastery',
  'System design fundamentals',
]

export function HeroInput() {
  const [value, setValue] = useState('')
  const router = useRouter()
  const ref = useRef<HTMLTextAreaElement>(null)

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function submit() {
    const trimmed = value.trim()
    if (!trimmed) return
    router.push(`/chat?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <div
      className="w-full max-w-[680px] animate-fade-up"
      style={{ animationDelay: '0.42s' }}
    >
      {/* Input box */}
      <div className="flex items-end gap-3 bg-[#111118] border border-white/7 rounded-2xl px-5 py-1 transition-all duration-300 focus-within:border-[#6c63ff]/50 focus-within:shadow-[0_0_0_3px_rgba(108,99,255,0.1),0_0_40px_rgba(108,99,255,0.08)]">
        <textarea
          ref={ref}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Learn React hooks — I know JSX basics, want to understand useState, useEffect, and custom hooks…"
          rows={1}
          autoFocus
          className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#f0eeff] placeholder:text-white/20 resize-none py-4 min-h-[54px] max-h-[200px] leading-relaxed font-body"
        />
        <button
          onClick={submit}
          className="w-11 h-11 bg-[#6c63ff] hover:bg-[#7c75ff] rounded-[14px] flex items-center justify-center flex-shrink-0 mb-1 transition-all duration-200 hover:shadow-[0_0_20px_rgba(108,99,255,0.5)] hover:scale-105 active:scale-95"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <p className="text-[12px] text-white/20 text-center mt-3">
        Press{' '}
        <kbd className="font-mono bg-white/5 border border-white/8 rounded px-1.5 py-0.5 text-[10px]">Enter</kbd>
        {' '}to start ·{' '}
        <kbd className="font-mono bg-white/5 border border-white/8 rounded px-1.5 py-0.5 text-[10px]">Shift+Enter</kbd>
        {' '}for new line
      </p>

      {/* Example chips */}
      <div
        className="flex flex-wrap gap-2 justify-center mt-7 animate-fade-up"
        style={{ animationDelay: '0.55s' }}
      >
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => {
              setValue(ex)
              if (ref.current) {
                ref.current.style.height = 'auto'
                ref.current.style.height = Math.min(ref.current.scrollHeight, 200) + 'px'
                ref.current.focus()
              }
            }}
            className="text-[13px] text-white/35 border border-white/8 rounded-full px-3.5 py-1.5 hover:text-white/70 hover:border-[#6c63ff]/40 hover:bg-[#6c63ff]/8 transition-all duration-200 whitespace-nowrap"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}
