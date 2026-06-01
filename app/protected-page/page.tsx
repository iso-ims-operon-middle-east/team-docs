'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewPagePage() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    setSlug(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('You must be logged in to create a page')
        return
      }

      if (!title.trim()) {
        setError('Title is required')
        setLoading(false)
        return
      }

      if (!slug.trim()) {
        setError('Slug is required')
        setLoading(false)
        return
      }

      if (!content.trim()) {
        setError('Content is required')
        setLoading(false)
        return
      }

      // Check if slug already exists
      const { data: existing } = await supabase
        .from('protected_pages')
        .select('id')
        .eq('slug', slug)
        .single()

      if (existing) {
        setError('This slug already exists. Please use a different one.')
        setLoading(false)
        return
      }

      // Create the page
      const { data, error: insertError } = await supabase
        .from('protected_pages')
        .insert({
          title: title.trim(),
          slug: slug.trim(),
          description: description.trim(),
          content: content.trim(),
          created_by: user.id,
          is_published: true,
        })
        .select()
        .single()

      if (insertError) throw insertError

      setSuccess(true)
      
      // Reset form
      setTitle('')
      setSlug('')
      setDescription('')
      setContent('')

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/protected-pages/${slug}`)
      }, 2000)

    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message || 'Failed to create page. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-8">
        <Link href="/protected-pages" className="text-blue-600 hover:underline mb-6 block">
          ← Back to Pages
        </Link>

        <h1 className="text-3xl font-bold mb-2">Create New Private Page</h1>
        <p className="text-gray-600 mb-8">
          Create a page that only you can see. You can share it with specific users later.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            ✅ Page created! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Page Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Company Policies"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
              disabled={loading}
              required
            />
            <p className="text-gray-500 text-sm mt-1">This is what people see in the list</p>
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              URL Slug *
            </label>
            <input
              type="text"
              value={slug}
              onChange={handleSlugChange}
              placeholder="e.g., company-policies"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
              disabled={loading}
              required
            />
            <p className="text-gray-500 text-sm mt-1">
              URL will be: /protected-pages/{slug || 'your-slug'}
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this page"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
              disabled={loading}
            />
            <p className="text-gray-500 text-sm mt-1">Shows in the pages list</p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your page content here..."
              rows={12}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 font-mono text-sm"
              disabled={loading}
              required
            />
            <p className="text-gray-500 text-sm mt-1">
              This is what people see when they open your page
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
          >
            {loading ? 'Creating...' : '✅ Create Private Page'}
          </button>

          <p className="text-gray-600 text-sm text-center">
            🔒 Only you can see this page. You can share it with others later.
          </p>
        </form>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3">💡 Tips</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• <strong>Slug:</strong> Keep it lowercase and use hyphens (e.g., quarterly-report)</li>
            <li>• <strong>Content:</strong> You can paste text, markdown, or formatted content</li>
            <li>• <strong>Privacy:</strong> After creation, you can share with specific users</li>
            <li>• <strong>Edit:</strong> You can edit this page anytime</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
