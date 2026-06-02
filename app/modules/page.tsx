'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

const ICONS: Record<string, React.ReactNode> = {
  folder: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>,
  shield: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  users: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  chart: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
  file: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
  alert: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  settings: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
}

type Module = {
  id: string
  name: string
  slug: string
  icon: string
  type: string
  description: string | null
  created_by: string
  created_at: string
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  const [deletingModule, setDeletingModule] = useState<Module | null>(null)
  const [shareModule, setShareModule] = useState<Module | null>(null)
  const [shareEmail, setShareEmail] = useState('')
  const [shareCanEdit, setShareCanEdit] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', slug: '', icon: 'folder', type: 'files', description: '' })
  const loadingCanvasRef = useRef<HTMLCanvasElement>(null)

  const generateSlug = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/(^-|-$)/g, '')

  const fetchModules = async () => {
    try {
      const res = await fetch('/api/modules')
      const data = await res.json()
      if (data.modules) setModules(data.modules)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  useEffect(() => { fetchModules() }, [])

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
      const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 20000))
      for (let i = 0; i < count; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, radius: Math.random() * 1.5 + 0.5 })
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(167, 243, 208, 0.6)'; ctx.fill()
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

  const handleCreate = async () => {
    if (!form.name.trim() || !form.slug.trim()) { setError('Name and slug are required'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to create'); setSaving(false); return }
      setShowCreate(false); setForm({ name: '', slug: '', icon: 'folder', type: 'files', description: '' }); await fetchModules()
    } catch { setError('Something went wrong') } finally { setSaving(false) }
  }

  const handleEdit = async () => {
    if (!editingModule || !form.name.trim()) { setError('Name is required'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch(`/api/modules/${editingModule.id}/manage`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, icon: form.icon, description: form.description }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to update'); setSaving(false); return }
      setEditingModule(null); await fetchModules()
    } catch { setError('Something went wrong') } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deletingModule) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/modules/${deletingModule.id}/manage`, { method: 'DELETE' })
      if (!res.ok) { setError('Failed to delete'); setDeleting(false); return }
      setDeletingModule(null); await fetchModules()
    } catch { setError('Something went wrong') } finally { setDeleting(false) }
  }

  const handleShare = async () => {
    if (!shareModule || !shareEmail.trim()) return
    setSharing(true); setError('')
    try {
      const res = await fetch(`/api/modules/${shareModule.id}/manage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: shareEmail.trim(), can_edit: shareCanEdit }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to share'); setSharing(false); return }
      setShareModule(null); setShareEmail(''); setShareCanEdit(false)
    } catch { setError('Something went wrong') } finally { setSharing(false) }
  }

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: 'radial-gradient(ellipse at top right, #0F5A35 0%, #094A2A 50%, #063B22 100%)' }}>
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
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Modules</h1>
        </div>
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 via-emerald-200 to-emerald-400 rounded-full" style={{ backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite' }} />
        </div>
        <div className="flex items-center gap-2 text-sm text-white/80">
          <span>Loading modules</span>
          <span className="flex gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-300 animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="w-1 h-1 rounded-full bg-emerald-300 animate-bounce" style={{ animationDelay: '0.15s' }} />
            <span className="w-1 h-1 rounded-full bg-emerald-300 animate-bounce" style={{ animationDelay: '0.3s' }} />
          </span>
        </div>
      </div>
      <style jsx>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </main>
  )

  return (
    <div className="min-h-screen bg-emerald-50/40" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-6xl mx-auto p-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-900 font-medium mb-6 group transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:-translate-x-1 transition-transform"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          Back to Home
        </Link>

        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-xs font-mono text-emerald-700/70 mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>MODULES</div>
            <h1 className="text-4xl font-bold text-emerald-950">⚙️ Manage Modules</h1>
            <p className="text-sm text-emerald-700/70 mt-2">Create and manage sidebar modules with custom access control</p>
          </div>
          <button type="button" onClick={() => { setShowCreate(true); setError('') }} className="flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-md transition-all hover:shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New Module
          </button>
        </div>

        {modules.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-dashed border-emerald-200 p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
            </div>
            <div className="text-lg font-bold text-emerald-950 mb-2">No modules yet</div>
            <div className="text-sm text-emerald-700/60 mb-6">Create your first module to add it to the sidebar</div>
            <button type="button" onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-md transition-all">
              Create First Module
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod) => (
              <div key={mod.id} className="relative bg-white rounded-2xl border border-emerald-100 p-6 transition-all hover:border-emerald-300 hover:shadow-lg group">
                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={() => { setShareModule(mod); setError('') }} className="p-1.5 rounded-md bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition shadow-sm" title="Share">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                  </button>
                  <button type="button" onClick={() => { setEditingModule(mod); setForm({ name: mod.name, slug: mod.slug, icon: mod.icon, type: mod.type, description: mod.description || '' }); setError('') }} className="p-1.5 rounded-md bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition shadow-sm" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  </button>
                  <button type="button" onClick={() => { setDeletingModule(mod); setError('') }} className="p-1.5 rounded-md bg-white border border-emerald-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition shadow-sm" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>
                  </button>
                </div>
                <Link href={`/modules/${mod.slug}`} className="block">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                    {ICONS[mod.icon] || ICONS.folder}
                  </div>
                  <h2 className="text-xl font-bold text-emerald-950 mb-1">{mod.name}</h2>
                  {mod.description && <p className="text-sm text-emerald-700/70 mb-3 line-clamp-2">{mod.description}</p>}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-emerald-50">
                    <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">{mod.type}</span>
                    <span className="text-xs text-emerald-700/50">{new Date(mod.created_at).toLocaleDateString()}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-emerald-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-5">
              <div><h3 className="text-lg font-bold text-emerald-950">Create New Module</h3><p className="text-sm text-emerald-700/70">Add a new section to the sidebar</p></div>
              <button type="button" onClick={() => { setShowCreate(false); setError('') }} className="p-1.5 rounded-md text-emerald-700 hover:bg-emerald-50 transition">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">Module Name <span className="text-rose-600">*</span></label>
                <input type="text" value={form.name} onChange={(e) => { setForm(f => ({ ...f, name: e.target.value, slug: generateSlug(e.target.value) })) }} placeholder="e.g. HSE Department" className="w-full px-3 py-2.5 border border-emerald-200 rounded-lg text-sm text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">URL Slug <span className="text-rose-600">*</span></label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-emerald-700/70">/modules/</span>
                  <input type="text" value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="hse-department" className="flex-1 px-3 py-2.5 border border-emerald-200 rounded-lg text-sm text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">Icon</label>
                <div className="grid grid-cols-7 gap-2">
                  {Object.entries(ICONS).map(([key, icon]) => (
                    <button key={key} type="button" onClick={() => setForm(f => ({ ...f, icon: key }))} className={`p-2.5 rounded-lg border-2 flex items-center justify-center transition ${form.icon === key ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-emerald-100 text-emerald-400 hover:border-emerald-300'}`}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">Type</label>
                <select value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-3 py-2.5 border border-emerald-200 rounded-lg text-sm text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition">
                  <option value="files">Files — upload and manage documents</option>
                  <option value="content">Content — rich text and notes</option>
                  <option value="link">Link — redirect to external URL</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">Description <span className="font-normal text-emerald-700/60 normal-case">(optional)</span></label>
                <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description..." rows={3} className="w-full px-3 py-2.5 border border-emerald-200 rounded-lg text-sm text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition resize-none" />
              </div>
              {error && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}
            </div>
            <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-emerald-100">
              <button type="button" onClick={() => { setShowCreate(false); setError('') }} disabled={saving} className="px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 rounded-lg transition disabled:opacity-50">Cancel</button>
              <button type="button" onClick={handleCreate} disabled={saving || !form.name.trim()} className="px-4 py-2 text-sm font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating…</> : 'Create Module'}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-emerald-100">
            <div className="flex items-start justify-between mb-5">
              <div><h3 className="text-lg font-bold text-emerald-950">Edit Module</h3></div>
              <button type="button" onClick={() => { setEditingModule(null); setError('') }} className="p-1.5 rounded-md text-emerald-700 hover:bg-emerald-50 transition">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 border border-emerald-200 rounded-lg text-sm text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">Icon</label>
                <div className="grid grid-cols-7 gap-2">
                  {Object.entries(ICONS).map(([key, icon]) => (
                    <button key={key} type="button" onClick={() => setForm(f => ({ ...f, icon: key }))} className={`p-2.5 rounded-lg border-2 flex items-center justify-center transition ${form.icon === key ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-emerald-100 text-emerald-400 hover:border-emerald-300'}`}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2.5 border border-emerald-200 rounded-lg text-sm text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition resize-none" />
              </div>
              {error && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}
            </div>
            <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-emerald-100">
              <button type="button" onClick={() => { setEditingModule(null); setError('') }} disabled={saving} className="px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 rounded-lg transition disabled:opacity-50">Cancel</button>
              <button type="button" onClick={handleEdit} disabled={saving || !form.name.trim()} className="px-4 py-2 text-sm font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-emerald-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>
              </div>
              <div><h3 className="text-lg font-bold text-emerald-950 mb-1">Delete module?</h3><p className="text-sm text-emerald-700/80">This will permanently delete <span className="font-medium text-emerald-950">{deletingModule.name}</span>. This cannot be undone.</p></div>
            </div>
            {error && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3 mb-4">{error}</div>}
            <div className="flex gap-2 justify-end mt-4">
              <button type="button" onClick={() => setDeletingModule(null)} disabled={deleting} className="px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 rounded-lg transition disabled:opacity-50">Cancel</button>
              <button type="button" onClick={handleDelete} disabled={deleting} className="px-4 py-2 text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                {deleting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Deleting…</> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {shareModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-emerald-100">
            <div className="flex items-start justify-between mb-5">
              <div><h3 className="text-lg font-bold text-emerald-950">Share Module</h3><p className="text-sm text-emerald-700/70">Grant access to <span className="font-medium text-emerald-950">{shareModule.name}</span></p></div>
              <button type="button" onClick={() => { setShareModule(null); setShareEmail(''); setError('') }} className="p-1.5 rounded-md text-emerald-700 hover:bg-emerald-50 transition">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">User Email</label>
                <input type="email" value={shareEmail} onChange={(e) => setShareEmail(e.target.value)} placeholder="user@example.com" className="w-full px-3 py-2.5 border border-emerald-200 rounded-lg text-sm text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={shareCanEdit} onChange={(e) => setShareCanEdit(e.target.checked)} className="w-4 h-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm text-emerald-800">Allow editing (upload/delete files)</span>
              </label>
              {error && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>}
            </div>
            <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-emerald-100">
              <button type="button" onClick={() => { setShareModule(null); setShareEmail(''); setError('') }} disabled={sharing} className="px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 rounded-lg transition disabled:opacity-50">Cancel</button>
              <button type="button" onClick={handleShare} disabled={sharing || !shareEmail.trim()} className="px-4 py-2 text-sm font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                {sharing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sharing…</> : 'Grant Access'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
