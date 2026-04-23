'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Check, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

type TierKey = 'tier_1_master_resume' | 'tier_2_application_engine' | 'tier_3_complete_package'

interface Tier {
  id: TierKey
  name: string
  price: string
  billing: string
  tagline: string
  features: string[]
  cta: string
  popular: boolean
}

const TIERS: Tier[] = [
  {
    id: 'tier_1_master_resume',
    name: 'Master Resume',
    price: '$499',
    billing: 'One-time payment',
    tagline: 'Get your resume and GitHub portfolio job-ready',
    features: [
      'Professional resume tailored to your target roles',
      'GitHub portfolio review and optimization',
      'ATS-compatible formatting',
      '1-on-1 consultation with our team',
      'Delivered within 5 business days',
    ],
    cta: 'Select Master Resume →',
    popular: false,
  },
  {
    id: 'tier_2_application_engine',
    name: 'Application Engine',
    price: '$299',
    billing: 'per month',
    tagline: 'We apply to 50 tailored jobs per month for you',
    features: [
      '50 tailored applications per month',
      'Custom cover letter per application',
      'H1B-verified company targeting',
      'Weekly progress reports',
      'Cancel anytime',
    ],
    cta: 'Select Application Engine →',
    popular: false,
  },
  {
    id: 'tier_3_complete_package',
    name: 'Complete Career Package',
    price: '$399 + $249/mo',
    billing: 'One-time + monthly',
    tagline: 'Everything you need — save $150 upfront, $50/mo ongoing',
    features: [
      'Everything in Master Resume ($499 → $399, save $100)',
      'Everything in Application Engine ($299 → $249/mo, save $50/mo)',
      'Priority support',
      'Dedicated account manager',
      'Total first month: $648 (vs $798 separately)',
    ],
    cta: 'Select Complete Package →',
    popular: true,
  },
]

export default function SelectPlanPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [selecting, setSelecting] = useState<TierKey | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      router.push('/signup')
      return
    }

    // If tier already selected, send home
    const { data: userRow } = await supabase
      .from('paid_users')
      .select('selected_tier')
      .eq('email', authUser.email)
      .maybeSingle()

    if (userRow?.selected_tier) {
      router.push('/')
      return
    }

    setUser(authUser)
    setLoading(false)
  }

  const selectTier = async (tier: Tier) => {
    if (!user) return
    setSelecting(tier.id)
    setError('')

    try {
      const { error: updateErr } = await supabase
        .from('paid_users')
        .update({
          selected_tier: tier.id,
          tier_selected_at: new Date().toISOString(),
          consultation_status: 'pending',
        })
        .eq('email', user.email)

      if (updateErr) throw updateErr

      // TODO: Replace with real email notification when infrastructure is ready
      console.log('[NOTIFICATION] New tier selection — send to connect@theteammc.com', {
        name: user.user_metadata?.full_name ?? 'Unknown',
        email: user.email,
        tier: tier.id,
        tier_name: tier.name,
        timestamp: new Date().toISOString(),
      })

      router.push(`/thank-you?tier=${tier.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setSelecting(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Nav */}
      <nav className="border-b border-white/5 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg">
            MCT <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">PathAI</span>
          </Link>
          <span className="text-slate-500 text-xs">
            Signed in as <span className="text-slate-300">{user?.email}</span>
          </span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-violet-400 text-xs font-semibold tracking-widest uppercase mb-3">
            Step 1 of 1
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Path Forward
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Pick the plan that matches where you are in your job search. Our team will contact you
            within 24 hours for a free 15-minute consultation.
          </p>
          <p className="text-slate-600 text-sm mt-2">
            No payment today — this is just your intent selection.
          </p>
        </div>

        {error && (
          <div className="max-w-xl mx-auto mb-8 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Tier cards */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={[
                'relative rounded-2xl p-8 flex flex-col transition-all',
                tier.popular
                  ? 'bg-white/5 border-2 border-violet-500/70 shadow-2xl shadow-violet-500/20 md:scale-[1.03]'
                  : 'bg-white/[0.03] border border-white/10 hover:border-white/20',
              ].join(' ')}
            >
              {/* Most popular badge */}
              {tier.popular && (
                <div className="absolute -top-3.5 right-6">
                  <span className="bg-gradient-to-r from-violet-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Tier name */}
              <p className={[
                'text-xs font-semibold tracking-widest uppercase mb-4',
                tier.popular ? 'text-violet-400' : 'text-slate-500',
              ].join(' ')}>
                {tier.name}
              </p>

              {/* Price */}
              <div className="mb-1">
                <span className="text-4xl font-black text-white">{tier.price}</span>
              </div>
              <p className="text-slate-500 text-xs mb-3">{tier.billing}</p>

              {/* Tagline */}
              <p className="text-slate-300 text-sm leading-relaxed mb-8">
                {tier.tagline}
              </p>

              {/* Features */}
              <ul className="space-y-2.5 mb-10 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => selectTier(tier)}
                disabled={selecting !== null}
                className={[
                  'w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2',
                  tier.popular
                    ? 'bg-gradient-to-r from-violet-500 to-blue-500 text-white hover:opacity-90'
                    : 'border border-white/20 text-slate-200 hover:border-white/40 hover:text-white',
                ].join(' ')}
              >
                {selecting === tier.id
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                  : tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Trust note */}
        <p className="text-center text-slate-600 text-xs mt-12">
          🔒 Selecting a plan doesn&apos;t charge anything. Your dedicated consultant will walk you through
          next steps and answer all questions before any payment is made.
        </p>
      </div>
    </div>
  )
}
