'use client'

export const dynamic = 'force-dynamic'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Sparkles, Mail, Lock, User } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [isLogin, setIsLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError

        // Smart routing: if tier already selected, go home; otherwise select a plan
        const { data: userRow } = await supabase
          .from('paid_users')
          .select('selected_tier')
          .eq('email', email)
          .maybeSingle()

        router.push(userRow?.selected_tier ? '/' : '/select-plan')
        router.refresh()
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/select-plan`,
          },
        })
        if (signUpError) throw signUpError

        if (data.user) {
          await supabase.from('paid_users').insert({ email, full_name: fullName }).select()
        }

        router.push('/select-plan')
        router.refresh()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link href="/" className="text-slate-400 hover:text-white text-sm mb-6 inline-block transition-colors">
          ← Back to Home
        </Link>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Logo / wordmark */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mb-4">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <p className="text-violet-400 text-xs font-semibold tracking-widest uppercase mb-2">
              MCT PathAI
            </p>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Get Started with MCT PathAI'}
            </h1>
            <p className="text-slate-400 text-sm">
              {isLogin
                ? 'Sign in to access your premium services'
                : 'Create your account to view premium service options'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 focus:border-violet-500 text-white pl-10 pr-4 py-3 rounded-xl outline-none transition-colors placeholder:text-slate-600 text-sm"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-violet-500 text-white pl-10 pr-4 py-3 rounded-xl outline-none transition-colors placeholder:text-slate-600 text-sm"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                placeholder="Password (min 8 characters)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-white/5 border border-white/10 focus:border-violet-500 text-white pl-10 pr-4 py-3 rounded-xl outline-none transition-colors placeholder:text-slate-600 text-sm"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-opacity text-sm"
            >
              {loading ? 'Processing…' : isLogin ? 'Sign In →' : 'Continue →'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
            >
              {isLogin ? 'Sign up →' : 'Sign in →'}
            </button>
          </div>

          <p className="mt-6 text-xs text-center text-slate-600">
            🔒 No payment required. Our team will contact you within 24 hours.
          </p>

          <p className="mt-3 text-xs text-center text-slate-700">
            By continuing you agree to our{' '}
            <a href="#" className="underline hover:text-slate-500 transition-colors">Terms & Conditions</a>
            {' '}and{' '}
            <a href="#" className="underline hover:text-slate-500 transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}
