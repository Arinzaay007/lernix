import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Cascade delete — RLS policies ensure user can only delete their own data.
  // courses → lessons and chat_messages cascade automatically via FK constraints.
  const { error: coursesError } = await supabase
    .from('courses')
    .delete()
    .eq('user_id', user.id)

  if (coursesError) {
    return NextResponse.json({ error: 'Failed to delete courses' }, { status: 500 })
  }

  // Delete the auth user — requires service role key
  const adminClient = await import('@supabase/supabase-js').then(({ createClient: c }) =>
    c(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
  )

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)
  if (deleteError) {
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
