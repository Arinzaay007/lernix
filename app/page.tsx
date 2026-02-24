import { HeroInput } from '@/components/home/HeroInput'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col relative overflow-hidden">
      {/* Noise */}
      <div className="noise" />

      {/* Orbs */}
      <div className="orb w-[600px] h-[600px] -top-48 -left-36"
        style={{ background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)' }} />
      <div className="orb w-[500px] h-[500px] -bottom-24 -right-24"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)' }} />

      {/* Grid lines */}
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-10 h-14 border-b border-white/7 bg-[#0a0a0f]/80 backdrop-blur-xl animate-fade-up">
        <Link href="/" className="font-mono text-[15px] font-medium text-white flex items-center gap-1.5">
          <span className="text-[#6c63ff]">L&gt;</span>
          <span>lernix</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-[13px] text-white/45 hover:text-white/70 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/4">
            My courses
          </Link>
          <Link href="/login" className="text-[13px] font-medium bg-[#6c63ff] hover:bg-[#7c75ff] text-white px-4 py-2 rounded-[9px] transition-all hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] hover:-translate-y-px">
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 text-center gap-0">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 bg-[#6c63ff]/12 border border-[#6c63ff]/25 rounded-full px-3.5 py-1.5 text-[11px] font-medium text-[#a5a0ff] uppercase tracking-[0.04em] mb-9 animate-fade-up"
          style={{ animationDelay: '0.1s' }}
        >
          <span className="w-1.5 h-1.5 bg-[#6c63ff] rounded-full shadow-[0_0_8px_#6c63ff] animate-[pulseDot_2s_ease_infinite]" />
          AI-powered learning
        </div>

        {/* Heading */}
        <h1
          className="font-display text-[clamp(52px,9vw,100px)] font-normal leading-[1.02] tracking-[-0.02em] mb-6 max-w-[900px] animate-fade-up"
          style={{ animationDelay: '0.18s' }}
        >
          Learn anything,{' '}
          <em
            className="italic"
            style={{
              background: 'linear-gradient(135deg, #9d97ff 0%, #6c63ff 40%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            deeply.
          </em>
        </h1>

        {/* Sub */}
        <p
          className="text-[clamp(16px,2vw,19px)] text-white/45 font-light leading-[1.65] max-w-[520px] mb-14 animate-fade-up"
          style={{ animationDelay: '0.28s' }}
        >
          Describe what you want to learn. Lernix asks a few quick questions,
          then builds a full personalized course — structured lessons, code
          examples, practice exercises.
        </p>

        {/* Input */}
        <HeroInput />
      </main>

      {/* Feature strip */}
      <footer
        className="relative z-10 flex justify-center gap-10 px-10 py-12 border-t border-white/7 animate-fade-up"
        style={{ animationDelay: '0.6s' }}
      >
        {[
          { icon: '⚡', label: 'Full course in <60 seconds' },
          { icon: '🎯', label: 'Personalized to your level' },
          { icon: '💬', label: 'Chat to refine any lesson' },
          { icon: '📚', label: 'Saved to your dashboard' },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-2.5 text-[13px] text-white/30">
            <div className="w-8 h-8 bg-[#6c63ff]/10 rounded-lg flex items-center justify-center text-[15px]">
              {icon}
            </div>
            {label}
          </div>
        ))}
      </footer>
    </div>
  )
}
