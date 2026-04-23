'use client'

export const dynamic = 'force-dynamic'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Sparkles, Mail, Lock, User, AlertCircle } from 'lucide-react'
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
        router.push('/pricing')
        router.refresh()
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/pricing`,
          },
        })
        if (signUpError) throw signUpError

        if (data.user) {
          await supabase.from('paid_users').insert({ email, full_name: fullName }).select()
        }

        router.push('/pricing')
        router.refresh()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link href="/" className="text-gray-400 hover:text-white text-sm mb-6 inline-block">
          ← Back to Home
        </Link>

        <div className="bg-gray-900/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back!' : 'Unlock Premium Services'}
            </h1>
            <p className="text-gray-400">
              {isLogin ? 'Sign in to continue' : 'Beta is FULL. Create account to see pricing.'}
            </p>
          </div>

          {!isLogin && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 p-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">
                🔴 Beta CLOSED at 50 users. Sign up to access paid plans starting at $299/month.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white pl-10 pr-4 py-3 rounded-lg outline-none"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white pl-10 pr-4 py-3 rounded-lg outline-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                placeholder="Password (min 8 chars)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white pl-10 pr-4 py-3 rounded-lg outline-none"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-opacity"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In →' : 'Create Account & See Pricing →'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            {isLogin ? "New to MCT PathAI?" : "Already have an account?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>

          <p className="mt-6 text-xs text-center text-gray-500">
            🔒 No payment required now. Rajsai will contact you personally.
          </p>
        </div>
      </div>
    </div>
  )
}
