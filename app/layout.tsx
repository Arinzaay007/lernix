import type { Metadata } from 'next'
import { Instrument_Serif, DM_Mono, Geist } from 'next/font/google'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-mono',
  display: 'swap',
})

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Lernix — Learn anything, deeply.',
    template: '%s — Lernix',
  },
  description: 'Describe what you want to learn. Get a full personalized course instantly.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'Lernix — Learn anything, deeply.',
    description: 'Describe what you want to learn. Get a full personalized course instantly.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${dmMono.variable} ${geist.variable}`}>
      <body className="bg-[#0a0a0f] text-[#f0eeff] antialiased">
        {children}
      </body>
    </html>
  )
}
