import { createServerSideClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSideClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, icon, description } = await request.json()
    if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const { data: mod } = await supabase.from('modules').select('id').eq('id', id).eq('created_by', user.id).single()
    if (!mod) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    const { error } = await supabase.from('modules').update({ name: name.trim(), icon, description }).eq('id', id)
    if (error) return NextResponse.json({ error: 'Failed to update module' }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (error) {
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

    const { data: mod } = await supabase.from('modules').select('id').eq('id', id).eq('created_by', user.id).single()
    if (!mod) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    const { error } = await supabase.from('modules').delete().eq('id', id)
    if (error) return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (error) {
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

    const { email, can_edit } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const { data: mod } = await supabase.from('modules').select('id').eq('id', id).eq('created_by', user.id).single()
    if (!mod) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const { data: users } = await adminSupabase.auth.admin.listUsers()
    const targetUser = users?.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { error } = await supabase.from('module_access').upsert({
      module_id: id, user_id: targetUser.id, can_edit: can_edit || false
    }, { onConflict: 'module_id,user_id' })

    if (error) return NextResponse.json({ error: 'Failed to grant access' }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}