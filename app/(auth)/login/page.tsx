'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      <Card className="w-full max-w-md bg-[#0f0f18] border-white/10">
        <CardHeader>
          <div className="font-mono text-[15px] font-medium text-white flex items-center gap-1.5 mb-2">
            <span className="text-[#6c63ff]">L&gt;</span>
            <span>lernix</span>
          </div>
          <CardTitle className="text-xl text-white">Welcome back</CardTitle>
          <CardDescription className="text-white/40">Enter your email to get a magic link</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-sm text-white/50">
              ✅ Check your email for the login link.
            </p>
          ) : (
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="bg-[#0a0a0f] border-white/10 text-white placeholder:text-white/20"
              />
              <Button type="submit" disabled={loading} className="bg-[#6c63ff] hover:bg-[#7c75ff]">
                {loading ? 'Sending…' : 'Send Magic Link'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}