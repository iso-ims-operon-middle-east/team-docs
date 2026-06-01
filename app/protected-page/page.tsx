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
        
        if (data.pages) {
          setPages(data.pages)
        }
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">🔐 Protected Documents</h1>
        <Link 
          href="/protected-pages/new"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
        >
          + Create New Page
        </Link>
      </div>

      {pages.length === 0 ? (
        <p className="text-gray-600">No documents available. Create your first one!</p>
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
