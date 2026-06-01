import { createServerSideClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
 
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSideClient()
 
    const { data: { user } } = await supabase.auth.getUser()
 
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
 
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folderId = formData.get('folderId') as string
 
    if (!file || !folderId) {
      return NextResponse.json(
        { error: 'File and folder ID are required' },
        { status: 400 }
      )
    }
 
    const { data: folder, error: folderError } = await supabase
      .from('folders')
      .select('id')
      .eq('id', folderId)
      .eq('created_by', user.id)
      .single()
 
    if (folderError || !folder) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
 
    const fileName = `${Date.now()}-${file.name}`
    const filePath = `${folderId}/${fileName}`
 
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
 
    const { error: uploadError } = await supabase.storage
      .from('folders')
      .upload(filePath, buffer, {
        cacheControl: '3600',
        upsert: false,
      })
 
    if (uploadError) {
      console.error('Storage error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }
 
    const { error: dbError } = await supabase
      .from('folder_files')
      .insert({
        folder_id: folderId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        file_path: filePath,
        uploaded_by: user.id,
      })
 
    if (dbError) {
      console.error('Database error:', dbError)
      await supabase.storage.from('folders').remove([filePath])
      return NextResponse.json(
        { error: 'Failed to save file' },
        { status: 500 }
      )
    }
 
    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
    })
 
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}