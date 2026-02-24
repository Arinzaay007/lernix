import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CourseChatShell } from '@/components/chat/CourseChatShell'
import { Course, Lesson, UIMessage } from '@/types'

interface Props {
  params: Promise<{ courseId: string }>
}

export default async function CourseChatPage({ params }: Props) {
  const { courseId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch course
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .eq('user_id', user.id)
    .single()

  if (courseError || !course) notFound()

  // Fetch lessons
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })

  // Fetch chat history for this course
  const { data: chatMessages } = await supabase
    .from('chat_messages')
    .select('role, content')
    .eq('course_id', courseId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(100)

  const initialMessages: UIMessage[] = (chatMessages ?? []).map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }))

  return (
    <CourseChatShell
      course={course as Course}
      lessons={(lessons ?? []) as Lesson[]}
      initialMessages={initialMessages}
    />
  )
}
