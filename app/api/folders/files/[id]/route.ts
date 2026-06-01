import { createServerSideClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
 
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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
 
    const { data: file, error: fileError } = await supabase
      .from('folder_files')
      .select('id, file_path, folder_id')
      .eq('id', params.id)
      .single()
 
    if (fileError || !file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }
 
    const { data: folder } = await supabase
      .from('folders')
      .select('id')
      .eq('id', file.folder_id)
      .eq('created_by', user.id)
      .single()
 
    if (!folder) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
 
    const { error: storageError } = await supabase.storage
      .from('folders')
      .remove([file.file_path])
 
    if (storageError) {
      console.error('Storage error:', storageError)
    }
 
    const { error: dbError } = await supabase
      .from('folder_files')
      .delete()
      .eq('id', params.id)
 
    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to delete file' },
        { status: 500 }
      )
    }
 
    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    })
 
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}