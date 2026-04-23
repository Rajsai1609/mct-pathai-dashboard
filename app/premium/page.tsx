import Link from 'next/link'
import { Check } from 'lucide-react'

type TierKey = 'tier_1_master_resume' | 'tier_2_application_engine' | 'tier_3_complete_package'

interface Tier {
  id: TierKey
  name: string
  price: string
  billing: string
  tagline: string
  features: string[]
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
    popular: false,
  },
  {
    id: 'tier_2_application_engine',
    name: 'Application Engine',
    price: '$299',
    billing: 'per month',
    tagline: 'We manually apply to 50 hand-picked jobs for you every month',
    features: [
      '50 hand-picked, tailored applications per month',
      'Manual applying (same approach our 50 beta users used)',
      'Custom profile creation and matching',
      'H1B-verified company targeting',
      'Cancel anytime',
    ],
    popular: false,
  },
  {
    id: 'tier_3_complete_package',
    name: 'Complete Career Package',
    price: '$399 + $249/mo',
    billing: 'Bundle — save $100 upfront + $50/mo ongoing',
    tagline: 'Everything in Master Resume + Application Engine, bundled',
    features: [
      'Everything in Master Resume (regularly $499 → $399)',
      'Everything in Application Engine (regularly $299/mo → $249/mo)',
      'Priority support',
      'Dedicated account manager',
      'First month total: $648 (vs $798 separately)',
    ],
    popular: true,
  },
]

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <nav className="border-b border-white/5 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-white font-bold text-lg">
            MCT{' '}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              PathAI
            </span>
          </span>
          <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pick Your Path Forward
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Three ways to accelerate your job search. No payment today — our team will reach out
            within 12–24 hours to discuss your fit.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={[
                'relative rounded-2xl p-8 flex flex-col',
                tier.popular
                  ? 'bg-white/5 border-2 border-violet-500/70 shadow-2xl shadow-violet-500/20'
                  : 'bg-white/[0.03] border border-white/10',
              ].join(' ')}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 right-6">
                  <span className="bg-gradient-to-r from-violet-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <p
                className={[
                  'text-xs font-semibold tracking-widest uppercase mb-4',
                  tier.popular ? 'text-violet-400' : 'text-slate-500',
                ].join(' ')}
              >
                {tier.name}
              </p>

              <div className="mb-1">
                <span className="text-4xl font-black text-white">{tier.price}</span>
              </div>
              <p className="text-slate-500 text-xs mb-3">{tier.billing}</p>

              <p className="text-slate-300 text-sm leading-relaxed mb-8">{tier.tagline}</p>

              <ul className="space-y-2.5 mb-10 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/premium/join?tier=${tier.id}`}
                className={[
                  'block w-full py-3 rounded-xl font-semibold text-sm text-center transition-all',
                  tier.popular
                    ? 'bg-gradient-to-r from-violet-500 to-blue-500 text-white hover:opacity-90'
                    : 'border border-white/20 text-slate-200 hover:border-white/40 hover:text-white',
                ].join(' ')}
              >
                Claim Your Spot →
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-start justify-center gap-2 text-slate-500 text-sm text-center">
          <span className="mt-0.5">🔒</span>
          <span>
            Spots are limited. Our team contacts you within 12–24 hours for a free 15-minute
            consultation before any payment.
          </span>
        </div>
      </div>
    </div>
  )
}
