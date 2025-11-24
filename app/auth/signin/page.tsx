'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) throw error

        setMessage('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        router.push('/')
        router.refresh()
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      setMessage('Check your email for the magic link!')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-earth-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="flex justify-center">
            <div className="w-12 h-12 bg-earth-teal rounded-earth" />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold text-earth-brown">
            {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-earth-brown/70">
            {mode === 'signin' ? (
              <>
                Or{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="font-medium text-earth-teal hover:text-earth-teal/80"
                >
                  create a new account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="font-medium text-earth-teal hover:text-earth-teal/80"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        <div className="bg-white rounded-earth-lg shadow-sm border border-earth-sand/30 p-8">
          {error && (
            <div className="mb-4 p-4 bg-earth-rust/10 border border-earth-rust/30 rounded-earth">
              <p className="text-sm text-earth-rust">{error}</p>
            </div>
          )}

          {message && (
            <div className="mb-4 p-4 bg-earth-sage/10 border border-earth-sage/30 rounded-earth">
              <p className="text-sm text-earth-sage">{message}</p>
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-earth-brown mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-earth-sand rounded-earth focus:outline-none focus:ring-2 focus:ring-earth-teal"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-earth-brown mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-earth-sand rounded-earth focus:outline-none focus:ring-2 focus:ring-earth-teal"
                placeholder="••••••••"
                minLength={6}
              />
              {mode === 'signup' && (
                <p className="mt-1 text-xs text-earth-brown/60">
                  Must be at least 6 characters
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-earth-teal text-white rounded-earth font-medium hover:bg-earth-teal/90 focus:outline-none focus:ring-2 focus:ring-earth-teal focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Loading...' : mode === 'signin' ? 'Sign in' : 'Sign up'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-earth-sand/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-earth-brown/60">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              onClick={handleMagicLink}
              disabled={loading || !email}
              className="mt-4 w-full py-3 px-4 bg-white border-2 border-earth-sand text-earth-brown rounded-earth font-medium hover:bg-earth-sand/10 focus:outline-none focus:ring-2 focus:ring-earth-teal focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending...' : 'Send magic link'}
            </button>
            <p className="mt-2 text-xs text-center text-earth-brown/60">
              Enter your email above to receive a magic link
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-earth-brown/60">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
