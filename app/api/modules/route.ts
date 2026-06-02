import { createServerSideClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServerSideClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: modules, error } = await supabase
      .from('modules')
      .select('id, name, slug, icon, type, description, created_by, created_at')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 })
    }

    return NextResponse.json({ success: true, modules: modules || [] })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSideClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, slug, icon, type, description } = await request.json()
    if (!name || !slug) return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })

    const { data: module, error } = await supabase
      .from('modules')
      .insert({ name, slug, icon: icon || 'folder', type: type || 'files', description, created_by: user.id })
      .select('id, name, slug, icon, type')
      .single()

    if (error) {
      if (error.code === '23505') return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create module' }, { status: 500 })
    }

    return NextResponse.json({ success: true, module })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}