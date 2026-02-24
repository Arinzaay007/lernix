'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface Props {
  email: string
  userId: string
  createdAt: string
  courseCount: number
}

export function AccountSettingsShell({ email, userId, createdAt, courseCount }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [sendingLink, setSendingLink] = useState(false)

  const joined = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function handleSendMagicLink() {
    setSendingLink(true)
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setMagicLinkSent(true)
    setSendingLink(false)
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== 'delete my account') return
    setDeleting(true)
    setDeleteError('')
    try {
      const res = await fetch('/api/account/delete', { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete account')
      await supabase.auth.signOut()
      router.push('/')
    } catch {
      setDeleteError('Something went wrong. Please try again.')
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] font-['Geist',sans-serif]">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40"
        style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`, backgroundSize:'200px' }} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-10 h-14 border-b border-white/7 bg-[#0a0a0f]/90 backdrop-blur-xl sticky top-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-mono text-[14px] font-medium text-white flex items-center gap-1.5 hover:opacity-70 transition-opacity">
            <span className="text-[#6c63ff]">L&gt;</span>
            <span>lernix</span>
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-[13px] text-white/40">Account settings</span>
        </div>
        <Link href="/dashboard" className="text-[13px] text-white/35 hover:text-white/60 transition-colors">
          ← Dashboard
        </Link>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-[640px] mx-auto px-6 py-14 flex flex-col gap-6">

        {/* Page title */}
        <div className="mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h1 className="font-['Instrument_Serif',serif] text-[32px] font-normal text-[#f0eeff]">
            Account <em className="italic text-[#9d97ff]">settings</em>
          </h1>
          <p className="text-[14px] text-white/35 mt-1">Joined {joined}</p>
        </div>

        {/* Profile card */}
        <Section title="Profile" delay="0.1s">
          <Row label="Email address">
            <span className="text-[14px] text-white/60 font-mono">{email}</span>
          </Row>
          <Row label="User ID">
            <span className="text-[12px] text-white/30 font-mono truncate max-w-[280px]">{userId}</span>
          </Row>
          <Row label="Courses created">
            <span className="text-[14px] text-[#a5a0ff] font-mono">{courseCount}</span>
          </Row>
        </Section>

        {/* Login section */}
        <Section title="Access" delay="0.15s">
          <div className="p-4">
            <p className="text-[13.5px] text-white/50 mb-3 leading-relaxed">
              Lernix uses magic links for sign-in — no passwords needed. Send a new magic link to your email to verify access.
            </p>
            {magicLinkSent ? (
              <div className="flex items-center gap-2 text-[13px] text-green-400/80">
                <span>✓</span> Magic link sent to {email}
              </div>
            ) : (
              <button
                onClick={handleSendMagicLink}
                disabled={sendingLink}
                className="text-[13px] font-medium bg-[#6c63ff]/12 border border-[#6c63ff]/25 text-[#a5a0ff] hover:bg-[#6c63ff]/20 px-4 py-2 rounded-lg transition-all disabled:opacity-50"
              >
                {sendingLink ? 'Sending…' : 'Send magic link'}
              </button>
            )}
          </div>
        </Section>

        {/* Sign out */}
        <Section title="Session" delay="0.2s">
          <div className="p-4 flex items-center justify-between">
            <p className="text-[13.5px] text-white/45">Sign out of your current session on this device.</p>
            <button
              onClick={handleSignOut}
              className="text-[13px] text-white/50 hover:text-white/80 border border-white/10 hover:border-white/20 px-4 py-2 rounded-lg transition-all flex-shrink-0"
            >
              Sign out
            </button>
          </div>
        </Section>

        {/* Danger zone */}
        <Section title="Danger zone" danger delay="0.25s">
          <div className="p-4">
            <p className="text-[13.5px] text-white/45 mb-4 leading-relaxed">
              Permanently delete your account and all courses. This cannot be undone.
            </p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-mono text-white/30 uppercase tracking-wider mb-1.5">
                  Type <span className="text-red-400/70">delete my account</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={e => setDeleteConfirm(e.target.value)}
                  placeholder="delete my account"
                  className="w-full bg-[#0f0f18] border border-white/10 rounded-lg px-3 py-2 text-[13px] text-white/70 outline-none focus:border-red-500/40 transition-colors font-mono placeholder:text-white/15"
                />
              </div>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'delete my account' || deleting}
                className="self-start text-[13px] font-medium bg-red-500/10 border border-red-500/20 text-red-400/70 hover:bg-red-500/15 hover:text-red-400 px-4 py-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting…' : 'Delete account'}
              </button>
              {deleteError && (
                <p className="text-[12px] text-red-400/60">{deleteError}</p>
              )}
            </div>
          </div>
        </Section>

      </div>
    </div>
  )
}

function Section({
  title, children, danger, delay,
}: {
  title: string
  children: React.ReactNode
  danger?: boolean
  delay?: string
}) {
  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-2 duration-500"
      style={{ animationDelay: delay, animationFillMode: 'both' }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className={cn(
          'text-[11px] font-semibold tracking-[0.08em] uppercase',
          danger ? 'text-red-400/50' : 'text-white/25'
        )}>
          {title}
        </span>
        <div className={cn('flex-1 h-px', danger ? 'bg-red-500/10' : 'bg-white/5')} />
      </div>
      <div className={cn(
        'bg-[#0f0f18] rounded-2xl border overflow-hidden',
        danger ? 'border-red-500/10' : 'border-white/7'
      )}>
        {children}
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5 last:border-0">
      <span className="text-[13px] text-white/40">{label}</span>
      {children}
    </div>
  )
}
