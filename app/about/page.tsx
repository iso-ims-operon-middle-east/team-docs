'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Page = {
  id: string
  title: string
  slug: string
  description: string | null
  created_at: string
}

export default function ProtectedPagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch('/api/protected-pages')
        const data = await response.json()
        setPages(data.pages || [])
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPages()
  }, [])

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">🔐 Protected Documents</h1>

      {pages.length === 0 ? (
        <p className="text-gray-600">No documents available.</p>
      ) : (
        <div className="grid gap-4">
          {pages.map((page) => (
            <Link
              key={page.id}
              href={`/protected-pages/${page.slug}`}
              className="block p-6 border rounded-lg hover:shadow-lg transition"
            >
              <h2 className="font-bold text-lg">{page.title}</h2>
              {page.description && (
                <p className="text-gray-600 text-sm mt-2">{page.description}</p>
              )}
              <p className="text-gray-500 text-xs mt-4">
                {new Date(page.created_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}