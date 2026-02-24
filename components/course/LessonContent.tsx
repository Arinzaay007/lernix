'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useState } from 'react'
import { Lesson } from '@/types'
import { cn } from '@/lib/utils'

interface LessonContentProps {
  lesson: Lesson
  prevLesson: Lesson | null
  nextLesson: Lesson | null
  isCompleted: boolean
  onComplete: () => void
  onNavigate: (lessonId: string) => void
  courseId: string
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="font-mono text-[11px] text-white/25 hover:text-white/50 bg-transparent border-none cursor-pointer px-1.5 py-0.5 rounded transition-colors"
    >
      {copied ? 'copied!' : 'copy'}
    </button>
  )
}

export function LessonContent({
  lesson, prevLesson, nextLesson, isCompleted, onComplete, onNavigate, courseId
}: LessonContentProps) {
  return (
    <article className="max-w-[720px] mx-auto px-12 py-14 pb-32 animate-in fade-in duration-300">
      {/* Eyebrow */}
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-[11px] text-[#a5a0ff] tracking-[0.06em] uppercase">
          Lesson {String(lesson.order_index).padStart(2, '0')}
        </span>
        <div className="flex-1 h-px bg-white/7" />
      </div>

      {/* Title */}
      <h1 className="font-['Instrument_Serif',serif] text-[clamp(28px,4vw,40px)] font-normal leading-[1.15] tracking-[-0.01em] text-[#f0eeff] mb-8">
        {lesson.title}
      </h1>

      {/* Lesson nav */}
      <div className="flex gap-2 mb-12 pb-8 border-b border-white/5">
        {prevLesson && (
          <button
            onClick={() => onNavigate(prevLesson.id)}
            className="flex items-center gap-1.5 bg-[#111118] border border-white/8 text-white/50 hover:text-white hover:border-white/20 text-[12px] px-3 py-1.5 rounded-lg transition-all"
          >
            ← Previous
          </button>
        )}
        {nextLesson && (
          <button
            onClick={() => onNavigate(nextLesson.id)}
            className="flex items-center gap-1.5 bg-[#6c63ff]/12 border border-[#6c63ff]/25 text-[#a5a0ff] hover:bg-[#6c63ff]/20 text-[12px] px-3 py-1.5 rounded-lg transition-all"
          >
            Next lesson →
          </button>
        )}
      </div>

      {/* Markdown content */}
      <div className="prose-lernix">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => (
              <h2 className="font-['Instrument_Serif',serif] text-[24px] font-normal text-[#f0eeff] mt-10 mb-3.5 leading-[1.25] tracking-[-0.01em]">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="font-mono text-[11px] font-semibold text-[#a5a0ff] mt-7 mb-2.5 uppercase tracking-[0.06em]">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-[16px] leading-[1.8] text-[#d0cde8] mb-5">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="mb-5 space-y-2">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-5 space-y-2 list-none counter-reset-[list]">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="relative pl-5 text-[15px] leading-[1.7] text-[#c0bdd9] before:content-['·'] before:absolute before:left-1.5 before:text-[#6c63ff] before:text-lg before:leading-[1.35]">
                {children}
              </li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-white">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic text-[#b8b4d8]">{children}</em>
            ),
            code: ({ children, className }) => {
              // Inline code
              if (!className) {
                return (
                  <code className="font-mono text-[13.5px] bg-[#6c63ff]/10 border border-[#6c63ff]/15 text-[#b8b4ff] px-1.5 py-0.5 rounded-[5px]">
                    {children}
                  </code>
                )
              }
              // Block code (handled by pre)
              return <code className={className}>{children}</code>
            },
            pre: ({ children }) => {
              // Extract lang and code text
              const codeEl = children as React.ReactElement<{ className?: string; children?: string }>
              const langClass = codeEl?.props?.className || ''
              const lang = langClass.replace('language-', '') || 'code'
              const codeText = String(codeEl?.props?.children || '').trimEnd()

              return (
                <div className="my-6 rounded-xl border border-white/7 bg-[#0d0d14] overflow-hidden relative">
                  {/* Top gradient line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#6c63ff] to-transparent opacity-50" />

                  {/* Code header */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
                    <span className="font-mono text-[11px] text-[#a5a0ff] tracking-[0.04em]">{lang}</span>
                    <CopyButton code={codeText} />
                  </div>

                  {/* Code body */}
                  <pre className="overflow-x-auto p-4">
                    <code className="font-mono text-[13.5px] leading-[1.7] text-[#c9c6ff] block whitespace-pre">
                      {codeText}
                    </code>
                  </pre>
                </div>
              )
            },
            blockquote: ({ children }) => (
              <div className="border-l-[3px] border-[#6c63ff] bg-[#6c63ff]/10 rounded-r-xl px-4 py-3.5 my-6">
                <div className="font-mono text-[10px] text-[#a5a0ff] uppercase tracking-[0.06em] mb-1.5">Note</div>
                <div className="text-[14.5px] text-[#c0bdd9] leading-relaxed">{children}</div>
              </div>
            ),
            hr: () => (
              <hr className="border-none border-t border-white/6 my-8" />
            ),
          }}
        >
          {lesson.content_md}
        </ReactMarkdown>
      </div>

      {/* Complete + Next row */}
      <div className="flex items-center justify-between mt-14 pt-8 border-t border-white/6">
        <button
          onClick={onComplete}
          className={cn(
            'flex items-center gap-2 font-medium text-[14px] px-5 py-2.5 rounded-xl transition-all duration-200',
            isCompleted
              ? 'bg-green-500/10 border border-green-500/20 text-green-400/80 cursor-default'
              : 'bg-[#6c63ff] text-white hover:bg-[#7c75ff] hover:shadow-[0_0_24px_rgba(108,99,255,0.4)] hover:-translate-y-px'
          )}
        >
          {isCompleted ? '✓ Completed' : 'Mark as complete'}
        </button>

        {nextLesson && (
          <button
            onClick={() => onNavigate(nextLesson.id)}
            className="flex items-center gap-1.5 text-[13px] text-white/45 hover:text-white/80 border border-white/8 hover:border-white/20 px-4 py-2 rounded-[9px] transition-all"
          >
            Next: <span className="text-white/60 max-w-[180px] truncate">{nextLesson.title}</span> →
          </button>
        )}
      </div>
    </article>
  )
}
