import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6 text-center gap-5 font-['Geist',sans-serif]">
      {/* Noise */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
        }}
      />

      <div className="relative z-10 space-y-5 max-w-md">
        <div className="font-mono text-[11px] text-[#6c63ff] tracking-[0.1em] uppercase mb-2">
          404
        </div>
        <h1 className="font-['Instrument_Serif',serif] text-[40px] font-normal text-[#f0eeff] leading-tight">
          Page not <em className="italic text-[#9d97ff]">found</em>
        </h1>
        <p className="text-[15px] text-white/35 leading-relaxed">
          This page doesn't exist or you don't have access to it.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="text-[13px] font-medium bg-[#6c63ff] hover:bg-[#7c75ff] text-white px-5 py-2.5 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] hover:-translate-y-px"
          >
            Go to dashboard
          </Link>
          <Link
            href="/"
            className="text-[13px] text-white/40 hover:text-white/65 border border-white/10 hover:border-white/20 px-5 py-2.5 rounded-xl transition-all"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}
