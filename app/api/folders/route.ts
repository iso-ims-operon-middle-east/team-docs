import { createServerSideClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
 
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSideClient()
 
    const { data: { user } } = await supabase.auth.getUser()
 
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
 
    const { data: folders, error } = await supabase
      .from('folders')
      .select('id, name, slug, description, created_at')
      .or(`created_by.eq.${user.id},id.in.(select folder_id from folder_access where user_id = ${user.id})`)
      .order('created_at', { ascending: false })
 
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch folders' },
        { status: 500 }
      )
    }
 
    return NextResponse.json({
      success: true,
      folders: folders || [],
    })
 
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
 
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
 
    const { name, slug, description } = await request.json()
 
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }
 
    const { data: folder, error } = await supabase
      .from('folders')
      .insert({
        name,
        slug,
        description,
        created_by: user.id,
      })
      .select('id, name, slug')
      .single()
 
    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        )
      }
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create folder' },
        { status: 500 }
      )
    }
 
    return NextResponse.json({
      success: true,
      folder,
    })
 
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}