'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const ArrowLeftIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
)

const FolderIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)

const FileIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
  </svg>
)

const DownloadIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const UploadIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

const TrashIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
  </svg>
)

const LinkIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)

type Folder = {
  id: string
  name: string
  slug: string
  description: string | null
  created_by: string
  created_at: string
}

type File = {
  id: string
  file_name: string
  file_size: number
  file_type: string
  file_path: string
  created_at: string
}

export default function FolderPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [folder, setFolder] = useState<Folder | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const loadingCanvasRef = useRef<HTMLCanvasElement>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!slug) return
    fetchFolderAndFiles()
  }, [slug])

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

  const fetchFolderAndFiles = async () => {
    try {
      const response = await fetch(`/api/folders/${slug}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Folder not found')
        return
      }

      setFolder(data.folder)
      setFiles(data.files || [])
    } catch (err) {
      setError('Failed to load folder')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (uploadedFiles: FileList) => {
    if (!folder || !uploadedFiles.length) return
    setUploading(true)
    setError('')
    try {
      for (const file of Array.from(uploadedFiles)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folderId', folder.id)
        const response = await fetch('/api/folders/upload', {
          method: 'POST',
          body: formData,
        })
        if (!response.ok) {
          const data = await response.json()
          setError(data.error || 'Upload failed')
          break
        }
      }
      await fetchFolderAndFiles()
    } catch (err) {
      setError('Something went wrong during upload')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Delete this file?')) return
    try {
      const response = await fetch(`/api/folders/files/${fileId}`, { method: 'DELETE' })
      if (!response.ok) { setError('Failed to delete file'); return }
      await fetchFolderAndFiles()
    } catch (err) {
      setError('Failed to delete file')
      console.error(err)
    }
  }

  const handleDownload = async (file: File) => {
    try {
      const { data, error } = await supabase.storage
        .from('folders')
        .createSignedUrl(file.file_path, 3600)
      if (error) throw error
      if (data?.signedUrl) window.open(data.signedUrl, '_blank')
    } catch (err) {
      setError('Failed to download file')
      console.error(err)
    }
  }

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
            <span>Loading folder</span>
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

  if (!folder) {
    return (
      <div className="min-h-screen bg-emerald-50/40 p-8 text-center">
        <div className="text-emerald-950">Folder not found</div>
        <Link href="/folders" className="text-emerald-700 hover:text-emerald-900 mt-4 inline-block">
          Back to Folders
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-emerald-50/40" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-6xl mx-auto p-8">
        <Link href="/folders" className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 mb-8 transition">
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Folders
        </Link>

        <div className="flex items-start gap-6 mb-10">
          <div className="w-20 h-20 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <FolderIcon className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-emerald-950 mb-2">{folder.name}</h1>
            {folder.description && (
              <p className="text-sm text-emerald-700/70 mb-4">{folder.description}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-emerald-700/60">
              <span>📁 {files.length} {files.length === 1 ? 'file' : 'files'}</span>
              <span>📅 Created {new Date(folder.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <Link
            href={`/folders/${folder.slug}/share`}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-md transition-all text-sm"
          >
            <LinkIcon className="w-4 h-4" />
            Share
          </Link>
        </div>

        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all mb-10 ${
            dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-200 bg-white/50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); handleUpload(e.dataTransfer.files) }}
        >
          <input type="file" id="file-upload" multiple disabled={uploading} onChange={(e) => handleUpload(e.target.files!)} className="hidden" />
          <label htmlFor="file-upload" className="cursor-pointer block">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <UploadIcon className="w-8 h-8" />
            </div>
            <div className="text-lg font-bold text-emerald-950 mb-1">
              {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
            </div>
            <div className="text-sm text-emerald-700/60">Drag and drop files or click to browse</div>
          </label>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-lg mb-8">{error}</div>
        )}

        <div>
          <div className="text-sm font-bold text-emerald-950 mb-4">Files in this folder</div>
          {files.length === 0 ? (
            <div className="bg-white/80 rounded-2xl border border-emerald-100 p-12 text-center">
              <FileIcon className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
              <div className="text-sm text-emerald-700/60">No files yet. Upload some files above.</div>
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div key={file.id} className="bg-white rounded-xl border border-emerald-100 p-4 flex items-center justify-between hover:border-emerald-300 hover:shadow-md transition">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-emerald-950 truncate">{file.file_name}</div>
                      <div className="text-xs text-emerald-700/60">
                        {(file.file_size / 1024 / 1024).toFixed(2)} MB • {new Date(file.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleDownload(file)} className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition" title="Download">
                      <DownloadIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteFile(file.id)} className="p-2 text-rose-700 hover:bg-rose-50 rounded-lg transition" title="Delete">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
