import { createServerSideClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSideClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Fetch folder by slug
    const { data: folder, error: folderError } = await supabase
      .from('folders')
      .select('id, name, slug, description, created_by, created_at, parent_id')
      .eq('slug', id)
      .single()

    if (folderError || !folder) return NextResponse.json({ error: 'Folder not found' }, { status: 404 })

    // Check access
    const isOwner = folder.created_by === user.id
    if (!isOwner) {
      const { data: access } = await supabase
        .from('folder_access').select('id')
        .eq('folder_id', folder.id).eq('user_id', user.id).single()
      if (!access) return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Fetch subfolders, files, and parent all in parallel
    const [subfoldersResult, filesResult, parentResult] = await Promise.all([
      supabase
        .from('folders')
        .select('id, name, slug, description, created_at')
        .eq('parent_id', folder.id)
        .order('created_at', { ascending: true }),
      supabase
        .from('folder_files')
        .select('id, file_name, file_size, file_type, file_path, created_at')
        .eq('folder_id', folder.id)
        .order('created_at', { ascending: false }),
      folder.parent_id
        ? supabase.from('folders').select('id, name, slug').eq('id', folder.parent_id).single()
        : Promise.resolve({ data: null }),
    ])

    return NextResponse.json({
      success: true,
      folder,
      subfolders: subfoldersResult.data || [],
      files: filesResult.data || [],
      parent: parentResult.data || null,
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSideClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { email, access_level } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const { data: folder } = await supabase
      .from('folders').select('id, name').eq('slug', id).eq('created_by', user.id).single()
    if (!folder) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const { data: users } = await adminSupabase.auth.admin.listUsers()
    const targetUser = users?.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { error: accessError } = await supabase.from('folder_access').upsert({
      folder_id: folder.id, user_id: targetUser.id, access_level: access_level || 'view',
    }, { onConflict: 'folder_id,user_id' })

    if (accessError) return NextResponse.json({ error: 'Failed to grant access' }, { status: 500 })
    return NextResponse.json({ success: true, message: 'Folder shared successfully' })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}