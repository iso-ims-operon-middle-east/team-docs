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

type Folder = {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

export default function FoldersPage() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const loadingCanvasRef = useRef<HTMLCanvasElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch('/api/folders')
        const data = await response.json()
        if (data.folders) {
          setFolders(data.folders)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFolders()
  }, [])

  useEffect(() => {
    if (!loading) return
    const canvas = loadingCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    const initParticles = () => {
      const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 20000))
      particles = []
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 0.5,
        })
      }
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(167, 243, 208, 0.6)'
        ctx.fill()
      })
      const maxDistance = 140
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.3
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(110, 231, 183, ${opacity})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }
      animationId = requestAnimationFrame(animate)
    }
    resizeCanvas()
    initParticles()
    animate()
    const onResize = () => { resizeCanvas(); initParticles() }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', onResize)
    }
  }, [loading])

  if (loading) {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          background: 'radial-gradient(ellipse at top right, #0F5A35 0%, #094A2A 50%, #063B22 100%)',
        }}
      >
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <canvas ref={loadingCanvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
        <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
          <div className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full bg-emerald-300/8 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-emerald-900/30 blur-3xl" />
        </div>
        <div className="relative flex flex-col items-center gap-8" style={{ zIndex: 2 }}>
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-emerald-300/30 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-2 rounded-full border-2 border-emerald-300/40 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.4s' }} />
            <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-emerald-200 border-r-emerald-300 animate-spin" style={{ animationDuration: '1.5s' }} />
            <img src="/operon-logo-white.png" alt="Operon" className="w-16 h-16 object-contain relative drop-shadow-2xl" />
          </div>
          <div className="text-center">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-200/80 mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              ⏤ Operon Middle East ⏤
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Quality Assurance</h1>
          </div>
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-emerald-200 to-emerald-400 rounded-full"
              style={{ backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite' }}
            />
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
        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-emerald-50/40" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-6xl mx-auto p-8">

        {/* Back to Home */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-900 font-medium mb-6 group transition-all"
        >
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
          <HomeIcon className="w-4 h-4 ml-0.5" />
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-xs font-mono text-emerald-700/70 mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              FOLDERS
            </div>
            <h1 className="text-4xl font-bold text-emerald-950">📁 Document Folders</h1>
            <p className="text-sm text-emerald-700/70 mt-2">Create and manage your private document folders</p>
          </div>
          <Link
            href="/folders/new"
            className="flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-md transition-all hover:shadow-lg"
          >
            <PlusIcon className="w-5 h-5" />
            Create Folder
          </Link>
        </div>

        {/* Folders Grid */}
        {folders.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-dashed border-emerald-200 p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <FolderIcon className="w-8 h-8" />
            </div>
            <div className="text-lg font-bold text-emerald-950 mb-2">No folders yet</div>
            <div className="text-sm text-emerald-700/60 mb-6">
              Create your first folder to organize and share documents
            </div>
            <Link
              href="/folders/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-md transition-all"
            >
              <PlusIcon className="w-4 h-4" />
              Create Your First Folder
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {folders.map((folder) => (
              <Link
                key={folder.id}
                href={`/folders/${folder.slug}`}
                className="bg-white rounded-2xl border border-emerald-100 p-8 text-left transition-all hover:border-emerald-300 hover:shadow-lg group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <FolderIcon className="w-7 h-7" />
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-emerald-300 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
                </div>
                <h2 className="text-xl font-bold text-emerald-950 mb-2">{folder.name}</h2>
                {folder.description && (
                  <p className="text-sm text-emerald-700/70 mb-4 line-clamp-2">{folder.description}</p>
                )}
                <div className="pt-4 border-t border-emerald-50 flex items-center gap-2 text-xs text-emerald-700/60">
                  <span>📅</span>
                  <span>{new Date(folder.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
