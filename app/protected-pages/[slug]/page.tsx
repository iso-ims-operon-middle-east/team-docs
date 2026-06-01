'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

type PageDetail = {
  id: string
  title: string
  slug: string
  content: string
  created_at: string
  created_by: string
}

export default function PageDetailPage({ params }: { params: { slug: string } }) {
  const [page, setPage] = useState<PageDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: { user: authUser } } = await supabase.auth.getUser()
        setUser(authUser)

        // Get page
        const { data, error: fetchError } = await supabase
          .from('protected_pages')
          .select('*')
          .eq('slug', params.slug)
          .single()

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError('Document not found or access denied')
          } else {
            setError('Error loading document')
          }
          return
        }

        setPage(data)
      } catch (err) {
        setError('An error occurred')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.slug, supabase])

  if (loading) return <div className="p-8">Loading...</div>

  if (error)
    return (
      <div className="p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/protected-pages" className="text-blue-600 hover:underline">
          Back to documents
        </Link>
      </div>
    )

  if (!page) return <div className="p-8">Document not found</div>

  const isCreator = user && user.id === page.created_by

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Back & Share Buttons */}
      <div className="flex gap-4 mb-6">
        <Link href="/protected-pages" className="text-blue-600 hover:underline font-bold">
          ← Back to documents
        </Link>
        
        {isCreator && (
          <Link 
            href={`/protected-pages/${page.slug}/share`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
          >
            🔗 Share with Users
          </Link>
        )}
      </div>

      {/* Content */}
      <article>
        <h1 className="text-4xl font-bold mb-2">{page.title}</h1>
        <p className="text-gray-600 text-sm mb-8">
          {new Date(page.created_at).toLocaleDateString()}
        </p>

        <div className="prose prose-sm max-w-none whitespace-pre-wrap bg-gray-50 p-6 rounded border">
          {page.content}
        </div>

        {isCreator && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-900">
              📝 You're the owner of this page. Click "🔗 Share with Users" to grant access to others.
            </p>
          </div>
        )}
      </article>
    </div>
  )
}