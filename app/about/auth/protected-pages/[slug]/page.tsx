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
}

export default function PageDetailPage({ params }: { params: { slug: string } }) {
  const [page, setPage] = useState<PageDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchPage = async () => {
      try {
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
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [params.slug])

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

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Link href="/protected-pages" className="text-blue-600 hover:underline mb-6 block">
        ← Back to documents
      </Link>

      <article>
        <h1 className="text-4xl font-bold mb-2">{page.title}</h1>
        <p className="text-gray-600 text-sm mb-8">
          {new Date(page.created_at).toLocaleDateString()}
        </p>

        <div className="prose prose-sm max-w-none whitespace-pre-wrap">
          {page.content}
        </div>
      </article>
    </div>
  )
}