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

    // Get folder by slug
    const { data: folder } = await supabase
      .from('folders')
      .select('id, name, slug, created_by')
      .eq('slug', id)
      .single()

    if (!folder) return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
    if (folder.created_by !== user.id) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    // Get all access entries with user emails via admin
    const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const { data: accessRows } = await supabase
      .from('folder_access')
      .select('id, user_id, access_level')
      .eq('folder_id', folder.id)

    const { data: allUsers } = await adminSupabase.auth.admin.listUsers()

    const sharedWith = (accessRows || []).map(row => {
      const u = allUsers?.users.find(u => u.id === row.user_id)
      return { id: row.id, user_id: row.user_id, email: u?.email || 'Unknown', access_level: row.access_level }
    })

    return NextResponse.json({ success: true, folder, sharedWith })

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

    // Get folder by slug
    const { data: folder } = await supabase
      .from('folders')
      .select('id, name')
      .eq('slug', id)
      .eq('created_by', user.id)
      .single()

    if (!folder) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const { data: users } = await adminSupabase.auth.admin.listUsers()
    const targetUser = users?.users.find(u => u.email?.toLowerCase() === email.toLowerCase())

    if (!targetUser) {
      // Invite new user via Supabase magic link
      const { error: inviteError } = await adminSupabase.auth.admin.inviteUserByEmail(email, {
        data: { invited_to_folder: folder.name },
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/folders/${id}`,
      })
      if (inviteError) return NextResponse.json({ error: 'Failed to invite user: ' + inviteError.message }, { status: 500 })

      // Get newly created user
      const { data: updatedUsers } = await adminSupabase.auth.admin.listUsers()
      const newUser = updatedUsers?.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
      if (!newUser) return NextResponse.json({ error: 'Invitation sent but could not grant access yet' }, { status: 500 })

      await supabase.from('folder_access').upsert({
        folder_id: folder.id, user_id: newUser.id, access_level: access_level || 'view',
      }, { onConflict: 'folder_id,user_id' })

      return NextResponse.json({ success: true, message: 'Invitation sent to ' + email, invited: true })
    }

    // Existing user — grant access directly
    const { error: accessError } = await supabase.from('folder_access').upsert({
      folder_id: folder.id, user_id: targetUser.id, access_level: access_level || 'view',
    }, { onConflict: 'folder_id,user_id' })

    if (accessError) return NextResponse.json({ error: 'Failed to grant access' }, { status: 500 })

    return NextResponse.json({ success: true, message: 'Access granted to ' + email, invited: false })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSideClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const accessId = searchParams.get('access_id')
    if (!accessId) return NextResponse.json({ error: 'Access ID required' }, { status: 400 })

    // Verify folder ownership
    const { data: folder } = await supabase
      .from('folders')
      .select('id')
      .eq('slug', id)
      .eq('created_by', user.id)
      .single()

    if (!folder) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    const { error } = await supabase.from('folder_access').delete().eq('id', accessId)
    if (error) return NextResponse.json({ error: 'Failed to revoke access' }, { status: 500 })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSideClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { access_id, access_level } = await request.json()
    if (!access_id || !access_level) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const { data: folder } = await supabase
      .from('folders')
      .select('id')
      .eq('slug', id)
      .eq('created_by', user.id)
      .single()

    if (!folder) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    const { error } = await supabase.from('folder_access').update({ access_level }).eq('id', access_id)
    if (error) return NextResponse.json({ error: 'Failed to update access' }, { status: 500 })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}