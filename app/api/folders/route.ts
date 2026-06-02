import { createServerSideClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSideClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parent_id')

    // Get folders owned by user
    let ownedQuery = supabase
      .from('folders')
      .select('id, name, slug, description, created_at, parent_id')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false })

    if (parentId) {
      ownedQuery = ownedQuery.eq('parent_id', parentId)
    } else {
      ownedQuery = ownedQuery.is('parent_id', null)
    }

    const { data: ownedFolders, error: ownedError } = await ownedQuery

    if (ownedError) {
      console.error('Supabase error:', ownedError)
      return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 })
    }

    // Get folders shared with user (only top-level for now)
    let sharedFolders: any[] = []
    if (!parentId) {
      const { data: accessRows } = await supabase
        .from('folder_access')
        .select('folder_id')
        .eq('user_id', user.id)

      if (accessRows && accessRows.length > 0) {
        const sharedIds = accessRows.map(r => r.folder_id)
        const { data: shared } = await supabase
          .from('folders')
          .select('id, name, slug, description, created_at, parent_id')
          .in('id', sharedIds)
          .is('parent_id', null)
          .order('created_at', { ascending: false })
        sharedFolders = shared || []
      }
    }

    // Merge and deduplicate
    const allFolders = [...(ownedFolders || []), ...sharedFolders]
    const seen = new Set()
    const folders = allFolders.filter(f => {
      if (seen.has(f.id)) return false
      seen.add(f.id); return true
    })

    return NextResponse.json({ success: true, folders })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSideClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, slug, description, parent_id } = await request.json()
    if (!name || !slug) return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })

    const { data: folder, error } = await supabase
      .from('folders')
      .insert({ name, slug, description, created_by: user.id, parent_id: parent_id || null })
      .select('id, name, slug, parent_id')
      .single()

    if (error) {
      if (error.code === '23505') return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 })
    }

    return NextResponse.json({ success: true, folder })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}