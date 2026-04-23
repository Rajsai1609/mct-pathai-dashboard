'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Check, Clock, FileText, Rocket, Crown, X } from 'lucide-react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

type TierKey = 'master_resume' | 'applications_engine' | 'combo'

interface TierConfig {
  services: string[]
  amount: number
  discount: number
  name: string
}

interface FormData {
  phone: string
  visa_status: string
  target_role: string
  target_companies: string
  years_experience: string
  linkedin_url: string
  github_username: string
  urgency_level: string
  notes: string
}

const tierConfig: Record<TierKey, TierConfig> = {
  master_resume: {
    services: ['master_resume'],
    amount: 499,
    discount: 0,
    name: 'Master Resume Build',
  },
  applications_engine: {
    services: ['applications_engine'],
    amount: 299,
    discount: 0,
    name: 'Applications Engine',
  },
  combo: {
    services: ['master_resume', 'applications_engine'],
    amount: 699,
    discount: 100,
    name: 'Complete Package',
  },
}

export default function PricingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTier, setSelectedTier] = useState<TierKey | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    phone: '',
    visa_status: '',
    target_role: '',
    target_companies: '',
    years_experience: '',
    linkedin_url: '',
    github_username: '',
    urgency_level: 'normal',
    notes: '',
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      router.push('/signup')
    } else {
      setUser(authUser)
      setLoading(false)
    }
  }

  const handleSelect = (tier: TierKey) => {
    setSelectedTier(tier)
    setShowForm(true)
  }

  const submitReservation = async () => {
    if (!formData.phone || !formData.target_role || !formData.visa_status) {
      alert('Please fill required fields')
      return
    }
    if (!selectedTier || !user) return

    setSubmitting(true)
    const config = tierConfig[selectedTier]

    try {
      const { error } = await supabase.from('service_reservations').insert({
        user_id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name ?? user.email,
        phone: formData.phone,
        visa_status: formData.visa_status,
        target_role: formData.target_role,
        target_companies: formData.target_companies,
        selected_tier: selectedTier,
        selected_services: config.services,
        years_experience: formData.years_experience,
        linkedin_url: formData.linkedin_url,
        github_username: formData.github_username,
        urgency_level: formData.urgency_level,
        notes: formData.notes,
        payment_amount: config.amount,
        discount_applied: config.discount,
      })

      if (error) throw error
      setSuccess(true)
    } catch (err: unknown) {
      console.error(err)
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }

    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  if (success && selectedTier) {
    const config = tierConfig[selectedTier]
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md text-center bg-gray-900 border border-green-500/30 rounded-2xl p-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">Reservation Confirmed! 🎉</h1>

          <p className="text-gray-300 mb-6">
            {config.name} for{' '}
            <strong className="text-white">${config.amount.toLocaleString()}</strong>
            {selectedTier === 'applications_engine' && '/month'}
            {selectedTier === 'combo' && ' + $299/month after'}
          </p>

          <div className="bg-gray-800/50 p-4 rounded-lg text-left text-sm text-gray-300 mb-6 space-y-2">
            <p className="font-semibold text-white mb-2">What happens next:</p>
            <p>✅ Rajsai contacts you within {formData.urgency_level === 'high' ? '2 hours' : '24 hours'}</p>
            <p>✅ 15-min demo call scheduled</p>
            <p>✅ Questions answered</p>
            <p>✅ Payment processed securely</p>
            <p>✅ Service begins immediately</p>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg mb-6 text-sm">
            <p className="text-purple-300 font-medium mb-2">Your contact info:</p>
            <p className="text-gray-400">📱 {formData.phone}</p>
            <p className="text-gray-400">📧 {user?.email}</p>
          </div>

          <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 pb-32">
      {/* Urgency Banner */}
      <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-b border-red-500/30 py-3 px-4">
        <div className="max-w-4xl mx-auto text-center flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-red-400 animate-pulse" />
          <p className="text-white text-sm font-semibold">
            🔴 Beta CLOSED | Founder pricing ends at 100 customers
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-purple-500/20 text-purple-300 px-4 py-1 rounded-full text-sm mb-4">
            ✨ Premium Services
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Path to
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Your Dream Job
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Three proven paths. Pick what fits your goals.
          </p>
        </div>

        {/* Three Tiers Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* TIER 1: MASTER RESUME */}
          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-2 border-purple-500/30 hover:border-purple-500/60 rounded-2xl p-8 transition-all">
            <div className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
              ONE-TIME PAYMENT
            </div>
            <FileText className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Master Resume Build</h3>
            <p className="text-gray-400 text-sm mb-6">One-time transformation</p>
            <div className="mb-6">
              <span className="text-5xl font-bold text-white">$499</span>
              <span className="text-gray-400 text-sm ml-2">one-time</span>
            </div>
            <p className="text-gray-300 text-sm mb-6">
              Your base resume → Recruiter-ready master resume with professional experience, rewritten bullets, and
              2-3 real GitHub projects.{' '}
              <strong className="text-white">Yours forever.</strong>
            </p>
            <ul className="space-y-2 text-sm mb-6">
              {[
                'Professional experience added',
                'Complete ATS-optimized rebuild',
                'Every bullet rewritten',
                '2-3 real GitHub projects built',
                'Pushed to your GitHub account',
                'Delivered in 5-7 days',
                '1 round of revisions',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSelect('master_resume')}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white py-3 rounded-xl font-semibold transition-opacity"
            >
              Reserve Resume Build →
            </button>
          </div>

          {/* TIER 2: APPLICATIONS ENGINE */}
          <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border-2 border-green-500/30 hover:border-green-500/60 rounded-2xl p-8 transition-all">
            <div className="inline-block bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
              MONTHLY SERVICE
            </div>
            <Rocket className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Applications Engine</h3>
            <p className="text-gray-400 text-sm mb-6">We apply. Daily. For you.</p>
            <div className="mb-6">
              <span className="text-5xl font-bold text-white">$299</span>
              <span className="text-gray-400 text-sm ml-2">/month</span>
            </div>
            <p className="text-gray-300 text-sm mb-6">
              50 tailored applications submitted daily by our human recruiter + AI across Greenhouse, Lever, Ashby,
              LinkedIn.
            </p>
            <ul className="space-y-2 text-sm mb-6">
              {[
                '5,000+ roles scanned daily',
                '10-dimension AI scoring',
                'Top 50 hand-picked daily',
                'Company-specific research',
                'Resume tailored per company',
                '50 applications submitted daily',
                'Weekly progress reports',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSelect('applications_engine')}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90 text-white py-3 rounded-xl font-semibold transition-opacity"
            >
              Reserve Apps Engine →
            </button>
          </div>

          {/* TIER 3: COMBO - HIGHLIGHTED */}
          <div className="relative bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 border-2 border-yellow-500 rounded-2xl p-8 shadow-2xl shadow-yellow-500/30 md:scale-105 transition-all">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
              🔥 BEST VALUE - SAVE $100
            </div>
            <Crown className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Complete Package</h3>
            <p className="text-gray-400 text-sm mb-6">Master Resume + Apps Engine</p>
            <div className="mb-6">
              <span className="text-5xl font-bold text-white">$699</span>
              <span className="text-gray-400 text-sm ml-2">first month</span>
              <p className="text-sm text-gray-500 line-through mt-1">Regular: $798</p>
              <div className="inline-block mt-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                💰 Save $100
              </div>
              <p className="text-xs text-gray-400 mt-2">Then $299/month (cancel anytime)</p>
            </div>
            <p className="text-gray-300 text-sm mb-6">
              Start with a bulletproof master resume. We apply to 50 tailored jobs daily. Most clients land
              interviews in 2-3 weeks.
            </p>
            <ul className="space-y-2 text-sm mb-6">
              {[
                { label: 'Everything in Master Resume', bold: true },
                { label: 'Everything in Apps Engine', bold: true },
                { label: '2-3 GitHub portfolio projects', bold: false },
                { label: '50 tailored apps sent daily', bold: false },
                { label: 'Priority support', bold: false },
                { label: 'Direct founder access', bold: false },
                { label: 'Cancel Apps Engine anytime', bold: false },
              ].map(({ label, bold }) => (
                <li key={label} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">
                    {bold ? <strong className="text-white">{label}</strong> : label}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSelect('combo')}
              className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:opacity-90 text-white py-3 rounded-xl font-semibold transition-opacity"
            >
              Reserve Combo (Save $100) →
            </button>
            <p className="text-xs text-center text-yellow-400 mt-3 animate-pulse">⚡ Most popular choice</p>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '44+', label: 'Beta Students' },
            { value: '24K+', label: 'H1B Verified' },
            { value: '5-7', label: 'Days Turnaround' },
            { value: '50', label: 'Apps/Day' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-gray-900/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reservation Form Modal */}
      {showForm && selectedTier && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="relative bg-gray-900 border border-purple-500/30 rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold text-white mb-2">Reserve Your Spot</h3>
            <p className="text-gray-400 text-sm mb-6">
              {tierConfig[selectedTier].name}:{' '}
              <span className="text-white font-bold">
                ${tierConfig[selectedTier].amount}
                {selectedTier === 'applications_engine' && '/mo'}
                {selectedTier === 'combo' && ' + $299/mo after'}
              </span>
            </p>

            <div className="space-y-3">
              <input
                type="tel"
                placeholder="Phone (WhatsApp/Call)*"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg outline-none focus:border-purple-500"
              />

              <select
                value={formData.visa_status}
                onChange={e => setFormData({ ...formData, visa_status: e.target.value })}
                required
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg outline-none"
              >
                <option value="">Visa Status*</option>
                <option value="OPT">OPT</option>
                <option value="STEM OPT">STEM OPT</option>
                <option value="H1B">H1B</option>
                <option value="F1">F1</option>
                <option value="Green Card">Green Card</option>
                <option value="Citizen">Citizen</option>
              </select>

              <input
                type="text"
                placeholder="Target Role*"
                value={formData.target_role}
                onChange={e => setFormData({ ...formData, target_role: e.target.value })}
                required
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg outline-none"
              />

              <input
                type="text"
                placeholder="Target Companies (optional)"
                value={formData.target_companies}
                onChange={e => setFormData({ ...formData, target_companies: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg outline-none"
              />

              <select
                value={formData.years_experience}
                onChange={e => setFormData({ ...formData, years_experience: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg outline-none"
              >
                <option value="">Years of Experience</option>
                <option value="0">New Grad</option>
                <option value="1-2">1-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>

              <input
                type="url"
                placeholder="LinkedIn URL"
                value={formData.linkedin_url}
                onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg outline-none"
              />

              <input
                type="text"
                placeholder="GitHub Username (optional)"
                value={formData.github_username}
                onChange={e => setFormData({ ...formData, github_username: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg outline-none"
              />

              <select
                value={formData.urgency_level}
                onChange={e => setFormData({ ...formData, urgency_level: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg outline-none"
              >
                <option value="high">🔴 URGENT - Start immediately</option>
                <option value="normal">🟡 Normal - Within 1-2 months</option>
                <option value="flexible">🟢 Flexible - Just exploring</option>
              </select>

              <textarea
                placeholder="Any specific questions?"
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg outline-none resize-none"
              />

              <button
                onClick={submitReservation}
                disabled={submitting || !formData.phone || !formData.visa_status || !formData.target_role}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 disabled:opacity-50 text-white py-4 rounded-xl font-semibold"
              >
                {submitting ? 'Reserving...' : '✅ Confirm Reservation'}
              </button>

              <p className="text-xs text-center text-gray-500">
                🔒 No payment now. Rajsai contacts you within 24 hours to finalize.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
