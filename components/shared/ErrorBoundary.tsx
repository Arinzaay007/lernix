'use client'

import { Component, ReactNode } from 'react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to your error tracking service here
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
          <div className="max-w-md text-center space-y-5">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-2xl mx-auto">
              ⚠
            </div>
            <h2 className="font-['Instrument_Serif',serif] text-[26px] font-normal text-[#f0eeff]">
              Something went wrong
            </h2>
            <p className="text-[14px] text-white/40 leading-relaxed">
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="text-[13px] font-medium bg-[#6c63ff]/12 border border-[#6c63ff]/25 text-[#a5a0ff] hover:bg-[#6c63ff]/20 px-4 py-2 rounded-lg transition-all"
              >
                Try again
              </button>
              <Link
                href="/dashboard"
                className="text-[13px] text-white/40 hover:text-white/60 border border-white/10 hover:border-white/20 px-4 py-2 rounded-lg transition-all"
              >
                Go to dashboard
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
