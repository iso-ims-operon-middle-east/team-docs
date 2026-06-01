'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type AccessLevel = 'view' | 'edit' | 'admin'

interface User {
  id: string
  email: string
}

interface SharedUser {
  id: string
  email: string
  access_level: AccessLevel
}

export default function SharePagePage({ params }: { params: { slug: string } }) {
  const [page, setPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<AccessLevel>('view')
  const [sharingLoading, setSharingLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }

        // Get the page
        const { data: pageData, error: pageError } = await supabase
          .from('protected_pages')
          .select('*')
          .eq('slug', params.slug)
          .single()

        if (pageError) throw pageError
        
        if (pageData.created_by !== user.id) {
          setError('You can only share pages you created')
          return
        }

        setPage(pageData)

        // Get all users from auth
        const { data: { users: authUsers = [] } } = await supabase.auth.admin.listUsers()
        
        // Format users with email
        const formattedUsers: User[] = authUsers
          .filter(u => u.email) // Only users with email
          .map(u => ({
            id: u.id,
            email: u.email || ''
          }))
        
        setAllUsers(formattedUsers)

        // Get shared users for this page
        const { data: accessData, error: accessError } = await supabase
          .from('page_access')
          .select(`
            page_id,
            user_id,
            access_level
          `)
          .eq('page_id', pageData.id)

        if (accessError) throw accessError

        // Format shared users - get emails from auth users
        const formatted: SharedUser[] = (accessData || [])
          .map(item => {
            const authUser = authUsers.find(u => u.id === item.user_id)
            return {
              id: item.user_id,
              email: authUser?.email || 'Unknown User',
              access_level: item.access_level as AccessLevel
            }
          })
          .filter(u => u.email !== 'Unknown User') // Only show users we found

        setSharedUsers(formatted)

      } catch (err: any) {
        console.error('Error:', err)
        setError(err.message || 'Failed to load page')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.slug, supabase, router])

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!selectedUserId) {
      setError('Please select a user')
      return
    }

    setSharingLoading(true)

    try {
      // Insert access
      const { error: insertError } = await supabase
        .from('page_access')
        .upsert({
          page_id: page.id,
          user_id: selectedUserId,
          access_level: selectedAccessLevel,
        })

      if (insertError) throw insertError

      // Get the user's email
      const selectedUser = allUsers.find(u => u.id === selectedUserId)

      // Refresh shared users
      const { data: accessData } = await supabase
        .from('page_access')
        .select(`
          page_id,
          user_id,
          access_level
        `)
        .eq('page_id', page.id)

      // Format the response
      const { data: { users: authUsers = [] } } = await supabase.auth.admin.listUsers()
      
      const formatted: SharedUser[] = (accessData || [])
        .map(item => {
          const authUser = authUsers.find(u => u.id === item.user_id)
          return {
            id: item.user_id,
            email: authUser?.email || 'Unknown User',
            access_level: item.access_level as AccessLevel
          }
        })
        .filter(u => u.email !== 'Unknown User')

      setSharedUsers(formatted)
      setSuccess(`✅ Shared with ${selectedUser?.email || 'user'}`)
      setSelectedUserId('')

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)

    } catch (err: any) {
      setError(err.message || 'Failed to share page')
    } finally {
      setSharingLoading(false)
    }
  }

  const handleRevokeAccess = async (userId: string) => {
    if (!window.confirm('Remove access for this user?')) return

    try {
      const { error: deleteError } = await supabase
        .from('page_access')
        .delete()
        .eq('page_id', page.id)
        .eq('user_id', userId)

      if (deleteError) throw deleteError

      setSharedUsers(sharedUsers.filter(u => u.id !== userId))
      setSuccess('✅ Access removed')
      setTimeout(() => setSuccess(''), 3000)

    } catch (err: any) {
      setError(err.message || 'Failed to revoke access')
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (error && !page) {
    return (
      <div className="p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/protected-pages" className="text-blue-600 hover:underline">
          Back to pages
        </Link>
      </div>
    )
  }

  // Get available users (not already shared with)
  const availableUsers = allUsers.filter(
    u => !sharedUsers.find(s => s.id === u.id)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-8">
        <Link href={`/protected-pages/${params.slug}`} className="text-blue-600 hover:underline mb-6 block">
          ← Back to Page
        </Link>

        <h1 className="text-3xl font-bold mb-2">Share: {page?.title}</h1>
        <p className="text-gray-600 mb-8">Manage who can access this page</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* Share Form */}
        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Share with Users</h2>
          
          <form onSubmit={handleShare} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Select User
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">-- Choose a user --</option>
                {availableUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Permission Level
              </label>
              <select
                value={selectedAccessLevel}
                onChange={(e) => setSelectedAccessLevel(e.target.value as AccessLevel)}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
              >
                <option value="view">👁️ View Only (Read-only)</option>
                <option value="edit">✏️ Edit (Can modify content)</option>
                <option value="admin">⚙️ Admin (Full control)</option>
              </select>
              <p className="text-gray-500 text-sm mt-2">
                {selectedAccessLevel === 'view' && "User can only read the page"}
                {selectedAccessLevel === 'edit' && "User can edit content but not permissions"}
                {selectedAccessLevel === 'admin' && "User has full control"}
              </p>
            </div>

            <button
              type="submit"
              disabled={!selectedUserId || sharingLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 rounded transition"
            >
              {sharingLoading ? 'Sharing...' : '✅ Share'}
            </button>
          </form>
        </div>

        {/* Current Access */}
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Current Access ({sharedUsers.length})</h2>
          
          {sharedUsers.length === 0 ? (
            <p className="text-gray-600">No one has access yet. Share with users above.</p>
          ) : (
            <div className="space-y-3">
              {sharedUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between border border-gray-200 p-4 rounded">
                  <div>
                    <p className="font-medium text-gray-900">{user.email}</p>
                    <p className="text-sm text-gray-600">
                      {user.access_level === 'view' && '👁️ View Only'}
                      {user.access_level === 'edit' && '✏️ Can Edit'}
                      {user.access_level === 'admin' && '⚙️ Admin'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRevokeAccess(user.id)}
                    className="text-red-600 hover:text-red-800 font-bold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
