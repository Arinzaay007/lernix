import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface AddLessonAction {
  type: 'add_lesson'
  lesson: {
    order_index: number
    title: string
    description: string
    content_md: string
  }
}

interface UpdateLessonAction {
  type: 'update_lesson'
  lesson: {
    order_index: number
    title: string
    content_md: string
  }
}

type CourseAction = AddLessonAction | UpdateLessonAction

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { courseId, action }: { courseId: string; action: CourseAction } = await req.json()

  // Verify course ownership
  const { data: course } = await supabase
    .from('courses')
    .select('id')
    .eq('id', courseId)
    .eq('user_id', user.id)
    .single()

  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

  if (action.type === 'add_lesson') {
    // Shift existing lessons if needed to make room
    const { data: existing } = await supabase
      .from('lessons')
      .select('id, order_index')
      .eq('course_id', courseId)
      .gte('order_index', action.lesson.order_index)

    if (existing && existing.length > 0) {
      for (const l of existing) {
        await supabase
          .from('lessons')
          .update({ order_index: l.order_index + 1 })
          .eq('id', l.id)
      }
    }

    const { data: newLesson, error } = await supabase
      .from('lessons')
      .insert({
        course_id: courseId,
        order_index: action.lesson.order_index,
        title: action.lesson.title,
        content_md: action.lesson.content_md,
        is_generated: true,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Update course outline_json
    const { data: allLessons } = await supabase
      .from('lessons')
      .select('order_index, title')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true })

    await supabase
      .from('courses')
      .update({
        outline_json: (allLessons ?? []).map(l => ({
          order_index: l.order_index,
          title: l.title,
        })),
        updated_at: new Date().toISOString(),
      })
      .eq('id', courseId)

    return NextResponse.json({ ok: true, lesson: newLesson })
  }

  if (action.type === 'update_lesson') {
    const { error } = await supabase
      .from('lessons')
      .update({
        content_md: action.lesson.content_md,
        title: action.lesson.title,
      })
      .eq('course_id', courseId)
      .eq('order_index', action.lesson.order_index)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase
      .from('courses')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', courseId)

    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action type' }, { status: 400 })
}
