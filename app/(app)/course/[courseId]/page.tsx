import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CourseReaderShell } from './CourseReaderShell'
import { Course, Lesson } from '@/types'

interface Props {
  params: Promise<{ courseId: string; lessonId?: string }>
}

export default async function CourseReaderPage({ params }: Props) {
  const { courseId, lessonId } = await params
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

  // Fetch lessons ordered
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })

  if (lessonsError || !lessons?.length) notFound()

  // Resolve initial lesson
  const initialLesson = lessonId
    ? lessons.find(l => l.id === lessonId) ?? lessons[0]
    : lessons[0]

  return (
    <CourseReaderShell
      course={course as Course}
      lessons={lessons as Lesson[]}
      initialLessonId={initialLesson.id}
    />
  )
}
