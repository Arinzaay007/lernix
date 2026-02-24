'use client'

import { UIMessage } from '@/types'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  message: UIMessage
  isStreaming?: boolean
}

// Minimal inline markdown renderer for chat (not full MDX — just bold, code, newlines)
function renderContent(text: string) {
  // Split on code blocks first
  const parts = text.split(/(```[\s\S]*?```)/g)
  return parts.map((part, i) => {
    if (part.startsWith('```')) {
      const lines = part.slice(3, -3).split('\n')
      const lang = lines[0].trim()
      const code = lines.slice(1).join('\n')
      return (
        <pre key={i} className="my-3 rounded-lg bg-[#0d0d14] border border-white/8 p-4 overflow-x-auto">
          {lang && (
            <div className="text-[10px] font-mono text-[#6c63ff] mb-2 uppercase tracking-wider">{lang}</div>
          )}
          <code className="text-[13px] font-mono text-[#c9c6ff] leading-relaxed">
            {code}
          </code>
        </pre>
      )
    }

    // Inline formatting
    return (
      <span key={i}>
        {part.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\n)/g).map((seg, j) => {
          if (seg.startsWith('**') && seg.endsWith('**')) {
            return <strong key={j} className="font-semibold text-white">{seg.slice(2, -2)}</strong>
          }
          if (seg.startsWith('*') && seg.endsWith('*') && seg.length > 2) {
            return <em key={j} className="italic">{seg.slice(1, -1)}</em>
          }
          if (seg.startsWith('`') && seg.endsWith('`')) {
            return (
              <code key={j} className="bg-white/8 border border-white/10 rounded px-1.5 py-0.5 text-[12.5px] font-mono text-[#a5a0ff]">
                {seg.slice(1, -1)}
              </code>
            )
          }
          if (seg === '\n') return <br key={j} />
          return seg
        })}
      </span>
    )
  })
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-3 py-1 animate-in fade-in slide-in-from-bottom-2 duration-300', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div className={cn(
        'w-8 h-8 rounded-[10px] flex items-center justify-center text-[11px] font-mono font-medium flex-shrink-0 mt-0.5',
        isUser
          ? 'bg-white/6 border border-white/10 text-white/60'
          : 'bg-[#6c63ff]/15 border border-[#6c63ff]/25 text-[#6c63ff]'
      )}>
        {isUser ? '✦' : 'L>'}
      </div>

      {/* Bubble */}
      <div className={cn(
        'max-w-[82%] rounded-2xl px-4 py-3 text-[14.5px] leading-[1.65]',
        isUser
          ? 'bg-[#1a1830] border border-[#6c63ff]/20 rounded-tr-[4px] text-[#f0eeff]'
          : 'bg-[#14141e] border border-white/7 rounded-tl-[4px] text-[#f0eeff]'
      )}>
        {message.content ? (
          renderContent(message.content)
        ) : isStreaming ? null : (
          <span className="text-white/30 italic text-sm">…</span>
        )}
        {isStreaming && message.role === 'assistant' && (
          <span className="inline-block w-[2px] h-[14px] bg-[#6c63ff] ml-0.5 align-middle animate-pulse" />
        )}
      </div>
    </div>
  )
}

// Animated typing indicator
export function TypingIndicator() {
  return (
    <div className="flex gap-3 py-1 animate-in fade-in duration-300">
      <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[11px] font-mono font-medium flex-shrink-0 bg-[#6c63ff]/15 border border-[#6c63ff]/25 text-[#6c63ff]">
        L&gt;
      </div>
      <div className="bg-[#14141e] border border-white/7 rounded-2xl rounded-tl-[4px] px-4 py-[14px] flex gap-[5px] items-center">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-[6px] h-[6px] bg-white/25 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: '1s' }}
          />
        ))}
      </div>
    </div>
  )
}
