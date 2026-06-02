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

    const { data: folder } = await supabase
      .from('folders').select('id').eq('id', id).eq('created_by', user.id).single()

    if (!folder) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    const { error } = await supabase.from('folders').delete().eq('id', id)
    if (error) return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (error) {
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

    const { name } = await request.json()
    if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const { data: folder } = await supabase
      .from('folders').select('id').eq('id', id).eq('created_by', user.id).single()

    if (!folder) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    const { error } = await supabase.from('folders').update({ name: name.trim() }).eq('id', id)
    if (error) return NextResponse.json({ error: 'Failed to rename folder' }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}