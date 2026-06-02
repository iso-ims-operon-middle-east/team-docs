import { createServerSideClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSideClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: access, error: accessError } = await supabase
      .from('folder_access')
      .select('folder_id')
      .eq('id', id)
      .single()

    if (accessError || !access) return NextResponse.json({ error: 'Access record not found' }, { status: 404 })

    const { data: folder } = await supabase
      .from('folders')
      .select('id')
      .eq('id', access.folder_id)
      .eq('created_by', user.id)
      .single()

    if (!folder) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    const { error: deleteError } = await supabase
      .from('folder_access')
      .delete()
      .eq('id', id)

    if (deleteError) return NextResponse.json({ error: 'Failed to revoke access' }, { status: 500 })

    return NextResponse.json({ success: true, message: 'Access revoked successfully' })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}