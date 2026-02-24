export function ReaderSkeleton() {
  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between h-[52px] border-b border-white/7 px-0 pr-5 flex-shrink-0">
        <div className="flex items-center h-full">
          <div className="w-[272px] flex items-center gap-3 px-5 border-r border-white/7 h-full">
            <div className="w-16 h-4 bg-white/6 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2 px-5">
            <div className="w-20 h-3 bg-white/4 rounded animate-pulse" />
            <div className="w-2 h-2 bg-white/4 rounded-full" />
            <div className="w-48 h-3 bg-white/4 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-14 h-6 bg-white/4 rounded-md animate-pulse" />
          <div className="w-32 h-8 bg-white/5 rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar skeleton */}
        <div className="w-[272px] flex-shrink-0 bg-[#0d0d14] border-r border-white/7 p-4 space-y-2">
          <div className="w-24 h-2.5 bg-white/5 rounded animate-pulse mb-4" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-start gap-2.5 px-2 py-2.5">
              <div className="w-[18px] h-[18px] rounded-full border border-white/10 flex-shrink-0 animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="w-8 h-2 bg-white/5 rounded animate-pulse" />
                <div
                  className="h-3 bg-white/6 rounded animate-pulse"
                  style={{ width: `${60 + (i % 3) * 15}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Main content skeleton */}
        <div className="flex-1 overflow-hidden p-12 max-w-[720px] mx-auto w-full">
          {/* Eyebrow */}
          <div className="w-16 h-3 bg-white/5 rounded animate-pulse mb-3" />
          {/* Title */}
          <div className="w-3/4 h-10 bg-white/6 rounded-lg animate-pulse mb-3" />
          <div className="w-1/2 h-10 bg-white/6 rounded-lg animate-pulse mb-10" />

          {/* Nav buttons */}
          <div className="flex gap-2 mb-12 pb-8 border-b border-white/5">
            <div className="w-24 h-8 bg-white/5 rounded-lg animate-pulse" />
            <div className="w-32 h-8 bg-white/5 rounded-lg animate-pulse" />
          </div>

          {/* Content paragraphs */}
          <div className="space-y-4">
            <div className="w-full h-4 bg-white/5 rounded animate-pulse" />
            <div className="w-5/6 h-4 bg-white/5 rounded animate-pulse" />
            <div className="w-4/5 h-4 bg-white/5 rounded animate-pulse" />
            <div className="w-full h-4 bg-white/5 rounded animate-pulse" />

            <div className="w-40 h-6 bg-white/6 rounded animate-pulse mt-8 mb-3" />

            <div className="w-full h-4 bg-white/4 rounded animate-pulse" />
            <div className="w-5/6 h-4 bg-white/4 rounded animate-pulse" />

            {/* Code block skeleton */}
            <div className="w-full h-36 bg-[#0d0d14] border border-white/7 rounded-xl animate-pulse mt-6" />

            <div className="w-full h-4 bg-white/4 rounded animate-pulse mt-6" />
            <div className="w-3/4 h-4 bg-white/4 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
