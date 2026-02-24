export default function ChatLoading() {
  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f]">
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-6 h-14 border-b border-white/7 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-16 h-4 bg-white/6 rounded animate-pulse" />
          <div className="w-px h-5 bg-white/8" />
          <div className="w-24 h-4 bg-white/4 rounded animate-pulse" />
        </div>
        <div className="w-20 h-6 bg-white/4 rounded-md animate-pulse" />
      </div>

      {/* Empty messages area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-white/4 rounded-2xl mx-auto animate-pulse" />
          <div className="w-48 h-6 bg-white/5 rounded-lg mx-auto animate-pulse" />
          <div className="w-64 h-4 bg-white/3 rounded mx-auto animate-pulse" />
        </div>
      </div>

      {/* Input area skeleton */}
      <div className="flex-shrink-0 px-6 pb-6 pt-4 border-t border-white/7">
        <div className="max-w-[700px] mx-auto">
          <div className="h-14 bg-[#111118] border border-white/7 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}
