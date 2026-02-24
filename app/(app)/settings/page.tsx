import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AccountSettingsShell } from './AccountSettingsShell'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch course count for stats
  const { count: courseCount } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <AccountSettingsShell
      email={user.email ?? ''}
      userId={user.id}
      createdAt={user.created_at}
      courseCount={courseCount ?? 0}
    />
  )
}
