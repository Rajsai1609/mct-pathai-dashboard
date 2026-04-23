'use client'

export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Mail, Phone, Loader2 } from 'lucide-react'
import Link from 'next/link'

type TierKey = 'tier_1_master_resume' | 'tier_2_application_engine' | 'tier_3_complete_package'

const TIER_MESSAGES: Record<TierKey, string> = {
  tier_1_master_resume:
    'Thanks for choosing Master Resume ($499 one-time). Our team will contact you within 12–24 hours to schedule your free 15-minute consultation.',
  tier_2_application_engine:
    'Thanks for choosing Application Engine ($299/mo). Our team will contact you within 12–24 hours to schedule your free 15-minute consultation.',
  tier_3_complete_package:
    'Thanks for choosing Complete Career Package. Our team will contact you within 12–24 hours to schedule your free 15-minute consultation.',
}

const GENERIC_MESSAGE =
  'Our team will contact you within 12–24 hours to schedule your free 15-minute consultation.'

const NEXT_STEPS = [
  {
    number: '1',
    title: 'Check Your Email',
    desc: 'A confirmation is on its way to your inbox.',
  },
  {
    number: '2',
    title: 'Expect a Call or Email',
    desc: 'Our team reaches out within 12–24 hours.',
  },
  {
    number: '3',
    title: 'Free Consultation',
    desc: "We'll align on your goals before any payment.",
  },
]

function ThankYouContent() {
  const searchParams = useSearchParams()
  const tierParam = searchParams.get('tier') ?? ''

  const validTiers: TierKey[] = [
    'tier_1_master_resume',
    'tier_2_application_engine',
    'tier_3_complete_package',
  ]
  const tier = validTiers.includes(tierParam as TierKey) ? (tierParam as TierKey) : null
  const message = tier ? TIER_MESSAGES[tier] : GENERIC_MESSAGE

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30 mb-6">
        <CheckCircle2 className="w-10 h-10 text-violet-400" />
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Your Spot Is Reserved 🎯
      </h1>

      <p className="text-slate-300 text-lg leading-relaxed mb-12 max-w-xl mx-auto">
        {message}
        <br />
        <span className="text-slate-500 text-sm mt-2 block">
          No payment has been charged. This is a no-obligation consultation.
        </span>
      </p>

      {/* Next steps */}
      <div className="grid gap-4 mb-12 text-left">
        {NEXT_STEPS.map(({ number, title, desc }) => (
          <div
            key={number}
            className="flex items-start gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-5"
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <span className="text-violet-400 text-xs font-bold">{number}</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-0.5">{title}</p>
              <p className="text-slate-400 text-sm">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact block */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-10">
        <p className="text-slate-400 text-sm mb-4">Questions? Reach out anytime.</p>
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

      {/* CTA */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        ← Back to Home
      </Link>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <nav className="border-b border-white/5 py-4 px-6">
        <div className="max-w-2xl mx-auto">
          <span className="text-white font-bold text-lg">
            MCT{' '}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              PathAI
            </span>
          </span>
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
