import { Suspense } from 'react'
import ChatPageInner from './ChatPageInner'

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col h-screen bg-[#0a0a0f]">
          <div className="flex items-center justify-between px-6 h-14 border-b border-white/7 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-16 h-4 bg-white/6 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-14 h-14 bg-white/4 rounded-2xl animate-pulse" />
          </div>
          <div className="flex-shrink-0 px-6 pb-6 pt-4 border-t border-white/7">
            <div className="max-w-[700px] mx-auto h-14 bg-[#111118] border border-white/7 rounded-2xl animate-pulse" />
          </div>
        </div>
      }
    >
      <ChatPageInner />
    </Suspense>
  )
}
