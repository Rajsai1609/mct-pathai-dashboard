'use client'

export const dynamic = 'force-dynamic'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { CheckCircle2, Mail, Phone, ArrowRight, RefreshCw, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

const TIER_NAMES: Record<string, string> = {
  tier_1_master_resume: 'Master Resume',
  tier_2_application_engine: 'Application Engine',
  tier_3_complete_package: 'Complete Career Package',
}

const NEXT_STEPS = [
  {
    icon: Mail,
    title: 'Check Your Email',
    desc: (email: string) => `Confirmation sent to ${email}`,
  },
  {
    icon: Phone,
    title: 'Expect a Call or Email',
    desc: () => 'Our team will reach out within 24 hours',
  },
  {
    icon: CheckCircle2,
    title: 'Free 15-Min Consultation',
    desc: () => "We'll align on your goals and answer your questions before any payment",
  },
]

function ThankYouContent() {
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [user, setUser] = useState<User | null>(null)
  const tierKey = searchParams.get('tier') ?? ''
  const tierName = TIER_NAMES[tierKey] ?? 'your selected plan'

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-400" />
      </div>

      {/* Headline */}
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        You&apos;re One Step Closer 🎯
      </h1>

      {/* Subtext */}
      <p className="text-slate-300 text-lg leading-relaxed mb-12">
        Thank you for choosing{' '}
        <span className="text-white font-semibold">{tierName}</span>.
        Our team will contact you within 24 hours to schedule your free 15-minute consultation.
        <br />
        <span className="text-slate-500 text-sm mt-2 block">
          No payment has been charged. This is a no-obligation consultation.
        </span>
      </p>

      {/* Next steps */}
      <div className="grid gap-4 mb-12 text-left">
        {NEXT_STEPS.map(({ icon: Icon, title, desc }, i) => (
          <div
            key={title}
            className="flex items-start gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-5"
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <span className="text-violet-400 text-xs font-bold">{i + 1}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-violet-400" />
                <p className="text-white font-semibold text-sm">{title}</p>
              </div>
              <p className="text-slate-400 text-sm">
                {desc(user?.email ?? 'your email')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Action links */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          View Your Dashboard <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/select-plan"
          className="inline-flex items-center gap-2 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 px-6 py-3 rounded-xl text-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Change my plan selection
        </Link>
      </div>

      {/* Contact block */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
        <p className="text-slate-400 text-sm mb-4">
          Questions? Reach out anytime before your consultation.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
          <a
            href="mailto:connect@theteammc.com"
            className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
          >
            <Mail className="w-4 h-4" />
            connect@theteammc.com
          </a>
          <a
            href="tel:+12065528424"
            className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
          >
            <Phone className="w-4 h-4" />
            +1 (206) 552-8424
          </a>
        </div>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Nav */}
      <nav className="border-b border-white/5 py-4 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-white font-bold text-lg">
            MCT <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">PathAI</span>
          </Link>
        </div>
      </nav>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
          </div>
        }
      >
        <ThankYouContent />
      </Suspense>
    </div>
  )
}
