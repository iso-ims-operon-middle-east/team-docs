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
const EyeIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
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
const PencilIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

type Folder = { id: string; name: string; slug: string; description: string | null; created_by: string; created_at: string; parent_id: string | null }
type SubFolder = { id: string; name: string; slug: string; description: string | null; created_at: string }
type ParentFolder = { id: string; name: string; slug: string }
type FileItem = { id: string; file_name: string; file_size: number; file_type: string; file_path: string; created_at: string }

const getFileCategory = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  if (ext === 'pdf') return 'pdf'
  if (['doc', 'docx'].includes(ext)) return 'word'
  if (['xls', 'xlsx'].includes(ext)) return 'excel'
  if (['ppt', 'pptx'].includes(ext)) return 'powerpoint'
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image'
  return 'other'
}
const getFileIcon = (name: string) => {
  const cat = getFileCategory(name)
  if (cat === 'pdf') return '📄'
  if (cat === 'word') return '📝'
  if (cat === 'excel') return '📊'
  if (cat === 'powerpoint') return '📑'
  if (cat === 'image') return '🖼️'
  return '📁'
}
const generateSlug = (text: string) =>
  text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/(^-|-$)/g, '')

export default function FolderPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [folder, setFolder] = useState<Folder | null>(null)
  const [subfolders, setSubfolders] = useState<SubFolder[]>([])
  const [parentFolder, setParentFolder] = useState<ParentFolder | null>(null)
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')

  // New subfolder
  const [showNewSubfolder, setShowNewSubfolder] = useState(false)
  const [subfolderName, setSubfolderName] = useState('')
  const [subfolderSlug, setSubfolderSlug] = useState('')
  const [subfolderDesc, setSubfolderDesc] = useState('')
  const [creatingSubfolder, setCreatingSubfolder] = useState(false)
  const [subfolderError, setSubfolderError] = useState('')

  // Delete subfolder
  const [deletingSubfolder, setDeletingSubfolder] = useState<SubFolder | null>(null)
  const [deletingSubfolderBusy, setDeletingSubfolderBusy] = useState(false)

  // Rename subfolder
  const [renamingSubfolder, setRenamingSubfolder] = useState<SubFolder | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [renamingBusy, setRenamingBusy] = useState(false)
  const [renameError, setRenameError] = useState('')

  // Viewer
  const [viewerUrl, setViewerUrl] = useState<string | null>(null)
  const [viewerFile, setViewerFile] = useState<FileItem | null>(null)
  const [viewerLoading, setViewerLoading] = useState(false)

  const loadingCanvasRef = useRef<HTMLCanvasElement>(null)
  const supabase = createClient()

  useEffect(() => { if (!slug) return; fetchFolderAndFiles() }, [slug])

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

  const fetchFolderAndFiles = async () => {
    try {
      const response = await fetch(`/api/folders/${slug}`)
      const data = await response.json()
      if (!response.ok) { setError(data.error || 'Folder not found'); return }
      setFolder(data.folder)
      setSubfolders(data.subfolders || [])
      setFiles(data.files || [])
      setParentFolder(data.parent || null)
    } catch (err) { setError('Failed to load folder'); console.error(err) }
    finally { setLoading(false) }
  }

  const handleCreateSubfolder = async () => {
    if (!folder || !subfolderName.trim() || !subfolderSlug.trim()) { setSubfolderError('Name and slug are required'); return }
    setCreatingSubfolder(true); setSubfolderError('')
    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: subfolderName.trim(), slug: subfolderSlug.trim(), description: subfolderDesc.trim() || null, parent_id: folder.id }),
      })
      const data = await response.json()
      if (!response.ok) { setSubfolderError(data.error || 'Failed to create subfolder'); setCreatingSubfolder(false); return }
      setShowNewSubfolder(false); setSubfolderName(''); setSubfolderSlug(''); setSubfolderDesc('')
      await fetchFolderAndFiles()
    } catch (err) { setSubfolderError('Something went wrong'); console.error(err) }
    finally { setCreatingSubfolder(false) }
  }

  const handleDeleteSubfolder = async () => {
    if (!deletingSubfolder) return
    setDeletingSubfolderBusy(true)
    try {
      const response = await fetch(`/api/folders/${deletingSubfolder.id}/manage`, { method: 'DELETE' })
      if (!response.ok) { setError('Failed to delete subfolder'); setDeletingSubfolderBusy(false); return }
      setDeletingSubfolder(null)
      await fetchFolderAndFiles()
    } catch (err) { setError('Something went wrong'); console.error(err) }
    finally { setDeletingSubfolderBusy(false) }
  }

  const handleRenameSubfolder = async () => {
    if (!renamingSubfolder || !renameValue.trim()) return
    setRenamingBusy(true); setRenameError('')
    try {
      const response = await fetch(`/api/folders/${renamingSubfolder.id}/manage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: renameValue.trim() }),
      })
      const data = await response.json()
      if (!response.ok) { setRenameError(data.error || 'Failed to rename'); setRenamingBusy(false); return }
      setRenamingSubfolder(null); setRenameValue('')
      await fetchFolderAndFiles()
    } catch (err) { setRenameError('Something went wrong'); console.error(err) }
    finally { setRenamingBusy(false) }
  }

  const handleUpload = async (uploadedFiles: FileList) => {
    if (!folder || !uploadedFiles.length) return
    setUploading(true); setError('')
    try {
      for (const file of Array.from(uploadedFiles)) {
        const formData = new FormData()
        formData.append('file', file); formData.append('folderId', folder.id)
        const response = await fetch('/api/folders/upload', { method: 'POST', body: formData })
        if (!response.ok) { const data = await response.json(); setError(data.error || 'Upload failed'); break }
      }
      await fetchFolderAndFiles()
    } catch (err) { setError('Something went wrong during upload'); console.error(err) }
    finally { setUploading(false) }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Delete this file?')) return
    try {
      const response = await fetch(`/api/folders/files/${fileId}`, { method: 'DELETE' })
      if (!response.ok) { setError('Failed to delete file'); return }
      await fetchFolderAndFiles()
    } catch (err) { setError('Failed to delete file'); console.error(err) }
  }

  const handleView = async (file: FileItem) => {
    setViewerLoading(true); setViewerFile(file); setViewerUrl(null)
    try {
      const cat = getFileCategory(file.file_name)
      if (cat === 'pdf' || cat === 'image') {
        const { data, error } = await supabase.storage.from('folders').download(file.file_path)
        if (error) throw error
        const mimeType = cat === 'pdf' ? 'application/pdf' : data.type
        const blob = new Blob([data], { type: mimeType })
        setViewerUrl(URL.createObjectURL(blob))
      } else if (['word', 'excel', 'powerpoint'].includes(cat)) {
        const { data, error } = await supabase.storage.from('folders').createSignedUrl(file.file_path, 3600)
        if (error) throw error
        window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(data.signedUrl)}`, '_blank')
        setViewerFile(null)
      } else {
        const { data, error } = await supabase.storage.from('folders').createSignedUrl(file.file_path, 3600)
        if (error) throw error
        window.open(data.signedUrl, '_blank')
        setViewerFile(null)
      }
    } catch (err) { setError('Failed to open file'); setViewerFile(null); console.error(err) }
    finally { setViewerLoading(false) }
  }

  const closeViewer = () => {
    if (viewerUrl) URL.revokeObjectURL(viewerUrl)
    setViewerUrl(null); setViewerFile(null)
  }

  const handleDownload = async (file: FileItem) => {
    try {
      const { data, error } = await supabase.storage.from('folders').download(file.file_path)
      if (error) throw error
      const blobUrl = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = blobUrl; a.download = file.file_name
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000)
    } catch (err) { setError('Failed to download file'); console.error(err) }
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
            <span>Loading folder</span>
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

  if (error && !folder) {
    return (
      <div className="min-h-screen bg-emerald-50/40 p-8 text-center">
        <div className="text-emerald-950 mb-4">{error}</div>
        <Link href="/folders" className="text-emerald-700 hover:text-emerald-900">Back to Folders</Link>
      </div>
    )
  }

  if (!folder) {
    return (
      <div className="min-h-screen bg-emerald-50/40 p-8 text-center">
        <div className="text-emerald-950 mb-4">Folder not found</div>
        <Link href="/folders" className="text-emerald-700 hover:text-emerald-900">Back to Folders</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-emerald-50/40" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-6xl mx-auto p-8">
        <input type="file" id="file-upload" multiple disabled={uploading} onChange={(e) => handleUpload(e.target.files!)} className="hidden" />

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-emerald-700 mb-6 flex-wrap">
          <Link href="/folders" className="hover:text-emerald-900 transition">Folders</Link>
          {parentFolder && (<><span className="text-emerald-400">/</span><Link href={`/folders/${parentFolder.slug}`} className="hover:text-emerald-900 transition">{parentFolder.name}</Link></>)}
          <span className="text-emerald-400">/</span>
          <span className="text-emerald-950 font-medium">{folder.name}</span>
        </div>

        {/* Back */}
        {parentFolder ? (
          <Link href={`/folders/${parentFolder.slug}`} className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 mb-8 transition">
            <ArrowLeftIcon className="w-4 h-4" />Back to {parentFolder.name}
          </Link>
        ) : (
          <Link href="/folders" className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 mb-8 transition">
            <ArrowLeftIcon className="w-4 h-4" />Back to Folders
          </Link>
        )}

        {/* Header */}
        <div className="flex items-start gap-6 mb-10">
          <div className="w-20 h-20 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <FolderIcon className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-emerald-950 mb-2">{folder.name}</h1>
            {folder.description && <p className="text-sm text-emerald-700/70 mb-4">{folder.description}</p>}
            <div className="flex items-center gap-4 text-xs text-emerald-700/60">
              <span>📁 {subfolders.length} {subfolders.length === 1 ? 'subfolder' : 'subfolders'}</span>
              <span>📄 {files.length} {files.length === 1 ? 'file' : 'files'}</span>
              <span>📅 Created {new Date(folder.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <Link href={`/folders/${folder.slug}/share`} className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-md transition-all text-sm">
            <LinkIcon className="w-4 h-4" />Share
          </Link>
        </div>

        {/* Subfolders */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-bold text-emerald-950">Subfolders</div>
            <div className="flex items-center gap-2">
              <label htmlFor="file-upload" className={`flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-medium rounded-lg transition cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <UploadIcon className="w-4 h-4" />{uploading ? 'Uploading…' : 'Upload File'}
              </label>
              <button type="button" onClick={() => { setShowNewSubfolder(true); setSubfolderError('') }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-lg transition">
                <PlusIcon className="w-4 h-4" />New Subfolder
              </button>
            </div>
          </div>

          {subfolders.length === 0 ? (
            <div className="bg-white/60 rounded-xl border border-dashed border-emerald-200 p-6 text-center text-sm text-emerald-700/60">
              No subfolders yet — click "New Subfolder" to create one
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subfolders.map((sub) => (
                <div key={sub.id} className="relative bg-white rounded-xl border border-emerald-100 p-5 hover:border-emerald-300 hover:shadow-md transition group">
                  {/* Action buttons */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button"
                      onClick={(e) => { e.preventDefault(); setRenamingSubfolder(sub); setRenameValue(sub.name); setRenameError('') }}
                      className="p-1.5 rounded-md bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 transition shadow-sm" title="Rename">
                      <PencilIcon className="w-3.5 h-3.5" />
                    </button>
                    <button type="button"
                      onClick={(e) => { e.preventDefault(); setDeletingSubfolder(sub) }}
                      className="p-1.5 rounded-md bg-white border border-emerald-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition shadow-sm" title="Delete">
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <Link href={`/folders/${sub.slug}`} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <FolderIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-emerald-950 truncate pr-14">{sub.name}</div>
                      {sub.description && <div className="text-xs text-emerald-700/60 truncate">{sub.description}</div>}
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-emerald-300 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-lg mb-6">{error}</div>}

        {/* Files */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragActive(false) }}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); handleUpload(e.dataTransfer.files) }}
          className={`rounded-2xl transition-all ${dragActive ? 'ring-2 ring-emerald-400 ring-offset-2 bg-emerald-50/60' : ''}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              Files
              {dragActive && <span className="text-xs text-emerald-600 font-normal animate-pulse">↓ Drop files here to upload</span>}
              {uploading && <span className="text-xs text-emerald-600 font-normal animate-pulse">Uploading…</span>}
            </div>
          </div>

          {files.length === 0 ? (
            <div className={`bg-white/80 rounded-2xl border-2 border-dashed p-12 text-center transition-all ${dragActive ? 'border-emerald-400 bg-emerald-50' : 'border-emerald-100'}`}>
              <FileIcon className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
              <div className="text-sm font-medium text-emerald-700/70 mb-1">No files yet</div>
              <div className="text-xs text-emerald-700/50">Drag and drop files here or use the Upload File button above</div>
            </div>
          ) : (
            <div className={`space-y-2 rounded-xl p-2 transition-all ${dragActive ? 'border-2 border-dashed border-emerald-400 bg-emerald-50' : ''}`}>
              {files.map((file) => (
                <div key={file.id} className="bg-white rounded-xl border border-emerald-100 p-4 flex items-center justify-between hover:border-emerald-300 hover:shadow-md transition">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 text-xl">{getFileIcon(file.file_name)}</div>
                    <button onClick={() => handleView(file)} disabled={viewerLoading && viewerFile?.id === file.id} className="min-w-0 flex-1 text-left group/name">
                      <div className="font-bold text-emerald-950 group-hover/name:text-emerald-700 truncate underline-offset-2 group-hover/name:underline transition">{file.file_name}</div>
                      <div className="text-xs text-emerald-700/60 flex items-center gap-2">
                        <span>{(file.file_size / 1024 / 1024).toFixed(2)} MB • {new Date(file.created_at).toLocaleDateString()}</span>
                        {['word', 'excel', 'powerpoint'].includes(getFileCategory(file.file_name)) && (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-medium">Office Online</span>
                        )}
                      </div>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleView(file)} disabled={viewerLoading && viewerFile?.id === file.id} className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition disabled:opacity-50" title="View">
                      {viewerLoading && viewerFile?.id === file.id ? <div className="w-5 h-5 border-2 border-emerald-300 border-t-emerald-700 rounded-full animate-spin" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
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

      {/* New Subfolder Modal */}
      {showNewSubfolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-emerald-100">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-emerald-950">New Subfolder</h3>
                <p className="text-sm text-emerald-700/70">Inside <span className="font-medium text-emerald-950">{folder.name}</span></p>
              </div>
              <button type="button" onClick={() => { setShowNewSubfolder(false); setSubfolderError('') }} className="p-1.5 rounded-md text-emerald-700 hover:bg-emerald-50 transition">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">Folder Name <span className="text-rose-600">*</span></label>
                <input type="text" value={subfolderName} onChange={(e) => { setSubfolderName(e.target.value); setSubfolderSlug(generateSlug(e.target.value)) }} placeholder="e.g. Q1 Reports" autoFocus
                  className="w-full px-3 py-2.5 border border-emerald-200 rounded-lg text-sm text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">URL Slug <span className="text-rose-600">*</span></label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-emerald-700/70">/folders/</span>
                  <input type="text" value={subfolderSlug} onChange={(e) => setSubfolderSlug(e.target.value)} placeholder="q1-reports"
                    className="flex-1 px-3 py-2.5 border border-emerald-200 rounded-lg text-sm text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">Description <span className="font-normal text-emerald-700/60 normal-case">(optional)</span></label>
                <input type="text" value={subfolderDesc} onChange={(e) => setSubfolderDesc(e.target.value)} placeholder="Brief description..."
                  className="w-full px-3 py-2.5 border border-emerald-200 rounded-lg text-sm text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition" />
              </div>
              {subfolderError && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3">{subfolderError}</div>}
            </div>
            <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-emerald-100">
              <button type="button" onClick={() => { setShowNewSubfolder(false); setSubfolderError('') }} disabled={creatingSubfolder} className="px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 rounded-lg transition disabled:opacity-50">Cancel</button>
              <button type="button" onClick={handleCreateSubfolder} disabled={creatingSubfolder || !subfolderName.trim()} className="px-4 py-2 text-sm font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                {creatingSubfolder ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating…</> : <><PlusIcon className="w-4 h-4" />Create</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Subfolder Modal */}
      {deletingSubfolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-emerald-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0"><TrashIcon className="w-5 h-5" /></div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-emerald-950 mb-1">Delete subfolder?</h3>
                <p className="text-sm text-emerald-700/80">This will permanently delete <span className="font-medium text-emerald-950">{deletingSubfolder.name}</span> and all its files. This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button type="button" onClick={() => setDeletingSubfolder(null)} disabled={deletingSubfolderBusy} className="px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 rounded-lg transition disabled:opacity-50">Cancel</button>
              <button type="button" onClick={handleDeleteSubfolder} disabled={deletingSubfolderBusy} className="px-4 py-2 text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                {deletingSubfolderBusy ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Deleting…</> : <><TrashIcon className="w-4 h-4" />Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Subfolder Modal */}
      {renamingSubfolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-emerald-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-emerald-950">Rename subfolder</h3>
                <p className="text-sm text-emerald-700/70 mt-0.5">New name for <span className="font-medium text-emerald-950">{renamingSubfolder.name}</span></p>
              </div>
              <button type="button" onClick={() => { setRenamingSubfolder(null); setRenameValue('') }} className="p-1.5 rounded-md text-emerald-700 hover:bg-emerald-50 transition">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <input type="text" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleRenameSubfolder()}
              disabled={renamingBusy} autoFocus
              className="w-full px-3 py-2.5 border border-emerald-200 rounded-lg text-sm text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition mb-4" />
            {renameError && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3 mb-4">{renameError}</div>}
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => { setRenamingSubfolder(null); setRenameValue('') }} disabled={renamingBusy} className="px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 rounded-lg transition disabled:opacity-50">Cancel</button>
              <button type="button" onClick={handleRenameSubfolder} disabled={renamingBusy || !renameValue.trim()} className="px-4 py-2 text-sm font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                {renamingBusy ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Renaming…</> : <><PencilIcon className="w-4 h-4" />Rename</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Viewer Modal */}
      {viewerFile && viewerUrl && (
        <div className="fixed inset-0 z-50 flex flex-col bg-emerald-950/95 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-3 bg-emerald-900 border-b border-emerald-800 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xl">{getFileIcon(viewerFile.file_name)}</span>
              <span className="text-white font-medium text-sm truncate max-w-xs md:max-w-lg">{viewerFile.file_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleDownload(viewerFile)} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-sm rounded-lg transition">
                <DownloadIcon className="w-4 h-4" />Download
              </button>
              <button onClick={closeViewer} className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800 rounded-lg transition">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden bg-gray-100">
            {getFileCategory(viewerFile.file_name) === 'image' ? (
              <div className="w-full h-full flex items-center justify-center p-8 bg-emerald-950">
                <img src={viewerUrl} alt={viewerFile.file_name} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
              </div>
            ) : (
              <iframe src={viewerUrl} className="w-full h-full border-0" title={viewerFile.file_name} style={{ background: '#fff' }} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
