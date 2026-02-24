'use client'

import Link from 'next/link'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6 font-['Geist',sans-serif]">
      <div className="max-w-sm text-center space-y-5">
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/15 rounded-xl flex items-center justify-center text-xl mx-auto">
          ⚠
        </div>
        <h2 className="font-['Instrument_Serif',serif] text-[24px] font-normal text-[#f0eeff]">
          Something went wrong
        </h2>
        <p className="text-[13.5px] text-white/35 leading-relaxed">
          {error.message?.length < 100
            ? error.message
            : 'An unexpected error occurred loading this page.'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="text-[13px] font-medium bg-[#6c63ff]/12 border border-[#6c63ff]/25 text-[#a5a0ff] hover:bg-[#6c63ff]/20 px-4 py-2 rounded-lg transition-all"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="text-[13px] text-white/35 hover:text-white/60 border border-white/8 hover:border-white/18 px-4 py-2 rounded-lg transition-all"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
