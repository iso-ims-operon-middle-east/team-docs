'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleChange = async () => {
    setError('')
    if (!newPassword.trim()) { setError('Please enter a new password'); return }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) { setError(error.message); setLoading(false); return }
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const strength = newPassword.length === 0 ? 0 : newPassword.length < 6 ? 1 : newPassword.length < 10 ? 2 : newPassword.length < 14 ? 3 : 4
  const strengthLabel = ['', 'Too short', 'Weak', 'Good', 'Strong'][strength]
  const strengthColor = ['', 'bg-rose-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-500'][strength]

  return (
    <div className="min-h-screen bg-emerald-50/40 flex items-center justify-center px-4" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div className="w-full max-w-md">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-900 mb-8 transition">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-emerald-950">Change Password</h1>
              <p className="text-sm text-emerald-700/70">Update your account password</p>
            </div>
          </div>

          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-emerald-600">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-emerald-950 mb-2">Password updated!</h2>
              <p className="text-sm text-emerald-700/70">Redirecting you to the dashboard…</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    disabled={loading}
                    autoFocus
                    className="w-full px-3 py-2.5 pr-10 border border-emerald-200 rounded-lg text-sm text-emerald-950 placeholder:text-emerald-700/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-700 transition" tabIndex={-1}>
                    {showNew
                      ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                      : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    }
                  </button>
                </div>
                {newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${strength >= i ? strengthColor : 'bg-emerald-100'}`} />
                      ))}
                    </div>
                    <div className="text-xs text-emerald-700/60">{strengthLabel}</div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleChange()}
                    placeholder="Re-enter new password"
                    disabled={loading}
                    className="w-full px-3 py-2.5 pr-10 border border-emerald-200 rounded-lg text-sm text-emerald-950 placeholder:text-emerald-700/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-700 transition" tabIndex={-1}>
                    {showConfirm
                      ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                      : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    }
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-rose-600 mt-1">Passwords do not match</p>
                )}
                {confirmPassword && newPassword === confirmPassword && newPassword.length >= 6 && (
                  <p className="text-xs text-emerald-600 mt-1">✓ Passwords match</p>
                )}
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm p-3 rounded-lg">{error}</div>
              )}

              <button
                type="button"
                onClick={handleChange}
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating…</> : 'Update Password'}
              </button>

              <button type="button" onClick={() => router.back()} className="w-full py-2 text-sm text-emerald-700 hover:text-emerald-900 transition">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}