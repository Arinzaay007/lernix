export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] font-['Geist',sans-serif]">
      {/* Nav skeleton */}
      <nav className="flex items-center justify-between px-10 h-14 border-b border-white/7">
        <div className="w-20 h-4 bg-white/6 rounded-md animate-pulse" />
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-white/5 rounded-[10px] animate-pulse" />
          <div className="w-28 h-8 bg-white/5 rounded-[9px] animate-pulse" />
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-10 py-14">
        {/* Title */}
        <div className="flex items-end justify-between mb-12">
          <div className="w-48 h-9 bg-white/6 rounded-lg animate-pulse" />
          <div className="w-16 h-4 bg-white/4 rounded animate-pulse" />
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-12">
          {[140, 120, 130].map((w, i) => (
            <div key={i} className="bg-[#0f0f18] border border-white/7 rounded-2xl px-5 py-4" style={{ minWidth: w }}>
              <div className="w-10 h-8 bg-white/6 rounded animate-pulse mb-2" />
              <div className="w-24 h-3 bg-white/4 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Section label */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-20 h-2.5 bg-white/5 rounded animate-pulse" />
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Featured card */}
          <div className="col-span-2 bg-[#0f0f18] border border-white/7 rounded-[18px] p-7 flex gap-8 items-center">
            <div className="flex-1 space-y-3">
              <div className="flex gap-2">
                <div className="w-16 h-5 bg-white/6 rounded-full animate-pulse" />
              </div>
              <div className="w-3/4 h-7 bg-white/6 rounded-lg animate-pulse" />
              <div className="w-full h-4 bg-white/4 rounded animate-pulse" />
              <div className="w-2/3 h-4 bg-white/4 rounded animate-pulse" />
              <div className="flex items-center gap-4 pt-2">
                <div className="w-20 h-3 bg-white/4 rounded animate-pulse" />
                <div className="w-16 h-3 bg-white/4 rounded animate-pulse" />
              </div>
            </div>
            <div className="w-[72px] h-[72px] rounded-full border-2 border-white/6 flex-shrink-0 animate-pulse" />
          </div>

          {/* Smaller cards */}
          {[0, 1].map(i => (
            <div key={i} className="bg-[#0f0f18] border border-white/7 rounded-[18px] p-7">
              <div className="flex gap-6 items-start">
                <div className="flex-1 space-y-3">
                  <div className="w-14 h-5 bg-white/6 rounded-full animate-pulse" />
                  <div className="w-5/6 h-6 bg-white/6 rounded-lg animate-pulse" />
                  <div className="w-full h-4 bg-white/4 rounded animate-pulse" />
                  <div className="w-1/2 h-4 bg-white/4 rounded animate-pulse" />
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-white/6 flex-shrink-0 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
