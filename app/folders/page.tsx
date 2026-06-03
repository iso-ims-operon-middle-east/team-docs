'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const FolderIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)
const PlusIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const ArrowRightIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
)
const ArrowLeftIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
)
const HomeIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const PencilIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)
const TrashIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </svg>
)
const XIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

type Folder = {
  id: string; name: string; slug: string; description: string | null; created_at: string
}

export default function FoldersPage() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingFolder, setDeletingFolder] = useState<Folder | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [renamingFolder, setRenamingFolder] = useState<Folder | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [renaming, setRenaming] = useState(false)
  const [actionError, setActionError] = useState('')
  const loadingCanvasRef = useRef<HTMLCanvasElement>(null)

  const fetchFolders = async () => {
    try {
      const response = await fetch('/api/folders')
      const data = await response.json()
      if (data.folders) setFolders(data.folders)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchFolders() }, [])

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
      const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 20000))
      particles = []
      for (let i = 0; i < count; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, radius: Math.random() * 1.5 + 0.5 })
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(167, 243, 208, 0.6)'; ctx.fill()
      })
      const maxDistance = 140
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < maxDistance) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(110, 231, 183, ${(1 - distance / maxDistance) * 0.3})`; ctx.lineWidth = 0.6; ctx.stroke()
          }
        }
      }
      animationId = requestAnimationFrame(animate)
    }
    resizeCanvas(); initParticles(); animate()
    const onResize = () => { resizeCanvas(); initParticles() }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', onResize) }
  }, [loading])

  const handleDelete = async () => {
    if (!deletingFolder) return
    setDeleting(true); setActionError('')
    try {
      const response = await fetch(`/api/folders/${deletingFolder.id}/manage`, { method: 'DELETE' })
      const data = await response.json()
      if (!response.ok) { setActionError(data.error || 'Failed to delete'); setDeleting(false); return }
      setDeletingFolder(null)
      await fetchFolders()
    } catch { setActionError('Something went wrong') }
    finally { setDeleting(false) }
  }

  const handleRename = async () => {
    if (!renamingFolder || !renameValue.trim()) return
    setRenaming(true); setActionError('')
    try {
      const response = await fetch(`/api/folders/${renamingFolder.id}/manage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: renameValue.trim() }),
      })
      const data = await response.json()
      if (!response.ok) { setActionError(data.error || 'Failed to rename'); setRenaming(false); return }
      setRenamingFolder(null); setRenameValue('')
      await fetchFolders()
    } catch { setActionError('Something went wrong') }
    finally { setRenaming(false) }
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
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Quality Assurance</h1>
          </div>
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 via-emerald-200 to-emerald-400 rounded-full" style={{ backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite' }} />
          </div>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <span>Loading folders</span>
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
  }

  return (
    <div className="min-h-screen bg-emerald-50/40" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-6xl mx-auto p-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-900 font-medium mb-6 group transition-all">
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
          <HomeIcon className="w-4 h-4 ml-0.5" />
        </Link>

        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-xs font-mono text-emerald-700/70 mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>FOLDERS</div>
            <h1 className="text-4xl font-bold text-emerald-950 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" ry="1" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              Quality Assurance
            </h1>
            <p className="text-sm text-emerald-700/70 mt-2">Manage your Quality Assurance documents and folders</p>
          </div>
          <Link href="/folders/new" className="flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-md transition-all hover:shadow-lg">
            <PlusIcon className="w-5 h-5" />
            Create Folder
          </Link>
        </div>

        {folders.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-dashed border-emerald-200 p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <FolderIcon className="w-8 h-8" />
            </div>
            <div className="text-lg font-bold text-emerald-950 mb-2">No folders yet</div>
            <div className="text-sm text-emerald-700/60 mb-6">Create your first folder to organize and share documents</div>
            <Link href="/folders/new" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-md transition-all">
              <PlusIcon className="w-4 h-4" />
              Create Your First Folder
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {folders.map((folder) => (
              <div key={folder.id} className="relative bg-white rounded-2xl border border-emerald-100 p-8 transition-all hover:border-emerald-300 hover:shadow-lg group">
                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={(e) => { e.preventDefault(); setRenamingFolder(folder); setRenameValue(folder.name); setActionError('') }}
                    className="p-1.5 rounded-md bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 transition shadow-sm" title="Rename">
                    <PencilIcon className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={(e) => { e.preventDefault(); setDeletingFolder(folder); setActionError('') }}
                    className="p-1.5 rounded-md bg-white border border-emerald-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition shadow-sm" title="Delete">
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
                <Link href={`/folders/${folder.slug}`} className="block">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <FolderIcon className="w-7 h-7" />
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-emerald-300 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all mr-12" />
                  </div>
                  <h2 className="text-xl font-bold text-emerald-950 mb-2">{folder.name}</h2>
                  {folder.description && <p className="text-sm text-emerald-700/70 mb-4 line-clamp-2">{folder.description}</p>}
                  <div className="pt-4 border-t border-emerald-50 flex items-center gap-2 text-xs text-emerald-700/60">
                    <span>📅</span>
                    <span>{new Date(folder.created_at).toLocaleDateString()}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deletingFolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-emerald-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0"><TrashIcon className="w-5 h-5" /></div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-emerald-950 mb-1">Delete folder?</h3>
                <p className="text-sm text-emerald-700/80">This will permanently delete <span className="font-medium text-emerald-950">{deletingFolder.name}</span> and all its files.</p>
              </div>
            </div>
            {actionError && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3 mb-4">{actionError}</div>}
            <div className="flex gap-2 justify-end mt-4">
              <button type="button" onClick={() => setDeletingFolder(null)} disabled={deleting} className="px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 rounded-lg transition disabled:opacity-50">Cancel</button>
              <button type="button" onClick={handleDelete} disabled={deleting} className="px-4 py-2 text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                {deleting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Deleting…</> : <><TrashIcon className="w-4 h-4" />Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {renamingFolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-emerald-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-emerald-950">Rename folder</h3>
                <p className="text-sm text-emerald-700/70 mt-0.5">New name for <span className="font-medium text-emerald-950">{renamingFolder.name}</span></p>
              </div>
              <button type="button" onClick={() => { setRenamingFolder(null); setRenameValue('') }} className="p-1.5 rounded-md text-emerald-700 hover:bg-emerald-50 transition">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <input type="text" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              disabled={renaming} autoFocus
              className="w-full px-3 py-2.5 border border-emerald-200 rounded-lg text-sm text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition mb-4" />
            {actionError && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3 mb-4">{actionError}</div>}
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => { setRenamingFolder(null); setRenameValue('') }} disabled={renaming} className="px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 rounded-lg transition disabled:opacity-50">Cancel</button>
              <button type="button" onClick={handleRename} disabled={renaming || !renameValue.trim()} className="px-4 py-2 text-sm font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                {renaming ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Renaming…</> : <><PencilIcon className="w-4 h-4" />Rename</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
