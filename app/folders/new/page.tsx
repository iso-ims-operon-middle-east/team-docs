'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

const AlertIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

export default function CreateFolderPage() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    setSlug(generateSlug(newName))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError('Folder name is required')
      return
    }

    if (!slug.trim()) {
      setError('URL slug is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create folder')
        return
      }

      router.push(`/folders/${slug}`)
    } catch (err) {
      setError('Something went wrong')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-emerald-50/40" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-2xl mx-auto p-8">
        {/* Back Button */}
        <Link href="/folders" className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 mb-8 transition">
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Folders
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="text-xs font-mono text-emerald-700/70 mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            NEW FOLDER
          </div>
          <h1 className="text-4xl font-bold text-emerald-950 mb-2">Create a New Folder</h1>
          <p className="text-sm text-emerald-700/70">
            Create a folder to organize and share your documents
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-emerald-100 p-8">
          <form onSubmit={handleCreate} className="space-y-6">
            {/* Folder Name */}
            <div>
              <label className="block text-sm font-bold text-emerald-950 mb-2">
                Folder Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g., Company Policies"
                disabled={loading}
                className="w-full px-4 py-3 border border-emerald-200 rounded-lg text-emerald-950 placeholder:text-emerald-700/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition disabled:opacity-50"
              />
              <p className="text-xs text-emerald-700/60 mt-1">This is what people see in the list</p>
            </div>

            {/* URL Slug */}
            <div>
              <label className="block text-sm font-bold text-emerald-950 mb-2">
                URL Slug <span className="text-rose-600">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-emerald-700/70">/folders/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="company-policies"
                  disabled={loading}
                  className="flex-1 px-4 py-3 border border-emerald-200 rounded-lg text-emerald-950 placeholder:text-emerald-700/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition disabled:opacity-50"
                />
              </div>
              <p className="text-xs text-emerald-700/60 mt-1">Auto-generated from folder name. Only lowercase letters, numbers, and hyphens.</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-emerald-950 mb-2">
                Description <span className="text-emerald-700/60 font-normal">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this folder..."
                disabled={loading}
                rows={4}
                className="w-full px-4 py-3 border border-emerald-200 rounded-lg text-emerald-950 placeholder:text-emerald-700/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition disabled:opacity-50 resize-none"
              />
              <p className="text-xs text-emerald-700/60 mt-1">Shown in the folders list</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-lg">
                <AlertIcon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-rose-900">{error}</div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-6 border-t border-emerald-100">
              <Link
                href="/folders"
                className="flex-1 px-6 py-3 text-center text-emerald-800 hover:bg-emerald-50 rounded-lg font-bold transition disabled:opacity-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="flex-1 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FolderIcon className="w-4 h-4" />
                    Create Folder
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
