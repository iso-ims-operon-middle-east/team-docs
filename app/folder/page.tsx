'use client'

import { useEffect, useState } from 'react'
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

  if (loading) {
    return <div className="p-8 text-center text-emerald-950">Loading folders...</div>
  }

  return (
    <div className="min-h-screen bg-emerald-50/40" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-6xl mx-auto p-8">
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
