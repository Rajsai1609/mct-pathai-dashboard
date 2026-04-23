'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, type FormEvent, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

const VALID_TIERS = [
  'tier_1_master_resume',
  'tier_2_application_engine',
  'tier_3_complete_package',
] as const

type TierKey = (typeof VALID_TIERS)[number]

const TIER_LABELS: Record<TierKey, string> = {
  tier_1_master_resume: 'Master Resume ($499 one-time)',
  tier_2_application_engine: 'Application Engine ($299/mo)',
  tier_3_complete_package: 'Complete Career Package ($399 + $249/mo)',
}

const VISA_OPTIONS = [
  { value: 'f1_no_opt',    label: 'F-1 Student (on-campus / no OPT yet)' },
  { value: 'f1_opt',       label: 'F-1 OPT' },
  { value: 'f1_stem_opt',  label: 'F-1 STEM OPT' },
  { value: 'h1b',          label: 'H-1B' },
  { value: 'other',        label: 'Other' },
]

const COUNTRY_CODES = [
  { code: '+1',  label: '+1 (US/CA)' },
  { code: '+91', label: '+91 (IN)' },
  { code: '+86', label: '+86 (CN)' },
  { code: '+44', label: '+44 (UK)' },
  { code: '+61', label: '+61 (AU)' },
  { code: '+49', label: '+49 (DE)' },
  { code: '+33', label: '+33 (FR)' },
  { code: '+55', label: '+55 (BR)' },
  { code: '+82', label: '+82 (KR)' },
  { code: '+81', label: '+81 (JP)' },
]

function JoinForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const tierParam = searchParams.get('tier') ?? ''
  const tier = VALID_TIERS.includes(tierParam as TierKey) ? (tierParam as TierKey) : null

  // Tiers 2 and 3 require explicit acknowledgment of the 8% success fee
  const requiresFeeAck =
    tier === 'tier_2_application_engine' || tier === 'tier_3_complete_package'

  const [fullName, setFullName]           = useState('')
  const [email, setEmail]                 = useState('')
  const [countryCode, setCountryCode]     = useState('+1')
  const [phone, setPhone]                 = useState('')
  const [visaStatus, setVisaStatus]       = useState('')
  const [visaOther, setVisaOther]         = useState('')
  const [feeAcknowledged, setFeeAcknowledged] = useState(false)
  const [submitting, setSubmitting]       = useState(false)
  const [error, setError]                 = useState('')

  useEffect(() => {
    if (!tier) router.replace('/premium')
  }, [tier, router])

  if (!tier) return null

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const fullPhone = `${countryCode}${phone.trim()}`

    const { error: insertErr } = await supabase.from('premium_leads').insert({
      full_name:                  fullName.trim(),
      email:                      email.trim().toLowerCase(),
      phone:                      fullPhone,
      visa_status:                visaStatus,
      visa_status_other:          visaStatus === 'other' ? visaOther.trim() || null : null,
      selected_tier:              tier,
      success_fee_acknowledged:   feeAcknowledged,
    })

    if (insertErr) {
      setError('Something went wrong saving your information. Please try again.')
      setSubmitting(false)
      return
    }

    try {
      await fetch('/api/notify-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name:                fullName.trim(),
          email:                    email.trim().toLowerCase(),
          phone:                    fullPhone,
          visa_status:              visaStatus,
          selected_tier:            tier,
          success_fee_acknowledged: feeAcknowledged,
          created_at:               new Date().toISOString(),
        }),
      })
    } catch {
      // webhook failure must not block the user
    }

    router.push(`/thank-you?tier=${tier}`)
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <nav className="border-b border-white/5 py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-white font-bold text-lg">
            MCT{' '}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              PathAI
            </span>
          </span>
          <Link href="/premium" className="text-slate-400 hover:text-white text-sm transition-colors">
            ← Back to Plans
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">Claim Your Spot</h1>
          <p className="text-slate-300">
            You selected{' '}
            <span className="text-white font-semibold">{TIER_LABELS[tier]}</span>
          </p>
          <Link
            href="/premium"
            className="text-violet-400 hover:text-violet-300 text-sm mt-1 inline-block transition-colors"
          >
            Change selection →
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white/5 border border-white/10 rounded-2xl p-8"
        >
          {/* Full Name */}
          <div>
            <label className="block text-slate-300 text-sm mb-1.5">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              placeholder="Your full name"
              className="w-full bg-white/5 border border-white/10 focus:border-violet-500 text-white px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-slate-600 text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-slate-300 text-sm mb-1.5">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/10 focus:border-violet-500 text-white px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-slate-600 text-sm"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-slate-300 text-sm mb-1.5">
              Phone Number <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={e => setCountryCode(e.target.value)}
                className="bg-white/5 border border-white/10 focus:border-violet-500 text-white px-3 py-3 rounded-xl outline-none transition-colors text-sm flex-shrink-0"
              >
                {COUNTRY_CODES.map(c => (
                  <option key={c.code} value={c.code} className="bg-slate-900">
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                placeholder="Phone number"
                className="flex-1 bg-white/5 border border-white/10 focus:border-violet-500 text-white px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-slate-600 text-sm"
              />
            </div>
          </div>

          {/* Visa Status */}
          <div>
            <label className="block text-slate-300 text-sm mb-1.5">
              Visa Status <span className="text-red-400">*</span>
            </label>
            <select
              value={visaStatus}
              onChange={e => setVisaStatus(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 focus:border-violet-500 text-white px-4 py-3 rounded-xl outline-none transition-colors text-sm"
            >
              <option value="" className="bg-slate-900">
                Select visa status…
              </option>
              {VISA_OPTIONS.map(v => (
                <option key={v.value} value={v.value} className="bg-slate-900">
                  {v.label}
                </option>
              ))}
            </select>
            {visaStatus === 'other' && (
              <input
                type="text"
                value={visaOther}
                onChange={e => setVisaOther(e.target.value)}
                required
                placeholder="Please specify your visa status"
                className="mt-2 w-full bg-white/5 border border-white/10 focus:border-violet-500 text-white px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-slate-600 text-sm"
              />
            )}
          </div>

          {/* Success fee acknowledgment — Tier 2 and Tier 3 only */}
          {requiresFeeAck && (
            <div className="bg-amber-500/5 border border-amber-500/25 rounded-xl p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={feeAcknowledged}
                  onChange={e => setFeeAcknowledged(e.target.checked)}
                  className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer accent-violet-500"
                />
                <span className="text-slate-300 text-sm leading-relaxed">
                  I understand that Tier 2 and Tier 3 include a one-time 8% success fee on
                  accepted offers sourced through the applications pipeline. Tier 1 has no
                  success fee.
                </span>
              </label>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || (requiresFeeAck && !feeAcknowledged)}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 disabled:opacity-50 text-white py-3.5 rounded-xl font-semibold transition-opacity text-sm"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting…
              </span>
            ) : (
              'Claim My Spot →'
            )}
          </button>

          <p className="text-center text-slate-500 text-xs">
            🔒 No payment required today. We&apos;ll contact you within 12–24 hours to schedule
            your free 15-minute consultation.
          </p>
        </form>
      </div>
    </div>
  )
}

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
        </div>
      }
    >
      <JoinForm />
    </Suspense>
  )
}
