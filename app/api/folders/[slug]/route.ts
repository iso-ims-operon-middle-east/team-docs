import { createServerSideClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = await createServerSideClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: folder, error: folderError } = await supabase
      .from('folders')
      .select('id, name, slug, description, created_at, created_by')
      .eq('slug', params.slug)
      .single()

    if (folderError || !folder) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      )
    }

    const isOwner = folder.created_by === user.id
    if (!isOwner) {
      const { data: access } = await supabase
        .from('folder_access')
        .select('id')
        .eq('folder_id', folder.id)
        .eq('user_id', user.id)
        .single()

      if (!access) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }
    }

    const { data: files, error: filesError } = await supabase
      .from('folder_files')
      .select('id, file_name, file_size, file_type, file_path, created_at')
      .eq('folder_id', folder.id)
      .order('created_at', { ascending: false })

    if (filesError) {
      console.error('Files error:', filesError)
    }

    let accesses: any[] = []
    if (isOwner) {
      const { data: accessData } = await supabase
        .from('folder_access')
        .select('id, user_id, access_level')
        .eq('folder_id', folder.id)

      if (accessData) {
        accesses = accessData
      }
    }

    return NextResponse.json({
      success: true,
      folder,
      files: files || [],
      accesses,
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}