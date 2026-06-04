'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleSubmit = async () => {
    if (!email.trim()) { setError('Please enter your email address'); return }
    setLoading(true); setError('')
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: 'https://legendary-happiness-5vqrww7979r727996-3000.app.github.dev/reset-password',
      })
      if (error) { setError(error.message); setLoading(false); return }
      setSent(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      background: 'radial-gradient(ellipse at top right, #0F5A35 0%, #094A2A 50%, #063B22 100%)'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/operon-logo-white.png" alt="Operon" className="w-16 h-16 object-contain mx-auto mb-4 drop-shadow-2xl" />
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-200/80 mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>⏤ Operon Middle East ⏤</div>
          <h1 className="text-2xl font-bold text-white">Reset your password</h1>
          <p className="text-sm text-emerald-200/70 mt-1">Enter your email and we'll send you a reset link</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-emerald-300">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Check your email</h2>
              <p className="text-sm text-emerald-200/80 mb-6">We sent a password reset link to <span className="font-medium text-white">{email}</span>. Click the link in the email to set a new password.</p>
              <p className="text-xs text-emerald-300/60 mb-6">Didn't receive it? Check your spam folder or try again.</p>
              <button type="button" onClick={() => { setSent(false); setEmail('') }}
                className="text-sm text-emerald-300 hover:text-white transition underline underline-offset-2">
                Try a different email
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-2">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="your@email.com"
                  disabled={loading}
                  autoFocus
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition text-sm"
                />
              </div>

              {error && (
                <div className="bg-rose-500/20 border border-rose-400/30 text-rose-200 text-sm p-3 rounded-lg">{error}</div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !email.trim()}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-sm"
              >
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</> : 'Send Reset Link'}
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/login" className="text-sm text-emerald-300/80 hover:text-white transition">
            ← Back to login
          </Link>
        </div>
      </div>
    </main>
  )
}
