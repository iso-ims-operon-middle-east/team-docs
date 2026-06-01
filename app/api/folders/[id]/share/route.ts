import { createServerSideClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
 
export async function POST(
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
 
    const { email, access_level } = await request.json()
 
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }
 
    const { data: folder } = await supabase
      .from('folders')
      .select('id')
      .eq('id', params.id)
      .eq('created_by', user.id)
      .single()
 
    if (!folder) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
 
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
 
    const { data: users, error: usersError } = await adminSupabase.auth.admin.listUsers()
 
    if (usersError) {
      console.error('Error listing users:', usersError)
      return NextResponse.json(
        { error: 'Failed to find user' },
        { status: 500 }
      )
    }
 
    const targetUser = users?.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
 
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
 
    const { error: accessError } = await supabase
      .from('folder_access')
      .upsert({
        folder_id: params.id,
        user_id: targetUser.id,
        access_level: access_level || 'view',
      }, {
        onConflict: 'folder_id,user_id',
      })
 
    if (accessError) {
      console.error('Access error:', accessError)
      return NextResponse.json(
        { error: 'Failed to grant access' },
        { status: 500 }
      )
    }
 
    return NextResponse.json({
      success: true,
      message: 'Folder shared successfully',
    })
 
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}