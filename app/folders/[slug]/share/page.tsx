'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const ArrowLeftIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
)
const XIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const LinkIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)
const UserIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)
const MailIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
)

type SharedUser = { id: string; user_id: string; email: string; access_level: string }
type Folder = { id: string; name: string; slug: string }

export default function SharePage() {
  const params = useParams()
  const slug = params?.slug as string

  const [folder, setFolder] = useState<Folder | null>(null)
  const [sharedWith, setSharedWith] = useState<SharedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [accessLevel, setAccessLevel] = useState<'view' | 'edit'>('view')
  const [sharing, setSharing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [revoking, setRevoking] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const loadingCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => { if (slug) fetchShareData() }, [slug])

  useEffect(() => {
    if (!loading) return
    const canvas = loadingCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let animationId: number
    let particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = []
    const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    const initParticles = () => {
      particles = []
      const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 20000))
      for (let i = 0; i < count; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, radius: Math.random() * 1.5 + 0.5 })
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(167,243,208,0.6)'; ctx.fill()
      })
      const maxD = 140
      for (let i = 0; i < particles.length; i++) for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < maxD) { ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.strokeStyle = `rgba(110,231,183,${(1 - d / maxD) * 0.3})`; ctx.lineWidth = 0.6; ctx.stroke() }
      }
      animationId = requestAnimationFrame(animate)
    }
    resizeCanvas(); initParticles(); animate()
    const onResize = () => { resizeCanvas(); initParticles() }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', onResize) }
  }, [loading])

  const fetchShareData = async () => {
    try {
      const res = await fetch(`/api/folders/${slug}/share`)
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to load'); return }
      setFolder(data.folder)
      setSharedWith(data.sharedWith || [])
    } catch (err) { setError('Failed to load share data') }
    finally { setLoading(false) }
  }

  const handleShare = async () => {
    if (!email.trim()) { setError('Email is required'); return }
    setSharing(true); setError(''); setSuccess('')
    try {
      const res = await fetch(`/api/folders/${slug}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), access_level: accessLevel }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to share'); setSharing(false); return }
      setSuccess(data.message + (data.invited ? ' — they will receive an email to set up their account.' : ''))
      setEmail('')
      await fetchShareData()
    } catch (err) { setError('Something went wrong') }
    finally { setSharing(false) }
  }

  const handleRevoke = async (accessId: string) => {
    if (!confirm("Remove this person's access?")) return
    setRevoking(accessId)
    try {
      const res = await fetch(`/api/folders/${slug}/share?access_id=${accessId}`, { method: 'DELETE' })
      if (!res.ok) { setError('Failed to revoke access'); return }
      await fetchShareData()
    } catch (err) { setError('Something went wrong') }
    finally { setRevoking(null) }
  }

  const handleUpdateAccess = async (accessId: string, newLevel: string) => {
    setUpdating(accessId)
    try {
      const res = await fetch(`/api/folders/${slug}/share`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_id: accessId, access_level: newLevel }),
      })
      if (!res.ok) { setError('Failed to update access'); return }
      await fetchShareData()
    } catch (err) { setError('Something went wrong') }
    finally { setUpdating(null) }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
        style={{ fontFamily: "'Inter', system-ui, sans-serif", background: 'radial-gradient(ellipse at top right, #0F5A35 0%, #094A2A 50%, #063B22 100%)' }}>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <canvas ref={loadingCanvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
        <div className="relative flex flex-col items-center gap-8" style={{ zIndex: 2 }}>
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-emerald-300/30 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-2 rounded-full border-2 border-emerald-300/40 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.4s' }} />
            <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-emerald-200 border-r-emerald-300 animate-spin" style={{ animationDuration: '1.5s' }} />
            <img src="/operon-logo-white.png" alt="Operon" className="w-16 h-16 object-contain relative drop-shadow-2xl" />
          </div>
          <div className="text-center">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-200/80 mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>⏤ Operon Middle East ⏤</div>
            <h1 className="text-2xl font-bold text-white">Share Folder</h1>
          </div>
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 via-emerald-200 to-emerald-400 rounded-full" style={{ backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite' }} />
          </div>
        </div>
        <style jsx>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-emerald-50/40" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-2xl mx-auto p-8">
        <Link href={`/folders/${slug}`} className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-900 font-medium mb-8 group transition-all">
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to {folder?.name || 'Folder'}
        </Link>

        <div className="mb-8">
          <div className="text-xs font-mono text-emerald-700/70 mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>SHARING</div>
          <h1 className="text-3xl font-bold text-emerald-950 mb-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <LinkIcon className="w-5 h-5" />
            </div>
            {folder?.name}
          </h1>
          <p className="text-sm text-emerald-700/70 mt-2">Invite people to view or upload files to this folder</p>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-100 p-6 mb-6">
          <h2 className="text-sm font-bold text-emerald-950 mb-4">Invite someone</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">Email address</label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleShare()}
                  placeholder="colleague@company.com" disabled={sharing}
                  className="w-full pl-9 pr-3 py-2.5 border border-emerald-200 rounded-lg text-sm text-emerald-950 placeholder:text-emerald-700/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition" />
              </div>
              <p className="text-xs text-emerald-700/60 mt-1">If they don't have an account, they'll receive an invitation email to sign up.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">Access level</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setAccessLevel('view')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${accessLevel === 'view' ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-100 hover:border-emerald-300'}`}>
                  <div className="text-sm font-bold text-emerald-950 mb-1">👁️ View only</div>
                  <div className="text-xs text-emerald-700/70">Can view and download files</div>
                </button>
                <button type="button" onClick={() => setAccessLevel('edit')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${accessLevel === 'edit' ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-100 hover:border-emerald-300'}`}>
                  <div className="text-sm font-bold text-emerald-950 mb-1">✏️ Can edit</div>
                  <div className="text-xs text-emerald-700/70">Can view, download and upload files</div>
                </button>
              </div>
            </div>
            {error && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}
            {success && <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">✅ {success}</div>}
            <button type="button" onClick={handleShare} disabled={sharing || !email.trim()}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {sharing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</> : 'Send Invitation'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-100 p-6">
          <h2 className="text-sm font-bold text-emerald-950 mb-4">
            People with access
            {sharedWith.length > 0 && <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">{sharedWith.length}</span>}
          </h2>
          {sharedWith.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3 text-emerald-400">
                <UserIcon className="w-6 h-6" />
              </div>
              <div className="text-sm text-emerald-700/60">No one else has access yet</div>
              <div className="text-xs text-emerald-700/40 mt-1">Use the form above to invite people</div>
            </div>
          ) : (
            <div className="space-y-3">
              {sharedWith.map((person) => (
                <div key={person.id} className="flex items-center gap-4 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-300 to-emerald-500 flex items-center justify-center text-emerald-950 font-bold text-sm shrink-0">
                    {person.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-emerald-950 truncate">{person.email}</div>
                  </div>
                  <select value={person.access_level} onChange={(e) => handleUpdateAccess(person.id, e.target.value)}
                    disabled={updating === person.id}
                    className="text-xs border border-emerald-200 rounded-lg px-2 py-1.5 text-emerald-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition disabled:opacity-50">
                    <option value="view">View only</option>
                    <option value="edit">Can edit</option>
                  </select>
                  <button type="button" onClick={() => handleRevoke(person.id)} disabled={revoking === person.id}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition disabled:opacity-50" title="Remove access">
                    {revoking === person.id
                      ? <div className="w-4 h-4 border-2 border-rose-300 border-t-rose-600 rounded-full animate-spin" />
                      : <XIcon className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
