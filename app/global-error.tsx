'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6 font-sans">
        <div className="max-w-md text-center space-y-5">
          <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-2xl mx-auto">
            ⚡
          </div>
          <h1 className="text-[26px] font-normal text-white" style={{ fontFamily: 'Georgia, serif' }}>
            Something broke
          </h1>
          <p className="text-[14px] text-white/40 leading-relaxed">
            An unexpected error occurred. Our team has been notified.
            {error.digest && (
              <span className="block mt-1 font-mono text-[11px] text-white/20">
                Error ID: {error.digest}
              </span>
            )}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={reset}
              className="text-[13px] font-medium px-5 py-2.5 rounded-xl border text-white/60 border-white/15 hover:border-white/25 hover:text-white/80 transition-all"
            >
              Try again
            </button>
            <Link
              href="/"
              className="text-[13px] font-medium px-5 py-2.5 rounded-xl bg-white/8 text-white/60 hover:bg-white/12 transition-all"
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
